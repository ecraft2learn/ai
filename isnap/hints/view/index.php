<?php

include '../../logging/config.php';

?>

<!doctype html>

<html>

	<head>
		<meta charset="UTF-8">
		<title>View Project</title>
		<link rel="stylesheet" type="text/css" href="../../logging/view/table.css">
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
				width: 550px;
				display: block;
				height: 100%;
			}
			#sidebar {
				width: calc(100% - 560px);
				height: 100%;
				float: left;
			}
			#cleared {
				clear: both;
			}
		</style>
		<script type="text/javascript">
			function loadSnap(id, project, assignment, data, type) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var contentWindow = document.getElementById('snap').contentWindow;
						contentWindow.Assignment.setID(assignment);
						contentWindow.ide.droppedText(xhr.responseText);
						data = JSON.parse(data);
						if (data) {
							data.type = type;
						}
						window.setTimeout(function() {
							contentWindow.HintDisplay.showLoggedHint(data);
							if (contentWindow.hintProvider) {
								contentWindow.hintProvider.getHintsFromServer();
							}
						}, 100);
					}
				};
				xhr.open("GET", "../../logging/view/code.php?id=" + id + "&project=" + project, true);
				xhr.send();
				window.location.hash = id;
				window.index = rows.findIndex(function(a) {
					return a.dataset.rid == id;
				});
			}

			function resetFilter() {
				document.location = './';
			}
		</script>
	</head>

	<body>
		<div id="wrapper">
			<div id="sidebar">
				 <iframe id="snap" width="100%" height="100%" src="../../snap.html?assignment=view&hints=true"></iframe>
			</div>
			<div id="content">
				<div style="overflow: scroll; height: 100%;">
				<form action="" method="GET">
					Filter IDs:
					<input id="filter" type="text" name="ids" pattern="([0-9]+ ?)*"
						placeholder="e.g. 123 888 12345"
						value="<?php if (array_key_exists('ids', $_GET)) echo $_GET['ids']; ?>">
					<input type="button" value="Reset" onclick="resetFilter()" >
				</form>
				<?php
if ($enable_viewer) {

	$mysqli = new mysqli($host, $user, $password, $db);
	if ($mysqli->connect_errno) {
		die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
	}

	// Allow for filtering by a set of space-separated ids
	$where = "WHERE (message='HighlightDisplay.checkMyWork' OR
		message='HighlightDialogBoxMorph.toggleInsert' AND data='true' OR
		message LIKE 'SnapDisplay.show%Hint')";
	if (array_key_exists('ids', $_GET)) {
		$ids = $_GET['ids'];
		$ids = explode(' ', $ids);
		$list = '(';
		foreach ($ids as $id) {
			if (strlen($list) > 1) $list .= ', ';
			$list .= intval($id);
		}
		$list .= ')';
		$where .= " AND id IN $list";
	}
	if (array_key_exists('assignment', $_GET)) {
		$assignment = $mysqli->escape_string($_GET['assignment']);
		$where .= " AND assignmentID = '$assignment'";
	}
	if (array_key_exists('project', $_GET)) {
		$project = $mysqli->escape_string($_GET['project']);
		$where .= " AND projectID = '$project'";
	}
	if (array_key_exists('user', $_GET)) {
		$user = $mysqli->escape_string($_GET['user']);
		$where .= " AND userID = '$user'";
	}

	$query = "SELECT * FROM `trace` $where
		ORDER BY assignmentID, projectID, time";

	$result = $mysqli->query($query);
	if (!$result) {
		die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
	}

	echo "<table cellspacing='0'>";
	echo "<thead><th>Log ID</th><th>Project ID</th><th>Type</th><th>Time</th></thead>";
	while($row = mysqli_fetch_array($result)) {
		$id=$row['id'];
		$assignmentID = $row['assignmentID'];
		$projectID = $row['projectID'];
		$displayID = substr($projectID, 0, strpos($projectID, '-'));
		$type = $row['message'];
		$hasHint = strpos($type, 'SnapDisplay.show') !== false;
		$type = str_replace('SnapDisplay.show', '', $type);
		$type = str_replace('HighlightDisplay.', '', $type);
		$type = str_replace('HighlightDialogBoxMorph.', '', $type);
		$time = $row['time'];
		$data = json_encode($row['data']);
		if (!$hasHint) $data = "null";
		$onclick = "loadSnap(\"$id\", \"$projectID\", \"$assignmentID\", $data, \"$type\")";
		$onclick = htmlspecialchars($onclick);
		$contextLink = "../../logging/view/display.php?id=$projectID&assignment=$assignmentID#$id";
		echo "<tr><td id='$id'>
			<a class='rlink' data-rid='$id' href='#' onclick=\"$onclick\">$id</a>
			</td>
			<td>$assignmentID </br>
			<a href='$contextLink' target='_blank' title='See the full logs for this attempt...'>$displayID</a></td>
			<td>$type</td><td>$time</td></tr>";
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
				var rows = [].slice.call(
					document.getElementsByClassName("rlink"));
				var index = 0;
				document.addEventListener('keypress', function(event) {
					var code = event.which || event.keyCode;
					if (code === 100 && index < rows.length - 1) {
						rows[++index].onclick();
					} else if (code === 97 && index > 0) {
						rows[--index].onclick();
					}
				});
				var hash = parseInt(window.location.hash.replace("#", ""));
				if (!isNaN(hash)) {
					index = rows.findIndex(function(a) {
						return a.dataset.rid == hash;
					});
				}
				var snap = document.getElementById("snap");
				snap.onload = function() {
					snap.contentWindow.ide.toggleStageSize();
					if (index > 0 && rows.length > 0) {
						rows[index].onclick();
					}
				}
			</script>
		</div>
	</body>
</html>