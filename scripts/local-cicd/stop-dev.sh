#!/bin/bash

echo "🛑 Stopping HotGigs.ai development servers..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "📁 Project Root: $PROJECT_ROOT"
echo ""

# Function to kill process safely
kill_process() {
    local pid=$1
    local name=$2
    
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
        echo "🔄 Stopping $name (PID: $pid)..."
        kill "$pid" 2>/dev/null
        
        # Wait for graceful shutdown
        local count=0
        while kill -0 "$pid" 2>/dev/null && [ $count -lt 10 ]; do
            sleep 1
            count=$((count + 1))
        done
        
        # Force kill if still running
        if kill -0 "$pid" 2>/dev/null; then
            echo "   Force killing $name..."
            kill -9 "$pid" 2>/dev/null
        fi
        
        if ! kill -0 "$pid" 2>/dev/null; then
            print_status "$name stopped successfully"
        else
            print_error "Failed to stop $name"
        fi
    else
        echo "ℹ️  $name not running or already stopped"
    fi
}

# Stop processes from PID files
if [ -f ".backend-pid" ]; then
    BACKEND_PID=$(cat .backend-pid)
    kill_process "$BACKEND_PID" "Backend"
    rm -f .backend-pid
fi

if [ -f ".frontend-pid" ]; then
    FRONTEND_PID=$(cat .frontend-pid)
    kill_process "$FRONTEND_PID" "Frontend"
    rm -f .frontend-pid
fi

# Clean up combined PID file
if [ -f ".dev-pids" ]; then
    echo "📋 Cleaning up PID tracking files..."
    rm -f .dev-pids
fi

echo ""
echo "🔍 Checking for remaining processes on development ports..."

# Kill processes on specific ports
for port in 8000 5173; do
    if lsof -i :$port > /dev/null 2>&1; then
        local pids=$(lsof -ti:$port)
        echo "   Found processes on port $port: $pids"
        lsof -ti:$port | xargs kill -9 2>/dev/null
        
        # Verify port is free
        sleep 1
        if ! lsof -i :$port > /dev/null 2>&1; then
            print_status "Port $port is now free"
        else
            print_warning "Port $port may still be in use"
        fi
    else
        echo "   ✅ Port $port is free"
    fi
done

echo ""
echo "🔍 Stopping development processes by name..."

# Stop Vite development server
if pgrep -f "vite" > /dev/null; then
    echo "   Stopping Vite processes..."
    pkill -f "vite" 2>/dev/null
    sleep 1
fi

# Stop Python backend processes
if pgrep -f "python.*main.py" > /dev/null; then
    echo "   Stopping Python backend processes..."
    pkill -f "python.*main.py" 2>/dev/null
    sleep 1
fi

# Stop Node.js processes related to the project (be careful not to kill other Node processes)
PROJECT_NAME=$(basename "$PROJECT_ROOT")
if pgrep -f "node.*$PROJECT_NAME" > /dev/null; then
    echo "   Stopping Node.js processes for $PROJECT_NAME..."
    pkill -f "node.*$PROJECT_NAME" 2>/dev/null
    sleep 1
fi

echo ""
echo "🧹 Cleaning up log files..."

# Clean up log files
if [ -f "backend/hotgigs-api/backend.log" ]; then
    rm -f backend/hotgigs-api/backend.log
    echo "   Removed backend.log"
fi

if [ -f "frontend/hotgigs-frontend/frontend.log" ]; then
    rm -f frontend/hotgigs-frontend/frontend.log
    echo "   Removed frontend.log"
fi

echo ""
echo "🔍 Final verification..."

# Final verification
BACKEND_RUNNING=$(lsof -ti:8000 2>/dev/null)
FRONTEND_RUNNING=$(lsof -ti:5173 2>/dev/null)

if [ -z "$BACKEND_RUNNING" ] && [ -z "$FRONTEND_RUNNING" ]; then
    print_status "All development servers stopped successfully! 🎉"
    echo ""
    echo "📊 Port Status:"
    echo "   ✅ Port 8000 (Backend): Free"
    echo "   ✅ Port 5173 (Frontend): Free"
else
    echo "⚠️  Some processes may still be running:"
    if [ -n "$BACKEND_RUNNING" ]; then
        print_warning "Backend processes still on port 8000: $BACKEND_RUNNING"
        echo "   Manual cleanup: lsof -ti:8000 | xargs kill -9"
    fi
    if [ -n "$FRONTEND_RUNNING" ]; then
        print_warning "Frontend processes still on port 5173: $FRONTEND_RUNNING"
        echo "   Manual cleanup: lsof -ti:5173 | xargs kill -9"
    fi
fi

echo ""
echo "🔧 To start development again:"
echo "   ./scripts/local-cicd/start-dev.sh"
echo ""
echo "🔍 To check what's running:"
echo "   ./scripts/monitoring/quick-check.sh"
echo "   ./scripts/monitoring/service-monitor.sh"

