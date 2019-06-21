<?php
include '../../../logging/config.php';

// Creates the handmade hint table dynamically.

$mysqli = new mysqli($host, $user, $password, $db);
if ($mysqli->connect_errno) {
    die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
}

$logID = $_GET['logID'];
$user = $_GET['user'];

// Shows specific rows for adding handmade hints.
$query = "SELECT *
FROM handmade_hints JOIN trace ON handmade_hints.rowID=trace.id
WHERE handmade_hints.userID='$user' AND handmade_hints.rowID=$logID
ORDER BY handmade_hints.priority, handmade_hints.hid";

$result = $mysqli->query($query);
if (!$result) {
    die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
}

function hintCell($row) {
    $updated = $row["updatedTime"];
    $hintID = $row['hid'];
    $id = $row['rowID'];
    if (!$updated) $updated = "<i>No hint saved</i>";
    $code = $row["hintCode"];
    $assignment = $row["assignmentID"];
    $projectID = $row["projectID"];
    $loadClass = $code ? '' : 'disabled';
    $load = "<a id='l$hintID' class='$loadClass' href='javascript:void(0)' onclick='loadHint($hintID, \"$assignment\")'>Load</a>";
    $save = "<a href='javascript:void(0)' onclick='saveHint($hintID, \"$projectID\")'>Save</a>";
    return "<span id='d$hintID'>$updated</span><br/>$load<br/><br />$save";
}

function editsLink($row, $id, $projectID, $assignmentID) {
    $edits = $row["hintEdits"];
    if ($edits == null) return "<i>Edits</i>";
    $onclick = "showEdits($edits, \"$id\", \"$projectID\", \"$assignmentID\")";
    $onclick = htmlspecialchars($onclick);
    return "<a href='javascript:void(0)' onclick=\"$onclick\">Edits</a>";
}

$row = mysqli_fetch_array($result);
$assignmentID = $row['assignmentID'];
$trueAssignmentID = $row['trueAssignmentID'];
$projectID = $row['projectID'];
$displayID = substr($projectID, 0, strpos($projectID, '-'));
$onclick = "loadSnap(\"$logID\", \"$projectID\", \"$assignmentID\"); loadHintTable($logID);";
$onclick = htmlspecialchars($onclick);
$contextLink = "../../../logging/view/display.php?id=$projectID&end=$logID&assignment=$assignmentID#$logID";

echo "<table cellspacing='0'>";
echo "<thead><th>Log ID<br /></th><th>Project ID</th></thead>";
echo "<tr>
        <td id='log-$logID'><a class='rlink' data-rid='$logID' href='#' onclick=\"$onclick\">$logID</br></a> </td>
        <td>$trueAssignmentID </br>
            <a href='$contextLink' target='_blank' title='See the full logs for this attempt...'>$displayID</a></td>
    </tr>";
echo "</table>";

echo "<table id='hintTable' cellspacing='0'>";
echo "<thead><th>View</th><th>Hint ID</th><th>Hint</th><th>Priority</th></thead>";

// Move result pointer back
mysqli_data_seek($result, 0);
while($row = mysqli_fetch_array($result)) {
    $id = $row['rowID'];
    $hintID = $row['hid'];
    $assignmentID = $row['assignmentID'];
    $trueAssignmentID = $row['trueAssignmentID'];
    $type = $row['message'];
    $type = str_replace('SnapDisplay.show', '', $type);
    $time = $row['time'];
    $data = json_encode($row['data']);
    $priority = $row['priority'];
    $hint = hintCell($row);
    $edit = editsLink($row, $id, $projectID, $assignmentID);

    echo "<tr id='r$hintID'>
        <td>$edit<br /></td>
        <td>$hintID<br /><button onclick='deleteHint($hintID)'>Delete</button></td>
        <td>$hint</td>
        <td>
            <select id='p$hintID'>";
    if (!!!$priority) {
        echo "<option value='' selected> -- priority -- </option>";
    } else {
        echo "<option value='' > -- priority -- </option>";
    }
    if ($priority == 1) {
        echo "<option value='1' selected>1 - Higest</option>";
    } else {
        echo "<option value='1'>1 - Higest</option>";
    }
    if ($priority == 2) {
        echo "<option value='2' selected>2 - High</option>";
    } else {
        echo "<option value='2'>2 - High</option>";
    }
    if ($priority == 3) {
        echo "<option value='3' selected>3 - Normal</option>";
    } else {
        echo "<option value='3'>3 - Normal</option>";
    }
    if ($priority == 4) {
        echo "<option value='4' selected>4 - Too Soon</option>";
    } else {
        echo "<option value='4'>4 - Too Soon</option>";
    }
    echo "</select>
        </td>
    </tr>";
}
echo "</table>";

// Button for adding more hints.
echo "<button onclick='addHint($logID, \"$projectID\", \"$assignmentID\", \"$trueAssignmentID\")'>Add Hint</button>";
?>
