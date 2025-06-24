#!/bin/bash

# HotGigs.ai Local Sync Script
echo "🔄 Starting HotGigs.ai project sync..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository. Please run this script from your hitgigs project directory."
    exit 1
fi

# Stash any local changes
echo "📦 Stashing local changes..."
git stash push -m "Auto-stash before sync $(date)"

# Fetch latest changes
echo "📡 Fetching latest changes from GitHub..."
git fetch origin

# Check if there are updates
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    print_status "Already up to date!"
else
    echo "🔄 Pulling latest changes..."
    git pull origin main
    
    if [ $? -eq 0 ]; then
        print_status "Successfully synced with GitHub!"
        
        # Update frontend dependencies if package.json changed
        if git diff --name-only HEAD@{1} HEAD | grep -q "frontend/hotgigs-frontend/package.json"; then
            print_warning "package.json changed, updating dependencies..."
            cd frontend/hotgigs-frontend
            pnpm install
            cd ../..
        fi
        
        # Update backend dependencies if requirements.txt changed
        if git diff --name-only HEAD@{1} HEAD | grep -q "backend/hotgigs-api/requirements.txt"; then
            print_warning "requirements.txt changed, updating dependencies..."
            cd backend/hotgigs-api
            if [ -d "venv" ]; then
                source venv/bin/activate
                pip install -r requirements.txt
                deactivate
            else
                print_warning "Virtual environment not found. Please run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
            fi
            cd ../..
        fi
        
    else
        print_error "Failed to pull changes. Please resolve conflicts manually."
        exit 1
    fi
fi

# Restore stashed changes if any
STASH_COUNT=$(git stash list | wc -l)
if [ $STASH_COUNT -gt 0 ]; then
    echo "📦 Restoring your local changes..."
    git stash pop
fi

print_status "Sync complete! 🎉"
echo ""
echo "📋 Next steps:"
echo "   Frontend: cd frontend/hotgigs-frontend && pnpm dev"
echo "   Backend:  cd backend/hotgigs-api && source venv/bin/activate && python src/main.py"

