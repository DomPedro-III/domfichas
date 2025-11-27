<?php
// Configurar o fuso horário para America/Sao_Paulo
date_default_timezone_set('America/Sao_Paulo');

class Dados {
    // função para solicitação do histórico de dados da ficha aberta
    public static function getList() {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM dices WHERE fk_sheet = ? ORDER BY `when` DESC LIMIT 10");
        $stmt->execute([$_GET['id']]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // função que envia os dados rolados ao banco de dados
    public static function addDados() {
        $db = Database::connect();
        $stmt = $db->prepare("
            INSERT INTO dices (
            fk_sheet,
            `type`,
            result,
            `when`
            ) VALUES (
                ?,
                ?,
                ?,
                NOW()
            );
        ");

        $stmt->execute([
            $_POST['id'],
            $_POST['tipo_dado'],
            $_POST['resultado']
        ]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
