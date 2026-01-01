import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = "comments.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/comments", methods=["GET"])
def get_comments():
    post_id = request.args.get("post")

    if not post_id:
        return jsonify({"error": "post required"}), 400

    db = get_db()
    rows = db.execute(
        "SELECT author, text, created_at FROM comments WHERE post_id = ? ORDER BY created_at ASC",
        (post_id,)
    ).fetchall()
    db.close()

    return jsonify([dict(row) for row in rows])

@app.route("/comments", methods=["POST"])
def add_comment():
    data = request.get_json()

    required = ("post", "author", "text")
    if not all(k in data for k in required):
        return jsonify({"error": "missing fields"}), 400

    db = get_db()
    db.execute(
        "INSERT INTO comments (post_id, author, text) VALUES (?, ?, ?)",
        (data["post"], data["author"], data["text"])
    )
    db.commit()
    db.close()

    return jsonify({"status": "ok"}), 201

def init_db():
    db = get_db()
    with open("schema.sql") as f:
        db.executescript(f.read())
    db.close()

init_db()