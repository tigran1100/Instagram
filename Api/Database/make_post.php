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

    $file_upload_status = null;
    
    if ($_FILES['file']) {
        
        $uploadedFile = $_FILES['file'];
        $uploadedFile['name'] = rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . '.' . pathinfo($uploadedFile['name'], PATHINFO_EXTENSION);
        $uploadPath = $in_development === true ? "../../Files/Posts/" . basename($uploadedFile['name']) : "../../static/media/" . basename($uploadedFile['name']);

        $is_successfully_stored = false;

        if (move_uploaded_file($uploadedFile['tmp_name'], $uploadPath)) {
            $is_successfully_stored = true;
        } else {
            $is_successfully_stored = false;
        }

        $file_upload_status = ['data' => $is_successfully_stored ? "File uploaded successfully" : "Failed to upload file", "is_successfull" => $is_successfully_stored ? 1 : 0, "file" => $uploadedFile];
    }

    
    $database_integration_status = null;
    
    if($_POST['textData']){
        
        $text_data = json_decode($_POST['textData'], TRUE);
        // echo json_encode($file_upload_status);
        if($file_upload_status['is_successfull'] === 1){

            global $db_servername;
            global $db_username;
            global $db_password;
            global $db_name;

            $username = $text_data['username'];

            try{

                $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                $stmt = $conn->prepare("SELECT `private_username`, `posts_numbers`, `posts` FROM `users` WHERE `username` = :username");
                $stmt->bindParam(':username', $username, PDO::PARAM_STR);
                $stmt->execute();
                $stmt_result = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Fetch the result
                $private_username = $stmt_result['private_username'];
                $posts_numbers = json_decode($stmt_result['posts_numbers'], TRUE);
                $posts = json_decode($stmt_result['posts'], TRUE);

                $new_posts = $posts;

                date_default_timezone_set('Asia/Yerevan');

                $new_posts[] = [
                    "username" => $private_username,
                    "post_id" => rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9),
                    "post_file_name" => $file_upload_status['file']['name'],
                    "time" => strval(time()),
                    "likes" => 0,
                    "who_liked" => "",
                    "saves" => 0,
                    "who_saved" => "",
                ];
                
                $posts_numbers[] = $new_posts[count($new_posts) - 1]['post_id'];

                $json_encoded_new_posts = json_encode($new_posts);
                $json_encoded_posts_numbers = json_encode($posts_numbers);

                $stmt = $conn->prepare("UPDATE `users` SET `posts_numbers`='$json_encoded_posts_numbers', `posts` = '$json_encoded_new_posts' WHERE `username` = :username");
                $stmt->bindParam(':username', $username, PDO::PARAM_STR);
                $stmt->execute();
                $affected_rows_0 = $stmt->rowCount();


                if($affected_rows_0 > 0){
                    $database_integration_status = ['data' => 1, 'is_successfull' => 1];
                }


            }catch (PDOException $e){
                $database_integration_status = ['data' => 0, 'is_successfull' => 0];
            }

        }else{
            $database_integration_status = ['data' => 0, 'is_successfull' => 0];
        }
    }

    if($file_upload_status['is_successfull'] === 1 && $database_integration_status['is_successfull'] === 1){
        echo json_encode(['data' => $new_posts, 'is_successfull' => 1]);
    }else{
        echo json_encode(['data' => 0, 'is_successfull' => 0]);
    }
}