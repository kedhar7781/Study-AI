# Phase 4: Project Planning Template

This document outlines the project development sprints, task distributions, and completion milestones for the **StudyAI** application.

---

## 1. Project Milestone Roadmap

We scheduled our project across 4 distinct sprints:

```
[Sprint 1: Architecture] ---> [Sprint 2: Backend REST] ---> [Sprint 3: Frontend UI] ---> [Sprint 4: Integration]
      (Weeks 1-2)                   (Weeks 3-4)                  (Weeks 5-6)                 (Weeks 7-8)
Scoping & DFD mapping        SQLite Schemas & JWT Auth     Glass UI, 3D Flashcards      PDF generation & deploys
```

---

## 2. Sprint Timeline Details

### Sprint 1: Project Scoping & Scaffolding (Weeks 1-2)
- **Goal**: Research requirements, map data flow, set up root monorepo templates, configure TS config, and set up git repositories.
- **Deliverables**: Empathy Map, Solution requirements, and root `.gitignore`.

### Sprint 2: Database Schema & Authentication (Weeks 3-4)
- **Goal**: Implement Flask configurations, model the SQL schemas, and write registration/login encryption logic.
- **Deliverables**: `database.py`, `models.py`, and JWT decorators.

### Sprint 3: AI Inference & Mock fallbacks (Weeks 5-6)
- **Goal**: Bind the Groq API SDK, construct prompting templates for JSON output mode, and implement offline mock generators.
- **Deliverables**: `ai_service.py` and `routes.py`.

### Sprint 4: Frontend Assembly & Cloud Hosting (Weeks 7-8)
- **Goal**: Build React components (sidebar, flippable cards, quiz player), link charting, generate ReportLab PDF exports, and write Dockerfiles for Render deployment.
- **Deliverables**: Dashboard pages, ReportLab layouts, and Vercel/Render configurations.
