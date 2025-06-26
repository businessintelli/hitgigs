-- =====================================================
-- HotGigs ATS Database Schema - FINAL CORRECTED VERSION
-- Version: 2.2 - Corrected for actual system_settings table structure
-- 
-- CORRECTED FOR YOUR ACTUAL SCHEMA:
-- - system_settings table uses 'key' and 'value' columns
-- - value column is JSONB type
-- - No setting_type or is_public columns
-- 
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run" to execute
-- 4. Safe to run multiple times
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 1: ENHANCE EXISTING CANDIDATE_PROFILES TABLE
-- =====================================================

-- Add new columns to candidate_profiles one by one
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS current_company VARCHAR(200);
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'self_registration';
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS social_links JSONB;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS added_by UUID;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS education JSONB;
ALTER TABLE candidate_profiles ADD COLUMN IF NOT EXISTS work_experience JSONB;

-- Add foreign key constraint for added_by (safe if already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'candidate_profiles_added_by_fkey'
    ) THEN
        ALTER TABLE candidate_profiles ADD CONSTRAINT candidate_profiles_added_by_fkey 
        FOREIGN KEY (added_by) REFERENCES users(id);
    END IF;
END $$;

-- =====================================================
-- STEP 2: ENHANCE EXISTING JOB_APPLICATIONS TABLE
-- =====================================================

-- Add new columns to job_applications one by one
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS stage VARCHAR(100) DEFAULT 'applied';
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS feedback TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS interviewer VARCHAR(200);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS next_action VARCHAR(200);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS salary_discussed VARCHAR(100);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(500);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS offer_amount VARCHAR(100);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS offer_status VARCHAR(50);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS submitted_by UUID;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS submission_notes TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS application_type VARCHAR(50) DEFAULT 'self_application';

-- Add foreign key constraint for submitted_by (safe if already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'job_applications_submitted_by_fkey'
    ) THEN
        ALTER TABLE job_applications ADD CONSTRAINT job_applications_submitted_by_fkey 
        FOREIGN KEY (submitted_by) REFERENCES users(id);
    END IF;
END $$;

-- =====================================================
-- STEP 3: ENHANCE EXISTING JOBS TABLE
-- =====================================================

-- Add new columns to jobs one by one
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS generation_prompt TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS template_id UUID;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS import_source VARCHAR(100);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS applications_count INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS assigned_recruiters UUID[];

-- Add foreign key constraint for created_by (safe if already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'jobs_created_by_fkey'
    ) THEN
        ALTER TABLE jobs ADD CONSTRAINT jobs_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES users(id);
    END IF;
END $$;

-- =====================================================
-- STEP 4: CREATE NEW TABLES ONE BY ONE
-- =====================================================

-- Create candidate_skills table
CREATE TABLE IF NOT EXISTS candidate_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL,
    skill VARCHAR(100) NOT NULL,
    skill_category VARCHAR(50) DEFAULT 'primary',
    proficiency_level INTEGER DEFAULT 0 CHECK (proficiency_level >= 0 AND proficiency_level <= 100),
    years_experience INTEGER DEFAULT 0,
    last_used_date DATE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for candidate_skills
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'candidate_skills_candidate_id_fkey'
    ) THEN
        ALTER TABLE candidate_skills ADD CONSTRAINT candidate_skills_candidate_id_fkey 
        FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes for candidate_skills
CREATE INDEX IF NOT EXISTS idx_candidate_skills_candidate_id ON candidate_skills(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_skill ON candidate_skills(skill);

-- Create candidate_resumes table
CREATE TABLE IF NOT EXISTS candidate_resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size VARCHAR(50),
    file_type VARCHAR(50),
    uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    parsed_date TIMESTAMP WITH TIME ZONE,
    parsing_status VARCHAR(50) DEFAULT 'pending',
    one_page_summary TEXT,
    full_content TEXT,
    parsing_metadata JSONB,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign keys for candidate_resumes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'candidate_resumes_candidate_id_fkey'
    ) THEN
        ALTER TABLE candidate_resumes ADD CONSTRAINT candidate_resumes_candidate_id_fkey 
        FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'candidate_resumes_uploaded_by_fkey'
    ) THEN
        ALTER TABLE candidate_resumes ADD CONSTRAINT candidate_resumes_uploaded_by_fkey 
        FOREIGN KEY (uploaded_by) REFERENCES users(id);
    END IF;
END $$;

-- Create indexes for candidate_resumes
CREATE INDEX IF NOT EXISTS idx_candidate_resumes_candidate_id ON candidate_resumes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_resumes_is_primary ON candidate_resumes(is_primary);

-- Create hot_list_candidates table
CREATE TABLE IF NOT EXISTS hot_list_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL,
    company_id UUID,
    added_by UUID,
    list_name VARCHAR(100) DEFAULT 'Default Hot List',
    bench_start_date DATE,
    bench_end_date DATE,
    billable_rate VARCHAR(100),
    performance_rating INTEGER DEFAULT 0 CHECK (performance_rating >= 1 AND performance_rating <= 10),
    availability_status VARCHAR(50) DEFAULT 'available',
    skills_bench TEXT[],
    last_project VARCHAR(200),
    notes TEXT,
    priority_level VARCHAR(20) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign keys for hot_list_candidates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hot_list_candidates_candidate_id_fkey'
    ) THEN
        ALTER TABLE hot_list_candidates ADD CONSTRAINT hot_list_candidates_candidate_id_fkey 
        FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hot_list_candidates_company_id_fkey'
    ) THEN
        ALTER TABLE hot_list_candidates ADD CONSTRAINT hot_list_candidates_company_id_fkey 
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hot_list_candidates_added_by_fkey'
    ) THEN
        ALTER TABLE hot_list_candidates ADD CONSTRAINT hot_list_candidates_added_by_fkey 
        FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes for hot_list_candidates
CREATE INDEX IF NOT EXISTS idx_hot_list_candidates_candidate_id ON hot_list_candidates(candidate_id);
CREATE INDEX IF NOT EXISTS idx_hot_list_candidates_company_id ON hot_list_candidates(company_id);
CREATE INDEX IF NOT EXISTS idx_hot_list_candidates_added_by ON hot_list_candidates(added_by);
CREATE INDEX IF NOT EXISTS idx_hot_list_candidates_is_active ON hot_list_candidates(is_active);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID,
    candidate_id UUID NOT NULL,
    job_id UUID NOT NULL,
    interviewer_id UUID,
    interview_type VARCHAR(50) DEFAULT 'technical',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 60,
    location VARCHAR(200),
    meeting_link VARCHAR(500),
    status VARCHAR(50) DEFAULT 'scheduled',
    score INTEGER CHECK (score >= 1 AND score <= 10),
    feedback TEXT,
    notes TEXT,
    recording_url VARCHAR(500),
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign keys for interviews
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interviews_application_id_fkey'
    ) THEN
        ALTER TABLE interviews ADD CONSTRAINT interviews_application_id_fkey 
        FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interviews_candidate_id_fkey'
    ) THEN
        ALTER TABLE interviews ADD CONSTRAINT interviews_candidate_id_fkey 
        FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interviews_job_id_fkey'
    ) THEN
        ALTER TABLE interviews ADD CONSTRAINT interviews_job_id_fkey 
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interviews_interviewer_id_fkey'
    ) THEN
        ALTER TABLE interviews ADD CONSTRAINT interviews_interviewer_id_fkey 
        FOREIGN KEY (interviewer_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interviews_created_by_fkey'
    ) THEN
        ALTER TABLE interviews ADD CONSTRAINT interviews_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES users(id);
    END IF;
END $$;

-- Create indexes for interviews
CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id ON interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_job_id ON interviews(job_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_date ON interviews(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);

-- Create candidate_performance_metrics table
CREATE TABLE IF NOT EXISTS candidate_performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL,
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
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for candidate_performance_metrics
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'candidate_performance_metrics_candidate_id_fkey'
    ) THEN
        ALTER TABLE candidate_performance_metrics ADD CONSTRAINT candidate_performance_metrics_candidate_id_fkey 
        FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create index for candidate_performance_metrics
CREATE INDEX IF NOT EXISTS idx_candidate_performance_metrics_candidate_id ON candidate_performance_metrics(candidate_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'medium',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Add foreign key for notifications
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'notifications_user_id_fkey'
    ) THEN
        ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create job_templates table
CREATE TABLE IF NOT EXISTS job_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    created_by UUID,
    company_id UUID,
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign keys for job_templates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'job_templates_created_by_fkey'
    ) THEN
        ALTER TABLE job_templates ADD CONSTRAINT job_templates_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'job_templates_company_id_fkey'
    ) THEN
        ALTER TABLE job_templates ADD CONSTRAINT job_templates_company_id_fkey 
        FOREIGN KEY (company_id) REFERENCES companies(id);
    END IF;
END $$;

-- Create indexes for job_templates
CREATE INDEX IF NOT EXISTS idx_job_templates_category ON job_templates(category);
CREATE INDEX IF NOT EXISTS idx_job_templates_created_by ON job_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_job_templates_company_id ON job_templates(company_id);

-- Create bulk_import_jobs table
CREATE TABLE IF NOT EXISTS bulk_import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    import_type VARCHAR(50) NOT NULL,
    source VARCHAR(100),
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    error_log TEXT,
    processing_metadata JSONB,
    started_by UUID,
    company_id UUID,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign keys for bulk_import_jobs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'bulk_import_jobs_started_by_fkey'
    ) THEN
        ALTER TABLE bulk_import_jobs ADD CONSTRAINT bulk_import_jobs_started_by_fkey 
        FOREIGN KEY (started_by) REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'bulk_import_jobs_company_id_fkey'
    ) THEN
        ALTER TABLE bulk_import_jobs ADD CONSTRAINT bulk_import_jobs_company_id_fkey 
        FOREIGN KEY (company_id) REFERENCES companies(id);
    END IF;
END $$;

-- Create indexes for bulk_import_jobs
CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_import_type ON bulk_import_jobs(import_type);
CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_status ON bulk_import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_started_by ON bulk_import_jobs(started_by);
CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_company_id ON bulk_import_jobs(company_id);

-- =====================================================
-- STEP 5: INSERT SAMPLE DATA INTO EXISTING SYSTEM_SETTINGS
-- Using correct column names: 'key' and 'value' (JSONB)
-- =====================================================

-- Insert sample settings using your actual table structure
INSERT INTO system_settings (key, value, description) VALUES
('ai_matching_enabled', 'true', 'Enable AI-powered job matching'),
('auto_resume_parsing', 'true', 'Automatically parse uploaded resumes'),
('feedback_analysis_enabled', 'true', 'Enable automatic feedback sentiment analysis'),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('supported_resume_formats', '["pdf", "doc", "docx"]', 'Supported resume file formats'),
('default_match_threshold', '70', 'Default minimum match score threshold'),
('interview_reminder_hours', '24', 'Hours before interview to send reminder'),
('hot_list_max_candidates', '100', 'Maximum candidates per hot list'),
('bulk_import_batch_size', '50', 'Number of records to process per batch')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- STEP 6: CREATE SIMPLE VIEWS
-- =====================================================

-- Create a simple candidate view
CREATE OR REPLACE VIEW candidate_summary AS
SELECT 
    cp.id,
    cp.title,
    cp.location,
    cp.current_company,
    cp.experience_years,
    cp.skills,
    cp.status,
    cp.created_at,
    COALESCE(hlc.is_active, false) as is_hot_list
FROM candidate_profiles cp
LEFT JOIN hot_list_candidates hlc ON cp.id = hlc.candidate_id AND hlc.is_active = true;

-- Create application details view
CREATE OR REPLACE VIEW application_details AS
SELECT 
    ja.*,
    cp.title as candidate_title,
    cp.location as candidate_location,
    cp.current_company,
    j.title as job_title,
    j.company_id,
    c.name as company_name
FROM job_applications ja
JOIN candidate_profiles cp ON ja.candidate_id = cp.id
JOIN jobs j ON ja.job_id = j.id
LEFT JOIN companies c ON j.company_id = c.id;

-- =====================================================
-- STEP 7: ADD PERFORMANCE INDEXES
-- =====================================================

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_status_created_at ON job_applications(status, created_at);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_status_created_at ON candidate_profiles(status, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status_created_at ON jobs(status, created_at);

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_active_candidate_profiles ON candidate_profiles(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_active_jobs ON jobs(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_pending_job_applications ON job_applications(id) WHERE status IN ('pending', 'screening', 'interview');

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '🎉 HotGigs ATS Database Migration v2.2 completed successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '✅ ENHANCED EXISTING TABLES:';
    RAISE NOTICE '• candidate_profiles: Added 11 new columns for enhanced profiles';
    RAISE NOTICE '• job_applications: Added 11 new columns for detailed tracking';
    RAISE NOTICE '• jobs: Added 8 new columns for AI and management features';
    RAISE NOTICE '• system_settings: Added 9 new configuration entries';
    RAISE NOTICE '';
    RAISE NOTICE '✅ CREATED NEW TABLES:';
    RAISE NOTICE '• candidate_skills: Skill tracking with proficiency levels';
    RAISE NOTICE '• candidate_resumes: Resume management and parsing';
    RAISE NOTICE '• hot_list_candidates: Recruiter favorite candidates';
    RAISE NOTICE '• interviews: Interview scheduling and tracking';
    RAISE NOTICE '• candidate_performance_metrics: Success analytics';
    RAISE NOTICE '• notifications: User notification system';
    RAISE NOTICE '• job_templates: Reusable job posting templates';
    RAISE NOTICE '• bulk_import_jobs: Bulk operation tracking';
    RAISE NOTICE '';
    RAISE NOTICE '✅ PERFORMANCE OPTIMIZATIONS:';
    RAISE NOTICE '• 25+ new indexes for optimal query performance';
    RAISE NOTICE '• Partial indexes for active records';
    RAISE NOTICE '• Foreign key constraints for data integrity';
    RAISE NOTICE '• Database views for complex queries';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 NEXT STEPS:';
    RAISE NOTICE '1. Restart your backend server';
    RAISE NOTICE '2. Test the enhanced ATS features';
    RAISE NOTICE '3. Verify data integrity in Supabase dashboard';
    RAISE NOTICE '4. Configure role-based permissions in your application';
    RAISE NOTICE '';
    RAISE NOTICE 'Migration completed at: %', CURRENT_TIMESTAMP;
END $$;

