<?php
class AdminRoute {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function handleRequest($method, $uri) {
        require_once __DIR__ . '/../middleware/auth.php';
        $auth = new AuthMiddleware($this->conn);
        $auth->authorizeAdmin();
        
        $path = isset($uri[1]) ? $uri[1] : '';
        
        if ($method === 'GET' && $path === 'dashboard') {
            $this->getDashboard();
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Not found"]);
        }
    }
    
    private function getDashboard() {
        $stats = [];
        
        $stmt = $this->conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
        $stats['total_users'] = $stmt->fetch()['count'];
        
        $stmt = $this->conn->query("SELECT COUNT(*) as count FROM orders");
        $stats['total_orders'] = $stmt->fetch()['count'];
        
        $stmt = $this->conn->query("SELECT SUM(total) as revenue FROM orders WHERE status = 'completed' OR status = 'paid'");
        $stats['total_revenue'] = $stmt->fetch()['revenue'] ?? 0;
        
        echo json_encode(["status" => "success", "data" => $stats]);
    }
}
