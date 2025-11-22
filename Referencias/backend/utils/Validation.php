<?php
class Validation {
    public function validateCharacter($data) {
        $errors = [];

        if (empty($data->name)) {
            $errors['name'] = 'Nome do personagem é obrigatório';
        } elseif (strlen($data->name) < 2) {
            $errors['name'] = 'Nome deve ter pelo menos 2 caracteres';
        } elseif (strlen($data->name) > 100) {
            $errors['name'] = 'Nome não pode ter mais de 100 caracteres';
        }

        if (isset($data->hi_protection) && !is_numeric($data->hi_protection)) {
            $errors['hi_protection'] = 'Proteção deve ser um número';
        }

        if (isset($data->hi_protection_max) && !is_numeric($data->hi_protection_max)) {
            $errors['hi_protection_max'] = 'Proteção máxima deve ser um número';
        }

        return $errors;
    }

    public function validateUser($data) {
        $errors = [];

        if (empty($data->user)) {
            $errors['user'] = 'Nome de usuário é obrigatório';
        } elseif (strlen($data->user) < 3) {
            $errors['user'] = 'Nome de usuário deve ter pelo menos 3 caracteres';
        } elseif (strlen($data->user) > 100) {
            $errors['user'] = 'Nome de usuário não pode ter mais de 100 caracteres';
        } elseif (!preg_match('/^[a-zA-Z0-9_]+$/', $data->user)) {
            $errors['user'] = 'Nome de usuário só pode conter letras, números e underscore';
        }

        if (empty($data->pass)) {
            $errors['pass'] = 'Senha é obrigatória';
        } elseif (strlen($data->pass) < 6) {
            $errors['pass'] = 'Senha deve ter pelo menos 6 caracteres';
        }

        return $errors;
    }

    public function validateAttribute($data) {
        $errors = [];

        if (empty($data->attributes_name)) {
            $errors['attributes_name'] = 'Nome do atributo é obrigatório';
        }

        if (!isset($data->points) || !is_numeric($data->points)) {
            $errors['points'] = 'Pontos devem ser um número';
        }

        if (!isset($data->points_max) || !is_numeric($data->points_max)) {
            $errors['points_max'] = 'Pontos máximos devem ser um número';
        }

        return $errors;
    }

    public function sanitizeInput($input) {
        if (is_array($input)) {
            return array_map([$this, 'sanitizeInput'], $input);
        }
        
        return htmlspecialchars(strip_tags(trim($input)));
    }
}
?>