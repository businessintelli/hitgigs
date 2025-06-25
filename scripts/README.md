# HotGigs.ai Service Management Scripts

This directory contains comprehensive scripts for managing the HotGigs.ai platform services.

## 🚀 Quick Start

### Start Everything
```bash
./scripts/start-all.sh
```

### Stop Everything
```bash
./scripts/stop-all.sh
```

### Check Status
```bash
./scripts/status-all.sh
```

## 📋 Available Scripts

### 🔄 Combined Operations
- **`start-all.sh`** - Start both backend and frontend services
- **`stop-all.sh`** - Stop both backend and frontend services  
- **`status-all.sh`** - Check status of all services

### 📡 Backend Management
- **`start-backend.sh`** - Start the FastAPI backend server
- **`stop-backend.sh`** - Stop the backend server

### 🌐 Frontend Management
- **`start-frontend.sh`** - Start the React frontend development server
- **`stop-frontend.sh`** - Stop the frontend server

### 🛠️ Legacy/Utility Scripts
- **`setup-enterprise-admin.sh`** - Complete system setup (legacy)
- **`fix-*.sh`** - Various diagnostic and fix scripts

## 🎯 Script Features

### ✅ Robust Process Management
- **PID file tracking** - Proper process identification
- **Graceful shutdown** - SIGTERM before SIGKILL
- **Port conflict detection** - Prevents startup conflicts
- **Orphan process cleanup** - Removes stale processes

### ✅ Comprehensive Error Handling
- **Dependency checking** - Verifies Node.js, Python, package managers
- **Directory validation** - Ensures correct working directory
- **Service connectivity** - Tests HTTP endpoints
- **Detailed error messages** - Clear troubleshooting information

### ✅ Professional Output
- **Color-coded status** - Green (success), Yellow (warning), Red (error)
- **Progress indicators** - Real-time feedback during operations
- **Detailed summaries** - Complete status information
- **Log file management** - Centralized logging

### ✅ Smart Features
- **Auto-dependency installation** - Installs missing packages
- **Environment file creation** - Sets up configuration automatically
- **Database initialization** - Prepares SQLite database
- **Health checking** - Verifies service connectivity

## 📊 Service Information

### Backend Service
- **Port**: 8000
- **URL**: http://localhost:8000
- **Health Check**: http://localhost:8000/api/health
- **API Docs**: http://localhost:8000/docs
- **Log File**: `backend/hotgigs-api/backend.log`
- **PID File**: `backend/hotgigs-api/backend.pid`

### Frontend Service
- **Port**: 3002
- **URL**: http://localhost:3002
- **Admin Panel**: http://localhost:3002/admin/login
- **Status Dashboard**: http://localhost:3002/status
- **Log File**: `frontend/hotgigs-frontend/frontend.log`
- **PID File**: `frontend/hotgigs-frontend/frontend.pid`

## 🔐 Default Credentials

### Super Admin
- **Email**: admin@hotgigs.ai
- **Password**: admin123

### Demo Accounts
- **Job Seeker**: john@example.com / user123
- **Company**: hr@techcorp.com / company123
- **Recruiter**: alice@recruiter.com / recruiter123

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :8000  # Backend
lsof -i :3002  # Frontend

# Stop the service
./scripts/stop-all.sh
```

#### Stale Processes
```bash
# Clean up all processes
./scripts/stop-all.sh

# Check status
./scripts/status-all.sh
```

#### Permission Issues
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

#### Database Issues
```bash
# Backend will auto-initialize database
# Check logs for details
tail -f backend/hotgigs-api/backend.log
```

### Log Files

#### View Real-time Logs
```bash
# Backend logs
tail -f backend/hotgigs-api/backend.log

# Frontend logs  
tail -f frontend/hotgigs-frontend/frontend.log
```

#### Check Service Status
```bash
# Comprehensive status check
./scripts/status-all.sh

# Individual service status
ps aux | grep python  # Backend
ps aux | grep node    # Frontend
```

## 🔧 Advanced Usage

### Custom Ports
Edit the port variables in the scripts:
- `PORT=8000` (backend)
- `PORT=3002` (frontend)

### Development Mode
The scripts automatically:
- Use development servers (FastAPI with reload, Vite dev server)
- Enable hot reloading
- Provide detailed error messages
- Create development environment files

### Production Considerations
For production deployment:
- Use proper process managers (PM2, systemd)
- Configure reverse proxy (nginx)
- Set up SSL certificates
- Use production environment variables
- Implement proper logging rotation

## 📁 Directory Structure

```
scripts/
├── start-all.sh           # Start both services
├── stop-all.sh            # Stop both services
├── status-all.sh          # Check all service status
├── start-backend.sh       # Start backend only
├── stop-backend.sh        # Stop backend only
├── start-frontend.sh      # Start frontend only
├── stop-frontend.sh       # Stop frontend only
├── setup-enterprise-admin.sh  # Legacy setup script
└── README.md              # This file
```

## 🎉 Success Indicators

When everything is working correctly:
- ✅ Backend responds at http://localhost:8000/api/health
- ✅ Frontend loads at http://localhost:3002
- ✅ Admin panel accessible at http://localhost:3002/admin/login
- ✅ Database connectivity working
- ✅ No error messages in logs

## 📞 Support

If you encounter issues:
1. Check `./scripts/status-all.sh` for service status
2. Review log files for error details
3. Ensure all dependencies are installed
4. Verify you're in the correct directory
5. Check port availability

The scripts are designed to be self-diagnosing and provide clear error messages to help resolve issues quickly.

