import os
from dotenv import load_dotenv

# Load environment variables from root or backend directory .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('JWT_SECRET', 'studyai_super_secret_jwt_key_987654321')
    
    db_url = os.environ.get('DATABASE_URL', 'sqlite:///local_db.db')
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Groq API configuration
    GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
    GROQ_MODEL = 'llama-3.3-70b-versatile'
    
    # Firebase configuration
    USE_FIREBASE = os.environ.get('USE_FIREBASE', 'false').lower() == 'true'
    FIREBASE_PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID', '')
    FIREBASE_CLIENT_EMAIL = os.environ.get('FIREBASE_CLIENT_EMAIL', '')
    FIREBASE_PRIVATE_KEY = os.environ.get('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n')
    
    # JWT authentication settings
    JWT_EXPIRATION_HOURS = 24
