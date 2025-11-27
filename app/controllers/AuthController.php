<?php
require_once 'app/models/User.php';
require_once 'app/models/Sheets.php';

class AuthController extends Controller {
    //função de login
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $user = $_POST['user'];
            $senha = $_POST['senha'];

            $user = User::login($user, $senha);

            if ($user) {
                session_start();
                $_SESSION['user'] = $user;
                header('Location: /domfichas/?c=auth&a=painel');
                exit;
            }

            $erro = 'Login inválido!';
        }

        $this->view('login', ['erro' => $erro ?? null]);
    }

    // função para redirecionar à tela de login
    public function goLogin() {
        $this->view('login'); 
    }

    // função para redirecionar à tela de registro de conta
    public function registro() {
        $this->view('registro'); 
    }

    // FUNÇÃO PARA VALIDAR SENHA
    private function validarSenha($senha, $confirmacao) {
        $erros = [];
        if ($senha !== $confirmacao) {
            $erros[] = 'As senhas não coincidem!';
        }

        if (strlen($senha) < 6) {
            $erros[] = 'A senha deve ter pelo menos 6 caracteres!';
        }

        if (empty($senha)) {
            $erros[] = 'A senha não pode estar vazia!';
        }

        return $erros;
    }

    // função de registro
    public static function addRegistro() {
        $senha = $_POST['pass'] ?? '';
        $confirmacao = $_POST['passConf'] ?? '';

        $auth = new AuthController();
        $erros = $auth->validarSenha($senha, $confirmacao);

        if (!empty($erros)) {
            session_start();
            $_SESSION['erro_registro'] = implode('<br>', $erros);
            header('Location: /domfichas/?c=auth&a=registro');
            exit;
        }

        $db = Database::connect();
        $stmt = $db->prepare("
            INSERT INTO users (
            user,
            pass
            ) VALUES (
                :user,
                :pass
            );
        "); 

        $stmt->execute([
            ':user' => $_POST['user'],
            ':pass' => $senha 
        ]);

        $user = User::login($_POST['user'], $senha);

        if ($user) {
            session_start();
            $_SESSION['user'] = $user;
            header('Location: /domfichas/?c=auth&a=painel');
            exit;
        }
    }

    // Função para redirecionar ao painel de fichas
    public function painel() {
        $this->checkSession();

        $data = Sheets::getList();

        $this->view('painel', ['data' => $data]);
    }

}