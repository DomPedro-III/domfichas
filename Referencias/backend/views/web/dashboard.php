<?php
$title = "Dashboard - DomFichas";
ob_start();
?>

<div class="dashboard-header">
    <h1>Bem-vindo ao DomFichas</h1>
    <p>Gerencie suas fichas de personagem do sistema Cairn</p>
    
    <div class="dashboard-actions">
        <button id="newCharacterBtn" class="btn btn-primary">Nova Ficha</button>
        <a href="/dice-roller" class="btn btn-secondary">Rolagem de Dados</a>
    </div>
</div>

<div class="characters-section">
    <h2>Minhas Fichas</h2>
    <div id="charactersList" class="characters-grid">
        <!-- As fichas serão carregadas via JavaScript -->
    </div>
</div>

<script src="/frontend/public/js/controllers/CharacterController.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const characterController = new CharacterController();
        characterController.loadUserCharacters();
    });
</script>

<?php
$content = ob_get_clean();
include 'template.php';
?>