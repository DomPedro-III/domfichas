<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fixa</title>

        <!-- Bootstrap 5 -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

            <style>
                body {
                    background: #f5f5f5;
                    padding: 30px;
                }
                .card-card {
                    max-width: 700px;
                }
            </style>
    </head>
    <body>
        <div class="container justify-content-center">
            <div class="container d-block justify-content-center">
                <div class="card card-card shadow p-4">
                    <h3 class="text-center mb-4">Ficha</h3>

                        <div class="mb-3">
                            <label class="card-label"><strong>Nome:</strong> <?php echo ($sheets['name'])?></label>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="card-label"><strong>HP:</strong> <?php echo($sheets['hit_protection'])?> | <?php echo($sheets['hit_protection_max'])?></label>
                            </div>
                            <div class="col-md-6">
                                <label class="card-label"><strong>Armadura:</strong> <?php echo($sheets['armor'])?></label>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label class="card-label"><strong>CC:</strong> <?php echo($sheets['copper_coins'])?></label>
                            </div>

                            <div class="col-md-4">
                                <label class="card-label"><strong>SC:</strong> <?php echo($sheets['silver_coins'])?></label>
                            </div>

                            <div class="col-md-4">
                                <label class="card-label"><strong>GC:</strong> <?php echo($sheets['golden_coins'])?></label>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label class="card-label"><strong>Notes</strong></label>
                        </div>
                        <div class="row mb-3">
                            <div class="card">
                                <div class="card-body">
                                    <?php echo($sheets['notes'])?>
                                </div>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6">
                                <button class="btn btn-primary w-100" onclick="window.location.href = '/?c=auth&a=dashboard'">Voltar</button>
                            </div>
                            <div class="col-md-6">
                                <button class="btn btn-primary w-100" onclick="window.location.href = '/?c=base&a=inventario&id=<?php echo($sheets['id'])?>'">Inventário</button>
                            </div>
                        </div>

                </div>
            </div>
        </div>
        
        <div class="container justify-content-center">
            <div class="container d-block justify-content-center">
                <div class="card card-card shadow p-4">
                    <h3 class="text-center mb-4">Inventário</h3>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>
</html>