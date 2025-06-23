# HotGigs.ai Database Schema Design

## Overview
This document outlines the comprehensive database schema for HotGigs.ai, supporting multi-tenant architecture with role-based access control, AI features, and enterprise-grade functionality.

## Core Principles
- Multi-tenant architecture with row-level security
- Role-based access control (Candidates, Companies, Freelance Recruiters)
- Audit trails for all critical operations
- Optimized for AI features and analytics
- GDPR/CCPA compliance ready

## Database Tables (25+ Tables)

### 1. User Management Tables

#### users
Primary user table for all platform users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    profile_image_url TEXT,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('candidate', 'company', 'freelance_recruiter')),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### user_profiles
Extended profile information for all users
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    location VARCHAR(255),
    timezone VARCHAR(50),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    website_url VARCHAR(255),
    preferred_language VARCHAR(10) DEFAULT 'en',
    notification_preferences JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### oauth_accounts
OAuth integration for social authentication
```sql
CREATE TABLE oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    scope TEXT,
    token_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);
```

### 2. Company Management Tables

#### companies
Company information and settings
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    website_url VARCHAR(255),
    logo_url TEXT,
    headquarters_location VARCHAR(255),
    founded_year INTEGER,
    company_type VARCHAR(50),
    is_verified BOOLEAN DEFAULT false,
    subscription_plan VARCHAR(50) DEFAULT 'free',
    subscription_expires_at TIMESTAMP,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### company_members
Company team members and their roles
```sql
CREATE TABLE company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'recruiter', 'account_manager', 'viewer')),
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP,
    joined_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);
```

### 3. Job Management Tables

#### jobs
Job postings and details
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    posted_by UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'contract', 'freelance', 'internship')),
    experience_level VARCHAR(50) CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
    location VARCHAR(255),
    remote_type VARCHAR(50) CHECK (remote_type IN ('on_site', 'remote', 'hybrid')),
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(20) DEFAULT 'yearly',
    skills JSONB DEFAULT '[]',
    department VARCHAR(100),
    employment_status VARCHAR(50) DEFAULT 'open',
    application_deadline TIMESTAMP,
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    ai_generated_content JSONB DEFAULT '{}',
    seo_keywords TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### job_skills
Skills required for jobs (many-to-many relationship)
```sql
CREATE TABLE job_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Candidate Management Tables

#### candidate_profiles
Extended candidate information
```sql
CREATE TABLE candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(255),
    summary TEXT,
    current_title VARCHAR(255),
    current_company VARCHAR(255),
    experience_years INTEGER,
    education_level VARCHAR(50),
    availability VARCHAR(50) CHECK (availability IN ('immediately', 'within_2_weeks', 'within_month', 'not_looking')),
    desired_salary_min INTEGER,
    desired_salary_max INTEGER,
    desired_salary_currency VARCHAR(3) DEFAULT 'USD',
    desired_job_types TEXT[],
    desired_locations TEXT[],
    remote_preference VARCHAR(50),
    skills JSONB DEFAULT '[]',
    languages JSONB DEFAULT '[]',
    portfolio_url VARCHAR(255),
    resume_url TEXT,
    cover_letter_template TEXT,
    ai_score JSONB DEFAULT '{}',
    visibility_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### candidate_experiences
Work experience history
```sql
CREATE TABLE candidate_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    location VARCHAR(255),
    achievements TEXT[],
    skills_used TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### candidate_education
Education history
```sql
CREATE TABLE candidate_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    gpa DECIMAL(3,2),
    description TEXT,
    achievements TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Application Management Tables

#### applications
Job applications and tracking
```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interviewing', 'offer', 'hired', 'rejected', 'withdrawn')),
    cover_letter TEXT,
    resume_url TEXT,
    additional_documents JSONB DEFAULT '[]',
    application_source VARCHAR(100),
    referrer_id UUID REFERENCES users(id),
    ai_match_score DECIMAL(5,2),
    ai_analysis JSONB DEFAULT '{}',
    recruiter_notes TEXT,
    rejection_reason TEXT,
    rejection_feedback TEXT,
    applied_at TIMESTAMP DEFAULT NOW(),
    last_updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### application_timeline
Application status history and timeline
```sql
CREATE TABLE application_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Interview Management Tables

#### interviews
Interview scheduling and management
```sql
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    interviewer_id UUID REFERENCES users(id),
    interview_type VARCHAR(50) CHECK (interview_type IN ('phone', 'video', 'in_person', 'ai_interview')),
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location VARCHAR(255),
    meeting_link VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    feedback TEXT,
    score INTEGER CHECK (score >= 1 AND score <= 10),
    ai_analysis JSONB DEFAULT '{}',
    recording_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### ai_interview_sessions
AI-powered interview sessions
```sql
CREATE TABLE ai_interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    session_type VARCHAR(50) CHECK (session_type IN ('technical', 'behavioral', 'cultural_fit')),
    questions JSONB NOT NULL,
    responses JSONB NOT NULL,
    ai_scores JSONB DEFAULT '{}',
    overall_score DECIMAL(5,2),
    recommendations TEXT,
    session_duration INTEGER,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Document Management Tables

#### documents
Document storage and management
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('resume', 'cover_letter', 'portfolio', 'certificate', 'contract', 'other')),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    is_public BOOLEAN DEFAULT false,
    ai_extracted_data JSONB DEFAULT '{}',
    ocr_text TEXT,
    fraud_check_status VARCHAR(50) DEFAULT 'pending',
    fraud_check_results JSONB DEFAULT '{}',
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 8. AI Features Tables

#### ai_job_matches
AI-generated job matches for candidates
```sql
CREATE TABLE ai_job_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2) NOT NULL,
    match_reasons JSONB DEFAULT '{}',
    skill_match_score DECIMAL(5,2),
    experience_match_score DECIMAL(5,2),
    location_match_score DECIMAL(5,2),
    salary_match_score DECIMAL(5,2),
    culture_fit_score DECIMAL(5,2),
    is_recommended BOOLEAN DEFAULT false,
    viewed_by_candidate BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### ai_resume_analysis
AI analysis results for resumes
```sql
CREATE TABLE ai_resume_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id),
    analysis_version VARCHAR(20) DEFAULT '1.0',
    overall_score DECIMAL(5,2),
    technical_score DECIMAL(5,2),
    experience_score DECIMAL(5,2),
    education_score DECIMAL(5,2),
    skills_score DECIMAL(5,2),
    achievements_score DECIMAL(5,2),
    ats_compatibility_score DECIMAL(5,2),
    improvement_suggestions JSONB DEFAULT '[]',
    extracted_skills TEXT[],
    keyword_optimization JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 9. Freelance Recruiter Tables

#### freelance_recruiters
Freelance recruiter profiles and settings
```sql
CREATE TABLE freelance_recruiters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specializations TEXT[],
    experience_years INTEGER,
    success_rate DECIMAL(5,2),
    total_placements INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    payment_info JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### referrals
Candidate referrals by freelance recruiters
```sql
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID REFERENCES freelance_recruiters(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    referral_status VARCHAR(50) DEFAULT 'pending' CHECK (referral_status IN ('pending', 'accepted', 'rejected', 'hired')),
    commission_amount DECIMAL(10,2),
    commission_status VARCHAR(50) DEFAULT 'pending' CHECK (commission_status IN ('pending', 'approved', 'paid')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 10. Analytics and Reporting Tables

#### analytics_events
Event tracking for analytics
```sql
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### system_metrics
System performance and usage metrics
```sql
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(50),
    dimensions JSONB DEFAULT '{}',
    recorded_at TIMESTAMP DEFAULT NOW()
);
```

### 11. Communication Tables

#### notifications
User notifications and alerts
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### email_logs
Email delivery tracking
```sql
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    email_type VARCHAR(100) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
    provider_message_id VARCHAR(255),
    error_message TEXT,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 12. Task Management Tables

#### tasks
Task management and assignment
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id),
    assigned_by UUID REFERENCES users(id),
    related_application_id UUID REFERENCES applications(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) CHECK (task_type IN ('interview', 'review', 'follow_up', 'document_check', 'reference_check', 'other')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 13. Audit and Compliance Tables

#### audit_logs
Comprehensive audit trail
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- User management indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_oauth_accounts_provider_user ON oauth_accounts(provider, provider_user_id);

-- Company indexes
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_company_members_company_user ON company_members(company_id, user_id);

-- Job indexes
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status_public ON jobs(employment_status, is_public);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- Application indexes
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);

-- AI features indexes
CREATE INDEX idx_ai_job_matches_candidate ON ai_job_matches(candidate_id);
CREATE INDEX idx_ai_job_matches_job ON ai_job_matches(job_id);
CREATE INDEX idx_ai_job_matches_score ON ai_job_matches(match_score DESC);

-- Analytics indexes
CREATE INDEX idx_analytics_events_user_type ON analytics_events(user_id, event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Notification indexes
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- ... (enable for all tables)

-- Example RLS policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Company members can view company data" ON companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Public jobs are viewable by all" ON jobs
    FOR SELECT USING (is_public = true OR company_id IN (
        SELECT company_id FROM company_members 
        WHERE user_id = auth.uid() AND is_active = true
    ));
```

## Data Migration Strategy

1. **Phase 1**: Core tables (users, companies, jobs)
2. **Phase 2**: Application and candidate management
3. **Phase 3**: AI features and analytics
4. **Phase 4**: Advanced features and optimizations

## Backup and Recovery

- Daily automated backups
- Point-in-time recovery capability
- Cross-region backup replication
- Regular backup restoration testing

## Compliance Considerations

- GDPR: Right to be forgotten, data portability
- CCPA: Data transparency and deletion rights
- SOC 2: Audit trails and access controls
- Industry-specific compliance as needed

