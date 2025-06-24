#!/bin/bash

# Quick HotGigs.ai Diagnostic - For Immediate Issues
# This is a lightweight version for quick troubleshooting

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}⚡ Quick HotGigs.ai Diagnostic${NC}"
echo -e "${BLUE}=============================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend/hotgigs-frontend" ] || [ ! -d "backend/hotgigs-api" ]; then
    echo -e "${RED}❌ Error: Not in HotGigs project directory${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}🔍 Checking system basics...${NC}"

# System info
echo -e "${BLUE}System:${NC} $(uname -s) $(uname -r)"
echo -e "${BLUE}Node.js:${NC} $(node --version 2>/dev/null || echo 'Not found')"
echo -e "${BLUE}Python:${NC} $(python3 --version 2>/dev/null || echo 'Not found')"
echo -e "${BLUE}pnpm:${NC} $(pnpm --version 2>/dev/null || echo 'Not found')"
echo ""

echo -e "${YELLOW}🌐 Checking services...${NC}"

# Check ports
check_port() {
    local port=$1
    local service=$2
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service (port $port): Running${NC}"
        return 0
    else
        echo -e "${RED}❌ $service (port $port): Not running${NC}"
        return 1
    fi
}

frontend_running=false
backend_running=false

if check_port 3002 "Frontend"; then
    frontend_running=true
elif check_port 5173 "Frontend (alt)"; then
    frontend_running=true
elif check_port 5000 "Frontend (alt2)"; then
    frontend_running=true
fi

if check_port 8000 "Backend"; then
    backend_running=true
elif check_port 5001 "Backend (alt)"; then
    backend_running=true
fi

echo ""

# Test connectivity if services are running
if [ "$frontend_running" = true ]; then
    echo -e "${YELLOW}🧪 Testing frontend...${NC}"
    for port in 3002 5173 5000; do
        if lsof -i :$port > /dev/null 2>&1; then
            status=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$port 2>/dev/null || echo "000")
            if [ "$status" = "200" ]; then
                echo -e "${GREEN}✅ Frontend HTTP: $status (OK)${NC}"
            else
                echo -e "${RED}❌ Frontend HTTP: $status (Error)${NC}"
            fi
            break
        fi
    done
fi

if [ "$backend_running" = true ]; then
    echo -e "${YELLOW}🧪 Testing backend...${NC}"
    for port in 8000 5001; do
        if lsof -i :$port > /dev/null 2>&1; then
            status=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$port/api/health 2>/dev/null || echo "000")
            if [ "$status" = "200" ]; then
                echo -e "${GREEN}✅ Backend Health: $status (OK)${NC}"
                # Show health response
                health=$(curl -s http://localhost:$port/api/health 2>/dev/null || echo "No response")
                echo -e "${BLUE}   Response: $health${NC}"
            else
                echo -e "${RED}❌ Backend Health: $status (Error)${NC}"
            fi
            break
        fi
    done
fi

echo ""

# Check key files
echo -e "${YELLOW}📁 Checking key files...${NC}"

check_file() {
    local file=$1
    local description=$2
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $description: Found${NC}"
    else
        echo -e "${RED}❌ $description: Missing${NC}"
    fi
}

check_file "frontend/hotgigs-frontend/package.json" "Frontend package.json"
check_file "frontend/hotgigs-frontend/.env" "Frontend .env"
check_file "frontend/hotgigs-frontend/vite.config.js" "Vite config"
check_file "frontend/hotgigs-frontend/tailwind.config.js" "Tailwind config"
check_file "frontend/hotgigs-frontend/src/index.css" "Main CSS file"
check_file "backend/hotgigs-api/requirements.txt" "Backend requirements"
check_file "backend/hotgigs-api/.env" "Backend .env"
check_file "backend/hotgigs-api/src/main.py" "Backend main file"

echo ""

# Environment variables check
echo -e "${YELLOW}🔧 Checking environment...${NC}"

if [ -f "frontend/hotgigs-frontend/.env" ]; then
    api_url=$(grep VITE_API_BASE_URL frontend/hotgigs-frontend/.env | cut -d'=' -f2 || echo "Not set")
    echo -e "${BLUE}Frontend API URL: $api_url${NC}"
fi

if [ -f "backend/hotgigs-api/.env" ]; then
    port=$(grep PORT backend/hotgigs-api/.env | cut -d'=' -f2 || echo "Not set")
    echo -e "${BLUE}Backend Port: $port${NC}"
fi

echo ""

# Quick recommendations
echo -e "${YELLOW}💡 Quick recommendations:${NC}"

if [ "$frontend_running" = false ]; then
    echo -e "${BLUE}• Start frontend: cd frontend/hotgigs-frontend && pnpm dev${NC}"
fi

if [ "$backend_running" = false ]; then
    echo -e "${BLUE}• Start backend: cd backend/hotgigs-api && source venv/bin/activate && python src/main.py${NC}"
fi

if [ ! -f "frontend/hotgigs-frontend/tailwind.config.js" ]; then
    echo -e "${BLUE}• Missing Tailwind config - this may cause styling issues${NC}"
fi

if [ ! -f "frontend/hotgigs-frontend/.env" ]; then
    echo -e "${BLUE}• Create frontend .env file with VITE_API_BASE_URL${NC}"
fi

echo ""
echo -e "${GREEN}⚡ Quick diagnostic complete!${NC}"
echo -e "${BLUE}For detailed diagnosis, run: ./scripts/local-diagnostic.sh${NC}"

