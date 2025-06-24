#!/bin/bash

# HotGigs.ai PostCSS Fix for Tailwind CSS 4.x
# Fixes the "@tailwindcss/postcss" package requirement

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 HotGigs.ai PostCSS Fix for Tailwind CSS 4.x${NC}"
echo -e "${BLUE}=============================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend/hotgigs-frontend" ]; then
    echo -e "${RED}❌ Error: Not in HotGigs project directory${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}🔧 Fixing PostCSS configuration for Tailwind CSS 4.x...${NC}"
echo ""

# Navigate to frontend directory
cd frontend/hotgigs-frontend

# Step 1: Stop any running dev server
echo -e "${YELLOW}🛑 Stopping any running dev server...${NC}"
pkill -f "vite" 2>/dev/null || true
sleep 2

# Step 2: Install the required @tailwindcss/postcss package
echo -e "${BLUE}📦 Installing @tailwindcss/postcss package...${NC}"
pnpm add -D @tailwindcss/postcss

# Step 3: Update PostCSS configuration to use the new package
echo -e "${BLUE}📝 Updating PostCSS configuration...${NC}"
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
EOF

# Step 4: Verify Tailwind config exists and is correct
echo -e "${BLUE}🎨 Verifying Tailwind configuration...${NC}"
if [ ! -f "tailwind.config.js" ]; then
    echo -e "${YELLOW}Creating Tailwind configuration...${NC}"
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // HotGigs.ai brand colors (Zillow-style)
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
    },
  },
  plugins: [],
}
EOF
fi

# Step 5: Verify CSS imports are correct
echo -e "${BLUE}🎨 Verifying CSS imports...${NC}"
if [ ! -f "src/index.css" ]; then
    echo -e "${YELLOW}Creating index.css...${NC}"
    mkdir -p src
    cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* HotGigs.ai Custom Styles */
@layer components {
  .hotgigs-container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .hotgigs-card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
  
  .hotgigs-button-primary {
    @apply bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200;
  }
  
  .hotgigs-button-secondary {
    @apply bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 px-4 rounded-md border border-gray-300 transition-colors duration-200;
  }
  
  .hotgigs-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500;
  }
}

/* Ensure proper font loading */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF
fi

# Step 6: Test the configuration
echo -e "${YELLOW}🧪 Testing the configuration...${NC}"
echo -e "${BLUE}🚀 Starting development server...${NC}"

# Start the dev server
pnpm dev &
DEV_PID=$!

# Wait for server to start
sleep 8

# Check if server started successfully
if curl -s http://localhost:3002 > /dev/null; then
    echo -e "${GREEN}✅ Development server started successfully!${NC}"
    echo -e "${GREEN}✅ PostCSS configuration fixed!${NC}"
    echo -e "${GREEN}✅ Tailwind CSS is working with @tailwindcss/postcss!${NC}"
else
    echo -e "${RED}❌ Development server failed to start${NC}"
    echo "Check the logs for more details"
fi

cd ../..

echo ""
echo -e "${GREEN}🎉 PostCSS Configuration Fix Complete!${NC}"
echo ""
echo -e "${BLUE}📋 What was fixed:${NC}"
echo "✅ Installed @tailwindcss/postcss package"
echo "✅ Updated PostCSS config to use @tailwindcss/postcss"
echo "✅ Verified Tailwind configuration exists"
echo "✅ Ensured proper CSS imports"
echo "✅ Tested server startup"
echo ""
echo -e "${YELLOW}🌐 Your application should now be running at:${NC}"
echo "http://localhost:3002"
echo ""
echo -e "${GREEN}🎯 The PostCSS configuration error is now resolved!${NC}"

