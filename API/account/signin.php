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

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $data = json_decode(file_get_contents("php://input"), true);
    echo json_encode(signin($data));

}

function signin($data){

    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;

    if($data['username'] == '' || $data['password'] == ''){
        return 'Invalid data';
    }else{
        
        try {
            $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
            $username = $data['username'];
            $password = md5($data['password']);
            
            $stmt = $conn->prepare("SELECT `username`, `private_username`, `last_username_changed`, `email`, `full_name`, `profile_picture`, `followers`, `followers_count`, `following`, `following_count`, `posts` FROM `users` WHERE (`username` = :username AND `password` = :password) OR (`email` = :username AND `password` = :password)");
    
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($result) {
                return ['data' => set_token($result), 'reason' => 'Successfully signed in', 'is_successfull' => 1];
            }else{
                return ['data' => 0, 'reason' => "Invalid username or password", 'is_successfull' => 0];
            }
    
        } catch (PDOException $e) {
            // Handle any errors here
            die("Error: " . $e->getMessage());
        }

    }

}


function set_token($data){
    global $secret_key;

    $token = generate_token($data, $secret_key);
    setcookie('_token', $token, time() + (3600 * 24 * 7), '', '', true, true); // Last two are SECURE and HTTPONLY
    
    $data['_token'] = $token;
    return $data;

}

function generate_token($payload, $secret_key){
    $token = JWT::encode($payload, $secret_key, 'HS256');
    return $token;
}