#!/bin/bash

# HotGigs.ai Azure Deployment Script
# Automated deployment to Azure AKS with Terraform and Kubernetes
# Usage: ./deploy-azure.sh [environment] [action] [options]

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform"
K8S_DIR="$SCRIPT_DIR/../k8s"

# Default values
ENVIRONMENT="${1:-staging}"
ACTION="${2:-deploy}"
FORCE_REBUILD="${3:-false}"
AUTO_APPROVE="${4:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Help function
show_help() {
    cat << EOF
HotGigs.ai Azure Deployment Script

Usage: $0 [environment] [action] [force_rebuild] [auto_approve]

Arguments:
  environment     Target environment (staging|production) [default: staging]
  action          Action to perform (deploy|destroy|plan|apply) [default: deploy]
  force_rebuild   Force rebuild of Docker images (true|false) [default: false]
  auto_approve    Auto-approve Terraform changes (true|false) [default: false]

Actions:
  deploy          Full deployment (infrastructure + application)
  destroy         Destroy infrastructure
  plan            Show Terraform plan
  apply           Apply Terraform changes only
  app-deploy      Deploy application only (skip infrastructure)
  rollback        Rollback to previous version

Examples:
  $0 staging deploy
  $0 production deploy false true
  $0 staging app-deploy true
  $0 production rollback

Environment Variables:
  AZURE_LOCATION          Azure region [default: East US]
  AZURE_SUBSCRIPTION_ID   Azure subscription ID
  TF_VAR_db_password      Database password (required)
  TF_VAR_domain_name      Domain name [default: hotgigs.ai]
  DOCKER_REGISTRY         Docker registry URL
  GITHUB_TOKEN            GitHub token for private repos
  SLACK_WEBHOOK_URL       Slack webhook for notifications

Prerequisites:
  - Azure CLI configured (az login)
  - Terraform >= 1.0
  - kubectl
  - Docker
  - jq

EOF
}

# Validation functions
validate_environment() {
    if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
        log_error "Invalid environment: $ENVIRONMENT. Must be 'staging' or 'production'"
        exit 1
    fi
}

validate_action() {
    if [[ ! "$ACTION" =~ ^(deploy|destroy|plan|apply|app-deploy|rollback)$ ]]; then
        log_error "Invalid action: $ACTION"
        show_help
        exit 1
    fi
}

validate_prerequisites() {
    local missing_tools=()
    
    # Check required tools
    for tool in az terraform kubectl docker jq; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        log_error "Please install missing tools and try again"
        exit 1
    fi
    
    # Check Azure login
    if ! az account show &> /dev/null; then
        log_error "Azure CLI not logged in"
        log_error "Please run 'az login' and try again"
        exit 1
    fi
    
    # Check required environment variables
    if [[ -z "${TF_VAR_db_password:-}" ]]; then
        log_error "TF_VAR_db_password environment variable is required"
        exit 1
    fi
    
    log_success "Prerequisites validation passed"
}

# Git functions
get_git_commit() {
    cd "$PROJECT_ROOT"
    git rev-parse HEAD
}

get_git_branch() {
    cd "$PROJECT_ROOT"
    git rev-parse --abbrev-ref HEAD
}

get_git_tag() {
    cd "$PROJECT_ROOT"
    git describe --tags --exact-match 2>/dev/null || echo "latest"
}

# Docker functions
build_and_push_images() {
    log_step "Building and pushing Docker images"
    
    local commit_sha=$(get_git_commit)
    local git_tag=$(get_git_tag)
    local image_tag="${git_tag}-${commit_sha:0:8}"
    
    # Get ACR URL from Terraform output
    local registry_url="${DOCKER_REGISTRY:-$(terraform -chdir="$TERRAFORM_DIR" output -raw acr_login_server 2>/dev/null || echo "")}"
    
    if [[ -z "$registry_url" ]]; then
        log_error "Docker registry URL not found. Please set DOCKER_REGISTRY or deploy infrastructure first"
        exit 1
    fi
    
    # Login to ACR
    az acr login --name "$(echo "$registry_url" | cut -d'.' -f1)"
    
    # Build backend image
    log_info "Building backend image: $registry_url/hotgigs/backend:$image_tag"
    cd "$PROJECT_ROOT"
    docker build -t "$registry_url/hotgigs/backend:$image_tag" -t "$registry_url/hotgigs/backend:latest" \
        --target production \
        --build-arg BUILD_ENV="$ENVIRONMENT" \
        -f backend/Dockerfile .
    
    # Push images
    log_info "Pushing images to registry"
    docker push "$registry_url/hotgigs/backend:$image_tag"
    docker push "$registry_url/hotgigs/backend:latest"
    
    # Export image tag for Kubernetes deployment
    export APP_IMAGE_TAG="$image_tag"
    echo "$image_tag" > "$SCRIPT_DIR/.last_image_tag"
    
    log_success "Images built and pushed successfully"
}

# Terraform functions
terraform_init() {
    log_step "Initializing Terraform"
    cd "$TERRAFORM_DIR"
    
    # Set backend configuration
    terraform init \
        -backend-config="resource_group_name=hotgigs-terraform-state" \
        -backend-config="storage_account_name=hotgigsterraformstate" \
        -backend-config="container_name=tfstate" \
        -backend-config="key=infrastructure/terraform.tfstate"
    
    log_success "Terraform initialized"
}

terraform_plan() {
    log_step "Creating Terraform plan"
    cd "$TERRAFORM_DIR"
    
    terraform plan \
        -var="environment=$ENVIRONMENT" \
        -var="azure_location=${AZURE_LOCATION:-East US}" \
        -var="domain_name=${TF_VAR_domain_name:-hotgigs.ai}" \
        -out="tfplan-$ENVIRONMENT"
    
    log_success "Terraform plan created"
}

terraform_apply() {
    log_step "Applying Terraform changes"
    cd "$TERRAFORM_DIR"
    
    local apply_args=()
    if [[ "$AUTO_APPROVE" == "true" ]]; then
        apply_args+=("-auto-approve")
    fi
    
    if [[ -f "tfplan-$ENVIRONMENT" ]]; then
        terraform apply "${apply_args[@]}" "tfplan-$ENVIRONMENT"
    else
        terraform apply "${apply_args[@]}" \
            -var="environment=$ENVIRONMENT" \
            -var="azure_location=${AZURE_LOCATION:-East US}" \
            -var="domain_name=${TF_VAR_domain_name:-hotgigs.ai}"
    fi
    
    log_success "Terraform changes applied"
}

terraform_destroy() {
    log_step "Destroying Terraform infrastructure"
    cd "$TERRAFORM_DIR"
    
    local destroy_args=()
    if [[ "$AUTO_APPROVE" == "true" ]]; then
        destroy_args+=("-auto-approve")
    fi
    
    terraform destroy "${destroy_args[@]}" \
        -var="environment=$ENVIRONMENT" \
        -var="azure_location=${AZURE_LOCATION:-East US}" \
        -var="domain_name=${TF_VAR_domain_name:-hotgigs.ai}"
    
    log_success "Infrastructure destroyed"
}

# Kubernetes functions
configure_kubectl() {
    log_step "Configuring kubectl"
    cd "$TERRAFORM_DIR"
    
    # Get cluster name and resource group from Terraform output
    local cluster_name=$(terraform output -raw cluster_name)
    local resource_group=$(terraform output -raw resource_group_name)
    
    # Update kubeconfig
    az aks get-credentials \
        --resource-group "$resource_group" \
        --name "$cluster_name" \
        --overwrite-existing
    
    # Test connection
    kubectl cluster-info
    
    log_success "kubectl configured successfully"
}

deploy_kubernetes_manifests() {
    log_step "Deploying Kubernetes manifests"
    
    # Get configuration from Terraform
    cd "$TERRAFORM_DIR"
    local database_url=$(terraform output -raw database_url)
    local redis_url=$(terraform output -raw redis_url)
    local storage_account=$(terraform output -raw storage_account_name)
    local acr_url=$(terraform output -raw acr_login_server)
    
    # Get image tag
    local image_tag="${APP_IMAGE_TAG:-$(cat "$SCRIPT_DIR/.last_image_tag" 2>/dev/null || echo "latest")}"
    
    # Create namespace
    kubectl create namespace "$ENVIRONMENT" --dry-run=client -o yaml | kubectl apply -f -
    
    # Create secrets
    kubectl create secret generic hotgigs-secrets \
        --namespace="$ENVIRONMENT" \
        --from-literal=database-url="$database_url" \
        --from-literal=redis-url="$redis_url" \
        --from-literal=storage-account="$storage_account" \
        --from-literal=openai-api-key="${OPENAI_API_KEY:-}" \
        --from-literal=jwt-secret-key="${JWT_SECRET_KEY:-$(openssl rand -base64 32)}" \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # Deploy application
    export BACKEND_IMAGE="$acr_url/hotgigs/backend:$image_tag"
    export ENVIRONMENT="$ENVIRONMENT"
    export DATABASE_URL="$database_url"
    export REDIS_URL="$redis_url"
    export STORAGE_ACCOUNT="$storage_account"
    
    # Apply Kubernetes manifests
    envsubst < "$K8S_DIR/deployment.yaml" | kubectl apply -f -
    
    log_success "Kubernetes manifests deployed"
}

wait_for_deployment() {
    log_step "Waiting for deployment to complete"
    
    # Wait for deployment rollout
    kubectl rollout status deployment/hotgigs-backend \
        --namespace="$ENVIRONMENT" \
        --timeout=600s
    
    # Wait for service to be ready
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if kubectl get service hotgigs-backend-service \
            --namespace="$ENVIRONMENT" \
            --output=jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null; then
            break
        fi
        
        log_info "Waiting for load balancer... (attempt $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done
    
    if [[ $attempt -gt $max_attempts ]]; then
        log_warning "Load balancer not ready after $max_attempts attempts"
    fi
    
    log_success "Deployment completed successfully"
}

run_health_checks() {
    log_step "Running health checks"
    
    # Get service endpoint
    local service_endpoint
    service_endpoint=$(kubectl get service hotgigs-backend-service \
        --namespace="$ENVIRONMENT" \
        --output=jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    
    if [[ -n "$service_endpoint" ]]; then
        # Test health endpoint
        local max_attempts=10
        local attempt=1
        
        while [[ $attempt -le $max_attempts ]]; do
            if curl -f "http://$service_endpoint/api/health" --max-time 30 &>/dev/null; then
                log_success "Health check passed"
                return 0
            fi
            
            log_info "Health check failed, retrying... (attempt $attempt/$max_attempts)"
            sleep 30
            ((attempt++))
        done
        
        log_error "Health check failed after $max_attempts attempts"
        return 1
    else
        log_warning "Service endpoint not available, skipping health check"
    fi
}

# Rollback function
rollback_deployment() {
    log_step "Rolling back deployment"
    
    kubectl rollout undo deployment/hotgigs-backend \
        --namespace="$ENVIRONMENT"
    
    kubectl rollout status deployment/hotgigs-backend \
        --namespace="$ENVIRONMENT" \
        --timeout=300s
    
    log_success "Rollback completed"
}

# Notification functions
send_notification() {
    local status="$1"
    local message="$2"
    
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        local color="good"
        if [[ "$status" == "error" ]]; then
            color="danger"
        elif [[ "$status" == "warning" ]]; then
            color="warning"
        fi
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"attachments\":[{\"color\":\"$color\",\"text\":\"$message\"}]}" \
            "$SLACK_WEBHOOK_URL" &>/dev/null || true
    fi
}

# Cleanup function
cleanup() {
    log_info "Cleaning up temporary files"
    rm -f "$TERRAFORM_DIR/tfplan-$ENVIRONMENT" 2>/dev/null || true
}

# Main deployment functions
deploy_infrastructure() {
    log_step "Deploying infrastructure"
    
    terraform_init
    terraform_plan
    terraform_apply
    configure_kubectl
    
    log_success "Infrastructure deployment completed"
}

deploy_application() {
    log_step "Deploying application"
    
    if [[ "$FORCE_REBUILD" == "true" ]] || [[ ! -f "$SCRIPT_DIR/.last_image_tag" ]]; then
        build_and_push_images
    fi
    
    deploy_kubernetes_manifests
    wait_for_deployment
    run_health_checks
    
    log_success "Application deployment completed"
}

full_deployment() {
    log_step "Starting full deployment"
    
    deploy_infrastructure
    deploy_application
    
    local commit_sha=$(get_git_commit)
    local git_branch=$(get_git_branch)
    
    log_success "Full deployment completed successfully"
    log_info "Deployed commit: $commit_sha"
    log_info "Branch: $git_branch"
    log_info "Environment: $ENVIRONMENT"
    
    send_notification "good" "HotGigs.ai deployed successfully to Azure $ENVIRONMENT (commit: ${commit_sha:0:8})"
}

# Error handling
handle_error() {
    local exit_code=$?
    log_error "Deployment failed with exit code $exit_code"
    
    # Send failure notification
    local commit_sha=$(get_git_commit)
    send_notification "error" "HotGigs.ai Azure deployment failed in $ENVIRONMENT (commit: ${commit_sha:0:8})"
    
    cleanup
    exit $exit_code
}

trap handle_error ERR

# Main execution
main() {
    log_info "Starting HotGigs.ai Azure deployment"
    log_info "Environment: $ENVIRONMENT"
    log_info "Action: $ACTION"
    log_info "Azure Location: ${AZURE_LOCATION:-East US}"
    
    # Validation
    validate_environment
    validate_action
    validate_prerequisites
    
    # Execute action
    case "$ACTION" in
        "deploy")
            full_deployment
            ;;
        "destroy")
            terraform_init
            terraform_destroy
            ;;
        "plan")
            terraform_init
            terraform_plan
            ;;
        "apply")
            terraform_init
            terraform_apply
            ;;
        "app-deploy")
            deploy_application
            ;;
        "rollback")
            rollback_deployment
            ;;
    esac
    
    cleanup
    log_success "Operation completed successfully"
}

# Check for help flag
if [[ "${1:-}" == "-h" ]] || [[ "${1:-}" == "--help" ]]; then
    show_help
    exit 0
fi

# Run main function
main "$@"

