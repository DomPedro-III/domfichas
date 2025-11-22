<?php
class Character {
    private $conn;
    private $table_name = "sheets";

    public $id;
    public $fk_user;
    public $name;
    public $hi_protection;
    public $hi_protection_max;
    public $deleted_at;
    public $copper_coins;
    public $silver_coins;
    public $golden_coins;
    public $notes;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET fk_user=:fk_user, name=:name, hi_protection=:hi_protection, 
                     hi_protection_max=:hi_protection_max, copper_coins=:copper_coins,
                     silver_coins=:silver_coins, golden_coins=:golden_coins, notes=:notes";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":fk_user", $this->fk_user);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":hi_protection", $this->hi_protection);
        $stmt->bindParam(":hi_protection_max", $this->hi_protection_max);
        $stmt->bindParam(":copper_coins", $this->copper_coins);
        $stmt->bindParam(":silver_coins", $this->silver_coins);
        $stmt->bindParam(":golden_coins", $this->golden_coins);
        $stmt->bindParam(":notes", $this->notes);
        
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getByUser($user_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                 WHERE fk_user = :user_id AND deleted_at IS NULL 
                 ORDER BY id DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        
        return $stmt;
    }

    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                 WHERE id = :id AND deleted_at IS NULL";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>