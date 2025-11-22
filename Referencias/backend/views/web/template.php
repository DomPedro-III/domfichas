<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title ?? 'DomFichas'; ?></title>
    <link rel="stylesheet" href="/frontend/public/css/style.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="nav-brand">
                <h2>🎲 DomFichas</h2>
            </div>
            <div class="nav-links">
                <?php if (isset($user)): ?>
                    <span>Olá, <?php echo htmlspecialchars($user['username']); ?></span>
                    <a href="/logout" class="btn btn-outline">Sair</a>
                <?php else: ?>
                    <a href="/login" class="btn btn-outline">Login</a>
                <?php endif; ?>
            </div>
        </nav>
    </header>

    <main class="container">
        <?php echo $content; ?>
    </main>

    <footer class="footer">
        <p>&copy; 2024 DomFichas - Sistema de Gerenciamento de Fichas RPG</p>
    </footer>

    <script src="/frontend/public/js/utils/Helpers.js"></script>
</body>
</html>