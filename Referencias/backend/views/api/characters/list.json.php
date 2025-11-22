<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $controller->getUserCharacters($user['user_id']);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
}
?>