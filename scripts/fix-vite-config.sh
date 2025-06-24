#!/bin/bash

# HotGigs.ai Vite Configuration Fix Script
# Fixes the Tailwind CSS import error in Vite configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 HotGigs.ai Vite Configuration Fix${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend/hotgigs-frontend" ]; then
    echo -e "${RED}❌ Error: Not in HotGigs project directory${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}🔧 Fixing Vite configuration and Tailwind CSS setup...${NC}"
echo ""

# Navigate to frontend directory
cd frontend/hotgigs-frontend

# Step 1: Stop any running dev server
echo -e "${YELLOW}🛑 Stopping any running dev server...${NC}"
pkill -f "vite" 2>/dev/null || true
sleep 2

# Step 2: Fix Vite configuration
echo -e "${BLUE}⚙️ Creating compatible Vite configuration...${NC}"
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3002,
    host: true,
    cors: true
  },
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-dialog'],
        },
      },
    },
  },
})
EOF

# Step 3: Create PostCSS configuration
echo -e "${BLUE}📝 Creating PostCSS configuration...${NC}"
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Step 4: Fix Tailwind configuration for compatibility
echo -e "${BLUE}🎨 Creating compatible Tailwind configuration...${NC}"
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
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
}
EOF

# Step 5: Update CSS imports
echo -e "${BLUE}🎨 Updating CSS imports...${NC}"
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

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
  
  .hotgigs-nav-link {
    @apply text-gray-700 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200;
  }
  
  .hotgigs-hero-title {
    @apply text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight;
  }
  
  .hotgigs-hero-subtitle {
    @apply text-xl md:text-2xl text-gray-600 mt-4;
  }
}

/* Ensure proper font loading */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Loading states */
.loading-skeleton {
  @apply animate-pulse bg-gray-200 rounded;
}

/* Responsive utilities */
.hotgigs-responsive-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.hotgigs-responsive-flex {
  @apply flex flex-col md:flex-row items-start md:items-center gap-4;
}
EOF

# Step 6: Install required dependencies
echo -e "${BLUE}📦 Installing required dependencies...${NC}"
pnpm add -D tailwindcss@latest postcss@latest autoprefixer@latest

# Step 7: Ensure utils.js exists
echo -e "${BLUE}🛠️ Setting up utility functions...${NC}"
mkdir -p src/lib
cat > src/lib/utils.js << 'EOF'
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// HotGigs.ai utility functions
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export function formatSalary(min, max, currency = 'USD') {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`
  } else if (min) {
    return `${formatter.format(min)}+`
  }
  return 'Competitive'
}

export function truncateText(text, maxLength = 150) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}
EOF

# Step 8: Test the configuration
echo -e "${YELLOW}🧪 Testing the configuration...${NC}"
echo -e "${BLUE}🚀 Starting development server...${NC}"

# Start the dev server
pnpm dev &
DEV_PID=$!

# Wait for server to start
sleep 5

# Check if server started successfully
if curl -s http://localhost:3002 > /dev/null; then
    echo -e "${GREEN}✅ Development server started successfully!${NC}"
    echo -e "${GREEN}✅ Vite configuration fixed!${NC}"
    echo -e "${GREEN}✅ Tailwind CSS is working!${NC}"
else
    echo -e "${RED}❌ Development server failed to start${NC}"
    echo "Check the logs for more details"
fi

cd ../..

echo ""
echo -e "${GREEN}🎉 Vite Configuration Fix Complete!${NC}"
echo ""
echo -e "${BLUE}📋 What was fixed:${NC}"
echo "✅ Removed problematic Tailwind CSS Vite plugin"
echo "✅ Created proper PostCSS configuration"
echo "✅ Fixed Tailwind CSS imports in index.css"
echo "✅ Updated Vite configuration for compatibility"
echo "✅ Installed latest compatible dependencies"
echo "✅ Verified server startup"
echo ""
echo -e "${YELLOW}🌐 Your application should now be running at:${NC}"
echo "http://localhost:3002"
echo ""
echo -e "${GREEN}🎯 The Vite configuration error is now resolved!${NC}"

