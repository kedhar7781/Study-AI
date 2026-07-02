# StudyAI Architecture Document

StudyAI is structured as a full stack application in a monorepo format, featuring a Flask REST API on the backend and a React (Vite + TypeScript + Tailwind) client on the frontend.

## Block Diagram

```
+------------------------------------------+
|                 Frontend                 |
| (React 19, TS, Tailwind, Framer Motion) |
+---------------------+--------------------+
                      |
                      | HTTP / JSON Requests (with JWT bearer headers)
                      v
+---------------------+--------------------+
|                 Backend                  |
|          (Flask Python server)           |
+----------+--------------------+----------+
           |                    |
           | DB Drivers         | AI Service (HTTP API client)
           v                    v
+----------+-----------+  +-----+------------------------+
|   Firestore Client   |  |        Groq SDK Client       |
|          or          |  | (llama-3.3-70b-versatile in  |
| SQLAlchemy SQLite fallback |  |    structured JSON format)   |
+----------------------+  +------------------------------+
```

## Architectural Components

### 1. Frontend Workspace
- **Main Assembly**: `frontend/src/main.tsx` handles rendering, bootstrapping styling layouts (`frontend/src/index.css`) and importing global setups.
- **Routing**: Protected route guards in `frontend/src/App.tsx` prevent unauthenticated accesses.
- **Visual styling theme**: Utilizes Glassmorphism guidelines featuring semi-transparent card panels (`GlassCard.tsx`) with backdrop filters, thin borders, hover transformations, and responsive spacing.

### 2. Backend Rest API
- **Entry points**: `backend/app.py` registers the blueprint routes, sets up CORS permissions, initializes SQL configurations, and handles production static routing files.
- **Routing rules**: `backend/routes.py` maps client payloads to database records and calls the AI services.
- **Token authentication**: `backend/auth.py` salts and hashes passwords via bcrypt, generating JWT bearer tokens with standard HS256 headers.

### 3. Abstraction Database Layer
- **DBHelper**: `backend/database.py` evaluates configurations and automatically determines database drivers:
  - If Firebase config parameters are active, resolves documents to Firestore collections.
  - If cloud keys are missing, initializes a local SQLite file database through `Flask-SQLAlchemy` schemas defined in `backend/models.py`.

### 4. AI Services & Offline fallbacks
- **AIService**: `backend/ai_service.py` connects to Groq using the `llama-3.3-70b-versatile` model with JSON response requirements.
- **Self-contained Fallbacks**: If no `GROQ_API_KEY` is present, the service triggers offline mock generators returning correctly structured JSON layouts for summaries, cards, planners, and quizzes, enabling immediate application testing.
