<?php
class Controller {
    public function view($view, $data = []) {
        extract($data);
        require "app/views/$view.php";
    }

    public function checkSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['user'])) {
            header('Location: /');
            exit;
        }
    }
}