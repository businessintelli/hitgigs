#!/bin/bash

# HotGigs.ai Local Environment Fix Script
# This script addresses the specific issues found in your diagnostic report

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 HotGigs.ai Local Environment Fix${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend/hotgigs-frontend" ] || [ ! -d "backend/hotgigs-api" ]; then
    echo -e "${RED}❌ Error: Not in HotGigs project directory${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}📋 Based on your diagnostic report, fixing these issues:${NC}"
echo "1. Backend not running (critical)"
echo "2. Configuration drift from repository"
echo "3. Frontend/backend connectivity"
echo "4. Environment file setup"
echo ""

# Step 1: Sync with repository
echo -e "${YELLOW}🔄 Step 1: Syncing with latest repository...${NC}"

# Stash any local changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo -e "${BLUE}💾 Stashing local changes...${NC}"
    git stash push -m "Auto-stash before environment fix $(date)"
fi

# Pull latest changes
echo -e "${BLUE}📡 Pulling latest changes...${NC}"
git pull origin main

# Check if we need to restore stashed changes
if git stash list | grep -q "Auto-stash before environment fix"; then
    echo -e "${BLUE}📦 Restoring your local changes...${NC}"
    git stash pop
fi

echo -e "${GREEN}✅ Repository sync complete${NC}"
echo ""

# Step 2: Fix Frontend Configuration
echo -e "${YELLOW}🎨 Step 2: Fixing frontend configuration...${NC}"

cd frontend/hotgigs-frontend

# Create/update .env file
echo -e "${BLUE}📝 Creating frontend .env file...${NC}"
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=HotGigs.ai
VITE_APP_VERSION=1.0.0
EOF

# Verify Tailwind config exists
if [ ! -f "tailwind.config.js" ]; then
    echo -e "${BLUE}🎨 Creating Tailwind configuration...${NC}"
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
EOF
fi

# Verify utils.js exists
if [ ! -f "src/lib/utils.js" ]; then
    echo -e "${BLUE}🛠️ Creating utils.js file...${NC}"
    mkdir -p src/lib
    cat > src/lib/utils.js << 'EOF'
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
EOF
fi

# Install dependencies if needed
echo -e "${BLUE}📦 Installing/updating frontend dependencies...${NC}"
pnpm install

cd ../..

echo -e "${GREEN}✅ Frontend configuration fixed${NC}"
echo ""

# Step 3: Fix Backend Configuration
echo -e "${YELLOW}🔧 Step 3: Fixing backend configuration...${NC}"

cd backend/hotgigs-api

# Create/update .env file
echo -e "${BLUE}📝 Creating backend .env file...${NC}"
cat > .env << EOF
PORT=8000
FLASK_DEBUG=True
ENVIRONMENT=development
FLASK_ENV=development
DEBUG=True
FRONTEND_URL=http://localhost:3002
CORS_ORIGINS=http://localhost:3002,http://localhost:5173
EOF

# Activate virtual environment and install dependencies
echo -e "${BLUE}🐍 Setting up Python environment...${NC}"
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

source venv/bin/activate

echo -e "${BLUE}📦 Installing/updating backend dependencies...${NC}"
pip install -r requirements.txt

cd ../..

echo -e "${GREEN}✅ Backend configuration fixed${NC}"
echo ""

# Step 4: Start Services
echo -e "${YELLOW}🚀 Step 4: Starting services...${NC}"

# Kill any existing processes
echo -e "${BLUE}🛑 Stopping any existing services...${NC}"
pkill -f "vite" 2>/dev/null || true
pkill -f "python.*main.py" 2>/dev/null || true
sleep 2

# Start backend in background
echo -e "${BLUE}🔧 Starting backend server...${NC}"
cd backend/hotgigs-api
source venv/bin/activate
nohup python src/main.py > backend.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend started successfully on port 8000${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check backend/hotgigs-api/backend.log${NC}"
    echo "Last few lines of backend log:"
    tail -5 backend/hotgigs-api/backend.log 2>/dev/null || echo "No log file found"
fi

# Start frontend in background
echo -e "${BLUE}🎨 Starting frontend server...${NC}"
cd frontend/hotgigs-frontend
nohup pnpm dev > frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if curl -s http://localhost:3002 > /dev/null; then
    echo -e "${GREEN}✅ Frontend started successfully on port 3002${NC}"
else
    echo -e "${RED}❌ Frontend failed to start. Check frontend/hotgigs-frontend/frontend.log${NC}"
fi

echo ""

# Step 5: Verify Everything is Working
echo -e "${YELLOW}🧪 Step 5: Verifying setup...${NC}"

# Test backend health
echo -e "${BLUE}Testing backend health...${NC}"
if backend_health=$(curl -s http://localhost:8000/api/health); then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
    echo "   Response: $backend_health"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
fi

# Test frontend
echo -e "${BLUE}Testing frontend...${NC}"
if curl -s http://localhost:3002 | grep -q "hotgigs-frontend"; then
    echo -e "${GREEN}✅ Frontend is serving content${NC}"
else
    echo -e "${RED}❌ Frontend test failed${NC}"
fi

echo ""

# Final Status
echo -e "${BLUE}📊 Final Status:${NC}"
echo ""

# Check processes
if pgrep -f "python.*main.py" > /dev/null; then
    echo -e "${GREEN}✅ Backend process running (PID: $(pgrep -f "python.*main.py"))${NC}"
else
    echo -e "${RED}❌ Backend process not found${NC}"
fi

if pgrep -f "vite" > /dev/null; then
    echo -e "${GREEN}✅ Frontend process running (PID: $(pgrep -f "vite"))${NC}"
else
    echo -e "${RED}❌ Frontend process not found${NC}"
fi

echo ""
echo -e "${BLUE}🌐 Application URLs:${NC}"
echo -e "${GREEN}   Frontend: http://localhost:3002${NC}"
echo -e "${GREEN}   Backend:  http://localhost:8000${NC}"
echo -e "${GREEN}   Health:   http://localhost:8000/api/health${NC}"

echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Open http://localhost:3002 in your browser"
echo "2. Check if the UI formatting is now working properly"
echo "3. If issues persist, run: ./scripts/quick-diagnostic.sh"
echo "4. For detailed analysis: ./scripts/local-diagnostic.sh"

echo ""
echo -e "${GREEN}🎉 Environment fix complete!${NC}"

# Save process IDs for easy cleanup
echo "BACKEND_PID=$BACKEND_PID" > .env.pids
echo "FRONTEND_PID=$FRONTEND_PID" >> .env.pids
echo ""
echo -e "${BLUE}💡 To stop services later, run: ./scripts/stop-services.sh${NC}"

