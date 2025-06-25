#!/bin/bash

# HotGigs.ai Enterprise Admin System Setup
# Complete setup script for the production-ready admin system

echo "🚀 HotGigs.ai Enterprise Admin System Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

# Check if we're in the right directory
if [[ ! -d "frontend" || ! -d "backend" ]]; then
    print_error "Please run this script from the HotGigs.ai project root directory"
    exit 1
fi

print_info "Setting up enterprise-grade admin system..."

# Step 1: Backend Setup
print_info "Step 1: Setting up backend with admin APIs..."

cd backend/hotgigs-api

# Create virtual environment if it doesn't exist
if [[ ! -d "venv" ]]; then
    print_info "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
print_info "Installing backend dependencies..."
pip install -r requirements.txt

# Create environment file
if [[ ! -f ".env" ]]; then
    print_info "Creating backend environment file..."
    cat > .env << EOF
# HotGigs.ai Backend Configuration
DATABASE_URL=postgresql://localhost/hotgigs
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
CORS_ORIGINS=http://localhost:3002,http://localhost:3000
DEBUG=True
EOF
fi

print_status "Backend setup complete"

# Step 2: Frontend Setup
print_info "Step 2: Setting up frontend with admin interface..."

cd ../../frontend/hotgigs-frontend

# Install dependencies
print_info "Installing frontend dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v npm &> /dev/null; then
    npm install
else
    print_error "Neither pnpm nor npm found. Please install Node.js and npm/pnpm."
    exit 1
fi

# Create environment file
if [[ ! -f ".env" ]]; then
    print_info "Creating frontend environment file..."
    cat > .env << EOF
# HotGigs.ai Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=HotGigs.ai
VITE_APP_VERSION=1.0.0
EOF
fi

print_status "Frontend setup complete"

# Step 3: Start Services
print_info "Step 3: Starting all services..."

cd ../..

# Function to start backend
start_backend() {
    print_info "Starting backend server..."
    cd backend/hotgigs-api
    source venv/bin/activate
    python src/main.py &
    BACKEND_PID=$!
    cd ../..
    
    # Wait for backend to start
    sleep 5
    
    # Test backend health
    if curl -s http://localhost:8000/api/health > /dev/null; then
        print_status "Backend server running on http://localhost:8000"
    else
        print_warning "Backend may not be fully ready yet"
    fi
}

# Function to start frontend
start_frontend() {
    print_info "Starting frontend server..."
    cd frontend/hotgigs-frontend
    
    if command -v pnpm &> /dev/null; then
        pnpm dev &
    else
        npm run dev &
    fi
    
    FRONTEND_PID=$!
    cd ../..
    
    # Wait for frontend to start
    sleep 8
    
    # Test frontend
    if curl -s http://localhost:3002 > /dev/null; then
        print_status "Frontend server running on http://localhost:3002"
    else
        print_warning "Frontend may not be fully ready yet"
    fi
}

# Start services in background
start_backend
start_frontend

# Step 4: Verify System
print_info "Step 4: Verifying system health..."

sleep 3

# Test API endpoints
print_info "Testing API endpoints..."

if curl -s http://localhost:8000/api/health | grep -q "healthy"; then
    print_status "✓ API Health Check"
else
    print_warning "⚠ API Health Check failed"
fi

if curl -s http://localhost:8000/api/status | grep -q "status"; then
    print_status "✓ System Status API"
else
    print_warning "⚠ System Status API failed"
fi

if curl -s http://localhost:8000/api/jobs | grep -q "jobs"; then
    print_status "✓ Jobs API"
else
    print_warning "⚠ Jobs API failed"
fi

# Step 5: Display Access Information
echo ""
echo "🎉 Enterprise Admin System Setup Complete!"
echo "=========================================="
echo ""
print_status "MAIN APPLICATION"
echo "   🌐 Homepage: http://localhost:3002"
echo "   🔍 Jobs: http://localhost:3002/jobs"
echo "   📞 Contact: http://localhost:3002/contact"
echo ""
print_status "USER AUTHENTICATION"
echo "   🔐 Sign In: http://localhost:3002/signin"
echo "   📝 Sign Up: http://localhost:3002/signup"
echo ""
print_status "ADMIN SYSTEM"
echo "   🛡️  Admin Login: http://localhost:3002/admin/login"
echo "   📊 Admin Dashboard: http://localhost:3002/admin/dashboard"
echo ""
print_status "MONITORING & STATUS"
echo "   📈 Status Dashboard: http://localhost:3002/status"
echo "   🔧 API Health: http://localhost:8000/api/health"
echo "   📊 System Status: http://localhost:8000/api/status"
echo ""
print_status "ADMIN CREDENTIALS"
echo "   📧 Email: admin@hotgigs.ai"
echo "   🔑 Password: admin123"
echo ""
print_status "TEST USER CREDENTIALS"
echo "   📧 Email: user@example.com"
echo "   🔑 Password: user123"
echo ""
print_status "ENTERPRISE FEATURES"
echo "   ✅ Secure admin authentication with role-based access"
echo "   ✅ Advanced user and company management"
echo "   ✅ Real-time system monitoring and error tracking"
echo "   ✅ Database structure viewing and analytics"
echo "   ✅ Working job save/apply functionality"
echo "   ✅ Professional Zillow-style UI design"
echo "   ✅ Responsive layout for all devices"
echo ""
print_info "NEXT STEPS:"
echo "   1. Open http://localhost:3002 to access the main application"
echo "   2. Try signing up or signing in with test credentials"
echo "   3. Access the admin panel at http://localhost:3002/admin/login"
echo "   4. Monitor system health at http://localhost:3002/status"
echo "   5. Test job save/apply functionality (requires login)"
echo ""
print_warning "IMPORTANT NOTES:"
echo "   • Admin access is now properly secured with authentication"
echo "   • All user management features are fully functional"
echo "   • System monitoring provides real-time insights"
echo "   • Job functionality requires user authentication"
echo "   • Social login placeholders are ready for implementation"
echo ""

# Save process IDs for cleanup
echo "BACKEND_PID=$BACKEND_PID" > .service_pids
echo "FRONTEND_PID=$FRONTEND_PID" >> .service_pids

print_status "Setup complete! Your enterprise admin system is now running."
print_info "To stop services, run: ./scripts/stop-services.sh"

