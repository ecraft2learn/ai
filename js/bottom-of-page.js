const path_to_ai_folder = window.location.href.substring(0, window.location.href.indexOf('/ai'));
document.write(
(window.location.pathname.indexOf("ai/index.html") >= 0 ||                       // is explicitly AI index page
 window.location.pathname.indexOf("ai/") === window.location.pathname.length-3 ? // is implicitly the AI index page
     '' :
     '<p class="guide-to-guide">Go to <a href="/ai/">the AI home page</a></p>') +
'<p><a href="http://creativecommons.org/licenses/by/4.0/" rel="license"><img style="border-width: 0;" src="' + path_to_ai_folder + '/ai/images/88x31.png" alt="Creative Commons License by 4.0"></a>' +
'&nbsp;&nbsp;' +
'<img src="' + path_to_ai_folder + '/ai/images/logo_EU_flag.png" alt="" width="90" height="60">' +
'&nbsp;' +
'<a href="https://project.ecraft2learn.eu"><img src="' + path_to_ai_folder + '/ai/images/logo_ecraft_face.png" alt="" width="70" height="60"></a>' +
'&nbsp;' +
'eCraft2Learn H2020-731345 -&nbsp;' +
'<img src="' + path_to_ai_folder + '/ai/images/oxford-crestsq.png" alt="" width="60" height="60">' +
'&nbsp;' +
'University of Oxford</p>');

