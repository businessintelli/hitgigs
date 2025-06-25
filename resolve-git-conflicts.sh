#!/bin/bash

# HotGigs.ai Git Conflict Resolution Script
# ==========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🔧 HotGigs.ai Git Conflict Resolution${NC}"
echo "====================================="

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

# Check git status
print_header "📊 Current Git Status"
echo "======================"
git status

echo ""
print_header "🔍 Conflict Analysis"
echo "===================="

# Check for unmerged files
UNMERGED_FILES=$(git diff --name-only --diff-filter=U 2>/dev/null)
if [[ -n "$UNMERGED_FILES" ]]; then
    print_warning "Found unmerged files:"
    echo "$UNMERGED_FILES"
else
    print_status "No unmerged files found, checking for other issues..."
fi

# Check for uncommitted changes
UNCOMMITTED_CHANGES=$(git diff --name-only 2>/dev/null)
STAGED_CHANGES=$(git diff --cached --name-only 2>/dev/null)

if [[ -n "$UNCOMMITTED_CHANGES" ]]; then
    print_warning "Uncommitted changes found:"
    echo "$UNCOMMITTED_CHANGES"
fi

if [[ -n "$STAGED_CHANGES" ]]; then
    print_warning "Staged changes found:"
    echo "$STAGED_CHANGES"
fi

echo ""
print_header "🛠️ Resolution Options"
echo "====================="

echo "Choose how to resolve the conflict:"
echo ""
echo "1. 🔄 RESET TO LATEST (RECOMMENDED)"
echo "   • Discards all local changes"
echo "   • Gets latest service management scripts"
echo "   • Clean slate approach"
echo ""
echo "2. 💾 BACKUP & RESET"
echo "   • Creates backup branch with your changes"
echo "   • Resets to latest version"
echo "   • Preserves your work for later review"
echo ""
echo "3. 🔧 MANUAL RESOLUTION"
echo "   • Shows conflict files for manual editing"
echo "   • Advanced users only"
echo ""
echo "4. ❌ CANCEL"
echo "   • Exit without making changes"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_header "🔄 Resetting to Latest Version"
        echo "==============================="
        
        print_warning "This will discard ALL local changes!"
        read -p "Are you sure? (y/N): " confirm
        
        if [[ $confirm =~ ^[Yy]$ ]]; then
            print_status "Aborting current merge..."
            git merge --abort 2>/dev/null || true
            
            print_status "Resetting to remote main..."
            git reset --hard origin/main
            
            print_status "Pulling latest changes..."
            git pull origin main
            
            print_status "✅ Successfully updated to latest version!"
            echo ""
            echo "🎉 You now have the latest service management scripts!"
            echo "   • Start All: ./scripts/start-all.sh"
            echo "   • Stop All: ./scripts/stop-all.sh"
            echo "   • Status: ./scripts/status-all.sh"
        else
            print_status "Operation cancelled."
        fi
        ;;
        
    2)
        print_header "💾 Backup & Reset"
        echo "=================="
        
        BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
        
        print_status "Creating backup branch: $BACKUP_BRANCH"
        git checkout -b "$BACKUP_BRANCH" 2>/dev/null || true
        
        if [[ -n "$UNCOMMITTED_CHANGES" ]] || [[ -n "$STAGED_CHANGES" ]]; then
            print_status "Committing current changes to backup..."
            git add . 2>/dev/null || true
            git commit -m "Backup before conflict resolution - $(date)" 2>/dev/null || true
        fi
        
        print_status "Switching back to main..."
        git checkout main
        
        print_status "Aborting merge and resetting..."
        git merge --abort 2>/dev/null || true
        git reset --hard origin/main
        
        print_status "Pulling latest changes..."
        git pull origin main
        
        print_status "✅ Successfully updated with backup preserved!"
        echo ""
        echo "📋 Summary:"
        echo "   • Your changes backed up to: $BACKUP_BRANCH"
        echo "   • Main branch updated to latest"
        echo "   • View backup: git checkout $BACKUP_BRANCH"
        echo ""
        echo "🎉 You now have the latest service management scripts!"
        echo "   • Start All: ./scripts/start-all.sh"
        echo "   • Stop All: ./scripts/stop-all.sh"
        echo "   • Status: ./scripts/status-all.sh"
        ;;
        
    3)
        print_header "🔧 Manual Resolution"
        echo "===================="
        
        if [[ -n "$UNMERGED_FILES" ]]; then
            print_status "Unmerged files that need manual resolution:"
            echo "$UNMERGED_FILES"
            echo ""
            print_status "To resolve manually:"
            echo "1. Edit each file to resolve conflict markers (<<<<<<< ======= >>>>>>>)"
            echo "2. Run: git add <filename> for each resolved file"
            echo "3. Run: git commit -m 'Resolve merge conflicts'"
            echo "4. Run: git pull origin main"
            echo ""
            print_warning "This requires manual editing of conflict markers."
        else
            print_status "No unmerged files found. Trying to complete merge..."
            git add . 2>/dev/null || true
            git commit -m "Resolve merge conflicts" 2>/dev/null || true
            git pull origin main
        fi
        ;;
        
    4)
        print_status "Operation cancelled. No changes made."
        exit 0
        ;;
        
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
print_header "📊 Final Status"
echo "==============="
git status

echo ""
print_status "🎯 Next Steps:"
echo "   • Test your system: ./scripts/status-all.sh"
echo "   • Start services: ./scripts/start-all.sh"
echo "   • View all scripts: ls -la scripts/"

