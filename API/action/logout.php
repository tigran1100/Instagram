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

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    echo json_encode(do_logout());
}

function do_logout(){
    setcookie("_token", "", time() - 3600000, "/");
    return true;
}