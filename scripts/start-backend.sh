#!/bin/bash

# HotGigs.ai Backend Startup Script
# Automatically detects project structure and starts backend service

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "${BLUE}🚀 HotGigs.ai Backend Startup${NC}"
    echo "=================================="
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load directory detection
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/detect-structure.sh"

# Detect project structure
print_status "Detecting project structure..."
if ! PROJECT_INFO=$(detect_project_structure); then
    print_error "Failed to detect project structure"
    exit 1
fi

# Parse the detected information
eval "$PROJECT_INFO"

print_status "Project structure detected:"
print_status "  Project Root: $PROJECT_ROOT"
print_status "  Backend Dir: $BACKEND_DIR"
print_status "  Main File: $MAIN_FILE"

# Set up file paths
PID_FILE="$PROJECT_ROOT/backend.pid"
LOG_FILE="$PROJECT_ROOT/backend.log"
VENV_DIR="$BACKEND_DIR/venv"

print_header

# Check if backend is already running
if [[ -f "$PID_FILE" ]]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        print_warning "Backend is already running (PID: $PID)"
        print_status "Backend URL: http://localhost:8000"
        print_status "API Docs: http://localhost:8000/docs"
        exit 0
    else
        print_status "Removing stale PID file..."
        rm -f "$PID_FILE"
    fi
fi

# Check if port 8000 is in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 8000 is already in use"
    print_status "Attempting to stop existing process..."
    
    # Try to kill process on port 8000
    PID_ON_PORT=$(lsof -Pi :8000 -sTCP:LISTEN -t)
    if [[ -n "$PID_ON_PORT" ]]; then
        kill -TERM $PID_ON_PORT 2>/dev/null
        sleep 2
        
        # Force kill if still running
        if ps -p $PID_ON_PORT > /dev/null 2>&1; then
            kill -KILL $PID_ON_PORT 2>/dev/null
        fi
    fi
fi

# Navigate to backend directory
print_status "Navigating to backend directory..."
cd "$BACKEND_DIR" || {
    print_error "Failed to navigate to backend directory: $BACKEND_DIR"
    exit 1
}

# Create virtual environment if it doesn't exist
if [[ ! -d "$VENV_DIR" ]]; then
    print_status "Creating virtual environment..."
    python3 -m venv venv || {
        print_error "Failed to create virtual environment"
        exit 1
    }
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate || {
    print_error "Failed to activate virtual environment"
    exit 1
}

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip > /dev/null 2>&1

# Install/update dependencies
print_status "Installing/updating dependencies..."
if [[ -f "requirements.txt" ]]; then
    pip install -r requirements.txt > /dev/null 2>&1 || {
        print_warning "Some dependencies failed to install"
    }
else
    print_status "Installing basic dependencies..."
    pip install fastapi uvicorn python-multipart > /dev/null 2>&1
fi

# Initialize database
print_status "Initializing database..."
python3 -c "
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
    if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
        print_success "✅ Backend started successfully"
        print_status "Backend PID: $BACKEND_PID"
        print_status "Backend URL: http://localhost:8000"
        print_status "API Documentation: http://localhost:8000/docs"
        print_status "Health Check: http://localhost:8000/api/health"
        print_status "Log file: $LOG_FILE"
        
        # Show recent logs
        if [[ -f "$LOG_FILE" ]]; then
            print_status "Recent logs:"
            tail -5 "$LOG_FILE" | sed 's/^/  /'
        fi
        
        exit 0
    else
        print_warning "Backend started but not responding on port 8000"
        print_status "Checking logs for errors..."
        if [[ -f "$LOG_FILE" ]]; then
            tail -10 "$LOG_FILE"
        fi
        exit 1
    fi
else
    print_error "❌ Failed to start backend"
    
    # Show error logs
    if [[ -f "$LOG_FILE" ]]; then
        print_status "Error logs:"
        tail -10 "$LOG_FILE"
    fi
    
    # Clean up PID file
    rm -f "$PID_FILE"
    exit 1
fi

