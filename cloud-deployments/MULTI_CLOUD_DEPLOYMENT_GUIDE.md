# HotGigs.ai Multi-Cloud Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying HotGigs.ai across multiple cloud providers (AWS, Azure, GCP) with automated CI/CD pipelines, infrastructure as code, and monitoring.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Cloud Provider Setup](#cloud-provider-setup)
4. [Deployment Scripts](#deployment-scripts)
5. [CI/CD Workflows](#cicd-workflows)
6. [Monitoring & Alerting](#monitoring--alerting)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Prerequisites

### Required Tools
- **Terraform** >= 1.6.0
- **kubectl** >= 1.28.0
- **Docker** >= 24.0.0
- **Git** >= 2.40.0
- **jq** >= 1.6

### Cloud CLI Tools
- **AWS CLI** >= 2.13.0
- **Azure CLI** >= 2.50.0
- **Google Cloud SDK** >= 440.0.0

### Environment Variables
```bash
# Common
export TF_VAR_db_password="your-secure-password"
export TF_VAR_domain_name="hotgigs.ai"
export OPENAI_API_KEY="your-openai-api-key"
export JWT_SECRET_KEY="your-jwt-secret"
export SLACK_WEBHOOK_URL="your-slack-webhook"

# AWS
export AWS_ACCESS_KEY_ID="your-aws-access-key"
export AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
export AWS_REGION="us-east-1"

# Azure
export AZURE_SUBSCRIPTION_ID="your-azure-subscription-id"
export AZURE_LOCATION="East US"

# GCP
export GCP_PROJECT_ID="your-gcp-project-id"
export GCP_REGION="us-central1"
export GCP_ZONE="us-central1-a"
```

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/businessintelli/hitgigs.git
cd hitgigs
```

### 2. Deploy to Single Cloud
```bash
# Deploy to AWS staging
./cloud-deployments/aws/scripts/deploy-aws.sh staging deploy

# Deploy to Azure production
./cloud-deployments/azure/scripts/deploy-azure.sh production deploy

# Deploy to GCP staging
./cloud-deployments/gcp/scripts/deploy-gcp.sh staging deploy
```

### 3. Deploy to All Clouds (CI/CD)
```bash
# Trigger multi-cloud deployment via GitHub Actions
gh workflow run multi-cloud-deploy.yml \
  -f cloud_provider=all \
  -f environment=staging \
  -f force_rebuild=true
```

## Cloud Provider Setup

### AWS Setup

#### 1. Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region
```

#### 2. Create S3 Bucket for Terraform State
```bash
aws s3 mb s3://hotgigs-terraform-state-$(date +%s)
```

#### 3. Deploy Infrastructure
```bash
cd cloud-deployments/aws/scripts
./deploy-aws.sh staging deploy false true
```

#### 4. Verify Deployment
```bash
# Check EKS cluster
aws eks describe-cluster --name hotgigs-staging

# Check RDS instance
aws rds describe-db-instances --db-instance-identifier hotgigs-staging-postgres
```

### Azure Setup

#### 1. Login to Azure
```bash
az login
az account set --subscription "your-subscription-id"
```

#### 2. Create Resource Group for Terraform State
```bash
az group create --name hotgigs-terraform-state --location "East US"
az storage account create \
  --name hotgigsterraformstate \
  --resource-group hotgigs-terraform-state \
  --location "East US" \
  --sku Standard_LRS
```

#### 3. Deploy Infrastructure
```bash
cd cloud-deployments/azure/scripts
./deploy-azure.sh staging deploy false true
```

#### 4. Verify Deployment
```bash
# Check AKS cluster
az aks show --name hotgigs-staging-aks --resource-group hotgigs-staging

# Check PostgreSQL server
az postgres flexible-server show \
  --name hotgigs-staging-postgres \
  --resource-group hotgigs-staging
```

### GCP Setup

#### 1. Authenticate with GCP
```bash
gcloud auth login
gcloud config set project your-project-id
```

#### 2. Enable Required APIs
```bash
gcloud services enable container.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable redis.googleapis.com
```

#### 3. Create GCS Bucket for Terraform State
```bash
gsutil mb gs://hotgigs-terraform-state-$(date +%s)
```

#### 4. Deploy Infrastructure
```bash
cd cloud-deployments/gcp/scripts
./deploy-gcp.sh staging deploy false true
```

#### 5. Verify Deployment
```bash
# Check GKE cluster
gcloud container clusters describe hotgigs-staging --region us-central1

# Check Cloud SQL instance
gcloud sql instances describe hotgigs-staging-postgres
```

## Deployment Scripts

### Script Usage
All deployment scripts follow the same pattern:
```bash
./deploy-{cloud}.sh [environment] [action] [force_rebuild] [auto_approve]
```

#### Parameters
- **environment**: `staging` or `production`
- **action**: `deploy`, `destroy`, `plan`, `apply`, `app-deploy`, `rollback`
- **force_rebuild**: `true` or `false` (rebuild Docker images)
- **auto_approve**: `true` or `false` (auto-approve Terraform changes)

#### Examples
```bash
# Full deployment with image rebuild
./deploy-aws.sh production deploy true false

# Application-only deployment
./deploy-azure.sh staging app-deploy true true

# Infrastructure planning
./deploy-gcp.sh production plan false false

# Rollback deployment
./deploy-aws.sh staging rollback false true

# Destroy infrastructure
./deploy-azure.sh staging destroy false false
```

### Script Features
- **Git Integration**: Automatically pulls latest code
- **Docker Build**: Builds and pushes container images
- **Terraform Management**: Handles infrastructure provisioning
- **Kubernetes Deployment**: Deploys applications to clusters
- **Health Checks**: Validates deployment success
- **Rollback Support**: Quick rollback to previous versions
- **Notifications**: Slack/email notifications for deployment status

## CI/CD Workflows

### GitHub Actions Workflows

#### 1. Multi-Cloud Deployment
- **File**: `.github/workflows/multi-cloud-deploy.yml`
- **Triggers**: Push to main/develop, tags, manual dispatch
- **Features**:
  - Parallel deployment to multiple clouds
  - Environment-specific configurations
  - Security scanning with Trivy
  - Integration testing
  - Slack notifications

#### 2. Workflow Dispatch Options
```yaml
# Manual deployment options
cloud_provider: [all, aws, azure, gcp]
environment: [staging, production]
force_rebuild: [true, false]
```

#### 3. Environment Secrets
Configure these secrets in GitHub repository settings:
```
# AWS
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

# Azure
AZURE_CREDENTIALS

# GCP
GCP_SA_KEY

# Common
DB_PASSWORD
OPENAI_API_KEY
JWT_SECRET_KEY
SLACK_WEBHOOK_URL
```

#### 4. Environment Variables
Configure these variables in GitHub repository settings:
```
# Common
DOMAIN_NAME=hotgigs.ai

# AWS
AWS_REGION=us-east-1

# Azure
AZURE_LOCATION=East US

# GCP
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
GCP_ZONE=us-central1-a
```

## Monitoring & Alerting

### Monitoring Stack
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Alertmanager**: Alert routing and notifications
- **Cloud-specific**: CloudWatch, Azure Monitor, Stackdriver

### Key Metrics
- Application health and uptime
- Request rate and response time
- Error rates and status codes
- Resource utilization (CPU, memory, disk)
- Database performance
- Cost monitoring

### Alert Channels
- **Slack**: Real-time notifications
- **Email**: Critical alerts
- **PagerDuty**: On-call escalation
- **Cloud-native**: CloudWatch, Azure Monitor, Stackdriver

### Dashboard Access
- **Grafana**: `https://grafana.hotgigs.ai`
- **Prometheus**: `https://prometheus.hotgigs.ai`
- **Alertmanager**: `https://alertmanager.hotgigs.ai`

## Troubleshooting

### Common Issues

#### 1. Terraform State Lock
```bash
# Force unlock (use with caution)
terraform force-unlock LOCK_ID

# Alternative: Delete lock manually from backend
```

#### 2. Docker Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t image:tag .
```

#### 3. Kubernetes Deployment Issues
```bash
# Check pod status
kubectl get pods -n staging

# View pod logs
kubectl logs -f deployment/hotgigs-backend -n staging

# Describe pod for events
kubectl describe pod POD_NAME -n staging
```

#### 4. Database Connection Issues
```bash
# Test database connectivity
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- \
  psql -h DATABASE_HOST -U hotgigs -d hotgigs
```

#### 5. Load Balancer Issues
```bash
# Check service status
kubectl get svc -n staging

# Check ingress status
kubectl get ingress -n staging

# View load balancer events
kubectl describe svc hotgigs-backend-service -n staging
```

### Debugging Commands

#### AWS
```bash
# EKS cluster info
aws eks describe-cluster --name CLUSTER_NAME

# RDS connection info
aws rds describe-db-instances --db-instance-identifier DB_INSTANCE

# CloudWatch logs
aws logs describe-log-groups --log-group-name-prefix /aws/eks
```

#### Azure
```bash
# AKS cluster info
az aks show --name CLUSTER_NAME --resource-group RESOURCE_GROUP

# PostgreSQL info
az postgres flexible-server show --name SERVER_NAME --resource-group RESOURCE_GROUP

# Monitor logs
az monitor activity-log list --resource-group RESOURCE_GROUP
```

#### GCP
```bash
# GKE cluster info
gcloud container clusters describe CLUSTER_NAME --region REGION

# Cloud SQL info
gcloud sql instances describe INSTANCE_NAME

# Stackdriver logs
gcloud logging read "resource.type=k8s_container"
```

## Best Practices

### Security
1. **Secrets Management**
   - Use cloud-native secret managers
   - Rotate secrets regularly
   - Never commit secrets to git

2. **Network Security**
   - Use private subnets for databases
   - Implement network policies
   - Enable VPC flow logs

3. **Access Control**
   - Use IAM roles and policies
   - Implement least privilege principle
   - Enable audit logging

### Performance
1. **Resource Optimization**
   - Right-size instances based on usage
   - Use auto-scaling groups
   - Implement resource quotas

2. **Database Optimization**
   - Use read replicas for scaling
   - Implement connection pooling
   - Monitor query performance

3. **Caching**
   - Use Redis for session storage
   - Implement CDN for static assets
   - Cache database queries

### Cost Management
1. **Resource Tagging**
   - Tag all resources consistently
   - Use cost allocation tags
   - Implement cost budgets

2. **Right-sizing**
   - Monitor resource utilization
   - Use spot/preemptible instances
   - Schedule non-production environments

3. **Reserved Instances**
   - Purchase reserved instances for production
   - Use savings plans
   - Monitor usage patterns

### Disaster Recovery
1. **Backup Strategy**
   - Automated database backups
   - Cross-region replication
   - Regular backup testing

2. **High Availability**
   - Multi-AZ deployments
   - Load balancer health checks
   - Auto-scaling configurations

3. **Recovery Procedures**
   - Document recovery steps
   - Test recovery procedures
   - Maintain RTO/RPO targets

## Support and Maintenance

### Regular Tasks
- **Daily**: Monitor dashboards and alerts
- **Weekly**: Review cost reports and optimization opportunities
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Disaster recovery testing and capacity planning

### Escalation Procedures
1. **Level 1**: Development team (business hours)
2. **Level 2**: DevOps team (24/7 on-call)
3. **Level 3**: Cloud architects and vendors

### Documentation Updates
- Keep deployment scripts updated
- Document configuration changes
- Update runbooks and procedures
- Maintain architecture diagrams

## Conclusion
This multi-cloud deployment solution provides enterprise-grade infrastructure automation, monitoring, and operational excellence for HotGigs.ai. The solution supports:

- **Scalability**: Auto-scaling across multiple clouds
- **Reliability**: High availability and disaster recovery
- **Security**: Enterprise-grade security controls
- **Observability**: Comprehensive monitoring and alerting
- **Cost Optimization**: Multi-cloud cost management
- **Operational Excellence**: Automated deployment and management

For additional support, contact the DevOps team or refer to the troubleshooting section above.

