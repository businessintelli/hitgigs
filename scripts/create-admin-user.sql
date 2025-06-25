-- 🔐 Create Admin User for HotGigs.ai
-- Run this script in your Supabase SQL Editor
-- Go to: https://app.supabase.com/project/nrpvyjwnqvxipjmdjlim/sql

-- First, let's check what user_type enum values are available
-- (This is just for reference, you can see the output in the Results tab)
SELECT 
    unnest(enum_range(NULL::user_type)) as valid_user_types;

-- Create the admin user
-- Using 'candidate' as user_type since we know it's valid from your existing users
INSERT INTO users (
    id,
    email,
    password_hash,
    user_type,
    first_name,
    last_name,
    is_active,
    is_verified,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'admin@hotgigs.ai',
    '$2b$12$LQv3c1yqBwmnK.hlooKpa.j3U05NNOTRp16rq5JeRXXNHXWo7Or8W', -- This is bcrypt hash of 'admin123'
    'candidate', -- Using known valid enum value
    'Admin',
    'User',
    true,
    true,
    now(),
    now()
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    is_active = EXCLUDED.is_active,
    is_verified = EXCLUDED.is_verified,
    updated_at = now();

-- Add a custom admin flag column if it doesn't exist
-- (This will help identify the admin user)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Mark our admin user as admin
UPDATE users 
SET is_admin = true 
WHERE email = 'admin@hotgigs.ai';

-- Verify the admin user was created
SELECT 
    id,
    email,
    user_type,
    first_name,
    last_name,
    is_active,
    is_verified,
    is_admin,
    created_at
FROM users 
WHERE email = 'admin@hotgigs.ai';

-- Show success message
SELECT 
    '✅ Admin user created successfully!' as status,
    'admin@hotgigs.ai' as email,
    'admin123' as password,
    'http://localhost:3002/admin/login' as login_url;

