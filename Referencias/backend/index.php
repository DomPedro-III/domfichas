<?php
// Router principal do backend
require_once 'config/database.php';
require_once 'utils/Response.php';

$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Rotas da API
if (strpos($request, '/api/') === 0) {
    switch ($request) {
        case '/api/auth/register':
            if ($method === 'POST') {
                require 'views/api/auth/register.json.php';
            }
            break;
        case '/api/auth/login':
            if ($method === 'POST') {
                require 'views/api/auth/login.json.php';
            }
            break;
        case '/api/characters':
            if ($method === 'GET') {
                require 'views/api/characters/list.json.php';
            } elseif ($method === 'POST') {
                require 'views/api/characters/create.json.php';
            }
            break;
        case (preg_match('/\/api\/characters\/(\d+)/', $request, $matches) ? true : false):
            require 'views/api/characters/detail.json.php';
            break;
        default:
            http_response_code(404);
            echo json_encode(["message" => "Endpoint não encontrado."]);
    }
} 
// Rotas Web
else {
    switch ($request) {
        case '/dashboard':
            require 'views/web/dashboard.php';
            break;
        case '/':
            header('Location: /frontend/');
            break;
        default:
            http_response_code(404);
            echo "Página não encontrada";
    }
}
?>