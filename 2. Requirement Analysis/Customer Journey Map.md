# Phase 2: Customer Journey Map

This document outlines the user's journey through **StudyAI**, detailing their touchpoints, emotional states, and system feedback.

---

## 1. Journey Phases

### Phase 1: Onboarding & Landing
- **User Action**: Visits website, reviews features, and registers/logins.
- **Touchpoint**: Glassmorphic Auth Form.
- **Emotion**: Hopeful, looking for tool assistance.
- **System Feedback**: Validates inputs, creates session token, and displays welcome toast.

### Phase 2: Material Ingestion
- **User Action**: Uploads a PDF/TXT syllabus or pastes notes.
- **Touchpoint**: Drag-and-drop file panel.
- **Emotion**: Eager to see results.
- **System Feedback**: Parses stream, uploads raw text to database, and displays a success toast.

### Phase 3: AI Summarization & Guide Study
- **User Action**: Clicks "Generate Summary" or views flashcards.
- **Touchpoint**: Markdown Summary and 3D Card flippers.
- **Emotion**: Satisfied, actively reviewing definitions and tricks.
- **System Feedback**: Renders structured sections and updates favorite/difficulty logs.

### Phase 4: Active Practice & Plan
- **User Action**: Generates a 10-question MCQ quiz, submits answers, and updates study schedule.
- **Touchpoint**: Quiz player, Recharts progress bars, and calendar sprint layouts.
- **Emotion**: Confident, tracking weak areas.
- **System Feedback**: Grades answers, updates progress statistics, and schedules daily checkpoints.
