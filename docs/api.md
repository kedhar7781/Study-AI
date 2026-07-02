# StudyAI API Specifications

All endpoints use JSON payloads and require a `Authorization: Bearer <JWT_TOKEN>` header unless marked as public.

## 1. Authentication Endpoints

### Register User [PUBLIC]
- **Route**: `POST /api/register`
- **Request**:
  ```json
  {
    "email": "student@example.com",
    "password": "securepassword",
    "name": "Bob Tester"
  }
  ```
- **Response (201)**:
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "uuid-string",
      "email": "student@example.com",
      "name": "Bob Tester",
      "role": "user",
      "avatar": "avatar1",
      "theme": "dark"
    }
  }
  ```

### Login User [PUBLIC]
- **Route**: `POST /api/login`
- **Request**:
  ```json
  {
    "email": "student@example.com",
    "password": "securepassword"
  }
  ```
- **Response (200)**: Auth token and safe user details.

---

## 2. Study Material Endpoints

### Upload Material
- **Route**: `POST /api/upload`
- **Request**: Multipart Form Data
  - `file`: (Optional) PDF, DOCX, TXT binary stream.
  - `text`: (Optional) Paste raw text block.
  - `title`: (Optional) Document title description.
- **Response (201)**: Material object dictionary.

### Retrieve Materials
- **Route**: `GET /api/materials`
- **Response (200)**: Array of user materials.

---

## 3. Summary & Export Endpoints

### Generate Summary
- **Route**: `POST /api/summary`
- **Request**:
  ```json
  { "material_id": "uuid-string" }
  ```
- **Response (200)**:
  ```json
  {
    "summary": "# Markdown Text summary...",
    "key_points": ["Point A", "Point B"],
    "definitions": [{"term": "X", "definition": "Y"}],
    "examples": ["Example 1"],
    "memory_tricks": ["Mnemonic 1"]
  }
  ```

### Download Summary PDF
- **Route**: `GET /api/material/<id>/download-pdf`
- **Response (200)**: PDF binary attachment stream.

---

## 4. Flashcard Endpoints

### Generate Flashcards
- **Route**: `POST /api/flashcards`
- **Request**: `{ "material_id": "uuid-string" }`
- **Response (200)**: Array of generated card items.

---

## 5. Quiz Endpoints

### Generate Quiz
- **Route**: `POST /api/quiz`
- **Request**:
  ```json
  {
    "material_id": "uuid-string",
    "count": 5,
    "type": "MCQ",
    "difficulty": "medium"
  }
  ```
- **Response (201)**: Created Quiz dictionary.

### Evaluate Quiz Submission
- **Route**: `POST /api/quiz/<id>/evaluate`
- **Request**:
  ```json
  { "answers": ["Option A", "True", "User Explanation"] }
  ```
- **Response (200)**: Scored details, Correct keys, and detected weak topics.
