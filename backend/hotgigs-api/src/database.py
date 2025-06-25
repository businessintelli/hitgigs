import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Optional, List, Dict, Any
import hashlib
from datetime import datetime

# Enhanced debugging for .env file loading
def debug_env_loading():
    """Debug function to show detailed .env loading information"""
    print("🔍 DEBUG: Environment Loading Information")
    print("=" * 50)
    
    # Show current working directory
    current_dir = Path.cwd()
    print(f"📁 Current working directory: {current_dir.absolute()}")
    
    # Show script location
    script_dir = Path(__file__).parent
    print(f"📄 Script directory: {script_dir.absolute()}")
    
    # Calculate project root (3 levels up from backend/hotgigs-api/src/database.py)
    project_root = Path(__file__).parent.parent.parent
    print(f"🏠 Calculated project root: {project_root.absolute()}")
    
    # Check for .env files in various locations
    env_locations = [
        project_root / '.env',
        current_dir / '.env',
        script_dir / '.env',
        script_dir.parent / '.env',
        script_dir.parent.parent / '.env'
    ]
    
    print(f"\n🔍 Checking for .env files in these locations:")
    for i, env_path in enumerate(env_locations, 1):
        exists = env_path.exists()
        print(f"  {i}. {env_path.absolute()} - {'✅ EXISTS' if exists else '❌ NOT FOUND'}")
        if exists:
            try:
                with open(env_path, 'r') as f:
                    content = f.read()
                    has_supabase_url = 'SUPABASE_URL=' in content
                    has_supabase_key = 'SUPABASE_ANON_KEY=' in content
                    print(f"     📋 Contains SUPABASE_URL: {'✅' if has_supabase_url else '❌'}")
                    print(f"     📋 Contains SUPABASE_ANON_KEY: {'✅' if has_supabase_key else '❌'}")
            except Exception as e:
                print(f"     ⚠️ Error reading file: {e}")
    
    return project_root

# Load environment variables from project root with debugging
print("🚀 Starting HotGigs.ai Database Configuration")
project_root = debug_env_loading()
env_path = project_root / '.env'

print(f"\n📂 Attempting to load .env from: {env_path.absolute()}")
load_result = load_dotenv(env_path)
print(f"📋 load_dotenv() result: {'✅ SUCCESS' if load_result else '❌ FAILED'}")

# Check what environment variables are actually loaded
print(f"\n🔍 Environment Variables Check:")
supabase_url = os.getenv('SUPABASE_URL')
supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')
supabase_service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

print(f"  SUPABASE_URL: {'✅ FOUND' if supabase_url else '❌ NOT FOUND'}")
if supabase_url:
    print(f"    Value: {supabase_url[:50]}...")

print(f"  SUPABASE_ANON_KEY: {'✅ FOUND' if supabase_anon_key else '❌ NOT FOUND'}")
if supabase_anon_key:
    print(f"    Value: {supabase_anon_key[:50]}...")

print(f"  SUPABASE_SERVICE_ROLE_KEY: {'✅ FOUND' if supabase_service_role_key else '❌ NOT FOUND'}")
if supabase_service_role_key:
    print(f"    Value: {supabase_service_role_key[:50]}...")

print("=" * 50)

class SupabaseManager:
    def __init__(self):
        # Get Supabase credentials from project root .env
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')
        self.supabase_service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        print(f"\n🔧 SupabaseManager Initialization:")
        print(f"  Project root .env path: {env_path.absolute()}")
        print(f"  .env file exists: {'✅' if env_path.exists() else '❌'}")
        print(f"  SUPABASE_URL loaded: {'✅' if self.supabase_url else '❌'}")
        print(f"  SUPABASE_ANON_KEY loaded: {'✅' if self.supabase_anon_key else '❌'}")
        
        if not self.supabase_url or not self.supabase_anon_key:
            error_msg = f"""
❌ Missing Supabase configuration!

🔍 Debugging Information:
  • .env file path: {env_path.absolute()}
  • .env file exists: {'✅' if env_path.exists() else '❌'}
  • Current working directory: {Path.cwd().absolute()}
  • Script location: {Path(__file__).absolute()}
  
📋 Environment Variables Status:
  • SUPABASE_URL: {'✅ FOUND' if self.supabase_url else '❌ NOT FOUND'}
  • SUPABASE_ANON_KEY: {'✅ FOUND' if self.supabase_anon_key else '❌ NOT FOUND'}

🔧 To fix this issue:
  1. Ensure your .env file exists at: {env_path.absolute()}
  2. Verify it contains:
     SUPABASE_URL=https://nrpvyjwnqvxipjmdjlim.supabase.co
     SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  3. Check file permissions and encoding
"""
            raise ValueError(error_msg)
        
        print(f"✅ Supabase configuration loaded successfully!")
        print(f"  URL: {self.supabase_url}")
        print(f"  Key: {self.supabase_anon_key[:50]}...")
        
        # Create Supabase client
        try:
            self.supabase: Client = create_client(self.supabase_url, self.supabase_anon_key)
            print(f"✅ Supabase client created successfully!")
        except Exception as e:
            print(f"❌ Error creating Supabase client: {e}")
            raise
        
        # Initialize database tables
        self.init_database()
    
    def init_database(self):
        """Initialize database with required tables and sample data"""
        try:
            print(f"\n🗄️ Initializing database...")
            # Check if tables exist by trying to fetch from users table
            result = self.supabase.table('users').select('id').limit(1).execute()
            
            # If we can query users table, check if we need sample data
            if not result.data:
                print(f"📝 No users found, inserting sample data...")
                self.insert_sample_data()
            else:
                print(f"✅ Database already has data ({len(result.data)} users found)")
            
            print("✅ Database initialized successfully")
        except Exception as e:
            print(f"⚠️ Database initialization note: {e}")
            # Tables might not exist yet - this is normal for a new Supabase project
    
    def insert_sample_data(self):
        """Insert sample data for testing"""
        try:
            # Check if admin user exists
            admin_result = self.supabase.table('users').select('*').eq('email', 'admin@hotgigs.ai').execute()
            
            if not admin_result.data:
                # Create admin user
                admin_password = self.hash_password("admin123")
                admin_user = {
                    'name': 'Super Admin',
                    'email': 'admin@hotgigs.ai',
                    'password_hash': admin_password,
                    'role': 'admin',
                    'is_admin': True,
                    'is_active': True
                }
                self.supabase.table('users').insert(admin_user).execute()
                
                # Create test users
                test_users = [
                    {
                        'name': 'John Doe',
                        'email': 'john@example.com',
                        'password_hash': self.hash_password('user123'),
                        'role': 'user',
                        'is_active': True
                    },
                    {
                        'name': 'Jane Smith',
                        'email': 'jane@example.com',
                        'password_hash': self.hash_password('user123'),
                        'role': 'user',
                        'is_active': True
                    },
                    {
                        'name': 'Tech Corp',
                        'email': 'hr@techcorp.com',
                        'password_hash': self.hash_password('company123'),
                        'role': 'company',
                        'is_active': True
                    },
                    {
                        'name': 'Alice Recruiter',
                        'email': 'alice@recruiter.com',
                        'password_hash': self.hash_password('recruiter123'),
                        'role': 'recruiter',
                        'is_active': True
                    }
                ]
                
                for user in test_users:
                    self.supabase.table('users').insert(user).execute()
            
            # Check if companies exist
            companies_result = self.supabase.table('companies').select('*').limit(1).execute()
            
            if not companies_result.data:
                companies = [
                    {
                        'name': 'Tech Corp',
                        'email': 'hr@techcorp.com',
                        'description': 'Leading technology company',
                        'website': 'https://techcorp.com',
                        'is_active': True
                    },
                    {
                        'name': 'StartupXYZ',
                        'email': 'contact@startupxyz.com',
                        'description': 'Innovative startup',
                        'website': 'https://startupxyz.com',
                        'is_active': True
                    },
                    {
                        'name': 'Global Solutions',
                        'email': 'jobs@globalsolutions.com',
                        'description': 'Global consulting firm',
                        'website': 'https://globalsolutions.com',
                        'is_active': True
                    }
                ]
                
                for company in companies:
                    self.supabase.table('companies').insert(company).execute()
            
            # Check if jobs exist
            jobs_result = self.supabase.table('jobs').select('*').limit(1).execute()
            
            if not jobs_result.data:
                jobs = [
                    {
                        'title': 'Senior Software Engineer',
                        'description': 'We are looking for a senior software engineer with 5+ years of experience in Python, React, and cloud technologies.',
                        'company': 'Tech Corp',
                        'location': 'San Francisco, CA',
                        'salary': '$120,000 - $150,000',
                        'type': 'Full-time',
                        'is_active': True
                    },
                    {
                        'title': 'Product Manager',
                        'description': 'Join our product team to drive innovation and strategy.',
                        'company': 'StartupXYZ',
                        'location': 'Remote',
                        'salary': '$90,000 - $120,000',
                        'type': 'Full-time',
                        'is_active': True
                    },
                    {
                        'title': 'Frontend Developer',
                        'description': 'Build amazing user experiences with React and TypeScript.',
                        'company': 'Creative Agency',
                        'location': 'New York, NY',
                        'salary': '$80,000 - $100,000',
                        'type': 'Full-time',
                        'is_active': True
                    },
                    {
                        'title': 'Data Scientist',
                        'description': 'Analyze large datasets to drive business decisions.',
                        'company': 'Global Solutions',
                        'location': 'Boston, MA',
                        'salary': '$100,000 - $130,000',
                        'type': 'Full-time',
                        'is_active': True
                    }
                ]
                
                for job in jobs:
                    self.supabase.table('jobs').insert(job).execute()
                    
        except Exception as e:
            print(f"Sample data insertion note: {e}")
    
    def hash_password(self, password: str) -> str:
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify password against hash"""
        return self.hash_password(password) == password_hash
    
    def log_system_event(self, level: str, message: str, details: str = None, user_id: int = None):
        """Log system events"""
        try:
            log_entry = {
                'level': level,
                'message': message,
                'details': details,
                'user_id': user_id,
                'created_at': datetime.utcnow().isoformat()
            }
            self.supabase.table('system_logs').insert(log_entry).execute()
        except Exception as e:
            print(f"Error logging system event: {e}")
    
    def get_user_count(self) -> int:
        """Get total user count"""
        try:
            result = self.supabase.table('users').select('id', count='exact').execute()
            return result.count if result.count is not None else 0
        except Exception as e:
            print(f"Error getting user count: {e}")
            return 0
    
    def get_job_count(self) -> int:
        """Get total job count"""
        try:
            result = self.supabase.table('jobs').select('id', count='exact').eq('is_active', True).execute()
            return result.count if result.count is not None else 0
        except Exception as e:
            print(f"Error getting job count: {e}")
            return 0
    
    def get_all_users(self) -> List[Dict]:
        """Get all users for admin dashboard"""
        try:
            result = self.supabase.table('users').select('*').order('created_at', desc=True).execute()
            return result.data if result.data else []
        except Exception as e:
            print(f"Error getting users: {e}")
            return []
    
    def get_all_jobs(self) -> List[Dict]:
        """Get all jobs for admin dashboard"""
        try:
            result = self.supabase.table('jobs').select('*').order('created_at', desc=True).execute()
            return result.data if result.data else []
        except Exception as e:
            print(f"Error getting jobs: {e}")
            return []
    
    def get_all_companies(self) -> List[Dict]:
        """Get all companies for admin dashboard"""
        try:
            result = self.supabase.table('companies').select('*').order('created_at', desc=True).execute()
            return result.data if result.data else []
        except Exception as e:
            print(f"Error getting companies: {e}")
            return []
    
    def create_user(self, name: str, email: str, password: str, role: str = "user") -> Optional[Dict]:
        """Create a new user"""
        try:
            password_hash = self.hash_password(password)
            user_data = {
                'name': name,
                'email': email,
                'password_hash': password_hash,
                'role': role,
                'is_active': True
            }
            result = self.supabase.table('users').insert(user_data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict]:
        """Authenticate user with email and password"""
        try:
            result = self.supabase.table('users').select('*').eq('email', email).eq('is_active', True).execute()
            
            if result.data and len(result.data) > 0:
                user = result.data[0]
                if self.verify_password(password, user['password_hash']):
                    # Update last login
                    self.supabase.table('users').update({
                        'last_login': datetime.utcnow().isoformat()
                    }).eq('id', user['id']).execute()
                    
                    return user
            
            return None
        except Exception as e:
            print(f"Error authenticating user: {e}")
            return None

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

