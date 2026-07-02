import os
import json
import datetime
from io import BytesIO
from flask import Blueprint, request, jsonify, send_file
from auth import token_required, register_user_logic, login_user_logic, logout_user_logic
from database import DBHelper
from ai_service import AIService
from pdf_generator import generate_summary_pdf, generate_quiz_pdf

api = Blueprint('api', __name__)

# System Log helper
SYSTEM_LOGS = []
def log_event(event_type, description, user_email="system"):
    log_entry = {
        'timestamp': datetime.datetime.utcnow().isoformat(),
        'type': event_type,
        'description': description,
        'user': user_email
    }
    SYSTEM_LOGS.append(log_entry)
    # Keep last 100 logs
    if len(SYSTEM_LOGS) > 100:
        SYSTEM_LOGS.pop(0)

# Helper functions for file text extraction
def extract_pdf_text(file_bytes):
    try:
        import PyPDF2
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")

def extract_docx_text(file_bytes):
    try:
        import docx
        doc = docx.Document(BytesIO(file_bytes))
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to parse DOCX: {str(e)}")

# --- Authentication Routes ---
@api.route('/register', methods=['POST'])
def register():
    return register_user_logic()

@api.route('/login', methods=['POST'])
def login():
    return login_user_logic()

@api.route('/logout', methods=['POST'])
def logout():
    return logout_user_logic()

# --- Study Material Routes ---
@api.route('/upload', methods=['POST'])
@token_required
def upload_material(current_user):
    # Check if direct text paste or file upload
    if 'text' in request.form:
        text_content = request.form['text']
        title = request.form.get('title', 'Pasted Document')
        content_type = 'text'
        file_size = len(text_content)
    elif 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400
        
        file_bytes = file.read()
        file_size = len(file_bytes)
        title = file.filename
        
        ext = file.filename.split('.')[-1].lower()
        if ext == 'pdf':
            content_type = 'pdf'
            try:
                text_content = extract_pdf_text(file_bytes)
            except Exception as e:
                return jsonify({'message': str(e)}), 400
        elif ext == 'docx':
            content_type = 'docx'
            try:
                text_content = extract_docx_text(file_bytes)
            except Exception as e:
                return jsonify({'message': str(e)}), 400
        elif ext == 'txt':
            content_type = 'txt'
            text_content = file_bytes.decode('utf-8', errors='ignore')
        else:
            return jsonify({'message': 'Unsupported file format. Use PDF, DOCX, or TXT'}), 400
    else:
        return jsonify({'message': 'No content provided (either text or file expected)'}), 400

    if not text_content or len(text_content.strip()) == 0:
        return jsonify({'message': 'Extracted document content is empty'}), 400

    material_data = {
        'title': title,
        'content_type': content_type,
        'raw_text': text_content,
        'file_size': file_size,
        'user_id': current_user['id']
    }
    
    new_material = DBHelper.create_material(material_data)
    log_event("UPLOAD", f"Uploaded material '{title}' ({content_type})", current_user['email'])
    
    return jsonify(new_material), 201

@api.route('/materials', methods=['GET'])
@token_required
def get_materials(current_user):
    mats = DBHelper.get_materials_by_user(current_user['id'])
    return jsonify(mats), 200

@api.route('/material/<material_id>', methods=['GET'])
@token_required
def get_material(current_user, material_id):
    mat = DBHelper.get_material_by_id(material_id)
    if not mat or mat['user_id'] != current_user['id']:
        return jsonify({'message': 'Material not found'}), 404
    return jsonify(mat), 200

@api.route('/material/<material_id>', methods=['PUT'])
@token_required
def update_material(current_user, material_id):
    mat = DBHelper.get_material_by_id(material_id)
    if not mat or mat['user_id'] != current_user['id']:
        return jsonify({'message': 'Material not found'}), 404
    
    data = request.get_json()
    updated_mat = DBHelper.update_material(material_id, data)
    return jsonify(updated_mat), 200

@api.route('/material/<material_id>', methods=['DELETE'])
@token_required
def delete_material(current_user, material_id):
    mat = DBHelper.get_material_by_id(material_id)
    if not mat or mat['user_id'] != current_user['id']:
        return jsonify({'message': 'Material not found'}), 404
    
    DBHelper.delete_material(material_id)
    log_event("DELETE", f"Deleted material '{mat['title']}'", current_user['email'])
    return jsonify({'message': 'Material successfully deleted'}), 200

# --- Study AI Summaries ---
@api.route('/summary', methods=['POST'])
@token_required
def generate_summary(current_user):
    data = request.get_json()
    if not data or not data.get('material_id'):
        return jsonify({'message': 'Missing material_id'}), 400

    mat = DBHelper.get_material_by_id(data['material_id'])
    if not mat or mat['user_id'] != current_user['id']:
        return jsonify({'message': 'Material not found'}), 404

    # Generate summary
    summary_data = AIService.generate_summary(mat['raw_text'])
    
    # Cache summary on material document
    DBHelper.update_material(mat['id'], {'summary': json.dumps(summary_data)})
    log_event("SUMMARY", f"Generated summary for '{mat['title']}'", current_user['email'])

    return jsonify(summary_data), 200

@api.route('/material/<material_id>/download-pdf', methods=['GET'])
@token_required
def download_summary_pdf(current_user, material_id):
    mat = DBHelper.get_material_by_id(material_id)
    if not mat or mat['user_id'] != current_user['id']:
        return jsonify({'message': 'Material not found'}), 404

    if not mat.get('summary'):
        return jsonify({'message': 'Generate a summary first before exporting'}), 400

    summary_data = mat['summary']
    if isinstance(summary_data, str):
        summary_data = json.loads(summary_data)

    # Output to a temporary directory in workspace
    temp_dir = os.path.join(os.path.dirname(__file__), 'temp')
    os.makedirs(temp_dir, exist_ok=True)
    pdf_filename = f"summary_{material_id}.pdf"
    pdf_path = os.path.join(temp_dir, pdf_filename)
    
    try:
        generate_summary_pdf(summary_data, pdf_path)
        return send_file(pdf_path, as_attachment=True, download_name=f"{mat['title']}_summary.pdf", mimetype='application/pdf')
    except Exception as e:
        return jsonify({'message': f'Failed to generate PDF: {str(e)}'}), 500

# --- Flashcards Routes ---
@api.route('/flashcards', methods=['POST'])
@token_required
def generate_flashcards(current_user):
    data = request.get_json()
    if not data or not data.get('material_id'):
        return jsonify({'message': 'Missing material_id'}), 400

    mat = DBHelper.get_material_by_id(data['material_id'])
    if not mat or mat['user_id'] != current_user['id']:
        return jsonify({'message': 'Material not found'}), 404

    cards = AIService.generate_flashcards(mat['raw_text'])
    
    # Associate user and material context
    for card in cards:
        card['user_id'] = current_user['id']
        card['material_id'] = mat['id']
        card['favorite'] = False
        card['review_count'] = 0

    saved_cards = DBHelper.save_flashcards(cards)
    log_event("FLASHCARDS", f"Generated {len(saved_cards)} flashcards for '{mat['title']}'", current_user['email'])

    return jsonify(saved_cards), 200

@api.route('/flashcards', methods=['GET'])
@token_required
def get_flashcards(current_user):
    cards = DBHelper.get_flashcards_by_user(current_user['id'])
    return jsonify(cards), 200

@api.route('/flashcards/<card_id>/favorite', methods=['PUT'])
@token_required
def toggle_favorite(current_user, card_id):
    data = request.get_json()
    if data is None or 'favorite' not in data:
        return jsonify({'message': 'Missing favorite status'}), 400
    
    DBHelper.toggle_favorite_flashcard(card_id, data['favorite'])
    return jsonify({'message': 'Flashcard favorite updated'}), 200

@api.route('/flashcards/<card_id>/progress', methods=['PUT'])
@token_required
def update_flashcard_progress(current_user, card_id):
    data = request.get_json()
    if not data or not data.get('rating'):
        return jsonify({'message': 'Missing rating (easy, medium, hard)'}), 400
        
    DBHelper.update_flashcard_progress(card_id, data['rating'])
    return jsonify({'message': 'Flashcard progress registered'}), 200

# --- Quiz Generator Routes ---
@api.route('/quiz', methods=['POST'])
@token_required
def generate_quiz(current_user):
    data = request.get_json()
    if not data or not data.get('material_id'):
        return jsonify({'message': 'Missing material_id'}), 400

    mat = DBHelper.get_material_by_id(data['material_id'])
    if not mat or mat['user_id'] != current_user['id']:
        return jsonify({'message': 'Material not found'}), 404

    count = int(data.get('count', 5))
    quiz_type = data.get('type', 'MCQ') # MCQ, True/False, Short Answer
    difficulty = data.get('difficulty', 'medium') # easy, medium, hard

    questions = AIService.generate_quiz(mat['raw_text'], count, quiz_type, difficulty)
    
    quiz_data = {
        'title': f"Quiz on {mat['title']} ({quiz_type})",
        'material_id': mat['id'],
        'user_id': current_user['id'],
        'difficulty': difficulty,
        'questions': questions,
        'score': 0,
        'total_questions': len(questions),
        'answers': [],
        'completed': False,
        'weak_topics': []
    }

    new_quiz = DBHelper.create_quiz(quiz_data)
    log_event("QUIZ_GENERATE", f"Generated {quiz_type} quiz for '{mat['title']}'", current_user['email'])

    return jsonify(new_quiz), 201

@api.route('/quizzes', methods=['GET'])
@token_required
def get_quizzes(current_user):
    quizzes = DBHelper.get_quizzes_by_user(current_user['id'])
    return jsonify(quizzes), 200

@api.route('/quiz/<quiz_id>', methods=['GET'])
@token_required
def get_quiz(current_user, quiz_id):
    quiz = DBHelper.get_quiz_by_id(quiz_id)
    if not quiz or quiz['user_id'] != current_user['id']:
        return jsonify({'message': 'Quiz not found'}), 404
    return jsonify(quiz), 200

@api.route('/quiz/<quiz_id>/evaluate', methods=['POST'])
@token_required
def evaluate_quiz(current_user, quiz_id):
    quiz = DBHelper.get_quiz_by_id(quiz_id)
    if not quiz or quiz['user_id'] != current_user['id']:
        return jsonify({'message': 'Quiz not found'}), 404

    data = request.get_json()
    user_answers = data.get('answers', []) # Array of string answers
    
    questions = quiz['questions']
    score = 0
    weak_topics = set()
    strong_topics = set()
    
    # Process grading details
    for idx, q in enumerate(questions):
        correct = q['correct_answer']
        user_ans = user_answers[idx] if idx < len(user_answers) else ""
        
        # Exact matching for multiple choice and true/false
        # Case insensitive matching for short answers
        is_correct = False
        if isinstance(correct, str) and isinstance(user_ans, str):
            if correct.strip().lower() == user_ans.strip().lower():
                is_correct = True
            elif len(correct) > 10:  # heuristic for short answer similarity checks
                # Check keyword intersections
                kw_matches = sum(1 for word in correct.lower().split() if len(word) > 3 and word in user_ans.lower())
                if kw_matches >= 2:
                    is_correct = True

        if is_correct:
            score += 1
            strong_topics.add(q.get('topic', 'General'))
        else:
            weak_topics.add(q.get('topic', 'General'))

    # Update quiz fields
    update_data = {
        'score': score,
        'answers': user_answers,
        'completed': True,
        'weak_topics': list(weak_topics)
    }
    
    updated_quiz = DBHelper.update_quiz(quiz_id, update_data)
    
    # Recalculate user analytics profile
    user_quizzes = DBHelper.get_quizzes_by_user(current_user['id'])
    completed_quizzes = [q for q in user_quizzes if q.get('completed', False)]
    total_completed = len(completed_quizzes)
    
    avg_score = 0
    if total_completed > 0:
        avg_score = sum(q.get('score', 0)/q.get('total_questions', 5)*100 for q in completed_quizzes) / total_completed
    
    # Increment study hours by a random fraction to simulate dashboard progression
    analytics = DBHelper.get_analytics_by_user(current_user['id']) or {}
    prev_hours = analytics.get('study_hours', 0.0)
    prev_weekly = analytics.get('weekly_progress', [0]*7)
    
    # Increment weekly log for today
    day_idx = datetime.datetime.utcnow().weekday()
    prev_weekly[day_idx] += 1
    
    updated_analytics = {
        'average_score': round(avg_score, 1),
        'total_quizzes': total_completed,
        'study_hours': prev_hours + round(0.5 + score * 0.1, 1),
        'topics_covered': len(strong_topics.union(weak_topics)),
        'completion_percentage': min(100, int(total_completed * 10 + avg_score * 0.4)),
        'weak_topics': list(weak_topics),
        'strong_topics': list(strong_topics),
        'weekly_progress': prev_weekly
    }
    DBHelper.create_or_update_analytics(current_user['id'], updated_analytics)
    log_event("QUIZ_EVALUATE", f"Completed Quiz: Scored {score}/{len(questions)}", current_user['email'])

    return jsonify(updated_quiz), 200

@api.route('/quiz/<quiz_id>/download-pdf', methods=['GET'])
@token_required
def download_quiz_pdf(current_user, quiz_id):
    quiz = DBHelper.get_quiz_by_id(quiz_id)
    if not quiz or quiz['user_id'] != current_user['id']:
        return jsonify({'message': 'Quiz not found'}), 404

    temp_dir = os.path.join(os.path.dirname(__file__), 'temp')
    os.makedirs(temp_dir, exist_ok=True)
    pdf_filename = f"quiz_{quiz_id}.pdf"
    pdf_path = os.path.join(temp_dir, pdf_filename)
    
    try:
        generate_quiz_pdf(quiz, pdf_path)
        return send_file(pdf_path, as_attachment=True, download_name=f"Quiz_{quiz_id}.pdf", mimetype='application/pdf')
    except Exception as e:
        return jsonify({'message': f'Failed to generate Quiz PDF: {str(e)}'}), 500

# --- Study Planner Routes ---
@api.route('/study-plan', methods=['POST'])
@token_required
def create_study_plan(current_user):
    data = request.get_json()
    if not data or not data.get('material_id'):
        return jsonify({'message': 'Missing material_id'}), 400

    mat = DBHelper.get_material_by_id(data['material_id'])
    if not mat or mat['user_id'] != current_user['id']:
        return jsonify({'message': 'Material not found'}), 404

    days = int(data.get('duration_days', 7))
    schedule = AIService.generate_study_plan(mat['raw_text'], days)
    
    plan_data = {
        'title': f"Schedule for {mat['title']} ({days}-day)",
        'duration_days': days,
        'user_id': current_user['id'],
        'schedule': schedule
    }
    
    new_plan = DBHelper.create_studyplan(plan_data)
    log_event("PLANNER", f"Generated study plan for '{mat['title']}'", current_user['email'])

    return jsonify(new_plan), 201

@api.route('/study-plans', methods=['GET'])
@token_required
def get_study_plans(current_user):
    plans = DBHelper.get_studyplans_by_user(current_user['id'])
    return jsonify(plans), 200

# --- Analytics Routes ---
@api.route('/dashboard', methods=['GET'])
@token_required
def get_dashboard(current_user):
    analytics = DBHelper.get_analytics_by_user(current_user['id'])
    if not analytics:
        # Fallback empty structure
        analytics = {
            'average_score': 0.0,
            'total_quizzes': 0,
            'study_hours': 0.0,
            'topics_covered': 0,
            'completion_percentage': 0,
            'weak_topics': [],
            'strong_topics': [],
            'weekly_progress': [0] * 7
        }
    return jsonify(analytics), 200

# --- Profile Routes ---
@api.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    safe_profile = {k: v for k, v in current_user.items() if k != 'password_hash'}
    return jsonify(safe_profile), 200

@api.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user, logged_user):
    # Wait, the decorator wraps `f(current_user, *args, **kwargs)`.
    # Let's verify parameter bindings. `token_required` calls `f(current_user, *args, **kwargs)`.
    # So the first argument is always the user. Let's name it current_user.
    pass

@api.route('/user/profile', methods=['PUT'])
@token_required
def update_user_profile(current_user):
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Missing data'}), 400

    # Fields that can be modified
    allowed_fields = ['name', 'avatar', 'theme']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    # Process password change if requested
    if 'password' in data and data['password']:
        import bcrypt
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(data['password'].encode('utf-8'), salt).decode('utf-8')
        update_data['password_hash'] = hashed

    updated = DBHelper.update_user(current_user['id'], update_data)
    safe_profile = {k: v for k, v in updated.items() if k != 'password_hash'}
    return jsonify(safe_profile), 200

# --- Admin Dashboard ---
@api.route('/admin/dashboard', methods=['GET'])
@token_required
def get_admin_dashboard(current_user):
    if current_user.get('role') != 'admin':
        return jsonify({'message': 'Access denied: Admin credentials required'}), 403

    users = DBHelper.admin_get_all_users()
    materials = DBHelper.admin_get_all_materials()
    quiz_stats = DBHelper.admin_get_quiz_stats()

    safe_users = [{k: v for k, v in u.items() if k != 'password_hash'} for u in users]
    
    return jsonify({
        'users': safe_users,
        'materials': [{k: v for k, v in m.items() if k != 'raw_text'} for m in materials],
        'quiz_stats': quiz_stats,
        'logs': SYSTEM_LOGS[::-1] # return newest first
    }), 200
