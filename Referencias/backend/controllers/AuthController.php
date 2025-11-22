<?php
class AuthController {
    private $userModel;
    private $response;

    public function __construct($db) {
        $this->userModel = new User($db);
        $this->response = new Response();
    }

    public function register($data) {
        try {
            if(empty($data->user) || empty($data->pass) || empty($data->confirm_pass)) {
                return $this->response->error("Dados incompletos.", 400);
            }

            if($data->pass !== $data->confirm_pass) {
                return $this->response->error("As senhas não coincidem.", 400);
            }

            $this->userModel->user = $data->user;
            $this->userModel->pass = $data->pass;

            if($this->userModel->userExists()) {
                return $this->response->error("Usuário já existe.", 400);
            }

            if($this->userModel->register()) {
                return $this->response->success("Usuário criado com sucesso.", [
                    'user' => [
                        'id' => $this->userModel->id,
                        'user' => $this->userModel->user
                    ]
                ], 201);
            } else {
                return $this->response->error("Não foi possível criar o usuário.", 500);
            }
        } catch (Exception $e) {
            error_log("AuthController register error: " . $e->getMessage());
            return $this->response->error("Erro interno do servidor.", 500);
        }
    }

    public function login($data) {
        try {
            if(empty($data->user) || empty($data->pass)) {
                return $this->response->error("Dados incompletos.", 400);
            }

            $this->userModel->user = $data->user;
            $this->userModel->pass = $data->pass;

            if($this->userModel->login()) {
                $token = base64_encode($this->userModel->id . ":" . $this->userModel->user);
                
                return $this->response->success("Login realizado com sucesso.", [
                    'token' => $token,
                    'user' => [
                        'id' => $this->userModel->id,
                        'user' => $this->userModel->user
                    ]
                ]);
            } else {
                return $this->response->error("Credenciais inválidas.", 401);
            }
        } catch (Exception $e) {
            error_log("AuthController login error: " . $e->getMessage());
            return $this->response->error("Erro interno do servidor.", 500);
        }
    }
}
?>