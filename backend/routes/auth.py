from flask import Blueprint, request, jsonify
from backend.database import get_connection
import hashlib

auth_bp = Blueprint("auth", __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@auth_bp.route("/auth/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    domain = data.get("domain")

    if not all([name, email, password, role, domain]):
        return jsonify({"error": "All fields required"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (name, email, password, role, domain) VALUES (?, ?, ?, ?, ?)",
            (name, email, hash_password(password), role, domain)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return jsonify({"message": "Registered successfully", "user": {
            "id": user_id, "name": name, "email": email, "role": role, "domain": domain
        }})
    except Exception as e:
        return jsonify({"error": "Email already registered"}), 400

@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    if not all([email, password]):
        return jsonify({"error": "Email and password required"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, role, domain FROM users WHERE email=? AND password=?",
        (email, hash_password(password))
    )
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"id": user[0], "name": user[1], "role": user[2], "domain": user[3]})
    return jsonify({"error": "Invalid credentials"}), 401