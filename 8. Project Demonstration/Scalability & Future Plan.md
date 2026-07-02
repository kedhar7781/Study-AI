# Phase 8: Scalability & Future Plan

This document outlines the architectural scaling plans and feature roadmap for the **StudyAI** workspace.

---

## 1. Feature Expansion Roadmap

We plan to implement the following features in subsequent versions:
- **Collaborative Study Rooms**: Allow multiple users to join a room, share a study material, and compete on the same quiz in real-time.
- **RAG / Vector Database Search**: Store document segments as vector embeddings in a Pinecone/Chroma database. This allows summarizing huge 200+ page books by extracting only relevant contexts, reducing Groq token limits.
- **Active Notifications (WhatsApp/SMS)**: Integrate Twilio API to schedule SMS notifications reminding users of calendar targets or missed review checkmarks.
- **Chrome Study Extension**: A browser extension enabling students to highlight text on any wiki/webpage and directly add it to their StudyAI materials library.

---

## 2. Infrastructure Scaling

- **State Sync**: Shift the fallback SQLite file system to a high-availability Postgres database (e.g. Supabase or RDS) as user registration counts scale.
- **Cache layer**: Implement a Redis cache to save generated summaries and flashcard decks, bypassing Groq API limits for identical documents.
- **Server Deployment**: Scale Render Web Services from the free tier to a paid instance with CPU/RAM scaling and load balancers.
