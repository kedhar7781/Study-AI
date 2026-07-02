# StudyAI Deployment Guide

Instructions for deploying StudyAI to production systems.

## 1. Backend (Render Deployment)

1. Create a Web Service account in Render.
2. Select Python environments.
3. Configure settings parameters:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:5000 --chdir backend app:app`
4. Add environment variables:
   - `JWT_SECRET`: Random hash secret.
   - `GROQ_API_KEY`: Groq API key values.
   - `USE_FIREBASE`: `true`
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` for Firestore cloud storage.

---

## 2. Frontend (Vercel Deployment)

1. Import the repository in Vercel.
2. Set configuration parameters:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Configure Environment variables:
   - `VITE_API_URL`: URL of your deployed backend Render service (e.g. `https://studyai-api.onrender.com`).
4. Hit Deploy.
