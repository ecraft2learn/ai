"use strict";
if (typeof ecraft2learn === 'object') {
    ecraft2learn.snap_context = this;
    ecraft2learn.run(function_name, parameters);
} else {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://toontalk.github.io/ai-cloud/ecraft2learn.js";
    script.addEventListener('load', function () {
	ecraft2learn.snap_context = this;
        ecraft2learn.run(function_name, parameters);
    }.bind(this));
    document.head.appendChild(script);
}
