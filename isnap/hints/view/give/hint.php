<?php
include '../../../logging/config.php';

$mysqli = new mysqli($host, $user, $password, $db);
if ($mysqli->connect_errno) {
    die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
}

$user = $mysqli->escape_string($_GET['user']);
$rowID = $mysqli->escape_string($_GET['rowID']);

$phase = intval($_GET['phase']);
$hCode = "h${phase}Code";
$hUpdated = "h${phase}Updated";

$date = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = $mysqli->escape_string(file_get_contents('php://input'));
    $date = date('Y-m-d H:i:s');
    $query = "UPDATE hints SET $hCode='$code', $hUpdated='$date'
        WHERE rowID=$rowID AND userID='$user'";
} else {
    $query = "SELECT $hCode FROM hints
            WHERE rowID=$rowID AND userID='$user'";
}

$result = $mysqli->query($query);
if (!$result) {
    die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
}

if ($date) {
    echo $date;
    return;
}

while($row = mysqli_fetch_array($result)) {
    echo $row[$hCode];
    break;
}
?>
