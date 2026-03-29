from collections import Counter
from datetime import datetime, timedelta

def generate_insights(feedback_list):
    if not feedback_list:
        return {
            "total_count": 0,
            "positive_count": 0,
            "negative_count": 0,
            "top_issue": None,
            "secondary_issue": None,
            "insight_message": "No feedback submitted yet.",
            "issue_breakdown": {},
            "trend": []
        }

    sentiments = [fb.get("sentiment", "") for fb in feedback_list]
    all_issues = []
    for fb in feedback_list:
        all_issues.extend(fb.get("issues", []))

    total = len(sentiments)
    positive = sentiments.count("positive")
    negative = sentiments.count("negative")

    # Time Trend Calculation
    trend_dict = {}
    for fb in feedback_list:
        date_str = fb.get("created_at", "")
        if date_str:
            date_key = date_str[:10]
            if date_key not in trend_dict:
                trend_dict[date_key] = {"date": date_key, "positive": 0, "negative": 0}
            sen = fb.get("sentiment", "neutral")
            if sen in ["positive", "negative"]:
                trend_dict[date_key][sen] += 1
    
    trend = sorted(trend_dict.values(), key=lambda x: x["date"])

    issue_counts = Counter(all_issues)
    top_issues = issue_counts.most_common(2)
    top_issue = top_issues[0][0] if len(top_issues) > 0 else None
    secondary_issue = top_issues[1][0] if len(top_issues) > 1 else None

    negative_pct = round((negative / total) * 100) if total > 0 else 0

    if negative_pct >= 70:
        insight_message = "Overall experience is poor. Immediate action required."
    elif negative_pct >= 50:
        issue_label = top_issue.replace('_', ' ').title() if top_issue else "Several issues"
        insight_message = f"{issue_label} is a major concern right now."
    elif top_issue:
        issue_label = top_issue.replace('_', ' ').title()
        insight_message = f"{issue_label} is the most reported issue. Consider addressing it."
    else:
        insight_message = "Overall feedback is positive. Keep it up!"

    # Action Triage Generation (The Banger Feature)
    negative_issues_counter = Counter()
    for fb in feedback_list:
        if fb.get("sentiment") == "negative":
            for issue in fb.get("issues", []):
                negative_issues_counter[issue] += 1
                
    action_items = []
    
    ACTION_MAP = {
        "cleanliness": "Dispatch cleaning crew to address hygiene complaints.",
        "food_quality": "Review current kitchen batch for quality control deviations.",
        "delay": "Investigate bottleneck causing critical service delays.",
        "wait_time": "Investigate bottleneck causing critical service delays.",
        "staff_behavior": "Schedule conduct review with current shift staff.",
        "staff": "Schedule conduct review with current shift staff.",
        "pricing": "Review pricing tier complaints for potential misalignments.",
        "noise": "Dispatch personnel to enforce quiet hours / noise control.",
        "facilities": "Schedule maintenance check for reported facility issues."
    }

    for idx, (issue, count) in enumerate(negative_issues_counter.most_common(5)):
        urgency = "critical" if count >= 3 else "high" if count == 2 else "medium"
        title = ACTION_MAP.get(issue.lower(), f"Investigate recurring negative reports regarding {issue.replace('_', ' ')}.")
        action_items.append({
            "id": f"act_{idx}_{issue}",
            "title": title,
            "urgency": urgency,
            "count": count,
            "issue": issue.replace('_', ' ').title()
        })

    return {
        "total_count": total,
        "positive_count": positive,
        "negative_count": negative,
        "top_issue": top_issue,
        "secondary_issue": secondary_issue,
        "insight_message": insight_message,
        "issue_breakdown": dict(issue_counts),
        "trend": trend,
        "action_items": action_items
    }