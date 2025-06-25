#!/bin/bash

# 🔧 Quick Fix for Missing psycopg2 and Supabase Configuration
# ============================================================

set -e

echo "🔧 HotGigs.ai Supabase Quick Fix"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Navigate to backend directory
cd "$BACKEND_DIR"

echo -e "${BLUE}[INFO] Installing missing dependencies...${NC}"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo -e "${BLUE}[INFO] Activating virtual environment...${NC}"
    source venv/bin/activate
elif [ -d ".venv" ]; then
    echo -e "${BLUE}[INFO] Activating virtual environment...${NC}"
    source .venv/bin/activate
else
    echo -e "${YELLOW}[WARNING] No virtual environment found. Creating one...${NC}"
    python3 -m venv venv
    source venv/bin/activate
fi

# Install/upgrade pip
echo -e "${BLUE}[INFO] Upgrading pip...${NC}"
pip install --upgrade pip

# Install missing dependencies
echo -e "${BLUE}[INFO] Installing psycopg2-binary and SQLAlchemy...${NC}"
pip install psycopg2-binary==2.9.9 sqlalchemy==2.0.23

# Install all requirements
echo -e "${BLUE}[INFO] Installing all requirements...${NC}"
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}[WARNING] .env file not found. Creating template...${NC}"
    
    cat > .env << 'EOF'
# Supabase Configuration
# Replace these values with your actual Supabase credentials

# Option 1: Use individual environment variables
SUPABASE_HOST=your-project-ref.supabase.co
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-database-password
SUPABASE_PORT=5432

# Option 2: Use DATABASE_URL (alternative)
# DATABASE_URL=postgresql://postgres:your-password@your-project-ref.supabase.co:5432/postgres

# Application Settings
SECRET_KEY=your-secret-key-for-jwt-tokens
DEBUG=True
EOF

    echo -e "${GREEN}[SUCCESS] Created .env template file${NC}"
    echo -e "${YELLOW}[ACTION REQUIRED] Please edit the .env file with your actual Supabase credentials:${NC}"
    echo -e "${BLUE}  1. Go to your Supabase project dashboard${NC}"
    echo -e "${BLUE}  2. Navigate to Settings > Database${NC}"
    echo -e "${BLUE}  3. Copy your connection details${NC}"
    echo -e "${BLUE}  4. Edit $BACKEND_DIR/.env with your credentials${NC}"
    echo ""
    echo -e "${YELLOW}Example:${NC}"
    echo -e "${BLUE}  SUPABASE_HOST=abcdefghijklmnop.supabase.co${NC}"
    echo -e "${BLUE}  SUPABASE_PASSWORD=your_actual_password${NC}"
    echo ""
else
    echo -e "${GREEN}[INFO] .env file already exists${NC}"
fi

# Test psycopg2 installation
echo -e "${BLUE}[INFO] Testing psycopg2 installation...${NC}"
python3 -c "import psycopg2; print('✅ psycopg2 installed successfully')" || {
    echo -e "${RED}[ERROR] psycopg2 installation failed${NC}"
    exit 1
}

echo -e "${GREEN}[SUCCESS] ✅ Dependencies installed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "${BLUE}  1. Edit $BACKEND_DIR/.env with your Supabase credentials${NC}"
echo -e "${BLUE}  2. Run: ./scripts/start-all.sh${NC}"
echo ""
echo -e "${GREEN}🎉 Ready to start your HotGigs.ai platform!${NC}"

