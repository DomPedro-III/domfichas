<?php
require_once 'app/models/User.php';
require_once 'app/models/Sheets.php';

class AuthController extends Controller {
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = $_POST['email'];
            $senha = $_POST['senha'];

            $user = User::login($email, $senha);

            if ($user) {
                session_start();
                $_SESSION['user'] = $user;
                header('Location: /?c=auth&a=dashboard');
                exit;
            }

            $erro = 'Login inválido!';
        }

        $this->view('login', ['erro' => $erro ?? null]);
    }

    public function goLogin() {

        $this->view('login'); 
    }

    public function registro() {

        $this->view('registro'); 
    }

    public static function addRegistro() {
        $db = Database::connect();
        $stmt = $db->prepare("
            INSERT INTO users (
            user,
            pass
            ) VALUES (
                '" . $_POST['user'] . "',
                '" . $_POST['pass'] . "'
            );
        "); 

        $stmt->execute();
        $stmt->fetch(PDO::FETCH_ASSOC);  

        $user = User::login($_POST['user'], $_POST['pass']);

            if ($user) {
                session_start();
                $_SESSION['user'] = $user;
                header('Location: /?c=auth&a=dashboard');
                exit;
            }
    }


    public function dashboard() {
        $this->checkSession();

        $data = Sheets::getList();

        $this->view('dashboard', ['data' => $data]);
    }

}