#!/bin/bash

# 🔧 Configure HotGigs.ai with Your Specific Supabase Credentials
# ==============================================================

set -e

echo "🔧 HotGigs.ai Supabase Configuration"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Your Supabase credentials
SUPABASE_URL="https://nrpvyjwnqvxipjmdjlim.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycHZ5anducXZ4aXBqbWRqbGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTczNDYsImV4cCI6MjA2NjI5MzM0Nn0.Cg-2qAUS8GxK4oMNbmb-W7gly-VzqjbvqOhX3W4t4-o"

# Extract host from URL
SUPABASE_HOST="nrpvyjwnqvxipjmdjlim.supabase.co"

# Detect project structure
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Find backend directory
BACKEND_DIR=""
if [ -d "$PROJECT_ROOT/backend/hotgigs-api" ]; then
    BACKEND_DIR="$PROJECT_ROOT/backend/hotgigs-api"
elif [ -d "$PROJECT_ROOT/backend" ]; then
    BACKEND_DIR="$PROJECT_ROOT/backend"
else
    echo -e "${RED}[ERROR] Backend directory not found${NC}"
    exit 1
fi

echo -e "${BLUE}[INFO] Backend directory: $BACKEND_DIR${NC}"
echo -e "${BLUE}[INFO] Configuring Supabase connection...${NC}"

# Navigate to backend directory
cd "$BACKEND_DIR"

echo -e "${BLUE}[INFO] Creating .env file with your Supabase credentials...${NC}"

# Create .env file with actual Supabase credentials
cat > .env << EOF
# Supabase Configuration - HotGigs.ai Production
# ==============================================

# Your Supabase Project Details
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_HOST=${SUPABASE_HOST}
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PORT=5432

# Note: You'll need to get your database password from Supabase dashboard
# Go to: https://app.supabase.com/project/nrpvyjwnqvxipjmdjlim/settings/database
# Look for "Database password" or reset it if needed
SUPABASE_PASSWORD=your-database-password-here

# Alternative: Use full DATABASE_URL (recommended for production)
# DATABASE_URL=postgresql://postgres:your-password@${SUPABASE_HOST}:5432/postgres

# Application Settings
SECRET_KEY=hotgigs-production-secret-key-change-this
DEBUG=False
ENVIRONMENT=production

# API Settings
API_HOST=0.0.0.0
API_PORT=8000

# Frontend Configuration (for CORS)
FRONTEND_URL=http://localhost:3002
PRODUCTION_URL=https://www.hotgigs.ai
EOF

echo -e "${GREEN}[SUCCESS] Created .env file with your Supabase credentials${NC}"

# Also create frontend .env file
FRONTEND_DIR=""
if [ -d "$PROJECT_ROOT/frontend/hotgigs-frontend" ]; then
    FRONTEND_DIR="$PROJECT_ROOT/frontend/hotgigs-frontend"
elif [ -d "$PROJECT_ROOT/frontend" ]; then
    FRONTEND_DIR="$PROJECT_ROOT/frontend"
fi

if [ -n "$FRONTEND_DIR" ]; then
    echo -e "${BLUE}[INFO] Configuring frontend .env file...${NC}"
    
    cat > "$FRONTEND_DIR/.env" << EOF
# Supabase Configuration - Frontend
# =================================
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:8000

# Production URLs
VITE_PRODUCTION_API_URL=https://api.hotgigs.ai
VITE_PRODUCTION_URL=https://www.hotgigs.ai
EOF
    
    echo -e "${GREEN}[SUCCESS] Created frontend .env file${NC}"
fi

echo -e "${BLUE}[INFO] Installing dependencies...${NC}"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
else
    echo -e "${YELLOW}[WARNING] Creating virtual environment...${NC}"
    python3 -m venv venv
    source venv/bin/activate
fi

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

echo -e "${GREEN}[SUCCESS] ✅ Supabase configuration completed!${NC}"
echo ""
echo -e "${YELLOW}[IMPORTANT] Final step required:${NC}"
echo -e "${BLUE}  1. Go to your Supabase dashboard: https://app.supabase.com/project/nrpvyjwnqvxipjmdjlim/settings/database${NC}"
echo -e "${BLUE}  2. Find your database password or reset it${NC}"
echo -e "${BLUE}  3. Edit $BACKEND_DIR/.env and replace 'your-database-password-here' with your actual password${NC}"
echo -e "${BLUE}  4. Run: ./scripts/start-all.sh${NC}"
echo ""
echo -e "${GREEN}🎉 Your HotGigs.ai platform is configured for your Supabase instance!${NC}"
echo ""
echo -e "${BLUE}Your Supabase project: nrpvyjwnqvxipjmdjlim${NC}"
echo -e "${BLUE}Dashboard: https://app.supabase.com/project/nrpvyjwnqvxipjmdjlim${NC}"

