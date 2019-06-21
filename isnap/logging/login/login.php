<?php

include('../config.php');

    if (!array_key_exists('id', $_POST)) {
        return;
    }

    $id = strtolower($_POST['id']);
    $hash = password_hash($id, PASSWORD_DEFAULT, array(
        // Salt comes from the config file and is static
        'salt' => $salt
    ));

    $new = array_key_exists('new', $_POST) && $_POST['new'] === 'true';

    if (!$new) {
        $mysqli = new mysqli($host, $user, $password, $db);
        if ($mysqli->connect_errno) {
            http_response_code(503);
            die ("Failed to connect to MySQL: ($mysqli->errno) $mysqli->error");
        }

        $query = "SELECT 1 FROM $table WHERE userID='$hash' LIMIT 1";
        $result = $mysqli->query($query);
        if (!$result) {
            http_response_code(500);
            die ("Failed to retrieve data: ($mysqli->errno) $mysqli->error");
        }

        if ($result->num_rows === 0) {
            echo '{"newUser": true}';
            return;
        }
    }

    echo '{"userID": "' . $hash . '"}';
?>