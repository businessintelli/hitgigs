#!/bin/bash

# HotGigs.ai Frontend Stop Script
# ================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="frontend/hotgigs-frontend"
PID_FILE="$FRONTEND_DIR/frontend.pid"
LOG_FILE="$FRONTEND_DIR/frontend.log"
PORT=3002

echo -e "${BLUE}🛑 HotGigs.ai Frontend Stop${NC}"
echo "==============================="

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

# Check if PID file exists
if [[ ! -f "$PID_FILE" ]]; then
    print_warning "No PID file found. Frontend may not be running."
    
    # Check if any process is using the port
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Found process using port $PORT, attempting to stop..."
        PID=$(lsof -Pi :$PORT -sTCP:LISTEN -t)
        print_status "Stopping process $PID using port $PORT..."
        kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null
        sleep 2
        
        if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_status "✅ Process stopped successfully"
        else
            print_error "Failed to stop process using port $PORT"
        fi
    else
        print_status "No process found using port $PORT"
    fi
    
    # Also kill any Vite processes
    print_status "Checking for Vite processes..."
    if pgrep -f "vite.*dev" > /dev/null 2>&1; then
        print_status "Stopping Vite development server..."
        pkill -f "vite.*dev" 2>/dev/null || true
        sleep 1
    fi
    
    exit 0
fi

# Read PID from file
PID=$(cat "$PID_FILE")
print_status "Found PID file with PID: $PID"

# Check if process is running
if ! ps -p "$PID" > /dev/null 2>&1; then
    print_warning "Process $PID is not running"
    rm -f "$PID_FILE"
    print_status "Cleaned up stale PID file"
    
    # Still check for Vite processes
    if pgrep -f "vite.*dev" > /dev/null 2>&1; then
        print_status "Found orphaned Vite processes, cleaning up..."
        pkill -f "vite.*dev" 2>/dev/null || true
    fi
    
    exit 0
fi

# Attempt graceful shutdown
print_status "Attempting graceful shutdown of process $PID..."
kill -TERM $PID 2>/dev/null

# Wait for graceful shutdown
WAIT_TIME=10
for i in $(seq 1 $WAIT_TIME); do
    if ! ps -p "$PID" > /dev/null 2>&1; then
        print_status "✅ Frontend stopped gracefully"
        rm -f "$PID_FILE"
        
        # Verify port is free
        sleep 1
        if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_status "Port $PORT is now available"
        fi
        
        # Clean up any remaining Vite processes
        if pgrep -f "vite.*dev" > /dev/null 2>&1; then
            print_status "Cleaning up remaining Vite processes..."
            pkill -f "vite.*dev" 2>/dev/null || true
        fi
        
        echo ""
        echo "📊 Shutdown Summary:"
        echo "   • Frontend server stopped"
        echo "   • PID file cleaned up"
        echo "   • Port $PORT released"
        echo "   • Log file preserved: $LOG_FILE"
        echo ""
        exit 0
    fi
    echo -n "."
    sleep 1
done

echo ""
print_warning "Graceful shutdown timed out, forcing termination..."

# Force kill if graceful shutdown failed
kill -KILL $PID 2>/dev/null
sleep 2

# Also force kill any Vite processes
pkill -f "vite.*dev" 2>/dev/null || true

if ! ps -p "$PID" > /dev/null 2>&1; then
    print_status "✅ Frontend force-stopped"
    rm -f "$PID_FILE"
    
    # Verify port is free
    if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_status "Port $PORT is now available"
    fi
    
    echo ""
    echo "📊 Shutdown Summary:"
    echo "   • Frontend server force-stopped"
    echo "   • PID file cleaned up"
    echo "   • Port $PORT released"
    echo "   • Log file preserved: $LOG_FILE"
    echo ""
else
    print_error "Failed to stop frontend process $PID"
    exit 1
fi

