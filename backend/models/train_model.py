import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from backend.nlp.preprocess import preprocess_text
# -----------------------------
# LOAD DATA (ROBUST WAY)
# -----------------------------
texts = []
labels = []
with open("data/reviews.txt", "r", encoding="utf-8") as file:
    for line in file:
        parts = line.strip().split("\t")
        # Skip corrupted rows
        if len(parts) != 2:
            continue
        text, label = parts
        texts.append(text)
        labels.append(int(label))
df = pd.DataFrame({
    "text": texts,
    "label": labels
})
# Convert numeric labels to text labels
df["label"] = df["label"].map({0: "negative", 1: "positive"})

print("Clean dataset loaded:", df.shape)
# -----------------------------
# PREPROCESS TEXT
# -----------------------------
df["clean_text"] = df["text"].apply(preprocess_text)
# -----------------------------
# TRAIN-TEST SPLIT
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    df["clean_text"],
    df["label"],
    test_size=0.2,
    random_state=42,
    stratify=df["label"]
)
# -----------------------------
# ML PIPELINE (ADVANCED)
# -----------------------------
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(
        ngram_range=(1, 2),   # unigram + bigram
        max_features=5000,
        min_df=2
    )),
    ("clf", LogisticRegression(
        max_iter=300,
        solver="lbfgs"
    ))
])
# -----------------------------
# TRAIN MODEL
# -----------------------------
pipeline.fit(X_train, y_train)
# -----------------------------
# EVALUATE MODEL
# -----------------------------
y_pred = pipeline.predict(X_test)
print("\n📊 MODEL PERFORMANCE:\n")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))
# -----------------------------
# SAVE MODEL
# -----------------------------
joblib.dump(pipeline, "backend/models/sentiment_model.pkl")

print("\n✅ Model trained and saved successfully!")