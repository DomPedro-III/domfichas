<?php
class Inventory {
    private $conn;
    private $table_name = "inventory_itens";

    public $id;
    public $fk_sheet;
    public $name_item;
    public $desc_item;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET fk_sheet=:fk_sheet, name_item=:name_item, desc_item=:desc_item";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":fk_sheet", $this->fk_sheet);
        $stmt->bindParam(":name_item", $this->name_item);
        $stmt->bindParam(":desc_item", $this->desc_item);
        
        return $stmt->execute();
    }

    public function getByCharacter($character_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                 WHERE fk_sheet = :character_id 
                 ORDER BY id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":character_id", $character_id);
        $stmt->execute();
        
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = $row;
        }
        
        return $items;
    }

    public function addItem($character_id, $data) {
        $this->fk_sheet = $character_id;
        $this->name_item = $data->name_item;
        $this->desc_item = $data->desc_item;
        
        return $this->create();
    }

    public function deleteItem($item_id, $character_id) {
        $query = "DELETE FROM " . $this->table_name . " 
                 WHERE id = :id AND fk_sheet = :character_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $item_id);
        $stmt->bindParam(":character_id", $character_id);
        
        return $stmt->execute();
    }
}
?>