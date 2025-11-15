const API_BASE = 'http://localhost:5000';

// Funções de autenticação
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('username', data.username);
            window.location.href = 'fichas.html';
        } else {
            showMessage(data.error, 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão', 'error');
    }
}

async function register(username, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Conta criada com sucesso! Faça login.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage(data.error, 'error');
        }
    } catch (error) {
        showMessage('Erro de conexão', 'error');
    }
}

async function logout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Erro no logout:', error);
    } finally {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

function checkAuth() {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        window.location.href = 'index.html';
    }
    return user_id;
}

function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            login(username, password);
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                showMessage('As senhas não coincidem', 'error');
                return;
            }
            
            register(username, password);
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});