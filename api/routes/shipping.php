<?php
class ShippingRoute {
    private $conn;
    
    private $store_lat = -6.200000;
    private $store_lng = 106.816666;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function handleRequest($method, $uri) {
        $path = isset($uri[1]) ? $uri[1] : '';
        
        if ($method === 'POST' && $path === 'quote') {
            $this->getQuote();
        } elseif ($method === 'GET' && $path === 'geocode') {
            $this->geocode();
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Not found"]);
        }
    }
    
    private function geocode() {
        if (!isset($_GET['address'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Address is required"]);
            return;
        }
        
        $address = $_GET['address'];
        $url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($address) . "&key=" . GOOGLE_MAPS_API_KEY;
        
        $response = file_get_contents($url);
        $data = json_decode($response);
        
        if ($data && $data->status === 'OK') {
            $loc = $data->results[0]->geometry->location;
            echo json_encode([
                "status" => "success",
                "data" => [
                    "lat" => $loc->lat,
                    "lng" => $loc->lng,
                    "formatted_address" => $data->results[0]->formatted_address
                ]
            ]);
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Geocoding failed"]);
        }
    }
    
    private function getQuote() {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->lat) || !isset($data->lng) || !isset($data->subtotal)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Incomplete data"]);
            return;
        }
        
        $distance_km = $this->calculateDistance($this->store_lat, $this->store_lng, $data->lat, $data->lng);
        $fee = $this->calculateFee($distance_km, $data->subtotal);
        
        echo json_encode([
            "status" => "success",
            "data" => [
                "distance_km" => round($distance_km, 2),
                "delivery_fee" => $fee
            ]
        ]);
    }
    
    private function calculateDistance($lat1, $lon1, $lat2, $lon2) {
        $url = "https://maps.googleapis.com/maps/api/directions/json?origin=$lat1,$lon1&destination=$lat2,$lon2&key=" . GOOGLE_MAPS_API_KEY;
        $response = @file_get_contents($url);
        
        if ($response) {
            $data = json_decode($response);
            if ($data && $data->status === 'OK') {
                return $data->routes[0]->legs[0]->distance->value / 1000;
            }
        }
        
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        return $dist * 60 * 1.1515 * 1.609344;
    }
    
    private function calculateFee($distance, $subtotal) {
        if ($subtotal >= 1000000 && $distance <= 7) return 0;
        if ($subtotal >= 400000 && $distance <= 4) return 0;
        if ($subtotal >= 300000 && $distance <= 2) return 0;
        if ($subtotal >= 200000 && $distance <= 1) return 0;
        
        if ($distance <= SHIPPING_BASE_KM) {
            return SHIPPING_BASE_FEE;
        }
        
        $extra_km = ceil($distance - SHIPPING_BASE_KM);
        return SHIPPING_BASE_FEE + ($extra_km * SHIPPING_PER_KM_FEE);
    }
}
