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
    if(isset($data['action'])){
        if($data['action'] === 'like'){
            echo json_encode(do_post_like($data));
        }else if($data['action'] === 'dislike'){
            echo json_encode(do_post_dislike($data));
        }
    }

}

function do_post_like($data){

    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;

    $decoded_token = decode_token();
    $username = $decoded_token->username;
    $private_username = $decoded_token->private_username;
    $post_id = $data['post_id'];

    try{

        $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $conn->prepare("SELECT `post_like_count`, `post_who_liked`, `post_id` FROM `posts` WHERE `post_id`=:post_id");
        $stmt->bindParam(':post_id', $post_id, PDO::PARAM_STR);
        $stmt->execute();
        $db_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $post = $db_data[0];

        if($post['post_who_liked'] === null || $post['post_who_liked'] === ''){
            $post['post_like_count'] = 1;
            $post['post_who_liked'] = json_encode([$private_username]);
        }else{
            $decoded_array = json_decode($post['post_who_liked'], true);
            if(in_array($private_username, $decoded_array)){
                return (['data' => '', 'is_successfull' => 1]);
                $conn = null;
                exit;
            }else{
                array_push($decoded_array, $private_username);
                $post['post_like_count']++;
                $post['post_who_liked'] = json_encode($decoded_array);
            }
        }
        
        $stmt = $conn->prepare("UPDATE `posts` SET `post_like_count`=:post_like_count, `post_who_liked`=:post_who_liked WHERE `post_id`=:post_id");
        $stmt->bindParam(':post_like_count', $post['post_like_count'], PDO::PARAM_STR);
        $stmt->bindParam(':post_who_liked', $post['post_who_liked'], PDO::PARAM_STR);
        $stmt->bindParam(':post_id', $post['post_id'], PDO::PARAM_STR);
        
        if($stmt->execute()){
            return (['data' => '', 'is_successfull' => 1]);
        }else{
            return (['data' => $stmt->errorInfo(), 'is_successfull' => 0]);
        }
        $conn = null;

    }catch(PDOException $e){
        return (['data' => $e->getMessage(), 'is_successfull' => 0]);
        $conn = null;
    }

}

function do_post_dislike($data){

    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;

    $decoded_token = decode_token();
    $username = $decoded_token->username;
    $private_username = $decoded_token->private_username;
    $post_id = $data['post_id'];

    try{

        $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $conn->prepare("SELECT `post_like_count`, `post_who_liked`, `post_id` FROM `posts` WHERE `post_id`=:post_id");
        $stmt->bindParam(':post_id', $post_id, PDO::PARAM_STR);
        $stmt->execute();
        $db_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $post = $db_data[0];

        if($post['post_who_liked'] === null || $post['post_who_liked'] === ''){
            $post['post_like_count'] = 0;
            $post['post_who_liked'] = null;
        }else{
            $decoded_array = json_decode($post['post_who_liked'], true);
            // return(in_array($private_username, $decoded_array));
            // return($decoded_array);
            // return($private_username);
            if(in_array($private_username, $decoded_array)){
                $index = array_search($private_username, $decoded_array);
                if($index !== false){
                    unset($decoded_array[$index]);
                }
                $post['post_like_count']--;
                $post['post_who_liked'] = json_encode($decoded_array);
            }else{
                return (['data' => '', 'is_successfull' => 1]);
                $conn = null;
                exit;
            }
        }
        
        $stmt = $conn->prepare("UPDATE `posts` SET `post_like_count`=:post_like_count, `post_who_liked`=:post_who_liked WHERE `post_id`=:post_id");
        $stmt->bindParam(':post_like_count', $post['post_like_count'], PDO::PARAM_STR);
        $stmt->bindParam(':post_who_liked', $post['post_who_liked'], PDO::PARAM_STR);
        $stmt->bindParam(':post_id', $post['post_id'], PDO::PARAM_STR);
        
        if($stmt->execute()){
            return (['data' => '', 'is_successfull' => 1]);
        }else{
            return (['data' => $stmt->errorInfo(), 'is_successfull' => 0]);
        }
        $conn = null;

    }catch(PDOException $e){
        return (['data' => $e->getMessage(), 'is_successfull' => 0]);
        $conn = null;
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