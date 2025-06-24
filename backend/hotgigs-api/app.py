#!/usr/bin/env python3
"""
HotGigs.ai Backend API - Production Entry Point
Enterprise-grade job portal with AI-powered features
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.main import create_app

# Create the Flask application
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting HotGigs.ai Backend API")
    print(f"🌐 Port: {port}")
    print(f"🔧 Debug mode: {debug}")
    print(f"🔒 CORS enabled for production")
    
    app.run(host='0.0.0.0', port=port, debug=debug)

