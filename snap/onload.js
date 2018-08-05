// A file needed for the AI guide that loads Snap! projects into iframes
// Written by Ken Kahn 
// No rights reserved.

var world;
window.addEventListener('load', function () {
	var world_canvas = document.getElementById('world');
	var ide_morph = new IDE_Morph();
	var loop = function loop() {
		requestAnimationFrame(loop);
		world.doOneCycle();
	};
	let full_screen = true;
	let run_full_screen = true;
	let edit_mode = false;
	const load_project_string = 
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
						   if (edit_mode) {
						   	   ide_morph.toggleAppMode(false);
						   }
					   },
					   1000);
	};
    const fetch_and_load = function (project_path) {
    	fetch(project_path).then(function (response) {
									 response.text().then(load_project_string);
								 }).catch(function (error) {
									 console.error("Error fetching " + project_path + ": " + error.message);
								 });
    };
	world = new WorldMorph(world_canvas);
//  world.worldCanvas.focus(); // not good for pages with iframes containing Snap! programs
	ide_morph.openIn(world);
	if (window.frameElement) { // if running in an iframe see if a local project_path is declared
		var project_path = window.frameElement.getAttribute("project_path");
		run_full_screen = window.frameElement.getAttribute("run_full_screen");
		full_screen = run_full_screen || window.frameElement.getAttribute("full_screen");
		edit_mode = window.frameElement.getAttribute("edit_mode");
		let stage_scale = window.frameElement.getAttribute("stage_ratio");
		if (project_path) {
			fetch_and_load(project_path);
		}
		if (!full_screen || edit_mode) {
			ide_morph.controlBar.hide();    // no need for the control bar
			ide_morph.toggleAppMode(false); // launch in edit mode
		}
		if (stage_scale) {
			ide_morph.toggleStageSize(true, +stage_scale);
		}
		ide_morph.setBlocksScale(1); // the chapter projects were designed with default block size (though scaled via CSS)
		window.onbeforeunload = function () {}; // don't bother the user about reloading
		window.speechSynthesis.getVoices();     // no need to wait for them to load
	} else if (window.location.search) {
		const parameters = new URLSearchParams(window.location.search);
		if (parameters.has('project')) {
			let project_name = parameters.get('project');
			let project_path = project_name;
			if (project_name.indexOf('/') < 0) {
				// if just a name use the default folder and extension
				project_path = "/ai/projects/" + project_path  + ".xml";
			}
			fetch_and_load(project_path);
		}
	}
	loop();
// 	window.addEventListener('load', loop);
});

