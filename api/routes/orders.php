<?php
class OrdersRoute {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function handleRequest($method, $uri) {
        require_once __DIR__ . '/../middleware/auth.php';
        $path = isset($uri[1]) ? $uri[1] : '';
        
        if ($method === 'POST' && $path === 'callback') {
            $this->paymentCallback();
            return;
        }
        
        $auth = new AuthMiddleware($this->conn);
        $user = $auth->authenticate();

        if ($method === 'POST' && empty($path)) {
            $this->createOrder($user);
        } elseif ($method === 'GET' && empty($path)) {
            $this->listOrders($user);
        } elseif ($method === 'GET' && is_numeric($path)) {
            $this->getOrder($path, $user);
        } elseif ($method === 'PUT' && is_numeric($path) && isset($uri[2]) && $uri[2] === 'status') {
            $auth->authorizeAdmin();
            $this->updateStatus($path);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Not found"]);
        }
    }
    
    private function createOrder($user) {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->items) || !isset($data->address)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Incomplete data"]);
            return;
        }

        $subtotal = $data->subtotal ?? 0;
        $delivery_fee = $data->delivery_fee ?? 0;
        $discount = $data->discount ?? 0;
        $total = $subtotal + $delivery_fee - $discount;
        
        $order_id = "WS-" . time() . "-" . $user['user_id'];

        $query = "INSERT INTO orders (user_id, items, subtotal, delivery_fee, discount, total, voucher_code, address, lat, lng, distance_km, midtrans_order_id, notes) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                  
        $stmt = $this->conn->prepare($query);
        if ($stmt->execute([
            $user['user_id'],
            json_encode($data->items),
            $subtotal,
            $delivery_fee,
            $discount,
            $total,
            $data->voucher_code ?? null,
            $data->address,
            $data->lat ?? null,
            $data->lng ?? null,
            $data->distance_km ?? null,
            $order_id,
            $data->notes ?? null
        ])) {
            $db_order_id = $this->conn->lastInsertId();
            
            $token = $this->generateSnapToken($order_id, $total, $user);
            
            if ($token) {
                $this->conn->prepare("UPDATE orders SET payment_token = ? WHERE order_id = ?")->execute([$token, $db_order_id]);
            }
            
            echo json_encode([
                "status" => "success", 
                "message" => "Order created",
                "order_id" => $db_order_id,
                "payment_token" => $token
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to create order"]);
        }
    }
    
    private function generateSnapToken($order_id, $gross_amount, $user) {
        $server_key = MIDTRANS_SERVER_KEY;
        $url = MIDTRANS_IS_PRODUCTION ? 'https://app.midtrans.com/snap/v1/transactions' : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
        
        $payload = [
            'transaction_details' => [
                'order_id' => $order_id,
                'gross_amount' => round($gross_amount),
            ],
            'customer_details' => [
                'first_name' => $user['name'],
                'email' => $user['email'],
            ]
        ];
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Basic ' . base64_encode($server_key . ':')
        ]);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $result = json_decode($response);
        return $result->token ?? null;
    }
    
    private function listOrders($user) {
        $query = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
        if ($user['role'] === 'admin') {
            $query = "SELECT * FROM orders ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
        } else {
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$user['user_id']]);
        }
        
        echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
    }
    
    private function getOrder($id, $user) {
        $query = "SELECT * FROM orders WHERE order_id = ?";
        if ($user['role'] !== 'admin') {
            $query .= " AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id, $user['user_id']]);
        } else {
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
        }
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "data" => $stmt->fetch()]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Order not found"]);
        }
    }
    
    private function updateStatus($id) {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->status)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Status required"]);
            return;
        }
        
        $stmt = $this->conn->prepare("UPDATE orders SET status = ? WHERE order_id = ?");
        $stmt->execute([$data->status, $id]);
        
        echo json_encode(["status" => "success", "message" => "Order status updated"]);
    }
    
    private function paymentCallback() {
        $payload = json_decode(file_get_contents('php://input'));
        if (!$payload) return;
        
        $order_id = $payload->order_id;
        $status_code = $payload->status_code;
        $gross_amount = $payload->gross_amount;
        $server_key = MIDTRANS_SERVER_KEY;
        $signature_key = hash("sha512", $order_id.$status_code.$gross_amount.$server_key);
        
        if ($signature_key !== $payload->signature_key) {
            http_response_code(401);
            echo "Invalid signature";
            return;
        }
        
        $transaction_status = $payload->transaction_status;
        $status = 'pending';
        
        if ($transaction_status == 'capture' || $transaction_status == 'settlement') {
            $status = 'paid';
        } else if ($transaction_status == 'cancel' || $transaction_status == 'deny' || $transaction_status == 'expire') {
            $status = 'cancelled';
        }
        
        $stmt = $this->conn->prepare("UPDATE orders SET status = ? WHERE midtrans_order_id = ?");
        $stmt->execute([$status, $order_id]);
        
        echo json_encode(["status" => "success"]);
    }
}
