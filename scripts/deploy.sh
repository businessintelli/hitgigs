#!/bin/bash

# HotGigs.ai Automated Deployment Script
# Usage: ./deploy.sh [environment] [version]

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT="${1:-staging}"
VERSION="${2:-latest}"
NAMESPACE="$ENVIRONMENT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Validation functions
validate_environment() {
    if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
        log_error "Invalid environment: $ENVIRONMENT. Must be 'staging' or 'production'"
        exit 1
    fi
}

validate_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
}

validate_docker_images() {
    local backend_image="ghcr.io/businessintelli/hitgigs-backend:$VERSION"
    
    log_info "Validating Docker images..."
    
    if ! docker manifest inspect "$backend_image" &> /dev/null; then
        log_error "Backend image not found: $backend_image"
        exit 1
    fi
    
    log_success "Docker images validated"
}

# Deployment functions
create_namespace() {
    log_info "Creating namespace: $NAMESPACE"
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
    log_success "Namespace created/updated"
}

deploy_secrets() {
    log_info "Deploying secrets..."
    
    # Check if secrets exist
    if ! kubectl get secret hotgigs-secrets -n "$NAMESPACE" &> /dev/null; then
        log_warning "Secrets not found. Please create them manually:"
        echo "kubectl create secret generic hotgigs-secrets -n $NAMESPACE \\"
        echo "  --from-literal=database-url=\$DATABASE_URL \\"
        echo "  --from-literal=redis-url=\$REDIS_URL \\"
        echo "  --from-literal=supabase-url=\$SUPABASE_URL \\"
        echo "  --from-literal=supabase-key=\$SUPABASE_KEY \\"
        echo "  --from-literal=openai-api-key=\$OPENAI_API_KEY \\"
        echo "  --from-literal=jwt-secret-key=\$JWT_SECRET_KEY"
        exit 1
    fi
    
    log_success "Secrets validated"
}

deploy_application() {
    log_info "Deploying application to $ENVIRONMENT..."
    
    # Set image version in deployment
    export BACKEND_IMAGE="ghcr.io/businessintelli/hitgigs-backend:$VERSION"
    
    # Apply deployment
    envsubst < "$PROJECT_ROOT/k8s/$ENVIRONMENT/deployment.yaml" | kubectl apply -f -
    
    log_success "Application deployment initiated"
}

wait_for_deployment() {
    log_info "Waiting for deployment to complete..."
    
    # Wait for backend deployment
    if ! kubectl rollout status deployment/hotgigs-backend -n "$NAMESPACE" --timeout=600s; then
        log_error "Backend deployment failed"
        kubectl describe deployment/hotgigs-backend -n "$NAMESPACE"
        kubectl logs -l app=hotgigs-backend -n "$NAMESPACE" --tail=50
        exit 1
    fi
    
    log_success "Deployment completed successfully"
}

run_health_checks() {
    log_info "Running health checks..."
    
    # Get service endpoint
    local service_ip
    service_ip=$(kubectl get service hotgigs-backend-service -n "$NAMESPACE" -o jsonpath='{.spec.clusterIP}')
    
    # Wait for service to be ready
    sleep 30
    
    # Run health check
    if kubectl run health-check --rm -i --restart=Never --image=curlimages/curl -- \
        curl -f "http://$service_ip/api/health" --max-time 30; then
        log_success "Health check passed"
    else
        log_error "Health check failed"
        exit 1
    fi
}

rollback_deployment() {
    log_warning "Rolling back deployment..."
    kubectl rollout undo deployment/hotgigs-backend -n "$NAMESPACE"
    kubectl rollout status deployment/hotgigs-backend -n "$NAMESPACE"
    log_success "Rollback completed"
}

cleanup_old_resources() {
    log_info "Cleaning up old resources..."
    
    # Clean up old ReplicaSets
    kubectl delete replicaset -l app=hotgigs-backend -n "$NAMESPACE" \
        --field-selector='status.replicas=0' || true
    
    # Clean up completed jobs
    kubectl delete job -l app=hotgigs-backend -n "$NAMESPACE" \
        --field-selector='status.conditions[0].type=Complete' || true
    
    log_success "Cleanup completed"
}

# Main deployment flow
main() {
    log_info "Starting deployment of HotGigs.ai to $ENVIRONMENT environment"
    log_info "Version: $VERSION"
    
    # Validation
    validate_environment
    validate_kubectl
    validate_docker_images
    
    # Deployment
    create_namespace
    deploy_secrets
    deploy_application
    wait_for_deployment
    run_health_checks
    cleanup_old_resources
    
    log_success "🚀 Deployment completed successfully!"
    log_info "Application is now running in $ENVIRONMENT environment"
    
    # Show deployment info
    kubectl get pods -l app=hotgigs-backend -n "$NAMESPACE"
    kubectl get services -n "$NAMESPACE"
    kubectl get ingress -n "$NAMESPACE"
}

# Error handling
trap 'log_error "Deployment failed! Check the logs above for details."' ERR

# Help function
show_help() {
    echo "HotGigs.ai Deployment Script"
    echo ""
    echo "Usage: $0 [environment] [version]"
    echo ""
    echo "Arguments:"
    echo "  environment    Target environment (staging|production) [default: staging]"
    echo "  version        Docker image version [default: latest]"
    echo ""
    echo "Examples:"
    echo "  $0 staging latest"
    echo "  $0 production v1.2.3"
    echo ""
    echo "Environment Variables:"
    echo "  KUBECONFIG     Path to kubectl configuration file"
    echo ""
}

# Check for help flag
if [[ "${1:-}" == "-h" ]] || [[ "${1:-}" == "--help" ]]; then
    show_help
    exit 0
fi

# Run main function
main "$@"

