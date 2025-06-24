#!/bin/bash

# Quick Merge Conflict Resolution for HotGigs.ai
# Resolves the specific conflict in backend/hotgigs-api/src/main.py

echo "🔧 Resolving HotGigs.ai Merge Conflict"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_status "Checking git status..."
git status

echo ""
print_warning "You have a merge conflict in backend/hotgigs-api/src/main.py"
print_status "We'll resolve this by using the latest admin system version."

echo ""
echo "Choose resolution method:"
echo "1) Use latest admin system version (RECOMMENDED - gets all new features)"
echo "2) Keep your local version (may miss admin features)"
echo "3) View the conflict and resolve manually"

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        print_status "Using latest admin system version..."
        
        # Accept the incoming version (from remote)
        git checkout --theirs backend/hotgigs-api/src/main.py
        
        print_success "Conflict resolved with latest admin system version"
        ;;
        
    2)
        print_status "Keeping your local version..."
        
        # Accept the local version
        git checkout --ours backend/hotgigs-api/src/main.py
        
        print_success "Conflict resolved with your local version"
        print_warning "Note: You may be missing some admin system features"
        ;;
        
    3)
        print_status "Opening conflict file for manual resolution..."
        echo ""
        echo "The conflict is in: backend/hotgigs-api/src/main.py"
        echo ""
        echo "Look for these conflict markers:"
        echo "<<<<<<< HEAD (your changes)"
        echo "======= (separator)"
        echo ">>>>>>> origin/main (incoming changes)"
        echo ""
        echo "Edit the file to resolve conflicts, then run:"
        echo "git add backend/hotgigs-api/src/main.py"
        echo "git commit -m 'Resolve merge conflict in main.py'"
        exit 0
        ;;
        
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

# Add the resolved file
print_status "Adding resolved file to git..."
git add backend/hotgigs-api/src/main.py

# Commit the resolution
print_status "Committing merge resolution..."
git commit -m "Resolve merge conflict in main.py - use admin system version"

print_success "🎉 Merge conflict resolved successfully!"

echo ""
echo "📋 Next Steps:"
echo "1. Your git pull is now complete"
echo "2. Start the admin system: ./scripts/setup-admin-system.sh"
echo "3. Access admin panel: http://localhost:3002/admin"
echo ""

# Offer to start the system
read -p "Would you like to start the admin system now? (y/n): " start_now

if [ "$start_now" = "y" ] || [ "$start_now" = "Y" ]; then
    if [ -f "scripts/setup-admin-system.sh" ]; then
        print_status "Starting HotGigs.ai admin system..."
        ./scripts/setup-admin-system.sh
    else
        print_warning "Setup script not found. Please run: ./scripts/setup-admin-system.sh"
    fi
else
    print_status "You can start the system later with: ./scripts/setup-admin-system.sh"
fi

