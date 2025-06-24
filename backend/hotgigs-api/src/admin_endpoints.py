from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import psutil
import time
import os
from datetime import datetime, timedelta
import json

# Import existing modules
from .main import app, get_current_user

# Admin-specific models
class SystemStats(BaseModel):
    total_users: int
    active_users: int
    total_jobs: int
    total_applications: int
    system_uptime: str
    avg_response_time: str
    error_rate: str
    storage_used: str

class UserManagement(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str
    last_login: Optional[str]
    join_date: str

class ServiceStatus(BaseModel):
    service_name: str
    status: str
    message: str
    last_check: str

class DatabaseStatus(BaseModel):
    connected: bool
    database_name: str
    connection_pool_size: int
    active_connections: int

# Admin authentication dependency
async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# System monitoring endpoints
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

# Admin-only endpoints
@app.get("/api/admin/stats", response_model=SystemStats)
async def get_system_stats(admin_user: dict = Depends(get_admin_user)):
    """Get comprehensive system statistics (Admin only)"""
    try:
        # Simulate real statistics - replace with actual database queries
        stats = SystemStats(
            total_users=15420,
            active_users=12350,
            total_jobs=8750,
            total_applications=45600,
            system_uptime="99.9%",
            avg_response_time="120ms",
            error_rate="0.1%",
            storage_used="2.4TB"
        )
        return stats
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
        # Simulate user data - replace with actual database queries
        users = [
            {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "role": "user",
                "status": "active",
                "last_login": "2024-06-24T10:30:00",
                "join_date": "2024-01-15",
                "profile_complete": True
            },
            {
                "id": 2,
                "name": "Jane Smith",
                "email": "jane@company.com",
                "role": "company",
                "status": "active",
                "last_login": "2024-06-24T09:15:00",
                "join_date": "2024-02-20",
                "profile_complete": True
            },
            {
                "id": 3,
                "name": "Mike Johnson",
                "email": "mike@recruiter.com",
                "role": "recruiter",
                "status": "suspended",
                "last_login": "2024-06-20T14:45:00",
                "join_date": "2024-03-10",
                "profile_complete": False
            }
        ]
        
        # Apply filters
        if role:
            users = [u for u in users if u["role"] == role]
        if status:
            users = [u for u in users if u["status"] == status]
            
        # Apply pagination
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

@app.put("/api/admin/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    new_status: str,
    admin_user: dict = Depends(get_admin_user)
):
    """Update user status (Admin only)"""
    try:
        if new_status not in ["active", "suspended", "banned"]:
            raise HTTPException(status_code=400, detail="Invalid status")
            
        # Simulate user status update - replace with actual database update
        return {
            "message": f"User {user_id} status updated to {new_status}",
            "user_id": user_id,
            "new_status": new_status,
            "updated_by": admin_user["email"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/users/{user_id}")
async def delete_user(
    user_id: int,
    admin_user: dict = Depends(get_admin_user)
):
    """Delete user (Admin only)"""
    try:
        # Simulate user deletion - replace with actual database deletion
        return {
            "message": f"User {user_id} has been deleted",
            "user_id": user_id,
            "deleted_by": admin_user["email"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/jobs")
async def get_all_jobs(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    admin_user: dict = Depends(get_admin_user)
):
    """Get all jobs (Admin only)"""
    try:
        # Simulate job data - replace with actual database queries
        jobs = [
            {
                "id": 1,
                "title": "Senior Software Engineer",
                "company": "TechCorp Inc.",
                "status": "active",
                "posted_date": "2024-06-20",
                "applications_count": 45,
                "views": 1250
            },
            {
                "id": 2,
                "title": "Product Manager",
                "company": "StartupXYZ",
                "status": "active",
                "posted_date": "2024-06-22",
                "applications_count": 32,
                "views": 890
            }
        ]
        
        if status:
            jobs = [j for j in jobs if j["status"] == status]
            
        total = len(jobs)
        jobs = jobs[skip:skip + limit]
        
        return {
            "jobs": jobs,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/analytics")
async def get_analytics(
    period: str = "7d",
    admin_user: dict = Depends(get_admin_user)
):
    """Get platform analytics (Admin only)"""
    try:
        # Simulate analytics data - replace with actual analytics queries
        analytics = {
            "period": period,
            "user_registrations": {
                "total": 1250,
                "growth": "+12.5%"
            },
            "job_postings": {
                "total": 340,
                "growth": "+8.2%"
            },
            "applications": {
                "total": 5670,
                "growth": "+15.3%"
            },
            "matches": {
                "total": 2340,
                "success_rate": "78.5%"
            },
            "top_skills": [
                {"skill": "Python", "count": 1250},
                {"skill": "JavaScript", "count": 1100},
                {"skill": "React", "count": 890},
                {"skill": "Node.js", "count": 750},
                {"skill": "AWS", "count": 680}
            ],
            "top_locations": [
                {"location": "San Francisco, CA", "count": 450},
                {"location": "New York, NY", "count": 380},
                {"location": "Remote", "count": 320},
                {"location": "Seattle, WA", "count": 280},
                {"location": "Austin, TX", "count": 220}
            ]
        }
        
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/system/logs")
async def get_system_logs(
    level: str = "info",
    limit: int = 100,
    admin_user: dict = Depends(get_admin_user)
):
    """Get system logs (Admin only)"""
    try:
        # Simulate log data - replace with actual log retrieval
        logs = [
            {
                "timestamp": "2024-06-24T10:30:00",
                "level": "info",
                "message": "User registration: jane@example.com",
                "source": "auth_service"
            },
            {
                "timestamp": "2024-06-24T10:25:00",
                "level": "info",
                "message": "Job posted: Senior Developer at TechCorp",
                "source": "job_service"
            },
            {
                "timestamp": "2024-06-24T10:20:00",
                "level": "warning",
                "message": "High CPU usage detected: 85%",
                "source": "monitoring"
            },
            {
                "timestamp": "2024-06-24T10:15:00",
                "level": "error",
                "message": "Failed login attempt: invalid@email.com",
                "source": "auth_service"
            }
        ]
        
        if level != "all":
            logs = [log for log in logs if log["level"] == level]
            
        logs = logs[:limit]
        
        return {
            "logs": logs,
            "total": len(logs),
            "level": level,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/system/maintenance")
async def toggle_maintenance_mode(
    enabled: bool,
    admin_user: dict = Depends(get_admin_user)
):
    """Toggle maintenance mode (Admin only)"""
    try:
        # Simulate maintenance mode toggle - replace with actual implementation
        return {
            "maintenance_mode": enabled,
            "message": f"Maintenance mode {'enabled' if enabled else 'disabled'}",
            "updated_by": admin_user["email"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add error handlers
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

