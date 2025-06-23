# Supabase Setup Guide for HotGigs.ai

## Prerequisites
1. Supabase account (https://supabase.com)
2. Supabase CLI installed (optional but recommended)

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose your organization
4. Set project name: "hotgigs-ai"
5. Set database password (save this securely)
6. Choose region closest to your users
7. Click "Create new project"

## Step 2: Configure Database

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your project dashboard
2. Navigate to "SQL Editor"
3. Copy and paste the contents of `backend/migrations/001_initial_schema.sql`
4. Click "Run" to execute the migration

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push
```

## Step 3: Configure Row Level Security (RLS)

Execute the following SQL in the Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelance_recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- User profiles
CREATE POLICY "Users can view own user profile" ON user_profiles
    FOR ALL USING (user_id = auth.uid());

-- OAuth accounts
CREATE POLICY "Users can manage own oauth accounts" ON oauth_accounts
    FOR ALL USING (user_id = auth.uid());

-- Companies - members can view company data
CREATE POLICY "Company members can view company" ON companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Company members
CREATE POLICY "Company members can view team" ON company_members
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Jobs - public jobs viewable by all, private jobs by company members
CREATE POLICY "Public jobs viewable by all" ON jobs
    FOR SELECT USING (
        is_public = true OR 
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Applications - candidates can view their own, companies can view applications to their jobs
CREATE POLICY "Candidates can view own applications" ON applications
    FOR SELECT USING (
        candidate_id IN (
            SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Companies can view applications to their jobs" ON applications
    FOR SELECT USING (
        job_id IN (
            SELECT j.id FROM jobs j
            JOIN company_members cm ON j.company_id = cm.company_id
            WHERE cm.user_id = auth.uid() AND cm.is_active = true
        )
    );

-- Candidate profiles - candidates can manage their own
CREATE POLICY "Candidates can manage own profile" ON candidate_profiles
    FOR ALL USING (user_id = auth.uid());

-- Documents - users can manage their own documents
CREATE POLICY "Users can manage own documents" ON documents
    FOR ALL USING (user_id = auth.uid());

-- Notifications - users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR ALL USING (user_id = auth.uid());

-- AI job matches - candidates can view their matches
CREATE POLICY "Candidates can view own job matches" ON ai_job_matches
    FOR SELECT USING (
        candidate_id IN (
            SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
        )
    );
```

## Step 4: Configure Authentication

1. Go to "Authentication" > "Settings" in Supabase dashboard
2. Configure OAuth providers:

### Google OAuth
- Enable Google provider
- Add your Google Client ID and Secret from .env file
- Set redirect URL: `https://your-domain.com/auth/callback`

### GitHub OAuth
- Enable GitHub provider
- Add your GitHub Client ID and Secret from .env file
- Set redirect URL: `https://your-domain.com/auth/callback`

### LinkedIn OAuth (if available)
- Enable LinkedIn provider
- Add your LinkedIn Client ID and Secret from .env file

## Step 5: Get API Keys

1. Go to "Settings" > "API" in Supabase dashboard
2. Copy the following values to your `.env` file:
   - Project URL → `SUPABASE_URL`
   - Anon public key → `SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 6: Configure Storage (Optional)

1. Go to "Storage" in Supabase dashboard
2. Create buckets for file uploads:
   - `resumes` - for resume files
   - `documents` - for other documents
   - `avatars` - for profile images
   - `company-logos` - for company logos

3. Set up storage policies for each bucket

## Step 7: Test Connection

Create a simple test script to verify the connection:

```python
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

# Test query
try:
    result = supabase.table('users').select("*").limit(1).execute()
    print("✅ Supabase connection successful!")
    print(f"Users table exists: {len(result.data) >= 0}")
except Exception as e:
    print(f"❌ Connection failed: {e}")
```

## Environment Variables

Update your `.env` file with the Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Security Considerations

1. **Never expose service role key** in frontend code
2. Use anon key for frontend, service role key for backend admin operations
3. Implement proper RLS policies for all tables
4. Regularly audit and update security policies
5. Enable database backups and point-in-time recovery
6. Monitor database performance and usage

## Monitoring and Maintenance

1. Set up database monitoring in Supabase dashboard
2. Configure alerts for high usage or errors
3. Regular backup verification
4. Performance optimization based on usage patterns
5. Security audit and policy updates

## Troubleshooting

### Common Issues:

1. **Connection timeout**: Check network and firewall settings
2. **RLS policy errors**: Verify policies are correctly configured
3. **Migration failures**: Check for syntax errors and dependencies
4. **Performance issues**: Review indexes and query optimization

### Support Resources:

- Supabase Documentation: https://supabase.com/docs
- Community Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase

## Next Steps

After completing the Supabase setup:

1. Test all database operations
2. Verify RLS policies work correctly
3. Set up monitoring and alerts
4. Configure backup and recovery procedures
5. Document any custom configurations for your team

