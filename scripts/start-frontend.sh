#!/bin/bash

# HotGigs.ai Frontend Startup Script
# Automatically detects project structure and starts frontend service

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "${BLUE}🌐 HotGigs.ai Frontend Startup${NC}"
    echo "==================================="
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
print_status "  Frontend Dir: $FRONTEND_DIR"
print_status "  Package Manager: $PACKAGE_MANAGER"

# Set up file paths
PID_FILE="$PROJECT_ROOT/frontend.pid"
LOG_FILE="$PROJECT_ROOT/frontend.log"

print_header

# Check if frontend is already running
if [[ -f "$PID_FILE" ]]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        print_warning "Frontend is already running (PID: $PID)"
        print_status "Frontend URL: http://localhost:3002"
        exit 0
    else
        print_status "Removing stale PID file..."
        rm -f "$PID_FILE"
    fi
fi

# Check if port 3002 is in use
if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 3002 is already in use"
    print_status "Attempting to stop existing process..."
    
    # Try to kill process on port 3002
    PID_ON_PORT=$(lsof -Pi :3002 -sTCP:LISTEN -t)
    if [[ -n "$PID_ON_PORT" ]]; then
        kill -TERM $PID_ON_PORT 2>/dev/null
        sleep 2
        
        # Force kill if still running
        if ps -p $PID_ON_PORT > /dev/null 2>&1; then
            kill -KILL $PID_ON_PORT 2>/dev/null
        fi
    fi
fi

# Navigate to frontend directory
print_status "Navigating to frontend directory..."
cd "$FRONTEND_DIR" || {
    print_error "Failed to navigate to frontend directory: $FRONTEND_DIR"
    exit 1
}

# Install/update dependencies
print_status "Installing/updating dependencies..."
case "$PACKAGE_MANAGER" in
    "pnpm")
        if ! command -v pnpm &> /dev/null; then
            print_status "Installing pnpm..."
            npm install -g pnpm > /dev/null 2>&1
        fi
        pnpm install > /dev/null 2>&1 || {
            print_warning "Some dependencies failed to install"
        }
        ;;
    "yarn")
        if ! command -v yarn &> /dev/null; then
            print_status "Installing yarn..."
            npm install -g yarn > /dev/null 2>&1
        fi
        yarn install > /dev/null 2>&1 || {
            print_warning "Some dependencies failed to install"
        }
        ;;
    *)
        npm install > /dev/null 2>&1 || {
            print_warning "Some dependencies failed to install"
        }
        ;;
esac

# Create or update environment file
print_status "Setting up environment configuration..."
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=HotGigs.ai
VITE_APP_VERSION=1.0.0
EOF

# Start the frontend server
print_status "Starting frontend server..."

# Start server in background
case "$PACKAGE_MANAGER" in
    "pnpm")
        nohup pnpm dev --port 3002 > "$LOG_FILE" 2>&1 &
        ;;
    "yarn")
        nohup yarn dev --port 3002 > "$LOG_FILE" 2>&1 &
        ;;
    *)
        nohup npm run dev -- --port 3002 > "$LOG_FILE" 2>&1 &
        ;;
esac

FRONTEND_PID=$!

# Save PID
echo $FRONTEND_PID > "$PID_FILE"

# Wait a moment for server to start
sleep 5

# Check if server started successfully
if ps -p $FRONTEND_PID > /dev/null 2>&1; then
    # Test if server is responding
    sleep 3  # Give it more time to fully start
    if curl -s http://localhost:3002 > /dev/null 2>&1; then
        print_success "✅ Frontend started successfully"
        print_status "Frontend PID: $FRONTEND_PID"
        print_status "Frontend URL: http://localhost:3002"
        print_status "Admin Panel: http://localhost:3002/admin/login"
        print_status "Status Dashboard: http://localhost:3002/status"
        print_status "Log file: $LOG_FILE"
        
        # Show recent logs
        if [[ -f "$LOG_FILE" ]]; then
            print_status "Recent logs:"
            tail -5 "$LOG_FILE" | sed 's/^/  /'
        fi
        
        exit 0
    else
        print_warning "Frontend started but not responding on port 3002"
        print_status "This is normal - frontend may still be compiling..."
        print_status "Check http://localhost:3002 in a few moments"
        exit 0
    fi
else
    print_error "❌ Failed to start frontend"
    
    # Show error logs
    if [[ -f "$LOG_FILE" ]]; then
        print_status "Error logs:"
        tail -10 "$LOG_FILE"
    fi
    
    # Clean up PID file
    rm -f "$PID_FILE"
    exit 1
fi

