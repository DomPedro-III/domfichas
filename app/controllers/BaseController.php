<?php
require_once 'app/models/Sheets.php';
require_once 'app/controllers/AuthController.php';
require_once 'app/models/Inventory.php';
require_once 'app/models/Dados.php';

class BaseController extends Controller {
    public function fixa() {
        $this->checkSession();

        if (isset($_GET['id'])) {
            $sheets = Sheets::getSheet();

            $this->view('fixa', ['sheets' => $sheets]);
        } else {
            $this->view('fixa');
        }
        
    }

    public function cadastro() {
        $this->checkSession();

        if (!empty($_POST['id'])) {
            Sheets::updateSheet();
            header('Location: /?c=base&a=ver&id='.$_POST['id']);
            exit;
        } else {
            Sheets::addSheet();
        }

        $auth = new AuthController();
        $auth->dashboard();
    }

    public function deletar() {
        $this->checkSession();

        Sheets::deleteSheet();

        $auth = new AuthController();
        $auth->dashboard();
    }

    public function ver() {
        $this->checkSession();

        $sheets = Sheets::getSheet();
        $dice_hist = Dados::getList();
        $this->view('ver', ['sheets' => $sheets, 'dice_hist' => $dice_hist]);
        
    }

    public function inventario() {
        $this->checkSession();

        $this->view('inventario', ['id' => $_GET['id']]); 
    }

    // public function cadastroInventario() {
    //     $this->checkSession();

    //     if (!empty($_POST['id'])) {
    //         Inventory::updateInventory();
    //     } else {
    //         Inventory::addInventory();
    //     }
        
    //     header('Location: /?c=auth&a=dashboard');
    //     exit;
    // }

    // public function deletarInventario() {
    //     $this->checkSession();

    //     Inventory::deleteInventory();

    //     $auth = new AuthController();
    //     $auth->dashboard();
    // }

    public function salvarDados() {
        $this->checkSession();
        Dados::addDados();
    }
}