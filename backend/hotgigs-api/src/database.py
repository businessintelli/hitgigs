import os
import psycopg2
import psycopg2.extras
from datetime import datetime
import hashlib
import secrets
from typing import Optional, List, Dict, Any
import json

# Supabase PostgreSQL Database Manager
class SupabaseManager:
    def __init__(self):
        self.connection_params = {
            'host': os.getenv('SUPABASE_HOST', 'localhost'),
            'database': os.getenv('SUPABASE_DB', 'postgres'),
            'user': os.getenv('SUPABASE_USER', 'postgres'),
            'password': os.getenv('SUPABASE_PASSWORD', ''),
            'port': os.getenv('SUPABASE_PORT', '5432'),
            'sslmode': 'require'
        }
        self.init_database()
    
    def get_connection(self):
        """Get database connection"""
        try:
            conn = psycopg2.connect(**self.connection_params)
            conn.autocommit = True
            return conn
        except psycopg2.Error as e:
            print(f"Database connection error: {e}")
            # Fallback to local SQLite for development
            return self._get_sqlite_connection()
    
    def _get_sqlite_connection(self):
        """Fallback SQLite connection for development"""
        import sqlite3
        conn = sqlite3.connect("hotgigs_dev.db")
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Initialize database with all required tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Check if we're using PostgreSQL or SQLite
            is_postgres = hasattr(cursor, 'mogrify')
            
            if is_postgres:
                # PostgreSQL table creation
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS users (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        role VARCHAR(50) DEFAULT 'user',
                        is_active BOOLEAN DEFAULT true,
                        is_admin BOOLEAN DEFAULT false,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        last_login TIMESTAMP,
                        profile_data JSONB
                    )
                ''')
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS companies (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        description TEXT,
                        website VARCHAR(255),
                        logo_url VARCHAR(255),
                        is_active BOOLEAN DEFAULT true,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        user_id INTEGER REFERENCES users(id)
                    )
                ''')
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS jobs (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        description TEXT NOT NULL,
                        company VARCHAR(255) NOT NULL,
                        location VARCHAR(255) NOT NULL,
                        salary VARCHAR(100),
                        type VARCHAR(50) DEFAULT 'Full-time',
                        is_active BOOLEAN DEFAULT true,
                        posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        company_id INTEGER REFERENCES companies(id)
                    )
                ''')
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS job_applications (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id),
                        job_id INTEGER NOT NULL REFERENCES jobs(id),
                        status VARCHAR(50) DEFAULT 'pending',
                        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        cover_letter TEXT,
                        resume_url VARCHAR(255),
                        UNIQUE(user_id, job_id)
                    )
                ''')
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS saved_jobs (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id),
                        job_id INTEGER NOT NULL REFERENCES jobs(id),
                        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE(user_id, job_id)
                    )
                ''')
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS system_logs (
                        id SERIAL PRIMARY KEY,
                        level VARCHAR(20) NOT NULL,
                        message TEXT NOT NULL,
                        details TEXT,
                        user_id INTEGER REFERENCES users(id),
                        ip_address INET,
                        user_agent TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS admin_sessions (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id),
                        token VARCHAR(255) UNIQUE NOT NULL,
                        expires_at TIMESTAMP NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
            else:
                # SQLite table creation (fallback)
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
            
            # Insert sample data
            self.insert_sample_data()
            
        except Exception as e:
            print(f"Database initialization error: {e}")
        finally:
            cursor.close()
            conn.close()
    
    def insert_sample_data(self):
        """Insert sample data for testing"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Check if admin user exists
            cursor.execute("SELECT id FROM users WHERE email = %s", ("admin@hotgigs.ai",))
            if not cursor.fetchone():
                # Create admin user
                admin_password = self.hash_password("admin123")
                cursor.execute('''
                    INSERT INTO users (name, email, password_hash, role, is_admin, is_active)
                    VALUES (%s, %s, %s, %s, %s, %s)
                ''', ("Super Admin", "admin@hotgigs.ai", admin_password, "admin", True, True))
                
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
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (name, email, password_hash, role, True))
            
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
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (name, email, description, website, True))
            
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
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ''', (title, description, company, location, salary, job_type, True))
                    
        except Exception as e:
            print(f"Sample data insertion error: {e}")
        finally:
            cursor.close()
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
                VALUES (%s, %s, %s, %s, %s) RETURNING id
            ''', (name, email, password_hash, role, True))
            
            result = cursor.fetchone()
            return result[0] if result else None
        except Exception as e:
            print(f"Create user error: {e}")
            return None
        finally:
            cursor.close()
            conn.close()
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user and return user data"""
        conn = self.get_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        try:
            cursor.execute('''
                SELECT id, name, email, role, is_active, is_admin, created_at, last_login, password_hash
                FROM users WHERE email = %s AND is_active = true
            ''', (email,))
            
            user = cursor.fetchone()
            if user and self.verify_password(password, user['password_hash']):
                # Update last login
                cursor.execute('''
                    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s
                ''', (user['id'],))
                
                # Remove password hash from returned data
                user_dict = dict(user)
                del user_dict['password_hash']
                user_dict['last_login'] = datetime.now().isoformat()
                return user_dict
            
            return None
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
        finally:
            cursor.close()
            conn.close()
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users"""
        conn = self.get_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        try:
            cursor.execute('''
                SELECT id, name, email, role, is_active, is_admin, created_at, last_login
                FROM users ORDER BY created_at DESC
            ''')
            
            return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            print(f"Get users error: {e}")
            return []
        finally:
            cursor.close()
            conn.close()
    
    def get_all_companies(self) -> List[Dict[str, Any]]:
        """Get all companies"""
        conn = self.get_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        try:
            cursor.execute('''
                SELECT id, name, email, description, website, is_active, created_at
                FROM companies ORDER BY created_at DESC
            ''')
            
            return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            print(f"Get companies error: {e}")
            return []
        finally:
            cursor.close()
            conn.close()
    
    def get_all_jobs(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get all jobs"""
        conn = self.get_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        try:
            cursor.execute('''
                SELECT id, title, description, company, location, salary, type, is_active, posted_date
                FROM jobs WHERE is_active = true ORDER BY posted_date DESC LIMIT %s
            ''', (limit,))
            
            return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            print(f"Get jobs error: {e}")
            return []
        finally:
            cursor.close()
            conn.close()
    
    def update_user_status(self, user_id: int, is_active: bool) -> bool:
        """Update user active status"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                UPDATE users SET is_active = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s
            ''', (is_active, user_id))
            
            return cursor.rowcount > 0
        except Exception as e:
            print(f"Update user status error: {e}")
            return False
        finally:
            cursor.close()
            conn.close()
    
    def update_company_status(self, company_id: int, is_active: bool) -> bool:
        """Update company active status"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                UPDATE companies SET is_active = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s
            ''', (is_active, company_id))
            
            return cursor.rowcount > 0
        except Exception as e:
            print(f"Update company status error: {e}")
            return False
        finally:
            cursor.close()
            conn.close()
    
    def get_system_stats(self) -> Dict[str, Any]:
        """Get system statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            stats = {}
            
            # User stats
            cursor.execute("SELECT COUNT(*) FROM users")
            stats['total_users'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM users WHERE is_active = true")
            stats['active_users'] = cursor.fetchone()[0]
            
            # Company stats
            cursor.execute("SELECT COUNT(*) FROM companies")
            stats['total_companies'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM companies WHERE is_active = true")
            stats['active_companies'] = cursor.fetchone()[0]
            
            # Job stats
            cursor.execute("SELECT COUNT(*) FROM jobs")
            stats['total_jobs'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM jobs WHERE is_active = true")
            stats['active_jobs'] = cursor.fetchone()[0]
            
            # Application stats
            cursor.execute("SELECT COUNT(*) FROM job_applications")
            stats['total_applications'] = cursor.fetchone()[0]
            
            return stats
        except Exception as e:
            print(f"Get stats error: {e}")
            return {}
        finally:
            cursor.close()
            conn.close()

# Global database instance
db = SupabaseManager()

# Functions for backward compatibility
def init_database():
    """Initialize database - function for external use"""
    global db
    db = SupabaseManager()
    return db

def get_db_manager():
    """Get the global database manager instance"""
    global db
    if db is None:
        db = SupabaseManager()
    return db

