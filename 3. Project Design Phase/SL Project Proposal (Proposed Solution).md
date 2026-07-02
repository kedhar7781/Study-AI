# Phase 3: SL Project Proposal (Proposed Solution)

**Project Name**: StudyAI – Smart AI Education Companion & Quiz Generator  
**Track**: AI Specialist Track  

---

## 1. Executive Summary

StudyAI is a complete web application designed to help self-directed learners study more efficiently. By combining document extraction with the Groq API (Llama 3.3 model), StudyAI transforms static notes into active learning resources (summaries, 3D flashcards, quizzes, and calendars). 

The system operates as a monorepo containing a React 19 client and a Python Flask backend. It supports cloud database storage via Firebase Firestore, but features a fully functional SQLite fallback to run without internet setup.

---

## 2. Proposed Feature Set

1. **Document Parser**: Ingests PDF, DOCX, and TXT files, converting content into structured database items.
2. **AI Summaries**: Renders high-yield highlights (takeaways, definitions, examples, memory mnemonics).
3. **Interactive recall**: 3D-flipping flashcards and graded quizzes (MCQ, True/False, Short Answer).
4. **Weak Topic Tracker**: Analyzes correct rates and warns users about subject areas needing review.
5. **Study Planner**: Automatically layouts 7 or 30-day schedules with priorities.
6. **Analytics Hub**: Graph progression dashboards using Recharts.

---

## 3. High-Level Project Timeline

- **Milestone 1**: Project scoping and DFD requirements mapping. (Completed)
- **Milestone 2**: Backend database creation and JWT auth rules. (Completed)
- **Milestone 3**: Groq API integration and Mock offline fallbacks. (Completed)
- **Milestone 4**: React UI dashboard base layouts and 3D card flips. (Completed)
- **Milestone 5**: PDF exports, test coverage, and Render/Docker deployments. (Completed)
