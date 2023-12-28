<?php

$in_development = true;
$secret_key = 'your_secret_key_65843518432164215';

// Hostinger - Localhost
$in_development === false ? $db_servername = "109.106.246.101" : $db_servername = "localhost";
$in_development === false ? $db_username = "u307207127_db_username" : $db_username = "root";
$in_development === false ? $db_password = "g&7I2QR=3xT" : $db_password = "";
$in_development === false ? $db_name = "u307207127_db_name" : $db_name = "instagram";

// Local
// $db_servername = "localhost";
// $db_username = "root";
// $db_password = "";
// $db_name = "instagram";