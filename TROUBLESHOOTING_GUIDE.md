# HotGigs.ai Troubleshooting Guide

## 🚨 **Common Issues and Solutions**

### **1. Git Clone Issues**

**Problem**: `Permission denied (publickey)` or `Repository not found`
```bash
git clone https://github.com/businessintelli/hitgigs.git
# Error: Permission denied (publickey)
```

**Solutions**:
```bash
# Option 1: Use HTTPS instead of SSH
git clone https://github.com/businessintelli/hitgigs.git

# Option 2: Configure SSH key (if you prefer SSH)
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Add the output to your GitHub SSH keys

# Option 3: Use GitHub CLI
gh repo clone businessintelli/hitgigs
```

---

### **2. Node.js and pnpm Issues**

**Problem**: `command not found: node` or `command not found: pnpm`

**Solutions**:
```bash
# Install Node.js via Homebrew
brew install node

# Install pnpm globally
npm install -g pnpm

# Alternative: Install pnpm via Homebrew
brew install pnpm

# Verify installations
node --version
pnpm --version
```

**Problem**: `EACCES: permission denied` when installing packages

**Solutions**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use pnpm which handles permissions better
pnpm install
```

---

### **3. Frontend Import Resolution Issues**

**Problem**: `Failed to resolve import "@/lib/utils"`

**Solutions**:
```bash
# 1. Ensure jsconfig.json exists with correct path aliases
cat frontend/hotgigs-frontend/jsconfig.json

# 2. Clear node_modules and reinstall
cd frontend/hotgigs-frontend
rm -rf node_modules
pnpm install

# 3. Restart the development server
pnpm dev
```

**Problem**: `Module not found` errors

**Solutions**:
```bash
# Check if all dependencies are installed
pnpm install

# Install missing dependencies
pnpm add missing-package-name

# Clear cache and restart
rm -rf node_modules/.cache
pnpm dev
```

---

### **4. Port Conflicts**

**Problem**: `Port 5173 is already in use` or `Port 8000 is already in use`

**Solutions**:
```bash
# Find and kill processes using the port
lsof -ti:5173 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Use different ports
pnpm dev --port 3000  # Frontend
python src/main.py --port 8001  # Backend (if supported)

# Update environment variables accordingly
```

---

### **5. Python and Backend Issues**

**Problem**: `python: command not found` or version conflicts

**Solutions**:
```bash
# Install Python 3.11 via Homebrew
brew install python@3.11

# Use specific Python version
python3.11 --version

# Create virtual environment with specific version
python3.11 -m venv venv
source venv/bin/activate
```

**Problem**: `pip install` fails or dependency conflicts

**Solutions**:
```bash
# Upgrade pip
pip install --upgrade pip

# Install dependencies with verbose output
pip install -r requirements.txt -v

# Clear pip cache
pip cache purge

# Install dependencies one by one if bulk install fails
pip install flask
pip install flask-cors
# ... continue with other packages
```

---

### **6. Environment Variable Issues**

**Problem**: API calls failing or configuration not loading

**Solutions**:
```bash
# 1. Verify .env files exist
ls -la frontend/hotgigs-frontend/.env
ls -la backend/hotgigs-api/.env

# 2. Check environment variable format (no spaces around =)
# Correct: VITE_API_BASE_URL=http://localhost:8000/api
# Incorrect: VITE_API_BASE_URL = http://localhost:8000/api

# 3. Restart servers after changing .env files
# Frontend: Ctrl+C then pnpm dev
# Backend: Ctrl+C then python src/main.py
```

---

### **7. CORS Issues**

**Problem**: `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solutions**:
```bash
# 1. Ensure backend CORS is configured for frontend URL
# In backend .env:
FRONTEND_URL=http://localhost:5173

# 2. Check backend main.py has CORS configuration
# Should include: CORS(app, origins=["http://localhost:5173"])

# 3. Use the correct API base URL in frontend
# In frontend .env:
VITE_API_BASE_URL=http://localhost:8000/api
```

---

### **8. Database Connection Issues**

**Problem**: Backend fails to connect to Supabase or database

**Solutions**:
```bash
# 1. Verify Supabase credentials in backend .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# 2. Test connection manually
python -c "
from supabase import create_client
import os
url = 'your-supabase-url'
key = 'your-supabase-key'
supabase = create_client(url, key)
print('Connection successful')
"

# 3. Check Supabase project status at https://supabase.com
```

---

### **9. Build and Deployment Issues**

**Problem**: `pnpm build` fails or production build issues

**Solutions**:
```bash
# 1. Clear build cache
rm -rf frontend/hotgigs-frontend/dist
rm -rf frontend/hotgigs-frontend/.vite

# 2. Install dependencies and rebuild
cd frontend/hotgigs-frontend
pnpm install
pnpm build

# 3. Check for TypeScript errors
pnpm lint

# 4. Test production build locally
pnpm preview
```

---

### **10. macOS-Specific Issues**

**Problem**: Xcode command line tools missing

**Solutions**:
```bash
# Install Xcode command line tools
xcode-select --install

# Verify installation
xcode-select -p
```

**Problem**: Homebrew not installed

**Solutions**:
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add to PATH (follow Homebrew instructions)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

---

## 🔍 **Debugging Steps**

### **General Debugging Process**
1. **Check logs and error messages carefully**
2. **Verify all prerequisites are installed**
3. **Ensure environment files are configured correctly**
4. **Clear caches and restart servers**
5. **Check network connectivity and firewall settings**
6. **Verify file permissions**

### **Frontend Debugging**
```bash
# Check browser console for errors
# Open Developer Tools (F12) and check Console tab

# Verify API calls in Network tab
# Check if requests are being made to correct URLs

# Check React DevTools for component issues
# Install React Developer Tools browser extension
```

### **Backend Debugging**
```bash
# Run backend with debug mode
export DEBUG=True
python src/main.py

# Check backend logs for errors
# Look for stack traces and error messages

# Test API endpoints manually
curl http://localhost:8000/api/health
```

---

## 📞 **Getting Help**

### **Log Collection**
When reporting issues, include:

1. **System Information**
   ```bash
   # macOS version
   sw_vers
   
   # Node.js version
   node --version
   
   # Python version
   python3 --version
   
   # Git version
   git --version
   ```

2. **Error Messages**
   - Full error output from terminal
   - Browser console errors (if frontend issue)
   - Network tab information (if API issue)

3. **Configuration Files**
   - Contents of .env files (remove sensitive data)
   - package.json dependencies
   - requirements.txt dependencies

### **Useful Commands for Diagnostics**
```bash
# Check running processes
ps aux | grep node
ps aux | grep python

# Check port usage
netstat -an | grep LISTEN

# Check disk space
df -h

# Check memory usage
top -l 1 | grep PhysMem
```

---

## ✅ **Quick Fix Checklist**

When something isn't working, try these steps in order:

1. **Restart everything**
   - [ ] Stop frontend server (Ctrl+C)
   - [ ] Stop backend server (Ctrl+C)
   - [ ] Start backend: `python src/main.py`
   - [ ] Start frontend: `pnpm dev`

2. **Clear caches**
   - [ ] `rm -rf frontend/hotgigs-frontend/node_modules`
   - [ ] `pnpm install`
   - [ ] Clear browser cache (Cmd+Shift+R)

3. **Check configurations**
   - [ ] Verify .env files exist and have correct values
   - [ ] Check API URLs match between frontend and backend
   - [ ] Ensure no typos in environment variables

4. **Update dependencies**
   - [ ] `git pull origin main`
   - [ ] `pnpm install`
   - [ ] `pip install -r requirements.txt`

5. **Test basic functionality**
   - [ ] Backend health check: http://localhost:8000/api/health
   - [ ] Frontend loads: http://localhost:5173
   - [ ] No console errors in browser

---

**💡 Remember: Most issues are related to environment configuration, missing dependencies, or port conflicts. Following this troubleshooting guide should resolve 90% of common setup problems.**

