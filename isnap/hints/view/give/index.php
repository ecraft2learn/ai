<!doctype html>

<html>

	<head>
		<meta charset="UTF-8">
		<title>View Project</title>
		<link rel="stylesheet" type="text/css" href="../../../logging/view/table.css">
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
			a.disabled:link {
				pointer-events: none;
				color: #666;
				font-weight: normal;
				font-style: italic;
			}
		</style>
		<script type="text/javascript">
			var user = "<?php echo $_GET['user']; ?>";

			function loadSnap(id, project, assignment, callback) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var contentWindow = document.getElementById('snap').contentWindow;
						contentWindow.Assignment.setID(assignment);
						contentWindow.ide.droppedText(xhr.responseText);
						if (callback) callback();
					}
				};
				xhr.open("GET", "../../../logging/view/code.php?id=" + id + "&project=" + project, true);
				xhr.send();
				window.location.hash = id;
				window.index = rows.findIndex(function(a) {
					return a.dataset.rid == id;
				});
			}

			function saveHint(rowID, phase, projectID) {
				var contentWindow = document.getElementById('snap').contentWindow;
				if (contentWindow.ide.stage.guid !== projectID) {
					alert("Project ID does not match original code. Make sure you pressed the right save button.");
					return;
				}
				var code = contentWindow.Trace.lastCode;
				if (!code || code.length == 0) alert("No code to save");
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var date = document.getElementById('d' + rowID + '-' + phase);
						date.innerHTML = xhr.responseText;
						var load = document.getElementById('l' + rowID + '-' + phase);
						load.classList.remove('disabled');
					}
				};
				xhr.open("POST", "hint.php?rowID=" + rowID + "&phase=" + phase + "&user=" + user, true);
				xhr.send(code);
			}

			function loadHint(rowID, phase, assignment) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var contentWindow = document.getElementById('snap').contentWindow;
						contentWindow.Assignment.setID(assignment);
						contentWindow.ide.droppedText(xhr.responseText);
					}
				};
				xhr.open("GET", "hint.php?rowID=" + rowID + "&phase=" + phase + "&user=" + user, true);
				xhr.send();
			}

			function showEdits(edits, id, project, assignment, callback) {
				var contentWindow = document.getElementById('snap').contentWindow;
				var provider = contentWindow.hintProvider;
				if (!provider) return;
				provider.forcedHints = [];
				loadSnap(id, project, assignment, function() {
					setTimeout(function() {
						provider.forcedHints = edits;
						provider.displays.forEach(function(display) {
							display.enabled = true;
						});
						provider.getHintsFromServer();
					}, 300);
				});
			}
		</script>
	</head>

	<body>
		<div id="wrapper">
			<div id="sidebar">
				 <iframe id="snap" width="100%" height="100%" src="../../../snap.html?assignment=view&hints=true"></iframe>
			</div>
			<div id="content">
				<div style="overflow: scroll; height: 100%;">
				<?php
include '../../../logging/config.php';
if ($enable_viewer) {

	$mysqli = new mysqli($host, $user, $password, $db);
	if ($mysqli->connect_errno) {
		die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
	}

	$user = $mysqli->escape_string($_GET['user']);
    $query = "SELECT *
    FROM hints JOIN trace ON hints.rowID=trace.id
    WHERE hints.userID='$user' ORDER BY rowID";

	$result = $mysqli->query($query);
	if (!$result) {
		die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
	}

    function hintCell($row, $n) {
        $updated = $row["h${n}Updated"];
		$id=$row['rowID'];
        if (!$updated) $updated = "<i>No hint saved</i>";
		$code = $row["h${n}Code"];
		$assignment = $row["assignmentID"];
		$projectID = $row["projectID"];
		$loadClass = $code ? '' : 'disabled';
		$load = "<a id='l$id-$n' class='$loadClass' href='javascript:void(0)' onclick='loadHint($id, $n, \"$assignment\")'>Load</a>";
        $save = "<a href='javascript:void(0)' onclick='saveHint($id, $n, \"$projectID\")'>Save</a>";
        return "<span id='d$id-$n'>$updated</span><br/>$load<br/>$save";
    }

	function editsLink($row, $n, $id, $projectID, $assignmentID) {
		$edits = $row["h${n}Edits"];
		if ($edits == null) return "<i>Edits $n</i>";
		$onclick = "showEdits($edits, \"$id\", \"$projectID\", \"$assignmentID\")";
		$onclick = htmlspecialchars($onclick);
		return "<a href='javascript:void(0)' onclick=\"$onclick\">Edits $n</a>";
	}

	echo "<table cellspacing='0'>";
	echo "<thead><th>Log ID</th><th>Project ID</th><th>Best Hint</th><th>All Edits</th></thead>";
	while($row = mysqli_fetch_array($result)) {
		$id=$row['rowID'];
		$assignmentID = $row['assignmentID'];
		$projectID = $row['projectID'];
		$displayID = substr($projectID, 0, strpos($projectID, '-'));
		$type = $row['message'];
		$type = str_replace('SnapDisplay.show', '', $type);
		$time = $row['time'];
		$data = json_encode($row['data']);
		$onclick = "loadSnap(\"$id\", \"$projectID\", \"$assignmentID\")";
		$onclick = htmlspecialchars($onclick);
		$contextLink = "../../../logging/view/display.php?id=$projectID&assignment=$assignmentID#$id";
        $h1 = hintCell($row, 1);
        $h2 = hintCell($row, 2);
		$e1 = editsLink($row, 1, $id, $projectID, $assignmentID);
		$e2 = editsLink($row, 2, $id, $projectID, $assignmentID);

		echo "<tr>
            <td id='$id'>
				<a class='rlink' data-rid='$id' href='#' onclick=\"$onclick\">$id</a><br />
				$e1<br />$e2
			</td>
			<td>$assignmentID </br>
			    <a href='$contextLink' target='_blank' title='See the full logs for this attempt...'>$displayID</a></td>
            <td>$h1</td>
            <td>$h2</td>
        </tr>";
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
					var cw = snap.contentWindow;
					cw.ide.toggleStageSize();
					cw.hintProvider.forcedHints = [];
					if (!cw.hintProvider.displays.some(function(display) {
						return display instanceof cw.DebugDisplay;
					})) {
						var debugDisplay = new cw.DebugDisplay();
						console.log(debugDisplay);
						cw.hintProvider.displays.push(debugDisplay);
						debugDisplay.show();
					}
					cw.hintProvider.displays.forEach(function(display) {
						if (display instanceof cw.HighlightDisplay) {
							display.showInserts = true;
							display.forceShowDialog = true;
							display.enabled = true;
						}
					});
					if (rows.length > 0) {
						rows[index].onclick();
					}
				}
			</script>
		</div>
	</body>
</html>