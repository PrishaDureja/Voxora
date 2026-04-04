# Voxora

## AI-Powered Feedback Intelligence System

---

## What is Voxora?

Voxora is a feedback analysis platform that converts unstructured user input into structured, actionable insights using Natural Language Processing.

It helps organizations understand user sentiment, identify recurring issues, and make faster, data-driven decisions without manually reviewing large volumes of feedback.

---

## Problem It Solves

Most feedback systems collect data but fail to extract meaningful insights. Manual analysis is:

* Time-consuming
* Inconsistent
* Not scalable

Voxora automates this process using machine learning and NLP techniques.

---

## Core Features

* Text preprocessing and normalization
* TF-IDF based feature extraction
* Sentiment classification pipeline
* Issue and keyword detection
* Insight generation from feedback
* Full stack integration (UI + API + ML pipeline)

---

## Tech Stack

### Frontend

* React (Vite)
* HTML, CSS, JavaScript

### Backend

* Python
* Flask

### Machine Learning

* Scikit-learn
* TF-IDF Vectorizer
* NLP preprocessing

---

## System Flow

User Input → Frontend → Flask API → NLP Processing → ML Model → Insights → UI

---

## API Endpoints

### Authentication

POST /signup
POST /login

### Feedback

POST /feedback
GET /feedback

---

## Example Request

```json
{
  "text": "The food quality is poor and service is slow"
}
```

---

## Example Response

```json
{
  "sentiment": "negative",
  "issues": ["food quality", "service speed"],
  "insights": "Users are dissatisfied with food quality and service delays"
}
```

---

## Project Structure

backend/
├── routes/
├── models/
├── nlp/
├── utils/

frontend/voxora-ui/
├── src/
├── components/
├── pages/

---

## Setup Instructions

### Backend

```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r ../requirements.txt
python3 app.py
```

---

### Frontend

```bash
cd frontend/voxora-ui
npm install
npm run dev
```

---

## Future Improvements

* Advanced models (BERT / Deep Learning)
* Real-time analytics dashboard
* Cloud deployment (AWS / GCP / Azure)
* Multilingual feedback support

---

## Author

Prisha Dureja
