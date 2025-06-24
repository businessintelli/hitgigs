#!/bin/bash

# Setup script for HotGigs.ai local CI/CD automation
echo "🔧 Setting up HotGigs.ai Local CI/CD Automation..."

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

echo ""
print_info "Project directory: $PROJECT_ROOT"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository!"
    exit 1
fi

echo ""
echo "🔍 Checking prerequisites..."

# Check for required tools
MISSING_TOOLS=()

if ! command -v git > /dev/null 2>&1; then
    MISSING_TOOLS+=("git")
fi

if ! command -v node > /dev/null 2>&1; then
    MISSING_TOOLS+=("node")
fi

if ! command -v pnpm > /dev/null 2>&1; then
    MISSING_TOOLS+=("pnpm")
fi

if ! command -v python3 > /dev/null 2>&1; then
    MISSING_TOOLS+=("python3")
fi

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    print_error "Missing required tools: ${MISSING_TOOLS[*]}"
    echo ""
    echo "Please install missing tools:"
    for tool in "${MISSING_TOOLS[@]}"; do
        case $tool in
            "git")
                echo "   Git: brew install git"
                ;;
            "node")
                echo "   Node.js: brew install node"
                ;;
            "pnpm")
                echo "   pnpm: npm install -g pnpm"
                ;;
            "python3")
                echo "   Python: brew install python@3.11"
                ;;
        esac
    done
    exit 1
else
    print_status "All required tools are installed"
fi

echo ""
echo "📋 Available automation options:"
echo ""
echo "1. Manual sync scripts (Recommended)"
echo "   - Run sync manually when needed"
echo "   - Full control over when updates happen"
echo ""
echo "2. Scheduled auto-sync (Advanced)"
echo "   - Automatically sync every hour"
echo "   - Requires macOS launchd setup"
echo ""

read -p "Choose option (1 or 2): " OPTION

case $OPTION in
    1)
        echo ""
        print_info "Setting up manual sync scripts..."
        
        # Create symlinks in project root for easy access
        ln -sf scripts/local-cicd/sync-project.sh sync-project.sh 2>/dev/null
        ln -sf scripts/local-cicd/start-dev.sh start-dev.sh 2>/dev/null
        ln -sf scripts/local-cicd/stop-dev.sh stop-dev.sh 2>/dev/null
        ln -sf scripts/local-cicd/check-sync.sh check-sync.sh 2>/dev/null
        
        print_status "Manual sync scripts set up successfully!"
        echo ""
        echo "📋 Available commands:"
        echo "   ./sync-project.sh    - Sync with GitHub"
        echo "   ./start-dev.sh       - Start development environment"
        echo "   ./stop-dev.sh        - Stop development environment"
        echo "   ./check-sync.sh      - Check sync status"
        ;;
        
    2)
        echo ""
        print_info "Setting up scheduled auto-sync..."
        
        # Create the plist file with correct paths
        PLIST_FILE="$HOME/Library/LaunchAgents/com.hotgigs.autosync.plist"
        
        # Create LaunchAgents directory if it doesn't exist
        mkdir -p "$HOME/Library/LaunchAgents"
        
        # Generate plist file with actual paths
        cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.hotgigs.autosync</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>$PROJECT_ROOT/scripts/local-cicd/auto-sync.sh</string>
    </array>
    
    <key>StartInterval</key>
    <integer>3600</integer>
    
    <key>RunAtLoad</key>
    <true/>
    
    <key>StandardOutPath</key>
    <string>$PROJECT_ROOT/autosync-stdout.log</string>
    
    <key>StandardErrorPath</key>
    <string>$PROJECT_ROOT/autosync-stderr.log</string>
    
    <key>WorkingDirectory</key>
    <string>$PROJECT_ROOT</string>
    
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin</string>
    </dict>
</dict>
</plist>
EOF

        # Load the launch agent
        if launchctl load "$PLIST_FILE" 2>/dev/null; then
            print_status "Scheduled auto-sync set up successfully!"
            echo ""
            echo "📋 Auto-sync configuration:"
            echo "   Frequency: Every hour"
            echo "   Log file: $PROJECT_ROOT/auto-sync.log"
            echo "   Status: launchctl list | grep hotgigs"
            echo ""
            echo "🔧 Management commands:"
            echo "   Stop:  launchctl unload $PLIST_FILE"
            echo "   Start: launchctl load $PLIST_FILE"
            echo "   Logs:  tail -f $PROJECT_ROOT/auto-sync.log"
        else
            print_error "Failed to load launch agent"
            echo "You can manually load it later with:"
            echo "   launchctl load $PLIST_FILE"
        fi
        
        # Also set up manual scripts
        ln -sf scripts/local-cicd/sync-project.sh sync-project.sh 2>/dev/null
        ln -sf scripts/local-cicd/start-dev.sh start-dev.sh 2>/dev/null
        ln -sf scripts/local-cicd/stop-dev.sh stop-dev.sh 2>/dev/null
        ln -sf scripts/local-cicd/check-sync.sh check-sync.sh 2>/dev/null
        ;;
        
    *)
        print_error "Invalid option selected"
        exit 1
        ;;
esac

echo ""
print_status "Setup complete! 🎉"
echo ""
echo "🚀 Quick start:"
echo "   1. Check status: ./check-sync.sh"
echo "   2. Sync changes: ./sync-project.sh"
echo "   3. Start development: ./start-dev.sh"
echo ""
echo "📚 For more information, see:"
echo "   - LOCAL_CICD_SETUP_GUIDE.md"
echo "   - LOCAL_MAC_SETUP_GUIDE.md"
echo "   - TROUBLESHOOTING_GUIDE.md"

