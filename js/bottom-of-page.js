document.write(
(window.location.pathname.indexOf("index.html") >= 0 ||                // is explicitly index page
 window.location.pathname[window.location.pathname.length-1] === "/" ? // is implicitly the index page
     '' :
     '<p>Go to <a href="/ai/">the AI home page</a></p>') +
'<p><a href="http://creativecommons.org/licenses/by/4.0/" rel="license"><img style="border-width: 0;" src="/ai/images/88x31.png" alt="Creative Commons License by 4.0"></a>' +
'&nbsp;&nbsp;' +
'<img src="/ai/images/logo_EU_flag.png" alt="" width="45" height="30">' +
'&nbsp;' +
'<a href="https://project.ecraft2learn.eu"><img src="/ai/images/logo_ecraft_face.png" alt="" width="35" height="30"></a>' +
'&nbsp;' +
'eCraft2Learn H2020-731345 - University of Oxford.');


