#!/bin/bash

# HotGigs ATS Supabase Migration Runner
# This script runs the database migration using your existing Supabase configuration

echo "🚀 HotGigs ATS Supabase Migration"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "database/migrate_supabase.py" ]; then
    echo "❌ Error: Please run this script from the hotgigs-ai root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: database/migrate_supabase.py"
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    exit 1
fi

# Check for required Python packages
echo "🔍 Checking Python dependencies..."
python3 -c "import psycopg2, dotenv" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Installing required Python packages..."
    pip3 install psycopg2-binary python-dotenv
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install required packages"
        echo "   Please run: pip3 install psycopg2-binary python-dotenv"
        exit 1
    fi
fi

# Check for backend environment file
ENV_FILES=(
    "backend/hotgigs-api/.env"
    "backend/hotgigs-api/.env.production"
)

ENV_FOUND=false
for env_file in "${ENV_FILES[@]}"; do
    if [ -f "$env_file" ]; then
        echo "✅ Found environment file: $env_file"
        ENV_FOUND=true
        break
    fi
done

if [ "$ENV_FOUND" = false ]; then
    echo "⚠️  Warning: No environment file found in backend/hotgigs-api/"
    echo "   Expected files: .env or .env.production"
    echo "   The migration will try to use system environment variables"
    echo ""
fi

# Run the migration
echo "🔄 Starting database migration..."
echo ""

cd database
python3 migrate_supabase.py

MIGRATION_EXIT_CODE=$?

echo ""
if [ $MIGRATION_EXIT_CODE -eq 0 ]; then
    echo "🎉 Migration completed successfully!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Restart your backend server"
    echo "2. Test the new ATS features in your frontend"
    echo "3. Verify data in your Supabase dashboard"
else
    echo "❌ Migration failed with exit code: $MIGRATION_EXIT_CODE"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Check the migration.log file for detailed errors"
    echo "2. Verify your Supabase credentials in backend/.env"
    echo "3. Ensure your Supabase project is active and accessible"
    echo "4. Check the SUPABASE_SETUP.md file for detailed instructions"
fi

exit $MIGRATION_EXIT_CODE

