import os
import psycopg2
import psycopg2.extras
from datetime import datetime
import hashlib
import secrets
from typing import Optional, List, Dict, Any
import json
from dotenv import load_dotenv
import urllib.parse

# Load environment variables
load_dotenv()

# Supabase PostgreSQL Database Manager
class SupabaseManager:
    def __init__(self):
        # Try different connection methods in order of preference
        self.connection_params = self._get_connection_params()
        self.use_postgres = True
        self.init_database()
    
    def _get_connection_params(self):
        """Get connection parameters from environment variables"""
        
        # Method 1: Full DATABASE_URL
        database_url = os.getenv('DATABASE_URL')
        if database_url:
            return {'dsn': database_url}
        
        # Method 2: Supabase URL format (for your specific setup)
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_password = os.getenv('SUPABASE_PASSWORD')
        
        if supabase_url and supabase_password:
            # Extract host from Supabase URL
            # https://nrpvyjwnqvxipjmdjlim.supabase.co -> nrpvyjwnqvxipjmdjlim.supabase.co
            parsed_url = urllib.parse.urlparse(supabase_url)
            host = parsed_url.netloc
            
            return {
                'host': host,
                'database': 'postgres',
                'user': 'postgres',
                'password': supabase_password,
                'port': '5432',
                'sslmode': 'require'
            }
        
        # Method 3: Individual environment variables
        host = os.getenv('SUPABASE_HOST', 'localhost')
        password = os.getenv('SUPABASE_PASSWORD', '')
        
        if host != 'localhost' and password:
            params = {
                'host': host,
                'database': os.getenv('SUPABASE_DB', 'postgres'),
                'user': os.getenv('SUPABASE_USER', 'postgres'),
                'password': password,
                'port': os.getenv('SUPABASE_PORT', '5432'),
            }
            
            # Only add SSL if connecting to remote host
            if host != 'localhost':
                params['sslmode'] = 'require'
                
            return params
        
        # Method 4: Fallback to localhost (development)
        return {
            'host': 'localhost',
            'database': 'postgres',
            'user': 'postgres',
            'password': '',
            'port': '5432',
        }
    
    def get_connection(self):
        """Get database connection"""
        try:
            conn = psycopg2.connect(**self.connection_params)
            conn.autocommit = True
            return conn
        except psycopg2.Error as e:
            print(f"Database connection error: {e}")
            print("Falling back to SQLite for development...")
            self.use_postgres = False
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
            if self.use_postgres:
                self._create_postgres_tables(cursor)
            else:
                self._create_sqlite_tables(cursor)
            
            # Insert sample data
            self.insert_sample_data()
            
        except Exception as e:
            print(f"Database initialization error: {e}")
        finally:
            cursor.close()
            conn.close()
    
    def _create_postgres_tables(self, cursor):
        """Create PostgreSQL tables"""
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
    
    def _create_sqlite_tables(self, cursor):
        """Create SQLite tables (fallback)"""
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
    
    def insert_sample_data(self):
        """Insert sample data for testing"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Use proper parameter style based on database type
            param_style = "%s" if self.use_postgres else "?"
            
            # Check if admin user exists
            cursor.execute(f"SELECT id FROM users WHERE email = {param_style}", ("admin@hotgigs.ai",))
            if not cursor.fetchone():
                # Create admin user
                admin_password = self.hash_password("admin123")
                cursor.execute(f'''
                    INSERT INTO users (name, email, password_hash, role, is_admin, is_active)
                    VALUES ({param_style}, {param_style}, {param_style}, {param_style}, {param_style}, {param_style})
                ''', ("Super Admin", "admin@hotgigs.ai", admin_password, "admin", True, True))
                
                # Create test users
                test_users = [
                    ("John Doe", "john@example.com", "user123", "user"),
                    ("Jane Smith", "jane@example.com", "user123", "user"),
                    ("Tech Corp", "hr@techcorp.com", "company123", "company"),
                    ("Alice Recruiter", "alice@recruiter.com", "recruiter123", "recruiter")
                ]
                
                for name, email, password, role in test_users:
                    password_hash = self.hash_password(password)
                    cursor.execute(f'''
                        INSERT INTO users (name, email, password_hash, role, is_active)
                        VALUES ({param_style}, {param_style}, {param_style}, {param_style}, {param_style})
                    ''', (name, email, password_hash, role, True))
            
            # Check if companies exist
            cursor.execute("SELECT id FROM companies LIMIT 1")
            if not cursor.fetchone():
                companies = [
                    ("Tech Corp", "hr@techcorp.com", "Leading technology company", "https://techcorp.com"),
                    ("StartupXYZ", "contact@startupxyz.com", "Innovative startup", "https://startupxyz.com"),
                    ("Global Solutions", "jobs@globalsolutions.com", "Global consulting firm", "https://globalsolutions.com")
                ]
                
                for name, email, description, website in companies:
                    cursor.execute(f'''
                        INSERT INTO companies (name, email, description, website, is_active)
                        VALUES ({param_style}, {param_style}, {param_style}, {param_style}, {param_style})
                    ''', (name, email, description, website, True))
            
            # Check if jobs exist
            cursor.execute("SELECT id FROM jobs LIMIT 1")
            if not cursor.fetchone():
                jobs = [
                    ("Senior Software Engineer", "We are looking for a senior software engineer with 5+ years of experience in Python, React, and cloud technologies. You'll be working on cutting-edge projects and leading a team of developers.", "Tech Corp", "San Francisco, CA", "$120,000 - $150,000", "Full-time"),
                    ("Product Manager", "Join our product team to drive innovation and strategy. You'll work closely with engineering, design, and business teams to deliver amazing products that users love.", "StartupXYZ", "Remote", "$90,000 - $120,000", "Full-time"),
                    ("Frontend Developer", "Build amazing user experiences with React, TypeScript, and modern web technologies. We're looking for someone passionate about creating beautiful, responsive interfaces.", "Creative Agency", "New York, NY", "$80,000 - $100,000", "Full-time"),
                    ("Data Scientist", "Analyze large datasets to drive business decisions and build machine learning models. Experience with Python, SQL, and statistical analysis required.", "Global Solutions", "Boston, MA", "$100,000 - $130,000", "Full-time"),
                    ("UX Designer", "Design intuitive user interfaces and conduct user research. We're looking for someone with a strong portfolio and experience with design systems.", "Creative Agency", "Los Angeles, CA", "$70,000 - $90,000", "Full-time"),
                    ("DevOps Engineer", "Manage our cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, and Kubernetes preferred.", "Tech Corp", "Seattle, WA", "$110,000 - $140,000", "Full-time")
                ]
                
                for title, description, company, location, salary, job_type in jobs:
                    cursor.execute(f'''
                        INSERT INTO jobs (title, description, company, location, salary, type, is_active)
                        VALUES ({param_style}, {param_style}, {param_style}, {param_style}, {param_style}, {param_style}, {param_style})
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
    
    def log_system_event(self, level: str, message: str, details: str = None, user_id: int = None):
        """Log system events"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            param_style = "%s" if self.use_postgres else "?"
            cursor.execute(f'''
                INSERT INTO system_logs (level, message, details, user_id)
                VALUES ({param_style}, {param_style}, {param_style}, {param_style})
            ''', (level, message, details, user_id))
        except Exception as e:
            print(f"Error logging system event: {e}")
        finally:
            cursor.close()
            conn.close()
    
    def get_user_count(self) -> int:
        """Get total user count"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("SELECT COUNT(*) FROM users")
            result = cursor.fetchone()
            return result[0] if result else 0
        except Exception as e:
            print(f"Error getting user count: {e}")
            return 0
        finally:
            cursor.close()
            conn.close()
    
    def get_job_count(self) -> int:
        """Get total job count"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("SELECT COUNT(*) FROM jobs WHERE is_active = true")
            result = cursor.fetchone()
            return result[0] if result else 0
        except Exception as e:
            print(f"Error getting job count: {e}")
            return 0
        finally:
            cursor.close()
            conn.close()
    
    def get_all_users(self) -> List[Dict]:
        """Get all users for admin dashboard"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT id, name, email, role, is_active, is_admin, created_at, last_login
                FROM users ORDER BY created_at DESC
            ''')
            
            columns = [desc[0] for desc in cursor.description]
            users = []
            for row in cursor.fetchall():
                user_dict = dict(zip(columns, row))
                # Convert datetime objects to strings for JSON serialization
                if user_dict.get('created_at'):
                    user_dict['created_at'] = user_dict['created_at'].isoformat() if hasattr(user_dict['created_at'], 'isoformat') else str(user_dict['created_at'])
                if user_dict.get('last_login'):
                    user_dict['last_login'] = user_dict['last_login'].isoformat() if hasattr(user_dict['last_login'], 'isoformat') else str(user_dict['last_login'])
                users.append(user_dict)
            
            return users
        except Exception as e:
            print(f"Error getting users: {e}")
            return []
        finally:
            cursor.close()
            conn.close()
    
    def get_all_jobs(self) -> List[Dict]:
        """Get all jobs for admin dashboard"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT id, title, company, location, salary, type, is_active, posted_date
                FROM jobs ORDER BY posted_date DESC
            ''')
            
            columns = [desc[0] for desc in cursor.description]
            jobs = []
            for row in cursor.fetchall():
                job_dict = dict(zip(columns, row))
                # Convert datetime objects to strings for JSON serialization
                if job_dict.get('posted_date'):
                    job_dict['posted_date'] = job_dict['posted_date'].isoformat() if hasattr(job_dict['posted_date'], 'isoformat') else str(job_dict['posted_date'])
                jobs.append(job_dict)
            
            return jobs
        except Exception as e:
            print(f"Error getting jobs: {e}")
            return []
        finally:
            cursor.close()
            conn.close()

# Global database manager instance
db_manager = None

def get_db_manager():
    """Get global database manager instance"""
    global db_manager
    if db_manager is None:
        db_manager = SupabaseManager()
    return db_manager

def init_database():
    """Initialize database - called by startup scripts"""
    try:
        manager = get_db_manager()
        print("Database initialized successfully")
        return True
    except Exception as e:
        print(f"Database initialization failed: {e}")
        return False

# For backward compatibility
db = get_db_manager()

