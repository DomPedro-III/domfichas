from models.database import get_db


def init_models():
    db = get_db()
    
    # Tabela de usuários
    db.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabela de fichas de personagem (PJ)
    db.execute('''
        CREATE TABLE IF NOT EXISTS fichas_pj (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            ocupacao TEXT,
            raca TEXT,
            hp_atual INTEGER DEFAULT 0,
            hp_max INTEGER DEFAULT 0,
            armadura INTEGER DEFAULT 0,
            gp INTEGER DEFAULT 0,
            str INTEGER DEFAULT 10,
            dex INTEGER DEFAULT 10,
            wil INTEGER DEFAULT 10,
            inventario TEXT DEFAULT '[]',
            mao TEXT DEFAULT '',
            spellbooks TEXT DEFAULT '[]',
            notas TEXT DEFAULT '',
            fadiga BOOLEAN DEFAULT 0,
            privado BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Tabela de fichas de ameaças/NPCs
    db.execute('''
        CREATE TABLE IF NOT EXISTS fichas_ameaca (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            hp INTEGER DEFAULT 0,
            armadura INTEGER DEFAULT 0,
            str INTEGER DEFAULT 10,
            dex INTEGER DEFAULT 10,
            wil INTEGER DEFAULT 10,
            habilidades TEXT DEFAULT '',
            tesouros TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Tabela de histórico de rolagens
    db.execute('''
        CREATE TABLE IF NOT EXISTS historico_rolagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            ficha_id INTEGER,
            ficha_tipo TEXT,
            tipo_dado TEXT NOT NULL,
            resultado INTEGER NOT NULL,
            data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    db.commit()