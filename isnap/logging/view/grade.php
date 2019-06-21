<?php

include '../config.php';

?>

<!doctype html>

<html>

	<head>
		<meta charset="UTF-8">
		<title>View Project</title>
		<link rel="stylesheet" type="text/css" href="table.css">
		<style>
			html {
				height: 100%;
			}
			body {
				height: calc(100% - 20px);
			}
			/* Credit: http://stackoverflow.com/questions/5645986/two-column-div-layout-with-fluid-left-and-fixed-right-column */
			#wrapper {
				height: 100%;
			}
			#content {
				float: right;
				width: 600px;
				display: block;
				height: 100%;
			}
			#sidebar {
				width: calc(100% - 610px);
				height: 100%;
				float: left;
			}
			#cleared {
				clear: both;
			}
			tr.bold td {
				background: #aaa;
				color: black;
			}
			tr.bold:hover td {
				background: #999;
				color: black;
			}
		</style>
		<script type="text/javascript" src="../config.js"></script>
		<script type="text/javascript">
			function loadSnap(id, project) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						document.getElementById('snap').contentWindow.ide.droppedText(xhr.responseText);
					}
				};
				xhr.open("GET", "code.php?id=" + id + "&project=" + project, true);
				xhr.send();
			}
		</script>
	</head>
	<body>

	<?php


		if ($enable_viewer) {
			if (!array_key_exists('assignment', $_GET)) {
	?>
			<form method="GET" action="grade.php">
				Assignment:
				<select name="assignment" id="assignments">
				</select>
				<script>
					var select = document.getElementById("assignments");
					for (var key in assignments) {
					if (assignments.hasOwnProperty(key)) {
						if (key == "test" || key == "view") continue;
						var option = document.createElement("option");
						option.text = assignments[key].name || assignments[key];
						option.value = key;
						select.add(option);
					}
				}
				</script>
				<br />
				Assignment End Cutoff: <input type="date" name="time" />
				<br />
				<input type="submit" value="View Grading" />
			</form></body></html>
	<?php

			return;
		}
	?>

		<div id="wrapper">
			<div id="sidebar">
				 <iframe id="snap" width="100%" height="100%" src="../../snap.html?assignment=view"></iframe>
			</div>
			<div id="content">
				<div style="overflow: scroll; height: 100%;">
				<?php
						$mysqli = new mysqli($host, $user, $password, $db);
						if ($mysqli->connect_errno) {
							die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
						}

						$assignment = $mysqli->real_escape_string($_GET['assignment']);
						$time = $mysqli->real_escape_string($_GET['time']);

						echo "<h3>Projects: $assignment</h3>";

						$query = "SELECT id, time, projectID FROM $table WHERE assignmentID='$assignment' AND message='IDE.exportProject' AND time < '$time' ORDER BY projectID, time ASC;";
						$result = $mysqli->query($query);
						if (!$result) {
							die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
						}

						echo "<table cellspacing='0'>";
						echo "<thead><th>Time</th><th>ID</th><th>Project</th></thead>";
						while($row = mysqli_fetch_array($result)) {

							$id = $row['id'];
							$time = $row['time'];
							$projectID = $row['projectID'];

							$first = $time;
							$first = "<a href='#$id' onclick='loadSnap(\"$id\", \"$projectID\")'>$first</a>";

							echo "<tr><td>$first</td><td>$id</td><td>$projectID</td></tr>";
						}
						echo "</table>";
					} else {
						echo "You do not have permission to view this page";
					}
				?>
				</div>
			</div>
			<div id="cleared"></div>
			<script type="text/javascript">
				var snap = document.getElementById("snap");
				snap.onload = function() {
					snap.contentWindow.ide.toggleStageSize();
				}
			</script>
		</div>
	</body>
</html>