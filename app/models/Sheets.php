<?php
class Sheets {
    public static function getList() {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM sheets WHERE fk_user = ? AND deleted_at IS NULL");
        $stmt->execute([$_SESSION['user']['id']]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getSheet() {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM sheets WHERE fk_user = ? AND id = ? LIMIT 1");
        $stmt->execute([$_SESSION['user']['id'], $_GET['id']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

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
    public static function deleteSheet() {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE sheets SET deleted_at = NOW() WHERE (id = '" . $_GET['id'] . "')");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}