#!/usr/bin/env python3
"""
HotGigs ATS Supabase Database Migration Runner
Executes database migration scripts safely with Supabase PostgreSQL
"""

import os
import sys
import psycopg2
import psycopg2.extras
from datetime import datetime
import logging
from dotenv import load_dotenv
import urllib.parse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('migration.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class SupabaseMigrator:
    def __init__(self):
        """Initialize the Supabase migrator with environment variables"""
        self.conn = None
        self.load_environment()
        self.connection_string = self.build_connection_string()
        
    def load_environment(self):
        """Load environment variables from backend .env files"""
        # Try to load from backend directory first
        backend_env_paths = [
            '/home/ubuntu/hotgigs-ai/backend/hotgigs-api/.env',
            '/home/ubuntu/hotgigs-ai/backend/hotgigs-api/.env.production',
            './backend/hotgigs-api/.env',
            './backend/hotgigs-api/.env.production',
            '../backend/hotgigs-api/.env',
            '../backend/hotgigs-api/.env.production'
        ]
        
        env_loaded = False
        for env_path in backend_env_paths:
            if os.path.exists(env_path):
                load_dotenv(env_path)
                logger.info(f"Loaded environment from: {env_path}")
                env_loaded = True
                break
        
        if not env_loaded:
            # Fallback to local .env
            load_dotenv('.env')
            logger.info("Loaded environment from local .env file")
    
    def build_connection_string(self):
        """Build PostgreSQL connection string from environment variables"""
        # Try Supabase-specific environment variables first
        supabase_host = os.getenv('SUPABASE_HOST')
        supabase_password = os.getenv('SUPABASE_PASSWORD')
        
        if supabase_host and supabase_password:
            # Supabase connection
            host = supabase_host
            port = os.getenv('SUPABASE_PORT', '5432')
            database = os.getenv('SUPABASE_DB', 'postgres')
            user = os.getenv('SUPABASE_USER', 'postgres')
            password = supabase_password
            
            logger.info(f"Using Supabase connection: {host}")
            
        else:
            # Check for DATABASE_URL (common in Supabase)
            database_url = os.getenv('DATABASE_URL')
            if database_url:
                logger.info("Using DATABASE_URL connection string")
                return database_url
            
            # Fallback to standard PostgreSQL environment variables
            host = os.getenv('DB_HOST', 'localhost')
            port = os.getenv('DB_PORT', '5432')
            database = os.getenv('DB_NAME', 'postgres')
            user = os.getenv('DB_USER', 'postgres')
            password = os.getenv('DB_PASSWORD', '')
            
            logger.info(f"Using standard PostgreSQL connection: {host}")
        
        # Build connection string
        connection_string = f"host={host} port={port} dbname={database} user={user} password={password}"
        
        # Add SSL mode for Supabase (required)
        if 'supabase.co' in host:
            connection_string += " sslmode=require"
            logger.info("Added SSL requirement for Supabase connection")
        
        return connection_string
        
    def connect(self):
        """Establish database connection"""
        try:
            self.conn = psycopg2.connect(self.connection_string)
            self.conn.autocommit = False
            
            # Test connection
            cursor = self.conn.cursor()
            cursor.execute("SELECT version();")
            version = cursor.fetchone()[0]
            logger.info(f"Connected to PostgreSQL: {version}")
            
            return True
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            logger.error(f"Connection string (masked): {self.mask_connection_string()}")
            return False
    
    def mask_connection_string(self):
        """Mask sensitive information in connection string for logging"""
        masked = self.connection_string
        if 'password=' in masked:
            parts = masked.split('password=')
            if len(parts) > 1:
                password_part = parts[1].split(' ')[0]
                masked = masked.replace(f'password={password_part}', 'password=***')
        return masked
    
    def disconnect(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            logger.info("Database connection closed")
    
    def create_migration_table(self):
        """Create migration tracking table if it doesn't exist"""
        try:
            cursor = self.conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    id SERIAL PRIMARY KEY,
                    version VARCHAR(50) UNIQUE NOT NULL,
                    name VARCHAR(200) NOT NULL,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    execution_time_ms INTEGER,
                    checksum VARCHAR(64),
                    success BOOLEAN DEFAULT TRUE
                );
                
                CREATE INDEX IF NOT EXISTS idx_schema_migrations_version 
                ON schema_migrations(version);
            """)
            self.conn.commit()
            logger.info("Migration tracking table ready")
            return True
        except Exception as e:
            logger.error(f"Failed to create migration table: {e}")
            self.conn.rollback()
            return False
    
    def is_migration_applied(self, version):
        """Check if a migration version has already been applied"""
        try:
            cursor = self.conn.cursor()
            cursor.execute(
                "SELECT success FROM schema_migrations WHERE version = %s",
                (version,)
            )
            result = cursor.fetchone()
            return result and result[0]  # Return True only if migration was successful
        except Exception as e:
            logger.error(f"Failed to check migration status: {e}")
            return False
    
    def calculate_checksum(self, content):
        """Calculate MD5 checksum of migration content"""
        import hashlib
        return hashlib.md5(content.encode('utf-8')).hexdigest()
    
    def execute_migration(self, migration_file, version, name):
        """Execute a migration file"""
        try:
            # Check if migration already applied
            if self.is_migration_applied(version):
                logger.info(f"Migration {version} already applied, skipping")
                return True
            
            # Read migration file
            with open(migration_file, 'r', encoding='utf-8') as f:
                migration_content = f.read()
            
            checksum = self.calculate_checksum(migration_content)
            start_time = datetime.now()
            
            logger.info(f"Executing migration {version}: {name}")
            
            # Execute migration in transaction
            cursor = self.conn.cursor()
            
            # Split migration into individual statements
            statements = [stmt.strip() for stmt in migration_content.split(';') if stmt.strip()]
            
            for i, statement in enumerate(statements):
                if statement.strip():
                    try:
                        cursor.execute(statement)
                        logger.debug(f"Executed statement {i+1}/{len(statements)}")
                    except Exception as e:
                        logger.error(f"Failed at statement {i+1}: {e}")
                        logger.error(f"Statement: {statement[:200]}...")
                        raise
            
            # Record migration success
            end_time = datetime.now()
            execution_time = int((end_time - start_time).total_seconds() * 1000)
            
            cursor.execute("""
                INSERT INTO schema_migrations (version, name, execution_time_ms, checksum, success)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (version) DO UPDATE SET
                    executed_at = CURRENT_TIMESTAMP,
                    execution_time_ms = EXCLUDED.execution_time_ms,
                    checksum = EXCLUDED.checksum,
                    success = EXCLUDED.success
            """, (version, name, execution_time, checksum, True))
            
            self.conn.commit()
            logger.info(f"Migration {version} completed successfully in {execution_time}ms")
            return True
            
        except Exception as e:
            logger.error(f"Migration {version} failed: {e}")
            self.conn.rollback()
            
            # Record migration failure
            try:
                cursor = self.conn.cursor()
                cursor.execute("""
                    INSERT INTO schema_migrations (version, name, success)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (version) DO UPDATE SET
                        executed_at = CURRENT_TIMESTAMP,
                        success = EXCLUDED.success
                """, (version, name, False))
                self.conn.commit()
            except:
                pass  # Don't fail if we can't record the failure
            
            return False
    
    def run_migrations(self, migrations_dir):
        """Run all pending migrations in order"""
        try:
            # Get list of migration files
            migration_files = []
            for filename in os.listdir(migrations_dir):
                if filename.endswith('.sql'):
                    migration_files.append(filename)
            
            migration_files.sort()  # Ensure proper order
            
            logger.info(f"Found {len(migration_files)} migration files")
            
            success_count = 0
            for filename in migration_files:
                # Extract version from filename (e.g., "001_initial_schema.sql" -> "001")
                version = filename.split('_')[0]
                name = filename.replace('.sql', '').replace(f'{version}_', '')
                
                migration_path = os.path.join(migrations_dir, filename)
                
                if self.execute_migration(migration_path, version, name):
                    success_count += 1
                else:
                    logger.error(f"Migration {version} failed, stopping execution")
                    break
            
            logger.info(f"Completed {success_count}/{len(migration_files)} migrations")
            return success_count == len(migration_files)
            
        except Exception as e:
            logger.error(f"Failed to run migrations: {e}")
            return False
    
    def get_migration_status(self):
        """Get status of all migrations"""
        try:
            cursor = self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            cursor.execute("""
                SELECT version, name, executed_at, execution_time_ms, success
                FROM schema_migrations
                ORDER BY version
            """)
            return cursor.fetchall()
        except Exception as e:
            logger.error(f"Failed to get migration status: {e}")
            return []
    
    def test_supabase_connection(self):
        """Test Supabase-specific features"""
        try:
            cursor = self.conn.cursor()
            
            # Test basic query
            cursor.execute("SELECT current_database(), current_user, version();")
            db_info = cursor.fetchone()
            logger.info(f"Database: {db_info[0]}, User: {db_info[1]}")
            
            # Test if we can create tables (permissions check)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS migration_test (
                    id SERIAL PRIMARY KEY,
                    test_column VARCHAR(50)
                );
                DROP TABLE migration_test;
            """)
            self.conn.commit()
            logger.info("✅ Database permissions verified")
            
            return True
        except Exception as e:
            logger.error(f"Supabase connection test failed: {e}")
            return False

def main():
    """Main migration runner"""
    logger.info("🚀 Starting HotGigs ATS Supabase Migration")
    
    # Initialize migrator
    migrator = SupabaseMigrator()
    
    try:
        # Connect to database
        if not migrator.connect():
            logger.error("❌ Failed to connect to Supabase database")
            logger.error("Please check your environment variables in backend/hotgigs-api/.env")
            sys.exit(1)
        
        # Test Supabase connection
        if not migrator.test_supabase_connection():
            logger.error("❌ Supabase connection test failed")
            sys.exit(1)
        
        # Create migration tracking table
        if not migrator.create_migration_table():
            logger.error("❌ Failed to create migration tracking table")
            sys.exit(1)
        
        # Run migrations
        migrations_dir = os.path.join(os.path.dirname(__file__), 'migrations')
        if not os.path.exists(migrations_dir):
            logger.error(f"❌ Migrations directory not found: {migrations_dir}")
            sys.exit(1)
        
        logger.info("📊 Starting database migration process")
        
        if migrator.run_migrations(migrations_dir):
            logger.info("🎉 All migrations completed successfully!")
            
            # Show migration status
            logger.info("\n📋 Migration Status:")
            logger.info("-" * 80)
            status = migrator.get_migration_status()
            for migration in status:
                status_icon = "✅" if migration['success'] else "❌"
                execution_time = migration['execution_time_ms'] or 0
                logger.info(f"{status_icon} {migration['version']}: {migration['name']} "
                          f"({execution_time}ms)")
            
            logger.info("\n🎯 Next Steps:")
            logger.info("1. Restart your backend server")
            logger.info("2. Test the new ATS features in your frontend")
            logger.info("3. Verify data integrity in Supabase dashboard")
            
        else:
            logger.error("❌ Some migrations failed!")
            logger.error("Check the logs above for details")
            sys.exit(1)
    
    except KeyboardInterrupt:
        logger.info("⏹️ Migration process interrupted by user")
        sys.exit(1)
    
    except Exception as e:
        logger.error(f"💥 Unexpected error: {e}")
        sys.exit(1)
    
    finally:
        migrator.disconnect()

if __name__ == "__main__":
    main()

