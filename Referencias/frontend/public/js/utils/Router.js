class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    init() {
        // Listen for navigation events
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });

        // Intercept link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('data-route'));
            }
        });

        // Handle initial route
        this.handleRouteChange();
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path, data = {}) {
        window.history.pushState(data, '', path);
        this.handleRouteChange();
    }

    handleRouteChange() {
        const path = window.location.pathname;
        this.currentRoute = path;

        // Find matching route
        const route = Object.keys(this.routes).find(route => {
            const routeRegex = new RegExp('^' + route.replace(/:\w+/g, '([^/]+)') + '$');
            return routeRegex.test(path);
        });

        if (route && this.routes[route]) {
            const params = this.extractParams(route, path);
            this.routes[route](params);
        } else {
            this.show404();
        }
    }

    extractParams(route, path) {
        const params = {};
        const routeParts = route.split('/');
        const pathParts = path.split('/');

        routeParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                const paramName = part.slice(1);
                params[paramName] = pathParts[index];
            }
        });

        return params;
    }

    show404() {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="error-page">
                    <h1>404 - Página Não Encontrada</h1>
                    <p>A página que você está procurando não existe.</p>
                    <button data-route="/" class="btn btn-primary">Voltar ao Início</button>
                </div>
            `;
        }
    }

    getCurrentPath() {
        return this.currentRoute;
    }

    // API route helpers
    static getApiUrl(endpoint) {
        const baseUrl = window.location.origin;
        return `${baseUrl}/backend/views/api${endpoint}`;
    }

    // Navigation helpers
    static redirectTo(path) {
        window.location.href = path;
    }

    static reload() {
        window.location.reload();
    }

    // Query parameter helpers
    static getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    static setQueryParams(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        window.history.pushState({}, '', url);
    }
}