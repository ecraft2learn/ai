<?php

header('Content-Type: text/plain');
header('Content-Disposition: attachment; filename="snap.html"');

?>

<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Snap! Build Your Own Blocks</title>
		<link rel="shortcut icon" href="http://snap.berkeley.edu/snapsource/favicon.ico">
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/morphic.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/widgets.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/blocks.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/threads.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/objects.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/gui.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/paint.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/lists.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/byob.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/xml.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/store.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/locale.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/cloud.js"></script>
		<script type="text/javascript" src="http://snap.berkeley.edu/snapsource/sha512.js"></script>
		<script type="text/javascript">
			var world;
			window.onload = function () {
				world = new WorldMorph(document.getElementById('world'));
				world.worldCanvas.focus();
				var ide = new IDE_Morph();
				ide.openIn(world);
				setInterval(loop, 1);
				
				ide.droppedText(
				<?php
					$xml = file_get_contents($_FILES['xml']['tmp_name']);
					echo json_encode($xml) . "\n";
				?>
				);
				setTimeout(function() {
					ide.toggleAppMode();
				}, 1500);
			};
			function loop() {
				world.doOneCycle();
			}
		</script>
	</head>
	<body style="margin: 0;">
		<canvas id="world" tabindex="1" style="position: absolute;" />
	</body>
</html>
