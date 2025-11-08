// Sistema de rolagem de dados
async function rolarDado(tipoDado) {
    try {
        const fichaId = obterFichaIdAtual();
        const fichaTipo = obterFichaTipoAtual();
        
        const response = await fetch(`${API_BASE}/api/rolar-dados`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                tipo: tipoDado,
                ficha_id: fichaId,
                ficha_tipo: fichaTipo
            })
        });
        
        if (response.ok) {
            const resultado = await response.json();
            exibirResultadoDado(resultado);
            carregarHistoricoRolagens();
        } else {
            console.error('Erro na rolagem');
        }
    } catch (error) {
        console.error('Erro:', error);
        // Fallback: rolagem local
        const resultado = rolarDadoLocal(tipoDado);
        exibirResultadoDado(resultado);
    }
}

// Rolagem de Save
async function rolarSave(atributo) {
    const valorAtributo = parseInt(document.getElementById(atributo).value) || 10;
    
    try {
        const fichaId = obterFichaIdAtual();
        const fichaTipo = obterFichaTipoAtual();
        
        const response = await fetch(`${API_BASE}/api/rolar-dados`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                tipo: 'd20',
                ficha_id: fichaId,
                ficha_tipo: fichaTipo
            })
        });
        
        if (response.ok) {
            const resultado = await response.json();
            const sucesso = resultado.resultado <= valorAtributo;
            exibirResultadoSave(resultado, atributo.toUpperCase(), valorAtributo, sucesso);
            carregarHistoricoRolagens();
        }
    } catch (error) {
        console.error('Erro:', error);
        // Fallback: rolagem local
        const resultado = rolarDadoLocal('d20');
        const sucesso = resultado.resultado <= valorAtributo;
        exibirResultadoSave(resultado, atributo.toUpperCase(), valorAtributo, sucesso);
    }
}

// Rolagem local (fallback)
function rolarDadoLocal(tipoDado) {
    let faces;
    
    switch (tipoDado) {
        case 'd4': faces = 4; break;
        case 'd6': faces = 6; break;
        case 'd8': faces = 8; break;
        case 'd10': faces = 10; break;
        case 'd12': faces = 12; break;
        case 'd20': faces = 20; break;
        default:
            // Tentar extrair número do dado (ex: "d8" -> 8)
            faces = parseInt(tipoDado.substring(1)) || 20;
    }
    
    const resultado = Math.floor(Math.random() * faces) + 1;
    return { resultado, tipo: tipoDado };
}

// Exibir resultado do dado
function exibirResultadoDado(resultado) {
    const diceResult = document.getElementById('dice-result');
    diceResult.textContent = resultado.resultado;
    
    // Efeito visual
    diceResult.style.transform = 'scale(1.2)';
    setTimeout(() => {
        diceResult.style.transform = 'scale(1)';
    }, 300);
    
    // Feedback no console
    console.log(`Rolagem: ${resultado.tipo.toUpperCase()} = ${resultado.resultado}`);
}

// Exibir resultado do save
function exibirResultadoSave(resultado, atributo, valorAtributo, sucesso) {
    const diceResult = document.getElementById('dice-result');
    const status = sucesso ? 'SUCESSO' : 'FALHA';
    const cor = sucesso ? '#27ae60' : '#e74c3c';
    
    diceResult.innerHTML = `
        <div>${resultado.resultado}</div>
        <small style="font-size: 1rem; color: ${cor};">${atributo} Save (${valorAtributo}) - ${status}</small>
    `;
    
    // Efeito visual
    diceResult.style.transform = 'scale(1.2)';
    setTimeout(() => {
        diceResult.style.transform = 'scale(1)';
    }, 300);
    
    // Feedback no console
    console.log(`${atributo} Save: ${resultado.resultado}/${valorAtributo} - ${status}`);
}

// Obter ID da ficha atual
function obterFichaIdAtual() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Obter tipo da ficha atual
function obterFichaTipoAtual() {
    if (window.location.pathname.includes('ficha-pj')) {
        return 'pj';
    } else if (window.location.pathname.includes('ficha-ameaca')) {
        return 'ameaca';
    }
    return null;
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
    if (!container) return;
    
    if (historico.length === 0) {
        container.innerHTML = '<div class="history-item">Nenhuma rolagem realizada</div>';
        return;
    }
    
    container.innerHTML = historico.map(item => {
        const data = new Date(item.data_hora).toLocaleString();
        let resultadoText = '';
        let classe = 'history-item';
        
        if (item.tipo_dado === 'd20') {
            // Verificar se é um save
            const isSave = item.ficha_tipo && item.ficha_id;
            if (isSave) {
                // Para saves, mostrar de forma especial
                resultadoText = `Save: ${item.resultado}`;
                classe += item.resultado <= 10 ? ' success' : ' failure';
            } else {
                resultadoText = `D20: ${item.resultado}`;
            }
        } else {
            resultadoText = `${item.tipo_dado.toUpperCase()}: ${item.resultado}`;
        }
        
        return `
            <div class="${classe}">
                <strong>${resultadoText}</strong><br>
                <small>${data}</small>
            </div>
        `;
    }).join('');
}

// Inicializar sistema de dados
document.addEventListener('DOMContentLoaded', function() {
    // Carregar histórico se a página tiver a seção de dados
    if (document.getElementById('dice-history')) {
        carregarHistoricoRolagens();
    }
});