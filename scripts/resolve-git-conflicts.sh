#!/bin/bash

# HotGigs.ai Git Conflict Resolution Script
# This script helps resolve git merge conflicts and pull the latest admin system updates

set -e  # Exit on any error

echo "🔧 HotGigs.ai Git Conflict Resolution"
echo "===================================="

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

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This is not a git repository. Please run this script from your HotGigs project root."
    exit 1
fi

print_status "Checking git status..."

# Show current git status
git status

echo ""
print_warning "You have local changes that conflict with the remote repository."
print_status "We'll help you resolve this safely."

echo ""
echo "Choose an option:"
echo "1) Backup local changes and pull latest updates (RECOMMENDED)"
echo "2) Stash local changes temporarily and pull updates"
echo "3) Force overwrite local changes with remote (CAUTION: loses local work)"
echo "4) Cancel and resolve manually"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_status "Option 1: Backup and pull latest updates"
        
        # Create backup branch with current changes
        BACKUP_BRANCH="backup-local-changes-$(date +%Y%m%d-%H%M%S)"
        print_status "Creating backup branch: $BACKUP_BRANCH"
        
        # Add all changes to staging
        git add .
        
        # Commit current changes to backup branch
        git checkout -b "$BACKUP_BRANCH"
        git commit -m "Backup local changes before pulling admin system updates"
        
        print_success "Local changes backed up to branch: $BACKUP_BRANCH"
        
        # Switch back to main and pull updates
        git checkout main
        git reset --hard origin/main
        git pull origin main
        
        print_success "Successfully pulled latest admin system updates!"
        print_status "Your local changes are safely stored in branch: $BACKUP_BRANCH"
        print_status "You can view them later with: git checkout $BACKUP_BRANCH"
        ;;
        
    2)
        print_status "Option 2: Stash local changes and pull updates"
        
        # Stash current changes
        git stash push -m "Local changes before admin system update"
        
        print_success "Local changes stashed"
        
        # Pull latest updates
        git pull origin main
        
        print_success "Successfully pulled latest admin system updates!"
        print_status "Your local changes are in the stash."
        print_status "To restore them later, use: git stash pop"
        print_warning "Note: You may need to resolve conflicts when restoring stashed changes."
        ;;
        
    3)
        print_warning "Option 3: Force overwrite (this will PERMANENTLY DELETE your local changes)"
        read -p "Are you absolutely sure? Type 'YES' to confirm: " confirm
        
        if [ "$confirm" = "YES" ]; then
            print_status "Force overwriting local changes..."
            git reset --hard origin/main
            git pull origin main
            print_success "Successfully pulled latest admin system updates!"
            print_warning "All local changes have been permanently lost."
        else
            print_status "Operation cancelled."
            exit 0
        fi
        ;;
        
    4)
        print_status "Operation cancelled. You can resolve conflicts manually."
        echo ""
        echo "Manual resolution steps:"
        echo "1. Edit the conflicted files to resolve conflicts"
        echo "2. git add <resolved-files>"
        echo "3. git commit -m 'Resolve merge conflicts'"
        echo "4. git pull origin main"
        exit 0
        ;;
        
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
print_success "🎉 Git conflict resolution completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Run the admin system setup: ./scripts/setup-admin-system.sh"
echo "2. Access your application at: http://localhost:3002"
echo "3. Access admin panel at: http://localhost:3002/admin"
echo "4. Monitor system status at: http://localhost:3002/status"
echo ""
echo "🔐 Admin Credentials:"
echo "   Email: admin@hotgigs.ai"
echo "   Password: admin123"
echo ""

# Check if setup script exists and offer to run it
if [ -f "scripts/setup-admin-system.sh" ]; then
    echo ""
    read -p "Would you like to start the admin system now? (y/n): " start_system
    
    if [ "$start_system" = "y" ] || [ "$start_system" = "Y" ]; then
        print_status "Starting HotGigs.ai admin system..."
        ./scripts/setup-admin-system.sh
    else
        print_status "You can start the system later with: ./scripts/setup-admin-system.sh"
    fi
else
    print_warning "Setup script not found. Please ensure you have the latest updates."
fi

