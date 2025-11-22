class Api {
    async request(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            return {
                success: response.ok,
                ...data
            };
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    async get(url) {
        return this.request(url, { method: 'GET' });
    }

    async post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(url) {
        return this.request(url, { method: 'DELETE' });
    }

    getAuthHeader() {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': 'Bearer ' + token } : {};
    }
}