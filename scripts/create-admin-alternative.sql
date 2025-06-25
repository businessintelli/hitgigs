-- 🔐 Alternative Admin User Creation Scripts
-- Try these if the first script doesn't work due to enum constraints

-- OPTION 1: Try with 'company' user_type
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
    '$2b$12$LQv3c1yqBwmnK.hlooKpa.j3U05NNOTRp16rq5JeRXXNHXWo7Or8W',
    'company', -- Try company type
    'Admin',
    'User',
    true,
    true,
    now(),
    now()
)
ON CONFLICT (email) DO NOTHING;

-- OPTION 2: Try with 'recruiter' user_type
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
    'admin2@hotgigs.ai',
    '$2b$12$LQv3c1yqBwmnK.hlooKpa.j3U05NNOTRp16rq5JeRXXNHXWo7Or8W',
    'recruiter', -- Try recruiter type
    'Admin',
    'User',
    true,
    true,
    now(),
    now()
)
ON CONFLICT (email) DO NOTHING;

-- OPTION 3: Check what enum values are actually available
SELECT 
    t.typname,
    e.enumlabel
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'user_type'
ORDER BY e.enumsortorder;

-- OPTION 4: Create admin with any valid user_type and mark with admin flag
-- First, let's see what user_types exist in your data
SELECT DISTINCT user_type, count(*) 
FROM users 
GROUP BY user_type;

-- Then create admin user with the most common user_type
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
) 
SELECT 
    gen_random_uuid(),
    'admin@hotgigs.ai',
    '$2b$12$LQv3c1yqBwmnK.hlooKpa.j3U05NNOTRp16rq5JeRXXNHXWo7Or8W',
    (SELECT user_type FROM users LIMIT 1), -- Use any existing user_type
    'Admin',
    'User',
    true,
    true,
    now(),
    now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@hotgigs.ai');

