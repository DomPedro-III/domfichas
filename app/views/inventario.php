<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inventário</title>

        <!-- Bootstrap 5 -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

            <style>
                body {
                    background: #f5f5f5;
                    padding: 30px;
                }
                .form-card {
                    max-width: 700px;
                }
            </style>
    </head>
    <body>
        <div class="container d-flex justify-content-center">
            <div class="card form-card shadow p-4">
                <h3 class="text-center mb-4">Cadastro de Itens</h3>

                <form action="/?c=base&a=cadastroInventario" method="POST">
                    <input type="hidden" class="form-control" name="id" value="<?php echo isset($_GET['id']) ? $_GET['id'] : null; ?>">

                    <div class="mb-3">
                        <label class="form-label"><strong>Item</strong></label>
                        <input type="text" class="form-control" name="item" value="<?php echo isset($inventory['name_item']) ? $inventory['name_item'] : null; ?>" placeholder="Digite o item">
                    </div>

                    <div class="mb-3">
                        <label class="form-label"><strong>Descrição</strong></label>
                        <textarea class="form-control" name="desc" rows="3" placeholder="Insira observações"><?php echo isset($inventory['desc_item']) ? $inventory['desc_item'] : null; ?></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Salvar</button>
                </form>

            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>
</html>