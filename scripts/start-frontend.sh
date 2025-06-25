#!/bin/bash

# HotGigs.ai Frontend Start Script
# =================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="frontend/hotgigs-frontend"
PID_FILE="$FRONTEND_DIR/frontend.pid"
LOG_FILE="$FRONTEND_DIR/frontend.log"
PORT=3002

echo -e "${BLUE}🚀 HotGigs.ai Frontend Startup${NC}"
echo "=================================="

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

# Check if we're in the right directory
if [[ ! -d "$FRONTEND_DIR" ]]; then
    print_error "Frontend directory not found. Please run from project root."
    echo "Current directory: $(pwd)"
    echo "Looking for: $FRONTEND_DIR"
    exit 1
fi

# Check if frontend is already running
if [[ -f "$PID_FILE" ]]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        print_warning "Frontend is already running (PID: $PID)"
        echo "Frontend URL: http://localhost:$PORT"
        echo "To stop: ./scripts/stop-frontend.sh"
        exit 0
    else
        print_warning "Stale PID file found, removing..."
        rm -f "$PID_FILE"
    fi
fi

# Check if port is in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_error "Port $PORT is already in use"
    echo "Please stop the service using port $PORT or use a different port"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check for package manager
PACKAGE_MANAGER=""
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
else
    print_error "No package manager found (pnpm or npm required)"
    exit 1
fi

print_status "Using package manager: $PACKAGE_MANAGER"

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Install/update dependencies
print_status "Installing/updating dependencies..."
if [[ "$PACKAGE_MANAGER" == "pnpm" ]]; then
    pnpm install > /dev/null 2>&1
else
    npm install > /dev/null 2>&1
fi

# Check if backend is running
print_status "Checking backend connectivity..."
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    print_status "✅ Backend is running and accessible"
else
    print_warning "⚠️  Backend is not running or not accessible"
    echo "   Consider starting backend first: ./scripts/start-backend.sh"
    echo "   Frontend will still start but API calls may fail"
fi

# Create environment file if it doesn't exist
if [[ ! -f ".env" ]]; then
    print_status "Creating environment file..."
    cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=HotGigs.ai
VITE_APP_VERSION=1.0.0
EOF
fi

# Start the frontend server
print_status "Starting frontend development server..."

# Go back to project root for relative paths
cd "$(dirname "$0")/.."

# Start server in background
if [[ "$PACKAGE_MANAGER" == "pnpm" ]]; then
    cd "$FRONTEND_DIR" && nohup pnpm dev --port $PORT --host 0.0.0.0 > "$LOG_FILE" 2>&1 &
else
    cd "$FRONTEND_DIR" && nohup npm run dev -- --port $PORT --host 0.0.0.0 > "$LOG_FILE" 2>&1 &
fi

FRONTEND_PID=$!

# Save PID
echo $FRONTEND_PID > "$PID_FILE"

# Wait for server to start
print_status "Waiting for frontend server to start..."
sleep 5

# Check if server started successfully
if ps -p $FRONTEND_PID > /dev/null 2>&1; then
    # Test if server is responding
    RETRY_COUNT=0
    MAX_RETRIES=10
    
    while [[ $RETRY_COUNT -lt $MAX_RETRIES ]]; do
        if curl -s http://localhost:$PORT > /dev/null 2>&1; then
            print_status "✅ Frontend server started successfully!"
            echo ""
            echo "📊 Frontend Information:"
            echo "   • PID: $FRONTEND_PID"
            echo "   • Port: $PORT"
            echo "   • URL: http://localhost:$PORT"
            echo "   • Admin: http://localhost:$PORT/admin/login"
            echo "   • Status: http://localhost:$PORT/status"
            echo "   • Log file: $LOG_FILE"
            echo ""
            echo "🛠️  Management Commands:"
            echo "   • Stop: ./scripts/stop-frontend.sh"
            echo "   • Status: ./scripts/status-frontend.sh"
            echo "   • Logs: tail -f $LOG_FILE"
            echo ""
            echo "🔐 Admin Credentials:"
            echo "   • Email: admin@hotgigs.ai"
            echo "   • Password: admin123"
            echo ""
            break
        fi
        
        ((RETRY_COUNT++))
        echo -n "."
        sleep 2
    done
    
    if [[ $RETRY_COUNT -eq $MAX_RETRIES ]]; then
        print_warning "Server started but not responding to HTTP requests"
        echo "Check logs: tail -f $LOG_FILE"
    fi
else
    print_error "Failed to start frontend server"
    rm -f "$PID_FILE"
    echo "Check logs: tail -f $LOG_FILE"
    exit 1
fi

