<?php
class Attribute {
    private $conn;
    private $table_name = "attributes";

    public $id;
    public $fk_sheet;
    public $attributes_name;
    public $points;
    public $points_max;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET fk_sheet=:fk_sheet, attributes_name=:attributes_name, 
                     points=:points, points_max=:points_max";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":fk_sheet", $this->fk_sheet);
        $stmt->bindParam(":attributes_name", $this->attributes_name);
        $stmt->bindParam(":points", $this->points);
        $stmt->bindParam(":points_max", $this->points_max);
        
        return $stmt->execute();
    }

    public function getByCharacter($character_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                 WHERE fk_sheet = :character_id 
                 ORDER BY id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":character_id", $character_id);
        $stmt->execute();
        
        $attributes = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $attributes[] = $row;
        }
        
        return $attributes;
    }

    public function update($attribute_id, $data) {
        $query = "UPDATE " . $this->table_name . " 
                 SET points=:points, points_max=:points_max 
                 WHERE id=:id AND fk_sheet=:fk_sheet";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":points", $data->points);
        $stmt->bindParam(":points_max", $data->points_max);
        $stmt->bindParam(":id", $attribute_id);
        $stmt->bindParam(":fk_sheet", $data->fk_sheet);
        
        return $stmt->execute();
    }
}
?>