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

        $get_all_post_numbers = get_all_post_numbers(['username' => $data['username'], 'limit' => $data['limit']]);
        echo json_encode(['data' => $get_all_post_numbers['data'], 'reason' => $get_all_post_numbers['reason'], 'more' => $get_all_post_numbers['left_more']]);

    } else {

        echo json_encode(['data' => null, 'reason' => 'No data received']);

    }
}


function get_all_post_numbers($data){
    
    $is_limit_satisfied = false;
    $no_posts_left = ['checked' => 0, 'status' => false];
    $record_limit = 100; // If basicly says how many users will be checked before checking more if necessary
    $offset = 0; // Keep 0

    $posts_arr_0 = [];
    $associated_users = null;

    global $db_servername;
    global $db_username;
    global $db_password;
    global $db_name;

    $whiles = 0;

    while($no_posts_left['status'] === false && $is_limit_satisfied === false && $no_posts_left['status'] === false){

        $whiles++;
        if($whiles > 100){
            return ['data' => ['whiles' => $whiles], 'reason' => 'too many tries', 'left_more' => 0];
        }

        try {
            
            $conn = new PDO("mysql:host=$db_servername;dbname=$db_name", $db_username, $db_password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    
            $stmt = $conn->prepare("SELECT `username`, `private_username`, `associated_users`, `posts_numbers`, `posts`, `profile_picture` FROM `users` LIMIT $record_limit OFFSET $offset");
            $stmt->execute();
            
            $db_datas_all = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach($db_datas_all as $db_data){

                if($db_data['posts'] != ''){
                    $db_data_posts = json_decode($db_data['posts'], TRUE);

                    foreach($db_data_posts as $db_data_post){
                        
                        if($db_data_post['who_liked']){
                            foreach ($db_data_post['who_liked'] as $index => $who_liked) {
                                $db_data_post['who_liked'][$index] = json_decode($db_data['associated_users'], TRUE)[$db_data_post['who_liked'][$index]];
                            }                            
                        }

                        if($db_data_post['who_saved']){
                            foreach ($db_data_post['who_saved'] as $index => $who_liked) {
                                $db_data_post['who_saved'][$index] = json_decode($db_data['associated_users'], TRUE)[$db_data_post['who_saved'][$index]];
                            }                            
                        }

                        $db_data_post['profile_picture'] = $db_data['profile_picture'];
                        $db_data_post['username'] = $db_data['username'];
                        $db_data_post['is_liked'] = $db_data_post['who_liked'] === '' ? false : in_array($data['username'], $db_data_post['who_liked']);

                        $posts_arr_0[] = $db_data_post;

                        if(count($posts_arr_0) >= $data['limit']){
                            break;
                        }
                    }
    
                }
            }


            // Checking if foreach loop has finished it's goal
            if(count($posts_arr_0) >= $data['limit']){
                
                $is_limit_satisfied = true;

            }else{

                if(count($posts_arr_0) > 0){

                    $no_posts_left['checked'] = $no_posts_left['checked'] + 1;

                    if($no_posts_left['checked'] === 2){
                        $no_posts_left['status'] = true;
                    }

                }else{
                    $no_posts_left['status'] = true;
                }

            }


            if($is_limit_satisfied === true){

                return ['data' => (return_final_sorted($posts_arr_0)), 'reason' => true, 'left_more' => 1];
                break;

            }else if($no_posts_left['status'] === true){

                return ['data' => (return_final_sorted($posts_arr_0)), 'reason' => true, 'left_more' => 0];
                break;

            }

            $limit_diff = $record_limit - $offset;
            $record_limit += $limit_diff;
            $offset += $limit_diff;
            
        } catch (PDOException $e) {
            return ['data' => false, 'reason' => $e->getMessage(), 'left_more' => 0];
        }

    }


}



// Filtering posts by time
function sortByTime($array) {
    usort($array, function ($a, $b) {
        return $b['time'] - $a['time'];
    });

    return $array;
}




function return_final_sorted($posts){

    if(isset($_SESSION['posts'])){

        $session_posts = $_SESSION['posts'];
        $new_posts = array_slice($posts, count($session_posts) - 1);

        $posts_to_show = array_merge(sortByTime($session_posts), sortByTime($new_posts));
        $_SESSION['posts'] = $posts_to_show;
        return $posts_to_show;


    }else{

        $_SESSION['posts'] = $posts;
        $posts = sortByTime($posts);
        return $posts;

    }
    
}