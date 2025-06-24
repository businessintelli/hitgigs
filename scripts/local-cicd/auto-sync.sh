#!/bin/bash

# Auto-sync script for HotGigs.ai
# This script can be run by cron or launchd for automatic syncing

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_FILE="$PROJECT_ROOT/auto-sync.log"

# Ensure we're in the project directory
cd "$PROJECT_ROOT"

# Function to log with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" >> "$LOG_FILE"
}

log_message "Starting auto-sync..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    log_message "ERROR: Not in a git repository"
    exit 1
fi

# Check for internet connectivity
if ! ping -c 1 github.com > /dev/null 2>&1; then
    log_message "WARNING: No internet connectivity, skipping sync"
    exit 0
fi

# Fetch latest changes
log_message "Fetching latest changes from GitHub..."
git fetch origin >> "$LOG_FILE" 2>&1

# Check if there are updates
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    log_message "Already up to date"
else
    log_message "Updates available, syncing..."
    
    # Stash any local changes
    git stash push -m "Auto-stash before sync $(date)" >> "$LOG_FILE" 2>&1
    
    # Pull latest changes
    if git pull origin main >> "$LOG_FILE" 2>&1; then
        log_message "Successfully synced with GitHub"
        
        # Check for dependency updates
        if git diff --name-only HEAD@{1} HEAD | grep -q "frontend/hotgigs-frontend/package.json"; then
            log_message "Frontend dependencies updated, installing..."
            cd frontend/hotgigs-frontend
            pnpm install >> "$LOG_FILE" 2>&1
            cd ../..
        fi
        
        if git diff --name-only HEAD@{1} HEAD | grep -q "backend/hotgigs-api/requirements.txt"; then
            log_message "Backend dependencies updated, installing..."
            cd backend/hotgigs-api
            if [ -d "venv" ]; then
                source venv/bin/activate
                pip install -r requirements.txt >> "$LOG_FILE" 2>&1
                deactivate
            fi
            cd ../..
        fi
        
        # Restore stashed changes if any
        STASH_COUNT=$(git stash list | wc -l)
        if [ $STASH_COUNT -gt 0 ]; then
            log_message "Restoring local changes..."
            git stash pop >> "$LOG_FILE" 2>&1
        fi
        
    else
        log_message "ERROR: Failed to pull changes"
        exit 1
    fi
fi

log_message "Auto-sync completed successfully"

# Keep only last 100 lines of log
tail -n 100 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"

