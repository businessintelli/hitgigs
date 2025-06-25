#!/usr/bin/env python3
"""
Generate Correct Bcrypt Hash for Admin Password
"""

import bcrypt

def generate_admin_hash():
    print("🔐 Generating Bcrypt Hash for Admin Password")
    print("=" * 50)
    
    password = "admin123"
    
    # Generate bcrypt hash
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    hash_bytes = bcrypt.hashpw(password_bytes, salt)
    hash_string = hash_bytes.decode('utf-8')
    
    print(f"📝 Password: {password}")
    print(f"🔑 Generated Hash: {hash_string}")
    print(f"📏 Hash Length: {len(hash_string)}")
    
    # Verify the hash works
    print("\n🧪 Testing hash verification...")
    if bcrypt.checkpw(password_bytes, hash_bytes):
        print("✅ Hash verification successful!")
    else:
        print("❌ Hash verification failed!")
    
    print("\n📋 SQL INSERT Statement:")
    print("-- Use this hash in your SQL INSERT:")
    print(f"INSERT INTO users (..., password_hash, ...) VALUES (..., '{hash_string}', ...);")
    
    print("\n🌐 Alternative SQL with PostgreSQL crypt():")
    print("-- Or use PostgreSQL's built-in crypt function:")
    print("INSERT INTO users (..., password_hash, ...) VALUES (..., crypt('admin123', gen_salt('bf', 12)), ...);")
    
    return hash_string

if __name__ == "__main__":
    generate_admin_hash()

