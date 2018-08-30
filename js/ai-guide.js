// if student is in the URL hash (after the #) then teacher elements are hidden
// otherwise student elements are hidden
window.addEventListener(
     'DOMContentLoaded',
     function () {
        const add_style_sheet = function (url) {
            let style = document.createElement('link');
            style.rel="stylesheet";
            style.href = url;
            document.head.appendChild(style);
        }
        const insert_check_box = function (label, title, checked, on_value_change, before_element) {
            const label_element = document.createElement('label');
            label_element.innerHTML = "<input type='checkbox'>" + label;
            label_element.title = title;
            let check_box = label_element.firstChild;
            check_box.checked = checked;
            let response = function () {
                on_value_change(check_box.checked);   
            };
            check_box.onchange    = response;
            label_element.onclick = response;
            document.body.insertBefore(label_element, before_element);
            return check_box;
        };
        const toggle_elements = function (selector, hide) {
            let elements = document.querySelectorAll(selector);
            elements.forEach(function (element) {
                if (hide) {
                    element.style.display = 'none';
                } else {
                    element.style.display = 'block';       
                }
            });
        };
        let advanced_material_checkbox;
        let hide_all = function (hide) {
            ['.non-essential', '.advanced-topic', '.advanced-topic-body', '.how-it-works'].forEach(
                function (selector) {
                    toggle_elements(selector, hide)
                });
            if (advanced_material_checkbox) {
               advanced_material_checkbox.checked = hide;
            }
        };
        let hide_advanced_material = function (hide) {
            ['.advanced-topic', '.advanced-topic-body'].forEach(
                function (selector) {
                    toggle_elements(selector, hide)
                });
        };
        const parameters = new URLSearchParams(window.location.search);
        if (parameters.has("student")) {
            add_style_sheet("/ai/css/student.css"); 
        } else {
            add_style_sheet("/ai/css/teacher.css");
        }
        if (parameters.has("short")) {
            hide_all(false);   
        }
        if (window.location.href.indexOf('chapter') >= 0) {
            advanced_material_checkbox =
                insert_check_box("Hide advanced material on this page",
                                 "Click to toggle whether you see the advanced material of this page.",
                                 parameters.has("no-advanced-material"), // initial state
                                 hide_advanced_material,
                                 document.body.firstChild);                
            insert_check_box("Display only the short version of this page<br>",
                             "Click to toggle whether you see the short or long version of this page.",
                             parameters.has("short"), // initial state
                             hide_all,
                             document.body.firstChild);
        }
});

// copy over search query and hash from URL to appropriate links
window.addEventListener(
     'DOMContentLoaded',
     function () {
         var elements = document.getElementsByClassName('guide-link');
         var hash   = window.location.hash;
         var search = window.location.search;
         var add_search_and_hash = function (element) {
             var href = element.getAttribute('href');
             var search_start = href.indexOf("?");
             var hash_start   = href.indexOf("#");
             var new_search = search_start >= 0 &&
                              (hash_start >= 0 ?
                                  href.substring(search_start, hash_start) :
                                  href.substring(search_start));
             var new_hash   = hash_start >= 0 && href.substring(hash_start);
             var url = href;
             if (search_start >= 0) {
                url = href.substring(0, search_start);
             }
             if (hash_start >= 0) {
                url = url.substring(0, hash_start);
             }
             if (new_search) {
                if (search) {
                    new_search += "&" + search.substring(1);
                }
             } else {
                new_search = search;
             }
             if (new_hash) {
                if (hash) {
                    new_hash += "&" + hash.substring(1);
                }
             } else {
                new_hash = hash;
             }
             element.setAttribute('href', url + new_search + new_hash);
         };
         Array.prototype.forEach.call(elements, add_search_and_hash);
});

// hide the next sibling of advanced-topic elements until clicked
window.addEventListener(
     'load', // using load instead of DOMContentLoaded since hidden iframes when made visible are empty
     function () {
         var elements = document.getElementsByClassName('advanced-topic');
         var hide_next_sibling_until_click = function (element) {
             if (window.location.search.indexOf("student") < 0)  {
                 // for teachers always show the advanced material
                 // no need for the box around this material
                 element.nextElementSibling.classList.remove('advanced-topic-body');
                 return;
             }
             element.nextElementSibling.style.display = 'none';
             element.addEventListener('click',
                                      function () {
                                          if (element.nextElementSibling.style.display === 'none') {
                                              element.nextElementSibling.style.display = 'block';    
                                          } else {
                                              element.nextElementSibling.style.display = 'none';
                                          }                                             
                                      }); 
         };
         Array.prototype.forEach.call(elements, hide_next_sibling_until_click);
     });

// stop translation of block name elements
window.addEventListener(
     'DOMContentLoaded', 
     function () {
         var elements = document.getElementsByClassName('block-name');
         var notranslate = function (element) {
             element.classList.add("notranslate");
             element.setAttribute("translate", "no");
         };
         Array.prototype.forEach.call(elements, notranslate);
     });

// create Snap! iframes for embedded projects
window.addEventListener(
     'DOMContentLoaded', 
     function () {
         let elements = document.getElementsByClassName('snap-iframe');
         let snap_iframe = function(element) {
             let name = element.id;
             let style = element.getAttribute('container_style');
             let caption = element.getAttribute('caption');
             let full_screen = element.getAttribute('full_screen');
             let edit_mode = element.getAttribute('edit_mode');
             let stage_ratio = element.getAttribute('stage_ratio');
             let figure     = document.getElementById(name);
             let iframe     = document.createElement('iframe');
             let figcaption = document.createElement('figcaption');
             let img        = document.createElement('img');
             img.src = "/ai/AI-teacher-guide-projects/" + name + ".png";
             img.className = "image-of-iframe";
             let replace_with_iframe = function () {
                 // add a loading div for a few seconds...
                 let loading = document.createElement('div');
                 let project_folder;
                 loading.innerHTML = "<b>Loading. Please wait.</b>";
                 figure.insertBefore(loading, figcaption);
                 img.remove();
//                  if (window.location.hostname === 'localhost') {
//                      iframe.src = "/ai/snap/snap-beta.html";
//                  } else {
                     iframe.src = "/ai/snap/snap.html";
//                  }
                 iframe.setAttribute('scrolling', 'no');
                 // remove loading message 3 seconds after Snap! loads
                 // since project loading takes time too
                 iframe.addEventListener('load',    
                                         function () {
                                             setTimeout(function () {
                                                loading.remove();
                                             },
                                             1000);
                                         });
                 if (full_screen) {
                     project_folder = "/ai/projects/";
                     if (full_screen === 'true') {
                         iframe.setAttribute('full_screen', 'true');
                     }
                     if (edit_mode) {
                         iframe.setAttribute('edit_mode', 'true');
                     }
                     if (stage_ratio) {
                         iframe.setAttribute('stage_ratio', stage_ratio);
                     }
                     iframe.style = style;
                     figure.insertBefore(iframe, figcaption);
                 } else {
                     project_folder = "/ai/AI-teacher-guide-projects/";
                     iframe.className = "iframe-clipped";
                     let iframe_style = element.getAttribute('iframe_style');
                     if (iframe_style) {
                         iframe.style = iframe_style;
                     }
                     let div = document.createElement('div');
                     div.className = "iframe-container";
                     div.style = style;
                     div.appendChild(iframe);
                     figure.insertBefore(div, figcaption);
                 }
                 iframe.setAttribute('project_path', project_folder + name + ".xml"); 
             };
             img.addEventListener('click', replace_with_iframe);
             img.addEventListener('touchstart', replace_with_iframe);
             figcaption.innerHTML = caption;
             figure.appendChild(img);
             figure.appendChild(figcaption);
             if (window.location.search.indexOf("preload") >= 0) {
                 replace_with_iframe();
             }
         }
         Array.prototype.forEach.call(elements, snap_iframe);
     });


 

