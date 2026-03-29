import re

DOMAIN_ISSUES = {
    "default": {
        "food_quality": ["cold", "tasteless", "bad food", "stale", "uncooked", "bland", "undercooked", "overcooked", "no taste", "awful food", "disgusting food"],
        "delay": ["slow", "late", "waiting", "delay", "long time", "took forever", "hours", "too long", "no response"],
        "cleanliness": ["dirty", "messy", "unclean", "smell", "hygiene", "filthy", "cockroach", "rat", "dusty", "unhygienic"],
        "staff_behavior": ["rude", "bad staff", "unfriendly", "arrogant", "impolite", "disrespectful", "unprofessional", "attitude", "ignorant"],
        "service": ["poor service", "not attentive", "ignored", "no service", "terrible service", "bad experience"],
        "pricing": ["expensive", "overpriced", "costly", "not worth", "waste of money", "too costly"],
        "facilities": ["broken", "not working", "no wifi", "no ac", "no hot water", "maintenance", "damaged", "outdated"],
        "noise": ["noisy", "loud", "disturbing", "noise", "cant sleep", "can't sleep"]
    },
    "Hospital": {
        "wait_time": ["waiting", "long wait", "hours", "delay", "slow", "took forever", "queue"],
        "staff_behavior": ["rude", "unprofessional", "doctor rude", "nurse rude", "impolite", "ignored"],
        "cleanliness": ["dirty", "unclean", "unhygienic", "smell", "filthy"],
        "treatment": ["wrong medicine", "wrong diagnosis", "bad treatment", "no treatment", "misdiagnosed"],
        "facilities": ["broken", "no equipment", "old equipment", "no bed", "no room"],
        "billing": ["overcharged", "expensive", "wrong bill", "extra charges"]
    },
    "Mess": {
        "food_quality": ["cold", "tasteless", "stale", "bad food", "uncooked", "bland", "no taste"],
        "hygiene": ["dirty", "unclean", "cockroach", "rat", "filthy", "unhygienic", "hair in food"],
        "quantity": ["less food", "not enough", "small portion", "hungry", "insufficient"],
        "variety": ["same food", "repetitive", "no variety", "boring menu", "no change"],
        "timing": ["late", "delay", "closed", "not on time", "timing bad"],
        "staff": ["rude", "bad behavior", "unfriendly", "arrogant"]
    },
    "Hostel": {
        "cleanliness": ["dirty", "unclean", "unhygienic", "smell", "filthy", "cockroach"],
        "facilities": ["broken", "no wifi", "no hot water", "no ac", "maintenance", "damaged"],
        "noise": ["noisy", "loud", "disturbing", "cant sleep"],
        "security": ["unsafe", "no security", "theft", "stolen", "not safe"],
        "staff": ["rude", "warden rude", "unfriendly", "unhelpful"],
        "room": ["small room", "no space", "dirty room", "broken bed", "no ventilation"]
    }
}

def normalize_text(text):
    return re.sub(r"[^\w\s]", "", text.lower())

def detect_issues(text, domain="default"):
    text = normalize_text(text)
    issue_map = DOMAIN_ISSUES.get(domain, DOMAIN_ISSUES["default"])
    detected = []
    for issue, keywords in issue_map.items():
        for keyword in keywords:
            if keyword in text:
                detected.append(issue)
                break
    return detected