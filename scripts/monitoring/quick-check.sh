#!/bin/bash

# Simple port checker for HotGigs.ai
# Quick commands for checking development ports

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_port() {
    local port=$1
    local name=$2
    
    if lsof -i :$port > /dev/null 2>&1; then
        local pid=$(lsof -ti:$port | head -1)
        local cmd=$(ps -p $pid -o comm= 2>/dev/null)
        echo -e "${GREEN}✅ $name (port $port): $cmd (PID: $pid)${NC}"
        return 0
    else
        echo -e "${RED}❌ $name (port $port): Not running${NC}"
        return 1
    fi
}

echo "🔍 HotGigs.ai Quick Port Check"
echo "=============================="

# Check main development ports
check_port 8000 "Backend API"
check_port 5173 "Frontend (Vite)"

# Check alternative ports
echo ""
echo "🔍 Alternative Ports:"
check_port 3000 "Frontend (Alt)"
check_port 5000 "Frontend (Alt)"
check_port 8001 "Backend (Alt)"

# Show quick commands
echo ""
echo "🎯 Quick Commands:"
echo "   Kill backend:  lsof -ti:8000 | xargs kill -9"
echo "   Kill frontend: lsof -ti:5173 | xargs kill -9"
echo "   Check health:  curl http://localhost:8000/api/health"
echo "   Full monitor:  ./scripts/monitoring/service-monitor.sh"

