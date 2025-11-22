<?php
require_once 'core/Controller.php';
require_once 'core/Database.php';

$controller = $_GET['c'] ?? 'auth';
$action = $_GET['a'] ?? 'login';

$controllerName = ucfirst($controller) . 'Controller';
require_once "app/controllers/$controllerName.php";

$instance = new $controllerName();
$instance->$action();