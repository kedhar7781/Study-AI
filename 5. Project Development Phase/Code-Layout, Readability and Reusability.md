# Phase 5: Code-Layout, Readability and Reusability

This document details the software design patterns, architectural choices, and clean code practices implemented in **StudyAI**.

---

## 1. Modular Directory Layout

The project follows a modular monorepo folder layout separating concerns:

```
studyai/
├── backend/            # Python Flask backend
│   ├── app.py          # App bootloader and blueprints
│   ├── database.py     # DBHelper database abstraction layer
│   ├── models.py       # SQL Alchemy database schemas
│   ├── auth.py         # JWT security handlers
│   ├── ai_service.py   # Groq LLM client
│   └── routes.py       # API endpoints mapping
├── frontend/           # React 19 single-page application
│   ├── src/
│   │   ├── components/ # Reusable UI components (GlassCard, SkeletonLoader)
│   │   ├── context/    # Global state managers (AuthContext)
│   │   └── pages/      # Route entry pages (Dashboard, Flashcards, Quiz)
```

---

## 2. Design Patterns & Code Reusability

### 2.1 The DBHelper Abstraction Layer
Instead of hardcoding Firestore or SQLite commands inside endpoints, `routes.py` makes calls to `DBHelper` methods (`create_user`, `get_material_by_id`, etc.). This encapsulates database logic and allows shifting drivers cleanly.

### 2.2 Glassmorphism Components
We encapsulated the complex tailwind border-gradients, backdrop blurs, and Framer Motion hover animations inside `GlassCard.tsx`. Any new dashboard widget simply imports and wraps content with `<GlassCard>`, keeping the design consistent and reusable.
