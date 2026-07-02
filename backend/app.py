import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from config import Config
from database import db
from routes import api

def create_app():
    # Setup static folder configuration for production distribution
    static_folder_path = os.path.join(os.path.dirname(__file__), 'static')
    app = Flask(__name__, static_folder=static_folder_path, static_url_path='/')
    
    app.config.from_object(Config)
    
    # Configure CORS - allow React dev server at http://localhost:5173
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize SQL database
    db.init_app(app)
    
    # Import models to register metadata with SQLAlchemy before create_all
    from models import User, Material, Flashcard, Quiz, StudyPlan, Analytics
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    # Serve index.html or bundle assets in production static serve
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            # Check if index.html exists, if not serve landing warning
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(app.static_folder, 'index.html')
            else:
                return jsonify({
                    'message': 'StudyAI Flask Backend running successfully. Frontend bundle not detected in static/ yet.'
                }), 200

    # Global Error Handlers
    @app.errorhandler(404)
    def page_not_found(e):
        return jsonify({'message': 'Endpoint not found'}), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({'message': 'Internal Server Error', 'error': str(e)}), 500

    # Create tables automatically inside context
    with app.app_context():
        try:
            db.create_all()
            print("SQLite tables successfully checked/created.")
        except Exception as e:
            print(f"Error creating database tables: {str(e)}")
            
    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
