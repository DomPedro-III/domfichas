# DomFichas - Gerenciador de Fichas de RPG (Sistema Cairn)

MVP Full-Stack para validação de disciplina com foco no sistema Cairn.

## 🚀 Funcionalidades

- ✅ Autenticação segura (Registro/Login/Logout)
- ✅ CRUD completo para Fichas de Personagem (PJ)
- ✅ CRUD completo para Fichas de Ameaças/NPCs
- ✅ Design fiel à ficha original do Cairn
- ✅ Sistema de rolagem de dados com histórico
- ✅ Interface responsiva para desktop e mobile
- ✅ Persistência em PostgreSQL

## 🛠️ Tecnologias

**Backend:**
- Python 3.8+
- Flask
- PostgreSQL
- SQLite (desenvolvimento)

**Frontend:**
- HTML5, CSS3, JavaScript puro
- Design responsivo

## 📦 Instalação

### Backend

1. Navegue para a pasta backend:
```
cd backend
# DomFichas - Gerenciador de Fichas de RPG (Sistema Cairn)
```

MVP Full-Stack para validação de disciplina com foco no sistema Cairn.

## 🚀 Funcionalidades

- ✅ Autenticação segura (Registro/Login/Logout)
- ✅ CRUD completo para Fichas de Personagem (PJ)
- ✅ CRUD completo para Fichas de Ameaças/NPCs
- ✅ Design fiel à ficha original do Cairn
- ✅ Sistema de rolagem de dados com histórico
- ✅ Interface responsiva para desktop e mobile
- ✅ Persistência em PostgreSQL

## 🛠️ Tecnologias

**Backend:**
- Python 3.8+
- Flask
- PostgreSQL
- SQLite (desenvolvimento)

**Frontend:**
- HTML5, CSS3, JavaScript puro
- Design responsivo

## 📦 Instalação

### Backend

1. Navegue para a pasta backend:
```
cd backend
```

    Instale as dependências:

```
pip install -r requirements.txt
```

    Execute a aplicação:



python app.py

O backend estará disponível em http://localhost:5000
Frontend

    Navegue para a pasta frontend

    Sirva os arquivos com um servidor HTTP simples:



# Python 3
python -m http.server 8000

# Ou com Node.js
npx http-server

    Acesse http://localhost:8000

🗃️ Estrutura do Banco

O sistema utiliza as seguintes tabelas:

    users - Autenticação de usuários

    fichas_pj - Fichas de personagens jogadores

    fichas_ameaca - Fichas de ameaças/NPCs

    historico_rolagens - Histórico de rolagens de dados

📱 Uso

    Criação de Conta: Registre-se no sistema

    Login: Faça login com suas credenciais

    Gerenciar Fichas:

        Crie fichas de Personagem ou Ameaças

        Edite e visualize suas fichas

        Use o sistema de rolagem de dados integrado

    Rolagem de Dados:

        Clique nos botões de dados para rolar

        Histórico é mantido para referência

🔧 Configuração para Produção

Para deploy em produção:

    Configure variáveis de ambiente:

```

export FLASK_ENV=production
export DATABASE_URL=postgresql://user:pass@host:port/database

    Use um servidor WSGI como Gunicorn:

```

gunicorn app:app

📄 Licença

Desenvolvido para fins educacionais - Validação de Disciplina Full-Stack
text
