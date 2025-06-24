-- HotGigs.ai Complete Database Schema for Supabase
-- Run this script in the Supabase SQL Editor

-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('candidate', 'company', 'freelance_recruiter');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('draft', 'active', 'paused', 'closed', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE interview_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('resume', 'cover_letter', 'portfolio', 'certificate', 'reference', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table (main user accounts)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    user_type user_type NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    profile_image_url TEXT,
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OAuth providers table
CREATE TABLE IF NOT EXISTS public.oauth_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

-- Companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    website VARCHAR(255),
    logo_url TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    founded_year INTEGER,
    headquarters VARCHAR(255),
    culture_description TEXT,
    benefits TEXT[],
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company members table (users associated with companies)
CREATE TABLE IF NOT EXISTS public.company_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- Candidate profiles table
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    title VARCHAR(255),
    summary TEXT,
    location VARCHAR(255),
    salary_expectation_min INTEGER,
    salary_expectation_max INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    availability VARCHAR(50),
    work_authorization VARCHAR(100),
    willing_to_relocate BOOLEAN DEFAULT false,
    remote_work_preference VARCHAR(50),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    skills TEXT[],
    languages TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work experience table
CREATE TABLE IF NOT EXISTS public.work_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    location VARCHAR(255),
    achievements TEXT[],
    technologies_used TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    gpa DECIMAL(3,2),
    description TEXT,
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiration_date DATE,
    credential_id VARCHAR(255),
    credential_url VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    responsibilities TEXT[],
    benefits TEXT[],
    location VARCHAR(255),
    remote_work_allowed BOOLEAN DEFAULT false,
    employment_type VARCHAR(50),
    experience_level VARCHAR(50),
    salary_min INTEGER,
    salary_max INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    skills_required TEXT[],
    skills_preferred TEXT[],
    status job_status DEFAULT 'draft',
    application_deadline DATE,
    start_date DATE,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    cover_letter TEXT,
    resume_url TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recruiter_notes TEXT,
    ai_match_score DECIMAL(5,2),
    ai_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, candidate_id)
);

-- Application status history
CREATE TABLE IF NOT EXISTS public.application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
    old_status application_status,
    new_status application_status NOT NULL,
    changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    extracted_text TEXT,
    ai_analysis JSONB,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI interview sessions
CREATE TABLE IF NOT EXISTS public.ai_interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
    session_type VARCHAR(50) DEFAULT 'comprehensive',
    status interview_status DEFAULT 'scheduled',
    questions JSONB,
    responses JSONB,
    ai_assessment JSONB,
    overall_score DECIMAL(5,2),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI feedback and learning
CREATE TABLE IF NOT EXISTS public.ai_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
    feedback_type VARCHAR(50) NOT NULL,
    feedback_data JSONB NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Freelance recruiter profiles
CREATE TABLE IF NOT EXISTS public.freelance_recruiter_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    specializations TEXT[],
    experience_years INTEGER,
    success_rate DECIMAL(5,2),
    total_placements INTEGER DEFAULT 0,
    commission_rate DECIMAL(5,2),
    bio TEXT,
    linkedin_url VARCHAR(255),
    website_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recruiter-job assignments
CREATE TABLE IF NOT EXISTS public.recruiter_job_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID REFERENCES public.freelance_recruiter_profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    commission_rate DECIMAL(5,2),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recruiter_id, job_id)
);

-- Commission tracking
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID REFERENCES public.freelance_recruiter_profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    earned_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);

CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON public.companies(industry);

CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON public.job_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON public.job_applications(applied_at);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(document_type);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_jobs_company_status ON public.jobs(company_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_job_status ON public.job_applications(job_id, status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to calculate job match score
CREATE OR REPLACE FUNCTION calculate_job_match_score(
    candidate_skills text[],
    job_required_skills text[],
    job_preferred_skills text[]
)
RETURNS decimal AS $$
DECLARE
    required_matches int := 0;
    preferred_matches int := 0;
    total_required int := array_length(job_required_skills, 1);
    total_preferred int := array_length(job_preferred_skills, 1);
    score decimal := 0;
BEGIN
    -- Count required skill matches
    SELECT COUNT(*)
    INTO required_matches
    FROM unnest(candidate_skills) AS cs
    WHERE cs = ANY(job_required_skills);
    
    -- Count preferred skill matches
    SELECT COUNT(*)
    INTO preferred_matches
    FROM unnest(candidate_skills) AS cs
    WHERE cs = ANY(job_preferred_skills);
    
    -- Calculate score (70% weight for required, 30% for preferred)
    IF total_required > 0 THEN
        score := score + (required_matches::decimal / total_required) * 0.7;
    END IF;
    
    IF total_preferred > 0 THEN
        score := score + (preferred_matches::decimal / total_preferred) * 0.3;
    END IF;
    
    RETURN LEAST(score * 100, 100); -- Cap at 100%
END;
$$ LANGUAGE plpgsql;

-- Updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_profiles_updated_at BEFORE UPDATE ON public.candidate_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be expanded later)
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Public can view active jobs
CREATE POLICY "Public can view active jobs" ON public.jobs
    FOR SELECT USING (status = 'active');

-- Candidate profiles
CREATE POLICY "Candidates can manage own profile" ON public.candidate_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Documents
CREATE POLICY "Users can manage own documents" ON public.documents
    FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Insert some sample data for testing
INSERT INTO public.companies (name, slug, description, industry, website) VALUES
('TechCorp Inc', 'techcorp', 'Leading technology company', 'Technology', 'https://techcorp.com'),
('HealthPlus', 'healthplus', 'Healthcare innovation company', 'Healthcare', 'https://healthplus.com'),
('FinanceFlow', 'financeflow', 'Financial services company', 'Finance', 'https://financeflow.com')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample jobs
INSERT INTO public.jobs (company_id, title, description, location, employment_type, status, skills_required) 
SELECT 
    c.id,
    'Senior Software Engineer',
    'We are looking for a senior software engineer to join our team.',
    'San Francisco, CA',
    'full-time',
    'active',
    ARRAY['Python', 'React', 'PostgreSQL']
FROM public.companies c WHERE c.slug = 'techcorp'
ON CONFLICT DO NOTHING;

INSERT INTO public.jobs (company_id, title, description, location, employment_type, status, skills_required) 
SELECT 
    c.id,
    'Data Scientist',
    'Join our data science team to build ML models.',
    'Remote',
    'full-time',
    'active',
    ARRAY['Python', 'Machine Learning', 'SQL']
FROM public.companies c WHERE c.slug = 'healthplus'
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'HotGigs.ai database schema created successfully!';
    RAISE NOTICE 'Tables created: %, Functions: %, Indexes: %, Policies: %', 
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%'),
        (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public'),
        (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'),
        (SELECT COUNT(*) FROM pg_policies);
END $$;

