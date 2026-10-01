<?php
class AuthRoute {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function handleRequest($method, $uri) {
        $path = isset($uri[1]) ? $uri[1] : '';

        if ($method === 'POST' && $path === 'register') {
            $this->register();
        } elseif ($method === 'POST' && $path === 'login') {
            $this->login();
        } elseif ($method === 'POST' && $path === 'logout') {
            $this->logout();
        } elseif ($method === 'GET' && $path === 'me') {
            $this->me();
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Not found"]);
        }
    }
    
    private function register() {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->email) || !isset($data->password) || !isset($data->name)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Incomplete data"]);
            return;
        }
        
        $email = $data->email;
        $stmt = $this->conn->prepare("SELECT user_id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) {
            http_response_code(409);
            echo json_encode(["status" => "error", "message" => "Email already exists"]);
            return;
        }
        
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
        $phone = $data->phone ?? null;
        
        $query = "INSERT INTO users (email, name, phone, password_hash) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        if ($stmt->execute([$email, $data->name, $phone, $password_hash])) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "User registered successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Registration failed"]);
        }
    }
    
    private function login() {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->email) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Incomplete data"]);
            return;
        }
        
        $stmt = $this->conn->prepare("SELECT user_id, password_hash, role, name FROM users WHERE email = ?");
        $stmt->execute([$data->email]);
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch();
            if (password_verify($data->password, $user['password_hash'])) {
                $token = bin2hex(random_bytes(32));
                $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
                
                $istmt = $this->conn->prepare("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
                $istmt->execute([$user['user_id'], $token, $expires_at]);
                
                echo json_encode([
                    "status" => "success", 
                    "message" => "Login successful",
                    "token" => $token,
                    "user" => [
                        "name" => $user['name'],
                        "role" => $user['role']
                    ]
                ]);
                return;
            }
        }
        
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }
    
    private function logout() {
        require_once __DIR__ . '/../middleware/auth.php';
        $headers = apache_request_headers();
        if (isset($headers['Authorization']) && preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            $token = $matches[1];
            $stmt = $this->conn->prepare("DELETE FROM user_sessions WHERE session_token = ?");
            $stmt->execute([$token]);
        }
        echo json_encode(["status" => "success", "message" => "Logged out successfully"]);
    }
    
    private function me() {
        require_once __DIR__ . '/../middleware/auth.php';
        $auth = new AuthMiddleware($this->conn);
        $user = $auth->authenticate();
        
        echo json_encode([
            "status" => "success",
            "data" => $user
        ]);
    }
}
