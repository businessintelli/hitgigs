-- HotGigs Database Schema Analysis
-- Run this in Supabase SQL Editor to understand your current database structure

-- =====================================================
-- ANALYZE CURRENT DATABASE STRUCTURE
-- =====================================================

-- 1. List all tables in the database
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Analyze candidate_profiles table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_profiles'
ORDER BY ordinal_position;

-- 3. Check for other candidate-related tables
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%candidate%'
ORDER BY table_name;

-- 4. Check for job-related tables
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%job%'
ORDER BY table_name;

-- 5. Check for application-related tables
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%application%'
ORDER BY table_name;

-- 6. Check for user-related tables
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%user%'
ORDER BY table_name;

-- 7. Check for company-related tables
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%compan%'
ORDER BY table_name;

-- 8. Analyze foreign key relationships
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 9. Check if candidate_profiles has relationships
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND (tc.table_name = 'candidate_profiles' OR ccu.table_name = 'candidate_profiles')
ORDER BY tc.table_name, kcu.column_name;

-- 10. Sample data from candidate_profiles (first 3 rows)
SELECT * FROM candidate_profiles LIMIT 3;

-- 11. Check existing indexes on candidate_profiles
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'candidate_profiles'
ORDER BY indexname;

