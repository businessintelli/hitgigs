# HotGigs ATS Database Setup and Migration Guide

## Overview

This directory contains the database migration scripts and tools for the HotGigs ATS system. The migration system supports the comprehensive ATS workflow and candidate management features.

## Database Schema Changes

### Version 2.0 - Comprehensive ATS System

This migration adds support for:

- **Enhanced Candidate Management**: Domain expertise, AI insights, performance metrics
- **Application Tracking**: Detailed feedback analysis, interview scheduling
- **Job Management**: AI generation, templates, bulk import
- **Hot List Management**: Bench candidates with performance ratings
- **Resume Management**: Parsing, one-page summaries, document verification
- **Analytics & Insights**: Performance metrics, skill demand analysis
- **Workflow Tracking**: Candidate submissions, bulk operations
- **Notification System**: Real-time updates and alerts

## Files Structure

```
database/
├── migrations/
│   ├── 001_initial_schema.sql          # Initial database schema
│   └── 002_comprehensive_ats_system.sql # ATS features migration
├── migrate.py                          # Migration runner script
├── README.md                          # This file
└── .env.example                       # Environment variables template
```

## Prerequisites

1. **PostgreSQL 12+** installed and running
2. **Python 3.8+** with psycopg2 package
3. **Database created** for HotGigs ATS

## Installation

### 1. Install Python Dependencies

```bash
pip install psycopg2-binary python-dotenv
```

### 2. Database Setup

Create the database if it doesn't exist:

```sql
CREATE DATABASE hotgigs_db;
CREATE USER hotgigs_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE hotgigs_db TO hotgigs_user;
```

### 3. Environment Configuration

Create a `.env` file in the database directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotgigs_db
DB_USER=hotgigs_user
DB_PASSWORD=your_secure_password
```

## Running Migrations

### Automatic Migration

Run the migration script to apply all pending migrations:

```bash
cd database
python migrate.py
```

### Manual Migration

If you prefer to run migrations manually:

```bash
# Connect to your database
psql -h localhost -U hotgigs_user -d hotgigs_db

# Run the migration file
\i migrations/002_comprehensive_ats_system.sql
```

## Migration Features

### 1. Safe Execution
- **Transaction-based**: Each migration runs in a transaction
- **Rollback support**: Failed migrations are automatically rolled back
- **Duplicate protection**: Migrations won't run twice
- **Checksum verification**: Ensures migration integrity

### 2. Tracking
- **Migration history**: All executions are logged
- **Performance metrics**: Execution time tracking
- **Success/failure status**: Clear migration status
- **Detailed logging**: Comprehensive logs for debugging

### 3. Error Handling
- **Graceful failures**: Detailed error messages
- **Recovery support**: Failed migrations can be retried
- **Validation**: Pre-execution checks

## New Database Tables

### Core Tables
- `candidate_domain_expertise` - AI-identified domain knowledge
- `candidate_resumes` - Resume file management and parsing
- `candidate_performance_metrics` - Application success tracking
- `candidate_ai_insights` - AI recommendations and insights
- `application_feedback_analysis` - Sentiment analysis of feedback

### Workflow Tables
- `candidate_submissions` - Recruiter candidate submissions
- `hot_list_candidates` - Bench candidate management
- `interviews` - Interview scheduling and tracking
- `bulk_import_jobs` - Bulk operation tracking

### System Tables
- `job_templates` - Reusable job posting templates
- `skill_market_demand` - Market analysis data
- `candidate_documents` - Document management
- `notifications` - User notification system
- `system_settings` - Configuration management
- `audit_log` - System activity tracking

## Enhanced Existing Tables

### Candidates Table
- Profile images and social links
- Salary expectations and availability
- Source tracking and tagging
- Performance metadata

### Jobs Table
- AI generation flags and prompts
- View and application counters
- Enhanced job details
- Template and import tracking

### Applications Table
- Detailed stage tracking
- Feedback and interview notes
- Match scores and AI recommendations
- Submission workflow data

## Database Views

### `candidate_full_profile`
Comprehensive candidate view with:
- Basic candidate information
- Performance metrics
- AI insights and scores
- Hot list status

### `application_details`
Complete application information with:
- Candidate and job details
- Company information
- Feedback analysis
- Submission tracking

## Performance Optimizations

### Indexes
- **Primary indexes**: All foreign keys and frequently queried columns
- **Composite indexes**: Multi-column queries optimization
- **Partial indexes**: Active records optimization
- **Performance indexes**: Status and date-based queries

### Triggers
- **Automatic timestamps**: Updated_at column maintenance
- **Data consistency**: Cross-table validation
- **Audit logging**: Change tracking

## Sample Data

The migration includes sample data for:
- **Skill market demand**: Popular programming skills with market data
- **System settings**: Default configuration values
- **Performance baselines**: Reference metrics

## Monitoring and Maintenance

### Migration Status Check

```python
# Check migration status
python -c "
from migrate import DatabaseMigrator
migrator = DatabaseMigrator('your_connection_string')
migrator.connect()
migrator.create_migration_table()
status = migrator.get_migration_status()
for m in status:
    print(f'{m[\"version\"]}: {m[\"name\"]} - {\"✅\" if m[\"success\"] else \"❌\"}')
"
```

### Performance Monitoring

```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    indexrelname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check database credentials in `.env`
   - Ensure PostgreSQL is running
   - Verify network connectivity

2. **Permission Denied**
   - Check user privileges
   - Ensure database ownership
   - Verify schema permissions

3. **Migration Failed**
   - Check migration logs
   - Verify data integrity
   - Review error messages

### Recovery Steps

1. **Rollback Failed Migration**
   ```sql
   DELETE FROM schema_migrations WHERE version = 'failed_version';
   ```

2. **Reset Migration State**
   ```sql
   TRUNCATE schema_migrations;
   ```

3. **Manual Cleanup**
   ```sql
   -- Drop tables if needed
   DROP TABLE IF EXISTS table_name CASCADE;
   ```

## Security Considerations

1. **Database Credentials**: Store securely, use environment variables
2. **User Permissions**: Grant minimal required privileges
3. **Network Security**: Use SSL connections in production
4. **Backup Strategy**: Regular backups before migrations
5. **Audit Logging**: Monitor all database changes

## Production Deployment

### Pre-deployment Checklist
- [ ] Database backup completed
- [ ] Migration tested in staging
- [ ] Performance impact assessed
- [ ] Rollback plan prepared
- [ ] Monitoring alerts configured

### Deployment Steps
1. **Backup database**
2. **Run migrations in maintenance window**
3. **Verify data integrity**
4. **Update application configuration**
5. **Monitor system performance**

## Support

For issues or questions:
1. Check the migration logs
2. Review this documentation
3. Verify database connectivity
4. Contact the development team

---

**Migration Version**: 2.0  
**Last Updated**: 2024-01-26  
**Compatibility**: PostgreSQL 12+, Python 3.8+

