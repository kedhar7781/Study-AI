# Phase 7: Project Execution Guide

This document details the local installation and cloud deployment instructions for the **StudyAI** application.

---

## 1. Local Developer Run

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### Installation
1. Install Python backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Install Node frontend dependencies:
   ```bash
   npm install --prefix frontend
   ```

### Execution
1. Start the Flask backend server:
   ```bash
   python backend/app.py
   ```
   The backend will boot up on [http://localhost:5000](http://localhost:5000).
2. Start the Vite React client dev server:
   ```bash
   npm run dev --prefix frontend
   ```
   The website will boot up on [http://localhost:5173](http://localhost:5173).

---

## 2. Cloud Render Deployment (Docker Method)

You can host both frontend and backend on Render using our multi-stage Docker build:
1. Create a Web Service on **Render**.
2. Connect your GitHub repository: `https://github.com/<YOUR_USER>/Study-AI`.
3. Set **Language** to **`Docker`**.
4. Set the Instance Type to **Free**.
5. Add the environment variables:
   - `JWT_SECRET`: Random secret string.
   - `USE_FIREBASE`: `false` (forces SQLite fallback).
   - `GROQ_API_KEY`: Your Groq API key values.
6. Click **Deploy web service**.
