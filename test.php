<?php
session_start();
include "API/config.php";

global $secret_key;

if(isset($_COOKIE['_token'])){
    echo json_encode(decode_token($_COOKIE['_token'], $secret_key));
}else{
    echo json_encode(false);
}