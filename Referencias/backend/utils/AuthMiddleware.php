<?php
class AuthMiddleware {
    private $response;

    public function __construct() {
        $this->response = new Response();
    }

    public function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($authHeader)) {
            $this->response->error("Token de autenticação não fornecido.", 401);
        }

        // Remover 'Bearer ' se presente
        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = base64_decode($token);
            $parts = explode(':', $decoded);
            
            if (count($parts) !== 2) {
                $this->response->error("Token inválido.", 401);
            }

            $user_id = $parts[0];
            $username = $parts[1];

            // Verificar se o usuário existe
            $database = new Database();
            $db = $database->getConnection();
            $userModel = new User($db);
            
            $user = $userModel->getUserById($user_id);
            
            if (!$user || $user['user'] !== $username) {
                $this->response->error("Token inválido.", 401);
            }

            return [
                'user_id' => $user_id,
                'username' => $username
            ];

        } catch (Exception $e) {
            error_log("AuthMiddleware error: " . $e->getMessage());
            $this->response->error("Token inválido.", 401);
        }
    }

    public function optionalAuth() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($authHeader)) {
            return null;
        }

        return $this->authenticate();
    }
}
?>