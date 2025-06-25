-- 🔐 Create Super Admin User with Proper Bcrypt Password Hashing
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/nrpvyjwnqvxipjmdjlim/sql

-- First, enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Delete existing admin user if exists (to avoid conflicts)
DELETE FROM users WHERE email = 'admin@hotgigs.ai';

-- Create super admin user with properly hashed password
INSERT INTO users (
    id,
    email,
    password_hash,
    user_type,
    first_name,
    last_name,
    is_active,
    is_verified,
    is_admin,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'admin@hotgigs.ai',
    crypt('admin123', gen_salt('bf', 12)), -- Generate bcrypt hash for 'admin123'
    'candidate', -- Using valid enum value
    'Super',
    'Admin',
    true,
    true,
    true,
    now(),
    now()
);

-- Verify the admin user was created successfully
SELECT 
    id,
    email,
    user_type,
    first_name,
    last_name,
    is_admin,
    is_active,
    is_verified,
    created_at,
    -- Show first 20 characters of password hash for verification
    substring(password_hash from 1 for 20) || '...' as password_hash_preview
FROM users 
WHERE email = 'admin@hotgigs.ai';

-- Test password verification (should return true)
SELECT 
    email,
    (password_hash = crypt('admin123', password_hash)) as password_matches
FROM users 
WHERE email = 'admin@hotgigs.ai';

-- Show success message
SELECT 'Super Admin user created successfully! Use admin@hotgigs.ai / admin123 to login.' as result;

