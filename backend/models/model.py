import joblib
import os
from backend.nlp.preprocess import preprocess_text, extract_aspects

MODEL_PATH = os.path.join(os.path.dirname(__file__), "sentiment_model.pkl")
model = joblib.load(MODEL_PATH)

NEGATIVE_PATTERNS = [
    "wasnt clean", "wasn't clean", "not clean", "not good", "wasn't good",
    "never again", "never coming", "never come", "very bad", "so bad",
    "worst experience", "terrible experience", "rude staff", "dirty room",
    "cold food", "stale food", "long wait", "too slow", "not worth",
    "waste of money", "not satisfied", "very disappointed", "highly disappointed",
    "would not recommend", "don't recommend", "do not recommend",
    "not happy", "not pleased", "not impressed", "left hungry",
    "never going back", "not coming back", "stay away"
]

POSITIVE_PATTERNS = [
    "highly recommend", "must visit", "will come back", "coming back",
    "loved it", "love it", "absolutely amazing", "very good", "so good",
    "best experience", "great experience", "excellent service",
    "clean and tidy", "friendly staff", "great food", "delicious food"
]

def predict_sentiment(text: str) -> dict:
    text_lower = text.lower()
    processed = preprocess_text(text)

    # Pattern matching first (most reliable)
    for pattern in NEGATIVE_PATTERNS:
        if pattern in text_lower:
            return {"sentiment": "negative", "confidence": 88.0}

    for pattern in POSITIVE_PATTERNS:
        if pattern in text_lower:
            return {"sentiment": "positive", "confidence": 88.0}

    # ML prediction with probability
    try:
        proba = model.predict_proba([processed])[0]
        classes = list(model.classes_)
        scores = dict(zip(classes, proba))
        positive_score = scores.get("positive", 0.5)
        negative_score = scores.get("negative", 0.5)
        sentiment = "positive" if positive_score >= 0.5 else "negative"
        confidence = round(max(positive_score, negative_score) * 100, 1)
        return {"sentiment": sentiment, "confidence": confidence}
    except Exception:
        return {"sentiment": "neutral", "confidence": 50.0}

def get_aspects(text: str) -> list:
    return extract_aspects(text)