<?php
class CharacterController {
    private $characterModel;
    private $attributeModel;
    private $inventoryModel;
    private $skillModel;
    private $response;

    public function __construct($db) {
        $this->characterModel = new Character($db);
        $this->attributeModel = new Attribute($db);
        $this->inventoryModel = new Inventory($db);
        $this->skillModel = new Skill($db);
        $this->response = new Response();
    }

    public function create($data, $user_id) {
        try {
            $validation = new Validation();
            $errors = $validation->validateCharacter($data);
            
            if (!empty($errors)) {
                return $this->response->error("Dados inválidos.", 400, $errors);
            }

            $this->characterModel->fk_user = $user_id;
            $this->characterModel->name = $data->name;
            $this->characterModel->hi_protection = $data->hi_protection ?? 0;
            $this->characterModel->hi_protection_max = $data->hi_protection_max ?? 0;
            $this->characterModel->copper_coins = $data->copper_coins ?? 0;
            $this->characterModel->silver_coins = $data->silver_coins ?? 0;
            $this->characterModel->golden_coins = $data->golden_coins ?? 0;
            $this->characterModel->notes = $data->notes ?? '';

            if ($this->characterModel->create()) {
                // Criar atributos padrão
                $this->createDefaultAttributes($this->characterModel->id);
                
                return $this->response->success("Personagem criado com sucesso.", [
                    'character' => [
                        'id' => $this->characterModel->id,
                        'name' => $this->characterModel->name
                    ]
                ], 201);
            } else {
                return $this->response->error("Não foi possível criar o personagem.", 500);
            }
        } catch (Exception $e) {
            error_log("CharacterController create error: " . $e->getMessage());
            return $this->response->error("Erro interno do servidor.", 500);
        }
    }

    private function createDefaultAttributes($character_id) {
        $defaultAttributes = [
            ['name' => 'Força', 'points' => 10, 'max' => 10],
            ['name' => 'Destreza', 'points' => 10, 'max' => 10],
            ['name' => 'Constituição', 'points' => 10, 'max' => 10],
            ['name' => 'Inteligência', 'points' => 10, 'max' => 10],
            ['name' => 'Sabedoria', 'points' => 10, 'max' => 10],
            ['name' => 'Carisma', 'points' => 10, 'max' => 10]
        ];

        foreach ($defaultAttributes as $attr) {
            $this->attributeModel->fk_sheet = $character_id;
            $this->attributeModel->attributes_name = $attr['name'];
            $this->attributeModel->points = $attr['points'];
            $this->attributeModel->points_max = $attr['max'];
            $this->attributeModel->create();
        }
    }

    public function getUserCharacters($user_id) {
        try {
            $stmt = $this->characterModel->getByUser($user_id);
            $characters = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $characters[] = $row;
            }

            return $this->response->success("Personagens recuperados com sucesso.", [
                'characters' => $characters
            ]);
        } catch (Exception $e) {
            error_log("CharacterController getUserCharacters error: " . $e->getMessage());
            return $this->response->error("Erro interno do servidor.", 500);
        }
    }

    public function getCharacter($character_id, $user_id) {
        try {
            $character = $this->characterModel->getById($character_id);
            
            if (!$character) {
                return $this->response->error("Personagem não encontrado.", 404);
            }

            if ($character['fk_user'] != $user_id) {
                return $this->response->error("Acesso não autorizado.", 403);
            }

            // Buscar dados relacionados
            $attributes = $this->attributeModel->getByCharacter($character_id);
            $inventory = $this->inventoryModel->getByCharacter($character_id);
            $skills = $this->skillModel->getByCharacter($character_id);

            $characterData = [
                'character' => $character,
                'attributes' => $attributes,
                'inventory' => $inventory,
                'skills' => $skills
            ];

            return $this->response->success("Personagem recuperado com sucesso.", $characterData);
        } catch (Exception $e) {
            error_log("CharacterController getCharacter error: " . $e->getMessage());
            return $this->response->error("Erro interno do servidor.", 500);
        }
    }

    public function update($character_id, $data, $user_id) {
        try {
            $character = $this->characterModel->getById($character_id);
            
            if (!$character) {
                return $this->response->error("Personagem não encontrado.", 404);
            }

            if ($character['fk_user'] != $user_id) {
                return $this->response->error("Acesso não autorizado.", 403);
            }

            $this->characterModel->id = $character_id;
            $this->characterModel->name = $data->name ?? $character['name'];
            $this->characterModel->hi_protection = $data->hi_protection ?? $character['hi_protection'];
            $this->characterModel->hi_protection_max = $data->hi_protection_max ?? $character['hi_protection_max'];
            $this->characterModel->copper_coins = $data->copper_coins ?? $character['copper_coins'];
            $this->characterModel->silver_coins = $data->silver_coins ?? $character['silver_coins'];
            $this->characterModel->golden_coins = $data->golden_coins ?? $character['golden_coins'];
            $this->characterModel->notes = $data->notes ?? $character['notes'];

            if ($this->characterModel->update()) {
                return $this->response->success("Personagem atualizado com sucesso.");
            } else {
                return $this->response->error("Não foi possível atualizar o personagem.", 500);
            }
        } catch (Exception $e) {
            error_log("CharacterController update error: " . $e->getMessage());
            return $this->response->error("Erro interno do servidor.", 500);
        }
    }

    public function delete($character_id, $user_id) {
        try {
            $character = $this->characterModel->getById($character_id);
            
            if (!$character) {
                return $this->response->error("Personagem não encontrado.", 404);
            }

            if ($character['fk_user'] != $user_id) {
                return $this->response->error("Acesso não autorizado.", 403);
            }

            if ($this->characterModel->delete($character_id)) {
                return $this->response->success("Personagem excluído com sucesso.");
            } else {
                return $this->response->error("Não foi possível excluir o personagem.", 500);
            }
        } catch (Exception $e) {
            error_log("CharacterController delete error: " . $e->getMessage());
            return $this->response->error("Erro interno do servidor.", 500);
        }
    }
}
?>