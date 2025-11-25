<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ficha</title>

        <!-- Bootstrap 5 -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

            <style>
                body {
                    background: #f5f5f5;
                    padding: 30px;
                }
                .containerBox {
                    display: grid;
                    grid-template-columns: 50% 50%;
                }
                .card-card {
                    max-width: 700px;
                }

                /* dados hist */
                .historico-rolagens {
                    max-height: 400px;
                    overflow-y: auto;
                }
                .historico-item {
                    background-color: #f8f9fa;
                    transition: background-color 0.3s;
                }
                .historico-item:hover {
                    background-color: #e9ecef;
                }
                .dice-btn {
                    min-width: 60px;
                    font-weight: bold;
                }
            </style>
    </head>
    <body>
        <div class="containerBox">
            <div class="justify-content-center">
                <div class="container d-block justify-content-center">
                    <div class="card card-card shadow p-4">
                        <h3 class="text-center mb-4">Ficha</h3>
                            <div class="mb-3">
                                <label class="card-label"><strong>Nome:</strong> <?php echo ($sheets['name'])?></label>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <label class="card-label"><strong>Força:</strong> <?php echo($sheets['str'])?> | <?php echo($sheets['str_max'])?></label>
                                </div>
                                <div class="col-md-4">
                                    <label class="card-label"><strong>Destreza:</strong> <?php echo($sheets['dex'])?> | <?php echo($sheets['dex_max'])?></label>
                                </div>
                                <div class="col-md-4">
                                    <label class="card-label"><strong>Vontade:</strong> <?php echo($sheets['wil'])?> | <?php echo($sheets['wil_max'])?></label>
                                </div>
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
                                    <label class="card-label"><strong>Moedas de Cobre:</strong> <?php echo($sheets['copper_coins'])?></label>
                                </div>

                                <div class="col-md-4">
                                    <label class="card-label"><strong>Moedas de Prata:</strong> <?php echo($sheets['silver_coins'])?></label>
                                </div>

                                <div class="col-md-4">
                                    <label class="card-label"><strong>Moedas de Ouro:</strong> <?php echo($sheets['golden_coins'])?></label>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label class="card-label"><strong>Notes</strong></label>
                            </div>
                            <div class="row mb-3">
                                <textarea disabled class="formcontrol" ><?php echo($sheets['notes'])?></textarea>
                            </div>

                            <div class="row mb-3">
                                <label class="card-label"><strong>Inventário</strong></label>
                            </div>
                            <div class="row mb-3">
                                <textarea disabled class="formcontrol" ><?php echo($sheets['inventory'])?></textarea>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <button class="btn btn-primary w-100" onclick="window.location.href = '/?c=auth&a=painel'">Voltar</button>
                                </div>
                                <div class="col-md-4">
                                    <button class="btn btn-warning w-100" onclick="window.location.href = '/ficha?c=base&a=ficha&id=<?php echo $sheets['id']; ?>'">Editar</button>
                                </div>
                                <div class="col-md-4">
                                    <button class="btn btn-danger w-100" onclick="window.location.href = '/ficha?c=base&a=deletar&id=<?php echo $sheets['id']; ?>'">Deletar</button>                                    
                                </div>
                            </div>

                    </div>
                </div>
            </div>
            
            <div class="justify-content-center">
                <div class="container d-block justify-content-center">
                    <div class="card card-card shadow p-4">
                        <h3 class="text-center mb-4">Dados</h3>
                        <div class="row justify-content-center mb-4">
                            <div class="col-auto">
                                <button class="btn btn-primary m-1 dice-btn" data-dice="4">d4</button>
                                <button class="btn btn-primary m-1 dice-btn" data-dice="6">d6</button>
                                <button class="btn btn-primary m-1 dice-btn" data-dice="8">d8</button>
                                <button class="btn btn-primary m-1 dice-btn" data-dice="10">d10</button>
                                <button class="btn btn-primary m-1 dice-btn" data-dice="12">d12</button>
                                <button class="btn btn-primary m-1 dice-btn" data-dice="20">d20</button>
                                <button class="btn btn-primary m-1 dice-btn" data-dice="100">d100</button>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title mb-0">Histórico de Rolagens</h5>
                                    </div>
                                    <div class="card-body">
                                        <div id="historico" class="historico-rolagens">
                                            <?php foreach ($dice_hist as $items) { ?>
                                                <div class="historico-item mb-2 p-2 border rounded">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <span class="fw-bold">d<?php echo ($items['type'])?></span>
                                                        <span class="badge bg-success fs-6"><?php echo ($items['result'])?></span>
                                                    </div>
                                                    <small class="text-muted"><?php
                                                        $data_original = $items['when'];

                                                        // Criar objeto DateTime
                                                        $data = new DateTime($data_original);

                                                        // Formatar para o padrão brasileiro
                                                        $data_formatada = $data->format('d/m/Y, H:i:s');

                                                        echo $data_formatada; // Resultado: 23/11/2025, 16:51:50
                                                        ?></small>
                                                </div>
                                            <?php } ?>                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script> -->
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>        
        <script>
            $(document).ready(function() {
                // Função para rolar um dado
                function rolarDado(faces) {
                    return Math.floor(Math.random() * faces) + 1;
                }

                // Função para formatar a data/hora
                function formatarDataHora() {
                    const agora = new Date();
                    return agora.toLocaleString('pt-BR');
                }

                // Função para salvar no backend via AJAX
                function salvarNoBackend(dado, resultado) {
                    $.ajax({
                        url: '/?c=base&a=salvarDados',
                        type: 'POST',
                        data: {
                            id: <?php echo ($sheets['id'])?>,
                            tipo_dado: dado,
                            resultado: resultado,
                            data_hora: new Date().toISOString()
                        },
                        success: function(response) {
                            console.log('Dado salvo com sucesso:', response);
                        },
                        error: function(xhr, status, error) {
                            console.error('Erro ao salvar dado:', error);
                        }
                    });
                }

                // Evento de clique nos botões
                $('.dice-btn').on('click', function() {
                    const tipoDado = $(this).data('dice');
                    const resultado = rolarDado(tipoDado);
                    const dataHora = formatarDataHora();

                    // Criar elemento do histórico
                    const historicoItem = `
                        <div class="historico-item mb-2 p-2 border rounded">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold">d${tipoDado}</span>
                                <span class="badge bg-success fs-6">${resultado}</span>
                            </div>
                            <small class="text-muted">${dataHora}</small>
                        </div>
                    `;

                    // Adicionar ao histórico (no topo)
                    $('#historico').prepend(historicoItem);

                    // Salvar no backend
                    salvarNoBackend(tipoDado, resultado);

                    // Efeito visual no botão
                    $(this).addClass('btn-success').removeClass('btn-primary');
                    setTimeout(() => {
                        $(this).addClass('btn-primary').removeClass('btn-success');
                    }, 300);
                });
            });
        </script>
    </body>
</html>