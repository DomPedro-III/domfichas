<?php
class Response {
    public function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public function success($message, $data = null, $statusCode = 200) {
        $response = [
            'success' => true,
            'message' => $message
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        $this->json($response, $statusCode);
    }

    public function error($message, $statusCode = 400) {
        $this->json([
            'success' => false,
            'message' => $message
        ], $statusCode);
    }
}
?>