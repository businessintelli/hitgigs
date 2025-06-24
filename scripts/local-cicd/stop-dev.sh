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

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

# Kill processes from PID file if it exists
if [ -f ".dev-pids" ]; then
    echo "📋 Stopping servers from PID file..."
    while read -r line; do
        for pid in $line; do
            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid" 2>/dev/null
                echo "   Stopped process $pid"
            fi
        done
    done < .dev-pids
    rm -f .dev-pids
fi

# Kill processes on common ports
echo "🔍 Checking for processes on development ports..."

if lsof -ti:5173 > /dev/null 2>&1; then
    echo "   Stopping frontend (port 5173)..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
fi

if lsof -ti:8000 > /dev/null 2>&1; then
    echo "   Stopping backend (port 8000)..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
fi

# Kill by process name patterns
echo "🔍 Stopping development processes..."

# Stop Vite development server
if pgrep -f "vite" > /dev/null; then
    echo "   Stopping Vite processes..."
    pkill -f "vite" 2>/dev/null
fi

# Stop Python backend
if pgrep -f "python src/main.py" > /dev/null; then
    echo "   Stopping Python backend..."
    pkill -f "python src/main.py" 2>/dev/null
fi

# Stop Node.js processes related to the project
if pgrep -f "node.*hotgigs" > /dev/null; then
    echo "   Stopping Node.js processes..."
    pkill -f "node.*hotgigs" 2>/dev/null
fi

# Wait a moment for processes to stop
sleep 2

# Verify all processes are stopped
FRONTEND_RUNNING=$(lsof -ti:5173 2>/dev/null)
BACKEND_RUNNING=$(lsof -ti:8000 2>/dev/null)

if [ -z "$FRONTEND_RUNNING" ] && [ -z "$BACKEND_RUNNING" ]; then
    print_status "All development servers stopped successfully! 🎉"
else
    if [ -n "$FRONTEND_RUNNING" ]; then
        print_warning "Frontend may still be running on port 5173"
    fi
    if [ -n "$BACKEND_RUNNING" ]; then
        print_warning "Backend may still be running on port 8000"
    fi
    echo ""
    echo "If processes are still running, you can force stop them with:"
    echo "   sudo lsof -ti:5173 | xargs kill -9"
    echo "   sudo lsof -ti:8000 | xargs kill -9"
fi

echo ""
echo "🔧 To start development again, run:"
echo "   ./scripts/local-cicd/start-dev.sh"

