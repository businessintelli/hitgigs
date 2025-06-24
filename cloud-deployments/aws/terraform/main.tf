# AWS Infrastructure for HotGigs.ai
# Terraform configuration for complete AWS deployment

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.10"
    }
  }

  backend "s3" {
    bucket         = "hotgigs-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "hotgigs-terraform-locks"
  }
}

# Configure AWS Provider
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "HotGigs.ai"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "DevOps"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Local values
locals {
  cluster_name = "hotgigs-${var.environment}"
  
  common_tags = {
    Project     = "HotGigs.ai"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  vpc_cidr = "10.0.0.0/16"
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)
}

# VPC Configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${local.cluster_name}-vpc"
  cidr = local.vpc_cidr

  azs             = local.azs
  private_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 4, k)]
  public_subnets  = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 48)]
  intra_subnets   = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 52)]

  enable_nat_gateway   = true
  single_nat_gateway   = var.environment == "staging"
  enable_dns_hostnames = true
  enable_dns_support   = true

  # Kubernetes tags
  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }

  tags = local.common_tags
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = local.cluster_name
  cluster_version = "1.27"

  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true

  # EKS Managed Node Groups
  eks_managed_node_groups = {
    main = {
      name = "main"

      instance_types = var.environment == "production" ? ["m5.large", "m5.xlarge"] : ["t3.medium"]

      min_size     = var.environment == "production" ? 3 : 1
      max_size     = var.environment == "production" ? 10 : 3
      desired_size = var.environment == "production" ? 3 : 2

      ami_type                   = "AL2_x86_64"
      capacity_type             = "ON_DEMAND"
      disk_size                 = 50
      force_update_version      = false
      use_custom_launch_template = false

      update_config = {
        max_unavailable_percentage = 33
      }

      labels = {
        Environment = var.environment
        NodeGroup   = "main"
      }

      tags = local.common_tags
    }
  }

  # aws-auth configmap
  manage_aws_auth_configmap = true

  aws_auth_roles = [
    {
      rolearn  = module.eks_admins_iam_role.iam_role_arn
      username = "eks-admin"
      groups   = ["system:masters"]
    },
  ]

  tags = local.common_tags
}

# IAM role for EKS admins
module "eks_admins_iam_role" {
  source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.0"

  role_name = "${local.cluster_name}-eks-admin"

  attach_admin_policy = true

  oidc_providers = {
    ex = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:aws-load-balancer-controller"]
    }
  }

  tags = local.common_tags
}

# RDS PostgreSQL Database
resource "aws_db_subnet_group" "hotgigs" {
  name       = "${local.cluster_name}-db-subnet-group"
  subnet_ids = module.vpc.intra_subnets

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-db-subnet-group"
  })
}

resource "aws_security_group" "rds" {
  name_prefix = "${local.cluster_name}-rds-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [local.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-rds-sg"
  })
}

resource "aws_db_instance" "hotgigs" {
  identifier = "${local.cluster_name}-postgres"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.environment == "production" ? "db.r6g.large" : "db.t3.micro"

  allocated_storage     = var.environment == "production" ? 100 : 20
  max_allocated_storage = var.environment == "production" ? 1000 : 100
  storage_encrypted     = true

  db_name  = "hotgigs"
  username = "hotgigs"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.hotgigs.name

  backup_retention_period = var.environment == "production" ? 7 : 1
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = var.environment != "production"
  deletion_protection = var.environment == "production"

  performance_insights_enabled = var.environment == "production"
  monitoring_interval         = var.environment == "production" ? 60 : 0

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-postgres"
  })
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "hotgigs" {
  name       = "${local.cluster_name}-cache-subnet"
  subnet_ids = module.vpc.intra_subnets

  tags = local.common_tags
}

resource "aws_security_group" "redis" {
  name_prefix = "${local.cluster_name}-redis-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [local.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-redis-sg"
  })
}

resource "aws_elasticache_replication_group" "hotgigs" {
  replication_group_id       = "${local.cluster_name}-redis"
  description                = "Redis cluster for HotGigs.ai"

  node_type            = var.environment == "production" ? "cache.r6g.large" : "cache.t3.micro"
  port                 = 6379
  parameter_group_name = "default.redis7"

  num_cache_clusters = var.environment == "production" ? 3 : 1

  subnet_group_name  = aws_elasticache_subnet_group.hotgigs.name
  security_group_ids = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  automatic_failover_enabled = var.environment == "production"
  multi_az_enabled          = var.environment == "production"

  tags = local.common_tags
}

# S3 Bucket for file uploads
resource "aws_s3_bucket" "uploads" {
  bucket = "${local.cluster_name}-uploads-${random_string.bucket_suffix.result}"

  tags = local.common_tags
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Application Load Balancer
resource "aws_security_group" "alb" {
  name_prefix = "${local.cluster_name}-alb-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-alb-sg"
  })
}

# ECR Repository
resource "aws_ecr_repository" "hotgigs_backend" {
  name                 = "hotgigs/backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}

resource "aws_ecr_lifecycle_policy" "hotgigs_backend" {
  repository = aws_ecr_repository.hotgigs_backend.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 30 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 30
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# Route53 Hosted Zone (if managing DNS)
resource "aws_route53_zone" "hotgigs" {
  count = var.manage_dns ? 1 : 0
  name  = var.domain_name

  tags = local.common_tags
}

# ACM Certificate
resource "aws_acm_certificate" "hotgigs" {
  count           = var.manage_dns ? 1 : 0
  domain_name     = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "*.${var.domain_name}"
  ]

  lifecycle {
    create_before_destroy = true
  }

  tags = local.common_tags
}

resource "aws_route53_record" "hotgigs_validation" {
  count   = var.manage_dns ? length(aws_acm_certificate.hotgigs[0].domain_validation_options) : 0
  zone_id = aws_route53_zone.hotgigs[0].zone_id
  name    = tolist(aws_acm_certificate.hotgigs[0].domain_validation_options)[count.index].resource_record_name
  type    = tolist(aws_acm_certificate.hotgigs[0].domain_validation_options)[count.index].resource_record_type
  records = [tolist(aws_acm_certificate.hotgigs[0].domain_validation_options)[count.index].resource_record_value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "hotgigs" {
  count           = var.manage_dns ? 1 : 0
  certificate_arn = aws_acm_certificate.hotgigs[0].arn
  validation_record_fqdns = aws_route53_record.hotgigs_validation[*].fqdn
}

