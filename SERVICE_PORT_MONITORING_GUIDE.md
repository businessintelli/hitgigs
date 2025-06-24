# Complete Guide: Checking Running Services and Ports

## 🖥️ **macOS Commands (Your Local Mac)**

### **1. Check All Running Processes**

#### **Using `ps` (Process Status)**
```bash
# Show all running processes
ps aux

# Show processes in tree format
ps aux | grep -E "(node|python|npm|pnpm)"

# Show specific user processes
ps -u $(whoami)

# Show processes with full command line
ps auxww
```

#### **Using `top` (Real-time Process Monitor)**
```bash
# Interactive process monitor
top

# Show processes sorted by CPU usage
top -o cpu

# Show processes sorted by memory usage
top -o mem

# Non-interactive, show top 10 processes
top -l 1 -n 10
```

#### **Using `htop` (Enhanced top - if installed)**
```bash
# Install htop first
brew install htop

# Run htop
htop
```

---

### **2. Check Ports and Network Connections**

#### **Using `lsof` (List Open Files)**
```bash
# Show all network connections
lsof -i

# Show processes using specific port
lsof -i :8000
lsof -i :5173
lsof -i :3000

# Show all TCP connections
lsof -i tcp

# Show all UDP connections
lsof -i udp

# Show connections for specific process
lsof -p <process_id>

# Show files opened by specific process name
lsof -c node
lsof -c python
```

#### **Using `netstat` (Network Statistics)**
```bash
# Show all listening ports
netstat -an | grep LISTEN

# Show all TCP connections
netstat -an -p tcp

# Show all UDP connections
netstat -an -p udp

# Show processes using ports (requires sudo)
sudo netstat -tulpn

# Show specific port
netstat -an | grep :8000
```

#### **Using `ss` (Socket Statistics - if available)**
```bash
# Show all listening ports
ss -tuln

# Show all connections
ss -tuna

# Show processes using ports
ss -tulpn
```

---

### **3. HotGigs.ai Specific Checks**

#### **Check Development Servers**
```bash
# Check if backend is running (port 8000)
lsof -i :8000
curl -s http://localhost:8000/api/health

# Check if frontend is running (port 5173)
lsof -i :5173
curl -s http://localhost:5173

# Check alternative frontend ports
lsof -i :3000
lsof -i :3001
lsof -i :5000
```

#### **Check Node.js Processes**
```bash
# Find all Node.js processes
ps aux | grep node
pgrep -f node

# Find Vite development server
ps aux | grep vite
pgrep -f vite
```

#### **Check Python Processes**
```bash
# Find all Python processes
ps aux | grep python
pgrep -f python

# Find Flask application
ps aux | grep "python.*main.py"
pgrep -f "main.py"
```

---

### **4. Quick Port Checking Functions**

Add these to your `~/.zshrc` or `~/.bash_profile`:

```bash
# Function to check what's running on a port
check_port() {
    if [ -z "$1" ]; then
        echo "Usage: check_port <port_number>"
        return 1
    fi
    
    echo "Checking port $1..."
    lsof -i :$1
    
    if [ $? -eq 0 ]; then
        echo "Port $1 is in use"
    else
        echo "Port $1 is free"
    fi
}

# Function to kill process on a port
kill_port() {
    if [ -z "$1" ]; then
        echo "Usage: kill_port <port_number>"
        return 1
    fi
    
    echo "Killing processes on port $1..."
    lsof -ti:$1 | xargs kill -9
}

# Function to check HotGigs development status
check_hotgigs() {
    echo "🔍 HotGigs.ai Development Status"
    echo "================================"
    
    # Check backend
    if lsof -i :8000 > /dev/null 2>&1; then
        echo "✅ Backend running on port 8000"
        BACKEND_PID=$(lsof -ti:8000)
        echo "   PID: $BACKEND_PID"
        
        # Test health endpoint
        if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
            echo "   Health check: ✅ Passed"
        else
            echo "   Health check: ❌ Failed"
        fi
    else
        echo "❌ Backend not running"
    fi
    
    # Check frontend
    if lsof -i :5173 > /dev/null 2>&1; then
        echo "✅ Frontend running on port 5173"
        FRONTEND_PID=$(lsof -ti:5173)
        echo "   PID: $FRONTEND_PID"
    else
        echo "❌ Frontend not running"
    fi
    
    # Check for other common ports
    for port in 3000 3001 5000 8001; do
        if lsof -i :$port > /dev/null 2>&1; then
            PROCESS=$(lsof -ti:$port | head -1)
            PROCESS_NAME=$(ps -p $PROCESS -o comm= 2>/dev/null)
            echo "ℹ️  Port $port in use by $PROCESS_NAME (PID: $PROCESS)"
        fi
    done
}
```

After adding these functions, reload your shell:
```bash
source ~/.zshrc  # or ~/.bash_profile
```

Then use them:
```bash
check_port 8000
kill_port 8000
check_hotgigs
```

---

## 🐧 **Linux/Unix Commands (Development Server)**

### **1. Process Monitoring**

#### **Using `ps`**
```bash
# Show all processes
ps aux

# Show processes in tree format
ps auxf

# Show specific processes
ps aux | grep -E "(node|python|npm)"
```

#### **Using `top` and `htop`**
```bash
# Real-time process monitor
top

# Enhanced version (install with package manager)
htop
```

#### **Using `systemctl` (for systemd services)**
```bash
# List all running services
systemctl list-units --type=service --state=running

# Check specific service status
systemctl status nginx
systemctl status apache2
systemctl status postgresql
```

---

### **2. Network and Port Monitoring**

#### **Using `netstat`**
```bash
# Show all listening ports with process info
netstat -tulpn

# Show only TCP listening ports
netstat -tlpn

# Show only UDP listening ports
netstat -ulpn

# Show all connections
netstat -an
```

#### **Using `ss` (Modern replacement for netstat)**
```bash
# Show all listening ports
ss -tuln

# Show listening ports with process info
ss -tulpn

# Show all connections
ss -tuna

# Show connections for specific port
ss -tulpn | grep :8000
```

#### **Using `lsof`**
```bash
# Show all network connections
lsof -i

# Show specific port
lsof -i :8000

# Show all TCP connections
lsof -i tcp

# Show processes by name
lsof -c python
lsof -c node
```

---

### **3. Advanced Monitoring**

#### **Using `nmap` (Network Mapper)**
```bash
# Install nmap
sudo apt install nmap  # Ubuntu/Debian
brew install nmap      # macOS

# Scan localhost ports
nmap localhost

# Scan specific port range
nmap -p 8000-8010 localhost

# Scan for open ports on remote server
nmap your-server.com
```

#### **Using `fuser`**
```bash
# Find which process is using a port
fuser 8000/tcp

# Kill process using a port
fuser -k 8000/tcp
```

---

## 🔧 **Practical Examples for HotGigs.ai**

### **1. Complete Development Environment Check**

```bash
#!/bin/bash

echo "🔍 HotGigs.ai Complete Environment Check"
echo "========================================"

# Check Git repository status
if [ -d ".git" ]; then
    echo "📁 Git Status:"
    echo "   Branch: $(git branch --show-current)"
    echo "   Status: $(git status --porcelain | wc -l) uncommitted changes"
    echo ""
fi

# Check backend
echo "🔧 Backend Status:"
if lsof -i :8000 > /dev/null 2>&1; then
    BACKEND_PID=$(lsof -ti:8000)
    BACKEND_CMD=$(ps -p $BACKEND_PID -o command= 2>/dev/null)
    echo "   ✅ Running on port 8000 (PID: $BACKEND_PID)"
    echo "   Command: $BACKEND_CMD"
    
    # Test API health
    if command -v curl > /dev/null 2>&1; then
        HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health 2>/dev/null)
        if [ "$HEALTH" = "200" ]; then
            echo "   ✅ API Health Check: Passed"
        else
            echo "   ❌ API Health Check: Failed (HTTP $HEALTH)"
        fi
    fi
else
    echo "   ❌ Not running"
fi

echo ""

# Check frontend
echo "🎨 Frontend Status:"
if lsof -i :5173 > /dev/null 2>&1; then
    FRONTEND_PID=$(lsof -ti:5173)
    FRONTEND_CMD=$(ps -p $FRONTEND_PID -o command= 2>/dev/null)
    echo "   ✅ Running on port 5173 (PID: $FRONTEND_PID)"
    echo "   Command: $FRONTEND_CMD"
else
    echo "   ❌ Not running"
fi

echo ""

# Check for other development ports
echo "🌐 Other Development Ports:"
for port in 3000 3001 3002 5000 5001 8001; do
    if lsof -i :$port > /dev/null 2>&1; then
        PID=$(lsof -ti:$port | head -1)
        CMD=$(ps -p $PID -o comm= 2>/dev/null)
        echo "   Port $port: $CMD (PID: $PID)"
    fi
done

echo ""

# Check system resources
echo "💻 System Resources:"
if command -v free > /dev/null 2>&1; then
    # Linux
    echo "   Memory: $(free -h | grep '^Mem:' | awk '{print $3 "/" $2}')"
elif command -v vm_stat > /dev/null 2>&1; then
    # macOS
    echo "   Memory: $(vm_stat | grep 'Pages active' | awk '{print $3}') active pages"
fi

if command -v df > /dev/null 2>&1; then
    echo "   Disk: $(df -h . | tail -1 | awk '{print $3 "/" $2 " (" $5 " used)"}')"
fi

echo ""
echo "🎯 Quick Actions:"
echo "   Start development: ./start-dev.sh"
echo "   Stop development:  ./stop-dev.sh"
echo "   Sync with GitHub:  ./sync-project.sh"
```

### **2. Port Conflict Resolution**

```bash
#!/bin/bash

# Function to resolve port conflicts
resolve_port_conflict() {
    PORT=$1
    SERVICE_NAME=$2
    
    echo "🔍 Checking port $PORT for $SERVICE_NAME..."
    
    if lsof -i :$PORT > /dev/null 2>&1; then
        echo "⚠️  Port $PORT is in use:"
        lsof -i :$PORT
        
        read -p "Kill processes on port $PORT? (y/N): " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🛑 Killing processes on port $PORT..."
            lsof -ti:$PORT | xargs kill -9 2>/dev/null
            
            sleep 2
            
            if lsof -i :$PORT > /dev/null 2>&1; then
                echo "❌ Failed to free port $PORT"
                return 1
            else
                echo "✅ Port $PORT is now free"
                return 0
            fi
        else
            echo "❌ Port conflict not resolved"
            return 1
        fi
    else
        echo "✅ Port $PORT is free"
        return 0
    fi
}

# Usage
resolve_port_conflict 8000 "Backend"
resolve_port_conflict 5173 "Frontend"
```

### **3. Service Health Monitor**

```bash
#!/bin/bash

# Continuous monitoring script
monitor_services() {
    while true; do
        clear
        echo "🔄 HotGigs.ai Service Monitor - $(date)"
        echo "========================================"
        
        # Backend check
        if lsof -i :8000 > /dev/null 2>&1; then
            if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
                echo "✅ Backend: Healthy"
            else
                echo "⚠️  Backend: Running but unhealthy"
            fi
        else
            echo "❌ Backend: Not running"
        fi
        
        # Frontend check
        if lsof -i :5173 > /dev/null 2>&1; then
            echo "✅ Frontend: Running"
        else
            echo "❌ Frontend: Not running"
        fi
        
        echo ""
        echo "Press Ctrl+C to stop monitoring"
        sleep 5
    done
}

# Usage
monitor_services
```

---

## 📋 **Quick Reference Commands**

### **Most Common Commands**
```bash
# Check what's running on specific ports
lsof -i :8000    # Backend
lsof -i :5173    # Frontend
lsof -i :3000    # Alternative frontend

# Kill processes on specific ports
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Show all listening ports
netstat -an | grep LISTEN    # macOS/Linux
ss -tuln                     # Linux (modern)

# Find processes by name
ps aux | grep node
ps aux | grep python
pgrep -f "main.py"

# Check system resources
top                          # Interactive
ps aux --sort=-%cpu | head   # Top CPU users
ps aux --sort=-%mem | head   # Top memory users
```

### **HotGigs.ai Specific**
```bash
# Quick development status
./check-sync.sh              # If you have the CI/CD scripts

# Manual checks
curl http://localhost:8000/api/health    # Backend health
curl http://localhost:5173               # Frontend check

# Process management
pkill -f "python.*main.py"   # Kill backend
pkill -f "vite"              # Kill frontend
```

---

## 🚨 **Troubleshooting Common Issues**

### **Port Already in Use**
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9

# Or use fuser (Linux)
fuser -k 8000/tcp
```

### **Process Won't Die**
```bash
# Force kill with SIGKILL
kill -9 <PID>

# Kill all processes matching pattern
pkill -9 -f "pattern"
```

### **Can't Find Process**
```bash
# Search more broadly
ps auxww | grep -i hotgigs
ps auxww | grep -E "(node|python|npm|pnpm)"

# Check all network connections
lsof -i | grep -E "(8000|5173|3000)"
```

---

**💡 Pro Tip**: Save the useful commands as aliases in your shell configuration file (`~/.zshrc` or `~/.bash_profile`) for quick access!

