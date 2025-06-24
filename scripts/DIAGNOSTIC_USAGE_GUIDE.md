# HotGigs.ai Local Diagnostic Script - Usage Guide

## Overview
The `local-diagnostic.sh` script is a comprehensive diagnostic tool that collects detailed information about your local development environment. This helps identify differences between your local Mac setup and the working Manus environment.

## Prerequisites
- macOS system (the script is optimized for Mac)
- Terminal access
- HotGigs.ai project cloned locally
- Services running (frontend and backend)

## How to Use

### Step 1: Navigate to Project Directory
```bash
cd /path/to/your/hitgigs
```

### Step 2: Make Sure Services Are Running
Before running the diagnostic, ensure both services are active:

**Terminal 1 - Backend:**
```bash
cd backend/hotgigs-api
source venv/bin/activate
python src/main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend/hotgigs-frontend
pnpm dev
```

### Step 3: Run the Diagnostic Script
In a new terminal window:
```bash
./scripts/local-diagnostic.sh
```

### Step 4: Wait for Completion
The script will:
- Display progress with colored output
- Collect information from 15+ categories
- Generate a timestamped report file
- Show summary when complete

### Step 5: Upload the Report
The script generates a file named `hotgigs_diagnostic_YYYYMMDD_HHMMSS.txt`
Upload this file when requesting support.

## What Information is Collected

### 🖥️ System Information
- macOS version and system details
- Current user and directory
- Date and time

### 📦 Development Environment
- Node.js and npm/pnpm versions
- Python version and pip
- Git version and repository status

### 🏗️ Project Configuration
- Frontend package.json and dependencies
- Backend requirements.txt and packages
- Environment variables (.env files)
- Configuration files (vite.config.js, tailwind.config.js)

### 🔧 Service Status
- Running processes (Node.js, Python, Vite, Flask)
- Port usage (3002, 8000, 5173, 5000, 5001)
- Network connectivity tests

### 🌐 API Testing
- Frontend HTTP status
- Backend health endpoint
- API response content

### 📊 System Resources
- Disk space usage
- Memory and CPU load
- Browser versions

### 📝 Logs and Debugging
- Recent error logs
- Frontend HTML response
- HTTP headers
- Dependency lock files

## Sample Output
```
🔍 HotGigs.ai Local Environment Diagnostic
===========================================

Collecting diagnostic information...
Output will be saved to: hotgigs_diagnostic_20250624_143022.txt

✓ System information
✓ Node.js version
✓ Frontend configuration
✓ Backend configuration
✓ Running processes
✓ Network connectivity
...

✅ Diagnostic complete!
📄 Report saved to: hotgigs_diagnostic_20250624_143022.txt

📋 Next steps:
1. Upload the hotgigs_diagnostic_20250624_143022.txt to your support request
2. Include any specific error messages you're seeing
3. Mention what's working vs. not working in your local environment
```

## Troubleshooting the Script

### Permission Denied
```bash
chmod +x scripts/local-diagnostic.sh
```

### Script Not Found
Make sure you're in the project root directory:
```bash
ls scripts/local-diagnostic.sh
```

### Services Not Running
The script works best when services are running, but will still collect useful information if they're not.

### Large Output File
The diagnostic file is typically 50-200KB. If it's much larger, some commands may be producing excessive output.

## Privacy and Security

### What's Safe to Share
- System versions and configurations
- Project structure and dependencies
- Service status and connectivity
- Error messages and logs

### What's Excluded
- Personal files outside the project
- System passwords or keys
- Private environment variables (the script shows them, so review before sharing)

### Before Sharing
Review the generated file and remove any sensitive information like:
- API keys or secrets
- Personal paths or usernames you don't want to share
- Private repository URLs

## Common Issues Detected

The diagnostic script helps identify:

### 🔧 Configuration Issues
- Missing or incorrect environment variables
- Wrong API URLs
- Missing configuration files

### 📦 Dependency Problems
- Version mismatches
- Missing packages
- Lock file conflicts

### 🌐 Network Issues
- Port conflicts
- CORS problems
- Service connectivity

### 🏗️ Build Issues
- Compilation errors
- Missing build tools
- Path resolution problems

## Support Process

1. **Run the diagnostic** while experiencing the issue
2. **Upload the report file** with your support request
3. **Describe the specific problem** you're seeing
4. **Mention what works** vs. what doesn't work
5. **Include screenshots** if helpful

This comprehensive diagnostic approach helps quickly identify the root cause of local environment issues and provides targeted solutions.

