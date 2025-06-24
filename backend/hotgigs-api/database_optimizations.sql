-- HotGigs.ai Database Performance Optimizations
-- Run this script in Supabase SQL Editor to improve query performance

-- Create indexes for frequently queried columns

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Jobs table indexes (most critical for performance)
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON public.jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_salary_range ON public.jobs(salary_min, salary_max);

-- Full-text search indexes for job search optimization
CREATE INDEX IF NOT EXISTS idx_jobs_title_search ON public.jobs USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_jobs_description_search ON public.jobs USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_jobs_requirements_search ON public.jobs USING gin(to_tsvector('english', requirements));

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_jobs_status_created_at ON public.jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status_location ON public.jobs(status, location);
CREATE INDEX IF NOT EXISTS idx_jobs_company_status ON public.jobs(company_id, status);

-- Job applications indexes
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON public.job_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON public.job_applications(applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_status ON public.job_applications(candidate_id, status);

-- Companies table indexes
CREATE INDEX IF NOT EXISTS idx_companies_industry ON public.companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_location ON public.companies(location);
CREATE INDEX IF NOT EXISTS idx_companies_size ON public.companies(company_size);
CREATE INDEX IF NOT EXISTS idx_companies_name_search ON public.companies USING gin(to_tsvector('english', name));

-- Candidate profiles indexes
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id ON public.candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_location ON public.candidate_profiles(location);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_experience_level ON public.candidate_profiles(experience_level);

-- Work experience indexes
CREATE INDEX IF NOT EXISTS idx_work_experience_candidate_id ON public.work_experiences(candidate_id);
CREATE INDEX IF NOT EXISTS idx_work_experience_dates ON public.work_experiences(start_date DESC, end_date DESC);

-- Education indexes
CREATE INDEX IF NOT EXISTS idx_education_candidate_id ON public.education(candidate_id);
CREATE INDEX IF NOT EXISTS idx_education_dates ON public.education(start_date DESC, end_date DESC);

-- Company members indexes
CREATE INDEX IF NOT EXISTS idx_company_members_user_id ON public.company_members(user_id);
CREATE INDEX IF NOT EXISTS idx_company_members_company_id ON public.company_members(company_id);
CREATE INDEX IF NOT EXISTS idx_company_members_role ON public.company_members(role);

-- Skills indexes
CREATE INDEX IF NOT EXISTS idx_candidate_skills_candidate_id ON public.candidate_skills(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_skill_name ON public.candidate_skills(skill_name);
CREATE INDEX IF NOT EXISTS idx_job_skills_job_id ON public.job_skills(job_id);
CREATE INDEX IF NOT EXISTS idx_job_skills_skill_name ON public.job_skills(skill_name);

-- AI feedback indexes
CREATE INDEX IF NOT EXISTS idx_ai_feedback_application_id ON public.ai_feedback(application_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_created_at ON public.ai_feedback(created_at DESC);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Interviews indexes
CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON public.interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_interviewer_id ON public.interviews(interviewer_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_at ON public.interviews(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON public.interviews(status);

-- Documents indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON public.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);

-- Create materialized view for job search performance
CREATE MATERIALIZED VIEW IF NOT EXISTS public.job_search_view AS
SELECT 
    j.id,
    j.title,
    j.description,
    j.requirements,
    j.location,
    j.employment_type,
    j.salary_min,
    j.salary_max,
    j.experience_level,
    j.created_at,
    j.updated_at,
    c.name as company_name,
    c.logo_url as company_logo,
    c.industry as company_industry,
    c.location as company_location,
    to_tsvector('english', j.title || ' ' || j.description || ' ' || j.requirements) as search_vector
FROM public.jobs j
LEFT JOIN public.companies c ON j.company_id = c.id
WHERE j.status = 'active';

-- Create index on the materialized view
CREATE INDEX IF NOT EXISTS idx_job_search_view_search_vector ON public.job_search_view USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_job_search_view_location ON public.job_search_view(location);
CREATE INDEX IF NOT EXISTS idx_job_search_view_employment_type ON public.job_search_view(employment_type);
CREATE INDEX IF NOT EXISTS idx_job_search_view_created_at ON public.job_search_view(created_at DESC);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_job_search_view()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.job_search_view;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-refresh materialized view when jobs are updated
CREATE OR REPLACE FUNCTION trigger_refresh_job_search_view()
RETURNS trigger AS $$
BEGIN
    PERFORM refresh_job_search_view();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS jobs_refresh_search_view ON public.jobs;

-- Create trigger on jobs table
CREATE TRIGGER jobs_refresh_search_view
    AFTER INSERT OR UPDATE OR DELETE ON public.jobs
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_refresh_job_search_view();

-- Analyze tables to update statistics for query planner
ANALYZE public.users;
ANALYZE public.jobs;
ANALYZE public.companies;
ANALYZE public.job_applications;
ANALYZE public.candidate_profiles;
ANALYZE public.work_experiences;
ANALYZE public.education;

-- Create function for optimized job search
CREATE OR REPLACE FUNCTION search_jobs_optimized(
    search_term TEXT DEFAULT NULL,
    location_filter TEXT DEFAULT NULL,
    employment_type_filter TEXT DEFAULT NULL,
    experience_level_filter TEXT DEFAULT NULL,
    salary_min_filter INTEGER DEFAULT NULL,
    salary_max_filter INTEGER DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    location TEXT,
    employment_type TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    experience_level TEXT,
    created_at TIMESTAMPTZ,
    company_name TEXT,
    company_logo TEXT,
    company_industry TEXT,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        jsv.id,
        jsv.title,
        jsv.description,
        jsv.location,
        jsv.employment_type,
        jsv.salary_min,
        jsv.salary_max,
        jsv.experience_level,
        jsv.created_at,
        jsv.company_name,
        jsv.company_logo,
        jsv.company_industry,
        CASE 
            WHEN search_term IS NOT NULL THEN 
                ts_rank(jsv.search_vector, plainto_tsquery('english', search_term))
            ELSE 0.0
        END as relevance_score
    FROM public.job_search_view jsv
    WHERE 
        (search_term IS NULL OR jsv.search_vector @@ plainto_tsquery('english', search_term))
        AND (location_filter IS NULL OR jsv.location ILIKE '%' || location_filter || '%')
        AND (employment_type_filter IS NULL OR jsv.employment_type = employment_type_filter)
        AND (experience_level_filter IS NULL OR jsv.experience_level = experience_level_filter)
        AND (salary_min_filter IS NULL OR jsv.salary_max >= salary_min_filter)
        AND (salary_max_filter IS NULL OR jsv.salary_min <= salary_max_filter)
    ORDER BY 
        CASE WHEN search_term IS NOT NULL THEN relevance_score ELSE 0 END DESC,
        jsv.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Create function for getting user applications with optimized joins
CREATE OR REPLACE FUNCTION get_user_applications_optimized(user_id_param UUID)
RETURNS TABLE (
    application_id UUID,
    job_id UUID,
    job_title TEXT,
    company_name TEXT,
    company_logo TEXT,
    application_status TEXT,
    applied_at TIMESTAMPTZ,
    location TEXT,
    employment_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ja.id as application_id,
        j.id as job_id,
        j.title as job_title,
        c.name as company_name,
        c.logo_url as company_logo,
        ja.status::TEXT as application_status,
        ja.applied_at,
        j.location,
        j.employment_type
    FROM public.job_applications ja
    JOIN public.candidate_profiles cp ON ja.candidate_id = cp.id
    JOIN public.jobs j ON ja.job_id = j.id
    JOIN public.companies c ON j.company_id = c.id
    WHERE cp.user_id = user_id_param
    ORDER BY ja.applied_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function for company dashboard statistics
CREATE OR REPLACE FUNCTION get_company_stats(company_id_param UUID)
RETURNS TABLE (
    total_jobs INTEGER,
    active_jobs INTEGER,
    total_applications INTEGER,
    pending_applications INTEGER,
    hired_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM public.jobs WHERE company_id = company_id_param),
        (SELECT COUNT(*)::INTEGER FROM public.jobs WHERE company_id = company_id_param AND status = 'active'),
        (SELECT COUNT(*)::INTEGER FROM public.job_applications ja 
         JOIN public.jobs j ON ja.job_id = j.id 
         WHERE j.company_id = company_id_param),
        (SELECT COUNT(*)::INTEGER FROM public.job_applications ja 
         JOIN public.jobs j ON ja.job_id = j.id 
         WHERE j.company_id = company_id_param AND ja.status = 'pending'),
        (SELECT COUNT(*)::INTEGER FROM public.job_applications ja 
         JOIN public.jobs j ON ja.job_id = j.id 
         WHERE j.company_id = company_id_param AND ja.status = 'hired');
END;
$$ LANGUAGE plpgsql;

-- Enable row level security optimizations
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for better performance (optional, based on security requirements)
-- These can be customized based on your specific security needs

-- Refresh the materialized view initially
SELECT refresh_job_search_view();

-- Performance monitoring view
CREATE OR REPLACE VIEW public.performance_stats AS
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'jobs', 'companies', 'job_applications', 'candidate_profiles')
ORDER BY tablename, attname;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Database performance optimizations completed successfully at %', NOW();
END $$;

