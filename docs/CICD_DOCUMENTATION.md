# HotGigs.ai CI/CD Pipeline Documentation

## Overview

This document provides comprehensive information about the CI/CD pipeline for HotGigs.ai, including setup, configuration, usage, and troubleshooting.

## Table of Contents

1. [Pipeline Architecture](#pipeline-architecture)
2. [Setup and Configuration](#setup-and-configuration)
3. [Workflow Descriptions](#workflow-descriptions)
4. [Deployment Process](#deployment-process)
5. [Monitoring and Alerting](#monitoring-and-alerting)
6. [Security and Quality Gates](#security-and-quality-gates)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Pipeline Architecture

### Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub        │    │   GitHub        │    │   Kubernetes    │
│   Repository    │───▶│   Actions       │───▶│   Cluster       │
│                 │    │   Workflows     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │   Container     │    │   Monitoring    │
         │              │   Registry      │    │   Stack         │
         │              │   (GHCR)        │    │   (Prometheus)  │
         │              └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Quality &     │
│   Security      │
│   Gates         │
└─────────────────┘
```

### Environments

- **Development**: Local development with Docker Compose
- **Staging**: Pre-production environment for testing
- **Production**: Live environment serving users

## Setup and Configuration

### Prerequisites

1. **GitHub Repository**: Source code repository
2. **Kubernetes Cluster**: Target deployment environment
3. **Container Registry**: GitHub Container Registry (GHCR)
4. **Monitoring Stack**: Prometheus, Grafana, AlertManager

### Required Secrets

Configure the following secrets in GitHub repository settings:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port

# External Services
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key

# Security
JWT_SECRET_KEY=your-jwt-secret-key

# Kubernetes Configuration
KUBE_CONFIG_STAGING=base64-encoded-kubeconfig
KUBE_CONFIG_PRODUCTION=base64-encoded-kubeconfig

# Monitoring
SLACK_WEBHOOK_URL=your-slack-webhook-url

# Environment URLs
STAGING_URL=https://staging.hotgigs.ai
PRODUCTION_URL=https://hotgigs.ai
```

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/businessintelli/hitgigs.git
   cd hitgigs
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install Dependencies**
   ```bash
   # Backend
   cd backend && pip install -r requirements.txt
   
   # Frontend (if exists)
   cd frontend && npm install
   ```

4. **Local Development**
   ```bash
   docker-compose up -d
   ```

## Workflow Descriptions

### Main CI/CD Workflow (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual workflow dispatch

**Jobs:**

1. **Code Quality & Security**
   - Python linting with flake8
   - Code formatting check with black
   - Security scanning with bandit
   - Dependency vulnerability check with safety

2. **Backend Tests**
   - Unit tests with pytest
   - Integration tests
   - Code coverage reporting
   - Performance tests (on main branch)

3. **Frontend Tests** (if applicable)
   - ESLint for code quality
   - Jest for unit tests
   - Coverage reporting

4. **Build Docker Images**
   - Multi-stage Docker builds
   - Push to GitHub Container Registry
   - Image vulnerability scanning

5. **Deploy to Staging**
   - Automated deployment to staging environment
   - Smoke tests
   - Health checks

6. **Deploy to Production**
   - Manual approval required
   - Blue-green deployment strategy
   - Comprehensive health checks
   - Rollback capability

### Monitoring Workflow (`.github/workflows/monitoring.yml`)

**Triggers:**
- Daily schedule (2 AM UTC)
- Manual workflow dispatch

**Jobs:**

1. **Dependency Updates**
   - Check for outdated packages
   - Security vulnerability scanning
   - Automated issue creation

2. **Health Monitoring**
   - Production health checks
   - Performance monitoring
   - Alert on failures

3. **Backup Verification**
   - Database backup integrity
   - File storage backup verification

## Deployment Process

### Staging Deployment

1. **Automatic Trigger**: Push to `main` branch
2. **Build Process**: 
   - Code quality checks
   - Test execution
   - Docker image build
3. **Deployment**:
   - Deploy to staging namespace
   - Run smoke tests
   - Update monitoring dashboards

### Production Deployment

1. **Manual Approval**: Required for production deployment
2. **Pre-deployment Checks**:
   - All tests passing
   - Security scans clean
   - Staging deployment successful
3. **Deployment Strategy**: Blue-green deployment
4. **Post-deployment**:
   - Health checks
   - Performance monitoring
   - User acceptance testing

### Rollback Procedure

```bash
# Automatic rollback on health check failure
kubectl rollout undo deployment/hotgigs-backend -n production

# Manual rollback
./scripts/deploy.sh production previous-version
```

## Monitoring and Alerting

### Metrics Collected

- **Application Metrics**: Response time, error rate, throughput
- **Infrastructure Metrics**: CPU, memory, disk usage
- **Business Metrics**: User registrations, job applications
- **Security Metrics**: Failed logins, suspicious activities

### Alert Channels

- **Slack**: Real-time notifications
- **Email**: Critical alerts
- **PagerDuty**: On-call escalation

### Dashboard URLs

- **Grafana**: https://monitoring.hotgigs.ai
- **Prometheus**: https://prometheus.hotgigs.ai
- **Kibana**: https://logs.hotgigs.ai

## Security and Quality Gates

### Automated Security Checks

1. **Static Analysis**: Bandit, ESLint Security
2. **Dependency Scanning**: Safety, npm audit
3. **Container Scanning**: Trivy
4. **Infrastructure Scanning**: Checkov

### Quality Gates

- **Code Coverage**: Minimum 80%
- **Code Quality**: SonarQube quality gate
- **Performance**: Response time < 500ms
- **Security**: No high/critical vulnerabilities

### Compliance

- **GDPR**: Data protection compliance
- **SOC 2**: Security controls implementation
- **ISO 27001**: Information security management

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Symptom**: Docker build fails
**Solution**:
```bash
# Check build logs
docker build --no-cache -t hotgigs-backend ./backend

# Verify dependencies
pip install -r requirements.txt
```

#### 2. Test Failures

**Symptom**: Tests fail in CI but pass locally
**Solution**:
```bash
# Run tests with same environment
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Check environment variables
env | grep -E "(DATABASE|REDIS|SUPABASE)"
```

#### 3. Deployment Failures

**Symptom**: Kubernetes deployment fails
**Solution**:
```bash
# Check pod status
kubectl get pods -n production

# View pod logs
kubectl logs -l app=hotgigs-backend -n production

# Check events
kubectl get events -n production --sort-by='.lastTimestamp'
```

#### 4. Health Check Failures

**Symptom**: Health checks fail after deployment
**Solution**:
```bash
# Check service endpoints
kubectl get svc -n production

# Test health endpoint
kubectl run debug --rm -i --restart=Never --image=curlimages/curl -- \
  curl -f http://hotgigs-backend-service/api/health
```

### Debug Commands

```bash
# View workflow runs
gh run list --repo businessintelli/hitgigs

# View specific run
gh run view <run-id>

# Check deployment status
kubectl rollout status deployment/hotgigs-backend -n production

# View application logs
kubectl logs -f deployment/hotgigs-backend -n production

# Check resource usage
kubectl top pods -n production
```

## Best Practices

### Development

1. **Branch Strategy**: Use feature branches and pull requests
2. **Commit Messages**: Follow conventional commit format
3. **Code Review**: Require at least 2 reviewers
4. **Testing**: Write tests for all new features

### Security

1. **Secrets Management**: Never commit secrets to repository
2. **Access Control**: Use least privilege principle
3. **Regular Updates**: Keep dependencies up to date
4. **Monitoring**: Monitor for security incidents

### Operations

1. **Monitoring**: Set up comprehensive monitoring
2. **Alerting**: Configure appropriate alert thresholds
3. **Documentation**: Keep documentation up to date
4. **Incident Response**: Have clear incident response procedures

### Performance

1. **Resource Limits**: Set appropriate resource limits
2. **Scaling**: Configure horizontal pod autoscaling
3. **Caching**: Implement appropriate caching strategies
4. **Optimization**: Regular performance optimization

## Maintenance

### Regular Tasks

- **Weekly**: Review monitoring dashboards
- **Monthly**: Update dependencies
- **Quarterly**: Security assessment
- **Annually**: Disaster recovery testing

### Capacity Planning

- Monitor resource usage trends
- Plan for traffic growth
- Scale infrastructure proactively
- Optimize costs regularly

## Support and Contact

- **DevOps Team**: devops@hotgigs.ai
- **Security Team**: security@hotgigs.ai
- **On-call**: Use PagerDuty escalation
- **Documentation**: https://docs.hotgigs.ai

---

*This documentation is maintained by the DevOps team and updated regularly. Last updated: December 2024*

