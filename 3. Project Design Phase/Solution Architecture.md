# Phase 3: Solution Architecture

This document describes the software components, network interfaces, and database schemas utilized by the **StudyAI** system.

---

## 1. System Topology Diagram

```
+--------------------------------------------------------------+
|                         Frontend UI                          |
|         (React 19 Client: ts, tailwind, framer-motion)       |
+------------------------------+-------------------------------+
                               |
                               | REST Requests / JSON (JWT Header)
                               v
+------------------------------+-------------------------------+
|                       Flask Backend                          |
|                   (Python REST API App)                      |
+-----------+------------------+------------------+------------+
            |                  |                  |
            | DB Access        | API Calls        | File Export
            v                  v                  v
+-----------+-----------+  +---+------------+  +--+------------+
| Firestore / SQLite DB |  |    Groq SDK    |  |   ReportLab   |
|   (DBHelper Layer)    |  |  (Llama 3.3)   |  | (PDF Creator) |
+-----------------------+  +----------------+  +---------------+
```

---

## 2. Database Collection Schemas

We implement 6 collections / tables. If Firestore is disabled, these are mapped directly to SQL tables via SQLAlchemy:

### 2.1 `users`
- `id` (String, PK): Unique UUID.
- `email` (String, Unique): User email coordinate.
- `password_hash` (String): Hashed password.
- `name` (String): Display name.
- `role` (String): 'user' or 'admin'.
- `avatar` (String): Dicebear avatar seed.
- `theme` (String): 'dark' or 'light'.

### 2.2 `materials`
- `id` (String, PK): Unique UUID.
- `title` (String): Document title.
- `content_type` (String): 'pdf', 'docx', 'txt', or 'text'.
- `raw_text` (Text): Full text content.
- `file_size` (Integer): Bytes count.
- `user_id` (String): Reference to user.
- `summary` (Text, Optional): Cached JSON summary data.

### 2.3 `quizzes`
- `id` (String, PK): Unique UUID.
- `title` (String): Quiz title.
- `material_id` (String): Reference to material.
- `user_id` (String): Reference to user.
- `difficulty` (String): 'easy', 'medium', 'hard'.
- `questions` (Text): JSON string of question structures.
- `score` (Integer): User's graded score.
- `total_questions` (Integer): Total questions.
- `completed` (Boolean): Completion status.
- `weak_topics` (Text): JSON list of weak subtopics.
