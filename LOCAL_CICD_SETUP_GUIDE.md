# HotGigs.ai Local Repository Sync & CI/CD Setup Guide

## 🔄 **Step 1: Sync Your Existing Local Repository**

Since you already have the code downloaded, let's sync it with the latest changes from GitHub:

### **Navigate to Your Existing Project**
```bash
# Go to your existing project directory
cd /path/to/your/existing/hitgigs
# For example: cd ~/Projects/hitgigs or cd ~/Desktop/hitgigs
```

### **Check Current Status**
```bash
# Check current branch and status
git status
git branch

# Check remote repository URL
git remote -v
```

### **Sync with Latest Changes**
```bash
# Fetch latest changes from GitHub
git fetch origin

# If you're on main branch and have no local changes:
git pull origin main

# If you have local changes you want to keep:
git stash                    # Save your local changes
git pull origin main         # Pull latest changes
git stash pop               # Restore your local changes

# If you want to completely reset to match GitHub (WARNING: This will lose local changes):
git reset --hard origin/main
```

### **Verify Sync Success**
```bash
# Check that you have the latest files
ls -la | grep -E "(iOS_|LOCAL_MAC_|TROUBLESHOOTING_)"

# Should show:
# iOS_DEVELOPMENT_PLAN_SUMMARY.md
# iOS_MOBILE_APP_DEVELOPMENT_PLAN.md
# LOCAL_MAC_SETUP_GUIDE.md
# TROUBLESHOOTING_GUIDE.md

# Check latest commit
git log --oneline -5
```

---

## 🤖 **Step 2: Set Up Local CI/CD Automation**

I'll create several automation scripts to keep your local environment in sync with GitHub changes.

### **Option A: Manual Sync Script (Recommended)**

Create a sync script that you can run whenever you want to update:

```bash
# Create the script
touch sync-project.sh
chmod +x sync-project.sh
```

Add this content to `sync-project.sh`:
```bash
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
```

### **Usage:**
```bash
# Run the sync script whenever you want to update
./sync-project.sh
```

---

## ⏰ **Step 3: Automated Sync Options**

### **Option B: Scheduled Auto-Sync (macOS)**

Set up automatic syncing using macOS launchd:

1. **Create the automation script:**
```bash
# Create auto-sync script
touch auto-sync.sh
chmod +x auto-sync.sh
```

Add this content to `auto-sync.sh`:
```bash
#!/bin/bash

# Auto-sync script for HotGigs.ai
PROJECT_DIR="/path/to/your/hitgigs"  # Update this path
LOG_FILE="$PROJECT_DIR/sync.log"

cd "$PROJECT_DIR"

echo "$(date): Starting auto-sync..." >> "$LOG_FILE"

# Run the sync script
./sync-project.sh >> "$LOG_FILE" 2>&1

echo "$(date): Auto-sync completed" >> "$LOG_FILE"
```

2. **Create launchd plist file:**
```bash
# Create the plist file
touch ~/Library/LaunchAgents/com.hotgigs.autosync.plist
```

Add this content to `~/Library/LaunchAgents/com.hotgigs.autosync.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.hotgigs.autosync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/your/hitgigs/auto-sync.sh</string>
    </array>
    <key>StartInterval</key>
    <integer>3600</integer> <!-- Run every hour -->
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/path/to/your/hitgigs/autosync.log</string>
    <key>StandardErrorPath</key>
    <string>/path/to/your/hitgigs/autosync.error.log</string>
</dict>
</plist>
```

3. **Load the scheduled task:**
```bash
# Load the launch agent
launchctl load ~/Library/LaunchAgents/com.hotgigs.autosync.plist

# Check if it's loaded
launchctl list | grep hotgigs
```

### **Option C: Git Hooks for Development Workflow**

Set up git hooks to automatically sync when you start working:

```bash
# Create post-merge hook
touch .git/hooks/post-merge
chmod +x .git/hooks/post-merge
```

Add this content to `.git/hooks/post-merge`:
```bash
#!/bin/bash

echo "🔄 Post-merge hook: Checking for dependency updates..."

# Check if package.json changed
if git diff --name-only HEAD@{1} HEAD | grep -q "frontend/hotgigs-frontend/package.json"; then
    echo "📦 Frontend dependencies updated, running pnpm install..."
    cd frontend/hotgigs-frontend
    pnpm install
    cd ../..
fi

# Check if requirements.txt changed
if git diff --name-only HEAD@{1} HEAD | grep -q "backend/hotgigs-api/requirements.txt"; then
    echo "🐍 Backend dependencies updated, running pip install..."
    cd backend/hotgigs-api
    if [ -d "venv" ]; then
        source venv/bin/activate
        pip install -r requirements.txt
        deactivate
    fi
    cd ../..
fi

echo "✅ Post-merge hook completed!"
```

---

## 🔧 **Step 4: Development Workflow Scripts**

Create convenient scripts for daily development:

### **Start Development Script**
```bash
# Create start-dev.sh
touch start-dev.sh
chmod +x start-dev.sh
```

Add this content to `start-dev.sh`:
```bash
#!/bin/bash

echo "🚀 Starting HotGigs.ai development environment..."

# Sync with latest changes first
./sync-project.sh

# Start backend in background
echo "🔧 Starting backend server..."
cd backend/hotgigs-api
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
python src/main.py &
BACKEND_PID=$!
cd ../..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend/hotgigs-frontend
pnpm install > /dev/null 2>&1
pnpm dev &
FRONTEND_PID=$!
cd ../..

echo ""
echo "✅ Development environment started!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
```

### **Stop Development Script**
```bash
# Create stop-dev.sh
touch stop-dev.sh
chmod +x stop-dev.sh
```

Add this content to `stop-dev.sh`:
```bash
#!/bin/bash

echo "🛑 Stopping HotGigs.ai development servers..."

# Kill processes on common ports
lsof -ti:5173 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

# Kill by process name
pkill -f "vite"
pkill -f "python src/main.py"

echo "✅ All development servers stopped!"
```

---

## 📊 **Step 5: Monitoring and Notifications**

### **Sync Status Script**
```bash
# Create check-sync.sh
touch check-sync.sh
chmod +x check-sync.sh
```

Add this content to `check-sync.sh`:
```bash
#!/bin/bash

echo "📊 HotGigs.ai Sync Status Report"
echo "================================"

# Check git status
echo "📁 Repository Status:"
git status --porcelain

# Check if up to date with remote
git fetch origin > /dev/null 2>&1
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✅ Up to date with GitHub"
else
    echo "⚠️  Behind GitHub by $(git rev-list --count HEAD..origin/main) commits"
    echo "   Run ./sync-project.sh to update"
fi

# Check last sync time
if [ -f "sync.log" ]; then
    echo "🕐 Last sync: $(tail -n 1 sync.log | grep "completed" | cut -d: -f1-2)"
fi

echo ""
echo "🔧 Development Status:"
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "✅ Backend running on port 8000"
else
    echo "❌ Backend not running"
fi

if lsof -ti:5173 > /dev/null 2>&1; then
    echo "✅ Frontend running on port 5173"
else
    echo "❌ Frontend not running"
fi
```

---

## 🎯 **Quick Commands Summary**

After setting up these scripts, your daily workflow becomes:

```bash
# Check sync status
./check-sync.sh

# Sync with GitHub
./sync-project.sh

# Start development environment
./start-dev.sh

# Stop development environment
./stop-dev.sh
```

---

## 📋 **Setup Checklist**

- [ ] Navigate to existing hitgigs directory
- [ ] Run `git pull origin main` to sync latest changes
- [ ] Create `sync-project.sh` script
- [ ] Create `start-dev.sh` and `stop-dev.sh` scripts
- [ ] Create `check-sync.sh` for monitoring
- [ ] (Optional) Set up automated sync with launchd
- [ ] (Optional) Set up git hooks for automatic dependency updates
- [ ] Test all scripts work correctly

---

**🎉 You now have a complete CI/CD-like workflow for keeping your local HotGigs.ai development environment in sync with GitHub!**

