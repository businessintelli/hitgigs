#!/bin/bash

# HotGigs.ai Backend Start Script
# ================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="backend/hotgigs-api"
VENV_DIR="$BACKEND_DIR/venv"
MAIN_FILE="$BACKEND_DIR/src/main.py"
PID_FILE="$BACKEND_DIR/backend.pid"
LOG_FILE="$BACKEND_DIR/backend.log"
PORT=8000

echo -e "${BLUE}🚀 HotGigs.ai Backend Startup${NC}"
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
if [[ ! -d "$BACKEND_DIR" ]]; then
    print_error "Backend directory not found. Please run from project root."
    echo "Current directory: $(pwd)"
    echo "Looking for: $BACKEND_DIR"
    exit 1
fi

# Check if backend is already running
if [[ -f "$PID_FILE" ]]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        print_warning "Backend is already running (PID: $PID)"
        echo "Backend URL: http://localhost:$PORT"
        echo "To stop: ./scripts/stop-backend.sh"
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

# Create virtual environment if it doesn't exist
if [[ ! -d "$VENV_DIR" ]]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv "$VENV_DIR"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip > /dev/null 2>&1

# Install/upgrade dependencies
print_status "Installing/updating dependencies..."
if [[ -f "$BACKEND_DIR/requirements.txt" ]]; then
    pip install -r "$BACKEND_DIR/requirements.txt" > /dev/null 2>&1
else
    print_warning "requirements.txt not found, installing basic dependencies..."
    pip install fastapi uvicorn python-multipart > /dev/null 2>&1
fi

# Initialize database if needed
print_status "Initializing database..."
cd "$BACKEND_DIR"
python -c "
import sys
sys.path.append('src')
try:
    from database import init_database
    init_database()
    print('Database initialized successfully')
except Exception as e:
    print(f'Database initialization: {e}')
" 2>/dev/null || print_warning "Database initialization skipped"

# Start the backend server
print_status "Starting backend server..."
cd "$BACKEND_DIR"  # Go to backend directory

# Start server in background
nohup python "$MAIN_FILE" > "$LOG_FILE" 2>&1 &
BACKEND_PID=$!

# Save PID
echo $BACKEND_PID > "$PID_FILE"

# Wait a moment for server to start
sleep 3

# Check if server started successfully
if ps -p $BACKEND_PID > /dev/null 2>&1; then
    # Test if server is responding
    if curl -s http://localhost:$PORT/api/health > /dev/null 2>&1; then
        print_status "✅ Backend server started successfully!"
        echo ""
        echo "📊 Backend Information:"
        echo "   • PID: $BACKEND_PID"
        echo "   • Port: $PORT"
        echo "   • URL: http://localhost:$PORT"
        echo "   • Health: http://localhost:$PORT/api/health"
        echo "   • API Docs: http://localhost:$PORT/docs"
        echo "   • Log file: $LOG_FILE"
        echo ""
        echo "🛠️  Management Commands:"
        echo "   • Stop: ./scripts/stop-backend.sh"
        echo "   • Status: ./scripts/status-backend.sh"
        echo "   • Logs: tail -f $LOG_FILE"
        echo ""
    else
        print_warning "Server started but not responding to health check"
        echo "Check logs: tail -f $LOG_FILE"
    fi
else
    print_error "Failed to start backend server"
    rm -f "$PID_FILE"
    echo "Check logs: tail -f $LOG_FILE"
    exit 1
fi

