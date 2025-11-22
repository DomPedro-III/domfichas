<?php
class Skill {
    private $conn;
    private $table_name = "skills";

    public $id;
    public $name_skill;
    public $desc_skill;
    public $fk_sheet;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET name_skill=:name_skill, desc_skill=:desc_skill, fk_sheet=:fk_sheet";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":name_skill", $this->name_skill);
        $stmt->bindParam(":desc_skill", $this->desc_skill);
        $stmt->bindParam(":fk_sheet", $this->fk_sheet);
        
        return $stmt->execute();
    }

    public function getByCharacter($character_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                 WHERE fk_sheet = :character_id 
                 ORDER BY id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":character_id", $character_id);
        $stmt->execute();
        
        $skills = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $skills[] = $row;
        }
        
        return $skills;
    }

    public function addSkill($character_id, $data) {
        $this->fk_sheet = $character_id;
        $this->name_skill = $data->name_skill;
        $this->desc_skill = $data->desc_skill;
        
        return $this->create();
    }

    public function deleteSkill($skill_id, $character_id) {
        $query = "DELETE FROM " . $this->table_name . " 
                 WHERE id = :id AND fk_sheet = :character_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $skill_id);
        $stmt->bindParam(":character_id", $character_id);
        
        return $stmt->execute();
    }
}
?>