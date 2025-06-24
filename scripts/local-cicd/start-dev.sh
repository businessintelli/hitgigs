#!/bin/bash

echo "🚀 Starting HotGigs.ai development environment..."

# Get the project root directory (two levels up from scripts/local-cicd)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

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

# Sync with latest changes first
echo "🔄 Syncing with latest changes..."
./scripts/local-cicd/sync-project.sh

# Check if ports are already in use
if lsof -ti:8000 > /dev/null 2>&1; then
    print_warning "Port 8000 is already in use. Stopping existing backend..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
fi

if lsof -ti:5173 > /dev/null 2>&1; then
    print_warning "Port 5173 is already in use. Stopping existing frontend..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
fi

# Start backend in background
echo "🔧 Starting backend server..."
cd backend/hotgigs-api

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
echo "Installing/updating backend dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# Start backend server
echo "Starting backend on port 8000..."
python src/main.py &
BACKEND_PID=$!
cd ../..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if lsof -ti:8000 > /dev/null 2>&1; then
    print_status "Backend started successfully on port 8000"
else
    print_error "Failed to start backend server"
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend/hotgigs-frontend

# Install/update dependencies
echo "Installing/updating frontend dependencies..."
pnpm install > /dev/null 2>&1

# Start frontend server
echo "Starting frontend on port 5173..."
pnpm dev &
FRONTEND_PID=$!
cd ../..

# Wait a moment for frontend to start
sleep 5

# Check if frontend started successfully
if lsof -ti:5173 > /dev/null 2>&1; then
    print_status "Frontend started successfully on port 5173"
else
    print_error "Failed to start frontend server"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
print_status "Development environment started successfully! 🎉"
echo ""
echo "📱 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Health: http://localhost:8000/api/health"
echo ""
echo "🔧 Development Commands:"
echo "   Stop servers: ./scripts/local-cicd/stop-dev.sh"
echo "   Check status: ./scripts/local-cicd/check-sync.sh"
echo "   Sync changes: ./scripts/local-cicd/sync-project.sh"
echo ""
echo "Press Ctrl+C to stop all servers"

# Create a PID file for easy cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .dev-pids

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .dev-pids; echo '✅ All servers stopped!'; exit" INT
wait

