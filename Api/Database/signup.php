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
        if(isDataValid($data)['passed']){

            $isDataRepeating = isDataRepeating($data);
            
            if($isDataRepeating['passed'] === true){
                echo json_encode(['data' => regUser($data), 'reason' => true]);
            }else{
                if($isDataRepeating['reason'] === 'repeating_username'){
                    echo json_encode(['data' => false, 'reason' => 'User already exists']);
                    
                }else if($isDataRepeating['reason'] === 'repeating_email'){
                    
                    echo json_encode(['data' => false, 'reason' => 'This email is already in use']);
                }else{
                    
                    echo json_encode(['data' => false, 'reason' => $isDataRepeating['reason']]);
                }
            }
        }else{
            echo json_encode(['data' => isDataValid($data)['reason'], 'reason' => 'Invalid data']);
        }
    } else {
        echo json_encode(['data' => null, 'reason' => 'No data received']);
    }
} else {
    echo json_encode(['data' => null, 'reason' => 'Invalid request method']);
}






function isDataRepeating($data){

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
            return ['passed' => false, 'reason' => 'repeating_username'];
        } elseif ($emailCount > 0) {
            return ['passed' => false, 'reason' => 'repeating_email'];
        } else {
            return ['passed' => true, 'reason' => 'passed'];
        }
    } catch (PDOException $e) {
        return ['passed' => false, 'reason' => $e->getMessage()];
    }

}


function isDataValid($data){

    $email = trim($data['email']);
    $fullName = trim($data['fullName']);
    $username = trim($data['username']);
    $password = trim($data['password']);
    $errors = '';

    if ($email === '' || $fullName === '' || $username === '' || $password === '') {
        $errors = 'Please fill out all fields';
        return ['passed'=>false,'reason'=>$errors];
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors = 'Please provide a real email address';
        return ['passed'=>false,'reason'=>$errors];
    }

    if (strlen($username) < 4) {
        $errors = 'Username must contain at least 4 characters';
        return ['passed'=>false,'reason'=>$errors];
    }

    $isStrongPassword = isStrongPassword($password);
    if ($isStrongPassword['passed'] !== true) {
        if ($isStrongPassword['reason'] === 'short') {
            $errors = 'Password must contain at least 6 characters';

        } else if ($isStrongPassword['reason'] === 'no_numbers') {
            $errors = 'Password must contain at least 1 number';

        } else if ($isStrongPassword['reason'] === 'no_special_chars') {
            $errors = 'Password must contain at least 1 special character';
        }

        return ['passed'=>false,'reason'=>$errors];
    }

    return ['passed'=>true,'reason'=>'passed'];
    
}



function isStrongPassword($password) {
    // Check if the password has at least 6 characters
    if (strlen($password) < 6) {
        return ['passed' => false, 'reason' => 'short'];
    }

    // Check if the password contains at least one number
    if (!preg_match('/[0-9]/', $password)) {
        return ['passed' => false, 'reason' => 'no_numbers'];
    }

    // Check if the password contains at least one special character
    if (!preg_match('/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/', $password)) {
        return ['passed' => false, 'reason' => 'no_special_chars'];
    }

    // Return true if all criteria are met
    return ['passed' => true, 'reason' => 'passed'];
}



function regUser($data){

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
        $fullName = trim($data['fullName']);
        $password = md5(trim($data['password']));
        $created_at = time();
        $associated_users = json_encode([$private_username => $username]);
        
        
        $sql = "INSERT INTO `users` (`username`, `private_username`, `email`, `full_name`, `password`, `created_at`, `associated_users`) VALUES (:username, :private_username, :email, :full_name, :password, :created_at, :associated_users)";
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
        $stmt->bindParam(':associated_users', $associated_users, PDO::PARAM_STR);
    
        // Execute the prepared statement
        $stmt->execute();

        $_SESSION['username'] = $username;

        // Close the database connection
        $conn = null;

        return true;
        
    } catch (PDOException $e) {
        return "Error: " . $e->getMessage();
    }
}
?>
