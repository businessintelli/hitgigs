import os
import sqlite3
from datetime import datetime
import hashlib
import secrets
from typing import Optional, List, Dict, Any

# Global database manager instance
db_manager = None

def init_database(db_path: str = "hotgigs.db"):
    """Initialize database - function for external use"""
    global db_manager
    db_manager = DatabaseManager(db_path)
    return db_manager

def get_db_manager():
    """Get the global database manager instance"""
    global db_manager
    if db_manager is None:
        db_manager = DatabaseManager()
    return db_manager

class DatabaseManager:
    def __init__(self, db_path: str = "hotgigs.db"):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Enable dict-like access
        return conn
    
    def init_database(self):
        """Initialize database with all required tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                is_active BOOLEAN DEFAULT 1,
                is_admin BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                profile_data TEXT
            )
        ''')
        
        # Companies table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS companies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                description TEXT,
                website TEXT,
                logo_url TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Jobs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                company TEXT NOT NULL,
                location TEXT NOT NULL,
                salary TEXT,
                type TEXT DEFAULT 'Full-time',
                is_active BOOLEAN DEFAULT 1,
                posted_date TEXT DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                company_id INTEGER,
                FOREIGN KEY (company_id) REFERENCES companies (id)
            )
        ''')
        
        # Job applications table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS job_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                job_id INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                cover_letter TEXT,
                resume_url TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (job_id) REFERENCES jobs (id),
                UNIQUE(user_id, job_id)
            )
        ''')
        
        # Saved jobs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS saved_jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                job_id INTEGER NOT NULL,
                saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (job_id) REFERENCES jobs (id),
                UNIQUE(user_id, job_id)
            )
        ''')
        
        # System logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS system_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                level TEXT NOT NULL,
                message TEXT NOT NULL,
                details TEXT,
                user_id INTEGER,
                ip_address TEXT,
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Admin sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS admin_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        
        # Insert sample data
        self.insert_sample_data()
    
    def insert_sample_data(self):
        """Insert sample data for testing"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Check if admin user exists
        cursor.execute("SELECT id FROM users WHERE email = ?", ("admin@hotgigs.ai",))
        if not cursor.fetchone():
            # Create admin user
            admin_password = self.hash_password("admin123")
            cursor.execute('''
                INSERT INTO users (name, email, password_hash, role, is_admin, is_active)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', ("Super Admin", "admin@hotgigs.ai", admin_password, "admin", 1, 1))
            
            # Create test users
            test_users = [
                ("John Doe", "john@example.com", "user123", "user"),
                ("Jane Smith", "jane@example.com", "user123", "user"),
                ("Tech Corp", "hr@techcorp.com", "company123", "company"),
                ("StartupXYZ", "contact@startupxyz.com", "company123", "company"),
                ("Alice Recruiter", "alice@recruiter.com", "recruiter123", "recruiter")
            ]
            
            for name, email, password, role in test_users:
                password_hash = self.hash_password(password)
                cursor.execute('''
                    INSERT INTO users (name, email, password_hash, role, is_active)
                    VALUES (?, ?, ?, ?, ?)
                ''', (name, email, password_hash, role, 1))
        
        # Check if companies exist
        cursor.execute("SELECT id FROM companies LIMIT 1")
        if not cursor.fetchone():
            companies = [
                ("Tech Corp", "hr@techcorp.com", "Leading technology company", "https://techcorp.com"),
                ("StartupXYZ", "contact@startupxyz.com", "Innovative startup", "https://startupxyz.com"),
                ("Global Solutions", "jobs@globalsolutions.com", "Global consulting firm", "https://globalsolutions.com"),
                ("Creative Agency", "careers@creative.com", "Digital creative agency", "https://creative.com")
            ]
            
            for name, email, description, website in companies:
                cursor.execute('''
                    INSERT INTO companies (name, email, description, website, is_active)
                    VALUES (?, ?, ?, ?, ?)
                ''', (name, email, description, website, 1))
        
        # Check if jobs exist
        cursor.execute("SELECT id FROM jobs LIMIT 1")
        if not cursor.fetchone():
            jobs = [
                ("Senior Software Engineer", "We are looking for a senior software engineer...", "Tech Corp", "San Francisco, CA", "$120,000 - $150,000", "Full-time"),
                ("Product Manager", "Join our product team to drive innovation...", "StartupXYZ", "Remote", "$90,000 - $120,000", "Full-time"),
                ("Frontend Developer", "Build amazing user experiences...", "Creative Agency", "New York, NY", "$80,000 - $100,000", "Full-time"),
                ("Data Scientist", "Analyze data to drive business decisions...", "Global Solutions", "Boston, MA", "$100,000 - $130,000", "Full-time"),
                ("UX Designer", "Design intuitive user interfaces...", "Creative Agency", "Los Angeles, CA", "$70,000 - $90,000", "Full-time"),
                ("DevOps Engineer", "Manage our cloud infrastructure...", "Tech Corp", "Seattle, WA", "$110,000 - $140,000", "Full-time")
            ]
            
            for title, description, company, location, salary, job_type in jobs:
                cursor.execute('''
                    INSERT INTO jobs (title, description, company, location, salary, type, is_active)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (title, description, company, location, salary, job_type, 1))
        
        conn.commit()
        conn.close()
    
    def hash_password(self, password: str) -> str:
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify password against hash"""
        return self.hash_password(password) == password_hash
    
    def create_user(self, name: str, email: str, password: str, role: str = "user") -> Optional[int]:
        """Create a new user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            password_hash = self.hash_password(password)
            cursor.execute('''
                INSERT INTO users (name, email, password_hash, role, is_active)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, email, password_hash, role, 1))
            
            user_id = cursor.lastrowid
            conn.commit()
            return user_id
        except sqlite3.IntegrityError:
            return None
        finally:
            conn.close()
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user and return user data"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, email, role, is_active, is_admin, created_at, last_login
            FROM users WHERE email = ? AND is_active = 1
        ''', (email,))
        
        user = cursor.fetchone()
        if user:
            # Get password hash
            cursor.execute("SELECT password_hash FROM users WHERE id = ?", (user['id'],))
            password_hash = cursor.fetchone()['password_hash']
            
            if self.verify_password(password, password_hash):
                # Update last login
                cursor.execute('''
                    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
                ''', (user['id'],))
                conn.commit()
                
                # Convert to dict
                user_dict = dict(user)
                user_dict['last_login'] = datetime.now().isoformat()
                conn.close()
                return user_dict
        
        conn.close()
        return None
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, email, role, is_active, is_admin, created_at, last_login
            FROM users ORDER BY created_at DESC
        ''')
        
        users = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return users
    
    def get_all_companies(self) -> List[Dict[str, Any]]:
        """Get all companies"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, email, description, website, is_active, created_at
            FROM companies ORDER BY created_at DESC
        ''')
        
        companies = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return companies
    
    def get_all_jobs(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get all jobs"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, description, company, location, salary, type, is_active, posted_date
            FROM jobs WHERE is_active = 1 ORDER BY posted_date DESC LIMIT ?
        ''', (limit,))
        
        jobs = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jobs
    
    def update_user_status(self, user_id: int, is_active: bool) -> bool:
        """Update user active status"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        ''', (is_active, user_id))
        
        success = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return success
    
    def update_company_status(self, company_id: int, is_active: bool) -> bool:
        """Update company active status"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE companies SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        ''', (is_active, company_id))
        
        success = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return success
    
    def get_system_stats(self) -> Dict[str, Any]:
        """Get system statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        stats = {}
        
        # User stats
        cursor.execute("SELECT COUNT(*) as total FROM users")
        stats['total_users'] = cursor.fetchone()['total']
        
        cursor.execute("SELECT COUNT(*) as active FROM users WHERE is_active = 1")
        stats['active_users'] = cursor.fetchone()['active']
        
        # Company stats
        cursor.execute("SELECT COUNT(*) as total FROM companies")
        stats['total_companies'] = cursor.fetchone()['total']
        
        cursor.execute("SELECT COUNT(*) as active FROM companies WHERE is_active = 1")
        stats['active_companies'] = cursor.fetchone()['active']
        
        # Job stats
        cursor.execute("SELECT COUNT(*) as total FROM jobs")
        stats['total_jobs'] = cursor.fetchone()['total']
        
        cursor.execute("SELECT COUNT(*) as active FROM jobs WHERE is_active = 1")
        stats['active_jobs'] = cursor.fetchone()['active']
        
        # Application stats
        cursor.execute("SELECT COUNT(*) as total FROM job_applications")
        stats['total_applications'] = cursor.fetchone()['total']
        
        conn.close()
        return stats
    
    def get_database_schema(self) -> List[Dict[str, Any]]:
        """Get database table schema information"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = cursor.fetchall()
        
        schema_info = []
        for table in tables:
            table_name = table['name']
            
            # Get table info
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) as count FROM {table_name}")
            row_count = cursor.fetchone()['count']
            
            table_info = {
                'name': table_name,
                'row_count': row_count,
                'columns': [
                    {
                        'name': col['name'],
                        'type': col['type'],
                        'not_null': bool(col['notnull']),
                        'primary_key': bool(col['pk'])
                    }
                    for col in columns
                ]
            }
            schema_info.append(table_info)
        
        conn.close()
        return schema_info
    
    def log_system_event(self, level: str, message: str, details: str = None, 
                        user_id: int = None, ip_address: str = None, user_agent: str = None):
        """Log system event"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO system_logs (level, message, details, user_id, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (level, message, details, user_id, ip_address, user_agent))
        
        conn.commit()
        conn.close()
    
    def get_recent_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent system logs"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT l.*, u.name as user_name, u.email as user_email
            FROM system_logs l
            LEFT JOIN users u ON l.user_id = u.id
            ORDER BY l.created_at DESC
            LIMIT ?
        ''', (limit,))
        
        logs = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return logs
    
    def save_job(self, user_id: int, job_id: int) -> bool:
        """Save a job for a user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO saved_jobs (user_id, job_id)
                VALUES (?, ?)
            ''', (user_id, job_id))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False  # Already saved
        finally:
            conn.close()
    
    def apply_to_job(self, user_id: int, job_id: int, cover_letter: str = None) -> bool:
        """Apply to a job"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO job_applications (user_id, job_id, cover_letter, status)
                VALUES (?, ?, ?, ?)
            ''', (user_id, job_id, cover_letter, "pending"))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False  # Already applied
        finally:
            conn.close()
    
    def get_user_saved_jobs(self, user_id: int) -> List[Dict[str, Any]]:
        """Get saved jobs for a user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT j.*, s.saved_at
            FROM saved_jobs s
            JOIN jobs j ON s.job_id = j.id
            WHERE s.user_id = ? AND j.is_active = 1
            ORDER BY s.saved_at DESC
        ''', (user_id,))
        
        jobs = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jobs
    
    def get_user_applications(self, user_id: int) -> List[Dict[str, Any]]:
        """Get job applications for a user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT j.*, a.status, a.applied_at, a.cover_letter
            FROM job_applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.user_id = ?
            ORDER BY a.applied_at DESC
        ''', (user_id,))
        
        applications = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return applications

