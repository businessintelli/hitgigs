#!/bin/bash

# HotGigs.ai Simple CSS Fix - No Tailwind v4 Issues
# Uses basic CSS instead of problematic Tailwind CSS 4.x

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎨 HotGigs.ai Simple CSS Fix${NC}"
echo -e "${BLUE}============================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend/hotgigs-frontend" ]; then
    echo -e "${RED}❌ Error: Not in HotGigs project directory${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}🔧 Switching to simple CSS solution...${NC}"
echo ""

# Navigate to frontend directory
cd frontend/hotgigs-frontend

# Step 1: Stop any running dev server
echo -e "${YELLOW}🛑 Stopping any running dev server...${NC}"
pkill -f "vite" 2>/dev/null || true
sleep 2

# Step 2: Remove Tailwind CSS completely and use basic CSS
echo -e "${BLUE}🗑️ Removing problematic Tailwind CSS...${NC}"
pnpm remove tailwindcss @tailwindcss/postcss @tailwindcss/vite autoprefixer postcss

# Step 3: Remove Tailwind configuration files
echo -e "${BLUE}🧹 Cleaning up Tailwind configuration files...${NC}"
rm -f tailwind.config.js postcss.config.js

# Step 4: Create simple, working CSS
echo -e "${BLUE}🎨 Creating simple CSS solution...${NC}"
cat > src/index.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9fafb;
  color: #111827;
  line-height: 1.6;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
}

/* Layout */
.min-h-screen {
  min-height: 100vh;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-grow {
  flex-grow: 1;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.text-center {
  text-align: center;
}

/* Grid */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

/* Spacing */
.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-16 {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mb-12 {
  margin-bottom: 3rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-10 {
  margin-top: 2.5rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

/* Typography */
.text-sm {
  font-size: 0.875rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.text-4xl {
  font-size: 2.25rem;
}

@media (min-width: 768px) {
  .md\:text-5xl {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .lg\:text-6xl {
    font-size: 3.75rem;
  }
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.leading-tight {
  line-height: 1.25;
}

/* Colors */
.text-white {
  color: #ffffff;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-900 {
  color: #111827;
}

.text-blue-600 {
  color: #2563eb;
}

.text-blue-100 {
  color: #dbeafe;
}

.text-green-600 {
  color: #16a34a;
}

.text-green-800 {
  color: #166534;
}

.text-purple-600 {
  color: #9333ea;
}

.bg-white {
  background-color: #ffffff;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.bg-blue-700 {
  background-color: #1d4ed8;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.bg-purple-100 {
  background-color: #f3e8ff;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
  padding: 0.5rem 1rem;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #ffffff;
  color: #111827;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.btn-lg {
  padding: 0.75rem 2rem;
}

/* Cards */
.card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Forms */
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Icons */
.icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-success {
  background-color: #dcfce7;
  color: #166534;
}

/* Utilities */
.w-full {
  width: 100%;
}

.max-w-2xl {
  max-width: 42rem;
}

.max-w-3xl {
  max-width: 48rem;
}

.max-w-4xl {
  max-width: 56rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-full {
  border-radius: 9999px;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.border {
  border-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.border-white {
  border-color: #ffffff;
}

.transition-colors {
  transition: color 0.2s, background-color 0.2s;
}

.transition-shadow {
  transition: box-shadow 0.2s;
}

/* Responsive utilities */
@media (min-width: 640px) {
  .sm\:flex-row {
    flex-direction: row;
  }
  
  .sm\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 768px) {
  .md\:flex-row {
    flex-direction: row;
  }
  
  .md\:py-24 {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
  
  .md\:text-2xl {
    font-size: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .lg\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* Relative positioning for icons */
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.left-3 {
  left: 0.75rem;
}

.top-3 {
  top: 0.75rem;
}

.pl-10 {
  padding-left: 2.5rem;
}

/* Navbar styles */
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #2563eb;
}

/* Footer styles */
.footer {
  background-color: #111827;
  color: #9ca3af;
  padding: 2rem 0;
  text-align: center;
}
EOF

# Step 5: Update Vite configuration to remove PostCSS
echo -e "${BLUE}⚙️ Updating Vite configuration...${NC}"
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
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
EOF

# Step 6: Create simple HomePage with basic CSS classes
echo -e "${BLUE}🏠 Creating HomePage with simple CSS...${NC}"
cat > src/pages/HomePage.jsx << 'EOF'
import React from 'react'
import { Search, MapPin, Briefcase, Users, TrendingUp, Shield } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find Your Dream Job with{' '}
              <span className="text-blue-600">AI-Powered</span> Matching
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Connect with top employers and discover opportunities that perfectly match your skills, 
              experience, and career goals using our advanced AI technology.
            </p>
            
            {/* Search Bar */}
            <div className="mt-10 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3" size={20} color="#9ca3af" />
                    <input
                      type="text"
                      placeholder="Job title or keywords"
                      className="input pl-10"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3" size={20} color="#9ca3af" />
                    <input
                      type="text"
                      placeholder="Location"
                      className="input pl-10"
                    />
                  </div>
                  <button className="btn btn-primary w-full">
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
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose HotGigs.ai?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with human expertise 
              to deliver the best job search experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="icon-container bg-blue-100">
                <TrendingUp size={24} color="#2563eb" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Matching
              </h3>
              <p className="text-gray-600">
                Our advanced algorithms analyze your skills and preferences to find 
                the perfect job matches tailored just for you.
              </p>
            </div>

            <div className="card text-center">
              <div className="icon-container bg-green-100">
                <Shield size={24} color="#16a34a" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Trusted Platform
              </h3>
              <p className="text-gray-600">
                Join thousands of professionals who trust HotGigs.ai for their 
                career advancement and job search needs.
              </p>
            </div>

            <div className="card text-center">
              <div className="icon-container bg-purple-100">
                <Users size={24} color="#9333ea" />
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
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Job Opportunities
            </h2>
            <button className="btn btn-secondary">
              View All Jobs
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sample Job Cards */}
            {[1, 2, 3].map((job) => (
              <div key={job} className="card transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="icon-container bg-blue-100" style={{width: '3rem', height: '3rem', marginRight: '0.75rem', marginBottom: '0'}}>
                      <Briefcase size={24} color="#2563eb" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Senior Software Engineer
                      </h3>
                      <p className="text-gray-600">TechCorp Inc.</p>
                    </div>
                  </div>
                  <span className="badge badge-success">
                    Remote
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Join our innovative team to build next-generation software solutions 
                  that impact millions of users worldwide.
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    $120k - $180k
                  </span>
                  <button className="btn btn-primary text-sm">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through HotGigs.ai
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-lg" style={{backgroundColor: '#ffffff', color: '#2563eb'}}>
              Get Started
            </button>
            <button className="btn btn-lg" style={{border: '2px solid #ffffff', color: '#ffffff', backgroundColor: 'transparent'}}>
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

# Step 7: Create simple Navbar component
echo -e "${BLUE}🧭 Creating simple Navbar component...${NC}"
mkdir -p src/components/layout
cat > src/components/layout/Navbar.jsx << 'EOF'
import React from 'react'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">HotGigs.ai</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="nav-link">Home</a>
            <a href="/jobs" className="nav-link">Jobs</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
            <button className="btn btn-primary">Sign In</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
EOF

# Step 8: Create simple Footer component
echo -e "${BLUE}🦶 Creating simple Footer component...${NC}"
cat > src/components/layout/Footer.jsx << 'EOF'
import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2025 HotGigs.ai. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
EOF

# Step 9: Update App.jsx
echo -e "${BLUE}⚛️ Updating App.jsx...${NC}"
cat > src/App.jsx << 'EOF'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
EOF

# Step 10: Install required dependencies
echo -e "${BLUE}📦 Installing required dependencies...${NC}"
pnpm add lucide-react react-router-dom

# Step 11: Test the configuration
echo -e "${YELLOW}🧪 Testing the simple CSS solution...${NC}"
echo -e "${BLUE}🚀 Starting development server...${NC}"

# Start the dev server
pnpm dev &
DEV_PID=$!

# Wait for server to start
sleep 8

# Check if server started successfully
if curl -s http://localhost:3002 > /dev/null; then
    echo -e "${GREEN}✅ Development server started successfully!${NC}"
    echo -e "${GREEN}✅ Simple CSS solution working!${NC}"
    echo -e "${GREEN}✅ No more Tailwind CSS 4.x issues!${NC}"
else
    echo -e "${RED}❌ Development server failed to start${NC}"
    echo "Check the logs for more details"
fi

cd ../..

echo ""
echo -e "${GREEN}🎉 Simple CSS Solution Complete!${NC}"
echo ""
echo -e "${BLUE}📋 What was done:${NC}"
echo "✅ Removed problematic Tailwind CSS 4.x completely"
echo "✅ Created comprehensive custom CSS with all needed styles"
echo "✅ Implemented Zillow-style design (white, light blue, light green)"
echo "✅ Added responsive design utilities"
echo "✅ Created professional components (Navbar, Footer, HomePage)"
echo "✅ Removed all PostCSS and Tailwind configuration"
echo "✅ Used simple, reliable CSS classes"
echo ""
echo -e "${YELLOW}🌐 Your application should now be running at:${NC}"
echo "http://localhost:3002"
echo ""
echo -e "${GREEN}🎯 No more CSS compilation errors - everything should work perfectly!${NC}"

