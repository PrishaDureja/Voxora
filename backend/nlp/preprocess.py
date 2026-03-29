import re
import string
import nltk

nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('wordnet', quiet=True)

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

STOP_WORDS = set(stopwords.words('english'))
LEMMATIZER = WordNetLemmatizer()

# Keep negation words — critical for sentiment
NEGATION_WORDS = {'not', 'no', 'never', 'neither', 'nor', 'barely',
                  'hardly', 'wasnt', "wasn't", 'didnt', "didn't",
                  'couldnt', "couldn't", 'isnt', "isn't", 'dont',
                  "don't", 'wouldnt', "wouldn't", 'cant', "can't"}
STOP_WORDS = STOP_WORDS - NEGATION_WORDS

def handle_negation(tokens):
    """Convert 'not clean' → 'not_clean', 'wasnt good' → 'wasnt_good'"""
    result = []
    i = 0
    while i < len(tokens):
        if tokens[i] in NEGATION_WORDS and i + 1 < len(tokens):
            result.append(f"{tokens[i]}_{tokens[i+1]}")
            i += 2
        else:
            result.append(tokens[i])
            i += 1
    return result

def preprocess_text(text: str) -> str:
    # Normalise common contractions first
    text = text.lower().strip()
    text = text.replace("wasn't", "wasnt").replace("didn't", "didnt")
    text = text.replace("can't", "cant").replace("don't", "dont")
    text = text.replace("won't", "wont").replace("isn't", "isnt")
    text = text.replace("couldn't", "couldnt").replace("wouldn't", "wouldnt")
    text = text.replace("never coming", "never_coming")
    text = text.replace("not good", "not_good").replace("not clean", "not_clean")
    text = text.replace("not worth", "not_worth").replace("not satisfied", "not_satisfied")

    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\d+", "", text)
    text = text.translate(str.maketrans('', '', string.punctuation))

    tokens = word_tokenize(text)
    tokens = handle_negation(tokens)
    tokens = [w for w in tokens if w not in STOP_WORDS]
    tokens = [LEMMATIZER.lemmatize(w) for w in tokens]
    return " ".join(tokens)

def extract_keywords(text: str) -> list:
    text_lower = text.lower()
    text_clean = re.sub(r"[^\w\s]", "", text_lower)
    tokens = word_tokenize(text_clean)
    keywords = [w for w in tokens if w not in STOP_WORDS and len(w) > 3]
    seen = set()
    result = []
    for k in keywords:
        if k not in seen:
            seen.add(k)
            result.append(k)
        if len(result) == 6:
            break
    return result

def extract_aspects(text: str) -> list:
    """
    Simple aspect-based sentiment:
    Splits on conjunctions and analyses each part separately.
    Returns list of {aspect, sentiment} dicts.
    """
    ASPECT_KEYWORDS = {
        'food': ['food', 'meal', 'dish', 'taste', 'flavour', 'flavor', 'cook', 'menu', 'portion'],
        'staff': ['staff', 'service', 'waiter', 'manager', 'employee', 'nurse', 'doctor', 'worker'],
        'cleanliness': ['clean', 'dirty', 'hygiene', 'smell', 'tidy', 'messy', 'filthy'],
        'ambiance': ['ambiance', 'atmosphere', 'noise', 'music', 'decor', 'environment', 'place'],
        'price': ['price', 'cost', 'expensive', 'cheap', 'value', 'worth', 'overpriced'],
        'speed': ['slow', 'fast', 'quick', 'delay', 'wait', 'time', 'speed'],
    }
    NEGATIVE_SIGNALS = ['bad', 'terrible', 'awful', 'poor', 'horrible', 'rude',
                        'dirty', 'slow', 'cold', 'stale', 'not good', "wasn't good", 'wasnt good',
                        'not clean', "wasn't clean", 'wasnt clean', 'never', 'worst', 'disgusting',
                        'never coming back', "won't return", 'wont return', 'terrible service']
    POSITIVE_SIGNALS = ['good', 'great', 'excellent', 'amazing', 'wonderful',
                        'clean', 'fast', 'friendly', 'best', 'love', 'perfect', 'loved']

    text_lower = text.lower()
    # Split on conjunctions
    parts = re.split(r'\bbut\b|\bhowever\b|\bthough\b|\balthough\b|\byet\b', text_lower)

    aspects_found = []
    for part in parts:
        part = part.strip()
        detected_aspect = None
        for aspect, keywords in ASPECT_KEYWORDS.items():
            if any(kw in part for kw in keywords):
                detected_aspect = aspect
                break

        sentiment = 'neutral'
        if any(sig in part for sig in NEGATIVE_SIGNALS):
            sentiment = 'negative'
        elif any(sig in part for sig in POSITIVE_SIGNALS):
            sentiment = 'positive'

        if detected_aspect and sentiment != 'neutral':
            aspects_found.append({'aspect': detected_aspect, 'sentiment': sentiment})

    return aspects_found