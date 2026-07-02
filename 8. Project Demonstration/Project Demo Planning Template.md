# Phase 8: Project Demo Planning Template

This document structures the demo day agenda, script cues, and contingency backup setups for **StudyAI**.

---

## 1. Demo Presentation Agenda

We divide our 10-minute presentation into 4 blocks:

1. **The Problem** (2 Minutes): Explain content overload and why passive highlighting yields low memory retention.
2. **The Solution Overview** (2 Minutes): Walk through the architecture: React client, Flask backend, SQLite local database, and Groq LLM inference.
3. **Live UI Demo** (5 Minutes): Walk through the feature checklist: PDF upload, AI summary compilation, 3D card flips, quiz taking, and score progress charting.
4. **Summary & Future Scopes** (1 Minute): Present scalability pathways.

---

## 2. Contingency & Fallback Plans

To ensure a smooth demo even during internet latency or API rate limits:
- **Offline Mock Fallback**: If the venue internet fails or Groq limits are hit, the application automatically runs in SQLite + Offline Mock mode. The database loads mock summary guides, card decks, and quizzes seamlessly.
- **Pre-loaded User Account**: We pre-register an account (`demo@example.com`) loaded with multiple documents and a week of quiz attempts, ensuring charts are fully populated at the start of the demo.
