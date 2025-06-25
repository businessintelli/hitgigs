#!/bin/bash

# 🔧 Quick Fix: Add Your Supabase Database Password
# ================================================

set -e

echo "🔧 HotGigs.ai Supabase Password Setup"
echo "====================================="

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

ENV_FILE="$BACKEND_DIR/.env"

echo -e "${BLUE}[INFO] Backend directory: $BACKEND_DIR${NC}"
echo -e "${BLUE}[INFO] Environment file: $ENV_FILE${NC}"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}[ERROR] .env file not found at $ENV_FILE${NC}"
    echo -e "${YELLOW}[INFO] Please run: git pull origin main first${NC}"
    exit 1
fi

echo -e "${GREEN}[SUCCESS] Found .env file with your Supabase credentials${NC}"
echo ""
echo -e "${YELLOW}[ACTION REQUIRED] You need to add your database password:${NC}"
echo ""
echo -e "${BLUE}Step 1: Get your database password${NC}"
echo -e "${BLUE}  • Go to: https://app.supabase.com/project/nrpvyjwnqvxipjmdjlim/settings/database${NC}"
echo -e "${BLUE}  • Look for 'Database password' section${NC}"
echo -e "${BLUE}  • Copy your password (or reset it if you forgot)${NC}"
echo ""
echo -e "${BLUE}Step 2: Update your .env file${NC}"
echo -e "${BLUE}  • Edit: $ENV_FILE${NC}"
echo -e "${BLUE}  • Find the line: SUPABASE_PASSWORD=your-database-password-here${NC}"
echo -e "${BLUE}  • Replace 'your-database-password-here' with your actual password${NC}"
echo ""
echo -e "${BLUE}Step 3: Start your system${NC}"
echo -e "${BLUE}  • Run: ./scripts/start-all.sh${NC}"
echo ""

# Offer to open the file for editing
echo -e "${YELLOW}Would you like me to open the .env file for editing? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    if command -v nano >/dev/null 2>&1; then
        echo -e "${BLUE}[INFO] Opening .env file with nano...${NC}"
        echo -e "${YELLOW}[TIP] Find the line with SUPABASE_PASSWORD and replace the placeholder${NC}"
        echo -e "${YELLOW}[TIP] Press Ctrl+X, then Y, then Enter to save and exit${NC}"
        sleep 3
        nano "$ENV_FILE"
    elif command -v vim >/dev/null 2>&1; then
        echo -e "${BLUE}[INFO] Opening .env file with vim...${NC}"
        vim "$ENV_FILE"
    else
        echo -e "${YELLOW}[INFO] Please edit the file manually: $ENV_FILE${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Once you've added your password, run: ./scripts/start-all.sh${NC}"

