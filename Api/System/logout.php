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

$_SESSION = [];


if($_SESSION === []){
    echo json_encode(['is_successfull' => 1]);
}else{
    echo json_encode(['is_successfull' => 0]);
}