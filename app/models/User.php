<?php
class User {
    // função que busca o usuário no banco de dados
    public static function login($user, $senha) {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM users WHERE user = ? AND pass = ? LIMIT 1");
        $stmt->execute([$user, $senha]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}