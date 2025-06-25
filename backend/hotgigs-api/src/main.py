import os
import sys
from datetime import datetime, timedelta
from typing import Optional, List
import logging
import traceback

# Add the src directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import psutil
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="HotGigs.ai API",
    description="AI-powered job matching platform API with comprehensive admin system",
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
    status: str = "active"
    is_admin: bool = False
    last_login: Optional[str] = None
    join_date: Optional[str] = None

class Company(BaseModel):
    id: int
    name: str
    industry: str
    size: str
    status: str = "active"
    jobs_count: int = 0

class Job(BaseModel):
    id: int
    title: str
    company: str
    location: str
    type: str
    salary: str
    description: str
    posted_date: str
    status: str = "active"

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: str = "user"

class AdminLoginRequest(BaseModel):
    email: str
    password: str

# Mock databases (replace with real database)
mock_users = {
    "admin@hotgigs.ai": {
        "id": 1,
        "email": "admin@hotgigs.ai",
        "name": "Super Admin",
        "password": "admin123",
        "role": "admin",
        "status": "active",
        "is_admin": True,
        "last_login": "2024-06-24T10:30:00",
        "join_date": "2024-01-01"
    },
    "user@example.com": {
        "id": 2,
        "email": "user@example.com",
        "name": "John Doe",
        "password": "user123",
        "role": "user",
        "status": "active",
        "is_admin": False,
        "last_login": "2024-06-24T09:15:00",
        "join_date": "2024-02-15"
    },
    "company@example.com": {
        "id": 3,
        "email": "company@example.com",
        "name": "Jane Smith",
        "password": "company123",
        "role": "company",
        "status": "active",
        "is_admin": False,
        "last_login": "2024-06-24T08:45:00",
        "join_date": "2024-03-01"
    }
}

mock_companies = [
    {
        "id": 1,
        "name": "TechCorp Inc.",
        "industry": "Technology",
        "size": "100-500",
        "status": "active",
        "jobs_count": 15
    },
    {
        "id": 2,
        "name": "StartupXYZ",
        "industry": "Fintech",
        "size": "10-50",
        "status": "active",
        "jobs_count": 8
    },
    {
        "id": 3,
        "name": "MegaCorp Ltd",
        "industry": "Healthcare",
        "size": "1000+",
        "status": "suspended",
        "jobs_count": 25
    }
]

mock_jobs = [
    {
        "id": 1,
        "title": "Senior Software Engineer",
        "company": "TechCorp Inc.",
        "location": "San Francisco, CA",
        "type": "Full-time",
        "salary": "$120k - $180k",
        "description": "Join our innovative team to build next-generation software solutions.",
        "posted_date": "2024-06-20",
        "status": "active"
    },
    {
        "id": 2,
        "title": "Product Manager",
        "company": "StartupXYZ",
        "location": "Remote",
        "type": "Full-time",
        "salary": "$100k - $150k",
        "description": "Lead product strategy and development for our AI platform.",
        "posted_date": "2024-06-22",
        "status": "active"
    },
    {
        "id": 3,
        "title": "Data Scientist",
        "company": "MegaCorp Ltd",
        "location": "New York, NY",
        "type": "Full-time",
        "salary": "$130k - $200k",
        "description": "Analyze complex datasets to drive business insights.",
        "posted_date": "2024-06-18",
        "status": "active"
    }
]

mock_errors = [
    {
        "id": 1,
        "level": "critical",
        "message": "Database connection timeout",
        "file": "database.py",
        "line": 45,
        "timestamp": "2024-06-24T10:15:00",
        "user_id": None
    },
    {
        "id": 2,
        "level": "warning",
        "message": "Slow API response detected",
        "file": "api.py",
        "line": 123,
        "timestamp": "2024-06-24T09:30:00",
        "user_id": 2
    },
    {
        "id": 3,
        "level": "error",
        "message": "Failed to send email notification",
        "file": "notifications.py",
        "line": 67,
        "timestamp": "2024-06-24T08:45:00",
        "user_id": 3
    }
]

mock_db_tables = [
    {
        "name": "users",
        "row_count": 15420,
        "columns": [
            {"name": "id", "type": "INTEGER PRIMARY KEY"},
            {"name": "email", "type": "VARCHAR(255) UNIQUE"},
            {"name": "name", "type": "VARCHAR(255)"},
            {"name": "password_hash", "type": "VARCHAR(255)"},
            {"name": "role", "type": "VARCHAR(50)"},
            {"name": "status", "type": "VARCHAR(50)"},
            {"name": "created_at", "type": "TIMESTAMP"},
            {"name": "last_login", "type": "TIMESTAMP"}
        ]
    },
    {
        "name": "companies",
        "row_count": 1250,
        "columns": [
            {"name": "id", "type": "INTEGER PRIMARY KEY"},
            {"name": "name", "type": "VARCHAR(255)"},
            {"name": "industry", "type": "VARCHAR(100)"},
            {"name": "size", "type": "VARCHAR(50)"},
            {"name": "status", "type": "VARCHAR(50)"},
            {"name": "created_at", "type": "TIMESTAMP"}
        ]
    },
    {
        "name": "jobs",
        "row_count": 8750,
        "columns": [
            {"name": "id", "type": "INTEGER PRIMARY KEY"},
            {"name": "title", "type": "VARCHAR(255)"},
            {"name": "company_id", "type": "INTEGER"},
            {"name": "location", "type": "VARCHAR(255)"},
            {"name": "type", "type": "VARCHAR(50)"},
            {"name": "salary", "type": "VARCHAR(100)"},
            {"name": "description", "type": "TEXT"},
            {"name": "status", "type": "VARCHAR(50)"},
            {"name": "created_at", "type": "TIMESTAMP"}
        ]
    },
    {
        "name": "applications",
        "row_count": 45600,
        "columns": [
            {"name": "id", "type": "INTEGER PRIMARY KEY"},
            {"name": "user_id", "type": "INTEGER"},
            {"name": "job_id", "type": "INTEGER"},
            {"name": "status", "type": "VARCHAR(50)"},
            {"name": "applied_at", "type": "TIMESTAMP"},
            {"name": "resume_url", "type": "VARCHAR(500)"}
        ]
    }
]

# Authentication functions
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from token"""
    token = credentials.credentials
    
    # Simple token validation (in production, use proper JWT)
    if token.startswith("mock_token_"):
        user_id = int(token.split("_")[-1])
        for user_data in mock_users.values():
            if user_data["id"] == user_id:
                return user_data
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    """Verify admin access"""
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Error logging middleware
@app.middleware("http")
async def log_errors(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        # Log the error
        error_details = {
            "id": len(mock_errors) + 1,
            "level": "error",
            "message": str(e),
            "file": "middleware.py",
            "line": 0,
            "timestamp": datetime.now().isoformat(),
            "user_id": None
        }
        mock_errors.append(error_details)
        logger.error(f"Request error: {e}")
        
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error", "message": str(e)}
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
    
    # Update last login
    user["last_login"] = datetime.now().isoformat()
    
    # Create token
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
        "status": "active",
        "is_admin": False,
        "last_login": None,
        "join_date": datetime.now().isoformat()
    }
    
    mock_users[request.email] = new_user
    
    # Create token
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

# Admin authentication
@app.post("/api/admin/login")
async def admin_login(request: AdminLoginRequest):
    """Admin login endpoint"""
    user = mock_users.get(request.email)
    if not user or user["password"] != request.password or not user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    # Update last login
    user["last_login"] = datetime.now().isoformat()
    
    # Create admin token
    token = f"admin_token_{user['id']}"
    
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

# Admin endpoints
@app.get("/api/admin/stats")
async def get_admin_stats(admin_user: dict = Depends(get_admin_user)):
    """Get comprehensive system statistics (Admin only)"""
    try:
        return {
            "total_users": len(mock_users),
            "active_users": len([u for u in mock_users.values() if u["status"] == "active"]),
            "total_companies": len(mock_companies),
            "active_companies": len([c for c in mock_companies if c["status"] == "active"]),
            "total_jobs": len(mock_jobs),
            "active_jobs": len([j for j in mock_jobs if j["status"] == "active"]),
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
        users = list(mock_users.values())
        
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

@app.get("/api/admin/companies")
async def get_all_companies(
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    admin_user: dict = Depends(get_admin_user)
):
    """Get all companies with filtering (Admin only)"""
    try:
        companies = mock_companies.copy()
        
        if status:
            companies = [c for c in companies if c["status"] == status]
            
        total = len(companies)
        companies = companies[skip:skip + limit]
        
        return {
            "companies": companies,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/errors")
async def get_application_errors(
    skip: int = 0, 
    limit: int = 100,
    level: Optional[str] = None,
    admin_user: dict = Depends(get_admin_user)
):
    """Get application errors (Admin only)"""
    try:
        errors = mock_errors.copy()
        
        if level:
            errors = [e for e in errors if e["level"] == level]
            
        # Sort by timestamp (newest first)
        errors.sort(key=lambda x: x["timestamp"], reverse=True)
        
        total = len(errors)
        errors = errors[skip:skip + limit]
        
        return {
            "errors": errors,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/database/tables")
async def get_database_tables(admin_user: dict = Depends(get_admin_user)):
    """Get database table structures (Admin only)"""
    try:
        return {
            "tables": mock_db_tables,
            "total_tables": len(mock_db_tables),
            "total_records": sum(table["row_count"] for table in mock_db_tables)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/users/{user_id}/{action}")
async def user_action(
    user_id: int, 
    action: str,
    admin_user: dict = Depends(get_admin_user)
):
    """Perform action on user (Admin only)"""
    try:
        # Find user by ID
        user = None
        for u in mock_users.values():
            if u["id"] == user_id:
                user = u
                break
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if action == "suspend":
            user["status"] = "suspended"
        elif action == "activate":
            user["status"] = "active"
        elif action == "delete":
            # In real implementation, you'd soft delete or archive
            user["status"] = "deleted"
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
        
        return {"message": f"User {action}d successfully", "user": user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/companies/{company_id}/{action}")
async def company_action(
    company_id: int, 
    action: str,
    admin_user: dict = Depends(get_admin_user)
):
    """Perform action on company (Admin only)"""
    try:
        # Find company by ID
        company = None
        for i, c in enumerate(mock_companies):
            if c["id"] == company_id:
                company = c
                break
        
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        
        if action == "suspend":
            company["status"] = "suspended"
        elif action == "activate":
            company["status"] = "active"
        elif action == "delete":
            company["status"] = "deleted"
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
        
        return {"message": f"Company {action}d successfully", "company": company}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Job endpoints
@app.get("/api/jobs")
async def get_jobs(limit: int = 10, skip: int = 0, search: Optional[str] = None):
    """Get job listings"""
    jobs = mock_jobs.copy()
    
    # Filter by search term
    if search:
        search_lower = search.lower()
        jobs = [j for j in jobs if 
                search_lower in j["title"].lower() or 
                search_lower in j["company"].lower() or 
                search_lower in j["location"].lower()]
    
    # Filter active jobs only
    jobs = [j for j in jobs if j["status"] == "active"]
    
    total = len(jobs)
    jobs = jobs[skip:skip + limit]
    
    return {
        "jobs": jobs,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@app.get("/api/jobs/{job_id}")
async def get_job(job_id: int):
    """Get specific job details"""
    job = next((j for j in mock_jobs if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.post("/api/jobs/{job_id}/apply")
async def apply_to_job(job_id: int, current_user: dict = Depends(get_current_user)):
    """Apply to a job (requires authentication)"""
    job = next((j for j in mock_jobs if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # In real implementation, create application record
    return {
        "message": "Application submitted successfully",
        "job_id": job_id,
        "user_id": current_user["id"],
        "applied_at": datetime.now().isoformat()
    }

@app.post("/api/jobs/{job_id}/save")
async def save_job(job_id: int, current_user: dict = Depends(get_current_user)):
    """Save a job (requires authentication)"""
    job = next((j for j in mock_jobs if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # In real implementation, save to user's saved jobs
    return {
        "message": "Job saved successfully",
        "job_id": job_id,
        "user_id": current_user["id"],
        "saved_at": datetime.now().isoformat()
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

