# Phase 7: Project Documentation

This document serves as the general guide for the **StudyAI** application, summarizing the application target, system roles, and page structures.

---

## 1. Project Overview

StudyAI is a smart AI education companion designed as a unified workspace. It allows users to upload study documents (PDF, DOCX, TXT) and leverage the Groq API (Llama 3.3 model) to automatically build structured highlights (Summaries), interactive study aids (3D Flashcards and quizzes), and customized sprint planners (7 or 30 days) instantly.

---

## 2. System User Roles

- **Student / Learner (Default)**: Can register accounts, upload notes, generate summaries, flip cards, practice quizzes, track analytics, and layout schedules.
- **Admin**: Can access the Admin Dashboard to review system operation logs, monitor registered users, check uploaded content sizes, and view quiz score statistics.

---

## 3. Page Structures

1. **Landing Page**: Product features, testimonials, FAQ grid, and footer.
2. **Auth Screen**: Validated login, registration, and password recovery.
3. **Dashboard Home**: Real-time stats widgets (hours studied, topics covered) and daily engagement charts.
4. **Materials Page**: Document list, upload panel, summary markdown guides, and PDF generator.
5. **Flashcards Workspace**: Flippable 3D card deck, shuffle, and rating options.
6. **Quiz Page**: MCQ, True/False, and short-answer player, instant grading, and pie charts.
7. **Planner Workspace**: Sprint checklist calendars.
8. **Analytics Hub**: Progression trends area charts and score histories.
9. **Admin Panel**: Monitor logs and database status.
