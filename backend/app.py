import random
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from database import init_db, get_db
from auth import auth_bp
import models
import json

app = Flask(__name__)
app.secret_key = 'domfichas_secret_key_2024'
app.config['SESSION_TYPE'] = 'filesystem'
CORS(app, supports_credentials=True)

# Registrar blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/')
def home():
    return jsonify({"message": "DomFichas API - Sistema Cairn"})

# Rotas para Fichas de Personagem
@app.route('/api/fichas/pj', methods=['GET', 'POST'])
def fichas_pj():
    db = get_db()
    
    if request.method == 'GET':
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Não autenticado"}), 401
            
        fichas = db.execute(
            'SELECT * FROM fichas_pj WHERE user_id = ?', (user_id,)
        ).fetchall()
        
        return jsonify([dict(ficha) for ficha in fichas])
    
    elif request.method == 'POST':
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Não autenticado"}), 401
            
        data = request.json
        db.execute('''
            INSERT INTO fichas_pj 
            (user_id, nome, ocupacao, raca, hp_atual, hp_max, armadura, gp, str, dex, wil, 
             inventario, mao, spellbooks, notas, fadiga, privado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id, data['nome'], data['ocupacao'], data['raca'],
            data['hp_atual'], data['hp_max'], data['armadura'], data['gp'],
            data['str'], data['dex'], data['wil'], 
            json.dumps(data['inventario']), data['mao'],
            json.dumps(data['spellbooks']), data['notas'],
            data['fadiga'], data['privado']
        ))
        db.commit()
        
        return jsonify({"message": "Ficha criada com sucesso"})

@app.route('/api/fichas/pj/<int:ficha_id>', methods=['GET', 'PUT', 'DELETE'])
def ficha_pj(ficha_id):
    db = get_db()
    user_id = session.get('user_id')
    
    if request.method == 'GET':
        ficha = db.execute(
            'SELECT * FROM fichas_pj WHERE id = ? AND user_id = ?', 
            (ficha_id, user_id)
        ).fetchone()
        
        if ficha:
            ficha_dict = dict(ficha)
            ficha_dict['inventario'] = json.loads(ficha_dict['inventario'])
            ficha_dict['spellbooks'] = json.loads(ficha_dict['spellbooks'])
            return jsonify(ficha_dict)
        return jsonify({"error": "Ficha não encontrada"}), 404
    
    elif request.method == 'PUT':
        data = request.json
        db.execute('''
            UPDATE fichas_pj SET
            nome=?, ocupacao=?, raca=?, hp_atual=?, hp_max=?, armadura=?, gp=?,
            str=?, dex=?, wil=?, inventario=?, mao=?, spellbooks=?, notas=?,
            fadiga=?, privado=?
            WHERE id=? AND user_id=?
        ''', (
            data['nome'], data['ocupacao'], data['raca'],
            data['hp_atual'], data['hp_max'], data['armadura'], data['gp'],
            data['str'], data['dex'], data['wil'], 
            json.dumps(data['inventario']), data['mao'],
            json.dumps(data['spellbooks']), data['notas'],
            data['fadiga'], data['privado'], ficha_id, user_id
        ))
        db.commit()
        return jsonify({"message": "Ficha atualizada"})
    
    elif request.method == 'DELETE':
        db.execute(
            'DELETE FROM fichas_pj WHERE id = ? AND user_id = ?',
            (ficha_id, user_id)
        )
        db.commit()
        return jsonify({"message": "Ficha deletada"})

# Rotas para Fichas de Ameaça
@app.route('/api/fichas/ameaca', methods=['GET', 'POST'])
def fichas_ameaca():
    db = get_db()
    
    if request.method == 'GET':
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Não autenticado"}), 401
            
        fichas = db.execute(
            'SELECT * FROM fichas_ameaca WHERE user_id = ?', (user_id,)
        ).fetchall()
        
        return jsonify([dict(ficha) for ficha in fichas])
    
    elif request.method == 'POST':
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Não autenticado"}), 401
            
        data = request.json
        db.execute('''
            INSERT INTO fichas_ameaca 
            (user_id, nome, hp, armadura, str, dex, wil, habilidades, tesouros)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id, data['nome'], data['hp'], data['armadura'],
            data['str'], data['dex'], data['wil'], 
            data['habilidades'], data['tesouros']
        ))
        db.commit()
        
        return jsonify({"message": "Ameaça criada com sucesso"})

@app.route('/api/fichas/ameaca/<int:ficha_id>', methods=['GET', 'PUT', 'DELETE'])
def ficha_ameaca(ficha_id):
    db = get_db()
    user_id = session.get('user_id')
    
    if request.method == 'GET':
        ficha = db.execute(
            'SELECT * FROM fichas_ameaca WHERE id = ? AND user_id = ?', 
            (ficha_id, user_id)
        ).fetchone()
        
        if ficha:
            return jsonify(dict(ficha))
        return jsonify({"error": "Ficha não encontrada"}), 404
    
    elif request.method == 'PUT':
        data = request.json
        db.execute('''
            UPDATE fichas_ameaca SET
            nome=?, hp=?, armadura=?, str=?, dex=?, wil=?, habilidades=?, tesouros=?
            WHERE id=? AND user_id=?
        ''', (
            data['nome'], data['hp'], data['armadura'],
            data['str'], data['dex'], data['wil'], 
            data['habilidades'], data['tesouros'], ficha_id, user_id
        ))
        db.commit()
        return jsonify({"message": "Ameaça atualizada"})
    
    elif request.method == 'DELETE':
        db.execute(
            'DELETE FROM fichas_ameaca WHERE id = ? AND user_id = ?',
            (ficha_id, user_id)
        )
        db.commit()
        return jsonify({"message": "Ameaça deletada"})

# Rota para rolagem de dados
@app.route('/api/rolar-dados', methods=['POST'])
def rolar_dados():
    data = request.json
    tipo_dado = data.get('tipo', 'd20')
    ficha_id = data.get('ficha_id')
    ficha_tipo = data.get('ficha_tipo')
    
    # Simular rolagem
    if tipo_dado == 'd20':
        resultado = random.randint(1, 20)
    elif tipo_dado == 'd6':
        resultado = random.randint(1, 6)
    elif tipo_dado == 'd10':
        resultado = random.randint(1, 10)
    elif tipo_dado == 'd4':
        resultado = random.randint(1, 4)
    else:
        # Extrair número do dado (ex: "d8" -> 8)
        try:
            faces = int(tipo_dado[1:])
            resultado = random.randint(1, faces)
        except:
            resultado = random.randint(1, 20)
    
    # Salvar no histórico
    db = get_db()
    user_id = session.get('user_id')
    if user_id:
        db.execute('''
            INSERT INTO historico_rolagens 
            (user_id, ficha_id, ficha_tipo, tipo_dado, resultado)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, ficha_id, ficha_tipo, tipo_dado, resultado))
        db.commit()
    
    return jsonify({"resultado": resultado, "tipo": tipo_dado})

@app.route('/api/historico-rolagens', methods=['GET'])
def historico_rolagens():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Não autenticado"}), 401
    
    db = get_db()
    historico = db.execute(
        'SELECT * FROM historico_rolagens WHERE user_id = ? ORDER BY data_hora DESC LIMIT 10',
        (user_id,)
    ).fetchall()
    
    return jsonify([dict(item) for item in historico])

if __name__ == '__main__':
    init_db()
    app.run(debug=True)