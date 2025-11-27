<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registro</title>

        <!-- Bootstrap 5 CDN -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

        <style>
            body {
                height: 100vh;
                background: #f5f5f5;
            }
            .login-card {
                max-width: 380px;
            }
        </style>
    </head>
    <body class="d-flex justify-content-center align-items-center">
        <form action="/domfichas/?c=auth&a=addRegistro" method="POST">
            <h3 class="text-center mb-3">Registro</h3>
             <?php 
                // EXIBIR MENSAGENS DE ERRO DA VALIDAÇÃO
                session_start();
                if (isset($_SESSION['erro_registro'])): 
                ?>
                    <div class="alert alert-danger alert-custom">
                        <?= $_SESSION['erro_registro'] ?>
                    </div>
                    <?php 
                    // Limpar a mensagem de erro após exibir
                    unset($_SESSION['erro_registro']); 
                    ?>
                <?php endif; ?>

            <div class="mb-3">
                <label class="form-label">Usuário</label>
                <input type="text" name="user" class="form-control" required placeholder="Digite seu usuário">
            </div>

            <div class="mb-3">
                <label class="form-label">Senha</label>
                <input type="password" name="pass" class="form-control" required placeholder="Digite sua senha">
            </div>

            <div class="mb-3">
                <label class="form-label">Comfirmar Senha</label>
                <input type="password" name="passConf" class="form-control" required placeholder="Confirme sua senha">
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <button class="btn btn-primary w-100" type="submit">Registrar</button>
                </div>
                <div class="col-md-6">
                    <button class="btn btn-primary w-100" onclick="window.location.href = '/domfichas/?c=auth&a=login'">Entrar</button>
                </div>
            </div>

        </form>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>
</html>