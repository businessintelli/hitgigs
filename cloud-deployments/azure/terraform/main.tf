# Azure Infrastructure for HotGigs.ai
# Terraform configuration for complete Azure deployment

terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
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

  backend "azurerm" {
    resource_group_name  = "hotgigs-terraform-state"
    storage_account_name = "hotgigsterraformstate"
    container_name       = "tfstate"
    key                  = "infrastructure/terraform.tfstate"
  }
}

# Configure Azure Provider
provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_delete_on_destroy    = true
      recover_soft_deleted_key_vaults = true
    }
  }
}

# Data sources
data "azurerm_client_config" "current" {}

# Local values
locals {
  resource_group_name = "hotgigs-${var.environment}"
  location           = var.azure_location
  
  common_tags = {
    Project     = "HotGigs.ai"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = "DevOps"
  }

  cluster_name = "hotgigs-${var.environment}-aks"
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = local.resource_group_name
  location = local.location
  tags     = local.common_tags
}

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "${local.resource_group_name}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tags                = local.common_tags
}

# Subnets
resource "azurerm_subnet" "aks" {
  name                 = "aks-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "database" {
  name                 = "database-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
  
  delegation {
    name = "fs"
    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action",
      ]
    }
  }
}

resource "azurerm_subnet" "private_endpoints" {
  name                 = "private-endpoints-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.3.0/24"]
}

# Network Security Groups
resource "azurerm_network_security_group" "aks" {
  name                = "${local.resource_group_name}-aks-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  security_rule {
    name                       = "AllowHTTPS"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowHTTP"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = local.common_tags
}

resource "azurerm_subnet_network_security_group_association" "aks" {
  subnet_id                 = azurerm_subnet.aks.id
  network_security_group_id = azurerm_network_security_group.aks.id
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "${local.resource_group_name}-logs"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = var.environment == "production" ? 90 : 30
  tags                = local.common_tags
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = "${replace(local.resource_group_name, "-", "")}acr"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = var.environment == "production" ? "Premium" : "Standard"
  admin_enabled       = true

  dynamic "georeplications" {
    for_each = var.environment == "production" ? [1] : []
    content {
      location                = "East US"
      zone_redundancy_enabled = true
      tags                    = local.common_tags
    }
  }

  tags = local.common_tags
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "main" {
  name                = local.cluster_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "${local.resource_group_name}-aks"
  kubernetes_version  = var.kubernetes_version

  default_node_pool {
    name                = "default"
    node_count          = var.environment == "production" ? 3 : 2
    vm_size             = var.environment == "production" ? "Standard_D4s_v3" : "Standard_D2s_v3"
    vnet_subnet_id      = azurerm_subnet.aks.id
    enable_auto_scaling = true
    min_count          = var.environment == "production" ? 3 : 1
    max_count          = var.environment == "production" ? 10 : 5
    os_disk_size_gb    = 50
    type               = "VirtualMachineScaleSets"

    upgrade_settings {
      max_surge = "10%"
    }

    tags = local.common_tags
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    outbound_type     = "loadBalancer"
  }

  oms_agent {
    log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  }

  azure_policy_enabled = true

  http_application_routing_enabled = false

  key_vault_secrets_provider {
    secret_rotation_enabled = true
  }

  tags = local.common_tags
}

# Role Assignment for ACR
resource "azurerm_role_assignment" "aks_acr" {
  principal_id                     = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                           = azurerm_container_registry.main.id
  skip_service_principal_aad_check = true
}

# PostgreSQL Flexible Server
resource "azurerm_private_dns_zone" "postgres" {
  name                = "hotgigs.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.main.name
  tags                = local.common_tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "postgres" {
  name                  = "postgres-vnet-link"
  private_dns_zone_name = azurerm_private_dns_zone.postgres.name
  virtual_network_id    = azurerm_virtual_network.main.id
  resource_group_name   = azurerm_resource_group.main.name
  tags                  = local.common_tags
}

resource "azurerm_postgresql_flexible_server" "main" {
  name                   = "${local.resource_group_name}-postgres"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "15"
  delegated_subnet_id    = azurerm_subnet.database.id
  private_dns_zone_id    = azurerm_private_dns_zone.postgres.id
  administrator_login    = "hotgigs"
  administrator_password = var.db_password
  zone                   = "1"

  storage_mb   = var.environment == "production" ? 131072 : 32768
  storage_tier = var.environment == "production" ? "P30" : "P10"

  sku_name = var.environment == "production" ? "GP_Standard_D4s_v3" : "B_Standard_B1ms"

  backup_retention_days        = var.environment == "production" ? 35 : 7
  geo_redundant_backup_enabled = var.environment == "production"

  high_availability {
    mode                      = var.environment == "production" ? "ZoneRedundant" : "Disabled"
    standby_availability_zone = var.environment == "production" ? "2" : null
  }

  maintenance_window {
    day_of_week  = 0
    start_hour   = 8
    start_minute = 0
  }

  tags = local.common_tags

  depends_on = [azurerm_private_dns_zone_virtual_network_link.postgres]
}

resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = "hotgigs"
  server_id = azurerm_postgresql_flexible_server.main.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# Redis Cache
resource "azurerm_redis_cache" "main" {
  name                = "${local.resource_group_name}-redis"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  capacity            = var.environment == "production" ? 2 : 0
  family              = var.environment == "production" ? "C" : "C"
  sku_name            = var.environment == "production" ? "Standard" : "Basic"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"

  redis_configuration {
    enable_authentication = true
  }

  tags = local.common_tags
}

# Storage Account
resource "azurerm_storage_account" "main" {
  name                     = "${replace(local.resource_group_name, "-", "")}storage"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = var.environment == "production" ? "GRS" : "LRS"
  account_kind             = "StorageV2"

  blob_properties {
    versioning_enabled = true
    
    delete_retention_policy {
      days = var.environment == "production" ? 30 : 7
    }
  }

  tags = local.common_tags
}

resource "azurerm_storage_container" "uploads" {
  name                  = "uploads"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}

# Key Vault
resource "azurerm_key_vault" "main" {
  name                       = "${local.resource_group_name}-kv"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Create",
      "Get",
      "List",
      "Update",
      "Delete",
      "Purge",
      "Recover"
    ]

    secret_permissions = [
      "Set",
      "Get",
      "Delete",
      "List",
      "Purge",
      "Recover"
    ]
  }

  # AKS access policy
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = azurerm_kubernetes_cluster.main.key_vault_secrets_provider[0].secret_identity[0].object_id

    secret_permissions = [
      "Get",
      "List"
    ]
  }

  tags = local.common_tags
}

# Key Vault Secrets
resource "azurerm_key_vault_secret" "db_password" {
  name         = "db-password"
  value        = var.db_password
  key_vault_id = azurerm_key_vault.main.id
  tags         = local.common_tags
}

resource "azurerm_key_vault_secret" "redis_key" {
  name         = "redis-key"
  value        = azurerm_redis_cache.main.primary_access_key
  key_vault_id = azurerm_key_vault.main.id
  tags         = local.common_tags
}

# Application Gateway (if needed for advanced routing)
resource "azurerm_public_ip" "app_gateway" {
  count               = var.enable_application_gateway ? 1 : 0
  name                = "${local.resource_group_name}-appgw-pip"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  allocation_method   = "Static"
  sku                 = "Standard"
  tags                = local.common_tags
}

resource "azurerm_subnet" "app_gateway" {
  count                = var.enable_application_gateway ? 1 : 0
  name                 = "appgw-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.4.0/24"]
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = "${local.resource_group_name}-appinsights"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "web"
  tags                = local.common_tags
}

# DNS Zone (if managing DNS)
resource "azurerm_dns_zone" "main" {
  count               = var.manage_dns ? 1 : 0
  name                = var.domain_name
  resource_group_name = azurerm_resource_group.main.name
  tags                = local.common_tags
}

