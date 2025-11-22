class AuthView {
    showMessage(message, type = 'success') {
        let messageEl = document.getElementById('message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'message';
            document.body.appendChild(messageEl);
        }

        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.classList.remove('hidden');
        
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 5000);
    }

    validateRegisterForm(formData) {
        const errors = [];

        if (formData.user.length < 3) {
            errors.push('Nome de usuário deve ter pelo menos 3 caracteres');
        }

        if (formData.pass.length < 6) {
            errors.push('Senha deve ter pelo menos 6 caracteres');
        }

        if (formData.pass !== formData.confirm_pass) {
            errors.push('As senhas não coincidem');
        }

        return errors;
    }
}