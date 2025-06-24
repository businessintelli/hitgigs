# HotGigs.ai Diagnostic Tools

This directory contains diagnostic tools to help troubleshoot local development environment issues with the HotGigs.ai platform.

## 🛠️ Available Tools

### 1. Quick Diagnostic (`quick-diagnostic.sh`)
**Use when:** You need immediate feedback about your local environment

**What it does:**
- ✅ Quick system check (Node.js, Python, pnpm versions)
- ✅ Service status (frontend/backend running on which ports)
- ✅ Basic connectivity tests
- ✅ Key configuration files check
- ✅ Environment variables verification
- ✅ Instant recommendations

**Usage:**
```bash
./scripts/quick-diagnostic.sh
```

**Output:** Terminal display with colored status indicators

---

### 2. Comprehensive Diagnostic (`local-diagnostic.sh`)
**Use when:** You need detailed information for support requests

**What it does:**
- 📊 Complete system information
- 📦 All dependency versions and configurations
- 🔧 Detailed service analysis
- 🌐 Network connectivity tests
- 📁 Project structure analysis
- 📝 Configuration file contents
- 🔍 Log file analysis
- 📋 Environment variable dump

**Usage:**
```bash
./scripts/local-diagnostic.sh
```

**Output:** Detailed report file (`hotgigs_diagnostic_YYYYMMDD_HHMMSS.txt`)

---

## 📋 When to Use Each Tool

### Use Quick Diagnostic When:
- ❓ Services aren't starting
- ❓ Quick status check needed
- ❓ Immediate troubleshooting
- ❓ Verifying basic setup

### Use Comprehensive Diagnostic When:
- 🐛 Complex issues requiring support
- 🐛 Environment comparison needed
- 🐛 Detailed analysis required
- 🐛 Preparing support request

---

## 🚀 Quick Start Guide

### Step 1: Navigate to Project
```bash
cd /path/to/your/hitgigs
```

### Step 2: Start Services (Recommended)
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

### Step 3: Run Diagnostic
**For quick check:**
```bash
./scripts/quick-diagnostic.sh
```

**For detailed report:**
```bash
./scripts/local-diagnostic.sh
```

---

## 📊 Sample Quick Diagnostic Output

```
⚡ Quick HotGigs.ai Diagnostic
=============================

🔍 Checking system basics...
System: Darwin 23.1.0
Node.js: v20.10.0
Python: Python 3.11.6
pnpm: 8.10.5

🌐 Checking services...
✅ Frontend (port 3002): Running
✅ Backend (port 8000): Running

🧪 Testing frontend...
✅ Frontend HTTP: 200 (OK)

🧪 Testing backend...
✅ Backend Health: 200 (OK)
   Response: {"status":"healthy","service":"HotGigs.ai API"}

📁 Checking key files...
✅ Frontend package.json: Found
✅ Frontend .env: Found
✅ Vite config: Found
✅ Tailwind config: Found
✅ Main CSS file: Found
✅ Backend requirements: Found
✅ Backend .env: Found
✅ Backend main file: Found

🔧 Checking environment...
Frontend API URL: http://localhost:8000/api
Backend Port: 8000

⚡ Quick diagnostic complete!
```

---

## 📁 Comprehensive Diagnostic Report Contents

The detailed diagnostic report includes:

### System Information
- macOS version and system details
- Hardware information
- Current user and permissions

### Development Environment
- Node.js, npm, pnpm versions and locations
- Python and pip versions
- Git configuration and repository status

### Project Analysis
- Directory structure
- File permissions
- Configuration file contents
- Environment variables

### Service Status
- Running processes
- Port usage analysis
- Network connectivity tests
- API response testing

### Dependencies
- Frontend package.json and lock files
- Backend requirements and installed packages
- Version compatibility check

### Logs and Debugging
- Recent error logs
- Build output
- Console errors
- HTTP response analysis

---

## 🔧 Troubleshooting the Tools

### Permission Denied
```bash
chmod +x scripts/quick-diagnostic.sh
chmod +x scripts/local-diagnostic.sh
```

### Script Not Found
Ensure you're in the project root:
```bash
ls scripts/
```

### Services Not Detected
The tools work best when services are running, but provide useful information regardless.

---

## 🎯 Common Issues Detected

### Configuration Problems
- Missing environment files
- Incorrect API URLs
- Missing Tailwind configuration
- Wrong port configurations

### Dependency Issues
- Version mismatches
- Missing packages
- Lock file conflicts
- Path resolution problems

### Service Issues
- Port conflicts
- CORS problems
- API connectivity failures
- Authentication errors

### Build Problems
- Compilation errors
- Missing build tools
- Asset loading issues
- CSS processing problems

---

## 📤 Sharing Diagnostic Information

### For Support Requests
1. Run comprehensive diagnostic: `./scripts/local-diagnostic.sh`
2. Upload the generated `.txt` file
3. Include specific error messages
4. Describe what's working vs. not working

### Privacy Considerations
Review the diagnostic file before sharing:
- Remove sensitive API keys
- Check for personal information
- Verify no private data is included

---

## 🔄 Regular Maintenance

### Weekly Checks
```bash
./scripts/quick-diagnostic.sh
```

### Before Major Changes
```bash
./scripts/local-diagnostic.sh
```

### After Environment Updates
```bash
./scripts/quick-diagnostic.sh
```

---

## 📞 Getting Help

1. **Run diagnostics first** - Use the tools before asking for help
2. **Include diagnostic output** - Attach the report file
3. **Describe the issue** - What you expected vs. what happened
4. **Include steps to reproduce** - How to recreate the problem
5. **Mention your environment** - macOS version, hardware, etc.

---

## 🔮 Future Enhancements

Planned improvements:
- Automated fix suggestions
- Performance benchmarking
- Security vulnerability scanning
- Dependency update recommendations
- Integration with CI/CD pipelines

---

*These diagnostic tools are designed to make troubleshooting HotGigs.ai development issues faster and more effective. They collect the exact information needed to quickly identify and resolve problems.*

