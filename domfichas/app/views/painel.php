<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Painel de Fichas</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

        <style>
            body {
                background: #f5f5f5;
                padding: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 class="mb-4 text-center">Fichas</h2>
            

            <div class="card shadow">
                <div class="card-body">

                    <table class="table table-striped table-hover">
                        <thead class="table-primary">
                            <tr>
                                <th>Nome</th>
                                <th>For</th>
                                <th>Des</th>
                                <th>Von</th>
                                <th>HP</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            <?php foreach ($data as $items) { ?>
                            <tr>
                                <td><?php echo $items['name'] ?></td>
                                <td><?php echo $items['str'] ?></td>
                                <td><?php echo $items['dex'] ?></td>
                                <td><?php echo $items['wil'] ?></td>
                                <td><?php echo $items['hit_protection'] ?></td>
                                <td>
                                    <button class="btn btn-sm btn-primary" onclick="window.location.href = '/ficha?c=base&a=ver&id=<?php echo $items['id']; ?>'">Visualizar</button>
                                </td>
                            </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                    <button class="btn btn-danger" onclick="logout()">Deslogar</button>
                    <button class="btn btn-success"  onclick="window.location.href = '/ficha?c=base&a=ficha'">Cadastrar</button>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
        <script>
            function logout() {
                localStorage.removeItem("logado");

                window.location.href = "login";
            }
            $('#delete').on('shown.bs.modal', function () {
              $('#myInput').trigger('focus')
            })
        </script>
    </body>
</html>