if (!reload && window.ecraft2larn_scripts_loaded && window.ecraft2learn_scripts_loaded.indexOf(url) >= 0) {
    if (typeof callback === 'object') {
       invoke(callback, new List([]));
    };
    return;
}
var script = document.createElement("script");
script.type = "text/javascript";
script.src = url;
script.addEventListener('load', function () {
    if (typeof callback === 'object') {
       invoke(callback, new List([]));
    };
    if (window.ecraft2learn_scripts_loaded) {
        window.ecraft2learn_scripts_loaded.push(url);
    } else {
        window.ecraft2learn_scripts_loaded = [url];
    }
});
document.head.appendChild(script);
