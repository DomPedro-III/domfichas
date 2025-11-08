import sqlite3
import os

DATABASE = 'domfichas.db'

def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    db = get_db()
    
    # Importar e inicializar modelos
    from models import init_models
    init_models()
    
    db.close()