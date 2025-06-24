#!/bin/bash

# HotGigs.ai Service Stop Script
# Stops all running frontend and backend services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping HotGigs.ai Services${NC}"
echo -e "${BLUE}==============================${NC}"
echo ""

# Stop processes by name
echo -e "${YELLOW}Stopping frontend (Vite)...${NC}"
if pgrep -f "vite" > /dev/null; then
    pkill -f "vite"
    echo -e "${GREEN}✅ Frontend stopped${NC}"
else
    echo -e "${YELLOW}ℹ️ Frontend was not running${NC}"
fi

echo -e "${YELLOW}Stopping backend (Python)...${NC}"
if pgrep -f "python.*main.py" > /dev/null; then
    pkill -f "python.*main.py"
    echo -e "${GREEN}✅ Backend stopped${NC}"
else
    echo -e "${YELLOW}ℹ️ Backend was not running${NC}"
fi

# Clean up PID file if it exists
if [ -f ".env.pids" ]; then
    rm .env.pids
    echo -e "${GREEN}✅ Cleaned up PID file${NC}"
fi

echo ""
echo -e "${GREEN}🎉 All services stopped${NC}"
echo ""
echo -e "${BLUE}To restart services, run: ./scripts/fix-local-environment.sh${NC}"

