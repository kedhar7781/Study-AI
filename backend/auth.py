import datetime
import functools
import jwt
import bcrypt
from flask import request, jsonify
from config import Config
from database import DBHelper

def generate_token(user_id, role):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=Config.JWT_EXPIRATION_HOURS),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id,
        'role': role
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

def token_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Bearer token missing'}), 401

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            current_user = DBHelper.get_user_by_id(data['sub'])
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

def register_user_logic():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing email, password or name'}), 400

    existing_user = DBHelper.get_user_by_email(data['email'])
    if existing_user:
        return jsonify({'message': 'User with this email already exists'}), 400

    # Hash password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), salt).decode('utf-8')

    # Default role
    role = 'user'
    # First user registered can be admin to test admin dashboard
    all_users = DBHelper.admin_get_all_users()
    if not all_users:
        role = 'admin'

    user_data = {
        'email': data['email'],
        'password_hash': hashed_password,
        'name': data['name'],
        'role': role,
        'avatar': 'avatar1',
        'theme': 'dark'
    }

    try:
        new_user = DBHelper.create_user(user_data)
        token = generate_token(new_user['id'], new_user['role'])
        
        # Initialize empty analytics for the new user
        analytics_data = {
            'average_score': 0.0,
            'total_quizzes': 0,
            'study_hours': 0.0,
            'topics_covered': 0,
            'completion_percentage': 0,
            'weak_topics': [],
            'strong_topics': [],
            'weekly_progress': [0] * 7
        }
        DBHelper.create_or_update_analytics(new_user['id'], analytics_data)
        
        # Exclude password hash from response
        response_user = {k: v for k, v in new_user.items() if k != 'password_hash'}
        return jsonify({'token': token, 'user': response_user}), 201
    except Exception as e:
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

def login_user_logic():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400

    user = DBHelper.get_user_by_email(data['email'])
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401

    # Verify password hash
    if not bcrypt.checkpw(data['password'].encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'message': 'Invalid email or password'}), 401

    token = generate_token(user['id'], user['role'])
    response_user = {k: v for k, v in user.items() if k != 'password_hash'}
    return jsonify({'token': token, 'user': response_user}), 200

def logout_user_logic():
    # Since JWT is stateless, simple client-side clearance is fine.
    # Return success code.
    return jsonify({'message': 'Successfully logged out'}), 200
