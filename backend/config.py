import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'domfichas_secret_key_2024'
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///domfichas.db'
    
    # Configurações para PostgreSQL
    if DATABASE_URL.startswith('postgresql'):
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///domfichas.db'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False