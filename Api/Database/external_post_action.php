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

        // echo json_encode(['data' => $data, 'reason' => true]);exit;
        
        $action = do_action(['action' => $data['action'], 'post_owner' => $data['post_owner'], 'post_interactor' => $data['post_interactor'], 'post_id' => $data['post_id']]);
        if($action['is_successfull'] === true){
            echo json_encode(['is_successfull' => $action['is_successfull'], 'reason' => $action['reason']]);
        }else{
            echo json_encode(['is_successfull' => $action['is_successfull'], 'reason' => $action['reason']]);
        }

    }else{
        echo json_encode(['is_successfull' => 0, 'reason' => 'No data received']);
    }
}

// $data = ['action' => "dislike", 'post_owner' => "tiko._04", 'post_interactor' => "tiko._04", 'post_id' => "347144"];
// $do_action = do_action(['action' => $data['action'], 'post_owner' => $data['post_owner'], 'post_interactor' => $data['post_interactor'], 'post_id' => $data['post_id']]);
// print_r ();


function do_action($data){

    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;

    $action = $data['action'];
    $post_owner = $data['post_owner'];
    $post_interactor = $data['post_interactor'];
    $post_id = $data['post_id'];

    try {
            
        $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $conn->prepare("SELECT `private_username`, `associated_users`, `posts` FROM `users` WHERE `username` = :username");
        $stmt->bindParam(':username', $post_owner, PDO::PARAM_STR);
        $stmt->execute();
        $stmt_result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Fetch the result
        $private_username = $stmt_result['private_username'];
        $associated_users = json_decode($stmt_result['associated_users'], TRUE);
        $json_encoded_associated_users = json_encode($associated_users);
        $flipped_associated_users = array_flip($associated_users);
        $posts = json_decode($stmt_result['posts'], TRUE);


        // Checking if interactor is in associated_users
        if(!in_array($post_interactor, $flipped_associated_users)){

            $new_flipped_associated_users = $flipped_associated_users;

            try{

                $stmt = $conn->prepare("SELECT `private_username` FROM `users` WHERE `username` = :username");
                $stmt->bindParam(':username', $post_interactor, PDO::PARAM_STR);
                $stmt->execute();
                $stmt_result = $stmt->fetch(PDO::FETCH_ASSOC);

                $interacter_private_username = $stmt_result['private_username'];
                $associated_users[$interacter_private_username] = $post_interactor;
                $json_encoded_associated_users = json_encode($associated_users);
                $flipped_associated_users = array_flip($associated_users);

            }catch(PDOException $e){

                return ['data' => 0, 'reason' => $e->getMessage()];

            }

        }

        $new_posts = [];
        $need_to_update = false;

        if($data['action'] === 'dislike'){
            foreach($posts as $post){
                if($post['post_id'] === $post_id){
                    if(in_array($flipped_associated_users[$post_interactor], $post['who_liked'])){
                        $post['likes'] = intval($post['likes']) - 1;
                        $post['who_liked'] = array_merge(array_diff($post['who_liked'], [$flipped_associated_users[$post_interactor]]));
                        $need_to_update = true;
                    }
                }    
                $new_posts[] = $post;
            }
        }else if($data['action'] === 'like'){
            foreach($posts as $post){
                if($post['post_id'] === $post_id){
                    if($post['who_liked'] != ''){
                        if(!in_array($flipped_associated_users[$post_interactor], $post['who_liked'])){
                            $post['likes'] = intval($post['likes']) + 1;
                            $post['who_liked'][] = strval($flipped_associated_users[$post_interactor]);
                            $need_to_update = true;
                        }
                    }else{
                        $post['likes'] = intval(1);
                        $post['who_liked'] = [strval($flipped_associated_users[$post_interactor])];
                        $need_to_update = true;
                    }
                }    
                $new_posts[] = $post;
            }
        }


        $is_successfull = 0;
        $errors = '';

        if($need_to_update === true){
            $new_posts = json_encode($new_posts);
            $stmt = $conn->prepare("UPDATE `users` SET `associated_users` = '$json_encoded_associated_users', `posts`='$new_posts' WHERE `username` = :username");
            $stmt->bindParam(':username', $post_owner, PDO::PARAM_STR);
            
            if ($stmt->execute()) {
                $is_successfull = 1;
                $errors = 'Successfully updated';
            } else {
                $is_successfull = 0;
                $errors = "Update failed: " . implode(", ", $stmt->errorInfo());
            }
        }else{
            $is_successfull = 0;
            $errors = "Nothing has been updated: " . "Something went wrong";
        }

        return ['data' => null, 'is_successfull' => $is_successfull, 'reason' => $errors];
        
    } catch (PDOException $e) {
        return ['data' => null, 'is_successfull' => 0, 'reason' => $e->getMessage()];
    }
}