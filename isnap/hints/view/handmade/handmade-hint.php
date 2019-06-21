<?php
include '../../../logging/config.php';

$mysqli = new mysqli($host, $user, $password, $db);
if ($mysqli->connect_errno) {
    die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
}

$hintID = -1;
if (!empty($_GET['hintID'])) {
    $hintID = $mysqli->escape_string($_GET['hintID']);
}


$hintCode = "hintCode";
$updatedTime = "updatedTime";

$date = null;

//Follow RESTful API design, PUT for mutation, POST for creation, GET for search,
//and DELETE for deletion.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = $mysqli->escape_string($_GET['user']);
    $rowID = $mysqli->escape_string($_GET['rowID']);
    $trueAssignmentID = $mysqli->escape_string($_GET['assignment']);
    $query = "INSERT INTO handmade_hints (userID, rowID, trueAssignmentID)
        VALUES ('$user', $rowID, '$trueAssignmentID')";
    $result = $mysqli->query($query);
    if (!$result) {
        die ("Failed to insert data: (" . $mysqli->errno . ") " . $mysqli->error);
    }

    $query = "SELECT LAST_INSERT_ID();";
    $result = $mysqli->query($query);
    while($row = mysqli_fetch_array($result)) {
        echo $row[0];
        return;
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $priority = $mysqli->escape_string($_GET['priority']);

    $code = $mysqli->escape_string(file_get_contents('php://input'));
    $date = date('Y-m-d H:i:s');
    $query = "UPDATE handmade_hints SET $hintCode='$code', $updatedTime='$date'";
    if ($priority !== '') {
        $query .= ", priority='$priority'";
    }
    $query .= " WHERE hid=$hintID";

    $result = $mysqli->query($query);
    if (!$result) {
        die ("Failed to update data: (" . $mysqli->errno . ") " . $mysqli->error);
    }
    echo $date;
    return;
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT $hintCode FROM handmade_hints
            WHERE hid=$hintID";

    $result = $mysqli->query($query);
    if (!$result) {
        die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
    }
    while($row = mysqli_fetch_array($result)) {
        echo $row[$hintCode];
        return;
    }

} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $query = "DELETE FROM handmade_hints
            WHERE hid=$hintID";
    $result = $mysqli->query($query);
    if (!$result) {
        die ("Failed to delete data: (" . $mysqli->errno . ") " . $mysqli->error);
    }
    return;
}



?>
