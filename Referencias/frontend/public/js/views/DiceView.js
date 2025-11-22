class DiceView {
    constructor() {
        this.elements = {
            diceResult: document.getElementById('diceResult'),
            diceType: document.getElementById('diceType'),
            historyList: document.getElementById('historyList')
        };
    }

    // Mostrar resultado da rolagem
    showDiceResult(result, diceType, rolls = [], modifier = 0) {
        if (!this.elements.diceResult || !this.elements.diceType) return;

        const total = result.total || result;
        const isCritical = diceType === 20 && (total === 20 || total === 1);

        // Animação do dado
        this.animateDiceRoll();

        // Atualizar display
        this.elements.diceResult.textContent = total;
        this.elements.diceResult.className = 'dice-value';

        if (isCritical) {
            this.elements.diceResult.classList.add(total === 20 ? 'critical-success' : 'critical-failure');
        }

        // Texto descritivo
        let typeText = `Rolagem de ${diceType}`;
        if (rolls.length > 1) {
            typeText = `${rolls.length}d${diceType}`;
        }
        if (modifier !== 0) {
            typeText += modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;
        }
        if (rolls.length > 1) {
            typeText += ` (${rolls.join(' + ')})`;
        }

        this.elements.diceType.textContent = typeText;
    }

    // Animação de rolagem
    animateDiceRoll() {
        const diceResult = this.elements.diceResult;
        if (!diceResult) return;

        diceResult.style.animation = 'none';
        setTimeout(() => {
            diceResult.style.animation = 'diceRoll 0.5s ease';
        }, 10);

        // Adicionar CSS da animação se não existir
        if (!document.getElementById('dice-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'dice-animation-styles';
            style.textContent = `
                @keyframes diceRoll {
                    0% { transform: scale(0.8) rotate(-180deg); opacity: 0; }
                    50% { transform: scale(1.2) rotate(90deg); opacity: 0.7; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                .dice-value.critical-success {
                    color: #10b981;
                    text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
                }
                .dice-value.critical-failure {
                    color: #ef4444;
                    text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Atualizar histórico
    updateHistory(history) {
        if (!this.elements.historyList) return;

        if (!history || history.length === 0) {
            this.showEmptyHistory();
            return;
        }

        const historyHTML = history.map((roll, index) => this.createHistoryItem(roll, index)).join('');
        this.elements.historyList.innerHTML = historyHTML;

        // Scroll para o topo
        this.elements.historyList.scrollTop = 0;
    }

    createHistoryItem(roll, index) {
        const time = new Date(roll.timestamp).toLocaleTimeString('pt-BR');
        const isCritical = roll.dice === 20 && (roll.result === 20 || roll.result === 1);
        
        let rollDescription = `${roll.diceCount || 1}d${roll.dice}`;
        if (roll.modifier !== 0) {
            rollDescription += roll.modifier > 0 ? ` + ${roll.modifier}` : ` - ${Math.abs(roll.modifier)}`;
        }
        if (roll.rolls && roll.rolls.length > 1) {
            rollDescription += ` (${roll.rolls.join(' + ')})`;
        }

        return `
            <div class="history-item ${isCritical ? roll.result === 20 ? 'critical-success' : 'critical-failure' : ''}">
                <div class="history-info">
                    <span class="history-dice">${rollDescription}</span>
                    <span class="history-result">= ${roll.result}</span>
                </div>
                <span class="history-time">${time}</span>
            </div>
        `;
    }

    showEmptyHistory() {
        if (!this.elements.historyList) return;
        
        this.elements.historyList.innerHTML = `
            <div class="empty-history">
                <p>Nenhuma rolagem realizada ainda</p>
                <p class="text-muted">As rolagens aparecerão aqui</p>
            </div>
        `;
    }

    // Controles customizados
    updateCustomRollControls() {
        const diceCount = document.getElementById('customDice');
        const sides = document.getElementById('customSides');
        const modifier = document.getElementById('customModifier');

        if (diceCount && sides && modifier) {
            // Validações em tempo real
            diceCount.addEventListener('input', (e) => {
                let value = parseInt(e.target.value);
                if (value < 1) value = 1;
                if (value > 10) value = 10;
                e.target.value = value;
            });

            sides.addEventListener('input', (e) => {
                let value = parseInt(e.target.value);
                if (value < 2) value = 2;
                if (value > 100) value = 100;
                e.target.value = value;
            });
        }
    }

    // Botões de dados
    setupDiceButtons(onDiceRoll) {
        const diceButtons = document.querySelectorAll('.dice-btn');
        diceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const sides = parseInt(e.target.dataset.dice);
                onDiceRoll(sides);
            });
        });
    }

    // Export do histórico
    showExportOptions(history) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Exportar Histórico</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Escolha o formato de exportação:</p>
                    <div class="export-options">
                        <button class="btn btn-outline btn-full" id="exportText">Texto (.txt)</button>
                        <button class="btn btn-outline btn-full" id="exportJSON">JSON (.json)</button>
                        <button class="btn btn-outline btn-full" id="exportCSV">CSV (.csv)</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        Helpers.showElement(modal);

        // Event listeners
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#exportText').addEventListener('click', () => {
            this.exportHistoryAsText(history);
            modal.remove();
        });

        modal.querySelector('#exportJSON').addEventListener('click', () => {
            this.exportHistoryAsJSON(history);
            modal.remove();
        });

        modal.querySelector('#exportCSV').addEventListener('click', () => {
            this.exportHistoryAsCSV(history);
            modal.remove();
        });

        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    exportHistoryAsText(history) {
        const content = history.map(roll => {
            const time = new Date(roll.timestamp).toLocaleString('pt-BR');
            let desc = `${roll.diceCount || 1}d${roll.dice}`;
            if (roll.modifier !== 0) {
                desc += roll.modifier > 0 ? ` + ${roll.modifier}` : ` - ${Math.abs(roll.modifier)}`;
            }
            return `[${time}] ${desc} = ${roll.result}`;
        }).join('\n');

        const header = `HISTÓRICO DE ROLAGENS - DomFichas\nExportado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
        Helpers.downloadFile(header + content, `historico-rolagens-${Date.now()}.txt`, 'text/plain');
    }

    exportHistoryAsJSON(history) {
        const data = {
            history: history,
            exportInfo: {
                exportedAt: new Date().toISOString(),
                totalRolls: history.length,
                system: 'DomFichas Dice Roller'
            }
        };
        Helpers.downloadFile(JSON.stringify(data, null, 2), `historico-rolagens-${Date.now()}.json`, 'application/json');
    }

    exportHistoryAsCSV(history) {
        const headers = ['Data', 'Hora', 'Rolagem', 'Resultado'];
        const rows = history.map(roll => {
            const date = new Date(roll.timestamp).toLocaleDateString('pt-BR');
            const time = new Date(roll.timestamp).toLocaleTimeString('pt-BR');
            let desc = `${roll.diceCount || 1}d${roll.dice}`;
            if (roll.modifier !== 0) {
                desc += roll.modifier > 0 ? ` + ${roll.modifier}` : ` - ${Math.abs(roll.modifier)}`;
            }
            return [date, time, desc, roll.result.toString()];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        Helpers.downloadFile(csvContent, `historico-rolagens-${Date.now()}.csv`, 'text/csv');
    }

    // Efeitos visuais
    showRollEffect(sides, result) {
        // Efeito de partículas para críticos
        if (sides === 20 && (result === 20 || result === 1)) {
            this.createParticleEffect(result === 20 ? 'success' : 'failure');
        }
    }

    createParticleEffect(type) {
        const colors = {
            success: ['#10b981', '#34d399', '#6ee7b7'],
            failure: ['#ef4444', '#f87171', '#fca5a5']
        };

        const container = document.querySelector('.dice-result');
        if (!container) return;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${colors[type][Math.floor(Math.random() * colors[type].length)]};
                border-radius: 50%;
                pointer-events: none;
                animation: particleFloat 1s ease-out forwards;
            `;

            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.setProperty('--x', (Math.random() - 0.5) * 200);
            particle.style.setProperty('--y', (Math.random() - 0.5) * 200);

            container.appendChild(particle);

            setTimeout(() => particle.remove(), 1000);
        }

        // Adicionar CSS da animação
        if (!document.getElementById('particle-animation')) {
            const style = document.createElement('style');
            style.id = 'particle-animation';
            style.textContent = `
                @keyframes particleFloat {
                    0% {
                        transform: translate(0, 0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--x), var(--y));
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}