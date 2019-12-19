// if student is in the URL hash (after the #) then teacher elements are hidden
// otherwise student elements are hidden
'use strict';

window.addEventListener(
     'DOMContentLoaded',
     function () {
        const add_style_sheet = function (url) {
            let style = document.createElement('link');
            style.rel="stylesheet";
            style.href = url;
            document.head.appendChild(style);
        };
        // the purpose of adding '.not-to-be-used' is that
        // when running join("-white,") the last item doesn't get the suffix
        let all_selectors = 
            ['.non-essential', '.advanced-topic',
            '.advanced-information', '.background-information', '.exercise', '.guide-to-guide', '.how-it-works',
             '.instructions', '.project-ideas', '.resources', '.sample-program', '.societal-impact', '.not-to-be-used'];
        let current_selectors = all_selectors.slice();
        let display_only_current_selectors = function () {
            // hide all
            document.querySelectorAll(all_selectors.join(",")).forEach(function (element) {
                element.style.display = 'none';
            });
            // show the current selectors
            document.querySelectorAll(current_selectors.join(",")).forEach(function (element) {
                element.style.display = 'block';       
            });
            // and now do the same for the headings (h3 and h4 typically) and figures
            document.querySelectorAll(all_selectors.join("-white,")).forEach(function (element) {
                element.style.display = 'none';
            });
            // show the current selectors
            document.querySelectorAll(current_selectors.join("-white,")).forEach(function (element) {
                element.style.display = 'block';       
            });
        };
        let remove_selectors = function (selectors_to_remove) {
            current_selectors = current_selectors.filter(function (selector) {
                 return selectors_to_remove.indexOf(selector) < 0; // keep those not in selectors_to_remove   
            });
        };
        let add_selectors = function (selectors_to_add) {
            selectors_to_add.forEach(function (selector) {
                if (current_selectors.indexOf(selector) < 0) {
                    current_selectors.push(selector);   
                }
            });
        };
        let insert_check_box = function (label, title, checked, on_value_change, before_element) {
            const label_element = document.createElement('label');
            label_element.innerHTML = "<input type='checkbox'>" + label;
            label_element.title = title;
            let check_box = label_element.firstChild;
            check_box.checked = checked;
            check_box.onchange = function () {
                on_value_change(check_box.checked);   
            };
            document.body.insertBefore(label_element, before_element);
            return check_box;
        };
        let short_checkbox, advanced_material_checkbox;
        let update_url_hash = function (remove, property, selectors_to_add_or_remove) {
            if (remove) {
                remove_selectors(selectors_to_add_or_remove);
            } else {
                add_selectors(selectors_to_add_or_remove);
            }
            display_only_current_selectors();
            let property_index_in_hash = window.location.hash.indexOf(property);
            if (property_index_in_hash >= 0 && !remove) {
               window.location.hash = window.location.hash.substring(0, property_index_in_hash-2) + // -2 to include the &
                                      window.location.hash.substring(property_index_in_hash+property.length);
            } else if (property_index_in_hash <= 0 && remove) {
               // tried using parameters.append() but wasn't updated if called a second time
               window.location.hash += '&' + property;
            }
        }
        let hide_all = function (hide) {
            update_url_hash(hide,
                            'short',
                            ['.non-essential', '.advanced-topic', '.how-it-works']);
            if (advanced_material_checkbox) {
                advanced_material_checkbox.checked = hide;
            }
        };
        let hide_advanced_material = function (hide) {
            update_url_hash(hide,
                            'no-advanced-material',
                            ['.advanced-topic']);
        };
        let hide_all_but_instructions = function (hide) {
            update_url_hash(hide,
                            'instructions-only',
                            ['.non-essential', '.advanced-topic',
                             '.advanced-information', '.background-information', '.exercise', '.how-it-works',
                             '.project-ideas', '.resources', '.societal-impact']);
            if (advanced_material_checkbox) {
               advanced_material_checkbox.checked = hide;
            }
            if (short_checkbox) {
               short_checkbox.checked = hide;
            }
        };
        // following works because in Snap! the hash is #?...
        const parameters = new URLSearchParams(window.location.hash);
//         if (parameters.has("student")) {
//             add_style_sheet("/ai/css/student.css"); 
//         } else {
//             add_style_sheet("/ai/css/teacher.css");
//         }
        if (parameters.has("short")) {
            hide_all(true);   
        }
        if (parameters.has("no-advanced-material")) {
            hide_advanced_material(true);   
        }
        if (parameters.has("instructions-only")) {
            hide_all_but_instructions(true);   
        }
        if (window.location.href.indexOf('chapter') >= 0) {
            advanced_material_checkbox =
                insert_check_box("Hide advanced material on this page",
                                 "Click to toggle whether you see the advanced material of this page.",
                                 parameters.has("no-advanced-material"), // initial state
                                 hide_advanced_material,
                                 document.body.firstChild);                
            insert_check_box("Display only programming instructions&nbsp;&nbsp;",
                             "Click to toggle whether you see more than the programming instructions on this page.",
                             parameters.has("instructions-only"), // initial state
                             hide_all_but_instructions,
                             document.body.firstChild);
            short_checkbox = 
                insert_check_box("Display only the short version of this page&nbsp;&nbsp;",
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
             if (new_search.indexOf(window.location.search.substring(1)) < 0) { // substring(1) to ignore the #
                 new_search += window.location.search;    
             }
             if (new_hash.indexOf(window.location.hash.substring(1)) < 0) {
                new_hash += window.location.hash;
             }
             element.setAttribute('href', url + new_search + new_hash);
         };
         Array.prototype.forEach.call(elements, add_search_and_hash);
         Array.prototype.forEach.call(document.getElementsByTagName('a'), add_search_and_hash);
});

// hide the next sibling of advanced-topic elements until clicked
window.addEventListener(
     'load', // using load instead of DOMContentLoaded since hidden iframes when made visible are empty
     function () {
         var elements = document.getElementsByClassName('advanced-topic');
         var hide_next_sibling_until_click = function (element) {
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
         const path_to_ai_folder = window.location.href.substring(0, window.location.href.indexOf('/ai'));
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
             const path_to_images = element.getAttribute('path_to_images');
             const path_to_projects = element.getAttribute('path_to_projects');
             const snap_url = element.getAttribute('snap_url');
             if (path_to_images) {
                 img.src = path_to_images + name + ".png"; 
             } else {
                 img.src = path_to_ai_folder + "/ai/AI-Teacher-Guide/images/" + name + ".png";    
             }             
             img.className = "image-of-iframe";
             let replace_with_iframe = function () {
                 // add a loading div message for a few seconds...
                 let loading = document.createElement('div');
                 let project_folder;
                 loading.innerHTML = "<b>Loading. Please wait.</b>";
                 figure.insertBefore(loading, figcaption);
                 img.remove();
                 let search = window.location.search;
                 if (new URLSearchParams(search).has('log')) {
                     search += "&assignment=" + name;
                 }
                 if (snap_url) {
                     iframe.src = snap_url + search + window.location.hash;
                 } else {
                     iframe.src = path_to_ai_folder + "/ai/snap/snap.html" + search + window.location.hash;      
                 }
                 iframe.setAttribute('scrolling', 'no');
                 // remove loading message 1 second after Snap! loads
                 // since project loading takes time too
                 iframe.addEventListener('load',    
                                         function () {
                                             setTimeout(function () {
                                                 loading.remove();
                                             },
                                             1000);
                                         });
                 project_folder = path_to_projects || path_to_ai_folder + "/ai/projects/";
                 if (full_screen) {
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


 

