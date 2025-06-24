import os
import sys
from datetime import datetime, timedelta

# Add the src directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify, request
from flask_cors import CORS

# Try to import optional dependencies
try:
    from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
    JWT_AVAILABLE = True
except ImportError:
    print("Warning: flask_jwt_extended not available. JWT authentication disabled.")
    JWT_AVAILABLE = False

try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
    LIMITER_AVAILABLE = True
except ImportError:
    print("Warning: flask_limiter not available. Rate limiting disabled.")
    LIMITER_AVAILABLE = False

# Try to import Supabase
try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    print("Warning: Supabase not available. Database features disabled.")
    SUPABASE_AVAILABLE = False

# Try to import route modules
ROUTES_AVAILABLE = False
try:
    from routes import auth, users, companies, jobs, applications
    from routes import candidates, ai, documents, analytics, notifications
    from routes import workflows, bulk
    ROUTES_AVAILABLE = True
    print("✅ All route modules loaded successfully")
except ImportError as e:
    print(f"Warning: Some routes not available: {e}")

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    
    # CORS configuration - Allow all origins for development
    CORS(app, 
         origins=['*'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
         allow_headers=['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
         supports_credentials=True)
    
    # Initialize JWT if available
    if JWT_AVAILABLE:
        jwt = JWTManager(app)
        
        @jwt.expired_token_loader
        def expired_token_callback(jwt_header, jwt_payload):
            return jsonify({'error': 'Token has expired'}), 401
        
        @jwt.invalid_token_loader
        def invalid_token_callback(error):
            return jsonify({'error': 'Invalid token'}), 401
        
        @jwt.unauthorized_loader
        def missing_token_callback(error):
            return jsonify({'error': 'Authorization token is required'}), 401
    
    # Initialize rate limiter if available
    if LIMITER_AVAILABLE:
        try:
            limiter = Limiter(
                key_func=get_remote_address,
                app=app,
                default_limits=["200 per day", "50 per hour"]
            )
        except Exception as e:
            print(f"Warning: Failed to initialize rate limiter: {e}")
            LIMITER_AVAILABLE = False
    
    # Initialize Supabase if available
    if SUPABASE_AVAILABLE:
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_KEY')
        
        if supabase_url and supabase_key:
            try:
                supabase: Client = create_client(supabase_url, supabase_key)
                app.supabase = supabase
                print("✅ Supabase client initialized successfully")
            except Exception as e:
                print(f"Warning: Failed to initialize Supabase: {e}")
        else:
            print("Warning: Supabase credentials not found in environment variables")
    
    # Register blueprints if routes are available
    if ROUTES_AVAILABLE:
        try:
            app.register_blueprint(auth.bp)
            app.register_blueprint(users.bp)
            app.register_blueprint(companies.bp)
            app.register_blueprint(jobs.bp)
            app.register_blueprint(applications.bp)
            app.register_blueprint(candidates.bp)
            app.register_blueprint(ai.bp)
            app.register_blueprint(documents.bp)
            app.register_blueprint(analytics.bp)
            app.register_blueprint(notifications.bp)
            app.register_blueprint(workflows.bp)
            app.register_blueprint(bulk.bp)
            print("✅ All API routes registered successfully")
        except Exception as e:
            print(f"Warning: Failed to register some routes: {e}")
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'HotGigs.ai API',
            'version': '1.0.0',
            'environment': os.getenv('ENVIRONMENT', 'development'),
            'cors': 'enabled',
            'jwt': 'available' if JWT_AVAILABLE else 'disabled',
            'rate_limiting': 'available' if LIMITER_AVAILABLE else 'disabled',
            'database': 'connected' if hasattr(app, 'supabase') else 'not configured',
            'routes': 'loaded' if ROUTES_AVAILABLE else 'basic only',
            'timestamp': datetime.utcnow().isoformat()
        })
    
    # API info endpoint
    @app.route('/api')
    def api_info():
        endpoints = {
            'health': '/api/health',
            'info': '/api'
        }
        
        if ROUTES_AVAILABLE:
            endpoints.update({
                'auth': '/api/auth',
                'users': '/api/users',
                'companies': '/api/companies',
                'jobs': '/api/jobs',
                'applications': '/api/applications',
                'candidates': '/api/candidates',
                'ai': '/api/ai',
                'documents': '/api/documents',
                'analytics': '/api/analytics',
                'notifications': '/api/notifications',
                'workflows': '/api/workflows',
                'bulk': '/api/bulk'
            })
        
        return jsonify({
            'name': 'HotGigs.ai API',
            'version': '1.0.0',
            'description': 'Enterprise-grade job portal with AI-powered features',
            'environment': os.getenv('ENVIRONMENT', 'development'),
            'cors_enabled': True,
            'features': {
                'jwt_auth': JWT_AVAILABLE,
                'rate_limiting': LIMITER_AVAILABLE,
                'database': SUPABASE_AVAILABLE,
                'full_routes': ROUTES_AVAILABLE
            },
            'endpoints': endpoints
        })
    
    # Root endpoint
    @app.route('/')
    def root():
        return jsonify({
            'message': 'HotGigs.ai API is running',
            'version': '1.0.0',
            'status': 'healthy',
            'api_docs': '/api',
            'health_check': '/api/health',
            'cors_enabled': True,
            'timestamp': datetime.utcnow().isoformat()
        })
    
    return app

# Create app instance for production deployment
app = create_app()

if __name__ == '__main__':
    # Default to port 8000 for development, allow override with PORT env var
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    environment = os.getenv('ENVIRONMENT', 'development')
    
    print(f"🚀 Starting HotGigs.ai Backend API")
    print(f"🌐 Host: 0.0.0.0")
    print(f"🔌 Port: {port}")
    print(f"🔧 Debug mode: {debug}")
    print(f"🏷️  Environment: {environment}")
    print(f"🌍 CORS: Enabled for all origins")
    print(f"📊 Health check: http://localhost:{port}/api/health")
    print(f"📋 API info: http://localhost:{port}/api")
    
    app.run(host='0.0.0.0', port=port, debug=debug)

