#!/bin/bash

echo "📊 HotGigs.ai Sync Status Report"
echo "================================"

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

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository!"
    exit 1
fi

echo ""
echo "📁 Repository Status:"
echo "   Current directory: $(pwd)"
echo "   Current branch: $(git branch --show-current)"

# Check for uncommitted changes
UNCOMMITTED=$(git status --porcelain)
if [ -z "$UNCOMMITTED" ]; then
    print_status "Working directory clean"
else
    print_warning "Uncommitted changes detected:"
    git status --porcelain | sed 's/^/     /'
fi

echo ""
echo "🔄 Sync Status:"

# Check if up to date with remote
git fetch origin > /dev/null 2>&1
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    print_status "Up to date with GitHub"
else
    COMMITS_BEHIND=$(git rev-list --count HEAD..origin/main)
    print_warning "Behind GitHub by $COMMITS_BEHIND commits"
    echo "     Run ./scripts/local-cicd/sync-project.sh to update"
    
    echo ""
    echo "   📋 Latest commits on GitHub:"
    git log --oneline HEAD..origin/main | head -5 | sed 's/^/     /'
fi

# Check last sync time
echo ""
echo "🕐 Sync History:"
if [ -f "sync.log" ]; then
    LAST_SYNC=$(tail -n 1 sync.log | grep "completed" | cut -d: -f1-2)
    if [ -n "$LAST_SYNC" ]; then
        echo "   Last sync: $LAST_SYNC"
    else
        echo "   No completed sync found in log"
    fi
else
    echo "   No sync log found"
fi

echo ""
echo "🔧 Development Status:"

# Check backend status
if lsof -ti:8000 > /dev/null 2>&1; then
    print_status "Backend running on port 8000"
    
    # Test backend health
    if command -v curl > /dev/null 2>&1; then
        HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health 2>/dev/null)
        if [ "$HEALTH_CHECK" = "200" ]; then
            print_status "Backend health check passed"
        else
            print_warning "Backend health check failed (HTTP $HEALTH_CHECK)"
        fi
    fi
else
    print_error "Backend not running"
fi

# Check frontend status
if lsof -ti:5173 > /dev/null 2>&1; then
    print_status "Frontend running on port 5173"
else
    print_error "Frontend not running"
fi

# Check for alternative ports
OTHER_PORTS=$(lsof -ti:3000,3001,3002,5000,5001,8001 2>/dev/null)
if [ -n "$OTHER_PORTS" ]; then
    echo ""
    print_info "Other development ports in use:"
    for port in 3000 3001 3002 5000 5001 8001; do
        if lsof -ti:$port > /dev/null 2>&1; then
            PROCESS=$(lsof -ti:$port | head -1)
            PROCESS_NAME=$(ps -p $PROCESS -o comm= 2>/dev/null)
            echo "     Port $port: $PROCESS_NAME (PID: $PROCESS)"
        fi
    done
fi

echo ""
echo "📦 Dependencies Status:"

# Check frontend dependencies
if [ -f "frontend/hotgigs-frontend/package.json" ]; then
    cd frontend/hotgigs-frontend
    if [ -d "node_modules" ]; then
        print_status "Frontend dependencies installed"
        
        # Check if package.json is newer than node_modules
        if [ "package.json" -nt "node_modules" ]; then
            print_warning "package.json is newer than node_modules - consider running pnpm install"
        fi
    else
        print_error "Frontend dependencies not installed - run pnpm install"
    fi
    cd ../..
fi

# Check backend dependencies
if [ -f "backend/hotgigs-api/requirements.txt" ]; then
    cd backend/hotgigs-api
    if [ -d "venv" ]; then
        print_status "Backend virtual environment exists"
        
        # Check if requirements.txt is newer than venv
        if [ "requirements.txt" -nt "venv" ]; then
            print_warning "requirements.txt is newer than venv - consider updating dependencies"
        fi
    else
        print_error "Backend virtual environment not found - run python3 -m venv venv"
    fi
    cd ../..
fi

echo ""
echo "🎯 Quick Actions:"
echo "   Sync with GitHub:     ./scripts/local-cicd/sync-project.sh"
echo "   Start development:    ./scripts/local-cicd/start-dev.sh"
echo "   Stop development:     ./scripts/local-cicd/stop-dev.sh"
echo "   View this status:     ./scripts/local-cicd/check-sync.sh"

echo ""
echo "🌐 Application URLs (when running):"
echo "   Frontend:    http://localhost:5173"
echo "   Backend:     http://localhost:8000"
echo "   API Health:  http://localhost:8000/api/health"

