var world;
window.addEventListener('DOMContentLoaded', function () {
	var world_canvas = document.getElementById('world');
	var ide_morph = new IDE_Morph();
	var loop = function loop() {
		requestAnimationFrame(loop);
		world.doOneCycle();
	};
	world = new WorldMorph(world_canvas);
//  world.worldCanvas.focus(); // not good for pages with iframes containing Snap! programs
	ide_morph.openIn(world);
	if (window.frameElement) { // if running in an iframe see if a local project_path is declared
		var project_path = window.frameElement.getAttribute("project_path");
		var run_full_screen = window.frameElement.getAttribute("run_full_screen");
		var full_screen = run_full_screen || window.frameElement.getAttribute("full_screen");
		var load_project_string = 
			function (project_text) {
				// timeout wasn't needed before Snap 4.1
				// without it iframes show only Snap! background texture
				setTimeout(function () {
							   ide_morph.rawOpenProjectString(project_text);
							   if (full_screen) {
								   ide_morph.toggleAppMode(true);
							    } 
								if (run_full_screen) {
									ide_morph.runScripts();
								}
							},
							1000);
			};
		if (project_path) {
			fetch(project_path).then(function (response) {
										 response.text().then(load_project_string);
									 }).catch(function (error) {
										 console.error("Error fetching " + project_path + ": " + error.message);
									 });
		}
		if (!full_screen) {
			ide_morph.controlBar.hide();    // no need for the control bar
			ide_morph.toggleAppMode(false); // launch in edit mode
		}
		window.onbeforeunload = function () {}; // don't bother the user about reloading
		ecraft2learn.get_voice_names();         // no need to wait for them to load
	}
	loop();
// 	window.addEventListener('load', loop);
});

