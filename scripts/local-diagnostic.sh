#!/bin/bash

# HotGigs.ai Local Environment Diagnostic Script
# This script collects comprehensive information about your local development environment
# Run this while your services are running for complete diagnosis

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Output file
OUTPUT_FILE="hotgigs_diagnostic_$(date +%Y%m%d_%H%M%S).txt"

echo -e "${BLUE}🔍 HotGigs.ai Local Environment Diagnostic${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""
echo "Collecting diagnostic information..."
echo "Output will be saved to: $OUTPUT_FILE"
echo ""

# Start output file
cat > "$OUTPUT_FILE" << EOF
HotGigs.ai Local Environment Diagnostic Report
Generated: $(date)
Host: $(hostname)
User: $(whoami)

===============================================
EOF

# Function to add section header
add_section() {
    echo "" >> "$OUTPUT_FILE"
    echo "===============================================" >> "$OUTPUT_FILE"
    echo "$1" >> "$OUTPUT_FILE"
    echo "===============================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# Function to run command and capture output
run_cmd() {
    local cmd="$1"
    local description="$2"
    
    echo -e "${YELLOW}Collecting: $description${NC}"
    
    echo "Command: $cmd" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    
    if eval "$cmd" >> "$OUTPUT_FILE" 2>&1; then
        echo -e "${GREEN}✓ $description${NC}"
    else
        echo -e "${RED}✗ Failed: $description${NC}"
        echo "ERROR: Command failed" >> "$OUTPUT_FILE"
    fi
    
    echo "" >> "$OUTPUT_FILE"
}

# System Information
add_section "SYSTEM INFORMATION"
run_cmd "uname -a" "System information"
run_cmd "sw_vers" "macOS version"
run_cmd "whoami" "Current user"
run_cmd "pwd" "Current directory"
run_cmd "date" "Current date/time"

# Node.js and Package Manager Information
add_section "NODE.JS AND PACKAGE MANAGERS"
run_cmd "node --version" "Node.js version"
run_cmd "npm --version" "npm version"
run_cmd "pnpm --version" "pnpm version"
run_cmd "which node" "Node.js location"
run_cmd "which npm" "npm location"
run_cmd "which pnpm" "pnpm location"

# Python Information
add_section "PYTHON INFORMATION"
run_cmd "python3 --version" "Python version"
run_cmd "which python3" "Python location"
run_cmd "pip3 --version" "pip version"

# Git Information
add_section "GIT INFORMATION"
run_cmd "git --version" "Git version"
run_cmd "git status" "Git repository status"
run_cmd "git branch" "Git branches"
run_cmd "git log --oneline -5" "Recent commits"
run_cmd "git remote -v" "Git remotes"

# Project Structure
add_section "PROJECT STRUCTURE"
run_cmd "find . -maxdepth 3 -type d | head -20" "Directory structure"
run_cmd "ls -la" "Root directory contents"

# Frontend Information
add_section "FRONTEND CONFIGURATION"
if [ -d "frontend/hotgigs-frontend" ]; then
    cd frontend/hotgigs-frontend
    run_cmd "pwd" "Frontend directory"
    run_cmd "ls -la" "Frontend files"
    run_cmd "cat package.json" "Frontend package.json"
    run_cmd "cat .env" "Frontend environment variables"
    run_cmd "cat vite.config.js" "Vite configuration"
    run_cmd "cat tailwind.config.js" "Tailwind configuration"
    run_cmd "cat jsconfig.json" "JavaScript configuration"
    run_cmd "head -20 src/index.css" "CSS imports"
    run_cmd "head -10 src/main.jsx" "Main entry point"
    run_cmd "head -20 src/App.jsx" "App component"
    run_cmd "pnpm list --depth=0" "Installed packages"
    cd ../..
else
    echo "Frontend directory not found" >> "$OUTPUT_FILE"
fi

# Backend Information
add_section "BACKEND CONFIGURATION"
if [ -d "backend/hotgigs-api" ]; then
    cd backend/hotgigs-api
    run_cmd "pwd" "Backend directory"
    run_cmd "ls -la" "Backend files"
    run_cmd "cat requirements.txt" "Python requirements"
    run_cmd "cat .env" "Backend environment variables"
    run_cmd "head -30 src/main.py" "Backend main file"
    run_cmd "source venv/bin/activate && pip list" "Installed Python packages"
    cd ../..
else
    echo "Backend directory not found" >> "$OUTPUT_FILE"
fi

# Running Processes
add_section "RUNNING PROCESSES"
run_cmd "ps aux | grep -E '(node|python|vite|flask)' | grep -v grep" "Development processes"
run_cmd "lsof -i :3002" "Frontend port (3002)"
run_cmd "lsof -i :8000" "Backend port (8000)"
run_cmd "lsof -i :5173" "Alternative frontend port (5173)"
run_cmd "lsof -i :5000" "Alternative frontend port (5000)"
run_cmd "lsof -i :5001" "Alternative backend port (5001)"

# Network and Connectivity
add_section "NETWORK CONNECTIVITY"
run_cmd "curl -s -o /dev/null -w '%{http_code}' http://localhost:3002" "Frontend HTTP status"
run_cmd "curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/api/health" "Backend health status"
run_cmd "curl -s http://localhost:8000/api/health" "Backend health response"
run_cmd "curl -s http://localhost:8000/api" "Backend API info"

# Browser and Development Tools
add_section "BROWSER INFORMATION"
run_cmd "defaults read com.google.Chrome Version" "Chrome version"
run_cmd "defaults read com.apple.Safari Version" "Safari version"

# Environment Variables
add_section "ENVIRONMENT VARIABLES"
run_cmd "env | grep -E '(NODE|NPM|PATH|PORT|VITE)' | sort" "Relevant environment variables"

# Disk Space and Memory
add_section "SYSTEM RESOURCES"
run_cmd "df -h ." "Disk space"
run_cmd "free -h" "Memory usage (if available)"
run_cmd "top -l 1 | head -10" "System load"

# Recent Logs (if any)
add_section "RECENT LOGS"
if [ -f "frontend/hotgigs-frontend/npm-debug.log" ]; then
    run_cmd "tail -50 frontend/hotgigs-frontend/npm-debug.log" "Frontend npm debug log"
fi

if [ -f "backend/hotgigs-api/app.log" ]; then
    run_cmd "tail -50 backend/hotgigs-api/app.log" "Backend application log"
fi

# Browser Console Simulation (if possible)
add_section "FRONTEND TESTING"
if command -v curl &> /dev/null; then
    run_cmd "curl -s http://localhost:3002 | head -20" "Frontend HTML response"
    run_cmd "curl -s -I http://localhost:3002" "Frontend HTTP headers"
fi

# Package Lock Files
add_section "DEPENDENCY LOCK FILES"
if [ -f "frontend/hotgigs-frontend/pnpm-lock.yaml" ]; then
    run_cmd "head -50 frontend/hotgigs-frontend/pnpm-lock.yaml" "pnpm lock file (first 50 lines)"
fi

if [ -f "frontend/hotgigs-frontend/package-lock.json" ]; then
    run_cmd "head -50 frontend/hotgigs-frontend/package-lock.json" "npm lock file (first 50 lines)"
fi

# Configuration Files
add_section "ADDITIONAL CONFIGURATION"
run_cmd "cat ~/.npmrc" "npm configuration"
run_cmd "cat ~/.gitconfig" "Git configuration"

# Final Summary
add_section "DIAGNOSTIC SUMMARY"
echo "Diagnostic completed at: $(date)" >> "$OUTPUT_FILE"
echo "Total sections collected: $(grep -c "===============================================" "$OUTPUT_FILE")" >> "$OUTPUT_FILE"
echo "Output file size: $(ls -lh "$OUTPUT_FILE" | awk '{print $5}')" >> "$OUTPUT_FILE"

echo ""
echo -e "${GREEN}✅ Diagnostic complete!${NC}"
echo -e "${BLUE}📄 Report saved to: $OUTPUT_FILE${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Upload the $OUTPUT_FILE to your support request"
echo "2. Include any specific error messages you're seeing"
echo "3. Mention what's working vs. not working in your local environment"
echo ""
echo -e "${BLUE}📊 Report contains:${NC}"
echo "• System and software versions"
echo "• Project configuration files"
echo "• Running processes and ports"
echo "• Network connectivity tests"
echo "• Environment variables"
echo "• Recent logs and errors"
echo ""

# Make the file readable
chmod 644 "$OUTPUT_FILE"

echo -e "${GREEN}🎯 Ready for analysis!${NC}"

