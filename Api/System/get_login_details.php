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

unset($_SESSION['posts']);

if(isset($_SESSION['username'])){
    $username = $_SESSION['username'];
}else{
    $username = null;
}

if(isset($_SESSION['last_username_changed'])){
    $last_username_changed = $_SESSION['last_username_changed'];
}else{
    $last_username_changed = null;
}

if(isset($_SESSION['pp'])){
    $pp = $_SESSION['pp'];
}else{
    $pp = null;
}


echo json_encode([
    'username' => $username,
    'last_username_changed' => $last_username_changed,
    'pp' => $pp
]);