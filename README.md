# DomFichas

## Descrição
Sistema completo de gerenciamento de fichas de RPG para o sistema **Cairn**. Permite criar, editar, visualizar e gerenciar fichas de personagens de forma intuitiva e organizada, com sistema de rolagem de dados integrado e histórico completo.

## Tecnologias Utilizadas
- PHP 8.2
- MySQL 10.4 (MariaDB)
- XAMPP
- HTML5, CSS3, JavaScript
- Bootstrap 5
- jQuery

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

## FUNCIONALIDADES IMPLEMENTADAS

### **Sistema de Autenticação**
- **Registro de Usuários**: Formulário completo com confirmação de senha
- **Login Seguro**: Validação de credenciais no banco de dados
- **Gestão de Sessões**: Controle de acesso às páginas protegidas
- **Logout**: Encerramento seguro de sessões

### **Gerenciamento de Usuários**
- **Modelo User**: Classe dedicada para operações de usuário
- **Login Seguro**: Consultas preparadas para prevenir SQL injection
- **Registro Automático**: Criação de conta e login automático

### **Sistema Completo de Fichas RPG (Cairn)**

#### **Atributos do Personagem**
- **Atributos Principais**: Força (STR), Destreza (DEX), Vontade (WIL)
- **Valores Atuais e Máximos**: Controle individual para cada atributo
- **Sistema de HP**: Hit Protection com valores atual e máximo
- **Defesa**: Sistema de armadura (Armor)

#### **Sistema Econômico**
- **Moedas Múltiplas**: 
  - Copper Coins (Cobre)
  - Silver Coins (Prata) 
  - Golden Coins (Ouro)

#### **Seções de Texto**
- **Inventário**: Gerenciamento completo de equipamentos e itens
- **Anotações**: Espaço livre para observações do jogador

### **Sistema de Rolagem de Dados Integrado**

#### **Tipos de Dados Suportados**
- d4, d6, d8, d10, d12, d20, d100
- Interface intuitiva com botões dedicados

#### **Histórico de Rolagens**
- **Armazenamento Automático**: Todas as rolagens são salvas no banco
- **Visualização em Tempo Real**: Atualização imediata do histórico
- **Metadados Completos**:
  - Tipo de dado rolado
  - Resultado obtido
  - Data e hora precisa da rolagem
  - Associação com a ficha específica

#### **Tecnologia do Sistema de Dados**
- **AJAX**: Rolagens sem recarregar a página
- **Interface Responsiva**: Feedback visual imediato
- **Persistência**: Dados salvos permanentemente no MySQL

### **Operações CRUD Completas para Fichas**

#### **CREATE - Criação**
- Formulário completo de nova ficha
- Validação de campos obrigatórios
- Associação automática com usuário logado

#### **READ - Leitura/Visualização**
- **Dashboard**: Listagem de todas as fichas do usuário
- **Visualização Detalhada**: Página dedicada para cada ficha
- **Layout Dividido**: Ficha + Sistema de dados lado a lado

#### **UPDATE - Edição**
- Formulário de edição pré-preenchido
- Atualização em tempo real no banco de dados
- Preservação de todos os dados existentes

#### **DELETE - Exclusão**
- Exclusão lógica (soft delete)
- Preservação de dados históricos
- Interface de confirmação

### **Arquitetura do Sistema**

#### **Padrão MVC (Model-View-Controller)**
- **Models**: `User.php`, `Sheets.php`, `Dados.php`
- **Views**: `login.php`, `dashboard.php`, `fixa.php`, `ver.php`
- **Controllers**: `AuthController.php`, `BaseController.php`

#### **Sistema de Roteamento**
- URLs amigáveis: `/?c=controller&a=action`
- Controle centralizado via `index.php`
- Organização lógica de funcionalidades

#### **Camada de Banco de Dados**
- **Conexão Centralizada**: Classe `Database.php`
- **Consultas Preparadas**: Prevenção contra SQL injection
- **Transações Seguras**: Tratamento de erros com try/catch

### **Interface do Usuário**

#### **Design Responsivo**
- **Bootstrap 5**: Interface moderna e profissional
- **Layout Adaptável**: Funciona em desktop e mobile
- **Componentes UI**: Cards, tabelas, formulários estilizados

#### **Experiência do Usuário**
- **Navegação Intuitiva**: Fluxo claro entre páginas
- **Feedback Visual**: Mensagens de erro e confirmação
- **Carregamento Dinâmico**: AJAX para melhor performance

### **Segurança Implementada**

#### **Proteções de Sessão**
- Verificação de autenticação em todas as páginas protegidas
- Redirecionamento automático para login quando necessário
- Gestão segura de variáveis de sessão

#### **Segurança de Dados**
- **Consultas Preparadas**: Em todos os modelos
- **Validação de Entrada**: Tratamento de dados do usuário
- **Prevenção SQL Injection**: Uso de PDO statements

### **Funcionalidades Avançadas**

#### **Sistema de Histórico**
- **Rolagens por Ficha**: Cada ficha mantém seu próprio histórico
- **Limite de Exibição**: Últimas 10 rolagens mostradas
- **Formatação de Data**: Exibição no formato brasileiro

#### **Gestão de Estado**
- **Soft Delete**: Fichas marcadas como deletadas sem remoção física
- **Integridade Referencial**: Chaves estrangeiras no banco
- **Consistência de Dados**: Validações em múltiplos níveis

## 👤 Primeiro Acesso
1. Na página inicial, clique em "Registrar"
2. Crie uma conta com usuário e senha
3. Faça login com suas credenciais
4. Comece criando sua primeira ficha!
5. Use o sistema de dados integrado para suas rolagens

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
- **users**: Armazena usuários do sistema (id, user, pass, dt_created, dt_updated)
- **sheets**: Armazena as fichas de personagens com todos os atributos RPG
- **dices**: Armazena o histórico completo de rolagens de dados

## Configurações Importantes

### Configuração do PHP (php.ini)
```ini
extension=mysqli
extension=pdo_mysql
```

## Solução de Problemas Comuns

**Erro de Conexão com Banco**: Verifique `Database.php`
**Página não carrega**: Confirme se Apache está rodando
**Banco não encontrado**: Importe o `DomFichasDB.sql`

## URLs do Sistema
- **Login**: `/?c=auth&a=login`
- **Registro**: `/?c=auth&a=registro` 
- **Dashboard**: `/?c=auth&a=dashboard`
- **Nova Ficha**: `/?c=base&a=fixa`
- **Visualizar Ficha**: `/?c=base&a=ver&id=ID_DA_FICHA`

---

**Sistema completo de gerenciamento RPG Cairn**  
*Desenvolvido com arquitetura MVC, interface responsiva e sistema de dados integrado*