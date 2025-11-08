from flask import Blueprint, request, jsonify, session
from database import get_db
import hashlib
import secrets

auth_bp = Blueprint('auth', __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username e password são obrigatórios"}), 400
    
    db = get_db()
    
    # Verificar se usuário já existe
    existing_user = db.execute(
        'SELECT id FROM users WHERE username = ?', (username,)
    ).fetchone()
    
    if existing_user:
        return jsonify({"error": "Usuário já existe"}), 400
    
    # Criar usuário
    password_hash = hash_password(password)
    db.execute(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        (username, password_hash)
    )
    db.commit()
    
    return jsonify({"message": "Usuário criado com sucesso"})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username e password são obrigatórios"}), 400
    
    db = get_db()
    user = db.execute(
        'SELECT * FROM users WHERE username = ?', (username,)
    ).fetchone()
    
    if user and user['password_hash'] == hash_password(password):
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({
            "message": "Login realizado com sucesso",
            "user_id": user['id'],
            "username": user['username']
        })
    
    return jsonify({"error": "Credenciais inválidas"}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout realizado com sucesso"})

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    user_id = session.get('user_id')
    if user_id:
        return jsonify({"authenticated": True, "user_id": user_id})
    return jsonify({"authenticated": False}), 401