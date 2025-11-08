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
        inicializarNovaAmeaca();
    } else if (fichaId && modo) {
        carregarAmeaca(fichaId, modo);
    } else {
        window.location.href = 'fichas.html';
    }
    
    inicializarEventListeners();
});

// Inicializar nova ameaça
function inicializarNovaAmeaca() {
    modoEdicao = true;
    ativarModoEdicao();
    
    // Valores padrão
    document.getElementById('str').value = 10;
    document.getElementById('dex').value = 10;
    document.getElementById('wil').value = 10;
}

// Carregar ameaça existente
async function carregarAmeaca(id, modo) {
    try {
        const response = await fetch(`${API_BASE}/api/fichas/ameaca/${id}`, {
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
            alert('Erro ao carregar ameaça');
            window.location.href = 'fichas.html';
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar ameaça');
    }
}

// Preencher formulário com dados da ameaça
function preencherFormulario(ameaca) {
    document.getElementById('nome').value = ameaca.nome || '';
    document.getElementById('hp').value = ameaca.hp || 0;
    document.getElementById('armadura').value = ameaca.armadura || 0;
    document.getElementById('str').value = ameaca.str || 10;
    document.getElementById('dex').value = ameaca.dex || 10;
    document.getElementById('wil').value = ameaca.wil || 10;
    document.getElementById('habilidades').value = ameaca.habilidades || '';
    document.getElementById('tesouros').value = ameaca.tesouros || '';
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
        input.readOnly = false;
    });
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
        input.readOnly = true;
    });
}

// Inicializar event listeners
function inicializarEventListeners() {
    // Botões de modo
    document.getElementById('btn-editar').addEventListener('click', ativarModoEdicao);
    document.getElementById('btn-salvar').addEventListener('click', salvarAmeaca);
    document.getElementById('btn-cancelar').addEventListener('click', cancelarEdicao);
}

// Salvar ameaça
async function salvarAmeaca() {
    try {
        const formData = new FormData(document.getElementById('ficha-ameaca-form'));
        
        const dados = {
            nome: formData.get('nome'),
            hp: parseInt(formData.get('hp')),
            armadura: parseInt(formData.get('armadura')),
            str: parseInt(formData.get('str')),
            dex: parseInt(formData.get('dex')),
            wil: parseInt(formData.get('wil')),
            habilidades: formData.get('habilidades'),
            tesouros: formData.get('tesouros')
        };
        
        const url = fichaId ? `${API_BASE}/api/fichas/ameaca/${fichaId}` : `${API_BASE}/api/fichas/ameaca`;
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
            alert('Ameaça salva com sucesso!');
            if (!fichaId) {
                // Se era uma nova ameaça, redirecionar para a lista
                window.location.href = 'fichas.html';
            } else {
                // Recarregar a ameaça em modo visualização
                modoEdicao = false;
                ativarModoVisualizacao();
                carregarAmeaca(fichaId, 'visualizar');
            }
        } else {
            alert('Erro ao salvar ameaça');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar ameaça');
    }
}

// Cancelar edição
function cancelarEdicao() {
    if (fichaId) {
        // Recarregar dados originais
        carregarAmeaca(fichaId, 'visualizar');
    } else {
        window.location.href = 'fichas.html';
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