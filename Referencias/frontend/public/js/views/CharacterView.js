class CharacterView {
    constructor() {
        this.elements = {
            charactersGrid: document.getElementById('charactersGrid'),
            characterModal: document.getElementById('characterModal'),
            characterForm: document.getElementById('characterForm'),
            characterSheet: document.querySelector('.character-sheet')
        };
    }

    // Dashboard - Lista de personagens
    renderCharactersList(characters) {
        if (!this.elements.charactersGrid) return;

        if (!characters || characters.length === 0) {
            this.showEmptyState();
            return;
        }

        const charactersHTML = characters.map(character => this.createCharacterCard(character)).join('');
        this.elements.charactersGrid.innerHTML = charactersHTML;
    }

    createCharacterCard(character) {
        const hpPercentage = character.hi_protection_max > 0 ? 
            Math.round((character.hi_protection / character.hi_protection_max) * 100) : 0;
        
        const hpColor = hpPercentage > 70 ? 'success' : hpPercentage > 30 ? 'warning' : 'danger';

        return `
            <div class="character-card" data-character-id="${character.id}">
                <div class="character-header">
                    <h3>${Helpers.sanitizeInput(character.name)}</h3>
                    <span class="character-level">Nv. 1</span>
                </div>
                
                <div class="character-meta">
                    Criado em ${Helpers.formatDate(character.dt_created)}
                </div>

                <div class="character-stats">
                    <div class="stat">
                        <span class="stat-value ${hpColor}">${character.hi_protection}</span>
                        <span class="stat-label">PV</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${character.golden_coins}</span>
                        <span class="stat-label">Ouro</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${character.silver_coins}</span>
                        <span class="stat-label">Prata</span>
                    </div>
                </div>

                <div class="hp-bar">
                    <div class="hp-bar-fill ${hpColor}" style="width: ${hpPercentage}%"></div>
                    <span class="hp-bar-text">${character.hi_protection}/${character.hi_protection_max}</span>
                </div>

                <div class="character-actions">
                    <a href="character-sheet.html?id=${character.id}" class="btn btn-outline btn-sm">Abrir Ficha</a>
                    <button class="btn btn-outline btn-sm" onclick="characterController.editCharacter(${character.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="characterController.showDeleteModal(${character.id})">Excluir</button>
                </div>
            </div>
        `;
    }

    showEmptyState() {
        if (!this.elements.charactersGrid) return;
        
        this.elements.charactersGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>Nenhuma ficha encontrada</h3>
                <p>Comece criando sua primeira ficha de personagem</p>
                <button id="createFirstCharacter" class="btn btn-primary">Criar Primeira Ficha</button>
            </div>
        `;
    }

    // Modal de criação/edição
    showCharacterModal(character = null) {
        if (!this.elements.characterModal) return;

        const isEdit = !!character;
        const modalTitle = document.getElementById('modalTitle');
        const submitButton = this.elements.characterForm.querySelector('button[type="submit"]');

        if (modalTitle) {
            modalTitle.textContent = isEdit ? 'Editar Personagem' : 'Nova Ficha de Personagem';
        }

        if (submitButton) {
            submitButton.textContent = isEdit ? 'Atualizar Personagem' : 'Criar Personagem';
        }

        // Preencher formulário se for edição
        if (isEdit) {
            this.fillCharacterForm(character);
        } else {
            this.elements.characterForm.reset();
        }

        Helpers.showElement(this.elements.characterModal);
    }

    fillCharacterForm(character) {
        const form = this.elements.characterForm;
        if (!form) return;

        form.querySelector('#characterName').value = character.name || '';
        form.querySelector('#characterHP').value = character.hi_protection || 10;
        form.querySelector('#characterHPMax').value = character.hi_protection_max || 10;
        form.querySelector('#copperCoins').value = character.copper_coins || 0;
        form.querySelector('#silverCoins').value = character.silver_coins || 0;
        form.querySelector('#goldCoins').value = character.golden_coins || 0;
        form.querySelector('#characterNotes').value = character.notes || '';
    }

    hideCharacterModal() {
        if (this.elements.characterModal) {
            Helpers.hideElement(this.elements.characterModal);
            this.elements.characterForm.reset();
        }
    }

    // Ficha detalhada do personagem
    renderCharacterSheet(character) {
        if (!this.elements.characterSheet) return;

        // Atualizar informações básicas
        this.updateBasicInfo(character);
        
        // Renderizar atributos
        this.renderAttributes(character.attributes);
        
        // Renderizar inventário
        this.renderInventory(character.inventory);
        
        // Renderizar habilidades
        this.renderSkills(character.skills);
    }

    updateBasicInfo(character) {
        document.getElementById('characterName').textContent = character.name || 'Sem nome';
        document.getElementById('hitPoints').value = character.hi_protection || 0;
        document.getElementById('hitPointsMax').value = character.hi_protection_max || 0;
        document.getElementById('copperCoins').value = character.copper_coins || 0;
        document.getElementById('silverCoins').value = character.silver_coins || 0;
        document.getElementById('goldCoins').value = character.golden_coins || 0;
        document.getElementById('characterNotes').value = character.notes || '';
    }

    renderAttributes(attributes) {
        const attributesGrid = document.getElementById('attributesGrid');
        if (!attributesGrid) return;

        if (!attributes || attributes.length === 0) {
            attributesGrid.innerHTML = '<p class="empty-state">Nenhum atributo encontrado</p>';
            return;
        }

        const attributesHTML = attributes.map(attr => `
            <div class="attribute">
                <label>${Helpers.sanitizeInput(attr.attributes_name)}</label>
                <input type="number" 
                       class="attribute-value" 
                       data-attribute-id="${attr.id}"
                       value="${attr.points}" 
                       readonly>
                <span class="attribute-max">/ ${attr.points_max}</span>
            </div>
        `).join('');

        attributesGrid.innerHTML = attributesHTML;
    }

    renderInventory(inventory) {
        const inventoryList = document.getElementById('inventoryList');
        if (!inventoryList) return;

        if (!inventory || inventory.length === 0) {
            inventoryList.innerHTML = `
                <div class="empty-inventory">
                    <p>Inventário vazio</p>
                    <button id="addItemBtn" class="btn btn-outline hidden">Adicionar Item</button>
                </div>
            `;
            return;
        }

        const inventoryHTML = inventory.map(item => `
            <div class="inventory-item" data-item-id="${item.id}">
                <div class="item-header">
                    <strong>${Helpers.sanitizeInput(item.name_item)}</strong>
                    <div class="item-actions">
                        <button class="btn btn-outline btn-sm" onclick="characterController.editItem(${item.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="characterController.deleteItem(${item.id})">Excluir</button>
                    </div>
                </div>
                <p class="item-description">${Helpers.sanitizeInput(item.desc_item)}</p>
            </div>
        `).join('');

        inventoryList.innerHTML = inventoryHTML;
    }

    renderSkills(skills) {
        const skillsList = document.getElementById('skillsList');
        if (!skillsList) return;

        if (!skills || skills.length === 0) {
            skillsList.innerHTML = `
                <div class="empty-skills">
                    <p>Nenhuma habilidade cadastrada</p>
                    <button id="addSkillBtn" class="btn btn-outline hidden">Adicionar Habilidade</button>
                </div>
            `;
            return;
        }

        const skillsHTML = skills.map(skill => `
            <div class="skill-item" data-skill-id="${skill.id}">
                <div class="skill-header">
                    <strong>${Helpers.sanitizeInput(skill.name_skill)}</strong>
                    <div class="skill-actions">
                        <button class="btn btn-outline btn-sm" onclick="characterController.editSkill(${skill.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="characterController.deleteSkill(${skill.id})">Excluir</button>
                    </div>
                </div>
                <p class="skill-description">${Helpers.sanitizeInput(skill.desc_skill)}</p>
            </div>
        `).join('');

        skillsList.innerHTML = skillsHTML;
    }

    // Modo de edição
    enableEditing() {
        const editables = document.querySelectorAll('input[readonly], textarea[readonly]');
        editables.forEach(element => {
            element.removeAttribute('readonly');
            element.classList.add('editing');
        });

        Helpers.hideElement(document.getElementById('editSheetBtn'));
        Helpers.showElement(document.getElementById('saveSheetBtn'));
        Helpers.showElement(document.getElementById('cancelEditBtn'));
    }

    disableEditing() {
        const editables = document.querySelectorAll('.editing');
        editables.forEach(element => {
            element.setAttribute('readonly', 'true');
            element.classList.remove('editing');
        });

        Helpers.showElement(document.getElementById('editSheetBtn'));
        Helpers.hideElement(document.getElementById('saveSheetBtn'));
        Helpers.hideElement(document.getElementById('cancelEditBtn'));
    }

    // Modal de confirmação
    showConfirmModal(message, onConfirm, onCancel = null) {
        const modal = document.getElementById('confirmModal');
        if (!modal) return;

        const messageElement = modal.querySelector('.modal-body p');
        const confirmButton = modal.querySelector('#confirmDelete');
        const cancelButton = modal.querySelector('#cancelDelete');

        if (messageElement) messageElement.textContent = message;

        // Remover event listeners anteriores
        confirmButton.replaceWith(confirmButton.cloneNode(true));
        cancelButton.replaceWith(cancelButton.cloneNode(true));

        // Adicionar novos event listeners
        modal.querySelector('#confirmDelete').addEventListener('click', onConfirm);
        modal.querySelector('#cancelDelete').addEventListener('click', onCancel || (() => {
            Helpers.hideElement(modal);
        }));

        Helpers.showElement(modal);
    }

    // Loading states
    showLoading() {
        const main = document.querySelector('main');
        if (main) {
            main.classList.add('loading');
        }
    }

    hideLoading() {
        const main = document.querySelector('main');
        if (main) {
            main.classList.remove('loading');
        }
    }

    // Mensagens de erro/sucesso
    showMessage(message, type = 'success') {
        Helpers.showNotification(message, type);
    }
}