import os
import json
import pytest
import jwt
from app import create_app
from database import db, DBHelper
from config import Config

@pytest.fixture
def client():
    # Force sqlite local database for testing
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    os.environ['USE_FIREBASE'] = 'false'
    
    app = create_app()
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_auth_flows(client):
    # Test register
    reg_response = client.post('/api/register', json={
        'email': 'student@example.com',
        'password': 'password123',
        'name': 'Alice Tester'
    })
    assert reg_response.status_code == 201
    data = json.loads(reg_response.data)
    assert 'token' in data
    assert data['user']['email'] == 'student@example.com'
    
    # Test login
    login_response = client.post('/api/login', json={
        'email': 'student@example.com',
        'password': 'password123'
    })
    assert login_response.status_code == 200
    login_data = json.loads(login_response.data)
    assert 'token' in login_data
    
    # Test invalid login
    invalid_login = client.post('/api/login', json={
        'email': 'student@example.com',
        'password': 'wrongpassword'
    })
    assert invalid_login.status_code == 401

def test_material_crud(client):
    # Register user to get token
    reg_response = client.post('/api/register', json={
        'email': 'user@example.com',
        'password': 'password123',
        'name': 'Bob Tester'
    })
    token = json.loads(reg_response.data)['token']
    headers = {'Authorization': f'Bearer {token}'}

    # Upload material text
    upload_response = client.post('/api/upload', data={
        'title': 'Test Document',
        'text': 'This is a test document to check parsing, summarization, and query results.'
    }, headers=headers)
    assert upload_response.status_code == 201
    mat_id = json.loads(upload_response.data)['id']

    # Get materials
    get_response = client.get('/api/materials', headers=headers)
    assert get_response.status_code == 200
    materials = json.loads(get_response.data)
    assert len(materials) == 1
    assert materials[0]['title'] == 'Test Document'

    # Get specific material
    get_one = client.get(f'/api/material/{mat_id}', headers=headers)
    assert get_one.status_code == 200

    # Delete material
    del_response = client.delete(f'/api/material/{mat_id}', headers=headers)
    assert del_response.status_code == 200

def test_ai_fallback_methods(client):
    reg_response = client.post('/api/register', json={
        'email': 'ai@example.com',
        'password': 'password123',
        'name': 'AI Tester'
    })
    token = json.loads(reg_response.data)['token']
    headers = {'Authorization': f'Bearer {token}'}

    # Upload material
    upload = client.post('/api/upload', data={
        'title': 'Quantum Physics Notes',
        'text': 'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature.'
    }, headers=headers)
    mat_id = json.loads(upload.data)['id']

    # Test summary generation (will fallback to mock summary automatically)
    sum_res = client.post('/api/summary', json={'material_id': mat_id}, headers=headers)
    assert sum_res.status_code == 200
    sum_data = json.loads(sum_res.data)
    assert 'summary' in sum_data
    assert 'key_points' in sum_data
    assert 'definitions' in sum_data

    # Test flashcards generation
    fc_res = client.post('/api/flashcards', json={'material_id': mat_id}, headers=headers)
    assert fc_res.status_code == 200
    fc_data = json.loads(fc_res.data)
    assert len(fc_data) > 0
    assert 'question' in fc_data[0]
    
    # Test quiz generation
    qz_res = client.post('/api/quiz', json={
        'material_id': mat_id,
        'count': 5,
        'type': 'MCQ',
        'difficulty': 'easy'
    }, headers=headers)
    assert qz_res.status_code == 201
    qz_data = json.loads(qz_res.data)
    assert len(qz_data['questions']) == 5
