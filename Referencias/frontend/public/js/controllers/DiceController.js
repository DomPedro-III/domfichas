class DiceController {
    constructor() {
        this.view = new DiceView();
        this.history = [];
        this.maxHistorySize = 50;
        this.init();
    }

    init() {
        this.loadHistory();
        this.setupEventListeners();
        this.view.updateCustomRollControls();
    }

    setupEventListeners() {
        // Configurar botões de dados
        this.view.setupDiceButtons((sides) => this.rollDice(sides));
    }

    // Rolagem básica de dado
    rollDice(sides) {
        const result = Helpers.randomNumber(1, sides);
        const rollData = {
            dice: sides,
            diceCount: 1,
            rolls: [result],
            modifier: 0,
            result: result,
            timestamp: new Date().toISOString()
        };

        this.addToHistory(rollData);
        this.view.showDiceResult(result, sides);
        this.view.showRollEffect(sides, result);

        return result;
    }

    // Rolagem customizada
    rollCustom(diceCount, sides, modifier = 0) {
        const rolls = [];
        let total = 0;

        // Rolagens individuais
        for (let i = 0; i < diceCount; i++) {
            const roll = Helpers.randomNumber(1, sides);
            rolls.push(roll);
            total += roll;
        }

        // Aplicar modificador
        total += modifier;

        const rollData = {
            dice: sides,
            diceCount: diceCount,
            rolls: rolls,
            modifier: modifier,
            result: total,
            timestamp: new Date().toISOString()
        };

        this.addToHistory(rollData);
        this.view.showDiceResult({ total, rolls, modifier }, sides, rolls, modifier);
        this.view.showRollEffect(sides, total);

        return { total, rolls, modifier };
    }

    // Rolagem de atributo (d20)
    rollAttribute(attributeValue, modifier = 0) {
        const roll = Helpers.randomNumber(1, 20);
        const total = roll + modifier;
        
        let successLevel = 'normal';
        if (roll === 20) successLevel = 'critical-success';
        if (roll === 1) successLevel = 'critical-failure';
        
        const rollData = {
            dice: 20,
            diceCount: 1,
            rolls: [roll],
            modifier: modifier,
            result: total,
            attributeValue: attributeValue,
            successLevel: successLevel,
            timestamp: new Date().toISOString(),
            type: 'attribute'
        };

        this.addToHistory(rollData);
        
        // Resultado especial para rolagens de atributo
        let resultText = `${total} (${roll} + ${modifier})`;
        if (roll === 20) resultText += ' 🎉 CRÍTICO!';
        if (roll === 1) resultText += ' 💀 FALHA CRÍTICA!';

        this.view.showDiceResult(total, 20, [roll], modifier);
        this.view.showMessage(`Teste de atributo: ${resultText}`, 
                            roll === 20 ? 'success' : roll === 1 ? 'error' : 'info');

        return { roll, total, successLevel };
    }

    // Adicionar ao histórico
    addToHistory(rollData) {
        this.history.unshift(rollData);
        
        // Limitar tamanho do histórico
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }
        
        this.saveHistory();
        this.view.updateHistory(this.history);
    }

    // Gerenciamento do histórico
    loadHistory() {
        const saved = Helpers.getItem('diceHistory');
        if (saved && Array.isArray(saved)) {
            this.history = saved;
            this.view.updateHistory(this.history);
        }
    }

    saveHistory() {
        Helpers.setItem('diceHistory', this.history);
    }

    clearHistory() {
        this.view.showConfirmModal(
            'Tem certeza que deseja limpar todo o histórico de rolagens?',
            () => {
                this.history = [];
                this.saveHistory();
                this.view.updateHistory(this.history);
                this.view.showMessage('Histórico limpo com sucesso', 'success');
            }
        );
    }

    exportHistory() {
        if (this.history.length === 0) {
            this.view.showMessage('Nenhuma rolagem no histórico para exportar', 'warning');
            return;
        }
        this.view.showExportOptions(this.history);
    }

    // Estatísticas
    getStatistics() {
        const stats = {
            totalRolls: this.history.length,
            byDice: {},
            criticals: { success: 0, failure: 0 },
            averageRoll: 0
        };

        if (this.history.length === 0) return stats;

        let totalSum = 0;

        this.history.forEach(roll => {
            // Estatísticas por tipo de dado
            const diceKey = `d${roll.dice}`;
            if (!stats.byDice[diceKey]) {
                stats.byDice[diceKey] = { count: 0, total: 0, average: 0 };
            }
            stats.byDice[diceKey].count++;
            stats.byDice[diceKey].total += roll.result;

            // Críticos (apenas d20)
            if (roll.dice === 20) {
                if (roll.rolls && roll.rolls[0] === 20) stats.criticals.success++;
                if (roll.rolls && roll.rolls[0] === 1) stats.criticals.failure++;
            }

            totalSum += roll.result;
        });

        // Calcular médias
        stats.averageRoll = totalSum / this.history.length;
        Object.keys(stats.byDice).forEach(dice => {
            stats.byDice[dice].average = stats.byDice[dice].total / stats.byDice[dice].count;
        });

        return stats;
    }

    showStatistics() {
        const stats = this.getStatistics();
        
        let statsHTML = `
            <div class="stats-container">
                <h4>Estatísticas de Rolagem</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${stats.totalRolls}</span>
                        <span class="stat-label">Total de Rolagens</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.averageRoll.toFixed(2)}</span>
                        <span class="stat-label">Média Geral</span>
                    </div>
        `;

        if (stats.criticals.success > 0 || stats.criticals.failure > 0) {
            statsHTML += `
                    <div class="stat-item">
                        <span class="stat-value">${stats.criticals.success}</span>
                        <span class="stat-label">Críticos (20)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.criticals.failure}</span>
                        <span class="stat-label">Falhas (1)</span>
                    </div>
            `;
        }

        statsHTML += `
                </div>
            </div>
        `;

        // Mostrar em um modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📊 Estatísticas de Rolagem</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    ${statsHTML}
                    ${Object.keys(stats.byDice).length > 0 ? `
                        <div class="dice-stats">
                            <h5>Por Tipo de Dado</h5>
                            ${Object.keys(stats.byDice).map(dice => `
                                <div class="dice-stat">
                                    <span>${dice}:</span>
                                    <span>${stats.byDice[dice].count} rolagens</span>
                                    <span>Média: ${stats.byDice[dice].average.toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        Helpers.showElement(modal);

        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Rolagens especiais do sistema Cairn
    rollCairnSave(attributeValue) {
        // No sistema Cairn, testes são contra atributos (2d6)
        const roll1 = Helpers.randomNumber(1, 6);
        const roll2 = Helpers.randomNumber(1, 6);
        const total = roll1 + roll2;
        
        const success = total <= attributeValue;
        const successLevel = total <= (attributeValue / 2) ? 'great' : success ? 'normal' : 'failure';

        const rollData = {
            dice: 6,
            diceCount: 2,
            rolls: [roll1, roll2],
            modifier: 0,
            result: total,
            attributeValue: attributeValue,
            success: success,
            successLevel: successLevel,
            timestamp: new Date().toISOString(),
            type: 'cairn_save'
        };

        this.addToHistory(rollData);

        let message = `Teste de atributo (Cairn): ${total} (${roll1} + ${roll2})`;
        if (successLevel === 'great') message += ' - Sucesso incrível!';
        else if (success) message += ' - Sucesso!';
        else message += ' - Falha!';

        this.view.showDiceResult(total, 6, [roll1, roll2]);
        this.view.showMessage(message, success ? 'success' : 'error');

        return { rolls: [roll1, roll2], total, success, successLevel };
    }

    // Rolagem de dano
    rollDamage(diceFormula) {
        // Suporte básico para fórmulas como "2d6+1", "1d8", etc.
        const match = diceFormula.match(/(\d+)d(\d+)([+-]\d+)?/);
        if (!match) {
            this.view.showMessage('Fórmula de dano inválida', 'error');
            return null;
        }

        const diceCount = parseInt(match[1]);
        const sides = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3]) : 0;

        return this.rollCustom(diceCount, sides, modifier);
    }
}