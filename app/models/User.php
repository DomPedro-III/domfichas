<?php
class User {
    public static function login($email, $senha) {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM users WHERE user = ? AND pass = ? LIMIT 1");
        $stmt->execute([$email, $senha]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}