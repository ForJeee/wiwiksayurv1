<?php
class AuthMiddleware {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function authenticate() {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                $token = $matches[1];
                return $this->validateToken($token);
            }
        }
        
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit;
    }
    
    public function authorizeAdmin() {
        $user = $this->authenticate();
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Forbidden: Admin access required"]);
            exit;
        }
        return $user;
    }

    private function validateToken($token) {
        $query = "SELECT u.user_id, u.email, u.name, u.role 
                  FROM user_sessions s
                  JOIN users u ON s.user_id = u.user_id
                  WHERE s.session_token = :token AND s.expires_at > NOW()";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch();
        }
        
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token"]);
        exit;
    }
}
