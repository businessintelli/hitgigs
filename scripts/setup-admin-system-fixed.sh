#!/bin/bash

# HotGigs.ai Admin System Setup & Start Script (Fixed)
# This script works from any directory and finds the correct project structure

set -e  # Exit on any error

echo "🚀 HotGigs.ai Admin System Setup & Start"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to find project root
find_project_root() {
    local current_dir="$(pwd)"
    local search_dir="$current_dir"
    
    # Look for project indicators in current and parent directories
    while [ "$search_dir" != "/" ]; do
        if [ -d "$search_dir/frontend/hotgigs-frontend" ] && [ -d "$search_dir/backend/hotgigs-api" ]; then
            echo "$search_dir"
            return 0
        elif [ -d "$search_dir/frontend" ] && [ -d "$search_dir/backend" ]; then
            echo "$search_dir"
            return 0
        elif [ -f "$search_dir/package.json" ] && [ -d "$search_dir/backend" ]; then
            echo "$search_dir"
            return 0
        fi
        search_dir="$(dirname "$search_dir")"
    done
    
    # If not found, check if we're already in frontend or backend directory
    if [[ "$current_dir" == *"/frontend"* ]] || [[ "$current_dir" == *"/backend"* ]]; then
        # Go up to find project root
        local parent_dir="$(dirname "$current_dir")"
        while [ "$parent_dir" != "/" ]; do
            if [ -d "$parent_dir/frontend" ] && [ -d "$parent_dir/backend" ]; then
                echo "$parent_dir"
                return 0
            fi
            parent_dir="$(dirname "$parent_dir")"
        done
    fi
    
    return 1
}

# Find and change to project root
print_status "Detecting project directory..."

PROJECT_ROOT=$(find_project_root)
if [ $? -eq 0 ]; then
    print_success "Found project root: $PROJECT_ROOT"
    cd "$PROJECT_ROOT"
else
    print_error "Could not find HotGigs.ai project root directory."
    echo ""
    echo "Please ensure you're in or near the project directory that contains:"
    echo "  • frontend/ directory"
    echo "  • backend/ directory"
    echo ""
    echo "Current directory: $(pwd)"
    echo "Directory contents:"
    ls -la
    exit 1
fi

# Verify project structure
print_status "Verifying project structure..."

FRONTEND_DIR=""
BACKEND_DIR=""

# Check for different possible directory structures
if [ -d "frontend/hotgigs-frontend" ]; then
    FRONTEND_DIR="frontend/hotgigs-frontend"
elif [ -d "frontend" ]; then
    FRONTEND_DIR="frontend"
else
    print_error "Frontend directory not found"
    exit 1
fi

if [ -d "backend/hotgigs-api" ]; then
    BACKEND_DIR="backend/hotgigs-api"
elif [ -d "backend" ]; then
    BACKEND_DIR="backend"
else
    print_error "Backend directory not found"
    exit 1
fi

print_success "Project structure verified:"
print_status "  Frontend: $FRONTEND_DIR"
print_status "  Backend: $BACKEND_DIR"

# Step 1: Install frontend dependencies
print_status "Installing frontend dependencies..."
cd "$FRONTEND_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in $FRONTEND_DIR"
    exit 1
fi

if command -v pnpm &> /dev/null; then
    print_status "Using pnpm for package management"
    pnpm install
    
    # Add required dependencies for admin features
    print_status "Adding admin-specific dependencies..."
    pnpm add react-router-dom lucide-react axios
else
    print_warning "pnpm not found, using npm"
    npm install
    
    # Add required dependencies for admin features
    print_status "Adding admin-specific dependencies..."
    npm install react-router-dom lucide-react axios
fi

cd "$PROJECT_ROOT"

# Step 2: Set up backend
print_status "Setting up backend environment..."
cd "$BACKEND_DIR"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Install backend dependencies
print_status "Installing backend dependencies..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    print_warning "requirements.txt not found, installing basic dependencies..."
    pip install fastapi uvicorn psutil python-jose passlib python-dotenv requests
fi

cd "$PROJECT_ROOT"

# Step 3: Create environment files
print_status "Creating environment configuration..."

# Frontend environment
cat > "$FRONTEND_DIR/.env" << EOF
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=HotGigs.ai
VITE_APP_VERSION=1.0.0
VITE_ADMIN_ENABLED=true
EOF

# Backend environment
cat > "$BACKEND_DIR/.env" << EOF
SECRET_KEY=dev-secret-key-change-in-production
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3002,http://localhost:3000
ADMIN_EMAIL=admin@hotgigs.ai
ADMIN_PASSWORD=admin123
EOF

print_success "Environment files created"

# Step 4: Start services
print_status "Starting HotGigs.ai services..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Kill existing processes on ports 8000 and 3002
print_status "Cleaning up existing processes..."
if check_port 8000; then
    print_warning "Port 8000 is in use, attempting to free it..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

if check_port 3002; then
    print_warning "Port 3002 is in use, attempting to free it..."
    lsof -ti:3002 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Start backend
print_status "Starting backend API server..."
cd "$BACKEND_DIR"
source venv/bin/activate

# Find the main Python file
MAIN_FILE=""
if [ -f "src/main.py" ]; then
    MAIN_FILE="src/main.py"
elif [ -f "main.py" ]; then
    MAIN_FILE="main.py"
elif [ -f "app.py" ]; then
    MAIN_FILE="app.py"
else
    print_error "Could not find main Python file (main.py, app.py, or src/main.py)"
    exit 1
fi

print_status "Starting backend with: $MAIN_FILE"

# Start backend in background
nohup python "$MAIN_FILE" > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

print_success "Backend started (PID: $BACKEND_PID)"

# Wait for backend to start
print_status "Waiting for backend to initialize..."
sleep 5

# Check if backend is running
if curl -s http://localhost:8000/api/health > /dev/null; then
    print_success "Backend API is healthy"
elif curl -s http://localhost:8000/health > /dev/null; then
    print_success "Backend API is healthy (alternative endpoint)"
elif curl -s http://localhost:8000/ > /dev/null; then
    print_success "Backend is running"
else
    print_warning "Backend may still be starting up..."
    print_status "Backend log:"
    tail -10 backend.log || echo "No log available yet"
fi

cd "$PROJECT_ROOT"

# Start frontend
print_status "Starting frontend development server..."
cd "$FRONTEND_DIR"

# Start frontend in background
if command -v pnpm &> /dev/null; then
    nohup pnpm dev > frontend.log 2>&1 &
else
    nohup npm run dev > frontend.log 2>&1 &
fi

FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid

print_success "Frontend started (PID: $FRONTEND_PID)"

cd "$PROJECT_ROOT"

# Wait for frontend to start
print_status "Waiting for frontend to initialize..."
sleep 10

# Check if frontend is running
if curl -s http://localhost:3002 > /dev/null; then
    print_success "Frontend is running"
else
    print_warning "Frontend may still be starting up..."
fi

# Step 5: Display status and access information
echo ""
echo "🎉 HotGigs.ai Admin System is now running!"
echo "=========================================="
echo ""
echo "📊 Service Status:"
echo "  • Backend API:  http://localhost:8000"
echo "  • Frontend App: http://localhost:3002"
echo "  • API Health:   http://localhost:8000/api/health"
echo ""
echo "🔧 Admin Features:"
echo "  • Status Dashboard:    http://localhost:3002/status"
echo "  • Super Admin Panel:   http://localhost:3002/admin"
echo ""
echo "🔐 Admin Credentials:"
echo "  • Email:    admin@hotgigs.ai"
echo "  • Password: admin123"
echo ""
echo "📱 Navigation:"
echo "  • Home:     http://localhost:3002/"
echo "  • Jobs:     http://localhost:3002/jobs"
echo "  • About:    http://localhost:3002/about"
echo "  • Contact:  http://localhost:3002/contact"
echo ""
echo "🛠️ Management Commands:"
echo "  • Stop services:    pkill -f 'python.*main.py' && pkill -f 'vite'"
echo "  • View backend log: tail -f $BACKEND_DIR/backend.log"
echo "  • View frontend log: tail -f $FRONTEND_DIR/frontend.log"
echo ""

print_success "Admin system setup complete!"

# Final connectivity test
print_status "Running final connectivity test..."
sleep 3

BACKEND_OK=false
FRONTEND_OK=false

if curl -s http://localhost:8000/api/health > /dev/null || curl -s http://localhost:8000/health > /dev/null || curl -s http://localhost:8000/ > /dev/null; then
    BACKEND_OK=true
fi

if curl -s http://localhost:3002 > /dev/null; then
    FRONTEND_OK=true
fi

if [ "$BACKEND_OK" = true ] && [ "$FRONTEND_OK" = true ]; then
    print_success "🎉 All systems operational! Admin system ready for use."
    echo ""
    echo "🚀 Open http://localhost:3002 in your browser to get started!"
elif [ "$BACKEND_OK" = true ]; then
    print_warning "Backend is running, frontend may still be starting up."
    echo "🚀 Try opening http://localhost:3002 in a minute or two."
elif [ "$FRONTEND_OK" = true ]; then
    print_warning "Frontend is running, but backend may have issues."
    echo "Check backend logs: tail -f $BACKEND_DIR/backend.log"
else
    print_warning "Services may still be starting. Please wait a moment and check manually."
    echo ""
    echo "To check status:"
    echo "  • Backend: curl http://localhost:8000/api/health"
    echo "  • Frontend: curl http://localhost:3002"
fi

