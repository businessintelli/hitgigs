# Outputs for AWS Infrastructure

# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnets
}

# EKS Outputs
output "cluster_id" {
  description = "EKS cluster ID"
  value       = module.eks.cluster_id
}

output "cluster_arn" {
  description = "EKS cluster ARN"
  value       = module.eks.cluster_arn
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

output "cluster_iam_role_name" {
  description = "IAM role name associated with EKS cluster"
  value       = module.eks.cluster_iam_role_name
}

output "cluster_iam_role_arn" {
  description = "IAM role ARN associated with EKS cluster"
  value       = module.eks.cluster_iam_role_arn
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = module.eks.cluster_certificate_authority_data
}

output "cluster_primary_security_group_id" {
  description = "The cluster primary security group ID created by the EKS cluster"
  value       = module.eks.cluster_primary_security_group_id
}

output "oidc_provider_arn" {
  description = "The ARN of the OIDC Provider if enabled"
  value       = module.eks.oidc_provider_arn
}

# Database Outputs
output "db_instance_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.hotgigs.endpoint
  sensitive   = true
}

output "db_instance_name" {
  description = "RDS instance name"
  value       = aws_db_instance.hotgigs.db_name
}

output "db_instance_username" {
  description = "RDS instance root username"
  value       = aws_db_instance.hotgigs.username
  sensitive   = true
}

output "db_instance_port" {
  description = "RDS instance port"
  value       = aws_db_instance.hotgigs.port
}

output "db_subnet_group_name" {
  description = "RDS subnet group name"
  value       = aws_db_instance.hotgigs.db_subnet_group_name
}

output "db_parameter_group_name" {
  description = "RDS parameter group name"
  value       = aws_db_instance.hotgigs.parameter_group_name
}

# Redis Outputs
output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = aws_elasticache_replication_group.hotgigs.primary_endpoint_address
  sensitive   = true
}

output "redis_port" {
  description = "Redis cluster port"
  value       = aws_elasticache_replication_group.hotgigs.port
}

output "redis_auth_token" {
  description = "Redis auth token"
  value       = aws_elasticache_replication_group.hotgigs.auth_token
  sensitive   = true
}

# S3 Outputs
output "s3_bucket_name" {
  description = "Name of the S3 bucket for uploads"
  value       = aws_s3_bucket.uploads.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket for uploads"
  value       = aws_s3_bucket.uploads.arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = aws_s3_bucket.uploads.bucket_domain_name
}

# ECR Outputs
output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.hotgigs_backend.repository_url
}

output "ecr_repository_arn" {
  description = "ARN of the ECR repository"
  value       = aws_ecr_repository.hotgigs_backend.arn
}

# DNS Outputs
output "route53_zone_id" {
  description = "Route53 zone ID"
  value       = var.manage_dns ? aws_route53_zone.hotgigs[0].zone_id : null
}

output "route53_zone_name_servers" {
  description = "Route53 zone name servers"
  value       = var.manage_dns ? aws_route53_zone.hotgigs[0].name_servers : null
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN"
  value       = var.manage_dns ? aws_acm_certificate.hotgigs[0].arn : null
}

# Security Group Outputs
output "alb_security_group_id" {
  description = "ALB security group ID"
  value       = aws_security_group.alb.id
}

output "rds_security_group_id" {
  description = "RDS security group ID"
  value       = aws_security_group.rds.id
}

output "redis_security_group_id" {
  description = "Redis security group ID"
  value       = aws_security_group.redis.id
}

# Application Configuration
output "database_url" {
  description = "Database connection URL"
  value       = "postgresql://${aws_db_instance.hotgigs.username}:${var.db_password}@${aws_db_instance.hotgigs.endpoint}/${aws_db_instance.hotgigs.db_name}"
  sensitive   = true
}

output "redis_url" {
  description = "Redis connection URL"
  value       = "redis://${aws_elasticache_replication_group.hotgigs.primary_endpoint_address}:${aws_elasticache_replication_group.hotgigs.port}"
  sensitive   = true
}

# Kubectl Configuration
output "kubectl_config" {
  description = "kubectl config as generated by the module"
  value = templatefile("${path.module}/kubeconfig.tpl", {
    cluster_name     = module.eks.cluster_id
    cluster_endpoint = module.eks.cluster_endpoint
    cluster_ca       = module.eks.cluster_certificate_authority_data
    aws_region       = var.aws_region
  })
  sensitive = true
}

# Environment Configuration
output "environment_config" {
  description = "Environment configuration for application deployment"
  value = {
    cluster_name    = local.cluster_name
    aws_region      = var.aws_region
    environment     = var.environment
    database_url    = "postgresql://${aws_db_instance.hotgigs.username}:${var.db_password}@${aws_db_instance.hotgigs.endpoint}/${aws_db_instance.hotgigs.db_name}"
    redis_url       = "redis://${aws_elasticache_replication_group.hotgigs.primary_endpoint_address}:${aws_elasticache_replication_group.hotgigs.port}"
    s3_bucket       = aws_s3_bucket.uploads.bucket
    ecr_repository  = aws_ecr_repository.hotgigs_backend.repository_url
    domain_name     = var.domain_name
  }
  sensitive = true
}

