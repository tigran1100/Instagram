<?php
if(session_status() != PHP_SESSION_ACTIVE){
    session_start();
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require  '../config.php';
require '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if($_SERVER["REQUEST_METHOD"] == "GET"){

    echo return_token();

}else if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

}










function return_token(){
    global $secret_key;

    if(isset($_COOKIE['_token'])){
        return json_encode(decode_token($_COOKIE['_token'], $secret_key));
    }else{
        return json_encode(false);
    }
}

function set_token($data){
    global $secret_key;

    try{
        setcookie('_token', generate_token($data, $secret_key), time() + (3600 * 24 * 7), '/', '', true, true); // Last two are SEQURE and HTTPONLY
        return true;
    }catch (Exception $e){
        return "Error: " . $e->getMessage();
    }
}

function generate_token($payload, $secret_key){
    $token = JWT::encode($payload, $secret_key, 'HS256');
    return $token;
}

function decode_token($encoded_token, $secret_key) {
    try {
        $decoded = JWT::decode($encoded_token, new Key($secret_key, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        return "invalid";
    }
}