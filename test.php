<?php
session_start();

include "API/config.php";
require 'API/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

global $secret_key;

if(isset($_COOKIE['_token'])){
    echo json_encode(decode_token($_COOKIE['_token'], $secret_key));
}else{
    echo json_encode(false);
}

function decode_token($encoded_token, $secret_key) {
    try {
        $decoded = JWT::decode($encoded_token, new Key($secret_key, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        return "invalid";
    }
}