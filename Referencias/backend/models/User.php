<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $user;
    public $pass;
    public $dt_created;
    public $dt_updated;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register() {
        try {
            $query = "INSERT INTO " . $this->table_name . " 
                     SET user=:user, pass=:pass, dt_created=:dt_created, dt_updated=:dt_updated";
            
            $stmt = $this->conn->prepare($query);
            
            $this->user = htmlspecialchars(strip_tags($this->user));
            $this->pass = password_hash($this->pass, PASSWORD_DEFAULT);
            $this->dt_created = date('Y-m-d');
            $this->dt_updated = date('Y-m-d');
            
            $stmt->bindParam(":user", $this->user);
            $stmt->bindParam(":pass", $this->pass);
            $stmt->bindParam(":dt_created", $this->dt_created);
            $stmt->bindParam(":dt_updated", $this->dt_updated);
            
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Register error: " . $e->getMessage());
            return false;
        }
    }

    public function userExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE user = :user";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user", $this->user);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    public function login() {
        $query = "SELECT id, user, pass FROM " . $this->table_name . " WHERE user = :user";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user", $this->user);
        $stmt->execute();
        
        if($stmt->rowCount() == 1) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if(password_verify($this->pass, $row['pass'])) {
                $this->id = $row['id'];
                $this->user = $row['user'];
                return true;
            }
        }
        return false;
    }
}
?>