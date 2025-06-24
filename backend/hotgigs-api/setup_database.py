#!/usr/bin/env python3
"""
HotGigs.ai Database Schema Creation Script for Supabase
This script creates all necessary tables, indexes, and security policies
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

def get_supabase_client():
    """Create and return Supabase client"""
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not url or not key:
        raise ValueError("Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
    
    return create_client(url, key)

def execute_sql(supabase: Client, sql: str, description: str):
    """Execute SQL command with error handling"""
    try:
        print(f"🔧 {description}...")
        result = supabase.rpc('exec_sql', {'sql': sql}).execute()
        print(f"✅ {description} completed")
        return True
    except Exception as e:
        print(f"❌ {description} failed: {str(e)}")
        return False

def create_database_schema(supabase: Client):
    """Create the complete database schema"""
    
    print("🚀 Creating HotGigs.ai Database Schema")
    print("=" * 50)
    
    # Enable necessary extensions
    extensions_sql = """
    -- Enable necessary PostgreSQL extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE EXTENSION IF NOT EXISTS "vector";
    """
    
    execute_sql(supabase, extensions_sql, "Enabling PostgreSQL extensions")
    
    # Create enum types
    enums_sql = """
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
    """
    
    execute_sql(supabase, enums_sql, "Creating enum types")
    
    # Create core tables
    core_tables_sql = """
    -- Users table (main user accounts)
    CREATE TABLE IF NOT EXISTS users (
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
    CREATE TABLE IF NOT EXISTS oauth_providers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
    CREATE TABLE IF NOT EXISTS companies (
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
    CREATE TABLE IF NOT EXISTS company_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL DEFAULT 'member',
        is_active BOOLEAN DEFAULT true,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(company_id, user_id)
    );
    """
    
    execute_sql(supabase, core_tables_sql, "Creating core tables")
    
    # Create candidate-specific tables
    candidate_tables_sql = """
    -- Candidate profiles table
    CREATE TABLE IF NOT EXISTS candidate_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
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
    CREATE TABLE IF NOT EXISTS work_experiences (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
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
    CREATE TABLE IF NOT EXISTS education (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
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
    CREATE TABLE IF NOT EXISTS certifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
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
    """
    
    execute_sql(supabase, candidate_tables_sql, "Creating candidate-specific tables")
    
    # Create job-related tables
    job_tables_sql = """
    -- Jobs table
    CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
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
    CREATE TABLE IF NOT EXISTS job_applications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
        candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
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
    CREATE TABLE IF NOT EXISTS application_status_history (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
        old_status application_status,
        new_status application_status NOT NULL,
        changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    execute_sql(supabase, job_tables_sql, "Creating job-related tables")
    
    # Create AI and document tables
    ai_document_tables_sql = """
    -- Documents table
    CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
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
    CREATE TABLE IF NOT EXISTS ai_interview_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
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
    CREATE TABLE IF NOT EXISTS ai_feedback (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
        feedback_type VARCHAR(50) NOT NULL,
        feedback_data JSONB NOT NULL,
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Resume embeddings for semantic search
    CREATE TABLE IF NOT EXISTS resume_embeddings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
        document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
        embedding vector(1536),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Job embeddings for semantic search
    CREATE TABLE IF NOT EXISTS job_embeddings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
        embedding vector(1536),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    execute_sql(supabase, ai_document_tables_sql, "Creating AI and document tables")
    
    # Create freelance recruiter tables
    recruiter_tables_sql = """
    -- Freelance recruiter profiles
    CREATE TABLE IF NOT EXISTS freelance_recruiter_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
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
    CREATE TABLE IF NOT EXISTS recruiter_job_assignments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        recruiter_id UUID REFERENCES freelance_recruiter_profiles(id) ON DELETE CASCADE,
        job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
        commission_rate DECIMAL(5,2),
        assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(recruiter_id, job_id)
    );
    
    -- Commission tracking
    CREATE TABLE IF NOT EXISTS commissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        recruiter_id UUID REFERENCES freelance_recruiter_profiles(id) ON DELETE CASCADE,
        application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
        amount DECIMAL(10,2),
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(50) DEFAULT 'pending',
        earned_at TIMESTAMP WITH TIME ZONE,
        paid_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    execute_sql(supabase, recruiter_tables_sql, "Creating freelance recruiter tables")
    
    # Create notification and activity tables
    notification_tables_sql = """
    -- Notifications table
    CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        data JSONB,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Activity logs
    CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50),
        resource_id UUID,
        metadata JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- System settings
    CREATE TABLE IF NOT EXISTS system_settings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        key VARCHAR(255) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    execute_sql(supabase, notification_tables_sql, "Creating notification and activity tables")
    
    print("\n✅ Database schema creation completed successfully!")
    return True

def create_indexes(supabase: Client):
    """Create database indexes for performance"""
    
    print("\n🔧 Creating database indexes...")
    
    indexes_sql = """
    -- Performance indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
    CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
    
    CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
    CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
    
    CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
    CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
    
    CREATE INDEX IF NOT EXISTS idx_applications_job_id ON job_applications(job_id);
    CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON job_applications(candidate_id);
    CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
    CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON job_applications(applied_at);
    
    CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
    CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
    
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
    
    -- Vector similarity search indexes
    CREATE INDEX IF NOT EXISTS idx_resume_embeddings_vector ON resume_embeddings USING ivfflat (embedding vector_cosine_ops);
    CREATE INDEX IF NOT EXISTS idx_job_embeddings_vector ON job_embeddings USING ivfflat (embedding vector_cosine_ops);
    
    -- Composite indexes for common queries
    CREATE INDEX IF NOT EXISTS idx_jobs_company_status ON jobs(company_id, status);
    CREATE INDEX IF NOT EXISTS idx_applications_job_status ON job_applications(job_id, status);
    """
    
    execute_sql(supabase, indexes_sql, "Creating performance indexes")

def create_rls_policies(supabase: Client):
    """Create Row Level Security policies"""
    
    print("\n🔒 Creating Row Level Security policies...")
    
    rls_sql = """
    -- Enable RLS on all tables
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE oauth_providers ENABLE ROW LEVEL SECURITY;
    ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
    ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
    ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;
    ALTER TABLE education ENABLE ROW LEVEL SECURITY;
    ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
    ALTER TABLE ai_interview_sessions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
    
    -- Users can read their own data
    CREATE POLICY "Users can view own profile" ON users
        FOR SELECT USING (auth.uid() = id);
    
    CREATE POLICY "Users can update own profile" ON users
        FOR UPDATE USING (auth.uid() = id);
    
    -- Candidate profiles
    CREATE POLICY "Candidates can manage own profile" ON candidate_profiles
        FOR ALL USING (auth.uid() = user_id);
    
    -- Company members can view company data
    CREATE POLICY "Company members can view company" ON companies
        FOR SELECT USING (
            id IN (
                SELECT company_id FROM company_members 
                WHERE user_id = auth.uid() AND is_active = true
            )
        );
    
    -- Jobs visibility
    CREATE POLICY "Public can view active jobs" ON jobs
        FOR SELECT USING (status = 'active');
    
    CREATE POLICY "Company members can manage jobs" ON jobs
        FOR ALL USING (
            company_id IN (
                SELECT company_id FROM company_members 
                WHERE user_id = auth.uid() AND is_active = true
            )
        );
    
    -- Applications
    CREATE POLICY "Candidates can view own applications" ON job_applications
        FOR SELECT USING (
            candidate_id IN (
                SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
            )
        );
    
    CREATE POLICY "Company members can view applications to their jobs" ON job_applications
        FOR SELECT USING (
            job_id IN (
                SELECT j.id FROM jobs j
                JOIN company_members cm ON j.company_id = cm.company_id
                WHERE cm.user_id = auth.uid() AND cm.is_active = true
            )
        );
    
    -- Documents
    CREATE POLICY "Users can manage own documents" ON documents
        FOR ALL USING (auth.uid() = user_id);
    
    -- Notifications
    CREATE POLICY "Users can view own notifications" ON notifications
        FOR SELECT USING (auth.uid() = user_id);
    """
    
    execute_sql(supabase, rls_sql, "Creating Row Level Security policies")

def create_functions(supabase: Client):
    """Create database functions"""
    
    print("\n⚙️ Creating database functions...")
    
    functions_sql = """
    -- Function to update updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
    
    -- Function to execute SQL (for migrations)
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void AS $$
    BEGIN
        EXECUTE sql;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
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
    """
    
    execute_sql(supabase, functions_sql, "Creating database functions")

def create_triggers(supabase: Client):
    """Create database triggers"""
    
    print("\n🔄 Creating database triggers...")
    
    triggers_sql = """
    -- Updated_at triggers
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    CREATE TRIGGER update_candidate_profiles_updated_at BEFORE UPDATE ON candidate_profiles
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    """
    
    execute_sql(supabase, triggers_sql, "Creating database triggers")

def main():
    """Main function to set up the database"""
    try:
        print("🚀 HotGigs.ai Database Setup")
        print("=" * 50)
        
        # Get Supabase client
        supabase = get_supabase_client()
        print("✅ Connected to Supabase")
        
        # Create schema
        if not create_database_schema(supabase):
            print("❌ Schema creation failed")
            return False
        
        # Create indexes
        create_indexes(supabase)
        
        # Create RLS policies
        create_rls_policies(supabase)
        
        # Create functions
        create_functions(supabase)
        
        # Create triggers
        create_triggers(supabase)
        
        print("\n🎉 Database setup completed successfully!")
        print("✅ All tables, indexes, and security policies created")
        print("✅ Database is ready for HotGigs.ai application")
        
        return True
        
    except Exception as e:
        print(f"❌ Database setup failed: {str(e)}")
        return False

if __name__ == "__main__":
    main()

