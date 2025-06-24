#!/bin/bash

# HotGigs.ai Admin System Setup and Start Script
# This script sets up and starts the complete admin system with all features

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

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the HotGigs.ai project root directory"
    exit 1
fi

print_status "Setting up HotGigs.ai Admin System..."

# Step 1: Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend/hotgigs-frontend

if command -v pnpm &> /dev/null; then
    print_status "Using pnpm for package management"
    pnpm install
else
    print_warning "pnpm not found, using npm"
    npm install
fi

# Add required dependencies for admin features
print_status "Adding admin-specific dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm add react-router-dom lucide-react axios
else
    npm install react-router-dom lucide-react axios
fi

cd ../..

# Step 2: Set up backend
print_status "Setting up backend environment..."
cd backend/hotgigs-api

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
pip install -r requirements.txt

cd ../..

# Step 3: Create environment files
print_status "Creating environment configuration..."

# Frontend environment
cat > frontend/hotgigs-frontend/.env << EOF
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=HotGigs.ai
VITE_APP_VERSION=1.0.0
VITE_ADMIN_ENABLED=true
EOF

# Backend environment
cat > backend/hotgigs-api/.env << EOF
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
cd backend/hotgigs-api
source venv/bin/activate

# Start backend in background
nohup python src/main.py > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

print_success "Backend started (PID: $BACKEND_PID)"

# Wait for backend to start
print_status "Waiting for backend to initialize..."
sleep 5

# Check if backend is running
if curl -s http://localhost:8000/api/health > /dev/null; then
    print_success "Backend API is healthy"
else
    print_error "Backend failed to start properly"
    cat backend.log
    exit 1
fi

cd ../..

# Start frontend
print_status "Starting frontend development server..."
cd frontend/hotgigs-frontend

# Start frontend in background
if command -v pnpm &> /dev/null; then
    nohup pnpm dev > frontend.log 2>&1 &
else
    nohup npm run dev > frontend.log 2>&1 &
fi

FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid

print_success "Frontend started (PID: $FRONTEND_PID)"

cd ../..

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
echo "  • API Info:     http://localhost:8000/api/info"
echo ""
echo "🔧 Admin Features:"
echo "  • Status Dashboard:    http://localhost:3002/status"
echo "  • Super Admin Panel:   http://localhost:3002/admin"
echo "  • System Monitoring:   Real-time service health checks"
echo "  • User Management:     Complete user administration"
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
echo "  • Stop services:    ./scripts/stop-services.sh"
echo "  • View logs:        tail -f backend/hotgigs-api/backend.log"
echo "  • View logs:        tail -f frontend/hotgigs-frontend/frontend.log"
echo ""

# Create a status check script
cat > scripts/check-admin-status.sh << 'EOF'
#!/bin/bash

echo "🔍 HotGigs.ai Admin System Status Check"
echo "======================================"

# Check backend
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo "✅ Backend API: Running (http://localhost:8000)"
else
    echo "❌ Backend API: Not responding"
fi

# Check frontend
if curl -s http://localhost:3002 > /dev/null; then
    echo "✅ Frontend: Running (http://localhost:3002)"
else
    echo "❌ Frontend: Not responding"
fi

# Check admin endpoints
if curl -s http://localhost:8000/api/admin/stats -H "Authorization: Bearer mock_token_1" > /dev/null; then
    echo "✅ Admin API: Available"
else
    echo "❌ Admin API: Not available"
fi

echo ""
echo "🌐 Quick Access Links:"
echo "  • Main App:        http://localhost:3002"
echo "  • Status Monitor:  http://localhost:3002/status"
echo "  • Admin Panel:     http://localhost:3002/admin"
EOF

chmod +x scripts/check-admin-status.sh

print_success "Admin system setup complete!"
print_status "Use './scripts/check-admin-status.sh' to check system status anytime"

# Final connectivity test
print_status "Running final connectivity test..."
sleep 3

if curl -s http://localhost:8000/api/health > /dev/null && curl -s http://localhost:3002 > /dev/null; then
    print_success "🎉 All systems operational! Admin system ready for use."
    echo ""
    echo "🚀 Open http://localhost:3002 in your browser to get started!"
else
    print_warning "Some services may still be starting. Please wait a moment and check manually."
fi

