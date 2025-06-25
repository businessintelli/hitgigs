#!/bin/bash

# 🔧 Fix Supabase Client Creation Error
# ====================================

set -e

echo "🔧 HotGigs.ai Supabase Client Fix"
echo "================================="

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

# Check if virtual environment exists
VENV_DIR="$BACKEND_DIR/venv"
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${RED}[ERROR] Virtual environment not found at $VENV_DIR${NC}"
    echo -e "${YELLOW}[INFO] Please create virtual environment first:${NC}"
    echo -e "${YELLOW}  cd $BACKEND_DIR${NC}"
    echo -e "${YELLOW}  python -m venv venv${NC}"
    echo -e "${YELLOW}  source venv/bin/activate${NC}"
    exit 1
fi

echo -e "${BLUE}[INFO] Activating virtual environment...${NC}"
cd "$BACKEND_DIR"
source venv/bin/activate

echo -e "${BLUE}[INFO] Current Supabase version:${NC}"
pip show supabase || echo -e "${YELLOW}[INFO] Supabase not installed${NC}"

echo -e "${BLUE}[INFO] Fixing Supabase version compatibility issue...${NC}"

# Uninstall current version
echo -e "${BLUE}[INFO] Uninstalling current Supabase version...${NC}"
pip uninstall -y supabase || true

# Install compatible version
echo -e "${BLUE}[INFO] Installing compatible Supabase version (1.0.4)...${NC}"
pip install supabase==1.0.4

# Verify installation
echo -e "${BLUE}[INFO] Verifying installation...${NC}"
pip show supabase

echo -e "${GREEN}[SUCCESS] Supabase client fix completed!${NC}"
echo ""
echo -e "${BLUE}[INFO] Testing database connection...${NC}"

# Test the database connection
python -c "
import sys
sys.path.append('src')
try:
    from database import get_db_manager
    db = get_db_manager()
    print('✅ Database connection test successful!')
    print(f'✅ Connected to Supabase successfully!')
except Exception as e:
    print(f'❌ Database connection test failed: {e}')
    sys.exit(1)
"

echo ""
echo -e "${GREEN}🎉 SUCCESS! Supabase client is now working correctly!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "${BLUE}  1. Start your backend: python src/main.py${NC}"
echo -e "${BLUE}  2. Or use the startup script: ../scripts/start-all.sh${NC}"

