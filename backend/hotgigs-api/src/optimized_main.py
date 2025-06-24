import os
import sys
from datetime import timedelta
from dotenv import load_dotenv
import logging
import time
from flask import Flask, send_from_directory, jsonify, request, g
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from supabase import create_client, Client

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Import blueprints - using optimized versions where available
from src.routes.auth import auth_bp
from src.routes.users import users_bp
from src.routes.companies import companies_bp
from src.routes.optimized_jobs import jobs_bp  # Using optimized jobs route
from src.routes.applications import applications_bp
from src.routes.documents import documents_bp
from src.routes.analytics import analytics_bp
from src.routes.ai import ai_bp
from src.routes.candidates import candidates_bp
from src.routes.notifications import notifications_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('flask.log'),
        logging.StreamHandler()
    ]
)

def create_app():
    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    # Supabase configuration
    app.config['SUPABASE_URL'] = os.getenv('SUPABASE_URL')
    app.config['SUPABASE_ANON_KEY'] = os.getenv('SUPABASE_ANON_KEY')
    app.config['SUPABASE_SERVICE_ROLE_KEY'] = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    # OpenAI configuration
    app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
    
    # Enhanced caching configuration
    app.config['CACHE_TYPE'] = 'simple'
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # 5 minutes
    
    # Performance monitoring configuration
    app.config['PERFORMANCE_MONITORING'] = True
    app.config['SLOW_REQUEST_THRESHOLD'] = 1.0  # 1 second
    
    # Initialize extensions
    jwt = JWTManager(app)
    cache = Cache(app)
    
    # Enhanced CORS configuration for better performance
    CORS(app, 
         origins=['http://localhost:3000', 'http://localhost:5173', 'https://*.vercel.app'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True,
         max_age=3600)  # Cache preflight requests for 1 hour
    
    # Rate limiting with performance considerations
    limiter = Limiter(
        key_func=get_remote_address,
        app=app,
        default_limits=["1000 per hour", "100 per minute"],
        storage_uri="memory://",
        strategy="fixed-window"
    )
    
    # Performance monitoring middleware
    @app.before_request
    def before_request():
        g.start_time = time.time()
        g.request_id = f"{int(time.time())}-{id(request)}"
        
        if app.config.get('PERFORMANCE_MONITORING'):
            app.logger.debug(f"Request {g.request_id} started: {request.method} {request.path}")
    
    @app.after_request
    def after_request(response):
        if hasattr(g, 'start_time'):
            duration = time.time() - g.start_time
            
            # Log slow requests
            if duration > app.config.get('SLOW_REQUEST_THRESHOLD', 1.0):
                app.logger.warning(f"Slow request {g.request_id}: {request.method} {request.path} took {duration:.3f}s")
            else:
                app.logger.debug(f"Request {g.request_id} completed in {duration:.3f}s")
            
            # Add performance headers
            response.headers['X-Response-Time'] = f"{duration:.3f}s"
            response.headers['X-Request-ID'] = getattr(g, 'request_id', 'unknown')
        
        # Security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        
        return response
    
    # Initialize Supabase client
    try:
        supabase_url = app.config['SUPABASE_URL']
        supabase_key = app.config['SUPABASE_SERVICE_ROLE_KEY']
        
        if supabase_url and supabase_key:
            supabase: Client = create_client(supabase_url, supabase_key)
            app.supabase = supabase
            app.logger.info("Supabase client initialized successfully")
        else:
            app.logger.warning("Supabase configuration missing")
    except Exception as e:
        app.logger.error(f"Failed to initialize Supabase client: {str(e)}")
    
    # Register blueprints with URL prefixes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(companies_bp, url_prefix='/api/companies')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(applications_bp, url_prefix='/api/applications')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(candidates_bp, url_prefix='/api/candidates')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    
    # Health check endpoint with enhanced monitoring
    @app.route('/api/health')
    @limiter.exempt
    def health_check():
        """Enhanced health check with performance metrics"""
        start_time = time.time()
        
        try:
            # Test database connection
            if hasattr(app, 'supabase'):
                test_query = app.supabase.table('users').select('id').limit(1).execute()
                db_status = 'connected'
                db_response_time = time.time() - start_time
            else:
                db_status = 'not_configured'
                db_response_time = 0
            
            # Get system metrics
            import psutil
            system_metrics = {
                'cpu_percent': psutil.cpu_percent(interval=0.1),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_percent': psutil.disk_usage('/').percent
            }
            
            health_data = {
                'status': 'healthy',
                'timestamp': time.time(),
                'version': '2.0.0-optimized',
                'environment': os.getenv('ENVIRONMENT', 'development'),
                'database': {
                    'status': db_status,
                    'response_time_ms': round(db_response_time * 1000, 2)
                },
                'system': system_metrics,
                'performance': {
                    'total_response_time_ms': round((time.time() - start_time) * 1000, 2)
                }
            }
            
            return jsonify(health_data), 200
            
        except Exception as e:
            app.logger.error(f"Health check failed: {str(e)}")
            return jsonify({
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': time.time()
            }), 500
    
    # Performance metrics endpoint
    @app.route('/api/performance')
    @limiter.limit("10 per minute")
    def performance_metrics():
        """Get application performance metrics"""
        try:
            # Import the optimized database service
            from src.models.optimized_database import get_database_service
            
            db_service = get_database_service()
            performance_stats = db_service.get_performance_stats()
            
            return jsonify({
                'database_performance': performance_stats,
                'timestamp': time.time(),
                'status': 'success'
            }), 200
            
        except Exception as e:
            app.logger.error(f"Failed to get performance metrics: {str(e)}")
            return jsonify({
                'error': 'Failed to retrieve performance metrics',
                'status': 'error'
            }), 500
    
    # Cache management endpoints
    @app.route('/api/cache/clear', methods=['POST'])
    @limiter.limit("5 per minute")
    def clear_cache():
        """Clear application cache"""
        try:
            cache.clear()
            
            # Also clear database service cache
            from src.models.optimized_database import get_database_service
            db_service = get_database_service()
            db_service.clear_cache()
            
            return jsonify({
                'message': 'Cache cleared successfully',
                'status': 'success'
            }), 200
            
        except Exception as e:
            app.logger.error(f"Failed to clear cache: {str(e)}")
            return jsonify({
                'error': 'Failed to clear cache',
                'status': 'error'
            }), 500
    
    @app.route('/api/cache/refresh-materialized-views', methods=['POST'])
    @limiter.limit("2 per minute")
    def refresh_materialized_views():
        """Refresh database materialized views"""
        try:
            from src.models.optimized_database import get_database_service
            
            db_service = get_database_service()
            db_service.refresh_materialized_view()
            
            return jsonify({
                'message': 'Materialized views refreshed successfully',
                'status': 'success'
            }), 200
            
        except Exception as e:
            app.logger.error(f"Failed to refresh materialized views: {str(e)}")
            return jsonify({
                'error': 'Failed to refresh materialized views',
                'status': 'error'
            }), 500
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not found',
            'message': 'The requested resource was not found',
            'status': 'error'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Internal server error: {str(error)}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred',
            'status': 'error'
        }), 500
    
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({
            'error': 'Rate limit exceeded',
            'message': 'Too many requests. Please try again later.',
            'status': 'error'
        }), 429
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'error': 'Token expired',
            'message': 'The JWT token has expired',
            'status': 'error'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'error': 'Invalid token',
            'message': 'The JWT token is invalid',
            'status': 'error'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'error': 'Authorization required',
            'message': 'JWT token is required',
            'status': 'error'
        }), 401
    
    # Serve static files (for frontend integration)
    @app.route('/')
    def serve_frontend():
        return send_from_directory(app.static_folder, 'index.html')
    
    @app.route('/<path:path>')
    def serve_static(path):
        if os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    
    app.logger.info("HotGigs.ai API application created successfully with performance optimizations")
    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('ENVIRONMENT', 'development') == 'development'
    
    app.logger.info(f"Starting HotGigs.ai API server on port {port} (debug={debug})")
    app.run(host='0.0.0.0', port=port, debug=debug)

