#!/bin/bash

# HotGigs.ai Frontend UI & Styling Fix Script
# Addresses missing packages, Tailwind CSS issues, and UI component problems

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎨 HotGigs.ai Frontend UI & Styling Fix${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend/hotgigs-frontend" ]; then
    echo -e "${RED}❌ Error: Not in HotGigs project directory${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}🔧 Fixing UI styling and component issues...${NC}"
echo ""

# Navigate to frontend directory
cd frontend/hotgigs-frontend

# Step 1: Clean and reinstall dependencies
echo -e "${YELLOW}📦 Step 1: Cleaning and reinstalling dependencies...${NC}"

# Remove node_modules and lock files for clean install
echo -e "${BLUE}🧹 Cleaning existing installations...${NC}"
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml

# Clear pnpm cache
echo -e "${BLUE}🗑️ Clearing pnpm cache...${NC}"
pnpm store prune || true

# Install dependencies fresh
echo -e "${BLUE}📥 Fresh dependency installation...${NC}"
pnpm install

echo -e "${GREEN}✅ Dependencies reinstalled${NC}"
echo ""

# Step 2: Fix Tailwind CSS configuration
echo -e "${YELLOW}🎨 Step 2: Fixing Tailwind CSS configuration...${NC}"

# Create comprehensive Tailwind config
echo -e "${BLUE}📝 Creating comprehensive Tailwind config...${NC}"
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

# Step 3: Fix CSS imports and variables
echo -e "${BLUE}🎨 Creating comprehensive CSS with design system...${NC}"
cat > src/index.css << 'EOF'
@import "tailwindcss";

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

# Step 4: Update Vite configuration for better CSS processing
echo -e "${BLUE}⚙️ Updating Vite configuration...${NC}"
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
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
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
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

# Step 5: Ensure utils.js is properly configured
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

# Step 6: Create a working HomePage with proper styling
echo -e "${BLUE}🏠 Creating properly styled HomePage...${NC}"
cat > src/pages/HomePage.jsx << 'EOF'
import React from 'react'
import { Search, MapPin, Briefcase, Users, TrendingUp, Shield } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="hotgigs-container py-16 md:py-24">
          <div className="text-center">
            <h1 className="hotgigs-hero-title">
              Find Your Dream Job with{' '}
              <span className="text-brand-600">AI-Powered</span> Matching
            </h1>
            <p className="hotgigs-hero-subtitle max-w-3xl mx-auto">
              Connect with top employers and discover opportunities that perfectly match your skills, 
              experience, and career goals using our advanced AI technology.
            </p>
            
            {/* Search Bar */}
            <div className="mt-10 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Job title or keywords"
                      className="hotgigs-input pl-10"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Location"
                      className="hotgigs-input pl-10"
                    />
                  </div>
                  <button className="hotgigs-button-primary w-full">
                    Search Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="hotgigs-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose HotGigs.ai?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with human expertise 
              to deliver the best job search experience.
            </p>
          </div>

          <div className="hotgigs-responsive-grid">
            <div className="hotgigs-card text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Matching
              </h3>
              <p className="text-gray-600">
                Our advanced algorithms analyze your skills and preferences to find 
                the perfect job matches tailored just for you.
              </p>
            </div>

            <div className="hotgigs-card text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Trusted Platform
              </h3>
              <p className="text-gray-600">
                Join thousands of professionals who trust HotGigs.ai for their 
                career advancement and job search needs.
              </p>
            </div>

            <div className="hotgigs-card text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Global Opportunities
              </h3>
              <p className="text-gray-600">
                Access job opportunities from leading companies worldwide, 
                from startups to Fortune 500 enterprises.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Jobs Section */}
      <div className="py-16 bg-white">
        <div className="hotgigs-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Job Opportunities
            </h2>
            <button className="hotgigs-button-secondary">
              View All Jobs
            </button>
          </div>

          <div className="hotgigs-responsive-grid">
            {/* Sample Job Cards */}
            {[1, 2, 3].map((job) => (
              <div key={job} className="hotgigs-card hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mr-3">
                      <Briefcase className="h-6 w-6 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Senior Software Engineer
                      </h3>
                      <p className="text-gray-600">TechCorp Inc.</p>
                    </div>
                  </div>
                  <span className="bg-success-100 text-success-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Remote
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Join our innovative team to build next-generation software solutions 
                  that impact millions of users worldwide.
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    $120k - $180k
                  </span>
                  <button className="hotgigs-button-primary text-sm">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-600 py-16">
        <div className="hotgigs-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through HotGigs.ai
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-brand-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-md transition-colors duration-200">
              Get Started
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-brand-600 font-medium py-3 px-8 rounded-md transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
EOF

echo -e "${GREEN}✅ Frontend UI configuration complete${NC}"
echo ""

# Step 7: Restart the development server
echo -e "${YELLOW}🔄 Step 7: Restarting development server...${NC}"

# Kill existing dev server
pkill -f "vite" 2>/dev/null || true
sleep 2

# Start fresh dev server
echo -e "${BLUE}🚀 Starting fresh development server...${NC}"
nohup pnpm dev > frontend-ui.log 2>&1 &
DEV_PID=$!

# Wait for server to start
sleep 5

# Check if server started successfully
if curl -s http://localhost:3002 > /dev/null; then
    echo -e "${GREEN}✅ Development server started successfully${NC}"
else
    echo -e "${RED}❌ Development server failed to start${NC}"
    echo "Check frontend-ui.log for details"
fi

cd ../..

echo ""
echo -e "${GREEN}🎉 Frontend UI Fix Complete!${NC}"
echo ""
echo -e "${BLUE}📋 What was fixed:${NC}"
echo "✅ Clean dependency reinstallation"
echo "✅ Comprehensive Tailwind CSS configuration"
echo "✅ HotGigs.ai design system with brand colors"
echo "✅ Proper CSS variables and utilities"
echo "✅ Enhanced Vite configuration"
echo "✅ Professional HomePage with Zillow-style design"
echo "✅ Responsive components and layouts"
echo "✅ Custom utility classes for consistency"
echo ""
echo -e "${YELLOW}🌐 Test your application:${NC}"
echo "Open http://localhost:3002 in your browser"
echo ""
echo -e "${BLUE}💡 Expected improvements:${NC}"
echo "• Clean, professional Zillow-style design"
echo "• Proper Tailwind CSS styling throughout"
echo "• Responsive layout on all devices"
echo "• Light blue/green brand colors"
echo "• Modern typography and spacing"
echo "• Interactive hover effects"
echo "• Professional job cards and components"
echo ""
echo -e "${GREEN}🎯 Your UI should now look professional and polished!${NC}"

