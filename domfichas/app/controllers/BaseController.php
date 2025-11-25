<?php
require_once 'app/models/Sheets.php';
require_once 'app/controllers/AuthController.php';
require_once 'app/models/Inventory.php';
require_once 'app/models/Dados.php';

class BaseController extends Controller {
    // função para redirecionar à tela de edição da ficha selecionada
    public function ficha() {
        $this->checkSession();

        if (isset($_GET['id'])) {
            $sheets = Sheets::getSheet();

            $this->view('ficha', ['sheets' => $sheets]);
        } else {
            $this->view('ficha');
        }
        
    }

    // função de cadastro de fichas
    public function cadastro() {
        try{
            $this->checkSession();

            if (!empty($_POST['id'])) {
                Sheets::updateSheet();
                header('Location: /?c=base&a=ver&id='.$_POST['id']);
                exit;
            } else {
                Sheets::addSheet();
            }

            $auth = new AuthController();
            $auth->painel();
        }catch(Exception $e){
            if (!empty($_POST['id'])) {
                header('Location: /?c=base&a=ficha&id='.$_POST['id'].'&erro=1');
            } else {
                header('Location: /?c=base&a=ver&erro=1');
            }
        }
    }

    //função para excluir a ficha selecionada
    public function deletar() {
        $this->checkSession();

        Sheets::deleteSheet();

        $auth = new AuthController();
        $auth->painel();
    }

    //função para visualização da ficha selecionada
    public function ver() {
        $this->checkSession();

        $sheets = Sheets::getSheet();
        $dice_hist = Dados::getList();
        $this->view('ver', ['sheets' => $sheets, 'dice_hist' => $dice_hist]);
        
    }

    // função que inicia o registro do dado rolado ao banco de dados
    public function salvarDados() {
        $this->checkSession();
        Dados::addDados();
    }
}