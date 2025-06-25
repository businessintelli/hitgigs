#!/bin/bash

# 🔧 Create Admin User with Correct Enum Value
# This script fixes the user_type enum issue and creates a working admin user

echo "🚀 HotGigs.ai Admin User Fix"
echo "============================="

# Check if we're in the right directory
if [ ! -f "backend/hotgigs-api/src/database.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Expected: /Users/pratapbhimireddy/Projects/hotgigs/hitgigs"
    echo "   Current: $(pwd)"
    exit 1
fi

# Navigate to backend directory
cd backend/hotgigs-api

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Error: Virtual environment not found"
    echo "   Please create virtual environment first: python -m venv venv"
    exit 1
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if required packages are installed
echo "🔍 Checking required packages..."
python -c "import bcrypt, uuid; print('✅ Required packages available')" 2>/dev/null || {
    echo "⚠️ Installing required packages..."
    pip install bcrypt
}

# Run the enum fix script
echo "🔍 Fixing user_type enum and creating admin user..."
python ../../scripts/fix-admin-enum.py

echo ""
echo "🎉 Admin user fix complete!"
echo ""
echo "🌐 Try accessing your admin panel:"
echo "   URL: http://localhost:3002/admin/login"
echo "   Email: admin@hotgigs.ai"
echo "   Password: admin123"
echo ""
echo "💡 The admin user will be created with a valid user_type that works with your Supabase schema."

