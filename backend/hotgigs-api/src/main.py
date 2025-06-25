import os
import sys
from datetime import datetime, timedelta
import secrets
import json
from typing import Optional, Dict, Any

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import uvicorn

# Add the src directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import db

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "user"

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    is_active: bool

class CompanyUpdate(BaseModel):
    is_active: bool

# FastAPI app
app = FastAPI(
    title="HotGigs.ai API",
    description="Enterprise job platform API with admin capabilities",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# In-memory token storage (in production, use Redis or database)
active_tokens = {}
admin_tokens = {}

def create_token(user_data: Dict[str, Any], is_admin: bool = False) -> str:
    """Create a JWT-like token"""
    token = secrets.token_urlsafe(32)
    token_data = {
        'user': user_data,
        'expires': (datetime.now() + timedelta(hours=24)).isoformat(),
        'is_admin': is_admin
    }
    
    if is_admin:
        admin_tokens[token] = token_data
    else:
        active_tokens[token] = token_data
    
    return token

def verify_token(credentials: HTTPAuthorizationCredentials, require_admin: bool = False) -> Dict[str, Any]:
    """Verify token and return user data"""
    token = credentials.credentials
    
    # Check admin tokens if admin required
    if require_admin:
        if token not in admin_tokens:
            raise HTTPException(status_code=401, detail="Invalid admin token")
        
        token_data = admin_tokens[token]
        if datetime.fromisoformat(token_data['expires']) < datetime.now():
            del admin_tokens[token]
            raise HTTPException(status_code=401, detail="Token expired")
        
        return token_data['user']
    
    # Check regular tokens
    if token not in active_tokens:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    token_data = active_tokens[token]
    if datetime.fromisoformat(token_data['expires']) < datetime.now():
        del active_tokens[token]
        raise HTTPException(status_code=401, detail="Token expired")
    
    return token_data['user']

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current authenticated user"""
    return verify_token(credentials)

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current authenticated admin user"""
    return verify_token(credentials, require_admin=True)

# Health and status endpoints
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        stats = db.get_system_stats()
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "database": "connected",
            "users": stats.get('total_users', 0)
        }
    except Exception as e:
        db.log_system_event("ERROR", f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Service unhealthy")

@app.get("/api/status")
async def system_status():
    """System status endpoint"""
    try:
        stats = db.get_system_stats()
        schema = db.get_database_schema()
        
        return {
            "status": "operational",
            "timestamp": datetime.now().isoformat(),
            "statistics": stats,
            "database": {
                "status": "connected",
                "tables": len(schema)
            },
            "services": {
                "api": "running",
                "database": "connected",
                "authentication": "active"
            }
        }
    except Exception as e:
        db.log_system_event("ERROR", f"Status check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Status check failed")

# Authentication endpoints
@app.post("/api/auth/register")
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        user_id = db.create_user(
            name=user_data.name,
            email=user_data.email,
            password=user_data.password,
            role=user_data.role
        )
        
        if user_id is None:
            raise HTTPException(status_code=400, detail="Email already exists")
        
        # Get user data for token
        user = db.authenticate_user(user_data.email, user_data.password)
        if not user:
            raise HTTPException(status_code=500, detail="Registration failed")
        
        # Create token
        token = create_token(user)
        
        db.log_system_event("INFO", f"User registered: {user_data.email}", user_id=user_id)
        
        return {
            "message": "User registered successfully",
            "token": token,
            "user": user
        }
    except HTTPException:
        raise
    except Exception as e:
        db.log_system_event("ERROR", f"Registration failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/api/auth/login")
async def login_user(login_data: UserLogin):
    """Login user"""
    try:
        user = db.authenticate_user(login_data.email, login_data.password)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token
        token = create_token(user)
        
        db.log_system_event("INFO", f"User logged in: {login_data.email}", user_id=user['id'])
        
        return {
            "message": "Login successful",
            "token": token,
            "user": user
        }
    except HTTPException:
        raise
    except Exception as e:
        db.log_system_event("ERROR", f"Login failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

# Admin authentication
@app.post("/api/admin/login")
async def admin_login(login_data: UserLogin):
    """Admin login"""
    try:
        user = db.authenticate_user(login_data.email, login_data.password)
        
        if not user or not user.get('is_admin'):
            raise HTTPException(status_code=401, detail="Invalid admin credentials")
        
        # Create admin token
        token = create_token(user, is_admin=True)
        
        db.log_system_event("INFO", f"Admin logged in: {login_data.email}", user_id=user['id'])
        
        return {
            "message": "Admin login successful",
            "token": token,
            "user": user
        }
    except HTTPException:
        raise
    except Exception as e:
        db.log_system_event("ERROR", f"Admin login failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Admin login failed")

# Job endpoints
@app.get("/api/jobs")
async def get_jobs(limit: int = 50, search: str = None):
    """Get jobs with optional search"""
    try:
        jobs = db.get_all_jobs(limit=limit)
        
        # Simple search filter
        if search:
            search_lower = search.lower()
            jobs = [
                job for job in jobs 
                if search_lower in job['title'].lower() or 
                   search_lower in job['company'].lower() or
                   search_lower in job['description'].lower()
            ]
        
        return {
            "jobs": jobs,
            "total": len(jobs)
        }
    except Exception as e:
        db.log_system_event("ERROR", f"Failed to get jobs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get jobs")

@app.post("/api/jobs/{job_id}/save")
async def save_job(job_id: int, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Save a job for user"""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        
        # Check if already saved
        cursor.execute(
            "SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?",
            (current_user['id'], job_id)
        )
        
        if cursor.fetchone():
            # Remove from saved
            cursor.execute(
                "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?",
                (current_user['id'], job_id)
            )
            message = "Job removed from saved"
        else:
            # Add to saved
            cursor.execute(
                "INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)",
                (current_user['id'], job_id)
            )
            message = "Job saved successfully"
        
        conn.commit()
        conn.close()
        
        db.log_system_event("INFO", f"Job save action: {message}", user_id=current_user['id'])
        
        return {"message": message}
    except Exception as e:
        db.log_system_event("ERROR", f"Failed to save job: {str(e)}", user_id=current_user['id'])
        raise HTTPException(status_code=500, detail="Failed to save job")

@app.post("/api/jobs/{job_id}/apply")
async def apply_job(job_id: int, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Apply for a job"""
    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        
        # Check if already applied
        cursor.execute(
            "SELECT id FROM job_applications WHERE user_id = ? AND job_id = ?",
            (current_user['id'], job_id)
        )
        
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Already applied for this job")
        
        # Add application
        cursor.execute(
            "INSERT INTO job_applications (user_id, job_id, status) VALUES (?, ?, ?)",
            (current_user['id'], job_id, "pending")
        )
        
        conn.commit()
        conn.close()
        
        db.log_system_event("INFO", f"Job application submitted for job {job_id}", user_id=current_user['id'])
        
        return {"message": "Application submitted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.log_system_event("ERROR", f"Failed to apply for job: {str(e)}", user_id=current_user['id'])
        raise HTTPException(status_code=500, detail="Failed to apply for job")

# Admin endpoints
@app.get("/api/admin/stats")
async def get_admin_stats(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    """Get admin statistics"""
    try:
        stats = db.get_system_stats()
        schema = db.get_database_schema()
        recent_logs = db.get_recent_logs(limit=10)
        
        return {
            "statistics": stats,
            "database_schema": schema,
            "recent_logs": recent_logs,
            "system_info": {
                "uptime": "Running",
                "version": "1.0.0",
                "environment": "development"
            }
        }
    except Exception as e:
        db.log_system_event("ERROR", f"Failed to get admin stats: {str(e)}", user_id=current_admin['id'])
        raise HTTPException(status_code=500, detail="Failed to get admin statistics")

@app.get("/api/admin/users")
async def get_all_users_admin(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    """Get all users for admin"""
    try:
        users = db.get_all_users()
        return {"users": users}
    except Exception as e:
        db.log_system_event("ERROR", f"Failed to get users: {str(e)}", user_id=current_admin['id'])
        raise HTTPException(status_code=500, detail="Failed to get users")

@app.put("/api/admin/users/{user_id}")
async def update_user_admin(
    user_id: int, 
    user_update: UserUpdate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    """Update user status"""
    try:
        success = db.update_user_status(user_id, user_update.is_active)
        
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        
        action = "enabled" if user_update.is_active else "disabled"
        db.log_system_event(
            "INFO", 
            f"User {user_id} {action} by admin", 
            user_id=current_admin['id']
        )
        
        return {"message": f"User {action} successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.log_system_event("ERROR", f"Failed to update user: {str(e)}", user_id=current_admin['id'])
        raise HTTPException(status_code=500, detail="Failed to update user")

@app.get("/api/admin/companies")
async def get_all_companies_admin(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    """Get all companies for admin"""
    try:
        companies = db.get_all_companies()
        return {"companies": companies}
    except Exception as e:
        db.log_system_event("ERROR", f"Failed to get companies: {str(e)}", user_id=current_admin['id'])
        raise HTTPException(status_code=500, detail="Failed to get companies")

@app.put("/api/admin/companies/{company_id}")
async def update_company_admin(
    company_id: int,
    company_update: CompanyUpdate,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    """Update company status"""
    try:
        success = db.update_company_status(company_id, company_update.is_active)
        
        if not success:
            raise HTTPException(status_code=404, detail="Company not found")
        
        action = "enabled" if company_update.is_active else "disabled"
        db.log_system_event(
            "INFO",
            f"Company {company_id} {action} by admin",
            user_id=current_admin['id']
        )
        
        return {"message": f"Company {action} successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.log_system_event("ERROR", f"Failed to update company: {str(e)}", user_id=current_admin['id'])
        raise HTTPException(status_code=500, detail="Failed to update company")

@app.get("/api/admin/database")
async def get_database_schema_admin(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    """Get database schema information"""
    try:
        schema = db.get_database_schema()
        return {"schema": schema}
    except Exception as e:
        db.log_system_event("ERROR", f"Failed to get database schema: {str(e)}", user_id=current_admin['id'])
        raise HTTPException(status_code=500, detail="Failed to get database schema")

@app.get("/api/admin/logs")
async def get_system_logs_admin(
    limit: int = 100,
    current_admin: Dict[str, Any] = Depends(get_current_admin)
):
    """Get system logs"""
    try:
        logs = db.get_recent_logs(limit=limit)
        return {"logs": logs}
    except Exception as e:
        db.log_system_event("ERROR", f"Failed to get logs: {str(e)}", user_id=current_admin['id'])
        raise HTTPException(status_code=500, detail="Failed to get logs")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "HotGigs.ai API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/api/health",
            "status": "/api/status",
            "jobs": "/api/jobs",
            "auth": "/api/auth/login",
            "admin": "/api/admin/login"
        }
    }

if __name__ == "__main__":
    # Initialize database
    print("🚀 Starting HotGigs.ai API Server...")
    print("📊 Initializing database...")
    
    try:
        # Test database connection
        stats = db.get_system_stats()
        print(f"✅ Database connected - {stats['total_users']} users, {stats['total_jobs']} jobs")
        
        # Log startup
        db.log_system_event("INFO", "API server starting up")
        
        print("🌐 Starting server on http://localhost:8000")
        print("📚 API documentation: http://localhost:8000/docs")
        print("🛡️  Admin login: admin@hotgigs.ai / admin123")
        
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

