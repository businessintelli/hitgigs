#!/bin/bash

# HotGigs.ai Complete System Stop Script
# =======================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🛑 HotGigs.ai Complete System Shutdown${NC}"
echo "========================================"

# Function to print status
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if we're in the right directory
if [[ ! -d "scripts" ]]; then
    print_error "Please run this script from the HotGigs.ai project root directory"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true

FRONTEND_STOPPED=false
BACKEND_STOPPED=false

# Stop frontend first
print_header "🌐 Stopping Frontend Service..."
echo "================================="
if ./scripts/stop-frontend.sh; then
    print_status "✅ Frontend stopped successfully"
    FRONTEND_STOPPED=true
else
    print_warning "⚠️  Issues stopping frontend (may not have been running)"
    FRONTEND_STOPPED=true
fi

echo ""
sleep 1

# Stop backend
print_header "📡 Stopping Backend Service..."
echo "==============================="
if ./scripts/stop-backend.sh; then
    print_status "✅ Backend stopped successfully"
    BACKEND_STOPPED=true
else
    print_warning "⚠️  Issues stopping backend (may not have been running)"
    BACKEND_STOPPED=true
fi

echo ""

# Clean up any remaining processes
print_header "🧹 Cleaning Up Remaining Processes..."
echo "====================================="

# Kill any remaining Node.js/Vite processes
if pgrep -f "vite.*dev\|node.*vite" > /dev/null 2>&1; then
    print_status "Cleaning up remaining Node.js/Vite processes..."
    pkill -f "vite.*dev\|node.*vite" 2>/dev/null || true
    sleep 1
fi

# Kill any remaining Python processes on our ports
for port in 8000 3002; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        PID=$(lsof -Pi :$port -sTCP:LISTEN -t)
        print_status "Cleaning up process using port $port (PID: $PID)..."
        kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null || true
        sleep 1
    fi
done

# Verify ports are free
print_status "Verifying ports are available..."
PORTS_FREE=true

for port in 8000 3002; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port $port is still in use"
        PORTS_FREE=false
    else
        print_status "Port $port is available"
    fi
done

echo ""
print_header "📊 Shutdown Summary"
echo "==================="

if [[ "$FRONTEND_STOPPED" == true ]]; then
    echo -e "   • Frontend: ${GREEN}✅ Stopped${NC}"
else
    echo -e "   • Frontend: ${RED}❌ Failed to stop${NC}"
fi

if [[ "$BACKEND_STOPPED" == true ]]; then
    echo -e "   • Backend: ${GREEN}✅ Stopped${NC}"
else
    echo -e "   • Backend: ${RED}❌ Failed to stop${NC}"
fi

if [[ "$PORTS_FREE" == true ]]; then
    echo -e "   • Ports: ${GREEN}✅ All freed${NC}"
else
    echo -e "   • Ports: ${YELLOW}⚠️  Some still in use${NC}"
fi

echo ""
echo "🛠️  Available Commands:"
echo "   • Start All: ./scripts/start-all.sh"
echo "   • Start Backend: ./scripts/start-backend.sh"
echo "   • Start Frontend: ./scripts/start-frontend.sh"
echo "   • System Status: ./scripts/status-all.sh"
echo ""

if [[ "$FRONTEND_STOPPED" == true ]] && [[ "$BACKEND_STOPPED" == true ]] && [[ "$PORTS_FREE" == true ]]; then
    echo -e "${GREEN}🎉 HotGigs.ai system shutdown complete!${NC}"
else
    echo -e "${YELLOW}⚠️  System shutdown completed with some issues.${NC}"
    echo "   Check individual service logs if needed."
fi

