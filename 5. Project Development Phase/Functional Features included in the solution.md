# Phase 5: Functional Features included in the solution

This document lists the completed functional modules and page screens of the **StudyAI** application.

---

## 1. Frontend Page Features

### 1.1 Dashboard Home (`DashboardHome.tsx`)
- Numeric stats widgets showing completion rate, focus hours, mastered topics, and quiz attempts.
- Interactive Recharts bar chart plotting daily study engagement actions.
- Action triggers linking to upload, quiz, and planner workspaces.
- Weak topic warning notifications.

### 1.2 Material Hub (`MaterialsPage.tsx`)
- Drag-and-drop file upload (PDF, DOCX, TXT) and copy/paste text field.
- Document list showing search and deletion options.
- Markdown summary generator rendering definition tables, memory tricks, key points, and examples.
- Summary copy option and summary PDF download trigger.

### 1.3 3D Flashcards (`FlashcardsPage.tsx`)
- Material selector and deck generation trigger.
- 3D card flipping animation (revealing term definition explanation on flip).
- Rating card controls (easy, medium, hard progress updates).
- Favorite card toggling and deck shuffling options.

### 1.4 Practice Quizzes (`QuizPage.tsx`)
- Quiz configuration (topic, question count 5/10/20, difficulty, formats).
- Graded quiz player displaying correct rates, question explanation cards, and weak topic alerts.
- Score analytics charts.
- Downloadable PDF worksheets.

### 1.5 Study Planner (`PlannerPage.tsx`)
- Sprint schedules (7 or 30 days) displaying focus topics and checklists.

---

## 2. Backend API Endpoint Features

- **Auth**: Password salting/hashing, token verification decorator, `/register`, `/login`, `/logout` endpoints.
- **Syllabus Ingest**: Multi-part stream parsers for PDF/DOCX, material CRUD routes.
- **AI Processing**: Structured JSON compilers for summaries, planners, cards, and quizzes.
- **Exporting**: ReportLab page builders compiling PDF downloads.
