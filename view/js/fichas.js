let fichasPJ = [];
let fichasAmeaca = [];

// Carregar fichas
async function carregarFichas() {
    try {
        // Carregar fichas PJ
        const responsePJ = await fetch(`${API_BASE}/api/fichas/pj`, {
            credentials: 'include'
        });
        
        if (responsePJ.ok) {
            fichasPJ = await responsePJ.json();
            renderFichasPJ();
        }
        
        // Carregar fichas de ameaça
        const responseAmeaca = await fetch(`${API_BASE}/api/fichas/ameaca`, {
            credentials: 'include'
        });
        
        if (responseAmeaca.ok) {
            fichasAmeaca = await responseAmeaca.json();
            renderFichasAmeaca();
        }
        
    } catch (error) {
        console.error('Erro ao carregar fichas:', error);
    }
}

// Renderizar fichas PJ
function renderFichasPJ() {
    const container = document.getElementById('fichas-pj-list');
    
    if (fichasPJ.length === 0) {
        container.innerHTML = '<p class="no-fichas">Nenhuma ficha de personagem criada.</p>';
        return;
    }
    
    container.innerHTML = fichasPJ.map(ficha => `
        <div class="ficha-card" data-id="${ficha.id}" data-tipo="pj">
            <div class="ficha-info">
                <h4>${ficha.nome || 'Personagem Sem Nome'}</h4>
                <p>HP: ${ficha.hp_atual}/${ficha.hp_max} | Armadura: ${ficha.armadura}</p>
                <p>STR: ${ficha.str} | DEX: ${ficha.dex} | WIL: ${ficha.wil}</p>
            </div>
            <div class="ficha-actions">
                <button onclick="visualizarFichaPJ(${ficha.id})" class="btn btn-small">Visualizar</button>
                <button onclick="editarFichaPJ(${ficha.id})" class="btn btn-small btn-secondary">Editar</button>
                <button onclick="deletarFichaPJ(${ficha.id})" class="btn btn-small btn-danger">Excluir</button>
            </div>
        </div>
    `).join('');
}

// Renderizar fichas de ameaça
function renderFichasAmeaca() {
    const container = document.getElementById('fichas-ameaca-list');
    
    if (fichasAmeaca.length === 0) {
        container.innerHTML = '<p class="no-fichas">Nenhuma ameaça criada.</p>';
        return;
    }
    
    container.innerHTML = fichasAmeaca.map(ficha => `
        <div class="ficha-card" data-id="${ficha.id}" data-tipo="ameaca">
            <div class="ficha-info">
                <h4>${ficha.nome || 'Ameaça Sem Nome'}</h4>
                <p>HP: ${ficha.hp} | Armadura: ${ficha.armadura}</p>
                <p>STR: ${ficha.str} | DEX: ${ficha.dex} | WIL: ${ficha.wil}</p>
            </div>
            <div class="ficha-actions">
                <button onclick="visualizarFichaAmeaca(${ficha.id})" class="btn btn-small">Visualizar</button>
                <button onclick="editarFichaAmeaca(${ficha.id})" class="btn btn-small btn-secondary">Editar</button>
                <button onclick="deletarFichaAmeaca(${ficha.id})" class="btn btn-small btn-danger">Excluir</button>
            </div>
        </div>
    `).join('');
}

// Navegação entre fichas
function criarFichaPJ() {
    window.location.href = 'ficha-pj.html?nova=true';
}

function criarFichaAmeaca() {
    window.location.href = 'ficha-ameaca.html?nova=true';
}

function visualizarFichaPJ(id) {
    window.location.href = `ficha-pj.html?id=${id}&modo=visualizar`;
}

function editarFichaPJ(id) {
    window.location.href = `ficha-pj.html?id=${id}&modo=editar`;
}

function visualizarFichaAmeaca(id) {
    window.location.href = `ficha-ameaca.html?id=${id}&modo=visualizar`;
}

function editarFichaAmeaca(id) {
    window.location.href = `ficha-ameaca.html?id=${id}&modo=editar`;
}

// Deletar fichas
async function deletarFichaPJ(id) {
    if (confirm('Tem certeza que deseja excluir esta ficha?')) {
        try {
            const response = await fetch(`${API_BASE}/api/fichas/pj/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            if (response.ok) {
                carregarFichas();
            }
        } catch (error) {
            console.error('Erro ao deletar ficha:', error);
        }
    }
}

async function deletarFichaAmeaca(id) {
    if (confirm('Tem certeza que deseja excluir esta ameaça?')) {
        try {
            const response = await fetch(`${API_BASE}/api/fichas/ameaca/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            if (response.ok) {
                carregarFichas();
            }
        } catch (error) {
            console.error('Erro ao deletar ameaça:', error);
        }
    }
}

// Modal functionality
function setupModal() {
    const modal = document.getElementById('criar-ficha-modal');
    const btn = document.getElementById('criar-ficha-btn');
    const span = document.getElementsByClassName('close')[0];

    btn.onclick = function() {
        modal.style.display = 'block';
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    const username = localStorage.getItem('username');
    document.getElementById('username-display').textContent = `Olá, ${username}`;
    
    carregarFichas();
    setupModal();
});