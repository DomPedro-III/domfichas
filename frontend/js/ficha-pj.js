let fichaAtual = null;
let modoEdicao = false;
let modoVisualizacao = false;
let fichaId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    const username = localStorage.getItem('username');
    document.getElementById('username-display').textContent = `Olá, ${username}`;
    
    // Verificar parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    fichaId = urlParams.get('id');
    const modo = urlParams.get('modo');
    const nova = urlParams.get('nova');
    
    if (nova === 'true') {
        inicializarNovaFicha();
    } else if (fichaId && modo) {
        carregarFicha(fichaId, modo);
    } else {
        window.location.href = 'fichas.html';
    }
    
    inicializarEventListeners();
});

// Inicializar nova ficha
function inicializarNovaFicha() {
    modoEdicao = true;
    ativarModoEdicao();
    
    // Valores padrão para nova ficha
    document.getElementById('str').value = 10;
    document.getElementById('dex').value = 10;
    document.getElementById('wil').value = 10;
    document.getElementById('str-value').textContent = '10';
    document.getElementById('dex-value').textContent = '10';
    document.getElementById('wil-value').textContent = '10';
    
    // Inicializar slots de mochila
    inicializarSlotsMochila();
    atualizarContadorSlots();
}

// Carregar ficha existente
async function carregarFicha(id, modo) {
    try {
        const response = await fetch(`${API_BASE}/api/fichas/pj/${id}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            fichaAtual = await response.json();
            preencherFormulario(fichaAtual);
            
            if (modo === 'editar') {
                modoEdicao = true;
                ativarModoEdicao();
            } else {
                modoVisualizacao = true;
                ativarModoVisualizacao();
            }
            
            carregarHistoricoRolagens();
        } else {
            alert('Erro ao carregar ficha');
            window.location.href = 'fichas.html';
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar ficha');
    }
}

// Preencher formulário com dados da ficha
function preencherFormulario(ficha) {
    document.getElementById('nome').value = ficha.nome || '';
    document.getElementById('ocupacao').value = ficha.ocupacao || '';
    document.getElementById('raca').value = ficha.raca || '';
    document.getElementById('hp_atual').value = ficha.hp_atual || 0;
    document.getElementById('hp_max').value = ficha.hp_max || 0;
    document.getElementById('armadura').value = ficha.armadura || 0;
    document.getElementById('gp').value = ficha.gp || 0;
    document.getElementById('str').value = ficha.str || 10;
    document.getElementById('dex').value = ficha.dex || 10;
    document.getElementById('wil').value = ficha.wil || 10;
    document.getElementById('notas').value = ficha.notas || '';
    document.getElementById('fadiga').checked = ficha.fadiga || false;
    document.getElementById('privado').checked = ficha.privado || false;
    
    // Atualizar valores exibidos
    document.getElementById('str-value').textContent = ficha.str || 10;
    document.getElementById('dex-value').textContent = ficha.dex || 10;
    document.getElementById('wil-value').textContent = ficha.wil || 10;
    
    // Carregar inventário
    carregarInventario(ficha.inventario || []);
    
    // Carregar spellbooks
    carregarSpellbooks(ficha.spellbooks || []);
    
    // Carregar mão
    document.querySelector('#maos-slots .slot-item:first-child input').value = ficha.mao || '';
}

// Carregar inventário
function carregarInventario(inventario) {
    // Limpar slots existentes
    const mochilaSlots = document.getElementById('mochila-slots');
    mochilaSlots.innerHTML = '';
    
    // Inicializar slots vazios
    for (let i = 0; i < 6; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot-item';
        slot.innerHTML = `
            <input type="text" placeholder="Slot ${i + 1}" value="${inventario[i]?.nome || ''}" readonly>
            ${inventario[i]?.bulky ? '<span class="bulky-badge">Vol</span>' : ''}
        `;
        if (inventario[i]?.bulky) {
            slot.classList.add('bulky');
        }
        mochilaSlots.appendChild(slot);
    }
    
    atualizarContadorSlots();
}

// Carregar spellbooks
function carregarSpellbooks(spellbooks) {
    const container = document.getElementById('spellbooks-list');
    container.innerHTML = '';
    
    spellbooks.forEach((spellbook, index) => {
        const item = document.createElement('div');
        item.className = 'spellbook-item';
        item.innerHTML = `
            <input type="text" value="${spellbook}" readonly>
            <button type="button" class="btn-remove" onclick="removerSpellbook(${index})">×</button>
        `;
        container.appendChild(item);
    });
}

// Inicializar slots da mochila
function inicializarSlotsMochila() {
    const mochilaSlots = document.getElementById('mochila-slots');
    mochilaSlots.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot-item';
        slot.innerHTML = `<input type="text" placeholder="Slot ${i + 1}" readonly>`;
        mochilaSlots.appendChild(slot);
    }
}

// Atualizar contador de slots
function atualizarContadorSlots() {
    const slots = document.querySelectorAll('.slot-item input');
    let slotsUsados = 0;
    let slotsOcupados = 0;
    
    slots.forEach(slot => {
        if (slot.value.trim() !== '') {
            slotsUsados++;
            // Verificar se é item volumoso
            const slotItem = slot.closest('.slot-item');
            if (slotItem.classList.contains('bulky')) {
                slotsOcupados += 2;
            } else {
                slotsOcupados += 1;
            }
        }
    });
    
    document.getElementById('slots-usados').textContent = `Slots usados: ${slotsUsados}/10`;
    document.getElementById('slots-disponiveis').textContent = `Ocupados: ${slotsOcupados}/10`;
}

// Modo de edição
function ativarModoEdicao() {
    document.body.classList.add('editing');
    document.body.classList.remove('read-only');
    
    // Mostrar controles de edição
    document.getElementById('btn-salvar').style.display = 'inline-block';
    document.getElementById('btn-cancelar').style.display = 'inline-block';
    document.getElementById('btn-editar').style.display = 'none';
    
    // Ativar campos
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type !== 'checkbox') {
            input.readOnly = false;
        }
    });
    
    // Ativar checkboxes
    document.getElementById('fadiga').disabled = false;
    document.getElementById('privado').disabled = false;
    
    // Mostrar controles de inventário
    document.querySelector('.inventory-controls').style.display = 'block';
    document.querySelector('.spellbooks-controls').style.display = 'block';
    
    // Ativar botões de HP
    document.getElementById('btn-dano').disabled = false;
    document.getElementById('btn-cura').disabled = false;
}

// Modo de visualização
function ativarModoVisualizacao() {
    document.body.classList.add('read-only');
    document.body.classList.remove('editing');
    
    // Mostrar controles de visualização
    document.getElementById('btn-editar').style.display = 'inline-block';
    document.getElementById('btn-salvar').style.display = 'none';
    document.getElementById('btn-cancelar').style.display = 'none';
    
    // Desativar campos
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type !== 'checkbox') {
            input.readOnly = true;
        }
    });
    
    // Desativar checkboxes
    document.getElementById('fadiga').disabled = true;
    document.getElementById('privado').disabled = true;
    
    // Ocultar controles de inventário
    document.querySelector('.inventory-controls').style.display = 'none';
    document.querySelector('.spellbooks-controls').style.display = 'none';
    
    // Desativar botões de HP
    document.getElementById('btn-dano').disabled = true;
    document.getElementById('btn-cura').disabled = true;
}

// Inicializar event listeners
function inicializarEventListeners() {
    // Botões de modo
    document.getElementById('btn-editar').addEventListener('click', ativarModoEdicao);
    document.getElementById('btn-salvar').addEventListener('click', salvarFicha);
    document.getElementById('btn-cancelar').addEventListener('click', cancelarEdicao);
    
    // Botões de HP
    document.getElementById('btn-dano').addEventListener('click', () => abrirModalHP('dano'));
    document.getElementById('btn-cura').addEventListener('click', () => abrirModalHP('cura'));
    document.getElementById('btn-confirmar-hp').addEventListener('click', confirmarAjusteHP);
    
    // Controles de inventário
    document.getElementById('btn-adicionar-item').addEventListener('click', adicionarItem);
    document.getElementById('btn-adicionar-spellbook').addEventListener('click', adicionarSpellbook);
    
    // Atualizar valores dos atributos quando alterados
    document.getElementById('str').addEventListener('change', atualizarValorAtributo);
    document.getElementById('dex').addEventListener('change', atualizarValorAtributo);
    document.getElementById('wil').addEventListener('change', atualizarValorAtributo);
    
    // Modal
    const modal = document.getElementById('hp-modal');
    const span = document.getElementsByClassName('close')[0];
    
    span.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Atualizar valor exibido do atributo
function atualizarValorAtributo(event) {
    const input = event.target;
    const value = input.value;
    const attribute = input.id;
    document.getElementById(`${attribute}-value`).textContent = value;
}

// Salvar ficha
async function salvarFicha() {
    try {
        const formData = new FormData(document.getElementById('ficha-pj-form'));
        const inventario = obterDadosInventario();
        const spellbooks = obterDadosSpellbooks();
        
        const dados = {
            nome: formData.get('nome'),
            ocupacao: formData.get('ocupacao'),
            raca: formData.get('raca'),
            hp_atual: parseInt(formData.get('hp_atual')),
            hp_max: parseInt(formData.get('hp_max')),
            armadura: parseInt(formData.get('armadura')),
            gp: parseInt(formData.get('gp')),
            str: parseInt(formData.get('str')),
            dex: parseInt(formData.get('dex')),
            wil: parseInt(formData.get('wil')),
            inventario: inventario,
            mao: document.querySelector('#maos-slots .slot-item:first-child input').value,
            spellbooks: spellbooks,
            notas: formData.get('notas'),
            fadiga: document.getElementById('fadiga').checked,
            privado: document.getElementById('privado').checked
        };
        
        const url = fichaId ? `${API_BASE}/api/fichas/pj/${fichaId}` : `${API_BASE}/api/fichas/pj`;
        const method = fichaId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(dados)
        });
        
        if (response.ok) {
            alert('Ficha salva com sucesso!');
            if (!fichaId) {
                // Se era uma nova ficha, redirecionar para a lista
                window.location.href = 'fichas.html';
            } else {
                // Recarregar a ficha em modo visualização
                modoEdicao = false;
                ativarModoVisualizacao();
                carregarFicha(fichaId, 'visualizar');
            }
        } else {
            alert('Erro ao salvar ficha');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar ficha');
    }
}

// Cancelar edição
function cancelarEdicao() {
    if (fichaId) {
        // Recarregar dados originais
        carregarFicha(fichaId, 'visualizar');
    } else {
        window.location.href = 'fichas.html';
    }
}

// Obter dados do inventário
function obterDadosInventario() {
    const inventario = [];
    const slots = document.querySelectorAll('#mochila-slots .slot-item');
    
    slots.forEach(slot => {
        const input = slot.querySelector('input');
        const nome = input.value.trim();
        if (nome) {
            inventario.push({
                nome: nome,
                bulky: slot.classList.contains('bulky')
            });
        }
    });
    
    return inventario;
}

// Obter dados dos spellbooks
function obterDadosSpellbooks() {
    const spellbooks = [];
    const items = document.querySelectorAll('#spellbooks-list .spellbook-item input');
    
    items.forEach(item => {
        const nome = item.value.trim();
        if (nome) {
            spellbooks.push(nome);
        }
    });
    
    return spellbooks;
}

// Adicionar item ao inventário
function adicionarItem() {
    const nomeItem = document.getElementById('novo-item').value.trim();
    const isBulky = document.getElementById('item-bulky').checked;
    
    if (!nomeItem) {
        alert('Digite o nome do item');
        return;
    }
    
    // Encontrar primeiro slot vazio
    const slots = document.querySelectorAll('#mochila-slots .slot-item');
    for (let slot of slots) {
        const input = slot.querySelector('input');
        if (!input.value.trim()) {
            input.value = nomeItem;
            if (isBulky) {
                slot.classList.add('bulky');
                slot.innerHTML = `
                    <input type="text" value="${nomeItem}" readonly>
                    <span class="bulky-badge">Vol</span>
                `;
            }
            break;
        }
    }
    
    // Limpar formulário
    document.getElementById('novo-item').value = '';
    document.getElementById('item-bulky').checked = false;
    
    atualizarContadorSlots();
}

// Adicionar spellbook
function adicionarSpellbook() {
    const nomeSpellbook = document.getElementById('novo-spellbook').value.trim();
    
    if (!nomeSpellbook) {
        alert('Digite o nome do spellbook');
        return;
    }
    
    const container = document.getElementById('spellbooks-list');
    const item = document.createElement('div');
    item.className = 'spellbook-item';
    item.innerHTML = `
        <input type="text" value="${nomeSpellbook}">
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(item);
    
    // Limpar formulário
    document.getElementById('novo-spellbook').value = '';
}

// Remover spellbook
function removerSpellbook(index) {
    const items = document.querySelectorAll('#spellbooks-list .spellbook-item');
    if (items[index]) {
        items[index].remove();
    }
}

// Modal HP
function abrirModalHP(tipo) {
    const modal = document.getElementById('hp-modal');
    const title = document.getElementById('hp-modal-title');
    
    if (tipo === 'dano') {
        title.textContent = 'Tomar Dano';
    } else {
        title.textContent = 'Curar';
    }
    
    modal.style.display = 'block';
    document.getElementById('hp-quantidade').value = 1;
}

// Confirmar ajuste de HP
function confirmarAjusteHP() {
    const quantidade = parseInt(document.getElementById('hp-quantidade').value);
    const hpAtual = parseInt(document.getElementById('hp_atual').value);
    const hpMax = parseInt(document.getElementById('hp_max').value);
    
    const modalTitle = document.getElementById('hp-modal-title').textContent;
    let novoHP = hpAtual;
    
    if (modalTitle === 'Tomar Dano') {
        novoHP = Math.max(0, hpAtual - quantidade);
    } else {
        novoHP = Math.min(hpMax, hpAtual + quantidade);
    }
    
    document.getElementById('hp_atual').value = novoHP;
    
    // Fechar modal
    document.getElementById('hp-modal').style.display = 'none';
    
    // Se estiver no modo de edição, salvar automaticamente
    if (modoEdicao) {
        salvarFicha();
    }
}

// Carregar histórico de rolagens
async function carregarHistoricoRolagens() {
    try {
        const response = await fetch(`${API_BASE}/api/historico-rolagens`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const historico = await response.json();
            renderizarHistorico(historico);
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}

// Renderizar histórico
function renderizarHistorico(historico) {
    const container = document.getElementById('dice-history');
    
    if (historico.length === 0) {
        container.innerHTML = '<div class="history-item">Nenhuma rolagem realizada</div>';
        return;
    }
    
    container.innerHTML = historico.map(item => {
        const data = new Date(item.data_hora).toLocaleString();
        let resultadoText = `${item.tipo_dado.toUpperCase()}: ${item.resultado}`;
        
        // Adicionar informação de save se aplicável
        if (item.tipo_dado.includes('save')) {
            const atributo = item.tipo_dado.split('_')[0].toUpperCase();
            resultadoText = `${atributo} Save: ${item.resultado}`;
        }
        
        return `
            <div class="history-item">
                <strong>${resultadoText}</strong><br>
                <small>${data}</small>
            </div>
        `;
    }).join('');
}