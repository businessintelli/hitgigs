#!/bin/bash

echo "🚀 Starting HotGigs.ai development environment..."

# Get the project root directory (two levels up from scripts/local-cicd)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "📁 Project Root: $PROJECT_ROOT"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to wait for service to start
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to start on port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if lsof -i :$port > /dev/null 2>&1; then
            print_status "$service_name started successfully on port $port"
            return 0
        fi
        
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start on port $port after $max_attempts seconds"
    return 1
}

# Function to test endpoint
test_endpoint() {
    local url=$1
    local name=$2
    
    if command -v curl > /dev/null 2>&1; then
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
        if [ "$response" = "200" ]; then
            print_status "$name endpoint responding (HTTP 200)"
            return 0
        elif [ "$response" = "000" ]; then
            print_warning "$name endpoint not reachable"
            return 1
        else
            print_warning "$name endpoint responding with HTTP $response"
            return 1
        fi
    else
        print_info "curl not available, skipping endpoint test"
        return 0
    fi
}

# Sync with latest changes first
echo ""
echo "🔄 Syncing with latest changes..."
if [ -f "./scripts/local-cicd/sync-project.sh" ]; then
    ./scripts/local-cicd/sync-project.sh
else
    print_warning "Sync script not found, skipping sync"
fi

echo ""

# Check if ports are already in use and handle them
for port in 8000 5173; do
    if lsof -i :$port > /dev/null 2>&1; then
        local pid=$(lsof -ti:$port | head -1)
        local cmd=$(ps -p $pid -o comm= 2>/dev/null)
        print_warning "Port $port is already in use by $cmd (PID: $pid)"
        
        read -p "Kill process on port $port? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            lsof -ti:$port | xargs kill -9 2>/dev/null
            sleep 2
            print_status "Process on port $port killed"
        else
            print_error "Cannot start services with port conflicts"
            exit 1
        fi
    fi
done

echo ""

# Start backend
print_info "🔧 Starting backend server..."
cd backend/hotgigs-api

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        print_error "Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
echo "🐍 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📦 Installing/updating backend dependencies..."
pip install -r requirements.txt > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_warning "Some dependencies failed to install, continuing anyway..."
fi

# Set environment variables for development
export PORT=8000
export FLASK_DEBUG=True
export ENVIRONMENT=development

# Start backend server in background
echo "🚀 Starting backend on port 8000..."
python src/main.py > backend.log 2>&1 &
BACKEND_PID=$!

# Store PID for cleanup
echo "$BACKEND_PID" > ../../../.backend-pid

cd ../..

# Wait for backend to start
if wait_for_service 8000 "Backend"; then
    # Test backend health
    sleep 2
    test_endpoint "http://localhost:8000/api/health" "Backend Health"
else
    print_error "Backend failed to start, check backend.log for details"
    if [ -f "backend/hotgigs-api/backend.log" ]; then
        echo "Last few lines of backend log:"
        tail -10 backend/hotgigs-api/backend.log
    fi
    exit 1
fi

echo ""

# Start frontend
print_info "🎨 Starting frontend server..."
cd frontend/hotgigs-frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    pnpm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
else
    echo "📦 Updating frontend dependencies..."
    pnpm install > /dev/null 2>&1
fi

# Start frontend server in background
echo "🚀 Starting frontend on port 5173..."
pnpm dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Store PID for cleanup
echo "$FRONTEND_PID" > ../../.frontend-pid

cd ../..

# Wait for frontend to start
if wait_for_service 5173 "Frontend"; then
    # Test frontend
    sleep 2
    test_endpoint "http://localhost:5173" "Frontend"
else
    print_error "Frontend failed to start, check frontend.log for details"
    if [ -f "frontend/hotgigs-frontend/frontend.log" ]; then
        echo "Last few lines of frontend log:"
        tail -10 frontend/hotgigs-frontend/frontend.log
    fi
    # Don't exit, backend might still be useful
fi

echo ""
print_status "Development environment setup complete! 🎉"
echo ""
echo "📱 Application URLs:"
echo "   🌐 Frontend:     http://localhost:5173"
echo "   🔧 Backend API:  http://localhost:8000"
echo "   ❤️  Health Check: http://localhost:8000/api/health"
echo "   📋 API Info:     http://localhost:8000/api"
echo ""
echo "📊 Process Information:"
if [ -f ".backend-pid" ]; then
    BACKEND_PID=$(cat .backend-pid)
    echo "   Backend PID:  $BACKEND_PID"
fi
if [ -f ".frontend-pid" ]; then
    FRONTEND_PID=$(cat .frontend-pid)
    echo "   Frontend PID: $FRONTEND_PID"
fi
echo ""
echo "📝 Log Files:"
echo "   Backend:  backend/hotgigs-api/backend.log"
echo "   Frontend: frontend/hotgigs-frontend/frontend.log"
echo ""
echo "🔧 Management Commands:"
echo "   Stop servers:     ./scripts/local-cicd/stop-dev.sh"
echo "   Check status:     ./scripts/local-cicd/check-sync.sh"
echo "   Monitor services: ./scripts/monitoring/service-monitor.sh"
echo "   Quick check:      ./scripts/monitoring/quick-check.sh"
echo ""
echo "💡 Tips:"
echo "   - Both services are running in the background"
echo "   - Check log files if you encounter issues"
echo "   - Use Ctrl+C to stop this script (services will continue running)"
echo "   - Use stop-dev.sh to properly stop all services"
echo ""

# Create a combined PID file for easy cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .dev-pids

# Keep script running to show real-time status
echo "🔄 Monitoring services (Press Ctrl+C to exit monitoring, services will continue)..."
echo ""

# Function to show status
show_status() {
    local backend_status="❌ Stopped"
    local frontend_status="❌ Stopped"
    
    if [ -f ".backend-pid" ] && kill -0 $(cat .backend-pid) 2>/dev/null; then
        backend_status="✅ Running"
    fi
    
    if [ -f ".frontend-pid" ] && kill -0 $(cat .frontend-pid) 2>/dev/null; then
        frontend_status="✅ Running"
    fi
    
    echo -e "\r🔧 Backend: $backend_status | 🎨 Frontend: $frontend_status | $(date '+%H:%M:%S')"
}

# Monitor services
trap "echo ''; echo '📋 Services are still running in background. Use ./scripts/local-cicd/stop-dev.sh to stop them.'; exit 0" INT

while true; do
    show_status
    sleep 5
done

