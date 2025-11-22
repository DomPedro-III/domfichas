class Character {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.hi_protection = data.hi_protection || 10;
        this.hi_protection_max = data.hi_protection_max || 10;
        this.copper_coins = data.copper_coins || 0;
        this.silver_coins = data.silver_coins || 0;
        this.golden_coins = data.golden_coins || 0;
        this.notes = data.notes || '';
        this.deleted_at = data.deleted_at || null;
        this.fk_user = data.fk_user || null;
        this.attributes = data.attributes || [];
        this.inventory = data.inventory || [];
        this.skills = data.skills || [];
        this.createdAt = data.dt_created || new Date().toISOString();
        this.updatedAt = data.dt_updated || new Date().toISOString();
    }

    // Factory method para criar a partir de JSON da API
    static fromApiResponse(apiData) {
        const characterData = apiData.character || apiData;
        return new Character({
            ...characterData,
            attributes: apiData.attributes || [],
            inventory: apiData.inventory || [],
            skills: apiData.skills || []
        });
    }

    // Factory method para criar a partir de formulário
    static fromFormData(formData) {
        return new Character({
            name: formData.name,
            hi_protection: parseInt(formData.hi_protection) || 10,
            hi_protection_max: parseInt(formData.hi_protection_max) || 10,
            copper_coins: parseInt(formData.copper_coins) || 0,
            silver_coins: parseInt(formData.silver_coins) || 0,
            golden_coins: parseInt(formData.golden_coins) || 0,
            notes: formData.notes || ''
        });
    }

    // Getters computados
    get hpPercentage() {
        if (this.hi_protection_max === 0) return 0;
        return Math.round((this.hi_protection / this.hi_protection_max) * 100);
    }

    get totalCoins() {
        return this.copper_coins + (this.silver_coins * 10) + (this.golden_coins * 100);
    }

    get formattedCoins() {
        const gold = Math.floor(this.totalCoins / 100);
        const silver = Math.floor((this.totalCoins % 100) / 10);
        const copper = this.totalCoins % 10;
        
        return {
            gold,
            silver,
            copper,
            formatted: `${gold}O ${gold}P ${copper}C`
        };
    }

    // Métodos de validação
    isValid() {
        return this.name && this.name.length >= 2 && this.name.length <= 100;
    }

    validate() {
        const errors = [];

        if (!this.name || this.name.trim() === '') {
            errors.push('Nome do personagem é obrigatório');
        } else if (this.name.length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        } else if (this.name.length > 100) {
            errors.push('Nome não pode ter mais de 100 caracteres');
        }

        if (this.hi_protection < 0) {
            errors.push('Pontos de vida não podem ser negativos');
        }

        if (this.hi_protection_max < 0) {
            errors.push('Pontos de vida máximos não podem ser negativos');
        }

        if (this.hi_protection > this.hi_protection_max) {
            errors.push('Pontos de vida não podem ser maiores que os pontos máximos');
        }

        return errors;
    }

    // Métodos de negócio
    takeDamage(damage) {
        this.hi_protection = Math.max(0, this.hi_protection - damage);
        return this.hi_protection;
    }

    heal(amount) {
        this.hi_protection = Math.min(this.hi_protection_max, this.hi_protection + amount);
        return this.hi_protection;
    }

    addCoins(copper = 0, silver = 0, gold = 0) {
        this.copper_coins += copper;
        this.silver_coins += silver;
        this.golden_coins += gold;
        return this.formattedCoins;
    }

    spendCoins(copper = 0, silver = 0, gold = 0) {
        const totalCost = copper + (silver * 10) + (gold * 100);
        if (this.totalCoins >= totalCost) {
            this.copper_coins -= copper;
            this.silver_coins -= silver;
            this.golden_coins -= gold;
            return true;
        }
        return false;
    }

    // Serialização
    toJSON() {
        return {
            name: this.name,
            hi_protection: this.hi_protection,
            hi_protection_max: this.hi_protection_max,
            copper_coins: this.copper_coins,
            silver_coins: this.silver_coins,
            golden_coins: this.golden_coins,
            notes: this.notes
        };
    }

    toFormData() {
        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('hi_protection', this.hi_protection.toString());
        formData.append('hi_protection_max', this.hi_protection_max.toString());
        formData.append('copper_coins', this.copper_coins.toString());
        formData.append('silver_coins', this.silver_coins.toString());
        formData.append('golden_coins', this.golden_coins.toString());
        formData.append('notes', this.notes);
        return formData;
    }

    // Clone do objeto
    clone() {
        return new Character({
            ...this,
            attributes: [...this.attributes],
            inventory: [...this.inventory],
            skills: [...this.skills]
        });
    }

    // Comparação
    equals(otherCharacter) {
        return this.id === otherCharacter.id;
    }

    // Export para diferentes formatos
    exportToText() {
        return `
FICHA DE PERSONAGEM - DomFichas
================================

Nome: ${this.name}
Pontos de Vida: ${this.hi_protection}/${this.hi_protection_max}
Moedas: ${this.formattedCoins.formatted}

ATRIBUTOS:
${this.attributes.map(attr => `  ${attr.attributes_name}: ${attr.points}/${attr.points_max}`).join('\n')}

INVENTÁRIO:
${this.inventory.map(item => `  - ${item.name_item}: ${item.desc_item}`).join('\n')}

HABILIDADES:
${this.skills.map(skill => `  - ${skill.name_skill}: ${skill.desc_skill}`).join('\n')}

ANOTAÇÕES:
${this.notes}

================================
Exportado em: ${new Date().toLocaleString('pt-BR')}
        `.trim();
    }

    exportToJSON() {
        return JSON.stringify({
            character: this.toJSON(),
            attributes: this.attributes,
            inventory: this.inventory,
            skills: this.skills,
            exportInfo: {
                exportedAt: new Date().toISOString(),
                system: 'DomFichas',
                version: '1.0'
            }
        }, null, 2);
    }
}