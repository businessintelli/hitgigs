#!/bin/bash

# HotGigs.ai Complete System Start Script
# ========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🚀 HotGigs.ai Complete System Startup${NC}"
echo "========================================"

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

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if we're in the right directory
if [[ ! -d "scripts" ]] || [[ ! -d "frontend" ]] || [[ ! -d "backend" ]]; then
    print_error "Please run this script from the HotGigs.ai project root directory"
    echo "Current directory: $(pwd)"
    echo "Expected structure: scripts/, frontend/, backend/"
    exit 1
fi

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true

# Start backend first
print_header "📡 Starting Backend Service..."
echo "================================"
if ./scripts/start-backend.sh; then
    print_status "✅ Backend started successfully"
else
    print_error "❌ Failed to start backend"
    exit 1
fi

echo ""
sleep 2

# Start frontend
print_header "🌐 Starting Frontend Service..."
echo "================================="
if ./scripts/start-frontend.sh; then
    print_status "✅ Frontend started successfully"
else
    print_error "❌ Failed to start frontend"
    print_warning "Backend is still running. Use ./scripts/stop-backend.sh to stop it."
    exit 1
fi

echo ""
print_header "🎉 HotGigs.ai System Started Successfully!"
echo "=========================================="
echo ""
echo "📊 System Information:"
echo "   • Backend API: http://localhost:8000"
echo "   • Frontend App: http://localhost:3002"
echo "   • API Documentation: http://localhost:8000/docs"
echo "   • Admin Panel: http://localhost:3002/admin/login"
echo "   • Status Dashboard: http://localhost:3002/status"
echo ""
echo "🔐 Admin Credentials:"
echo "   • Email: admin@hotgigs.ai"
echo "   • Password: admin123"
echo ""
echo "👥 Demo User Accounts:"
echo "   • Job Seeker: john@example.com / user123"
echo "   • Company: hr@techcorp.com / company123"
echo "   • Recruiter: alice@recruiter.com / recruiter123"
echo ""
echo "🛠️  Management Commands:"
echo "   • Stop All: ./scripts/stop-all.sh"
echo "   • Stop Backend: ./scripts/stop-backend.sh"
echo "   • Stop Frontend: ./scripts/stop-frontend.sh"
echo "   • System Status: ./scripts/status-all.sh"
echo ""
echo "📝 Log Files:"
echo "   • Backend: backend/hotgigs-api/backend.log"
echo "   • Frontend: frontend/hotgigs-frontend/frontend.log"
echo ""
echo "🌟 Your HotGigs.ai platform is ready!"
echo "   Open http://localhost:3002 in your browser to get started."

