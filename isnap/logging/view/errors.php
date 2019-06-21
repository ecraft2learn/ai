<?php

include '../config.php';

?>

<!doctype html>

<html>
    <head>
        <meta charset="UTF-8">
		<title>Javascript Errors</title>
		<link rel="stylesheet" type="text/css" href="table.css">
        <style>
            table td {
                text-align: left;
                padding: 10px;
                max-width: 900px;
            }
            table.condensed {
                margin: 0;
                width: 500px;
            }
            table.condensed th, table.condensed td {
                padding: 2px;
                text-align: left;
            }
            pre {
                white-space: pre-wrap;
            }
        </style>
    </head>

    <body>
        <h1>Recent Errors</h1>
        <table>
            <tr><th>Projs,<br/>Count</th><th>Last Time</th><th>Message</th><th>Stack</th><th>Projects</th></tr>
            <?php
                if (!$enable_viewer) return;
                $mysqli = new mysqli($host, $user, $password, $db);
                if ($mysqli->connect_errno) {
                    die ("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
                }
                $query =
"SELECT count(*) as count, MAX(time) AS time, data, assignmentID, projectID
FROM $table WHERE message='Error'
GROUP BY data, assignmentID, projectID
ORDER BY time DESC";
                $result = $mysqli->query($query);
                if (!$result) {
                    die ("Failed to retrieve data: (" . $mysqli->errno . ") " . $mysqli->error);
                }
                $stacks = array();
                while($row = mysqli_fetch_assoc($result)) {
                    $data = $row['data'];
                    $count = $row['count'];
                    $time = $row['time'];
                    $json = json_decode($data, true);
                    if (!(is_array($json) && array_key_exists('message', $json))) continue;

                    $stack = '';
                    $browser = '';
                    if (array_key_exists('stack', $json)) {
                        $stack = $json['stack'];
                    } else {
                        foreach ($json as $key => $value) {
                            if ($key == 'message' || $key == 'browser') continue;
                            $stack .= '$key: $value\n';
                        }
                    }
                    if (array_key_exists('browser', $json)) {
                        $browser = $json['browser'];
                    }

                    if (!isset($stacks[$stack])) {
                        $stacks[$stack] = array(
                            'count' => 0,
                            'totalCount' => 0,
                            'time' => $time,
                            'message' => $json['message'],
                            'stack' => $stack,
                            'occurrences' => array()
                        );
                    }
                    $entry = &$stacks[$stack];
                    $entry['count']++;
                    $entry['totalCount'] += $count;
                    array_push($entry['occurrences'], array(
                        'count' => $count,
                        'time' => $time,
                        'browser' => $browser,
                        'assignmentID' => $row['assignmentID'],
                        'projectID' => $row['projectID']
                    ));
                }
                foreach ($stacks as $row) {
                    echo "<tr>";
                    echo "<td>" . $row["count"] . ',' . $row['totalCount'] . "</td>";
                    echo "<td>" . $row["time"] . "</td>";

                    // TODO: JSON
                    echo "<td>" . htmlentities($row["message"]) . "</td>";
                    echo "<td><pre>" . htmlentities($row['stack']) . "</pre></td>";

                    echo '<td><table class="condensed"';
                    echo "<tr><th>Count</th><th>Last Time</th><th>Browser</th><th>Assignment</th><th>Project ID</th></tr>";
                    foreach ($row['occurrences'] as $occ) {
                        echo '<tr>';
                        echo "<td>" . $occ["count"] . "</td>";
                        echo "<td>" . $occ["time"] . "</td>";
                        echo "<td>" . $occ['browser'] . "</td>";
                        $assignmentID = $occ["assignmentID"];
                        $projectID = $occ["projectID"];
                        $displayID = $projectID;
                        if (strlen($displayID) > 6) $displayID = substr($displayID, 0, 6);
                        echo "<td>$assignmentID</td>";
                        echo "<td><a target='_blank' href='display.php?id=$projectID&assignment=$assignmentID'>$displayID</a></td>";
                        echo "</tr>\n";
                    }
                    echo '</table></td>';

                    echo "</tr>\n";
                }
            ?>
        </table>
    </body>
</html>