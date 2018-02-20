// if student is in the URL hash (after the #) then teacher elements are hidden
// otherwise student elements are hidden
window.addEventListener(
     'DOMContentLoaded',
     function () {
        var style = document.createElement('link');
        style.rel="stylesheet";
        if (window.location.hash.indexOf("teacher") >= 0) {
           style.href = "/ai/css/teacher.css";
        } else {
           style.href = "/ai/css/student.css"; 
        }
        document.head.appendChild(style);
});
