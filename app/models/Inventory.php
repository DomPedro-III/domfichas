<?php
class Inventory {
    public static function getList() {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM inventory_itens WHERE fk_sheet = ?");
        $stmt->execute([$_SESSION['user']['id']]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function updateInventory() {
        $db = Database::connect();
        $stmt = $db->prepare("
            UPDATE inventory_itens
            SET `name_item` = '" . $_POST['name_item'] . "',
                `desc_item` = '" . $_POST['desc_item'] . "'
            WHERE (`id` = '" . $_POST['id'] . "');
        ");

        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

        public static function addInventory() {
        $db = Database::connect();
        $stmt = $db->prepare("
            INSERT INTO inventory_itens (
            fk_sheet,
            name_item,
            desc_item
            ) VALUES (
                '" . $_POST['id'] . "',
                '" . $_POST['name_item'] . "',
                '" . $_POST['desc_item'] . "'
            );
        ");

        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public static function deleteInventory() {
        $db = Database::connect();
        $stmt = $db->prepare("DELETE from inventory_itens WHERE (id = '" . $_GET['id'] . "')");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}