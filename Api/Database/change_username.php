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


// unset($_SESSION['last_username_changed']);

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    if ($data) {
        
        $change = change_username(['username' => $data['username'], 'new_username' => $data['new_username']]);

        if($change['is_successfull'] === 0){
            // echo json_encode(['data' => $change['data'], 'is_successfull' => $change['is_successfull'], 'reason' => $change['reason'], 'more_det' => $change['more_det']]);
            echo json_encode(['data' => $change['data'], 'is_successfull' => $change['is_successfull'], 'reason' => $change['reason']]);
        }else{
            echo json_encode(['data' => $change['data'], 'is_successfull' => $change['is_successfull'], 'reason' => $change['reason']]);
        }

    }else{
        echo json_encode(['data' => null, 'reason' => 'no data received']);
    }
}

// $data = ['username' => 'tiko._05', 'new_username' => 'tiko._04'];
// $change_username = change_username($data);
// print_r ($change_username);


function change_username($data){

    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;

    $username = $data['username'];
    $new_username = $data['new_username'];

    // Checking if username is changed in last 7 days
    if (isset($_SESSION['last_username_changed']) && $_SESSION['last_username_changed'] != '') {

        $currentDateTime = new DateTime(date("Y-m-d H:i:s"));
        $lastUsernameChanged = new DateTime($_SESSION['last_username_changed']);

        $differenceInSeconds = $currentDateTime->getTimestamp() - $lastUsernameChanged->getTimestamp();

        // 7 days
        if ($differenceInSeconds < (86400 * 7)) {
            // return ['data' => null, 'is_successfull' => 0, 'reason' => 'recently_changed', 'more_det' => [$_SESSION['last_username_changed'], $lastUsernameChanged, $currentDateTime, $differenceInSeconds]];
            return ['data' => null, 'is_successfull' => 0, 'reason' => 'recently_changed'];
        }
    }

    // Checking if username is less than 4 characters
    if(strlen($new_username) < 4){
        return ['data' => null, 'is_successfull' => 0, 'reason' => 'less_then_4_chars'];
    }

    try {

        $currentDateTime = date("Y-m-d H:i:s");
            
        $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $conn->prepare("UPDATE `users` SET `username`= :new_username, `last_username_changed`= :last_username_changed WHERE `username`= :username");
        $stmt->bindParam(':new_username', $new_username, PDO::PARAM_STR);
        $stmt->bindParam(':last_username_changed', $currentDateTime, PDO::PARAM_STR);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        $affected_rows = $stmt->rowCount();

        if ($affected_rows > 0) {
            $is_successful = 1;
            $errors = 'Successfully updated';
            $_SESSION['username'] = $new_username;
            $_SESSION['last_username_changed'] = date("Y-m-d H:i:s");
        } else {
            $is_successful = 0;
            $errors = "Update failed: " . implode(", ", $stmt->errorInfo());
        }
        
        return [
            'data' => [
                'old_username' => $username,
                'new_username' => $new_username
            ],
            'is_successfull' => $is_successful,
            // 'reason' => $is_successful ? $errors : $is_successful === false && 'Nothing was changed'
            'reason' => $affected_rows === 0 ? "No_value_was_affected" : $errors
        ];
        

        
    } catch (PDOException $e) {
        return ['data' => false, 'is_successfull' => 0, 'reason' => $e->getMessage()];
    }

}