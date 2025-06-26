-- =====================================================
-- HotGigs ATS Database Schema - Supabase Direct Execution
-- Version: 2.0 - Complete ATS Workflow & Candidate Management
-- 
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run" to execute
-- 4. Safe to run multiple times (uses IF NOT EXISTS)
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENHANCED CANDIDATES TABLE
-- =====================================================

-- Add new columns to existing candidates table (safe if already exists)
DO $$ 
BEGIN
    -- Add profile_image column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='profile_image') THEN
        ALTER TABLE candidates ADD COLUMN profile_image VARCHAR(500);
    END IF;
    
    -- Add current_company column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='current_company') THEN
        ALTER TABLE candidates ADD COLUMN current_company VARCHAR(200);
    END IF;
    
    -- Add current_salary column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='current_salary') THEN
        ALTER TABLE candidates ADD COLUMN current_salary VARCHAR(100);
    END IF;
    
    -- Add expected_salary column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='expected_salary') THEN
        ALTER TABLE candidates ADD COLUMN expected_salary VARCHAR(100);
    END IF;
    
    -- Add availability column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='availability') THEN
        ALTER TABLE candidates ADD COLUMN availability VARCHAR(200);
    END IF;
    
    -- Add experience_years column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='experience_years') THEN
        ALTER TABLE candidates ADD COLUMN experience_years INTEGER DEFAULT 0;
    END IF;
    
    -- Add source column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='source') THEN
        ALTER TABLE candidates ADD COLUMN source VARCHAR(50) DEFAULT 'manual_upload';
    END IF;
    
    -- Add tags column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='tags') THEN
        ALTER TABLE candidates ADD COLUMN tags TEXT[];
    END IF;
    
    -- Add notes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='notes') THEN
        ALTER TABLE candidates ADD COLUMN notes TEXT;
    END IF;
    
    -- Add social_links column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='social_links') THEN
        ALTER TABLE candidates ADD COLUMN social_links JSONB;
    END IF;
    
    -- Add last_updated column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidates' AND column_name='last_updated') THEN
        ALTER TABLE candidates ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- =====================================================
-- CANDIDATE DOMAIN EXPERTISE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS candidate_domain_expertise (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    domain VARCHAR(100) NOT NULL,
    confidence_score INTEGER DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    years_experience INTEGER DEFAULT 0,
    identified_from TEXT, -- 'work_history', 'manual', 'ai_analysis'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidate_domain_expertise_candidate_id ON candidate_domain_expertise(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_domain_expertise_domain ON candidate_domain_expertise(domain);

-- =====================================================
-- CANDIDATE SKILLS ENHANCEMENT
-- =====================================================

DO $$ 
BEGIN
    -- Add skill_category column to candidate_skills
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidate_skills' AND column_name='skill_category') THEN
        ALTER TABLE candidate_skills ADD COLUMN skill_category VARCHAR(50) DEFAULT 'primary';
    END IF;
    
    -- Add proficiency_level column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidate_skills' AND column_name='proficiency_level') THEN
        ALTER TABLE candidate_skills ADD COLUMN proficiency_level INTEGER DEFAULT 0 CHECK (proficiency_level >= 0 AND proficiency_level <= 100);
    END IF;
    
    -- Add years_experience column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidate_skills' AND column_name='years_experience') THEN
        ALTER TABLE candidate_skills ADD COLUMN years_experience INTEGER DEFAULT 0;
    END IF;
    
    -- Add last_used_date column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidate_skills' AND column_name='last_used_date') THEN
        ALTER TABLE candidate_skills ADD COLUMN last_used_date DATE;
    END IF;
    
    -- Add verified column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='candidate_skills' AND column_name='verified') THEN
        ALTER TABLE candidate_skills ADD COLUMN verified BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- =====================================================
-- ENHANCED RESUME MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS candidate_resumes (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size VARCHAR(50),
    file_type VARCHAR(50),
    uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parsed_date TIMESTAMP,
    parsing_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    one_page_summary TEXT,
    full_content TEXT,
    parsing_metadata JSONB,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidate_resumes_candidate_id ON candidate_resumes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_resumes_is_primary ON candidate_resumes(is_primary);

-- =====================================================
-- APPLICATION TRACKING ENHANCEMENT
-- =====================================================

DO $$ 
BEGIN
    -- Add stage column to applications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='stage') THEN
        ALTER TABLE applications ADD COLUMN stage VARCHAR(100) DEFAULT 'applied';
    END IF;
    
    -- Add feedback column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='feedback') THEN
        ALTER TABLE applications ADD COLUMN feedback TEXT;
    END IF;
    
    -- Add interviewer column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='interviewer') THEN
        ALTER TABLE applications ADD COLUMN interviewer VARCHAR(200);
    END IF;
    
    -- Add next_action column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='next_action') THEN
        ALTER TABLE applications ADD COLUMN next_action VARCHAR(200);
    END IF;
    
    -- Add salary_discussed column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='salary_discussed') THEN
        ALTER TABLE applications ADD COLUMN salary_discussed VARCHAR(100);
    END IF;
    
    -- Add match_score column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='match_score') THEN
        ALTER TABLE applications ADD COLUMN match_score INTEGER DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100);
    END IF;
    
    -- Add rejection_reason column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='rejection_reason') THEN
        ALTER TABLE applications ADD COLUMN rejection_reason VARCHAR(500);
    END IF;
    
    -- Add offer_amount column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='offer_amount') THEN
        ALTER TABLE applications ADD COLUMN offer_amount VARCHAR(100);
    END IF;
    
    -- Add offer_status column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='offer_status') THEN
        ALTER TABLE applications ADD COLUMN offer_status VARCHAR(50);
    END IF;
    
    -- Add submitted_by column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='submitted_by') THEN
        ALTER TABLE applications ADD COLUMN submitted_by INTEGER REFERENCES users(id);
    END IF;
    
    -- Add submission_notes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='submission_notes') THEN
        ALTER TABLE applications ADD COLUMN submission_notes TEXT;
    END IF;
    
    -- Add ai_recommendation column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='ai_recommendation') THEN
        ALTER TABLE applications ADD COLUMN ai_recommendation JSONB;
    END IF;
END $$;

-- =====================================================
-- CANDIDATE PERFORMANCE METRICS
-- =====================================================

CREATE TABLE IF NOT EXISTS candidate_performance_metrics (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    total_applications INTEGER DEFAULT 0,
    active_applications INTEGER DEFAULT 0,
    interviews_scheduled INTEGER DEFAULT 0,
    offers_received INTEGER DEFAULT 0,
    rejections INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    average_response_time_days DECIMAL(5,2) DEFAULT 0.00,
    average_interview_score DECIMAL(3,1) DEFAULT 0.0,
    last_application_date DATE,
    last_interview_date DATE,
    last_offer_date DATE,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidate_performance_metrics_candidate_id ON candidate_performance_metrics(candidate_id);

-- =====================================================
-- AI INSIGHTS AND RECOMMENDATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS candidate_ai_insights (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
    strengths TEXT[],
    areas_for_improvement TEXT[],
    career_trajectory JSONB,
    market_insights JSONB,
    job_recommendations JSONB,
    interview_preparation JSONB,
    skill_gap_analysis JSONB,
    salary_analysis JSONB,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidate_ai_insights_candidate_id ON candidate_ai_insights(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_ai_insights_generated_at ON candidate_ai_insights(generated_at);

-- =====================================================
-- FEEDBACK ANALYSIS
-- =====================================================

CREATE TABLE IF NOT EXISTS application_feedback_analysis (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    feedback_text TEXT,
    sentiment VARCHAR(50), -- 'positive', 'negative', 'neutral'
    sentiment_score DECIMAL(3,2) DEFAULT 0.00,
    positive_keywords TEXT[],
    negative_keywords TEXT[],
    improvement_suggestions TEXT[],
    recommendation_score DECIMAL(3,1) DEFAULT 0.0,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_analysis_application_id ON application_feedback_analysis(application_id);
CREATE INDEX IF NOT EXISTS idx_feedback_analysis_candidate_id ON application_feedback_analysis(candidate_id);
CREATE INDEX IF NOT EXISTS idx_feedback_analysis_job_id ON application_feedback_analysis(job_id);

-- =====================================================
-- ENHANCED JOBS TABLE
-- =====================================================

DO $$ 
BEGIN
    -- Add ai_generated column to jobs
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='ai_generated') THEN
        ALTER TABLE jobs ADD COLUMN ai_generated BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add generation_prompt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='generation_prompt') THEN
        ALTER TABLE jobs ADD COLUMN generation_prompt TEXT;
    END IF;
    
    -- Add template_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='template_id') THEN
        ALTER TABLE jobs ADD COLUMN template_id INTEGER;
    END IF;
    
    -- Add import_source column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='import_source') THEN
        ALTER TABLE jobs ADD COLUMN import_source VARCHAR(100);
    END IF;
    
    -- Add views_count column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='views_count') THEN
        ALTER TABLE jobs ADD COLUMN views_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add applications_count column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='applications_count') THEN
        ALTER TABLE jobs ADD COLUMN applications_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add deadline column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='deadline') THEN
        ALTER TABLE jobs ADD COLUMN deadline DATE;
    END IF;
    
    -- Add employment_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='employment_type') THEN
        ALTER TABLE jobs ADD COLUMN employment_type VARCHAR(50) DEFAULT 'Full-time';
    END IF;
    
    -- Add experience_level column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='experience_level') THEN
        ALTER TABLE jobs ADD COLUMN experience_level VARCHAR(50);
    END IF;
    
    -- Add remote_allowed column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='remote_allowed') THEN
        ALTER TABLE jobs ADD COLUMN remote_allowed BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add salary_min column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_min') THEN
        ALTER TABLE jobs ADD COLUMN salary_min INTEGER;
    END IF;
    
    -- Add salary_max column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_max') THEN
        ALTER TABLE jobs ADD COLUMN salary_max INTEGER;
    END IF;
    
    -- Add currency column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='currency') THEN
        ALTER TABLE jobs ADD COLUMN currency VARCHAR(10) DEFAULT 'USD';
    END IF;
    
    -- Add benefits column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='benefits') THEN
        ALTER TABLE jobs ADD COLUMN benefits TEXT[];
    END IF;
    
    -- Add interview_process column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='interview_process') THEN
        ALTER TABLE jobs ADD COLUMN interview_process JSONB;
    END IF;
    
    -- Add last_updated column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='last_updated') THEN
        ALTER TABLE jobs ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- =====================================================
-- JOB TEMPLATES
-- =====================================================

CREATE TABLE IF NOT EXISTS job_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    title_template VARCHAR(200),
    description_template TEXT,
    requirements_template TEXT,
    responsibilities_template TEXT,
    skills_template TEXT[],
    employment_type VARCHAR(50) DEFAULT 'Full-time',
    experience_level VARCHAR(50),
    created_by INTEGER REFERENCES users(id),
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_templates_category ON job_templates(category);
CREATE INDEX IF NOT EXISTS idx_job_templates_created_by ON job_templates(created_by);

-- =====================================================
-- CANDIDATE SUBMISSION WORKFLOW
-- =====================================================

CREATE TABLE IF NOT EXISTS candidate_submissions (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    submitted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    submission_type VARCHAR(50) DEFAULT 'recruiter_submission', -- 'self_application', 'recruiter_submission'
    submission_notes TEXT,
    match_score INTEGER DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
    ai_recommendation JSONB,
    status VARCHAR(50) DEFAULT 'submitted',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id),
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidate_submissions_job_id ON candidate_submissions(job_id);
CREATE INDEX IF NOT EXISTS idx_candidate_submissions_candidate_id ON candidate_submissions(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_submissions_submitted_by ON candidate_submissions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_candidate_submissions_status ON candidate_submissions(status);

-- =====================================================
-- HOT LIST MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS hot_list_candidates (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    added_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    bench_start_date DATE,
    bench_end_date DATE,
    billable_rate VARCHAR(100),
    performance_rating INTEGER DEFAULT 0 CHECK (performance_rating >= 1 AND performance_rating <= 10),
    availability_status VARCHAR(50) DEFAULT 'available', -- 'available', 'partially_available', 'unavailable'
    skills_bench TEXT[],
    last_project VARCHAR(200),
    notes TEXT,
    priority_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hot_list_candidates_candidate_id ON hot_list_candidates(candidate_id);
CREATE INDEX IF NOT EXISTS idx_hot_list_candidates_company_id ON hot_list_candidates(company_id);
CREATE INDEX IF NOT EXISTS idx_hot_list_candidates_availability_status ON hot_list_candidates(availability_status);
CREATE INDEX IF NOT EXISTS idx_hot_list_candidates_is_active ON hot_list_candidates(is_active);

-- =====================================================
-- SKILL DEMAND ANALYSIS
-- =====================================================

CREATE TABLE IF NOT EXISTS skill_market_demand (
    id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    demand_score INTEGER DEFAULT 0 CHECK (demand_score >= 0 AND demand_score <= 100),
    job_postings_count INTEGER DEFAULT 0,
    average_salary_min INTEGER,
    average_salary_max INTEGER,
    growth_trend VARCHAR(20) DEFAULT 'stable', -- 'growing', 'stable', 'declining'
    market_region VARCHAR(100) DEFAULT 'global',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skill_market_demand_skill_name ON skill_market_demand(skill_name);
CREATE INDEX IF NOT EXISTS idx_skill_market_demand_demand_score ON skill_market_demand(demand_score);

-- =====================================================
-- INTERVIEW SCHEDULING AND TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    interviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    interview_type VARCHAR(50) DEFAULT 'technical', -- 'screening', 'technical', 'behavioral', 'final'
    scheduled_date TIMESTAMP,
    duration_minutes INTEGER DEFAULT 60,
    location VARCHAR(200),
    meeting_link VARCHAR(500),
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'rescheduled'
    score INTEGER CHECK (score >= 1 AND score <= 10),
    feedback TEXT,
    notes TEXT,
    recording_url VARCHAR(500),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id ON interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_job_id ON interviews(job_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_date ON interviews(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);

-- =====================================================
-- DOCUMENT MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS candidate_documents (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'resume', 'cover_letter', 'portfolio', 'certificate', 'id_document'
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size VARCHAR(50),
    file_type VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'tampered'
    verification_notes TEXT,
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    verified_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidate_documents_candidate_id ON candidate_documents(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_documents_document_type ON candidate_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_candidate_documents_verification_status ON candidate_documents(verification_status);

-- =====================================================
-- BULK IMPORT TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS bulk_import_jobs (
    id SERIAL PRIMARY KEY,
    import_type VARCHAR(50) NOT NULL, -- 'candidates', 'jobs', 'resumes'
    source VARCHAR(100), -- 'csv', 'excel', 'google_drive', 'email'
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_log TEXT,
    processing_metadata JSONB,
    started_by INTEGER REFERENCES users(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_import_type ON bulk_import_jobs(import_type);
CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_status ON bulk_import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_started_by ON bulk_import_jobs(started_by);

-- =====================================================
-- NOTIFICATION SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'application_update', 'interview_scheduled', 'new_candidate', 'job_match'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional data for the notification
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- =====================================================
-- SYSTEM SETTINGS AND CONFIGURATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AUDIT LOG
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'candidate', 'job', 'application', 'user'
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity_type ON audit_log(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity_id ON audit_log(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns (safe if already exists)
DO $$
BEGIN
    -- Candidates table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_candidates_updated_at') THEN
        CREATE TRIGGER update_candidates_updated_at 
        BEFORE UPDATE ON candidates 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Candidate domain expertise trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_candidate_domain_expertise_updated_at') THEN
        CREATE TRIGGER update_candidate_domain_expertise_updated_at 
        BEFORE UPDATE ON candidate_domain_expertise 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Candidate resumes trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_candidate_resumes_updated_at') THEN
        CREATE TRIGGER update_candidate_resumes_updated_at 
        BEFORE UPDATE ON candidate_resumes 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Candidate performance metrics trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_candidate_performance_metrics_updated_at') THEN
        CREATE TRIGGER update_candidate_performance_metrics_updated_at 
        BEFORE UPDATE ON candidate_performance_metrics 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Candidate AI insights trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_candidate_ai_insights_updated_at') THEN
        CREATE TRIGGER update_candidate_ai_insights_updated_at 
        BEFORE UPDATE ON candidate_ai_insights 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Jobs table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_jobs_updated_at') THEN
        CREATE TRIGGER update_jobs_updated_at 
        BEFORE UPDATE ON jobs 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Job templates trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_job_templates_updated_at') THEN
        CREATE TRIGGER update_job_templates_updated_at 
        BEFORE UPDATE ON job_templates 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Candidate submissions trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_candidate_submissions_updated_at') THEN
        CREATE TRIGGER update_candidate_submissions_updated_at 
        BEFORE UPDATE ON candidate_submissions 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Hot list candidates trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_hot_list_candidates_updated_at') THEN
        CREATE TRIGGER update_hot_list_candidates_updated_at 
        BEFORE UPDATE ON hot_list_candidates 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Interviews trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_interviews_updated_at') THEN
        CREATE TRIGGER update_interviews_updated_at 
        BEFORE UPDATE ON interviews 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Candidate documents trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_candidate_documents_updated_at') THEN
        CREATE TRIGGER update_candidate_documents_updated_at 
        BEFORE UPDATE ON candidate_documents 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- System settings trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_system_settings_updated_at') THEN
        CREATE TRIGGER update_system_settings_updated_at 
        BEFORE UPDATE ON system_settings 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Comprehensive candidate view with all related data
CREATE OR REPLACE VIEW candidate_full_profile AS
SELECT 
    c.*,
    cp.total_applications,
    cp.success_rate,
    cp.average_interview_score,
    ai.overall_score as ai_score,
    ai.strengths as ai_strengths,
    ai.areas_for_improvement as ai_improvements,
    COALESCE(hlc.is_active, false) as is_hot_list,
    hlc.billable_rate,
    hlc.performance_rating
FROM candidates c
LEFT JOIN candidate_performance_metrics cp ON c.id = cp.candidate_id
LEFT JOIN candidate_ai_insights ai ON c.id = ai.candidate_id
LEFT JOIN hot_list_candidates hlc ON c.id = hlc.candidate_id AND hlc.is_active = true;

-- Job applications with detailed information
CREATE OR REPLACE VIEW application_details AS
SELECT 
    a.*,
    c.name as candidate_name,
    c.email as candidate_email,
    c.phone as candidate_phone,
    j.title as job_title,
    j.company_id,
    comp.name as company_name,
    u.name as submitted_by_name,
    fa.sentiment,
    fa.sentiment_score,
    fa.recommendation_score
FROM applications a
JOIN candidates c ON a.candidate_id = c.id
JOIN jobs j ON a.job_id = j.id
LEFT JOIN companies comp ON j.company_id = comp.id
LEFT JOIN users u ON a.submitted_by = u.id
LEFT JOIN application_feedback_analysis fa ON a.id = fa.application_id;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('ai_matching_enabled', 'true', 'boolean', 'Enable AI-powered job matching', true),
('auto_resume_parsing', 'true', 'boolean', 'Automatically parse uploaded resumes', true),
('feedback_analysis_enabled', 'true', 'boolean', 'Enable automatic feedback sentiment analysis', true),
('max_file_upload_size', '10485760', 'number', 'Maximum file upload size in bytes (10MB)', true),
('supported_resume_formats', '["pdf", "doc", "docx"]', 'json', 'Supported resume file formats', true),
('default_match_threshold', '70', 'number', 'Default minimum match score threshold', true),
('interview_reminder_hours', '24', 'number', 'Hours before interview to send reminder', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample skill market demand data
INSERT INTO skill_market_demand (skill_name, demand_score, job_postings_count, average_salary_min, average_salary_max, growth_trend) VALUES
('React', 95, 15420, 90000, 160000, 'growing'),
('JavaScript', 98, 18750, 80000, 150000, 'stable'),
('TypeScript', 88, 12340, 95000, 165000, 'growing'),
('Node.js', 82, 9870, 85000, 155000, 'growing'),
('Python', 92, 16540, 90000, 170000, 'growing'),
('Java', 85, 14230, 95000, 175000, 'stable'),
('AWS', 78, 8960, 100000, 180000, 'growing'),
('Docker', 75, 7650, 95000, 165000, 'growing'),
('Kubernetes', 72, 6540, 110000, 190000, 'growing'),
('GraphQL', 68, 4320, 100000, 170000, 'growing')
ON CONFLICT DO NOTHING;

-- =====================================================
-- PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_status_created_at ON applications(status, created_at);
CREATE INDEX IF NOT EXISTS idx_candidates_status_created_at ON candidates(status, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status_created_at ON jobs(status, created_at);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_candidate_skill ON candidate_skills(candidate_id, skill);

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_active_candidates ON candidates(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_active_jobs ON jobs(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_pending_applications ON applications(id) WHERE status IN ('applied', 'screening', 'interview');

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '🎉 HotGigs ATS Database Migration v2.0 completed successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 FEATURES ADDED:';
    RAISE NOTICE '✅ Enhanced candidate management with domain expertise';
    RAISE NOTICE '✅ Comprehensive application tracking and feedback analysis';
    RAISE NOTICE '✅ AI insights and recommendations system';
    RAISE NOTICE '✅ Hot list management for bench candidates';
    RAISE NOTICE '✅ Advanced resume and document management';
    RAISE NOTICE '✅ Performance metrics and analytics';
    RAISE NOTICE '✅ Bulk import and workflow tracking';
    RAISE NOTICE '✅ Interview scheduling and management';
    RAISE NOTICE '✅ Notification and audit systems';
    RAISE NOTICE '';
    RAISE NOTICE '📈 DATABASE STATISTICS:';
    RAISE NOTICE '• Total new tables: 15';
    RAISE NOTICE '• Total enhanced tables: 4';
    RAISE NOTICE '• Total new indexes: 45+';
    RAISE NOTICE '• Total triggers: 12';
    RAISE NOTICE '• Total views: 2';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 NEXT STEPS:';
    RAISE NOTICE '1. Restart your backend server';
    RAISE NOTICE '2. Test the new ATS features in your frontend';
    RAISE NOTICE '3. Verify data integrity in Supabase dashboard';
    RAISE NOTICE '';
    RAISE NOTICE 'Migration timestamp: %', CURRENT_TIMESTAMP;
END $$;

