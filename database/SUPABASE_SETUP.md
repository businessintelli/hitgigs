# HotGigs ATS Supabase Migration Guide

## Overview

This guide helps you migrate your HotGigs ATS database schema to Supabase PostgreSQL using your existing environment configuration.

## Prerequisites

✅ **Supabase Project**: Active Supabase project with PostgreSQL database  
✅ **Environment Variables**: Configured in `/backend/hotgigs-api/.env`  
✅ **Python 3.8+**: With required packages  
✅ **Database Access**: Supabase service role key with admin privileges  

## Quick Start

### 1. Install Dependencies

```bash
pip install psycopg2-binary python-dotenv
```

### 2. Run Supabase Migration

```bash
cd database
python migrate_supabase.py
```

The script will automatically:
- 🔍 **Find your existing `.env`** files in the backend directory
- 🔗 **Connect to Supabase** using your configured credentials
- 📊 **Run all migrations** safely with transaction support
- ✅ **Verify success** and show detailed status

## Environment Variables

The migration script looks for these variables in your existing backend `.env` files:

### Option 1: Supabase-Specific Variables
```env
SUPABASE_HOST=your-project-ref.supabase.co
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-supabase-password
SUPABASE_PORT=5432
```

### Option 2: Database URL (Recommended)
```env
DATABASE_URL=postgresql://postgres:your-password@your-project-ref.supabase.co:5432/postgres
```

### Option 3: Standard PostgreSQL Variables
```env
DB_HOST=your-project-ref.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
```

## Migration Process

### What Gets Created

The migration will create **15 new tables** and enhance **4 existing tables**:

#### 🆕 New Tables:
1. **`candidate_domain_expertise`** - AI-identified domain knowledge
2. **`candidate_resumes`** - Resume file management and parsing
3. **`candidate_performance_metrics`** - Success rates and analytics
4. **`candidate_ai_insights`** - AI recommendations and career insights
5. **`application_feedback_analysis`** - Sentiment analysis and feedback
6. **`candidate_submissions`** - Recruiter submission workflow
7. **`hot_list_candidates`** - Bench candidate management
8. **`job_templates`** - Reusable job posting templates
9. **`skill_market_demand`** - Market analysis and skill demand
10. **`interviews`** - Interview scheduling and tracking
11. **`candidate_documents`** - Document management with verification
12. **`bulk_import_jobs`** - Bulk operation tracking
13. **`notifications`** - User notification system
14. **`system_settings`** - Configuration management
15. **`audit_log`** - Complete activity tracking

#### 🔧 Enhanced Tables:
- **`candidates`** - Profile images, salary data, tags, social links
- **`jobs`** - AI generation flags, view counters, enhanced metadata
- **`applications`** - Stage tracking, feedback, match scores
- **`candidate_skills`** - Proficiency levels and categories

### Safety Features

✅ **Transaction Safety**: Each migration runs in a transaction with automatic rollback  
✅ **Duplicate Protection**: Migrations won't run twice  
✅ **Progress Tracking**: Detailed execution logs and status  
✅ **Error Recovery**: Failed migrations can be retried  
✅ **Supabase Optimized**: SSL connections and Supabase-specific features  

## Expected Output

When you run the migration, you'll see:

```
🚀 Starting HotGigs ATS Supabase Migration
INFO - Loaded environment from: /home/ubuntu/hotgigs-ai/backend/hotgigs-api/.env
INFO - Using Supabase connection: your-project-ref.supabase.co
INFO - Connected to PostgreSQL: PostgreSQL 15.1 on x86_64-pc-linux-gnu
INFO - ✅ Database permissions verified
INFO - Migration tracking table ready
INFO - Found 1 migration files
INFO - Executing migration 002: comprehensive_ats_system
INFO - Migration 002 completed successfully in 2847ms
INFO - Completed 1/1 migrations
🎉 All migrations completed successfully!

📋 Migration Status:
--------------------------------------------------------------------------------
✅ 002: comprehensive_ats_system (2847ms)

🎯 Next Steps:
1. Restart your backend server
2. Test the new ATS features in your frontend
3. Verify data integrity in Supabase dashboard
```

## Verification

### 1. Check Supabase Dashboard

Go to your Supabase project dashboard:
- **Database** → **Tables**: Verify new tables are created
- **Database** → **Indexes**: Check performance indexes
- **Database** → **Functions**: Verify triggers are active

### 2. Test Backend Connection

Restart your backend server and check if it connects properly:

```bash
cd backend/hotgigs-api
python app.py
```

### 3. Verify Frontend Features

Test the new ATS features:
- ✅ **Jobs page**: Enhanced job management
- ✅ **Candidates page**: Master list and hot list
- ✅ **Job details**: Candidate submission workflow
- ✅ **Application tracking**: ATS workflow tabs

## Troubleshooting

### Common Issues

#### 1. Connection Failed
```
❌ Failed to connect to Supabase database
```

**Solutions:**
- Check your Supabase project is active
- Verify environment variables in backend `.env`
- Ensure your IP is allowed in Supabase settings
- Check if service role key has admin privileges

#### 2. Permission Denied
```
❌ Supabase connection test failed
```

**Solutions:**
- Use service role key instead of anon key
- Check database user permissions
- Verify SSL connection settings

#### 3. Migration Already Applied
```
INFO - Migration 002 already applied, skipping
```

This is normal - migrations won't run twice. If you need to re-run:

```sql
-- Connect to Supabase SQL editor and run:
DELETE FROM schema_migrations WHERE version = '002';
```

### Manual Verification

If you want to manually check the migration:

```sql
-- Check if migration table exists
SELECT * FROM schema_migrations;

-- Check new tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'candidate_%';

-- Check enhanced columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'candidates' 
AND column_name IN ('profile_image', 'current_company', 'tags');
```

## Rollback (If Needed)

If you need to rollback the migration:

```sql
-- WARNING: This will delete all new tables and data
-- Only run if you're sure you want to rollback

DROP TABLE IF EXISTS candidate_domain_expertise CASCADE;
DROP TABLE IF EXISTS candidate_resumes CASCADE;
DROP TABLE IF EXISTS candidate_performance_metrics CASCADE;
-- ... (continue for all new tables)

-- Remove added columns (be careful with existing data)
ALTER TABLE candidates DROP COLUMN IF EXISTS profile_image;
ALTER TABLE candidates DROP COLUMN IF EXISTS current_company;
-- ... (continue for all added columns)

-- Remove migration record
DELETE FROM schema_migrations WHERE version = '002';
```

## Performance Considerations

### Supabase Limits

- **Free Tier**: 500MB database size, 2 concurrent connections
- **Pro Tier**: 8GB database size, 60 concurrent connections
- **Indexes**: The migration creates 45+ indexes for optimal performance

### Optimization Tips

1. **Monitor Usage**: Check Supabase dashboard for performance metrics
2. **Index Usage**: Monitor query performance in Supabase logs
3. **Connection Pooling**: Use connection pooling in production
4. **Backup Strategy**: Enable Supabase automatic backups

## Support

### Getting Help

1. **Check Logs**: Review migration.log for detailed error messages
2. **Supabase Dashboard**: Use SQL editor for manual verification
3. **Environment Check**: Verify all environment variables are correct
4. **Network Issues**: Check firewall and IP allowlist settings

### Contact Information

For technical support:
- **Migration Issues**: Check this documentation first
- **Supabase Issues**: Refer to Supabase documentation
- **Application Issues**: Test with backend team

---

**Migration Version**: 2.0 (Supabase Compatible)  
**Last Updated**: 2024-01-26  
**Compatibility**: Supabase PostgreSQL, Python 3.8+

