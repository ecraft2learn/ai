"use strict";
var when_script_loaded = function () {
	window.ecraft2learn_library_script = undefined;
	ecraft2learn.snap_context = this;
        ecraft2learn.run(function_name, parameters);
    }.bind(this);    
if (typeof ecraft2learn === 'object') {
    ecraft2learn.snap_context = this;
    ecraft2learn.run(function_name, parameters);
} else if (window.ecraft2learn_library_script) {
    window.ecraft2learn_library_script.addEventListener('load', when_script_loaded);
} else {
    window.ecraft2learn_library_script = document.createElement("script");
    window.ecraft2learn_library_script.type = "text/javascript";
    window.ecraft2learn_library_script.src = "https://toontalk.github.io/ai-cloud/ecraft2learn.js";
    window.ecraft2learn_library_script.addEventListener('load', when_script_loaded);
    document.head.appendChild(script);
}
