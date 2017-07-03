var script = document.createElement("script");
script.type = "text/javascript";
script.src = url;
if (typeof callback === 'object') {
    script.addEventListener('load', function () {
       invoke(callback, new List([]));
    });
};
document.head.appendChild(script);
