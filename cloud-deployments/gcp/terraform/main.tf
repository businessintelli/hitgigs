# GCP Infrastructure for HotGigs.ai
# Terraform configuration for complete GCP deployment

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
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

  backend "gcs" {
    bucket = "hotgigs-terraform-state"
    prefix = "infrastructure/terraform.tfstate"
  }
}

# Configure GCP Provider
provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
  zone    = var.gcp_zone
}

# Local values
locals {
  cluster_name = "hotgigs-${var.environment}"
  
  common_labels = {
    project     = "hotgigs-ai"
    environment = var.environment
    managed-by  = "terraform"
    owner       = "devops"
  }
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "container.googleapis.com",
    "compute.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "storage.googleapis.com",
    "dns.googleapis.com",
    "certificatemanager.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "secretmanager.googleapis.com"
  ])

  service = each.value
  project = var.gcp_project_id

  disable_on_destroy = false
}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "${local.cluster_name}-vpc"
  auto_create_subnetworks = false
  project                 = var.gcp_project_id

  depends_on = [google_project_service.required_apis]
}

# Subnets
resource "google_compute_subnetwork" "gke" {
  name          = "${local.cluster_name}-gke-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.gcp_region
  network       = google_compute_network.main.id
  project       = var.gcp_project_id

  secondary_ip_range {
    range_name    = "gke-pods"
    ip_cidr_range = "10.1.0.0/16"
  }

  secondary_ip_range {
    range_name    = "gke-services"
    ip_cidr_range = "10.2.0.0/16"
  }
}

resource "google_compute_subnetwork" "database" {
  name          = "${local.cluster_name}-db-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = var.gcp_region
  network       = google_compute_network.main.id
  project       = var.gcp_project_id
}

# Firewall Rules
resource "google_compute_firewall" "allow_internal" {
  name    = "${local.cluster_name}-allow-internal"
  network = google_compute_network.main.name
  project = var.gcp_project_id

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = ["10.0.0.0/8"]
}

resource "google_compute_firewall" "allow_http_https" {
  name    = "${local.cluster_name}-allow-http-https"
  network = google_compute_network.main.name
  project = var.gcp_project_id

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server", "https-server"]
}

# GKE Cluster
resource "google_container_cluster" "main" {
  name     = local.cluster_name
  location = var.gcp_region
  project  = var.gcp_project_id

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.main.id
  subnetwork = google_compute_subnetwork.gke.id

  # Enable network policy
  network_policy {
    enabled = true
  }

  # Enable IP aliasing
  ip_allocation_policy {
    cluster_secondary_range_name  = "gke-pods"
    services_secondary_range_name = "gke-services"
  }

  # Enable workload identity
  workload_identity_config {
    workload_pool = "${var.gcp_project_id}.svc.id.goog"
  }

  # Enable monitoring and logging
  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  logging_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  # Enable autopilot for production
  dynamic "cluster_autoscaling" {
    for_each = var.environment == "production" ? [1] : []
    content {
      enabled = true
      resource_limits {
        resource_type = "cpu"
        minimum       = 1
        maximum       = 100
      }
      resource_limits {
        resource_type = "memory"
        minimum       = 1
        maximum       = 1000
      }
    }
  }

  # Security settings
  master_auth {
    client_certificate_config {
      issue_client_certificate = false
    }
  }

  # Enable shielded nodes
  enable_shielded_nodes = true

  depends_on = [google_project_service.required_apis]
}

# GKE Node Pool
resource "google_container_node_pool" "main" {
  name       = "${local.cluster_name}-node-pool"
  location   = var.gcp_region
  cluster    = google_container_cluster.main.name
  project    = var.gcp_project_id

  node_count = var.environment == "production" ? 3 : 2

  autoscaling {
    min_node_count = var.environment == "production" ? 3 : 1
    max_node_count = var.environment == "production" ? 10 : 5
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  node_config {
    preemptible  = var.environment != "production"
    machine_type = var.environment == "production" ? "e2-standard-4" : "e2-medium"

    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    service_account = google_service_account.gke_nodes.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    labels = local.common_labels

    # Enable workload identity
    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    # Shielded instance config
    shielded_instance_config {
      enable_secure_boot          = true
      enable_integrity_monitoring = true
    }

    disk_size_gb = 50
    disk_type    = "pd-ssd"

    tags = ["gke-node", "${local.cluster_name}-gke"]
  }

  upgrade_settings {
    max_surge       = 1
    max_unavailable = 0
  }
}

# Service Account for GKE nodes
resource "google_service_account" "gke_nodes" {
  account_id   = "${local.cluster_name}-gke-nodes"
  display_name = "GKE Nodes Service Account"
  project      = var.gcp_project_id
}

resource "google_project_iam_member" "gke_nodes" {
  for_each = toset([
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/monitoring.viewer",
    "roles/stackdriver.resourceMetadata.writer",
    "roles/storage.objectViewer"
  ])

  role    = each.value
  member  = "serviceAccount:${google_service_account.gke_nodes.email}"
  project = var.gcp_project_id
}

# Cloud SQL PostgreSQL
resource "google_sql_database_instance" "main" {
  name             = "${local.cluster_name}-postgres"
  database_version = "POSTGRES_15"
  region           = var.gcp_region
  project          = var.gcp_project_id

  settings {
    tier = var.environment == "production" ? "db-standard-2" : "db-f1-micro"

    disk_type       = "PD_SSD"
    disk_size       = var.environment == "production" ? 100 : 20
    disk_autoresize = true

    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = var.environment == "production"
      backup_retention_settings {
        retained_backups = var.environment == "production" ? 30 : 7
      }
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
      require_ssl     = true
    }

    database_flags {
      name  = "log_checkpoints"
      value = "on"
    }

    database_flags {
      name  = "log_connections"
      value = "on"
    }

    database_flags {
      name  = "log_disconnections"
      value = "on"
    }

    database_flags {
      name  = "log_lock_waits"
      value = "on"
    }

    user_labels = local.common_labels
  }

  deletion_protection = var.environment == "production"

  depends_on = [google_service_networking_connection.private_vpc_connection]
}

resource "google_sql_database" "main" {
  name     = "hotgigs"
  instance = google_sql_database_instance.main.name
  project  = var.gcp_project_id
}

resource "google_sql_user" "main" {
  name     = "hotgigs"
  instance = google_sql_database_instance.main.name
  password = var.db_password
  project  = var.gcp_project_id
}

# Private VPC connection for Cloud SQL
resource "google_compute_global_address" "private_ip_address" {
  name          = "${local.cluster_name}-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.main.id
  project       = var.gcp_project_id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.main.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

# Redis (Memorystore)
resource "google_redis_instance" "main" {
  name           = "${local.cluster_name}-redis"
  tier           = var.environment == "production" ? "STANDARD_HA" : "BASIC"
  memory_size_gb = var.environment == "production" ? 4 : 1
  region         = var.gcp_region
  project        = var.gcp_project_id

  location_id             = var.gcp_zone
  alternative_location_id = var.environment == "production" ? "${var.gcp_region}-b" : null

  authorized_network = google_compute_network.main.id

  redis_version     = "REDIS_6_X"
  display_name      = "HotGigs Redis"
  reserved_ip_range = "10.0.2.0/29"

  labels = local.common_labels

  depends_on = [google_project_service.required_apis]
}

# Cloud Storage
resource "google_storage_bucket" "uploads" {
  name     = "${local.cluster_name}-uploads-${random_string.bucket_suffix.result}"
  location = var.gcp_region
  project  = var.gcp_project_id

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = var.environment == "production" ? 365 : 30
    }
    action {
      type = "Delete"
    }
  }

  lifecycle_rule {
    condition {
      age                   = 30
      with_state            = "NONCURRENT_VERSION"
      num_newer_versions    = 3
    }
    action {
      type = "Delete"
    }
  }

  labels = local.common_labels
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Container Registry
resource "google_container_registry" "main" {
  project  = var.gcp_project_id
  location = "US"
}

# IAM for Container Registry
resource "google_storage_bucket_iam_member" "registry" {
  bucket = google_container_registry.main.id
  role   = "roles/storage.admin"
  member = "serviceAccount:${google_service_account.gke_nodes.email}"
}

# Secret Manager
resource "google_secret_manager_secret" "db_password" {
  secret_id = "db-password"
  project   = var.gcp_project_id

  replication {
    automatic = true
  }

  labels = local.common_labels
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}

# DNS Zone (if managing DNS)
resource "google_dns_managed_zone" "main" {
  count       = var.manage_dns ? 1 : 0
  name        = "${replace(local.cluster_name, "-", "")}-zone"
  dns_name    = "${var.domain_name}."
  description = "DNS zone for HotGigs.ai"
  project     = var.gcp_project_id

  labels = local.common_labels
}

# SSL Certificate
resource "google_compute_managed_ssl_certificate" "main" {
  count   = var.manage_dns ? 1 : 0
  name    = "${local.cluster_name}-ssl-cert"
  project = var.gcp_project_id

  managed {
    domains = [var.domain_name, "*.${var.domain_name}"]
  }
}

# Global IP Address
resource "google_compute_global_address" "main" {
  name    = "${local.cluster_name}-global-ip"
  project = var.gcp_project_id
}

