<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ficha</title>
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
                <h3 class="text-center mb-4">Cadastro</h3>
                <?php if (!empty($_GET['erro'])): ?>
                <p style="color:red;"> Ocorreu um erro inesperado.</p>
                <?php endif; ?>

                <!-- Formulário de cadastro/edição da ficha  -->
                <form action="/domfichas/?c=base&a=cadastro" method="POST">
                    <input type="hidden" class="form-control" name="id" value="<?php echo isset($_GET['id']) ? $_GET['id'] : null; ?>">

                    <div class="mb-3">
                        <label class="form-label"><strong>Nome</strong></label>
                        <input required type="text" class="form-control" name="name" value="<?php echo isset($sheets['name']) ? $sheets['name'] : null; ?>" placeholder="Digite o nome">
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label"><strong>Força</strong></label>
                            <input required type="number" class="form-control" name="forca" value="<?php echo isset($sheets['str']) ? $sheets['str'] : null; ?>" placeholder="Quantidade">
                        </div>

                        <div class="col-md-4">
                            <label class="form-label"><strong>Destreza</strong></label>
                            <input required type="number" class="form-control" name="destreza" value="<?php echo isset($sheets['dex']) ? $sheets['dex'] : null; ?>" placeholder="Quantidade">
                        </div>

                        <div class="col-md-4">
                            <label class="form-label"><strong>Vontade</strong></label>
                            <input required type="number" class="form-control" name="vontade" value="<?php echo isset($sheets['wil']) ? $sheets['wil'] : null; ?>" placeholder="Quantidade">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label"><strong>Força Max</strong></label>
                            <input required type="number" class="form-control" name="forca_max" value="<?php echo isset($sheets['str_max']) ? $sheets['str_max'] : null; ?>" placeholder="Quantidade">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label"><strong>Destreza Max</strong></label>
                            <input required type="number" class="form-control" name="destreza_max" value="<?php echo isset($sheets['dex_max']) ? $sheets['dex_max'] : null; ?>" placeholder="Quantidade">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label"><strong>Vontade Max</strong></label>
                            <input required type="number" class="form-control" name="vontade_max" value="<?php echo isset($sheets['wil_max']) ? $sheets['wil_max'] : null; ?>" placeholder="Quantidade">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label"><strong>HIT Protection</strong></label>
                            <input required type="number" class="form-control" name="hit_protection" value="<?php echo isset($sheets['hit_protection']) ? $sheets['hit_protection'] : null; ?>" placeholder="Valor atual">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label"><strong>HIT Protection Máx</strong></label>
                            <input required type="number" class="form-control" name="hit_protection_max" value="<?php echo isset($sheets['hit_protection_max']) ? $sheets['hit_protection_max'] : null; ?>" placeholder="Valor máximo">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label"><strong>Armadura</strong></label>
                            <input required type="number" class="form-control" name="armor" value="<?php echo isset($sheets['armor']) ? $sheets['armor'] : 0; ?>" placeholder="Valor atual">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label"><strong>Copper Coins</strong></label>
                            <input type="number" class="form-control" name="copper_coins" value="<?php echo isset($sheets['copper_coins']) ? $sheets['copper_coins'] : 0; ?>" placeholder="Quantidade">
                        </div>

                        <div class="col-md-4">
                            <label class="form-label"><strong>Silver Coins</strong></label>
                            <input type="number" class="form-control" name="silver_coins" value="<?php echo isset($sheets['silver_coins']) ? $sheets['silver_coins'] : 0; ?>" placeholder="Quantidade">
                        </div>

                        <div class="col-md-4">
                            <label class="form-label"><strong>Golden Coins</strong></label>
                            <input type="number" class="form-control" name="golden_coins" value="<?php echo isset($sheets['golden_coins']) ? $sheets['golden_coins'] : 0; ?>" placeholder="Quantidade">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label"><strong>Notes</strong></label>
                        <textarea class="form-control" name="notes" rows="3" placeholder="Insira observações"><?php echo isset($sheets['notes']) ? $sheets['notes'] : null; ?></textarea>
                    </div>

                    <div class="mb-3">
                        <label class="form-label"><strong>Inventário</strong></label>
                        <textarea class="form-control" name="inventory" rows="3" placeholder="Insira seu equipamento"><?php echo isset($sheets['inventory']) ? $sheets['inventory'] : null; ?></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Salvar</button>
                </form>

            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>
</html>