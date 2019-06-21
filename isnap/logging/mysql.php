<?php

include "config.php";

try {
    date_default_timezone_set('America/New_York');

    $mysqli = new mysqli($host, $user, $password, $db);
    if ($mysqli->connect_errno) {
        http_response_code(503);
        die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
    }

    $post =  file_get_contents("php://input");
    $json = json_decode($post, true);

    if (!$json) {
        http_response_code(400);
        die("No log data provided.");
    }

    $userInfo = $json['userInfo'];
    $userID = $mysqli->escape_string($userInfo['userID']);
    $browserID = $mysqli->escape_string($userInfo['browserID']);
    $sessionID = $mysqli->escape_string($userInfo['sessionID']);

    $logs = $json['logs'];

    foreach ($logs as $log) {

        $keys = array('message', 'time', 'projectID', 'data', 'code');

        foreach ($keys as $key) {
            if (!array_key_exists($key, $log)) {
                $log[$key] = '';
            }
        }

        $message = $mysqli->escape_string($log['message']);
        $timestamp = date("Y-m-d H:i:s", $log['time'] / 1000);
        $projectID = $mysqli->escape_string($log['projectID']);
        $data = $mysqli->escape_string(json_encode($log['data']));
        $code = $mysqli->escape_string($log['code']);
        $assignmentID = $mysqli->escape_string($log['assignmentID']);


        $query = "INSERT INTO $table (message, time, assignmentID, userID, projectID, browserID, sessionID, data, code)
            VALUES('$message', '$timestamp', '$assignmentID', '$userID', '$projectID', '$browserID', '$sessionID', '$data', '$code');";


        if (!$mysqli->query($query)) {
            // No need to retry, so don't return an error, but display the
            // message to indicate something went wrong
            die ("Logging failed: (" . $mysqli->errno . ") " . $mysqli->error);
        }

    }

} catch (Exception $e) {
    http_response_code(500);
    die ("Error: " . $e);
}

?>
