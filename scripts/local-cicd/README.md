# HotGigs.ai Local CI/CD Scripts

This directory contains automation scripts for local development and synchronization with GitHub.

## 📁 Scripts Overview

### **Core Scripts**
- `sync-project.sh` - Sync local repository with GitHub changes
- `start-dev.sh` - Start both frontend and backend development servers
- `stop-dev.sh` - Stop all development servers
- `check-sync.sh` - Check repository and development status

### **Automation Scripts**
- `auto-sync.sh` - Automated sync script for scheduled execution
- `setup-automation.sh` - Interactive setup for automation options

### **Configuration Files**
- `com.hotgigs.autosync.plist` - macOS launchd configuration template

## 🚀 Quick Start

### **Option 1: Manual Setup**
```bash
# Run the interactive setup
./scripts/local-cicd/setup-automation.sh

# Or manually create symlinks
ln -sf scripts/local-cicd/sync-project.sh sync-project.sh
ln -sf scripts/local-cicd/start-dev.sh start-dev.sh
ln -sf scripts/local-cicd/stop-dev.sh stop-dev.sh
ln -sf scripts/local-cicd/check-sync.sh check-sync.sh
```

### **Option 2: Direct Usage**
```bash
# Sync with GitHub
./scripts/local-cicd/sync-project.sh

# Start development environment
./scripts/local-cicd/start-dev.sh

# Check status
./scripts/local-cicd/check-sync.sh

# Stop development environment
./scripts/local-cicd/stop-dev.sh
```

## 🔄 Daily Workflow

1. **Check Status**
   ```bash
   ./check-sync.sh
   ```

2. **Sync Changes**
   ```bash
   ./sync-project.sh
   ```

3. **Start Development**
   ```bash
   ./start-dev.sh
   ```

4. **Stop Development**
   ```bash
   ./stop-dev.sh
   ```

## ⏰ Automated Sync Setup

### **macOS Scheduled Sync**
```bash
# Run the setup script and choose option 2
./scripts/local-cicd/setup-automation.sh

# Or manually set up launchd
cp scripts/local-cicd/com.hotgigs.autosync.plist ~/Library/LaunchAgents/
# Edit the plist file with correct paths
launchctl load ~/Library/LaunchAgents/com.hotgigs.autosync.plist
```

### **Cron Alternative**
```bash
# Add to crontab for hourly sync
crontab -e

# Add this line:
0 * * * * /path/to/hitgigs/scripts/local-cicd/auto-sync.sh
```

## 📊 Monitoring

### **Check Auto-Sync Status**
```bash
# Check if launchd job is running
launchctl list | grep hotgigs

# View auto-sync logs
tail -f auto-sync.log

# View launchd logs
tail -f autosync-stdout.log
tail -f autosync-stderr.log
```

### **Manual Status Check**
```bash
./check-sync.sh
```

## 🔧 Troubleshooting

### **Common Issues**

1. **Permission Denied**
   ```bash
   chmod +x scripts/local-cicd/*.sh
   ```

2. **Port Already in Use**
   ```bash
   ./stop-dev.sh
   # Wait a moment, then
   ./start-dev.sh
   ```

3. **Git Conflicts**
   ```bash
   git status
   git stash
   ./sync-project.sh
   git stash pop
   ```

4. **Dependencies Out of Date**
   ```bash
   # Frontend
   cd frontend/hotgigs-frontend
   pnpm install
   
   # Backend
   cd backend/hotgigs-api
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### **Reset Everything**
```bash
# Stop all servers
./stop-dev.sh

# Reset to GitHub state (WARNING: loses local changes)
git reset --hard origin/main

# Reinstall dependencies
cd frontend/hotgigs-frontend && pnpm install && cd ../..
cd backend/hotgigs-api && source venv/bin/activate && pip install -r requirements.txt && cd ../..

# Start fresh
./start-dev.sh
```

## 📋 Script Details

### **sync-project.sh**
- Stashes local changes
- Fetches and pulls from GitHub
- Updates dependencies if package files changed
- Restores local changes

### **start-dev.sh**
- Syncs with GitHub first
- Starts backend on port 8000
- Starts frontend on port 5173
- Creates PID file for easy cleanup

### **stop-dev.sh**
- Stops processes from PID file
- Kills processes on development ports
- Cleans up background processes

### **check-sync.sh**
- Shows git status and sync status
- Displays development server status
- Shows dependency status
- Provides quick action commands

### **auto-sync.sh**
- Designed for automated execution
- Logs all activities with timestamps
- Handles network connectivity issues
- Updates dependencies automatically

## 🎯 Best Practices

1. **Always check status before starting work**
   ```bash
   ./check-sync.sh
   ```

2. **Sync regularly to avoid conflicts**
   ```bash
   ./sync-project.sh
   ```

3. **Use the start/stop scripts for consistency**
   ```bash
   ./start-dev.sh  # Instead of manual commands
   ./stop-dev.sh   # Clean shutdown
   ```

4. **Monitor logs for automated sync**
   ```bash
   tail -f auto-sync.log
   ```

5. **Keep local changes minimal**
   - Commit frequently
   - Use feature branches for major changes
   - Stash temporary changes before syncing

## 🔗 Related Documentation

- `LOCAL_MAC_SETUP_GUIDE.md` - Initial setup instructions
- `LOCAL_CICD_SETUP_GUIDE.md` - Detailed CI/CD setup guide
- `TROUBLESHOOTING_GUIDE.md` - Common issues and solutions

