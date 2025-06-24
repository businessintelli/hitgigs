import os
import sys
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from supabase import create_client, Client

# Import blueprints
from src.routes.auth import auth_bp
from src.routes.users import users_bp
from src.routes.companies import companies_bp
from src.routes.jobs import jobs_bp
from src.routes.applications import applications_bp
from src.routes.candidates import candidates_bp
from src.routes.ai import ai_bp
from src.routes.documents import documents_bp
from src.routes.analytics import analytics_bp
from src.routes.notifications import notifications_bp
from src.routes.workflows import workflows_bp
from src.routes.bulk import bulk_bp

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
    
    # Caching configuration
    app.config['CACHE_TYPE'] = 'simple'  # Use simple in-memory cache for development
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # 5 minutes default cache timeout
    
    # Initialize extensions
    CORS(app, 
         origins=['http://localhost:3000', 'http://localhost:5174'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True)
    jwt = JWTManager(app)
    
    # Initialize cache
    cache = Cache(app)
    app.cache = cache
    
    # Initialize rate limiter
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["1000 per hour"],
        storage_uri="memory://",
        strategy="fixed-window"
    )
    app.limiter = limiter
    
    # Initialize Supabase client
    if app.config['SUPABASE_URL'] and app.config['SUPABASE_SERVICE_ROLE_KEY']:
        supabase: Client = create_client(
            app.config['SUPABASE_URL'], 
            app.config['SUPABASE_SERVICE_ROLE_KEY']
        )
        app.supabase = supabase
    else:
        print("Warning: Supabase configuration missing. Some features may not work.")
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(companies_bp, url_prefix='/api/companies')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(applications_bp, url_prefix='/api/applications')
    app.register_blueprint(candidates_bp, url_prefix='/api/candidates')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(workflows_bp, url_prefix='/api/workflows')
    app.register_blueprint(bulk_bp, url_prefix='/api/bulk')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized'}), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden'}), 403
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Authorization token is required'}), 401
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'HotGigs.ai API',
            'version': '1.0.0'
        })
    
    # API info endpoint
    @app.route('/api')
    def api_info():
        return jsonify({
            'name': 'HotGigs.ai API',
            'version': '1.0.0',
            'description': 'Enterprise-grade job portal with AI-powered features',
            'endpoints': {
                'auth': '/api/auth',
                'users': '/api/users',
                'companies': '/api/companies',
                'jobs': '/api/jobs',
                'applications': '/api/applications',
                'candidates': '/api/candidates',
                'ai': '/api/ai',
                'documents': '/api/documents',
                'analytics': '/api/analytics',
                'notifications': '/api/notifications'
            }
        })
    
    # Serve frontend static files
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return "Static folder not configured", 404

        if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
            return send_from_directory(static_folder_path, path)
        else:
            index_path = os.path.join(static_folder_path, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(static_folder_path, 'index.html')
            else:
                return jsonify({
                    'message': 'HotGigs.ai API is running',
                    'api_docs': '/api'
                })
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)

