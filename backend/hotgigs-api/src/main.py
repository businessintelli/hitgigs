import os
import sys
from datetime import datetime, timedelta
from typing import Optional

# Add the src directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import psutil
import time

# Create FastAPI app
app = FastAPI(
    title="HotGigs.ai API",
    description="AI-powered job matching platform API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Models
class User(BaseModel):
    id: int
    email: str
    name: str
    role: str = "user"
    is_admin: bool = False

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: str = "user"

# Mock user database (replace with real database)
mock_users = {
    "admin@hotgigs.ai": {
        "id": 1,
        "email": "admin@hotgigs.ai",
        "name": "Super Admin",
        "password": "admin123",  # In production, use hashed passwords
        "role": "admin",
        "is_admin": True
    },
    "user@example.com": {
        "id": 2,
        "email": "user@example.com",
        "name": "Test User",
        "password": "user123",
        "role": "user",
        "is_admin": False
    }
}

# Authentication functions
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from token (simplified for demo)"""
    # In production, validate JWT token here
    token = credentials.credentials
    
    # For demo purposes, accept any token and return admin user
    if token:
        return mock_users["admin@hotgigs.ai"]
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

# Basic endpoints
@app.get("/")
async def root():
    return {
        "message": "HotGigs.ai API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "message": "HotGigs.ai API is running",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/api/info")
async def api_info():
    """API information endpoint"""
    return {
        "name": "HotGigs.ai API",
        "version": "1.0.0",
        "description": "AI-powered job matching platform API",
        "endpoints": {
            "health": "/api/health",
            "info": "/api/info",
            "status": "/api/status",
            "db-status": "/api/db-status"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/status")
async def system_status():
    """Comprehensive system status endpoint"""
    try:
        # Get system metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Calculate uptime
        boot_time = psutil.boot_time()
        uptime_seconds = time.time() - boot_time
        uptime_hours = uptime_seconds / 3600
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "system": {
                "cpu_usage": f"{cpu_percent}%",
                "memory_usage": f"{memory.percent}%",
                "disk_usage": f"{disk.percent}%",
                "uptime_hours": round(uptime_hours, 2)
            },
            "services": {
                "api": "healthy",
                "database": "healthy",
                "cache": "healthy"
            },
            "metrics": {
                "response_time": "120ms",
                "error_rate": "0.1%",
                "requests_per_minute": 450
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/api/db-status")
async def database_status():
    """Database connection status"""
    try:
        # Simulate database check - replace with actual database connection check
        return {
            "status": "connected",
            "database": "PostgreSQL",
            "version": "14.0",
            "connection_pool": {
                "size": 20,
                "active": 5,
                "idle": 15
            },
            "last_check": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Authentication endpoints
@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """User login endpoint"""
    user = mock_users.get(request.email)
    if not user or user["password"] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # In production, create a proper JWT token
    token = f"mock_token_{user['id']}"
    
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "is_admin": user["is_admin"]
        }
    }

@app.post("/api/auth/register")
async def register(request: RegisterRequest):
    """User registration endpoint"""
    if request.email in mock_users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = {
        "id": len(mock_users) + 1,
        "email": request.email,
        "name": request.name,
        "password": request.password,
        "role": request.role,
        "is_admin": False
    }
    
    mock_users[request.email] = new_user
    
    # In production, create a proper JWT token
    token = f"mock_token_{new_user['id']}"
    
    return {
        "token": token,
        "user": {
            "id": new_user["id"],
            "email": new_user["email"],
            "name": new_user["name"],
            "role": new_user["role"],
            "is_admin": new_user["is_admin"]
        }
    }

# Admin authentication dependency
async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Admin endpoints
@app.get("/api/admin/stats")
async def get_system_stats(admin_user: dict = Depends(get_admin_user)):
    """Get comprehensive system statistics (Admin only)"""
    try:
        return {
            "total_users": 15420,
            "active_users": 12350,
            "total_jobs": 8750,
            "total_applications": 45600,
            "system_uptime": "99.9%",
            "avg_response_time": "120ms",
            "error_rate": "0.1%",
            "storage_used": "2.4TB"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/users")
async def get_all_users(
    skip: int = 0, 
    limit: int = 100,
    role: Optional[str] = None,
    status: Optional[str] = None,
    admin_user: dict = Depends(get_admin_user)
):
    """Get all users with filtering (Admin only)"""
    try:
        users = [
            {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "role": "user",
                "status": "active",
                "last_login": "2024-06-24T10:30:00",
                "join_date": "2024-01-15"
            },
            {
                "id": 2,
                "name": "Jane Smith",
                "email": "jane@company.com",
                "role": "company",
                "status": "active",
                "last_login": "2024-06-24T09:15:00",
                "join_date": "2024-02-20"
            }
        ]
        
        if role:
            users = [u for u in users if u["role"] == role]
        if status:
            users = [u for u in users if u["status"] == status]
            
        total = len(users)
        users = users[skip:skip + limit]
        
        return {
            "users": users,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Job endpoints
@app.get("/api/jobs")
async def get_jobs(limit: int = 10, skip: int = 0):
    """Get job listings"""
    jobs = [
        {
            "id": 1,
            "title": "Senior Software Engineer",
            "company": "TechCorp Inc.",
            "location": "San Francisco, CA",
            "type": "Full-time",
            "salary": "$120k - $180k",
            "description": "Join our innovative team to build next-generation software solutions.",
            "posted_date": "2024-06-20"
        },
        {
            "id": 2,
            "title": "Product Manager",
            "company": "StartupXYZ",
            "location": "Remote",
            "type": "Full-time",
            "salary": "$100k - $150k",
            "description": "Lead product strategy and development for our AI platform.",
            "posted_date": "2024-06-22"
        }
    ]
    
    total = len(jobs)
    jobs = jobs[skip:skip + limit]
    
    return {
        "jobs": jobs,
        "total": total,
        "skip": skip,
        "limit": limit
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": "The requested resource was not found",
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

