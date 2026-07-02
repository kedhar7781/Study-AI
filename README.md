# StudyAI – Smart AI Education Companion & Quiz Generator

StudyAI is a complete, production-ready full stack web application designed to be a premium AI-powered education dashboard. It enables users to upload study materials (PDF, DOCX, TXT), paste texts, and leverage the **Groq API** (`llama-3.3-70b-versatile` model) to automatically generate comprehensive study summaries, 3D interactive flashcards, customizable quizzes with immediate grading, personalized study schedules, and detailed learning statistics.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, Recharts, React Markdown, React Icons, React Hot Toast
- **Backend**: Python Flask, Flask-SQLAlchemy, Flask-CORS, PyJWT, Bcrypt, ReportLab (PDF generator), Groq API, Firebase Admin SDK
- **Database**: Firebase Firestore (fallback to SQLite + Local JSON storage for instant offline development)

## Key Features

1. **Dashboard Home**: Real-time overview of completion percentage, learning hours, topics mastered, and quick study action widgets.
2. **Material Upload**: Drag-and-drop or select PDF, DOCX, and TXT files, or copy/paste raw text directly. Fully searchable/filterable list.
3. **Summary Generator**: Interactive markdown layout outlining key topics, definitions, examples, memory tricks, with regeneration and PDF download support.
4. **Interactive Flashcards**: 3D-flipping cards that can be favorited, shuffled, and difficulty-rated to track retention progress.
5. **Quiz Generator**: Generate MCQ, True/False, or Short Answer quizzes based on uploaded materials. Evaluates answers instantly, displays scorecharts, and highlights weak topics.
6. **Study Planner**: Creates structured 7 or 30-day schedules with priorities, objectives, and calendar displays.
7. **Analytics Hub**: Graph charts mapping quiz performance trends and subject weaknesses.
8. **Admin Panel**: Centralized management dashboard tracking logs, registered users, and active content.

## Project Structure (AI Specialist Track)

This project contains all standard stage deliverables required for the **AI Specialist Track** template:

- **[1. Brainstorming & Ideation](file:///C:/Users/matse/.gemini/antigravity/scratch/studyai/1.%20Brainstorming%20&%20Ideation)**: Feature priority comparisons, user persona definitions, and empathy mappings.
- **[2. Requirement Analysis](file:///C:/Users/matse/.gemini/antigravity/scratch/studyai/2.%20Requirement%20Analysis)**: Solution DFD data flows, system journey maps, functional/non-functional rules, and tech stacks.
- **[3. Project Design Phase](file:///C:/Users/matse/.gemini/antigravity/scratch/studyai/3.%20Project%20Design%20Phase)**: REST API specifications, system topologies, problem-solution fit matrices, and project proposals.
- **[4. Project Planning Phase](file:///C:/Users/matse/.gemini/antigravity/scratch/studyai/4.%20Project%20Planning%20Phase)**: Timelines, milestones, and development sprint planning sheets.
- **[5. Project Development Phase](file:///C:/Users/matse/.gemini/antigravity/scratch/studyai/5.%20Project%20Development%20Phase)**: Code layout guidelines, AI prompt schemas, and lists of functional backend/frontend features.
- **[6. Performance Testing](file:///C:/Users/matse/.gemini/antigravity/scratch/studyai/6.%20Performance%20Testing)**: Latency speed logs and database fallback performance summaries.
- **[7. Documentation & Demo](file:///C:/Users/matse/.gemini/antigravity/scratch/studyai/7.%20Documentation%20&%20Demo)**: Detailed project manual guidelines and execution guides.
- **[8. Project Demonstration](file:///C:/Users/matse/.gemini/antigravity/scratch/studyai/8.%20Project%20Demonstration)**: Team communication models, demo scripts, contingencies, and future roadmap scopes.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### Installation

1. Clone the repository and navigate to the directory:
   ```bash
   cd studyai
   ```

2. Setup the backend:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup the frontend:
   ```bash
   npm install
   ```

4. Configure your environment keys by creating a `.env` file in the root based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Note: If no `GROQ_API_KEY` is provided, the backend will operate in a self-contained Mock mode, generating fully functional mock summaries, flashcards, and quizzes so you can explore the application without api keys.*

### Running the Application

- **Start backend (Flask)**:
  ```bash
  python backend/app.py
  ```
  The api will start running on [http://localhost:5000](http://localhost:5000).

- **Start frontend (Vite)**:
  ```bash
  npm run dev
  ```
  The web client will start running on [http://localhost:5173](http://localhost:5173).

- **Start via Docker Compose**:
  ```bash
  docker-compose up --build
  ```

## Testing
- Run backend unit and integration tests:
  ```bash
  pytest backend/test_api.py
  ```
