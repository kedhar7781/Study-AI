# Phase 2: Solution Requirements

This document details the functional and non-functional requirements for the **StudyAI** application.

---

## 1. Functional Requirements

### 1.1 Ingestion & Parsing
- **FR 1.1.1**: The system must accept PDF, DOCX, and TXT file uploads, alongside a copy/paste text field.
- **FR 1.1.2**: Extracted raw texts must be saved to the database.

### 1.2 AI Study Assistance (Groq API integration)
- **FR 1.2.1**: The system must generate markdown study summaries showing definitions, key takeaways, and mnemonics.
- **FR 1.2.2**: The system must generate interactive flashcards with questions, answers, and difficulty ratings.
- **FR 1.2.3**: The system must create customizable MCQ, True/False, and Short Answer quizzes.
- **FR 1.2.4**: The system must automatically build 7 or 30-day schedules with priorities.

### 1.3 Active recall testing & analytics
- **FR 1.3.1**: The system must grade quiz attempts instantly.
- **FR 1.3.2**: The system must compile progress dashboards showing focus hours, completion percentages, and correct rates.
- **FR 1.3.3**: The system must detect weak subjects based on failed quiz items.

### 1.4 Exporting
- **FR 1.4.1**: The system must generate downloadable PDF summaries and quiz worksheets.

---

## 2. Non-Functional Requirements

- **NFR 2.1 Latency**: AI prompts must resolve in under 4 seconds in production using the Groq Llama 3.3 model.
- **NFR 2.2 Offline Availability**: If API keys are missing, the system must automatically fall back to mock templates to keep the app functional offline.
- **NFR 2.3 Security**: Password hashes must use bcrypt, and API routes must verify JWT tokens.
- **NFR 2.4 Interface**: Glassmorphism rounded components matching the purple-blue gradient theme.
