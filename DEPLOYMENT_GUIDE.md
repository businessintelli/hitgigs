# HotGigs.ai Deployment Guide

**Version**: 2.0 (Phase 4 Enhanced)  
**Date**: December 23, 2024  
**Author**: Manus AI  

## Overview

This deployment guide provides comprehensive instructions for deploying the HotGigs.ai platform to production environments. The guide covers environment setup, configuration requirements, security considerations, and operational procedures.

**🚀 Phase 4 Enhancements:**
- Performance-optimized backend with caching and connection pooling
- 5 new API modules: Documents, Analytics, AI Services, Candidates, Notifications
- Enhanced security with rate limiting and input sanitization
- Production-ready monitoring and observability features

## Prerequisites

### System Requirements

**Minimum Server Specifications:**
- CPU: 4 cores (8 cores recommended for production)
- RAM: 8GB (16GB recommended for production)
- Storage: 100GB SSD (500GB recommended for production)
- Network: High-speed internet connection with static IP

**Enhanced Performance Requirements (Phase 4):**
- Redis server for caching (recommended for production)
- Load balancer for horizontal scaling
- Database connection pooling (100+ concurrent connections)
- CDN for static asset delivery

**Software Dependencies:**
- Ubuntu 22.04 LTS or compatible Linux distribution
- Python 3.11+ with pip package manager
- Node.js 20.x with npm/yarn package manager
- PostgreSQL 12+ database server
- Redis 6.x for caching (optional but recommended)
- Nginx web server for reverse proxy and SSL termination
- SSL/TLS certificates for HTTPS encryption

### External Service Requirements

**Supabase Configuration:**
- Supabase project with PostgreSQL database
- Authentication service configuration
- API keys and connection credentials
- Database schema deployment

**OpenAI Integration:**
- OpenAI API account with sufficient credits
- API key configuration for AI-powered features
- Rate limiting and usage monitoring setup

## Environment Setup

### Backend Deployment

**1. Server Preparation:**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL client tools
sudo apt install postgresql-client -y

# Install Nginx
sudo apt install nginx -y
```

**2. Application Setup:**
```bash
# Clone repository
git clone https://github.com/your-org/hotgigs-ai.git
cd hotgigs-ai

# Setup backend environment
cd backend/hotgigs-api
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**3. Environment Configuration:**
Create `.env` file in backend directory:
```env
# Database Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Application Configuration
FLASK_ENV=production
SECRET_KEY=your_secret_key_here
PORT=5001

# CORS Configuration
FRONTEND_URL=https://your-domain.com
```

**4. Database Setup:**
```bash
# Run database migrations
cd src
python -c "
from models.database import SupabaseService
db = SupabaseService()
# Run schema.sql file
with open('../schema.sql', 'r') as f:
    schema = f.read()
    # Execute schema (manual process required)
"
```

### Frontend Deployment

**1. Build Process:**
```bash
# Navigate to frontend directory
cd ../../frontend/hotgigs-frontend

# Install dependencies
npm install

# Build for production
npm run build
```

**2. Environment Configuration:**
Create `.env.production` file:
```env
VITE_API_URL=https://api.your-domain.com
VITE_APP_NAME=HotGigs.ai
```

### Nginx Configuration

**1. Backend Proxy Configuration:**
Create `/etc/nginx/sites-available/hotgigs-api`:
```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    
    location / {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://your-domain.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

**2. Frontend Configuration:**
Create `/etc/nginx/sites-available/hotgigs-frontend`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/hotgigs-ai/frontend/hotgigs-frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**3. Enable Sites:**
```bash
sudo ln -s /etc/nginx/sites-available/hotgigs-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/hotgigs-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL/TLS Configuration

**1. Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**2. Obtain SSL Certificates:**
```bash
sudo certbot --nginx -d your-domain.com -d api.your-domain.com
```

### Process Management

**1. Backend Service Configuration:**
Create `/etc/systemd/system/hotgigs-api.service`:
```ini
[Unit]
Description=HotGigs.ai API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/hotgigs-ai/backend/hotgigs-api/src
Environment=PATH=/path/to/hotgigs-ai/backend/hotgigs-api/venv/bin
ExecStart=/path/to/hotgigs-ai/backend/hotgigs-api/venv/bin/python main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

**2. Enable and Start Services:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable hotgigs-api
sudo systemctl start hotgigs-api
sudo systemctl status hotgigs-api
```

## Security Configuration

### Firewall Setup

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Security Headers

Add to Nginx configuration:
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

### Database Security

1. Configure PostgreSQL with restricted access
2. Use strong passwords for all database accounts
3. Enable SSL connections for database communication
4. Regular backup and recovery testing

## Monitoring and Logging

### Application Monitoring

**1. Log Configuration:**
```bash
# Create log directories
sudo mkdir -p /var/log/hotgigs
sudo chown www-data:www-data /var/log/hotgigs
```

**2. Log Rotation:**
Create `/etc/logrotate.d/hotgigs`:
```
/var/log/hotgigs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### Performance Monitoring

1. Install monitoring tools (htop, iotop, netstat)
2. Configure application performance monitoring
3. Set up database performance tracking
4. Implement user experience monitoring

## Backup and Recovery

### Database Backup

```bash
# Create backup script
#!/bin/bash
BACKUP_DIR="/var/backups/hotgigs"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h your_supabase_host -U your_user -d your_database > $BACKUP_DIR/hotgigs_$DATE.sql
```

### Application Backup

```bash
# Backup application files
tar -czf /var/backups/hotgigs/app_backup_$(date +%Y%m%d).tar.gz /path/to/hotgigs-ai
```

## Troubleshooting

### Common Issues

**CORS Errors:**
- Verify CORS configuration in Flask application
- Check Nginx proxy headers
- Validate frontend API URL configuration

**Database Connection Issues:**
- Verify Supabase credentials and connection strings
- Check network connectivity to Supabase
- Validate database schema and permissions

**Performance Issues:**
- Monitor server resources (CPU, memory, disk)
- Check database query performance
- Analyze application logs for bottlenecks

### Log Analysis

```bash
# View application logs
sudo journalctl -u hotgigs-api -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Maintenance Procedures

### Regular Updates

1. **Weekly**: Security updates and patches
2. **Monthly**: Dependency updates and testing
3. **Quarterly**: Performance optimization and scaling review

### Health Checks

```bash
# API health check
curl -f https://api.your-domain.com/api/health

# Frontend availability check
curl -f https://your-domain.com

# Database connectivity check
# (Use appropriate database monitoring tools)
```

### Scaling Considerations

1. **Horizontal Scaling**: Load balancer configuration for multiple application instances
2. **Database Scaling**: Read replicas and connection pooling optimization
3. **CDN Integration**: Static asset delivery optimization
4. **Caching**: Redis implementation for session and data caching

## Support and Documentation

### Emergency Contacts

- **Technical Lead**: [Contact Information]
- **DevOps Team**: [Contact Information]
- **Database Administrator**: [Contact Information]

### Documentation Resources

- API Documentation: `/docs/api/`
- User Guides: `/docs/users/`
- Administrator Guides: `/docs/admin/`
- Troubleshooting: `/docs/troubleshooting/`

---

**Document Version**: 1.0  
**Last Updated**: June 24, 2025  
**Next Review**: July 24, 2025

