class AuthController {
    constructor() {
        this.api = new Api();
        this.view = new AuthView();
    }

    async register(userData) {
        try {
            const response = await this.api.post('/backend/views/api/auth/register.json.php', userData);
            
            if (response.success) {
                this.view.showMessage(response.message, 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.view.showMessage(response.message, 'error');
            }
            
            return response;
        } catch (error) {
            console.error('Erro no registro:', error);
            this.view.showMessage('Erro de conexão com o servidor', 'error');
        }
    }

    async login(userData) {
        try {
            const response = await this.api.post('/backend/views/api/auth/login.json.php', userData);
            
            if (response.success) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                this.view.showMessage(response.message, 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                this.view.showMessage(response.message, 'error');
            }
            
            return response;
        } catch (error) {
            console.error('Erro no login:', error);
            this.view.showMessage('Erro de conexão com o servidor', 'error');
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    isLoggedIn() {
        return localStorage.getItem('authToken') !== null;
    }
}