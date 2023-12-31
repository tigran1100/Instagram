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
    echo json_encode(signup($data));

}

function signup($data){

    $is_data_valid = is_data_valid($data);
    if($is_data_valid['is_valid'] === 0){
        return ['data' => '0', 'reason' => $is_data_valid['reason'], 'is_successfull' => 0];
    }

    $is_password_strong = is_password_strong($data['password']);
    if($is_password_strong['is_strong'] === 0){
        return ['data' => '0', 'reason' => $is_password_strong['reason'], 'is_successfull' => 0];
    }

    $is_data_repeating = is_data_repeating($data);
    if($is_data_repeating['is_successfull'] === 0){
        return ['data' => '0', 'reason' => $is_data_repeating['reason'], 'is_successfull' => 0];
    }

    return reg_user($data);

}

function reg_user($data){

    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;

    try {
        
        $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        date_default_timezone_set('Asia/Yerevan');

        $username = trim($data['username']);
        $private_username = rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9);
        $email = trim($data['email']);
        $fullName = trim($data['full_name']);
        $password = md5(trim($data['password']));
        $created_at = time();        
        
        $sql = "INSERT INTO `users` (`username`, `private_username`, `email`, `full_name`, `password`, `created_at`) VALUES (:username, :private_username, :email, :full_name, :password, :created_at)";
        // $sql = "INSERT INTO `posts` (column1, column2) VALUES ('', '') WHERE some_column = :parameter";
    
        // Prepare the SQL statement
        $stmt = $conn->prepare($sql);
    
        // Bind the parameter to a value
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':private_username', $private_username, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':full_name', $fullName, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);       
        $stmt->bindParam(':created_at', $created_at, PDO::PARAM_STR);
    
        // Execute the prepared statement
        $stmt->execute();

        // Close the database connection
        $conn = null;

        $return_data = [
            'email' => $email,
            'followers' => '',
            'followers_count' => 0,
            'following' => '',
            'following_count' => 0,
            'full_name' => $fullName,
            'last_username_changed' => '',
            'posts' => '',
            'profile_picture' => '',
            'username' => $username,
        ];
        $return_data['_token'] = set_token($return_data)['_token'];

        return ['data' => $return_data, 'is_successfull' => 1, 'reason' => 1];
        
    } catch (PDOException $e) {
        return ['data' => 0, 'is_successfull' => 0, 'reason' => $e->getMessage()];
    }
}

function is_data_repeating($data){

    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;

    try {
        
        $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $searchUsername = trim($data['username']);
        $searchEmail = trim($data['email']);
        
        $stmtUsername = $conn->prepare("SELECT COUNT(*) FROM `users` WHERE `username` = :username");
        $stmtUsername->bindParam(':username', $searchUsername, PDO::PARAM_STR);
        $stmtUsername->execute();
        $usernameCount = $stmtUsername->fetchColumn();
        
        $stmtEmail = $conn->prepare("SELECT COUNT(*) FROM `users` WHERE `email` = :email");
        $stmtEmail->bindParam(':email', $searchEmail, PDO::PARAM_STR);
        $stmtEmail->execute();
        $emailCount = $stmtEmail->fetchColumn();
        
        if ($usernameCount > 0) {
            return ['is_successfull' => 0, 'reason' => 'This username is already in use'];
        } elseif ($emailCount > 0) {
            return ['is_successfull' => 0, 'reason' => 'This email is already in use'];
        } else {
            return ['is_successfull' => 1, 'reason' => 'passed'];
        }
    } catch (PDOException $e) {
        return ['is_successfull' => 0, 'reason' => $e->getMessage()];
    }

}

function is_data_valid($data){

    $email = trim($data['email']);
    $full_name = trim($data['full_name']);
    $username = trim($data['username']);
    $password = trim($data['password']);
    $errors = '';

    if ($email === '' || $full_name === '' || $username === '' || $password === '') {
        $errors = 'Please fill out all fields';
        return ['reason' => $errors, 'is_valid' => 0];
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors = 'Please provide a real email address';
        return ['reason' => $errors, 'is_valid' => 0];
    }

    if (strlen($username) < 4) {
        $errors = 'Username must contain at least 4 characters';
        return ['reason' => $errors, 'is_valid' => 0];
    }

    return ['reason' => 1, 'is_valid' => 1];
    
}

function is_password_strong($password) {
    // Check if the password has at least 6 characters
    if (strlen($password) < 6) {
        return ['is_strong' => 0, 'reason' => 'Password must contain at least 6 characters'];
    }

    // Check if the password contains at least one number
    if (!preg_match('/[0-9]/', $password)) {
        return ['is_strong' => 0, 'reason' => 'Password must contain at least 1 number'];
    }

    // Check if the password contains at least one special character
    if (!preg_match('/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/', $password)) {
        return ['is_strong' => 0, 'reason' => 'Password must contain at least 1 special character'];
    }

    // Return true if all criteria are met
    return ['is_strong' => 1, 'reason' => 'is_strong'];
}

function set_token($data){
    global $secret_key;

    $token = generate_token($data, $secret_key);
    setcookie('_token', $token, time() + (3600 * 24 * 7), '/', '', true, true); // Last two are SECURE and HTTPONLY
    
    $data['_token'] = $token;
    return $data;
}

function generate_token($payload, $secret_key){
    $token = JWT::encode($payload, $secret_key, 'HS256');
    return $token;
}