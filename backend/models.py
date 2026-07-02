import json
import datetime
import uuid
from database import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), default='')
    role = db.Column(db.String(20), default='user')
    avatar = db.Column(db.String(50), default='default')
    theme = db.Column(db.String(20), default='dark')
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'password_hash': self.password_hash,
            'name': self.name,
            'role': self.role,
            'avatar': self.avatar,
            'theme': self.theme,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Material(db.Model):
    __tablename__ = 'materials'
    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content_type = db.Column(db.String(50), nullable=False) # 'pdf', 'docx', 'txt', 'text'
    raw_text = db.Column(db.Text, nullable=False)
    file_size = db.Column(db.Integer, default=0)
    user_id = db.Column(db.String(36), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    summary = db.Column(db.Text, nullable=True) # Cached AI summary

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content_type': self.content_type,
            'raw_text': self.raw_text,
            'file_size': self.file_size,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'summary': json.loads(self.summary) if self.summary else None
        }

class Flashcard(db.Model):
    __tablename__ = 'flashcards'
    id = db.Column(db.String(36), primary_key=True)
    material_id = db.Column(db.String(36), nullable=False)
    user_id = db.Column(db.String(36), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(20), default='medium') # 'easy', 'medium', 'hard'
    favorite = db.Column(db.Boolean, default=False)
    review_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'material_id': self.material_id,
            'user_id': self.user_id,
            'question': self.question,
            'answer': self.answer,
            'difficulty': self.difficulty,
            'favorite': self.favorite,
            'review_count': self.review_count,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    material_id = db.Column(db.String(36), nullable=True)
    user_id = db.Column(db.String(36), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    questions = db.Column(db.Text, nullable=False) # JSON list
    score = db.Column(db.Integer, default=0)
    total_questions = db.Column(db.Integer, default=0)
    answers = db.Column(db.Text, nullable=True) # JSON list of user's answers
    completed = db.Column(db.Boolean, default=False)
    weak_topics = db.Column(db.Text, default='[]') # JSON list of weak topics detected
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'material_id': self.material_id,
            'user_id': self.user_id,
            'difficulty': self.difficulty,
            'questions': json.loads(self.questions) if self.questions else [],
            'score': self.score,
            'total_questions': self.total_questions,
            'answers': json.loads(self.answers) if self.answers else [],
            'completed': self.completed,
            'weak_topics': json.loads(self.weak_topics) if self.weak_topics else [],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class StudyPlan(db.Model):
    __tablename__ = 'studyplans'
    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    duration_days = db.Column(db.Integer, nullable=False) # 7 or 30
    user_id = db.Column(db.String(36), nullable=False)
    schedule = db.Column(db.Text, nullable=False) # JSON schedule of daily cards/activities
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'duration_days': self.duration_days,
            'user_id': self.user_id,
            'schedule': json.loads(self.schedule) if self.schedule else {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Analytics(db.Model):
    __tablename__ = 'analytics'
    user_id = db.Column(db.String(36), primary_key=True)
    average_score = db.Column(db.Float, default=0.0)
    total_quizzes = db.Column(db.Integer, default=0)
    study_hours = db.Column(db.Float, default=0.0)
    topics_covered = db.Column(db.Integer, default=0)
    completion_percentage = db.Column(db.Integer, default=0)
    weak_topics = db.Column(db.Text, default='[]') # JSON list
    strong_topics = db.Column(db.Text, default='[]') # JSON list
    weekly_progress = db.Column(db.Text, default='[0, 0, 0, 0, 0, 0, 0]') # JSON array of study actions / quizzes taken
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'average_score': self.average_score,
            'total_quizzes': self.total_quizzes,
            'study_hours': self.study_hours,
            'topics_covered': self.topics_covered,
            'completion_percentage': self.completion_percentage,
            'weak_topics': json.loads(self.weak_topics) if self.weak_topics else [],
            'strong_topics': json.loads(self.strong_topics) if self.strong_topics else [],
            'weekly_progress': json.loads(self.weekly_progress) if self.weekly_progress else [0]*7,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
