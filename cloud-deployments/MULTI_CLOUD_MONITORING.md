# Multi-Cloud Monitoring & Alerting Configuration

## Overview
This document outlines the comprehensive monitoring and alerting setup for HotGigs.ai across AWS, Azure, and GCP deployments.

## AWS Monitoring Setup

### CloudWatch Configuration
```yaml
# CloudWatch Alarms for EKS
Resources:
  HighCPUAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub "${Environment}-EKS-HighCPU"
      AlarmDescription: "High CPU usage on EKS cluster"
      MetricName: CPUUtilization
      Namespace: AWS/EKS
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold
      
  DatabaseConnectionsAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub "${Environment}-RDS-HighConnections"
      AlarmDescription: "High database connections"
      MetricName: DatabaseConnections
      Namespace: AWS/RDS
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold
```

### Prometheus Configuration for AWS
```yaml
# prometheus-aws.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "aws-alert-rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
        
  - job_name: 'aws-cloudwatch'
    ec2_sd_configs:
      - region: us-east-1
        port: 9100
```

## Azure Monitoring Setup

### Azure Monitor Configuration
```json
{
  "type": "Microsoft.Insights/metricAlerts",
  "apiVersion": "2018-03-01",
  "name": "HighCPUAlert",
  "properties": {
    "description": "High CPU usage alert",
    "severity": 2,
    "enabled": true,
    "scopes": [
      "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.ContainerService/managedClusters/{cluster-name}"
    ],
    "evaluationFrequency": "PT5M",
    "windowSize": "PT15M",
    "criteria": {
      "odata.type": "Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria",
      "allOf": [
        {
          "name": "HighCPU",
          "metricName": "cpuUsagePercentage",
          "operator": "GreaterThan",
          "threshold": 80,
          "timeAggregation": "Average"
        }
      ]
    },
    "actions": [
      {
        "actionGroupId": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Insights/actionGroups/{action-group-name}"
      }
    ]
  }
}
```

### Application Insights Configuration
```javascript
// Application Insights setup
const appInsights = require('applicationinsights');
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(true)
  .start();
```

## GCP Monitoring Setup

### Cloud Monitoring Configuration
```yaml
# monitoring-policy.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: hotgigs-gcp-rules
spec:
  groups:
  - name: gcp.rules
    rules:
    - alert: HighCPUUsage
      expr: rate(container_cpu_usage_seconds_total[5m]) * 100 > 80
      for: 5m
      labels:
        severity: warning
        cloud: gcp
      annotations:
        summary: "High CPU usage detected"
        description: "CPU usage is above 80% for more than 5 minutes"
        
    - alert: HighMemoryUsage
      expr: (container_memory_usage_bytes / container_spec_memory_limit_bytes) * 100 > 85
      for: 5m
      labels:
        severity: warning
        cloud: gcp
      annotations:
        summary: "High memory usage detected"
        description: "Memory usage is above 85% for more than 5 minutes"
```

### Stackdriver Logging Configuration
```yaml
# logging-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush         1
        Log_Level     info
        Daemon        off
        Parsers_File  parsers.conf
        
    [INPUT]
        Name              tail
        Path              /var/log/containers/*.log
        Parser            docker
        Tag               kube.*
        Refresh_Interval  5
        
    [OUTPUT]
        Name  stackdriver
        Match *
        google_service_credentials /var/secrets/google/key.json
        resource k8s_container
```

## Unified Alerting Rules

### Common Alert Rules
```yaml
# common-alert-rules.yml
groups:
- name: hotgigs.rules
  rules:
  # Application Health
  - alert: ApplicationDown
    expr: up{job="hotgigs-backend"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "HotGigs application is down"
      description: "Application has been down for more than 1 minute"
      
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High error rate detected"
      description: "Error rate is above 10% for more than 5 minutes"
      
  # Database Alerts
  - alert: DatabaseConnectionsHigh
    expr: database_connections_active / database_connections_max > 0.8
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Database connections high"
      description: "Database connections are above 80% of maximum"
      
  - alert: DatabaseSlowQueries
    expr: rate(database_slow_queries_total[5m]) > 10
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High number of slow database queries"
      description: "More than 10 slow queries per second"
      
  # Infrastructure Alerts
  - alert: HighCPUUsage
    expr: cpu_usage_percent > 80
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage"
      description: "CPU usage is above 80% for more than 10 minutes"
      
  - alert: HighMemoryUsage
    expr: memory_usage_percent > 85
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage"
      description: "Memory usage is above 85% for more than 10 minutes"
      
  - alert: DiskSpaceLow
    expr: disk_free_percent < 20
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Low disk space"
      description: "Disk space is below 20%"
```

## Alertmanager Configuration

### Multi-Cloud Alertmanager Setup
```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@hotgigs.ai'
  slack_api_url: '${SLACK_WEBHOOK_URL}'

route:
  group_by: ['alertname', 'cloud']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'
  routes:
  - match:
      severity: critical
    receiver: 'critical-alerts'
  - match:
      cloud: aws
    receiver: 'aws-alerts'
  - match:
      cloud: azure
    receiver: 'azure-alerts'
  - match:
      cloud: gcp
    receiver: 'gcp-alerts'

receivers:
- name: 'web.hook'
  webhook_configs:
  - url: 'http://127.0.0.1:5001/'
    
- name: 'critical-alerts'
  email_configs:
  - to: 'devops@hotgigs.ai'
    subject: 'CRITICAL: {{ .GroupLabels.alertname }}'
    body: |
      {{ range .Alerts }}
      Alert: {{ .Annotations.summary }}
      Description: {{ .Annotations.description }}
      Cloud: {{ .Labels.cloud }}
      {{ end }}
  slack_configs:
  - channel: '#critical-alerts'
    title: 'CRITICAL Alert'
    text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
    
- name: 'aws-alerts'
  slack_configs:
  - channel: '#aws-monitoring'
    title: 'AWS Alert'
    text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
    
- name: 'azure-alerts'
  slack_configs:
  - channel: '#azure-monitoring'
    title: 'Azure Alert'
    text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
    
- name: 'gcp-alerts'
  slack_configs:
  - channel: '#gcp-monitoring'
    title: 'GCP Alert'
    text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
```

## Grafana Dashboards

### Multi-Cloud Dashboard Configuration
```json
{
  "dashboard": {
    "title": "HotGigs.ai Multi-Cloud Overview",
    "panels": [
      {
        "title": "Application Health by Cloud",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"hotgigs-backend\"}",
            "legendFormat": "{{cloud}} - {{instance}}"
          }
        ]
      },
      {
        "title": "Request Rate by Cloud",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{cloud}} - {{method}} {{status}}"
          }
        ]
      },
      {
        "title": "Response Time by Cloud",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "{{cloud}} - 95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate by Cloud",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m])",
            "legendFormat": "{{cloud}} - Error Rate"
          }
        ]
      }
    ]
  }
}
```

## Log Aggregation

### Centralized Logging Setup
```yaml
# fluentd-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      format json
      time_format %Y-%m-%dT%H:%M:%S.%NZ
    </source>
    
    <filter kubernetes.**>
      @type kubernetes_metadata
    </filter>
    
    <match kubernetes.**>
      @type copy
      <store>
        @type elasticsearch
        host elasticsearch.logging.svc.cluster.local
        port 9200
        index_name hotgigs-logs
        type_name _doc
      </store>
      <store>
        @type s3
        aws_key_id "#{ENV['AWS_ACCESS_KEY_ID']}"
        aws_sec_key "#{ENV['AWS_SECRET_ACCESS_KEY']}"
        s3_bucket hotgigs-logs-backup
        s3_region us-east-1
        path logs/
        buffer_type file
        buffer_path /var/log/fluent/s3
        time_slice_format %Y%m%d%H
        time_slice_wait 10m
      </store>
    </match>
```

## Health Check Endpoints

### Multi-Cloud Health Check Script
```bash
#!/bin/bash
# health-check-multi-cloud.sh

CLOUDS=("aws" "azure" "gcp")
ENVIRONMENTS=("staging" "production")

for cloud in "${CLOUDS[@]}"; do
    for env in "${ENVIRONMENTS[@]}"; do
        echo "Checking $cloud $env..."
        
        # Get endpoint URL based on cloud and environment
        case $cloud in
            "aws")
                URL="https://hotgigs-$env-aws.hotgigs.ai"
                ;;
            "azure")
                URL="https://hotgigs-$env-azure.hotgigs.ai"
                ;;
            "gcp")
                URL="https://hotgigs-$env-gcp.hotgigs.ai"
                ;;
        esac
        
        # Perform health check
        if curl -f "$URL/api/health" --max-time 30 --silent; then
            echo "✅ $cloud $env: Healthy"
        else
            echo "❌ $cloud $env: Unhealthy"
            # Send alert
            curl -X POST -H 'Content-type: application/json' \
                --data "{\"text\":\"🚨 Health check failed for $cloud $env\"}" \
                "$SLACK_WEBHOOK_URL"
        fi
    done
done
```

## Monitoring Deployment Scripts

### Deploy Monitoring Stack
```bash
#!/bin/bash
# deploy-monitoring.sh

CLOUD_PROVIDER="$1"
ENVIRONMENT="$2"

case $CLOUD_PROVIDER in
    "aws")
        # Deploy CloudWatch dashboards
        aws cloudformation deploy \
            --template-file monitoring/aws/cloudwatch-dashboard.yaml \
            --stack-name hotgigs-monitoring-$ENVIRONMENT \
            --parameter-overrides Environment=$ENVIRONMENT
        ;;
    "azure")
        # Deploy Azure Monitor
        az deployment group create \
            --resource-group hotgigs-$ENVIRONMENT \
            --template-file monitoring/azure/monitor-template.json \
            --parameters environment=$ENVIRONMENT
        ;;
    "gcp")
        # Deploy Stackdriver monitoring
        gcloud deployment-manager deployments create \
            hotgigs-monitoring-$ENVIRONMENT \
            --config monitoring/gcp/monitoring-config.yaml
        ;;
esac

# Deploy Prometheus and Grafana
kubectl apply -f monitoring/prometheus/
kubectl apply -f monitoring/grafana/
kubectl apply -f monitoring/alertmanager/

echo "Monitoring stack deployed for $CLOUD_PROVIDER $ENVIRONMENT"
```

## Cost Monitoring

### Multi-Cloud Cost Alerts
```yaml
# cost-monitoring.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cost-monitoring-config
data:
  config.yaml: |
    clouds:
      aws:
        budget_threshold: 1000
        alert_threshold: 0.8
      azure:
        budget_threshold: 1000
        alert_threshold: 0.8
      gcp:
        budget_threshold: 1000
        alert_threshold: 0.8
    
    notifications:
      slack_webhook: "${SLACK_WEBHOOK_URL}"
      email: "finance@hotgigs.ai"
```

This comprehensive monitoring setup provides:
- Cloud-specific monitoring configurations
- Unified alerting across all clouds
- Centralized logging and metrics
- Cost monitoring and alerts
- Health checks and automated responses
- Grafana dashboards for visualization
- Integration with Slack and email notifications

