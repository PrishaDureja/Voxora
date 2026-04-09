# Voxora: Experience Intelligence

### AI-Powered Feedback Intelligence & Triage System

Voxora is a premium, full-stack SaaS platform that converts unstructured user input into structured, actionable insights using Natural Language Processing. With its custom **Aurora Glass** UI, Voxora provides a world-class aesthetic experience while enabling administrators to dynamically understand sentiment, triage issues, and close the loop with users.

---

## The Voxora Solution

Most feedback systems collect passive data but fail to extract meaningful insights. Manual analysis is time-consuming, inconsistent, and unscalable.

Voxora automates this entirely:
- **For Users:** A frictionless, elegant gateway to submit feedback in plain English. No rigid forms or complex grids.
- **For Admins:** A powerful NLP engine combined with an **AI Action Triage Center** that instantly prioritizes the most critical issues to solve based on predicted confidence and sentiment metrics.

---

## Core Features

### Frontend (Aurora Glass UI)
- **Extreme Minimalist Glassmorphism:** Features a custom CSS design system using translucent glass cards, harmonic center-stage animations, and stunning background sweeps.
- **Dynamic Dashboards:** Includes a dynamic overview with interactive Recharts (Bar, Area, Pie) and live data hydration.
- **User History & Admin Replies:** Users can review their past feedback submissions on a sleek History tab and instantly see personalized Admin Replies docked identically to their context.

### Backend & Machine Learning
- **Sentiment Classification Pipeline:** Employs NLP preprocessing, TF-IDF Vectorization, and Scikit-learn models to gauge the exact mood of user input (Positive, Neutral, Critical).
- **Issue & Keyword Detection:** Automatically segments complex feedback paragraphs into discrete `issues` and string `keywords`.
- **Triage Center:** Auto-generates prioritized Action items directly from critical trends identified in the feedback streams.

---

## Tech Stack

**Frontend Framework:** React (using Vite) + Framer Motion + Recharts
**Styling Architecture:** Pure CSS (Aurora Glassmorphism System)
**Backend API:** Python & Flask
**Database:** SQLite3
**Machine Learning:** Scikit-learn, TF-IDF Vectorizer, NLP Preprocessing pipelines

---

## Setup Instructions

### Backend Start
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 app.py
# Server starts on port 5002
```

### Frontend Start
```bash
cd frontend/voxora-ui
npm install
npm run dev
# Server starts on port 3005
```

---

## API Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | `POST` | Processes user/admin logins |
| `/feedback/submit` | `POST` | Receives payload and routes it through ML model |
| `/feedback/dashboard` | `GET` | Fetches aggregated stats and recents for the admin |
| `/feedback/user/<id>` | `GET` | Retrieves the history for a single user |
| `/feedback/<id>/reply` | `POST` | Allows an admin to attach a persistent reply |

---

## Future Roadmap

* Deep Learning Integration (BERT / Transformers)
* Cloud Database Migrations (PostgreSQL / AWS RDS)
* Multi-language analysis capabilities
* Real-time WebSocket connectivity for instantaneous feedback streaming

---

**Developed & Designed by** Prisha Dureja
