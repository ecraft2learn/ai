if (typeof ecraft2learn === 'object') {
    ecraft2learn.run(function_name, parameters);
} else {
   var script = document.createElement("script");
   script.type = "text/javascript";
   script.addEventListener('error', function () {
          alert("Unable to load https://ecraft2learn.github.io/ai/ecraft2learn.js. Check your network connection.");
   });
   script.src = "https://ecraft2learn.github.io/ai/ecraft2learn.js";
   script.addEventListener('load', function () {
          ecraft2learn.run(function_name, parameters);
   });
   document.head.appendChild(script);
}
