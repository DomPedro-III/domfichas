<?php
class Sheets {
    // função que busca a lista de fichas da conta, mas excluindo as já deletadas do banco de dados
    public static function getList() {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM sheets WHERE fk_user = ? AND deleted_at IS NULL");
        $stmt->execute([$_SESSION['user']['id']]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // função que busca a ficha selecionada no banco de dados
    public static function getSheet() {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM sheets WHERE fk_user = ? AND id = ? LIMIT 1");
        $stmt->execute([$_SESSION['user']['id'], $_GET['id']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // função que atualiza a ficha selecionada no banco de dados
    public static function updateSheet() {
        $db = Database::connect();
        $stmt = $db->prepare("
            UPDATE sheets
            SET `name` = '" . $_POST['name'] . "',
                `str` = '" . $_POST['forca'] . "',
                `str_max` = '" . $_POST['forca_max'] . "',
                `dex` = '" . $_POST['destreza'] . "',
                `dex_max` = '" . $_POST['destreza_max'] . "',
                `wil` = '" . $_POST['vontade'] . "',
                `wil_max` = '" . $_POST['vontade_max'] . "',
                `hit_protection` = '" . $_POST['hit_protection'] . "',
                `hit_protection_max` = '" . $_POST['hit_protection_max'] . "',
                `armor` = '" . $_POST['armor'] . "',
                `copper_coins` = '" . $_POST['copper_coins'] . "',
                `silver_coins` = '" . $_POST['silver_coins'] . "',
                `golden_coins` = '" . $_POST['golden_coins'] . "',
                `notes` = '" . $_POST['notes'] . "',
                `inventory` = '" . $_POST['inventory'] . "'
            WHERE (`id` = '" . $_POST['id'] . "');
        ");

        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // função que cadastra a ficha nova no banco de dados
    public static function addSheet() {
        $db = Database::connect();
        $stmt = $db->prepare("
            INSERT INTO sheets (
                fk_user,
                name,
                str,
                str_max,
                dex,
                dex_max,
                wil,
                wil_max,
                hit_protection,
                hit_protection_max,
                armor,
                copper_coins,
                silver_coins,
                golden_coins,
                notes,
                inventory,
                id
            ) VALUES (
                '" . $_SESSION['user']['id'] . "',
                '" . $_POST['name'] . "',
                '" . $_POST['forca'] . "',
                '" . $_POST['forca_max'] . "',
                '" . $_POST['destreza'] . "',
                '" . $_POST['destreza_max'] . "',
                '" . $_POST['vontade'] . "',
                '" . $_POST['vontade_max'] . "',
                '" . $_POST['hit_protection'] . "',
                '" . $_POST['hit_protection_max'] . "',
                '" . $_POST['armor'] . "',
                '" . $_POST['copper_coins'] . "',
                '" . $_POST['silver_coins'] . "',
                '" . $_POST['golden_coins'] . "',
                '" . $_POST['notes'] . "',
                '" . $_POST['inventory'] . "',
                '" . $_POST['id'] . "'
            );
        ");

        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // função que 'deleta' a ficha do banco
    // a função adiciona uma data na tabela fazendo com que ela deixe de ser exibida no painel, mas ainda possibilita a recuperação da mesma via banco de dados
    public static function deleteSheet() {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE sheets SET deleted_at = NOW() WHERE (id = '" . $_GET['id'] . "')");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}