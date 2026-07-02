# Phase 1: Brainstorming & Idea Prioritization

This document details the feature brainstorming, comparison, and prioritization matrix utilized during the design of the **StudyAI** application.

---

## 1. Feature Ideation Log

During the initial scoping, the following ideas were brainstormed:
- **Idea A: Plain PDF Text Viewer**: A simple tool to read documents, but lacks active summaries or interactive testing.
- **Idea B: Markdown AI Summary Generator**: Automatic generation of key summaries including key takeaways, definitions, examples, and memory mnemonics using LLM. (Selected: Highly educational and high-yield).
- **Idea C: 3D Flippable Flashcards**: Digital flashcard decks generated directly from the content with flip animations, rating cards, and tracking favorites. (Selected: Great active recall strategy).
- **Idea D: Smart Quiz practice**: Customizable MCQ, True/False, and Short Answer question generator which evaluates inputs instantly and plots score progresses. (Selected: Essential testing method).
- **Idea E: AI Daily Planner**: A calendar sprint schedule (7 or 30 days) with prioritizations to guide studies. (Selected: Combines content with time-boxing).

---

## 2. Feature Prioritization Matrix

We prioritized features based on their Educational Impact versus Technical Complexity:

| Feature | Educational Impact | Complexity | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **AI Summaries** | High | Medium | Critical | Included |
| **3D Flashcards** | High | Medium | High | Included |
| **Quiz Practice & Scoring**| Critical | High | Critical | Included |
| **7/30 Day Planners** | High | High | Medium | Included |
| **SQLite Fallback mode** | High | Medium | High | Included |

---

## 3. Database & AI Engine Choices

- **Groq API with Llama 3.3**: Selected for extremely low-latency inference speeds, allowing interactive quiz and planner compilation under 3 seconds in production.
- **NoSQL Firestore + SQLite Fallback**: Selected to enable reliable cloud hosting on Google Firebase while supporting fully functioning local SQLite file storage if credentials or connections are unavailable.
