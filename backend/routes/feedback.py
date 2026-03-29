from flask import Blueprint, request, jsonify
import json
from backend.models.model import predict_sentiment, get_aspects
from backend.utils.issue_detector import detect_issues
from backend.utils.insight_engine import generate_insights
from backend.nlp.preprocess import extract_keywords
from backend.database import get_connection

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/feedback/analyze", methods=["POST"])
def analyze_feedback():
    data = request.json
    text = data.get("text", "")
    domain = data.get("domain", "default")
    mood = data.get("mood", None)
    selected_issues = data.get("selected_issues", [])

    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = predict_sentiment(text)
    issues = detect_issues(text, domain)
    keywords = extract_keywords(text)
    aspects = get_aspects(text)
    all_issues = list(set(issues + selected_issues))

    if mood == "negative" and result["sentiment"] == "positive":
        result["sentiment"] = "negative"
        result["confidence"] = round(min(result["confidence"] + 10, 95), 1)
    elif mood == "positive" and result["sentiment"] == "negative":
        result["sentiment"] = "positive"
        result["confidence"] = round(min(result["confidence"] + 10, 95), 1)

    return jsonify({
        "text": text,
        "sentiment": result["sentiment"],
        "confidence": result["confidence"],
        "issues": all_issues,
        "keywords": keywords,
        "aspects": aspects,
        "mood": mood
    })

@feedback_bp.route("/feedback/submit", methods=["POST"])
def submit_feedback():
    data = request.json
    text = data.get("text", "")
    domain = data.get("domain", "general")
    user_id = data.get("user_id")
    mood = data.get("mood", None)
    selected_issues = data.get("selected_issues", [])

    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = predict_sentiment(text)
    issues = detect_issues(text, domain)
    keywords = extract_keywords(text)
    all_issues = list(set(issues + selected_issues))

    if mood == "negative" and result["sentiment"] == "positive":
        result["sentiment"] = "negative"
    elif mood == "positive" and result["sentiment"] == "negative":
        result["sentiment"] = "positive"

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO feedback (text, sentiment, confidence, issues, keywords, mood, selected_issues, domain, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        text, result["sentiment"], result["confidence"],
        json.dumps(all_issues), json.dumps(keywords),
        mood, json.dumps(selected_issues), domain, user_id
    ))
    conn.commit()
    conn.close()

    return jsonify({
        "sentiment": result["sentiment"],
        "confidence": result["confidence"],
        "issues": all_issues,
        "keywords": keywords
    })

@feedback_bp.route("/feedback/dashboard", methods=["GET"])
def dashboard():
    domain = request.args.get("domain")
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT sentiment, issues, keywords, text, created_at, confidence FROM feedback"
    params = []
    if domain:
        query += " WHERE domain=?"
        params.append(domain)
    query += " ORDER BY created_at DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    feedback_list = []
    recent_feedback = []
    all_keywords = []

    for row in rows:
        sentiment, issues, keywords, text, created_at, confidence = row
        try:
            parsed_issues = json.loads(issues) if issues else []
            parsed_keywords = json.loads(keywords) if keywords else []
        except:
            parsed_issues = []
            parsed_keywords = []

        feedback_list.append({
            "sentiment": sentiment,
            "issues": parsed_issues,
            "keywords": parsed_keywords,
            "created_at": created_at
        })
        all_keywords.extend(parsed_keywords)

        if len(recent_feedback) < 10:
            recent_feedback.append({
                "text": text[:120] + "..." if text and len(text) > 120 else text,
                "sentiment": sentiment,
                "confidence": confidence,
                "issues": parsed_issues,
                "keywords": parsed_keywords,
                "created_at": created_at
            })

    insights = generate_insights(feedback_list)
    insights["recent_feedback"] = recent_feedback

    # Keyword frequency for word cloud
    from collections import Counter
    kw_counts = Counter(all_keywords)
    insights["keyword_freq"] = [{"word": w, "count": c} for w, c in kw_counts.most_common(12)]

    return jsonify(insights)

@feedback_bp.route("/feedback/suggestions", methods=["GET"])
def get_suggestions():
    domain = request.args.get("domain")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, text, upvotes, created_at FROM suggestions WHERE domain=? ORDER BY upvotes DESC",
        (domain,)
    )
    rows = cursor.fetchall()
    conn.close()
    return jsonify([{"id": r[0], "text": r[1], "upvotes": r[2], "created_at": r[3]} for r in rows])

@feedback_bp.route("/feedback/suggestions", methods=["POST"])
def add_suggestion():
    data = request.json
    text = data.get("text", "")
    domain = data.get("domain", "general")
    if not text:
        return jsonify({"error": "No text"}), 400
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO suggestions (text, domain) VALUES (?, ?)", (text, domain))
    conn.commit()
    conn.close()
    return jsonify({"message": "Suggestion added"})

@feedback_bp.route("/feedback/suggestions/<int:suggestion_id>/upvote", methods=["POST"])
def upvote_suggestion(suggestion_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE suggestions SET upvotes = upvotes + 1 WHERE id=?", (suggestion_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Upvoted"})

@feedback_bp.route("/feedback/polls", methods=["GET"])
def get_polls():
    domain = request.args.get("domain")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, question, created_at FROM polls WHERE domain=? ORDER BY created_at DESC LIMIT 5",
        (domain,)
    )
    polls = cursor.fetchall()
    result = []
    for poll in polls:
        cursor.execute("SELECT id, option_text, votes FROM poll_options WHERE poll_id=?", (poll[0],))
        options = cursor.fetchall()
        result.append({
            "id": poll[0], "question": poll[1], "created_at": poll[2],
            "options": [{"id": o[0], "text": o[1], "votes": o[2]} for o in options]
        })
    conn.close()
    return jsonify(result)

@feedback_bp.route("/feedback/polls", methods=["POST"])
def create_poll():
    data = request.json
    question = data.get("question", "")
    options = data.get("options", [])
    domain = data.get("domain", "general")
    if not question or len(options) < 2:
        return jsonify({"error": "Need question and at least 2 options"}), 400
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO polls (question, domain) VALUES (?, ?)", (question, domain))
    poll_id = cursor.lastrowid
    for opt in options:
        cursor.execute("INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)", (poll_id, opt))
    conn.commit()
    conn.close()
    return jsonify({"message": "Poll created", "poll_id": poll_id})

@feedback_bp.route("/feedback/polls/<int:option_id>/vote", methods=["POST"])
def vote_poll(option_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE poll_options SET votes = votes + 1 WHERE id=?", (option_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Vote recorded"})