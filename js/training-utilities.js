 /**
 * Implements utilities shared across multiple training pages
 * Authors: Ken Kahn
 * License: New BSD
 */

 function create_training_buttons(training_class_names, train_on, train_off) {
    var info_texts = [];
    for (let i = 0; i < training_class_names.length; i++) {
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.className = 'training-button-and-info';
      // Create info text next to each button
      const info_text = document.createElement('span');
      info_text.innerHTML = "&nbsp;&nbsp;&nbsp;No examples added";
      // Create training button
      const button = document.createElement('button');
      button.innerHTML = "Click to train <b>" + training_class_names[i] + "</b>";
      button.className = "training-button";
      div.appendChild(button);
      div.appendChild(info_text);
      info_texts.push(info_text);
      // Listen for mouse and touch events when clicking the button
      let class_index = i; // close over a variable that doesn't change (as i does)
      button.addEventListener('mousedown',  function () {
          train_on(class_index, info_text);
      });
      button.addEventListener('touchstart', function () {
          train_on(class_index, info_text);
      });
      button.addEventListener('mouseup',    function () {
          train_off(class_index, info_text);
      });
      button.addEventListener('touchend',   function () {
          train_off(class_index, info_text);
      });
    }
    return info_texts;
}

function create_return_to_snap_button(innerHTML) {
    var return_to_snap_button = document.createElement('button');
    if (!innerHTML) {
        innerHTML = "Return to Snap!";
    }
    return_to_snap_button.innerHTML = innerHTML;
    return_to_snap_button.className = "return-to-snap-button";
    return_to_snap_button.addEventListener('click',
                                           function(event) {
                                               window.parent.postMessage('Hide support iframe', "*");
                                               window.postMessage('stop', "*");
                                               let children = document.body.children;
                                               Array.from(children).forEach(function (child) {
                                                   child.style.opacity = 0;
                                               });
                                           });
     window.addEventListener('message', function (event) {
         if (event.data === 'Show support iframe') {
             let children = document.body.children;
             Array.from(children).forEach(function (child) {
                 child.style.opacity = 1;
             });
             window.postMessage('restart', "*");             
         }
     });                                                
    document.body.appendChild(return_to_snap_button);
}

// tell Snap! this is loaded
window.addEventListener('DOMContentLoaded', 
                        function (event) {
                            if (window.opener) {
                                window.opener.postMessage("Loaded", "*");
                            } else if (window.parent) {
                                window.parent.postMessage("Loaded", "*");
                            }
                        },
                        false);