<?php
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require  '../config.php';

$in_development === true ? header("Access-Control-Allow-Origin: http://localhost:3000") : header("Access-Control-Allow-Origin: https://ins.tigranbalayan.me");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    if ($data) {
        
        $is_data_valid = is_data_valid($data);

        if(!$is_data_valid){
            echo json_encode(['data' => false, 'reason' => 'empty']);
            return;
        }else{
            $check_user_details = check_user_details($data);

            if($check_user_details === false){
                echo json_encode(['data' => false, 'reason' => 'Invalid username or password']);
            }else{

                log_user($check_user_details);
                echo json_encode(['data' => true, 'reason' => 'Successfully logged in', 'asd' => $check_user_details]);

            }

        }

    } else {
        echo json_encode(['data' => false, 'reason' => 'empty']);
        return;
    }
}






function is_data_valid($data){
    if($data['username'] != '' && $data['password'] != ''){
        return true;
    }else{
        return 'Invalid data';
    }
}

function check_user_details($data){

    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;
    
    try {

        $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $username = $data['username'];
        $password = md5($data['password']);
        
        $stmt = $conn->prepare("SELECT `username`, `last_username_changed` FROM `users` WHERE (`username` = :username AND `password` = :password) OR (`email` = :username AND `password` = :password)");

        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            return $result; // Username and password match
        } 
        return false; // Username and password do not match

    } catch (PDOException $e) {
        // Handle any errors here
        die("Error: " . $e->getMessage());
    }
}


function log_user($data){

    $_SESSION['username'] = $data['username'];
    $_SESSION['last_username_changed'] = $data['last_username_changed'];

}

?>