# HotGigs.ai Local Mac Setup Instructions

## 📋 **Prerequisites**

Before setting up the project on your Mac, ensure you have the following installed:

### **Required Software**
1. **Git** - For version control
   ```bash
   # Check if Git is installed
   git --version
   
   # If not installed, install via Homebrew
   brew install git
   ```

2. **Node.js (v18 or higher)** - For running the frontend
   ```bash
   # Check Node.js version
   node --version
   
   # If not installed or outdated, install via Homebrew
   brew install node
   ```

3. **pnpm** - Package manager (preferred over npm)
   ```bash
   # Install pnpm globally
   npm install -g pnpm
   
   # Verify installation
   pnpm --version
   ```

4. **Python 3.11+** - For running the backend
   ```bash
   # Check Python version
   python3 --version
   
   # If not installed, install via Homebrew
   brew install python@3.11
   ```

5. **pip** - Python package manager
   ```bash
   # Check pip version
   pip3 --version
   ```

---

## 🔄 **Step 1: Clone the Repository**

1. **Open Terminal** on your Mac

2. **Navigate to your projects directory**
   ```bash
   cd ~/Projects
   # or wherever you want to store the project
   ```

3. **Clone the repository**
   ```bash
   git clone https://github.com/businessintelli/hitgigs.git
   cd hitgigs
   ```

4. **Verify you have the latest changes**
   ```bash
   git pull origin main
   git log --oneline -5
   ```

---

## 🎨 **Step 2: Frontend Setup**

1. **Navigate to the frontend directory**
   ```bash
   cd frontend/hotgigs-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create environment file** (if not exists)
   ```bash
   cp .env.example .env
   # or create manually:
   touch .env
   ```

4. **Configure environment variables**
   Edit the `.env` file with your preferred editor:
   ```bash
   nano .env
   # or
   code .env
   ```
   
   Add the following content:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=HotGigs.ai
   VITE_APP_VERSION=1.0.0
   ```

5. **Start the frontend development server**
   ```bash
   pnpm dev
   ```
   
   The frontend should now be running at: `http://localhost:5173`

---

## ⚙️ **Step 3: Backend Setup**

1. **Open a new terminal window/tab**

2. **Navigate to the backend directory**
   ```bash
   cd ~/Projects/hitgigs/backend/hotgigs-api
   ```

3. **Create a Python virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create environment file**
   ```bash
   cp .env.example .env
   # or create manually:
   touch .env
   ```

6. **Configure backend environment variables**
   Edit the `.env` file:
   ```bash
   nano .env
   # or
   code .env
   ```
   
   Add your configuration (replace with your actual values):
   ```env
   # Database Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   
   # JWT Configuration
   JWT_SECRET_KEY=your_jwt_secret_key
   
   # OAuth Configuration (for production)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # Environment
   ENVIRONMENT=development
   DEBUG=True
   
   # CORS
   FRONTEND_URL=http://localhost:5173
   ```

7. **Start the backend server**
   ```bash
   python src/main.py
   ```
   
   The backend should now be running at: `http://localhost:8000`

---

## 🧪 **Step 4: Verify Setup**

1. **Check Frontend**
   - Open your browser and go to `http://localhost:5173`
   - You should see the HotGigs.ai homepage
   - Check browser console for any errors

2. **Check Backend API**
   - Open `http://localhost:8000/api/health` in your browser
   - You should see a JSON response indicating the API is healthy

3. **Test Integration**
   - Try registering a new user on the frontend
   - Check that API calls are working properly
   - Verify no CORS errors in browser console

---

## 📁 **Project Structure Overview**

```
hitgigs/
├── frontend/
│   └── hotgigs-frontend/          # React frontend application
│       ├── src/
│       │   ├── components/        # Reusable UI components
│       │   ├── pages/            # Page components
│       │   ├── contexts/         # React contexts (API, Auth)
│       │   ├── lib/              # Utility functions
│       │   └── App.jsx           # Main app component
│       ├── package.json          # Frontend dependencies
│       ├── vite.config.js        # Vite configuration
│       └── .env                  # Frontend environment variables
├── backend/
│   └── hotgigs-api/              # Flask backend API
│       ├── src/
│       │   ├── routes/           # API route handlers
│       │   ├── models/           # Database models
│       │   ├── services/         # Business logic services
│       │   └── main.py           # Main application entry point
│       ├── requirements.txt      # Python dependencies
│       └── .env                  # Backend environment variables
├── docs/                         # Documentation
├── iOS_MOBILE_APP_DEVELOPMENT_PLAN.md  # iOS development plan
└── README.md                     # Project documentation
```

---

## 🔧 **Development Workflow**

### **Daily Development**
1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Start both servers**
   ```bash
   # Terminal 1 - Backend
   cd backend/hotgigs-api
   source venv/bin/activate
   python src/main.py
   
   # Terminal 2 - Frontend
   cd frontend/hotgigs-frontend
   pnpm dev
   ```

3. **Make your changes**

4. **Test your changes**
   - Check frontend at `http://localhost:5173`
   - Test API endpoints at `http://localhost:8000`

5. **Commit and push changes**
   ```bash
   git add .
   git commit -m "your commit message"
   git push origin main
   ```

### **Useful Development Commands**

**Frontend:**
```bash
# Install new package
pnpm add package-name

# Build for production
pnpm build

# Run linting
pnpm lint

# Preview production build
pnpm preview
```

**Backend:**
```bash
# Install new Python package
pip install package-name
pip freeze > requirements.txt

# Run with debug mode
python src/main.py

# Run tests (if available)
python -m pytest
```

---

## 🌐 **Environment URLs**

### **Local Development**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Health Check**: http://localhost:8000/api/health

### **Production (Deployed)**
- **Frontend**: https://hriwjqdw.manus.space
- **Backend API**: https://j6h5i7c16kvm.manus.space
- **Production Domain**: https://www.hotgigs.ai (when configured)

---

## 📱 **Next Steps: iOS Development**

Once you have the local setup working, you can proceed with iOS development:

1. **Review the iOS Development Plan**
   - Read `iOS_MOBILE_APP_DEVELOPMENT_PLAN.md`
   - Review `iOS_DEVELOPMENT_PLAN_SUMMARY.md`

2. **Set up iOS Development Environment**
   - Install Xcode from Mac App Store
   - Set up Apple Developer Account
   - Configure iOS project structure

3. **Backend API Integration**
   - The existing backend API is ready for mobile integration
   - All endpoints support mobile clients
   - Authentication and CORS are properly configured

---

## ✅ **Success Checklist**

- [ ] Git repository cloned successfully
- [ ] Node.js and pnpm installed
- [ ] Python 3.11+ installed
- [ ] Frontend dependencies installed (`pnpm install`)
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Environment files configured (`.env`)
- [ ] Frontend running at http://localhost:5173
- [ ] Backend running at http://localhost:8000
- [ ] API health check returns success
- [ ] No CORS errors in browser console
- [ ] User registration/login works
- [ ] Job search functionality works

---

**🎉 Congratulations! Your HotGigs.ai development environment is now set up and ready for development!**

