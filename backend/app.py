from flask import Flask
from flask_cors import CORS
from backend.routes.feedback import feedback_bp
from backend.routes.auth import auth_bp
from backend.database import init_db

app = Flask(__name__)
CORS(app)
init_db()

app.register_blueprint(feedback_bp)
app.register_blueprint(auth_bp)

@app.route('/')
def home():
    return {"message": "Voxora Backend Running"}

if __name__ == '__main__':
    app.run(debug=True, port=5002)