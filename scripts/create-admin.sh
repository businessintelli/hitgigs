#!/bin/bash

# 🔧 Create Admin User for HotGigs.ai
# This script creates an admin user in your Supabase database

echo "🚀 HotGigs.ai Admin User Creation"
echo "=================================="

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

# Run the admin user check/creation script
echo "🔍 Checking and creating admin user..."
python ../../scripts/check-admin-users.py

echo ""
echo "🎉 Admin user setup complete!"
echo ""
echo "🌐 Access your admin panel:"
echo "   URL: http://localhost:3002/admin/login"
echo "   Email: admin@hotgigs.ai"
echo "   Password: admin123"
echo ""
echo "💡 If login still fails, check the script output above for existing admin credentials."

