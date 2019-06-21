<?php

include '../config.php';

?>

<!doctype html>

<html>

	<head>
		<meta charset="UTF-8">
		<title>List Projects</title>
		<link rel="stylesheet" type="text/css" href="table.css">
		<style>
			table td {
				padding: 4px;
				text-shadow: none;
				color: black;
			}
			table th {
				padding: 6px;
				border: thin solid #e0e0e0;
			}
			.stats {
				line-height: 2em;
			}
			.checked {
				font-weight: bold;
				background-color: #ddd;
			}
			.errored {
				font-weight: bold;
				color: #a00;
				background-color: #ddd;
			}
		</style>
	</head>

	<body>
		<h1>Projects</h1>
		<p>Please select a project to view:</p>
		<?php

if ($enable_viewer) {

    // Get the javascript config file
    $config = file_get_contents('../config.js');

    // Find the assignments object (and assume it's a literal assignment)
    // and remove everything but the literal object
    $startString = 'window.assignments =';
    $start = strpos($config, $startString);
    if ($start < 0) die ('No window.assignments in config file');
    $start += strlen($startString);
    $config = substr($config, $start);
    $end = strpos($config, ';');
    if ($end < 0) die ('No semicolon in config file (really?)');
    $config = substr($config, 0, $end);

    // Convert the javascript literal object into JSON:
    // Add quotes around keys
    $config = preg_replace('/^(\s*)([a-zA-Z_]+)([ ]*:)/m', "$1'$2'$3",
        $config);
    // Convert single quotes to double
    $config = preg_replace("/'([^']*)'/", '"$1"', $config);
    // Remove additional commas
    $config = preg_replace('/,([\s|\n]*})/', "$1", $config);
	// Remove comments
    $config = preg_replace('/^([^"\n]|"[^"\n]*")*\/\/.*$/m', "$1", $config);

    // Convert to a PHP associative array
    $assignments = json_decode($config, true);
    if (!$assignments) die ('Invalid assignments: ' . $config);

	$mysqli = new mysqli($host, $user, $password, $db);
	if ($mysqli->connect_errno) {
		die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
	}

	$keys = array();

	$columns = '';
    foreach (array_keys($assignments) as $key) {
        if ($key === 'none' || $key === 'view' || $key == 'test') continue;
		$key = $mysqli->escape_string($key);
		array_push($keys, $key);
		$columns .= ",\nGROUP_CONCAT((SELECT projectID FROM DUAL WHERE assignmentID = '$key') ORDER BY exported DESC, n DESC) AS $key,
			SUM(assignmentID = '$key' AND exported) > 0 AS ${key}_exported,
			SUM((SELECT hintChecks FROM DUAL WHERE assignmentID = '$key')) AS ${key}_hintChecks,
			SUM((SELECT hintDialogs FROM DUAL WHERE assignmentID = '$key')) AS ${key}_hintDialogs,
			SUM((SELECT errors FROM DUAL WHERE assignmentID = '$key')) AS ${key}_errors";
    }

	$query =
"SELECT userID $columns FROM (
  SELECT COUNT(*) AS n, SUM(message='IDE.exportProject' OR message='ProjectDialogMorph.shareThisProject') > 0 AS exported,
    SUM(message = 'HighlightDisplay.checkMyWork') AS hintChecks, SUM(message LIKE 'SnapDisplay.show%Hint') AS hintDialogs,
	SUM(message = 'Error') AS errors,
	MIN(time) AS start,
  	userID, projectID, assignmentID
  FROM trace WHERE projectID <> '' GROUP BY userID, projectID, assignmentID HAVING n > 5
) AS grouped
GROUP BY userID
ORDER BY MIN(start) ASC";

	$result = $mysqli->query($query);
	if (!$result) {
		die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
	}

	echo "<table cellspacing='0'>";
	echo "<thead><th>User Hash</th>";
	foreach ($keys as $key) {
		$name = $assignments[$key]['name'];
		$title = array_key_exists('hint', $assignments[$key]) ?
			$assignments[$key]['hint'] : '';
		echo "<th title='$title'>$key</th>";
	}
	echo "</thead>";
	$columns = array("userID");
	while($row = mysqli_fetch_array($result)) {
		echo "<tr>";
		$userID = $row['userID'];
		$shortUID = substr($userID, max(0, strlen($userID) - 10));
		echo "<td>$shortUID</td>";
		foreach ($keys as $key) {
			$projects = $row[$key];
			if ($projects == null) {
				echo "<td></td>";
				continue;
			}


			$color = "yellow";
			if ($row["${key}_exported"]) {
				$color = "green";
			}

			echo "<td style='background: $color;'>";
			$br = false;

			$class = 'stats';
			if ($row["${key}_hintChecks"] !== '0') {
				$class .= ' checked';
			}
			echo "<span class='$class'>";
			echo $row["${key}_hintChecks"];
			echo "/";
			echo $row["${key}_hintDialogs"];
			echo "</span>";
			$br = true;

			if ($row["${key}_errors"] !== '0') {
				if ($br) echo "/";
				echo "<span class='stats errored'>";
				echo $row["${key}_errors"];
				echo "</span>";
				$br = true;
			}
			if ($br) echo "<br />";

			$projects = explode(',', $projects);
			$br = false;
			foreach ($projects as $project) {
				if ($br) echo "<br/>";
				$br = true;

				$text = substr($project, 0, 4);
				$encodedUserID = urlencode($userID);
				$link = "display.php?id=$project&assignment=$key&userID=$encodedUserID";
				echo "<a href='$link' target='_blank'>$text</a>";
			}
			echo "</td>";
		}
		echo "</tr>";
	}
	echo "</table>";

} else {
	echo "You do not have permission to view this page";
}

		?>
	</body>
</html>