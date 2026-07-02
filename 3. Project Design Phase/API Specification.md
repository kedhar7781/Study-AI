# Phase 3: API Specification

This document details all HTTP endpoints exposed by the **StudyAI** backend service.

---

## 1. Authentication Endpoints

### Register User
- **Method / Route**: `POST /api/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  { "email": "student@example.com", "password": "pass123", "name": "Bob" }
  ```
- **Response (201 Created)**: Returns session token and safe user details.

### Login User
- **Method / Route**: `POST /api/login`
- **Request Body**:
  ```json
  { "email": "student@example.com", "password": "pass123" }
  ```
- **Response (200 OK)**: Returns auth token and user settings.

---

## 2. Study Material Endpoints

### Upload File or paste text
- **Method / Route**: `POST /api/upload`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Payload**:
  - `file`: (Optional) PDF, DOCX, or TXT binary stream.
  - `text`: (Optional) Paste text.
  - `title`: (Optional) Document title description.
- **Response (201 Created)**: Material dictionary including ID and contents.

### Fetch Materials
- **Method / Route**: `GET /api/materials`
- **Response (200 OK)**: Array of materials of the active user.

---

## 3. AI Features Endpoints

### Summary Compilation
- **Method / Route**: `POST /api/summary`
- **Request Body**:
  ```json
  { "material_id": "uuid-string" }
  ```
- **Response (200 OK)**: JSON summary (summary, key_points, definitions, examples, memory_tricks).

### Flashcard Deck Generation
- **Method / Route**: `POST /api/flashcards`
- **Request Body**:
  ```json
  { "material_id": "uuid-string" }
  ```
- **Response (200 OK)**: Array of card structures.

### Quiz Compilation
- **Method / Route**: `POST /api/quiz`
- **Request Body**:
  ```json
  { "material_id": "uuid-string", "count": 5, "type": "MCQ", "difficulty": "medium" }
  ```
- **Response (201 Created)**: Created Quiz questions layout.
