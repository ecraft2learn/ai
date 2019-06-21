<?php
include "../config.php";
if (array_key_exists('ids', $_POST)) {
    if (!$enable_viewer) return;

    $mysqli = new mysqli($host, $user, $password, $db);
	if ($mysqli->connect_errno) {
		die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
	}

    header("Content-Type: text/CSV");
    header('Content-Disposition: attachment; filename="ids.csv"');
    $out = fopen('php://output', 'w');
    fputcsv($out, array('UnityID', 'AnonID', 'Status'));

    $ids = $_POST['ids'];
    $ids = preg_split('/[\s,]+/', $ids);
    asort($ids);
    foreach ($ids as $id) {
        $id = strtolower(trim($id));
        if (strlen($id) == 0) continue;
        $id = str_replace("@ncsu.edu", "", $id);
        if (!preg_match("/^[a-z]+[0-9]{0,3}$/", $id)) {
            echo ("Invalid UnityID: $id");
            return;
        }
        $hash = password_hash($id, PASSWORD_DEFAULT, array('salt' => $salt));
        $query = "SELECT 1 FROM $table WHERE userID='$hash' LIMIT 1";
        $result = $mysqli->query($query);
        $present = ($result && $result->num_rows === 1) ? "Present" : "Missing";
        fputcsv($out, array($id, $hash, $present));
    }

    fclose($out);
    return;
}
?>
</<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Convert IDs</title>
</head>
<body>
    <form action="ids.php" method="post">
        Input UnityIDs or NCSU email addresses:
        <br />
        <textarea name="ids" rows="30", cols="25"></textarea>
        <br />
        <input type="submit"/>
    </form>
</body>
</html>