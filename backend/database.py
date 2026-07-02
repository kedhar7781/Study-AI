import os
import json
import uuid
import datetime
from flask_sqlalchemy import SQLAlchemy
from config import Config

# Initialize SQLAlchemy
db = SQLAlchemy()

# Initialize Firebase if enabled
firebase_db = None
firebase_initialized = False

if Config.USE_FIREBASE:
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore
        
        # Check if already initialized to prevent errors
        if not firebase_admin._apps:
            if Config.FIREBASE_PROJECT_ID and Config.FIREBASE_CLIENT_EMAIL and Config.FIREBASE_PRIVATE_KEY:
                cred = credentials.Certificate({
                    "type": "service_account",
                    "project_id": Config.FIREBASE_PROJECT_ID,
                    "private_key_id": "", # Not strictly required by credentials.Certificate
                    "private_key": Config.FIREBASE_PRIVATE_KEY,
                    "client_email": Config.FIREBASE_CLIENT_EMAIL,
                    "token_uri": "https://oauth2.googleapis.com/token",
                })
                firebase_admin.initialize_app(cred)
                firebase_db = firestore.client()
                firebase_initialized = True
                print("Firebase Firestore successfully initialized.")
            else:
                print("Firebase keys missing in environment. Falling back to SQLAlchemy SQLite.")
    except Exception as e:
        print(f"Error initializing Firebase: {str(e)}. Falling back to SQLite.")

# Database helper abstraction
class DBHelper:
    @staticmethod
    def is_firebase():
        return Config.USE_FIREBASE and firebase_initialized and firebase_db is not None

    @staticmethod
    def get_db():
        if DBHelper.is_firebase():
            return firebase_db
        return None

    # Users collection helper
    @staticmethod
    def create_user(user_data):
        from models import User
        if DBHelper.is_firebase():
            user_id = str(uuid.uuid4())
            user_data['id'] = user_id
            user_data['created_at'] = datetime.datetime.utcnow().isoformat()
            # Save to firestore
            firebase_db.collection('users').document(user_id).set(user_data)
            return user_data
        else:
            new_user = User(
                email=user_data['email'],
                password_hash=user_data['password_hash'],
                name=user_data.get('name', ''),
                role=user_data.get('role', 'user'),
                avatar=user_data.get('avatar', 'default'),
                theme=user_data.get('theme', 'dark'),
                created_at=datetime.datetime.utcnow()
            )
            db.session.add(new_user)
            db.session.commit()
            return new_user.to_dict()

    @staticmethod
    def get_user_by_email(email):
        from models import User
        if DBHelper.is_firebase():
            docs = firebase_db.collection('users').where('email', '==', email).limit(1).get()
            for doc in docs:
                return doc.to_dict()
            return None
        else:
            user = User.query.filter_by(email=email).first()
            return user.to_dict() if user else None

    @staticmethod
    def get_user_by_id(user_id):
        from models import User
        if DBHelper.is_firebase():
            doc = firebase_db.collection('users').document(user_id).get()
            return doc.to_dict() if doc.exists else None
        else:
            user = User.query.get(user_id)
            return user.to_dict() if user else None

    @staticmethod
    def update_user(user_id, update_data):
        from models import User
        if DBHelper.is_firebase():
            firebase_db.collection('users').document(user_id).update(update_data)
            updated_doc = firebase_db.collection('users').document(user_id).get()
            return updated_doc.to_dict()
        else:
            user = User.query.get(user_id)
            if user:
                for k, v in update_data.items():
                    if hasattr(user, k):
                        setattr(user, k, v)
                db.session.commit()
                return user.to_dict()
            return None

    # Materials collection helper
    @staticmethod
    def create_material(material_data):
        from models import Material
        if DBHelper.is_firebase():
            mat_id = str(uuid.uuid4())
            material_data['id'] = mat_id
            material_data['created_at'] = datetime.datetime.utcnow().isoformat()
            firebase_db.collection('materials').document(mat_id).set(material_data)
            return material_data
        else:
            new_material = Material(
                id=str(uuid.uuid4()),
                title=material_data['title'],
                content_type=material_data['content_type'],
                raw_text=material_data['raw_text'],
                file_size=material_data.get('file_size', 0),
                user_id=material_data['user_id'],
                created_at=datetime.datetime.utcnow()
            )
            db.session.add(new_material)
            db.session.commit()
            return new_material.to_dict()

    @staticmethod
    def get_materials_by_user(user_id):
        from models import Material
        if DBHelper.is_firebase():
            docs = firebase_db.collection('materials').where('user_id', '==', user_id).get()
            return [doc.to_dict() for doc in docs]
        else:
            mats = Material.query.filter_by(user_id=user_id).order_by(Material.created_at.desc()).all()
            return [m.to_dict() for m in mats]

    @staticmethod
    def get_material_by_id(material_id):
        from models import Material
        if DBHelper.is_firebase():
            doc = firebase_db.collection('materials').document(material_id).get()
            return doc.to_dict() if doc.exists else None
        else:
            mat = Material.query.get(material_id)
            return mat.to_dict() if mat else None

    @staticmethod
    def delete_material(material_id):
        from models import Material
        if DBHelper.is_firebase():
            firebase_db.collection('materials').document(material_id).delete()
            # Also clean up related items in other collections
            flashcards = firebase_db.collection('flashcards').where('material_id', '==', material_id).get()
            for fc in flashcards:
                fc.reference.delete()
            quizzes = firebase_db.collection('quizzes').where('material_id', '==', material_id).get()
            for qz in quizzes:
                qz.reference.delete()
            return True
        else:
            mat = Material.query.get(material_id)
            if mat:
                db.session.delete(mat)
                db.session.commit()
                return True
            return False

    @staticmethod
    def update_material(material_id, material_data):
        from models import Material
        if DBHelper.is_firebase():
            firebase_db.collection('materials').document(material_id).update(material_data)
            updated_doc = firebase_db.collection('materials').document(material_id).get()
            return updated_doc.to_dict()
        else:
            mat = Material.query.get(material_id)
            if mat:
                for k, v in material_data.items():
                    if hasattr(mat, k):
                        setattr(mat, k, v)
                db.session.commit()
                return mat.to_dict()
            return None

    # Flashcards collection helper
    @staticmethod
    def save_flashcards(flashcard_list):
        from models import Flashcard
        saved_cards = []
        if DBHelper.is_firebase():
            for card in flashcard_list:
                card_id = str(uuid.uuid4())
                card['id'] = card_id
                card['created_at'] = datetime.datetime.utcnow().isoformat()
                firebase_db.collection('flashcards').document(card_id).set(card)
                saved_cards.append(card)
        else:
            for card in flashcard_list:
                new_card = Flashcard(
                    id=str(uuid.uuid4()),
                    material_id=card['material_id'],
                    user_id=card['user_id'],
                    question=card['question'],
                    answer=card['answer'],
                    difficulty=card.get('difficulty', 'medium'),
                    favorite=card.get('favorite', False),
                    review_count=card.get('review_count', 0),
                    created_at=datetime.datetime.utcnow()
                )
                db.session.add(new_card)
                saved_cards.append(new_card)
            db.session.commit()
            saved_cards = [c.to_dict() for c in saved_cards]
        return saved_cards

    @staticmethod
    def get_flashcards_by_user(user_id):
        from models import Flashcard
        if DBHelper.is_firebase():
            docs = firebase_db.collection('flashcards').where('user_id', '==', user_id).get()
            return [doc.to_dict() for doc in docs]
        else:
            cards = Flashcard.query.filter_by(user_id=user_id).all()
            return [c.to_dict() for c in cards]

    @staticmethod
    def toggle_favorite_flashcard(card_id, favorite_status):
        from models import Flashcard
        if DBHelper.is_firebase():
            firebase_db.collection('flashcards').document(card_id).update({'favorite': favorite_status})
            return True
        else:
            card = Flashcard.query.get(card_id)
            if card:
                card.favorite = favorite_status
                db.session.commit()
                return True
            return False

    @staticmethod
    def update_flashcard_progress(card_id, rating):
        from models import Flashcard
        if DBHelper.is_firebase():
            doc_ref = firebase_db.collection('flashcards').document(card_id)
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                cnt = data.get('review_count', 0) + 1
                doc_ref.update({
                    'review_count': cnt,
                    'difficulty': rating
                })
                return True
            return False
        else:
            card = Flashcard.query.get(card_id)
            if card:
                card.review_count += 1
                card.difficulty = rating
                db.session.commit()
                return True
            return False

    # Quiz collection helper
    @staticmethod
    def create_quiz(quiz_data):
        from models import Quiz
        if DBHelper.is_firebase():
            quiz_id = str(uuid.uuid4())
            quiz_data['id'] = quiz_id
            quiz_data['created_at'] = datetime.datetime.utcnow().isoformat()
            firebase_db.collection('quizzes').document(quiz_id).set(quiz_data)
            return quiz_data
        else:
            new_quiz = Quiz(
                id=str(uuid.uuid4()),
                title=quiz_data['title'],
                material_id=quiz_data.get('material_id', ''),
                user_id=quiz_data['user_id'],
                difficulty=quiz_data['difficulty'],
                questions=json.dumps(quiz_data['questions']),
                score=quiz_data.get('score', 0),
                total_questions=quiz_data.get('total_questions', 0),
                answers=json.dumps(quiz_data.get('answers', [])),
                completed=quiz_data.get('completed', False),
                weak_topics=json.dumps(quiz_data.get('weak_topics', [])),
                created_at=datetime.datetime.utcnow()
            )
            db.session.add(new_quiz)
            db.session.commit()
            return new_quiz.to_dict()

    @staticmethod
    def get_quizzes_by_user(user_id):
        from models import Quiz
        if DBHelper.is_firebase():
            docs = firebase_db.collection('quizzes').where('user_id', '==', user_id).get()
            return [doc.to_dict() for doc in docs]
        else:
            quizzes = Quiz.query.filter_by(user_id=user_id).order_by(Quiz.created_at.desc()).all()
            return [q.to_dict() for q in quizzes]

    @staticmethod
    def get_quiz_by_id(quiz_id):
        from models import Quiz
        if DBHelper.is_firebase():
            doc = firebase_db.collection('quizzes').document(quiz_id).get()
            return doc.to_dict() if doc.exists else None
        else:
            quiz = Quiz.query.get(quiz_id)
            return quiz.to_dict() if quiz else None

    @staticmethod
    def update_quiz(quiz_id, quiz_data):
        from models import Quiz
        if DBHelper.is_firebase():
            firebase_db.collection('quizzes').document(quiz_id).update(quiz_data)
            updated_doc = firebase_db.collection('quizzes').document(quiz_id).get()
            return updated_doc.to_dict()
        else:
            quiz = Quiz.query.get(quiz_id)
            if quiz:
                for k, v in quiz_data.items():
                    if k in ['questions', 'answers', 'weak_topics']:
                        setattr(quiz, k, json.dumps(v))
                    elif hasattr(quiz, k):
                        setattr(quiz, k, v)
                db.session.commit()
                return quiz.to_dict()
            return None

    # Study Plans helper
    @staticmethod
    def create_studyplan(plan_data):
        from models import StudyPlan
        if DBHelper.is_firebase():
            plan_id = str(uuid.uuid4())
            plan_data['id'] = plan_id
            plan_data['created_at'] = datetime.datetime.utcnow().isoformat()
            firebase_db.collection('studyplans').document(plan_id).set(plan_data)
            return plan_data
        else:
            new_plan = StudyPlan(
                id=str(uuid.uuid4()),
                title=plan_data['title'],
                duration_days=plan_data['duration_days'],
                user_id=plan_data['user_id'],
                schedule=json.dumps(plan_data['schedule']),
                created_at=datetime.datetime.utcnow()
            )
            db.session.add(new_plan)
            db.session.commit()
            return new_plan.to_dict()

    @staticmethod
    def get_studyplans_by_user(user_id):
        from models import StudyPlan
        if DBHelper.is_firebase():
            docs = firebase_db.collection('studyplans').where('user_id', '==', user_id).get()
            return [doc.to_dict() for doc in docs]
        else:
            plans = StudyPlan.query.filter_by(user_id=user_id).order_by(StudyPlan.created_at.desc()).all()
            return [p.to_dict() for p in plans]

    # Analytics helper
    @staticmethod
    def create_or_update_analytics(user_id, analytics_data):
        from models import Analytics
        if DBHelper.is_firebase():
            doc_ref = firebase_db.collection('analytics').document(user_id)
            doc = doc_ref.get()
            analytics_data['updated_at'] = datetime.datetime.utcnow().isoformat()
            if doc.exists:
                doc_ref.update(analytics_data)
                return doc_ref.get().to_dict()
            else:
                analytics_data['user_id'] = user_id
                doc_ref.set(analytics_data)
                return analytics_data
        else:
            stats = Analytics.query.filter_by(user_id=user_id).first()
            if not stats:
                stats = Analytics(
                    user_id=user_id,
                    average_score=analytics_data.get('average_score', 0.0),
                    total_quizzes=analytics_data.get('total_quizzes', 0),
                    study_hours=analytics_data.get('study_hours', 0.0),
                    topics_covered=analytics_data.get('topics_covered', 0),
                    completion_percentage=analytics_data.get('completion_percentage', 0),
                    weak_topics=json.dumps(analytics_data.get('weak_topics', [])),
                    strong_topics=json.dumps(analytics_data.get('strong_topics', [])),
                    weekly_progress=json.dumps(analytics_data.get('weekly_progress', [0]*7)),
                    updated_at=datetime.datetime.utcnow()
                )
                db.session.add(stats)
            else:
                for k, v in analytics_data.items():
                    if k in ['weak_topics', 'strong_topics', 'weekly_progress']:
                        setattr(stats, k, json.dumps(v))
                    elif hasattr(stats, k):
                        setattr(stats, k, v)
                stats.updated_at = datetime.datetime.utcnow()
            db.session.commit()
            return stats.to_dict()

    @staticmethod
    def get_analytics_by_user(user_id):
        from models import Analytics
        if DBHelper.is_firebase():
            doc = firebase_db.collection('analytics').document(user_id).get()
            return doc.to_dict() if doc.exists else None
        else:
            stats = Analytics.query.filter_by(user_id=user_id).first()
            return stats.to_dict() if stats else None

    # Admin dashboard helpers
    @staticmethod
    def admin_get_all_users():
        from models import User
        if DBHelper.is_firebase():
            docs = firebase_db.collection('users').get()
            return [doc.to_dict() for doc in docs]
        else:
            users = User.query.all()
            return [u.to_dict() for u in users]

    @staticmethod
    def admin_get_all_materials():
        from models import Material
        if DBHelper.is_firebase():
            docs = firebase_db.collection('materials').get()
            return [doc.to_dict() for doc in docs]
        else:
            mats = Material.query.all()
            return [m.to_dict() for m in mats]

    @staticmethod
    def admin_get_quiz_stats():
        from models import Quiz
        if DBHelper.is_firebase():
            docs = firebase_db.collection('quizzes').get()
            quizzes = [doc.to_dict() for doc in docs]
        else:
            quizzes = [q.to_dict() for q in Quiz.query.all()]
        
        total = len(quizzes)
        if total == 0:
            return {"total": 0, "avg_score": 0, "completed": 0}
        
        avg_score = sum(q.get('score', 0) for q in quizzes) / total
        completed = sum(1 for q in quizzes if q.get('completed', False))
        return {"total": total, "avg_score": round(avg_score, 2), "completed": completed}
