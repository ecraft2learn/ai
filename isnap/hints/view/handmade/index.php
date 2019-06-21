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
				width: 605px;
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
			a.disabled:link {
				pointer-events: none;
				color: #666;
				font-weight: normal;
				font-style: italic;
			}
			.hidden {
				display: none;
			}
			#popup {
				position: absolute;
				left: 50px;
				top: 50%;
				max-width: calc(100% - 650px);
				max-height: 40%;
				overflow: auto;
				padding: 20px;
				border: thin solid black;
				background-color: white;
				z-index: 100;
				cursor: move;
			}
			#diff {
				white-space: pre;
			}
			.code-add {
				color: green;
			}
			.code-delete {
				color: red;
			}
		</style>
		<script type="text/javascript">
			var user = "<?php echo $_GET['user']; ?>";

			function loadSnap(id, project, assignment, callback) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						document.getElementById('popup').classList.add('hidden');
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

			function cleanStatusText(elementID) {
				var statusText = document.getElementById(elementID);
				if (statusText) {
					statusText.remove();
				}
			}

			function showRowLoadedText(id) {
				cleanStatusText('log-loaded-2');
				// Shows which row is loaded
				var loadedLogIDCell = document.getElementById('log-'+id);
				loadedLogIDCell.children[0].innerHTML += "<b id='log-loaded-2' style='color:green'>Loaded</b>";
				cleanStatusText('log-loaded');
				// Shows which row is loaded
				var loadedLogIDCell = document.getElementById(id);
				loadedLogIDCell.children[0].innerHTML += "<b id='log-loaded' style='color:green'>Loaded</b>";
			}

			function loadHintTable(id) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var logTable = document.getElementById('logTable');
						// Cleans the newly added table
						var next = logTable.nextSibling;
						while (next) {
							next.remove();
							next = logTable.nextSibling;;
						}
						logTable.insertAdjacentHTML('afterend', xhr.responseText);
						showRowLoadedText(id);
					}
				};
				xhr.open("GET", "handmade-hintTable.php?user=" + user + "&logID=" + id, true);
				xhr.send();
			}

			function hasEmptyHintRow() {
				//Check whether the user has unsaved changes
				var hintTable = document.getElementById('hintTable');
				var tbody = hintTable.children[1];
				for (var i = 0; i < tbody.children.length; i++) {
					var loadCell = tbody.children[i].children[2];
					var loadTextContainer = loadCell.children[0];
					if (loadTextContainer.children[0] &&
						loadTextContainer.children[0].innerText === "No hint saved") {
							return true;
						}
				}
				return false;
			}

			function addHint(rowID, projectID, assignment, trueAssignmentID) {
				if (hasEmptyHintRow()) {
					alert("Please save your current edits to an empty hint row before creating a new one!");
					return;
				}
				var contentWindow = document.getElementById('snap').contentWindow;
				if (contentWindow.ide.stage.guid !== projectID) {
					alert("Project ID does not match original code. Make sure you pressed the right save button.");
					return;
				}
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						loadSnap(rowID, projectID, assignment);
						addNewHintRow(xhr.responseText, projectID, assignment);
					}
				};
				xhr.open("POST", "handmade-hint.php?rowID=" + rowID + "&user=" + user + "&assignment=" + trueAssignmentID, true);
				xhr.send();
			}

			function addNewHintRow(hintID, projectID, assignment) {
				var hintTable = document.getElementById("hintTable");
				var row = hintTable.insertRow();
				row.id = "r"+hintID;
				var viewCell = row.insertCell(0);
				viewCell.innerHTML = "<i>Edits</i>";

				var hintIDCell = row.insertCell(1);
				hintIDCell.innerHTML = hintID + "<br /><button onclick='deleteHint(" + hintID + ")'>Delete</button>";

				var hintCell = row.insertCell(2);
				var load = "<a id='l" + hintID + "' class='disabled' href='javascript:void(0)' onclick='loadHint(" + hintID + ",\"" + assignment + "\")'>Load</a>";
				var save = "<a href='javascript:void(0)' onclick='saveHint(" + hintID + ",\"" + projectID + "\")'>Save</a>";
				hintCell.innerHTML = "<span id='d" + hintID + "'><i>No hint saved</i></span><br/>" + load + "<br/><br />" + save;

				var priorityCell = row.insertCell(3);
				priorityCell.innerHTML = "<select id='p" + hintID +"'>" +
				"<option value=''> -- priority -- </option>" +
				"<option value='1'>1 - Higest</option>" +
				"<option value='2'>2 - High</option>" +
				"<option value='3'>3 - Normal</option>" +
				"<option value='4'>4 - Too Soon</option></select>";

				showHintEditingText(hintID);
			}

			function deleteHint(hintID) {
				if (document.getElementById("hintTable").rows.length <= 2) {
					alert("You are not allowed to delete the last row.");
					return;
				}
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var hintRow = document.getElementById("r" + hintID);
						hintRow.parentNode.removeChild(hintRow);
					}
				};
				var priority = document.getElementById('p' + hintID).value;
				xhr.open("DELETE", "handmade-hint.php?hintID=" + hintID, true);
				xhr.send();
			}

			function saveHint(hintID, projectID) {
				var contentWindow = document.getElementById('snap').contentWindow;
				if (contentWindow.ide.stage.guid !== projectID) {
					alert("Project ID does not match original code. Make sure you pressed the right save button.");
					return;
				}
				var code = contentWindow.Trace.lastCode;
				if (!code || code.length == 0) alert("No code to save"); //NEED TO FIX: This does not work.

				// If overwrite another row instead of current row, alert the user
				var statusText = document.getElementById('hint-editing');
				if (statusText && statusText.parentNode.parentNode.id !== ('r'+hintID)) {
					if (!confirm("You are not editing your current hint!!!Are you sure you want to overwrite another hint?")) return;
				}

				// If already has hints, alerts the user
				var load = document.getElementById('l' + hintID);
				if (!load.classList.contains('disabled')) {
					if (!confirm("This hint already has record, are you sure you want to overwrite it?")) return;
				}

				showHintEditingText(hintID);
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var date = document.getElementById('d' + hintID);
						date.innerHTML = xhr.responseText;
						var load = document.getElementById('l' + hintID);
						load.classList.remove('disabled');
					}
				};
				var priority = document.getElementById('p' + hintID).value;
				xhr.open("PUT", "handmade-hint.php?hintID=" + hintID + "&priority=" + priority, true);
				xhr.send(code);
			}

			function showHintEditingText(hintID) {
				cleanStatusText('hint-editing');
				var loadedHintRow = document.getElementById('r'+hintID);
				loadedHintRow.children[0].innerHTML += "<b id='hint-editing' style='color:green'></br>Editing...</b>";
			}

			function loadHint(hintID, assignment) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						if (xhr.responseText.startsWith('<project')) {
							var contentWindow =
								document.getElementById('snap').contentWindow;
							contentWindow.Assignment.setID(assignment);
							contentWindow.ide.droppedText(xhr.responseText);
						} else {
							loadDiff(xhr.responseText);
						}
						showHintEditingText(hintID);
					}
				};
				xhr.open("GET", "handmade-hint.php?hintID=" + hintID, true);
				xhr.send();
			}

			function loadDiff(diff) {
				var popup = document.getElementById('popup');
				popup.classList.remove('hidden');
				document.getElementById('diff').innerHTML = diff;
			}

			function mouseUp() {
				window.removeEventListener('mousemove', divMove, true);
			}

			function mouseDown(e) {
				window.addEventListener('mousemove', divMove, true);
				var div = document.getElementById('popup');
				window.dragOffX = div.getBoundingClientRect().left - e.clientX;
				window.dragOffY = div.getBoundingClientRect().top - e.clientY;
			}

			function divMove(e) {
				var div = document.getElementById('popup');
				div.style.position = 'absolute';
				div.style.top = (e.clientY + window.dragOffY) + 'px';
				div.style.left = (e.clientX + window.dragOffX) + 'px';
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

			function toggleLogTable() {
				var logTable = document.getElementById('logTable');
				if (logTable.style.display === "block") {
					logTable.style.display = "none";
				} else {
					logTable.style.display = "block";
				}
			}

		</script>
	</head>

	<body>
		<div id="wrapper">
			<div id="sidebar">
				 <iframe id="snap" width="100%" height="100%" src="../../../snap.html?assignment=view&hints=true"></iframe>
			</div>
			<div id="popup" class="hidden">
				<code id="diff"></code>
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

	// Shows all the available logs which request hint.
	$query = "SELECT DISTINCT rowID, assignmentID, trueAssignmentID, projectID
	FROM handmade_hints JOIN trace ON handmade_hints.rowID=trace.id
	WHERE handmade_hints.userID='$user' ORDER BY trueAssignmentID, rowID";

	$logIDs = $mysqli->query($query);
	echo "<button onclick='toggleLogTable()'>Toggle Log Table</button>";
	echo "<table id='logTable' cellspacing='0' style='display:block'>";
	echo "<thead><th>Log ID</th><th>Project ID</th><th>Log ID</th><th>Project ID</th><th>Log ID</th><th>Project ID</th></thead>";
	$cnt = 0;
	while($row = mysqli_fetch_array($logIDs)) {
		$id=$row['rowID'];
		$assignmentID = $row["assignmentID"];
		$trueAssignmentID = $row["trueAssignmentID"];
		$projectID = $row["projectID"];
		$displayID = substr($projectID, 0, strpos($projectID, '-'));
		$onclick = "loadSnap(\"$id\", \"$projectID\", \"$assignmentID\"); loadHintTable($id);";
		$onclick = htmlspecialchars($onclick);
		$contextLink = "../../../logging/view/display.php?id=$projectID&end=$id&assignment=$assignmentID#$id";
		if ($cnt%3 == 0) {
			echo "<tr>";
		}
		echo "
			<td id='$id'>
				<a class='rlink' data-rid='$id' href='#' onclick=\"$onclick\">$id</br></a>
			</td>
			<td>$trueAssignmentID </br>
				<a href='$contextLink' target='_blank' title='See the full logs for this attempt...'>$displayID</a></td>";
		if (($cnt+1)%3 == 0) {
			echo "</tr>";
		}
		$cnt = $cnt + 1;
	}
	echo "</table>";
} else {
	echo "You do not have permission to view this page";
}
				?>
				</div>
			</div>
			<div id="cleared"></div>
			<script type = "text/javascript">
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
					// if (!cw.hintProvider.displays.some(function(display) {
					// 	return display instanceof cw.DebugDisplay;
					// })) {
					// 	var debugDisplay = new cw.DebugDisplay();
					// 	console.log(debugDisplay);
					// 	cw.hintProvider.displays.push(debugDisplay);
					// 	debugDisplay.show();
					// }
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
				document.getElementById('popup').addEventListener('mousedown', mouseDown, false);
    			window.addEventListener('mouseup', mouseUp, false);
			</script>
		</div>
	</body>
</html>