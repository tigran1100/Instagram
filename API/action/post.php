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
    echo json_encode(do_post($data));

}

function do_post($data){
    
    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;
    
    // Saving file
    $file_upload_status = false;
    $base64Image = preg_replace('/^data:image\/(png|jpg|jpeg);base64,/', '', $data['base64']);
    $imageData = base64_decode($base64Image);
    $imageInfo = getimagesizefromstring($imageData);
    $fileExtension = image_type_to_extension($imageInfo[2]);

    $file_name = rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . $fileExtension;
    $uploadPath = "../../Files/posts/" . basename($file_name);

    file_put_contents($uploadPath, $imageData);

    if (file_exists($uploadPath)) {
        $is_successfully_stored = true;
    } else {
        $is_successfully_stored = false;
    }



    // Adding record to database
    $database_integration_status = false;
    if($is_successfully_stored === true){
    
        $decoded_token = decode_token();
        $username = $decoded_token->username;
        $private_username = $decoded_token->private_username;

        try{

            $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $stmt = $conn->prepare("INSERT INTO `posts` (`username`, `private_username`, `post_picture`, `post_like_count`, `post_who_liked`, `post_comments_count`, `post_who_commented`) VALUES (:username, :private_username, '$file_name',  0, '', 0, '')");
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->bindParam(':private_username', $private_username, PDO::PARAM_STR);
            
            if($stmt->execute()){
                $database_integration_status = true;
            }else{
                $database_integration_status = false;
            }

        }catch(PDOException $e){
            return "Error: " . $e->getMessage();
        }

    }


    if($is_successfully_stored === true && $database_integration_status === true){
        return true;
    }else{
        return false;
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