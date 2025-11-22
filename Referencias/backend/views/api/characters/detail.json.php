<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../../../config/database.php';
require_once '../../../controllers/CharacterController.php';
require_once '../../../utils/AuthMiddleware.php';

$database = new Database();
$db = $database->getConnection();

$auth = new AuthMiddleware();
$user = $auth->authenticate();

$controller = new CharacterController($db);

// Extrair ID da URL
$url = $_SERVER['REQUEST_URI'];
$parts = explode('/', $url);
$character_id = end($parts);

if (is_numeric($character_id)) {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $controller->getCharacter($character_id, $user['user_id']);
            break;
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));
            $controller->update($character_id, $data, $user['user_id']);
            break;
        case 'DELETE':
            $controller->delete($character_id, $user['user_id']);
            break;
        default:
            http_response_code(405);
            echo json_encode(["message" => "Método não permitido."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "ID de personagem inválido."]);
}
?>