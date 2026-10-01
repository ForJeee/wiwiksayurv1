<?php
// Load custom env if present
if (file_exists(__DIR__ . '/env.php')) {
    require_once __DIR__ . '/env.php';
}

if (!defined('GOOGLE_MAPS_API_KEY')) define('GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_MAPS_API_KEY');
if (!defined('MIDTRANS_SERVER_KEY')) define('MIDTRANS_SERVER_KEY', 'Mid-server-RBEml67tM4yg8hRozXMzii1e');
if (!defined('MIDTRANS_CLIENT_KEY')) define('MIDTRANS_CLIENT_KEY', 'Mid-client-viGLekjKyOUm4QLa');
if (!defined('MIDTRANS_IS_PRODUCTION')) define('MIDTRANS_IS_PRODUCTION', false);
if (!defined('APP_URL')) define('APP_URL', 'https://wiwiksayur.id');
if (!defined('JWT_SECRET')) define('JWT_SECRET', 'wiwiksayur_secret_jwt_key_2026');

// Shipping constants
if (!defined('SHIPPING_BASE_FEE')) define('SHIPPING_BASE_FEE', 8000);
if (!defined('SHIPPING_BASE_KM')) define('SHIPPING_BASE_KM', 2);
if (!defined('SHIPPING_PER_KM_FEE')) define('SHIPPING_PER_KM_FEE', 2500);
