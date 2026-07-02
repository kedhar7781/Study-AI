# Phase 2: Technology Stack

This document details the software, frameworks, and APIs powering the **StudyAI** application.

---

## 1. Frontend Client Layer
- **React 19 & TypeScript**: Provides high-performance component state rendering and strict static type checks.
- **Vite**: Ultra-fast build tool and local hot-reloaded dev server.
- **Tailwind CSS**: Utility-first CSS class compiling styling tokens, custom shadows, and glassmorphism panels.
- **Framer Motion**: Smooth 3D translations (such as flashcard flips, page entries, and modals).
- **React Router Dom (v6)**: Handles front-end path mappings and protected auth layouts.
- **Recharts**: Interactive SVG charts (Area, Pie, Bar charts) rendering student study logs.
- **React Markdown**: Dynamically renders AI-generated markdown summary guides.
- **React Hot Toast**: Micro-notifications.

## 2. Backend Server Layer
- **Python (v3.11+)**: High-performance backend execution language.
- **Flask (v3.0.3)**: Web framework configuring API routes and routing rules.
- **Flask-CORS (v4.0.1)**: Grants browser cross-origin sharing credentials.
- **PyJWT (v2.8.0)**: Coordinates JWT encryption and decryption.
- **Bcrypt (v4.1.3)**: Salting and hashing passwords.
- **ReportLab (v4.2.2)**: Generates customized PDF document downloads.
- **PyPDF2 & python-docx**: Document text extraction utilities.

## 3. Database & Cloud Engines
- **Firebase Firestore**: Cloud document database.
- **SQLite3 (SQLAlchemy fallback)**: Relational SQLite database used as fallback if Firebase is disabled.
- **Groq SDK (Llama 3.3 70B)**: Real-time LLM inference interface.
