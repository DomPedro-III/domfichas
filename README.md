# DomFichas

## Descrição
Sistema de gerenciamento de fichas de RPG para o sistema **Cairn**. Permite criar, editar e gerenciar fichas de personagens de forma intuitiva e organizada, com sistema de rolagem de dados integrado.

## Tecnologias Utilizadas
- PHP 8.2
- MySQL 10.4 (MariaDB)
- XAMPP
- HTML5, CSS3, JavaScript
- Bootstrap 5

## Pré-requisitos
- XAMPP instalado
- PHP 8.2
- MySQL 10.4
- Navegador web moderno

## Instalação e Configuração

### 1. Configuração do XAMPP
```bash
# Inicie o XAMPP e ative os serviços:
- Apache
- MySQL
```

### 2. Configurar o Projeto
```bash
# Copie a pasta do projeto para:
C:\xampp\htdocs\domfichas\
```

### 3. Configurar Banco de Dados

#### Via phpMyAdmin
1. Acesse: `http://localhost/phpmyadmin`
2. Crie um novo banco de dados: `domdb`
3. Importe o arquivo SQL: `DomFichasDB.sql`

#### Via Linha de Comando
```sql
-- Conecte ao MySQL:
mysql -u root -p

-- Importe o dump:
source caminho/para/DomFichasDB.sql;
```

## Inicialização do Projeto

### Opção A: Via XAMPP (Recomendada)
1. **Inicie o XAMPP**
   - Abra o XAMPP Control Panel
   - Inicie os serviços **Apache** e **MySQL**

2. **Acesse o Projeto**
   - Abra seu navegador
   - Acesse: `http://localhost/domfichas/`

### Opção B: Via PHP Built-in Server
```bash
# Navegue até a pasta do projeto e execute:
php -S localhost:8000 -t C:\xampp\htdocs\domfichas\

# Em seguida, acesse no navegador:
http://localhost:8000/
```

## Primeiro Acesso
1. Na página inicial, clique em "Registrar"
2. Crie uma conta com usuário e senha
3. Faça login com suas credenciais
4. Comece criando sua primeira ficha!

## Funcionalidades do Sistema

### Gerenciamento de Fichas
- Criação de fichas Cairn
- Edição de personagens
- Visualização detalhada
- Exclusão de fichas
- Atributos: Força, Destreza, Vontade
- Sistema de HP e Armadura
- Gerenciamento de moedas (Cobre, Prata, Ouro)
- Inventário e anotações

### Sistema de Dados
- Rolagem de dados (d4, d6, d8, d10, d12, d20, d100)
- Histórico de rolagens
- Salvamento automático no banco de dados

### Autenticação
- Sistema de registro e login
- Sessões seguras
- Logout seguro

## Estrutura do Projeto
```
domfichas/
├── index.php
├── core/
│   ├── Controller.php
│   └── Database.php
├── app/
│   ├── controllers/
│   │   ├── AuthController.php
│   │   └── BaseController.php
│   ├── models/
│   │   ├── User.php
│   │   ├── Sheets.php
│   │   └── Dados.php
│   └── views/
│       ├── login.php
│       ├── registro.php
│       ├── dashboard.php
│       ├── fixa.php
│       └── ver.php
├── DomFichasDB.sql
└── README.md
```

## Estrutura do Banco de Dados

### Tabelas Principais
- **users**: Armazena usuários do sistema
- **sheets**: Armazena as fichas de personagens
- **dices**: Armazena o histórico de rolagens de dados

## Configurações Importantes

### Configuração do PHP (php.ini)
Verifique se estas extensões estão habilitadas:
```ini
extension=mysqli
extension=pdo_mysql
```

### Configuração da Conexão
O arquivo `Database.php` contém as configurações de conexão:
```php
return new PDO('mysql:host=localhost;dbname=domdb', 'root', '');
```

## Solução de Problemas Comuns

### Erro de Conexão com Banco
```php
// Verifique no Database.php:
$host = 'localhost';
$dbname = 'domdb';
$username = 'root';
$password = ''; // Vazio por padrão no XAMPP
```

### Página não carrega
- Verifique se o Apache está rodando
- Confirme se a pasta está em `htdocs/domfichas/`
- Verifique permissões de arquivo

### Banco não encontrado
- Certifique-se que o banco `domdb` foi criado
- Verifique se o dump SQL foi importado corretamente

### Problemas com Sessões
- Verifique se as sessões estão habilitadas no PHP
- Confirme que não há output antes do `session_start()`

## URLs do Sistema

- **Login**: `http://localhost/domfichas/?c=auth&a=login`
- **Registro**: `http://localhost/domfichas/?c=auth&a=registro`
- **Dashboard**: `http://localhost/domfichas/?c=auth&a=dashboard`
- **Nova Ficha**: `http://localhost/domfichas/?c=base&a=fixa`
- **Visualizar Ficha**: `http://localhost/domfichas/?c=base&a=ver&id=ID_DA_FICHA`

## Suporte

Em caso de problemas durante a instalação:
1. Verifique se todos os serviços do XAMPP estão ativos (verdes)
2. Confirme a estrutura de diretórios
3. Valide as credenciais do banco de dados
4. Verifique se o arquivo `DomFichasDB.sql` foi importado corretamente

Para problemas com o sistema:
- Verifique os logs do Apache em `xampp/apache/logs/`
- Confirme as permissões dos arquivos PHP

---

**Desenvolvido para mestres e jogadores de Cairn RPG**

*Sistema otimizado para PHP 8.2 e MySQL 10.4*