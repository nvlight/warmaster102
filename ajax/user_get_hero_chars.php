<?php

session_start();

require '../db/mysql.config.php';
require '../db/mysql.connect.php';
require '../vendor/autoload.php';
require '../lib/functions.php';
require '../ajax/user_db_functions.php';

$user_id = $_SESSION['user']['id'];
$dbh = $mysql['connect'];

$rs = get_hero_chars($dbh, $user_id);
//echo Debug::d($rs, 'get hero chars');
die(json_encode($rs));

?>