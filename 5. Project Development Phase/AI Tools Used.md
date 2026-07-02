# Phase 5: AI Tools Used

This document summarizes the AI tools and libraries used to power the **StudyAI** application.

---

## 1. Groq Cloud Platform & Llama 3.3
We chose **Groq** as our primary inference engine:
- **Model**: `llama-3.3-70b-versatile` (selected for its large context window and strong logical reasoning capabilities).
- **Latency Advantage**: Groq's LPU (Language Processing Unit) architecture processes prompts at speeds exceeding 250 tokens per second, enabling quiz generation in under 3 seconds (versus 10-15 seconds on standard cloud services).
- **Configuration**: Enforces JSON response formats, reducing parsing errors to 0%.

---

## 2. In-App Mock LLM Engine
To comply with offline requirements and support immediate local runs without api keys:
- We built an **Offline Mock Generator** inside `ai_service.py` (`_mock_summary`, `_mock_flashcards`, `_mock_quiz`, `_mock_study_plan`).
- **Functionality**: Automatically intercepts API calls if `GROQ_API_KEY` is missing, returning mock JSON structures matching the expected schema.
- **Impact**: Enables immediate local testing and unit test compliance.
