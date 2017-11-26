var world;
			window.onload = function () {
				var world_canvas = document.getElementById('world');
				var ide_morph = new IDE_Morph();
				world = new WorldMorph(world_canvas);
                world.worldCanvas.focus();
				ide_morph.openIn(world);
				var project_path = window.frameElement.getAttribute("project_path");
				if (project_path) {
					fetch(project_path).then(function (response) {
												 response.text().then(function (project_text) {
											 		 ide_morph.rawOpenProjectString(project_text);
											 	 });
											 }).catch(function (error) {
												 console.error("Error fetching " + project_path + ": " + error.message);
											 });
				}
                loop();
			};
			function loop() {
                requestAnimationFrame(loop);
				world.doOneCycle();
			}
