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
			.pass {
				color: green;
			}
			.fail {
				color: red;
			}
		</style>
		<script type="text/javascript" src="../../logging/config.js"></script>
		<script type="text/javascript" src="../config.js"></script>
		<script type="text/javascript">
			function loadSnap(id, project, assignment, data, type) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var contentWindow = document.getElementById('snap').contentWindow;
						contentWindow.assignmentID = assignment;
						contentWindow.ide.droppedText(xhr.responseText);
						data = JSON.parse(data);
						data.type = type;
						window.setTimeout(function() {
							contentWindow.hintProvider.showLoggedHint(data);
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

			// credit: http://www.html5rocks.com/en/tutorials/cors/
			function createCORSRequest(method, url) {
				var xhr = new XMLHttpRequest();
				if ('withCredentials' in xhr) {
					// Check if the XMLHttpRequest object has a "withCredentials" property.
					// "withCredentials" only exists on XMLHTTPRequest2 objects.
					xhr.open(method, url, true);
				} else if (typeof XDomainRequest != 'undefined') {
					// Otherwise, check if XDomainRequest.
					// XDomainRequest only exists in IE, and is IE's way of making CORS
					// requests
					xhr = new XDomainRequest();
					xhr.open(method, url);
				} else {
					// Otherwise, CORS is not supported by the browser.
					xhr = null;
				}
				return xhr;
			}

			function hintDifference(a, b) {
				var hintsA = JSON.parse(a);
				var hintsB = JSON.parse(b);
				var shared = [];

				for (var i = 0; i < hintsA.length; i++) {
					var hintA = hintsA[i];
					var dataA = hintA.data;

					if (!hintA.type) hintsA.type = 'vector';
					if (hintA.type === 'vector') {
						// Get rid of logged prototypeHatBlocks, which the
						// server will not have added
						if (dataA.from[0] === 'prototypeHatBlock') {
							dataA.from.splice(0, 1);
						}
						if (dataA.to[0] === 'prototypeHatBlock') {
							dataA.to.splice(0, 1);
						}
					}

					for (var j = 0; j < hintsB.length; j++) {
						if (areHintsEqual(hintA, hintsB[j])) {
							shared.push(hintsA.splice(i--, 1)[0]);
							hintsB.splice(j, 1);
							break;
						}
					}
				}
				if (hintsA.length === 0 && hintsB.length === 0) return null;
				return {
					'uniqueHintsA': hintsA,
					'uniqueHintsB': hintsB,
					'sharedHints': shared,
				};
			}

			function areHintsEqual(hintA, hintB) {
				if (hintA.type !== hintB.type) return false;
				if (hintA.type === 'vector') {
					return areVectorHintsEqual(hintA.data, hintB.data);
				} else if (hintA.type === 'highlight') {
					return areHighlightHintsEqual(hintA.data, hintB.data);
				}
				return false;
			}

			function areVectorHintsEqual(dataA, dataB) {
				if (!dataA || !dataB) return false;
				if (JSON.stringify(dataA.from) !== JSON.stringify(dataB.from) ||
						JSON.stringify(dataA.to) !== JSON.stringify(dataB.to)) {
					return false;
				}
				if (!areRootsEqual(dataA.root, dataB.root)) return false;
				return true;
			}

			function areHighlightHintsEqual(dataA, dataB) {
				// For not, JSON should be formatted the same in server
				// and logs, but this may change and require more complex
				// parsing and comparing
				return JSON.stringify(dataA) === JSON.stringify(dataB);
			}

			function areRootsEqual(rootA, rootB) {
				if (rootA == null) return rootB == null;
				if (rootB == null) return false;
				return rootA.index === rootB.index &&
					rootA.label === rootB.label &&
					areRootsEqual(rootA.parent, rootB.parent);
			}

			function viewJSON(jsonObject) {
				var winURL='../../logging/view/json-viewer.php';
				var params = { 'json' : JSON.stringify(jsonObject) };
				var form = document.createElement("form");
				form.setAttribute("method", "post");
				form.setAttribute("action", winURL);
				form.setAttribute("target", "_blank");
				for (var i in params) {
					if (params.hasOwnProperty(i)) {
						var input = document.createElement('input');
						input.type = 'hidden';
						input.name = i;
						input.value = params[i];
						form.appendChild(input);
					}
				}
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
			}

			var verifyCallback;

			function verify(id, project, assignment, data) {
				var dataJSON = JSON.parse(data);
				var type = 'vector';
				if (dataJSON[0] && dataJSON[0].type) type = dataJSON[0].type;
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState==4 && xhr.status==200) {
						var xml = xhr.responseText;
						var url = getHintURL() +
							'?assignmentID=' + encodeURIComponent(assignment) +
							'&hintTypes=' + encodeURIComponent(type);

						if (window.assignments) {
							var dataset = window.assignments[assignment].dataset;
							if (dataset) url += '&dataset=' + encodeURIComponent(dataset);
						}
						var cors = createCORSRequest('POST', url);
						cors.onload = function() {
							var hints = cors.responseText;
							var link = document.getElementById('v' + id);
							var diff = hintDifference(data, hints);
							if (!diff) {
								link.innerHTML = 'Pass';
								link.classList.add('pass');
								diff = dataJSON;
							} else {
								link.innerHTML = '-' +
									diff.uniqueHintsA.length + ' / +' +
									diff.uniqueHintsB.length + ' / ~' +
									diff.sharedHints.length;
								link.classList.add('fail');
							}
							link.onclick = function() {
								viewJSON(diff);
							};
							if (verifyCallback) verifyCallback();
						};

						cors.onerror = function(e) {
							console.error('Error contacting hint server!');
						};

						cors.send(xml);
					}
				};
				xhr.open("GET", "../../logging/view/code.php?id=" + id + "&project=" + project, true);
				xhr.send();
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
				<?php
include '../../logging/config.php';

if ($enable_viewer) {

	$mysqli = new mysqli($host, $user, $password, $db);
	if ($mysqli->connect_errno) {
		die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
	}

	$assignment = $mysqli->escape_string($_GET['assignment']);

	$query =
		"SELECT
			hint.assignmentID AS assignmentID, hint.projectID AS projectID, hint.id AS id, hint.time AS time, hint.message AS message,
			hint.data AS hintData, proc.data AS procData, proc.code AS procCode
		FROM (
			SELECT *
			FROM trace
			WHERE message='HintProvider.processHints' AND assignmentID='$assignment'
		) AS proc JOIN (
			SELECT *
			FROM trace
			WHERE message LIKE 'SnapDisplay.show%Hint' AND assignmentID='$assignment'
		) AS hint ON proc.assignmentID=hint.assignmentID AND proc.projectID=hint.projectID AND proc.id <= hint.id
		WHERE NOT EXISTS (
			SELECT * FROM trace WHERE
				trace.assignmentID=proc.assignmentID AND trace.projectID=proc.projectID AND trace.message='HintProvider.processHints' AND
				trace.id > proc.id AND trace.id <= hint.id
		)
		";

	$result = $mysqli->query($query);
	if (!$result) {
		die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
	}

	echo "<table cellspacing='0'>";
	echo "<thead><th>Log ID</th><th>Project ID</th><th>Verify</th><th>Time</th></thead>";
	while($row = mysqli_fetch_array($result)) {
		$id=$row['id'];
		$assignmentID = $row['assignmentID'];
		$projectID = $row['projectID'];
		$displayID = substr($projectID, 0, strpos($projectID, '-'));
		$type = $row['message'];
		$type = str_replace('SnapDisplay.show', '', $type);
		$time = $row['time'];
		$hintData = json_encode($row['hintData']);
		$procData = json_encode($row['procData']);
		$onclick = "loadSnap(\"$id\", \"$projectID\", \"$assignmentID\", $hintData, \"$type\")";
		$onclick = htmlspecialchars($onclick);
		$contextLink = "../../logging/view/display.php?id=$projectID&assignment=$assignmentID#$id";
		$verify = "verify(\"$id\", \"$projectID\", \"$assignmentID\", $procData)";
		$verify = htmlspecialchars($verify);
		echo "<tr><td id='$id'>
			<a class='rlink' data-rid='$id' href='#' onclick=\"$onclick\">$id</a>
			</td>
			<td>$assignmentID </br>
			<a href='$contextLink' target='_blank' title='See the full logs for this attempt...'>$displayID</a></td>
			<td><b class='vlink'' id='v$id' onclick=\"$verify\">Verify</b></td>
			<td>$time</td></tr>";
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

				var vRows = [].slice.call(
					document.getElementsByClassName("vlink"));
				var vi = 0;
				verifyCallback = function() {
					if (vi < vRows.length) {
						vRows[vi++].onclick();
					}
				}
				verifyCallback();
			</script>
		</div>
	</body>
</html>