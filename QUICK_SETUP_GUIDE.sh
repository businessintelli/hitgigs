#!/bin/bash

# Quick Manual Setup for HotGigs.ai Admin System
# Use this if you can't wait for git pull

echo "🚀 Quick HotGigs.ai Admin System Setup"
echo "====================================="

# Check current directory
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo ""
echo "📋 Manual Setup Steps:"
echo ""

# Step 1: Navigate to correct directory
echo "1️⃣ Navigate to your project directory:"
echo "   cd /path/to/your/hitgigs"
echo ""

# Step 2: Install frontend dependencies
echo "2️⃣ Install frontend dependencies:"
echo "   cd frontend/hotgigs-frontend  # or just 'frontend' if that's your structure"
echo "   pnpm install  # or npm install"
echo "   pnpm add react-router-dom lucide-react axios"
echo ""

# Step 3: Install backend dependencies
echo "3️⃣ Setup backend:"
echo "   cd ../../backend/hotgigs-api  # or just 'backend'"
echo "   python3 -m venv venv"
echo "   source venv/bin/activate"
echo "   pip install fastapi uvicorn psutil python-jose passlib python-dotenv requests"
echo ""

# Step 4: Create environment files
echo "4️⃣ Create environment files:"
echo ""
echo "   Frontend .env (in frontend directory):"
echo "   VITE_API_BASE_URL=http://localhost:8000/api"
echo "   VITE_APP_NAME=HotGigs.ai"
echo "   VITE_ADMIN_ENABLED=true"
echo ""
echo "   Backend .env (in backend directory):"
echo "   SECRET_KEY=dev-secret-key"
echo "   API_HOST=0.0.0.0"
echo "   API_PORT=8000"
echo ""

# Step 5: Start services
echo "5️⃣ Start services:"
echo ""
echo "   Terminal 1 - Backend:"
echo "   cd backend/hotgigs-api"
echo "   source venv/bin/activate"
echo "   python src/main.py  # or python main.py or python app.py"
echo ""
echo "   Terminal 2 - Frontend:"
echo "   cd frontend/hotgigs-frontend"
echo "   pnpm dev  # or npm run dev"
echo ""

# Step 6: Access URLs
echo "6️⃣ Access your admin system:"
echo "   • Main App: http://localhost:3002"
echo "   • Status Dashboard: http://localhost:3002/status"
echo "   • Super Admin: http://localhost:3002/admin"
echo "   • Backend API: http://localhost:8000"
echo ""

echo "🔐 Admin Login:"
echo "   Email: admin@hotgigs.ai"
echo "   Password: admin123"
echo ""

echo "💡 After git pull, you can use the automated script:"
echo "   git pull origin main"
echo "   ./scripts/setup-admin-system-fixed.sh"

