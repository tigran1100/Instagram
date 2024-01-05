<?php
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require  '../config.php';
require '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $data = json_decode(file_get_contents("php://input"), true);
    echo json_encode(get_posts($data));

}

function get_posts($data){
    
    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;
    
    $decoded_token = decode_token();
    $post_creator_private_username = $decoded_token->private_username;

    try {
    
        $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
        $stmt = $conn->prepare("SELECT `post_comments_count`, `post_created_at`, `post_like_count`, `post_picture`, `post_who_commented`, `post_who_liked`, `post_id`, `profile_picture`, `username` FROM `posts` ORDER BY `post_created_at` DESC LIMIT 100 OFFSET 0");
        // $stmt->bindParam(':post_creator_private_username', $post_creator_private_username, PDO::PARAM_STR);
        $stmt->execute();
        $db_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return ['data' => $db_data, 'reason' => 1];

    } catch (PDOException $e) {
        return ['data' => 0, 'reason' => $e->getMessage()];
    }

}


function decode_token() {

    global $secret_key;
    $encoded_token = $_COOKIE['_token'];

    try {
        $decoded = JWT::decode($encoded_token, new Key($secret_key, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        return "invalid";
    }

}