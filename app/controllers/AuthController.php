<?php
require_once 'app/models/User.php';
require_once 'app/models/Sheets.php';

class AuthController extends Controller {
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = $_POST['user'];
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

    // 🔐 FUNÇÃO PARA VALIDAR SENHA
    private function validarSenha($senha, $confirmacao) {
        $erros = [];

        // Verificar se as senhas coincidem
        if ($senha !== $confirmacao) {
            $erros[] = 'As senhas não coincidem!';
        }

        // Verificar comprimento mínimo (opcional)
        if (strlen($senha) < 6) {
            $erros[] = 'A senha deve ter pelo menos 6 caracteres!';
        }

        // Verificar se a senha não está vazia
        if (empty($senha)) {
            $erros[] = 'A senha não pode estar vazia!';
        }

        return $erros;
    }

    public static function addRegistro() {
        // Validar confirmação de senha
        $senha = $_POST['pass'] ?? '';
        $confirmacao = $_POST['senhaConf'] ?? '';

        // Criar instância para acessar o método de validação
        $auth = new AuthController();
        $erros = $auth->validarSenha($senha, $confirmacao);

        // Se houver erros, redirecionar de volta ao registro
        if (!empty($erros)) {
            session_start();
            $_SESSION['erro_registro'] = implode('<br>', $erros);
            header('Location: /?c=auth&a=registro');
            exit;
        }

        // Se a validação passou, prosseguir com o registro
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

        // Usar parâmetros nomeados para mais segurança
        $stmt->execute([
            ':user' => $_POST['user'],
            ':pass' => $senha // Usar a senha já validada
        ]);

        $user = User::login($_POST['user'], $senha);

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