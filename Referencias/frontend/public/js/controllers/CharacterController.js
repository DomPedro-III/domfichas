class CharacterController {
    constructor() {
        this.view = new CharacterView();
        this.api = new Api();
        this.currentCharacter = null;
        this.characters = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal events
        document.addEventListener('DOMContentLoaded', () => {
            const closeModal = document.getElementById('closeModal');
            const cancelBtn = document.getElementById('cancelBtn');
            const characterForm = document.getElementById('characterForm');

            if (closeModal) {
                closeModal.addEventListener('click', () => this.view.hideCharacterModal());
            }

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.view.hideCharacterModal());
            }

            if (characterForm) {
                characterForm.addEventListener('submit', (e) => this.handleCharacterSubmit(e));
            }

            // Fechar modal ao clicar fora
            const modal = document.getElementById('characterModal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.view.hideCharacterModal();
                    }
                });
            }
        });
    }

    // Carregar personagens do usuário
    async loadUserCharacters() {
        try {
            this.view.showLoading();
            const response = await this.api.get('/characters/list.json.php');

            if (response.success) {
                this.characters = response.data.characters || [];
                this.view.renderCharactersList(this.characters);
            } else {
                this.view.showMessage('Erro ao carregar personagens: ' + response.message, 'error');
            }
        } catch (error) {
            console.error('Error loading characters:', error);
            this.view.showMessage('Erro de conexão ao carregar personagens', 'error');
        } finally {
            this.view.hideLoading();
        }
    }

    // Carregar personagem específico
    async loadCharacter(characterId) {
        try {
            this.view.showLoading();
            const response = await this.api.get(`/characters/detail.json.php/${characterId}`);

            if (response.success) {
                this.currentCharacter = Character.fromApiResponse(response.data);
                this.view.renderCharacterSheet(this.currentCharacter);
            } else {
                this.view.showMessage('Erro ao carregar personagem: ' + response.message, 'error');
                setTimeout(() => window.location.href = 'dashboard.html', 2000);
            }
        } catch (error) {
            console.error('Error loading character:', error);
            this.view.showMessage('Erro de conexão ao carregar personagem', 'error');
        } finally {
            this.view.hideLoading();
        }
    }

    // Criar novo personagem
    async createCharacter(characterData) {
        try {
            const response = await this.api.post('/characters/create.json.php', characterData);

            if (response.success) {
                this.view.showMessage('Personagem criado com sucesso!', 'success');
                this.view.hideCharacterModal();
                await this.loadUserCharacters();
                return true;
            } else {
                this.view.showMessage('Erro ao criar personagem: ' + response.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Error creating character:', error);
            this.view.showMessage('Erro de conexão ao criar personagem', 'error');
            return false;
        }
    }

    // Atualizar personagem
    async updateCharacter(characterId, characterData) {
        try {
            const response = await this.api.put(`/characters/detail.json.php/${characterId}`, characterData);

            if (response.success) {
                this.view.showMessage('Personagem atualizado com sucesso!', 'success');
                await this.loadCharacter(characterId);
                return true;
            } else {
                this.view.showMessage('Erro ao atualizar personagem: ' + response.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Error updating character:', error);
            this.view.showMessage('Erro de conexão ao atualizar personagem', 'error');
            return false;
        }
    }

    // Excluir personagem
    async deleteCharacter(characterId) {
        try {
            const response = await this.api.delete(`/characters/detail.json.php/${characterId}`);

            if (response.success) {
                this.view.showMessage('Personagem excluído com sucesso!', 'success');
                
                // Redirecionar ou recarregar lista
                if (window.location.pathname.includes('character-sheet')) {
                    setTimeout(() => window.location.href = 'dashboard.html', 1000);
                } else {
                    await this.loadUserCharacters();
                }
                
                return true;
            } else {
                this.view.showMessage('Erro ao excluir personagem: ' + response.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Error deleting character:', error);
            this.view.showMessage('Erro de conexão ao excluir personagem', 'error');
            return false;
        }
    }

    // Handlers de UI
    showCreateModal() {
        this.view.showCharacterModal();
    }

    async editCharacter(characterId) {
        const character = this.characters.find(c => c.id == characterId);
        if (character) {
            this.view.showCharacterModal(character);
        }
    }

    showDeleteModal(characterId) {
        this.view.showConfirmModal(
            'Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita.',
            () => this.deleteCharacter(characterId)
        );
    }

    async handleCharacterSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const characterData = {
            name: formData.get('name'),
            hi_protection: parseInt(formData.get('hi_protection')) || 10,
            hi_protection_max: parseInt(formData.get('hi_protection_max')) || 10,
            copper_coins: parseInt(formData.get('copper_coins')) || 0,
            silver_coins: parseInt(formData.get('silver_coins')) || 0,
            golden_coins: parseInt(formData.get('golden_coins')) || 0,
            notes: formData.get('notes') || ''
        };

        // Validação
        const character = new Character(characterData);
        const errors = character.validate();
        
        if (errors.length > 0) {
            this.view.showMessage(errors.join(', '), 'error');
            return;
        }

        const submitButton = e.target.querySelector('button[type="submit"]');
        Helpers.setLoading(submitButton, true);

        const isEdit = this.currentCharacter && this.currentCharacter.id;
        const success = isEdit ? 
            await this.updateCharacter(this.currentCharacter.id, characterData) :
            await this.createCharacter(characterData);

        Helpers.setLoading(submitButton, false);

        if (success && !isEdit) {
            e.target.reset();
        }
    }

    // Modo de edição da ficha
    enableEditing() {
        this.view.enableEditing();
    }

    disableEditing() {
        this.view.disableEditing();
        // Recarregar dados originais se necessário
        if (this.currentCharacter) {
            this.view.renderCharacterSheet(this.currentCharacter);
        }
    }

    async saveCharacter() {
        if (!this.currentCharacter) return;

        const formData = {
            name: document.getElementById('characterName').textContent,
            hi_protection: parseInt(document.getElementById('hitPoints').value) || 0,
            hi_protection_max: parseInt(document.getElementById('hitPointsMax').value) || 0,
            copper_coins: parseInt(document.getElementById('copperCoins').value) || 0,
            silver_coins: parseInt(document.getElementById('silverCoins').value) || 0,
            golden_coins: parseInt(document.getElementById('goldCoins').value) || 0,
            notes: document.getElementById('characterNotes').value || ''
        };

        const success = await this.updateCharacter(this.currentCharacter.id, formData);
        if (success) {
            this.disableEditing();
        }
    }

    // Exportar personagem
    async exportCharacter(format = 'text') {
        if (!this.currentCharacter) return;

        let content, filename, contentType;

        switch (format) {
            case 'json':
                content = this.currentCharacter.exportToJSON();
                filename = `personagem-${this.currentCharacter.name}-${Date.now()}.json`;
                contentType = 'application/json';
                break;
            case 'text':
            default:
                content = this.currentCharacter.exportToText();
                filename = `personagem-${this.currentCharacter.name}-${Date.now()}.txt`;
                contentType = 'text/plain';
                break;
        }

        Helpers.downloadFile(content, filename, contentType);
        this.view.showMessage('Personagem exportado com sucesso!', 'success');
    }

    // Gerenciamento de inventário (métodos básicos)
    async addItem(characterId, itemData) {
        // Implementar quando a API estiver pronta
        console.log('Add item:', characterId, itemData);
    }

    async updateItem(characterId, itemId, itemData) {
        // Implementar quando a API estiver pronta
        console.log('Update item:', characterId, itemId, itemData);
    }

    async deleteItem(itemId) {
        // Implementar quando a API estiver pronta
        console.log('Delete item:', itemId);
    }

    // Gerenciamento de habilidades (métodos básicos)
    async addSkill(characterId, skillData) {
        // Implementar quando a API estiver pronta
        console.log('Add skill:', characterId, skillData);
    }

    async updateSkill(characterId, skillId, skillData) {
        // Implementar quando a API estiver pronta
        console.log('Update skill:', characterId, skillId, skillData);
    }

    async deleteSkill(skillId) {
        // Implementar quando a API estiver pronta
        console.log('Delete skill:', skillId);
    }
}