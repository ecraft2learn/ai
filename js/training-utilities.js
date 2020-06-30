 /**
 * Implements utilities shared across multiple training pages
 * Authors: Ken Kahn
 * License: New BSD
 */

 function create_training_buttons(training_class_names, train_on, train_off) {
    let info_texts = [];
    let button_down;
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
          if (button_down) {
              return;
          }
          button_down = true;
          train_on(class_index, info_text);
      });
      button.addEventListener('touchstart', function () {
          if (button_down) {
              return;
          }
          button_down = true;
          train_on(class_index, info_text);
      });
      button.addEventListener('mouseup',    function () {
          button_down = false;
          train_off(class_index, info_text);
      });
      button.addEventListener('touchend',   function () {
          button_down = false;
          train_off(class_index, info_text);
      });
    }
    return info_texts;
}

function create_return_to_snap_button(innerHTML, append_to_element_with_this_id) {
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
    if (append_to_element_with_this_id) {
        document.getElementById(append_to_element_with_this_id).appendChild(return_to_snap_button);
    } else {
        document.body.appendChild(return_to_snap_button);
    }
}

function create_save_training_button(source_name, tensors_getter, training_class_names_getter, innerHTML) {
    let save_training_button = document.createElement('button');
    if (!innerHTML) {
        innerHTML = "Save your training (to load later using the 'Load " + source_name + " training data ...' block)";
    }
    save_training_button.innerHTML = innerHTML;
    save_training_button.className = "save-training-button";
    save_training_button.title = "Clicking this will save the training you have done. " +
                                 "To restore the training use a 'load " + source_name + " training data ...' block.";
    let save_training = function () {
        // based upon https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
        let tensors = tensors_getter();
        // tried using JSON.stringify but arrays became "0":xxx, "1":xxx, ...
        // also needed to move tensors from GPU using dataSync
        let json = '{"saved_' + source_name + '_training":{';
        let keys = Object.keys(tensors);
        const jsonify_tensor = (tensor) => {
            let flat_array = tensor.dataSync();
            let shape = tensor.shape;
            json += '{"shape":' + JSON.stringify(shape) + ',' +
                     '"data":' + JSON.stringify(Object.values(flat_array)) + '}';
        };
        keys.forEach(function (key, index) {
            json += '"' + key + '":[';
            let tensor_or_array_of_tensors = tensors[key];
            if (tensor_or_array_of_tensors instanceof Array) {
                json += '[';
                tensor_or_array_of_tensors.forEach((tensor, index) => {
                    jsonify_tensor(tensor);
                    if (index < tensor_or_array_of_tensors.length-1) { // except for last one
                        json += ',';
                    }
                });
                json += ']';
            } else {
                jsonify_tensor(tensor_or_array_of_tensors);
            }
            if (index === keys.length-1) {
                json += ']'; // no comma on the last one
            } else {
                json += '],';
            }
        });
        json += '},';
        let introduction = document.getElementById("introduction");
        if (introduction.getAttribute("updated")) {
            json += '"html":"' + encodeURIComponent(introduction.innerHTML) + '",';
        }
        json += '"labels":' + JSON.stringify(training_class_names_getter());
        json += '}';
        let data_URL = "data:text/json;charset=utf-8," + encodeURIComponent(json);
        let anchor = document.createElement('a');
        anchor.setAttribute("href", data_URL);
        anchor.setAttribute("download", "saved_training.json");
        document.body.appendChild(anchor); // required for firefox -- still true???
        anchor.click();
        anchor.remove();
    }
    save_training_button.addEventListener('click', save_training);
    document.body.appendChild(save_training_button);
}

function string_to_data_set(source_name, data_set_string) {
    const start = '{"saved_' + source_name + '_training":';
    if (data_set_string.substring(0, start.length) === start) {
        try {
            return JSON.parse(data_set_string);
        } catch (error) {
            alert("Error parsing saved training file: " + error);
        } 
    } else {
        alert("File not saved training.");
    }
}

function load_data_set(source_name, data_set, dataset_updater) {
    const restore_tensor = (shape_and_data) => tf.tensor(shape_and_data.data, shape_and_data.shape);
    try {
        let tensor_data_set = {};
        Object.entries(data_set['saved_' + source_name + '_training']).forEach(function (entry) {
            if (entry[1][0] instanceof Array) {
                if (typeof entry[1][0][0] === 'number') {
                   // is an array of numbers -- old format file
                   tensor_data_set[entry[0]] = tf.tensor2d(entry[1]);
                } else {
                   tensor_data_set[entry[0]] = entry[1][0].map(restore_tensor);
                }
            } else {
                tensor_data_set[entry[0]] = restore_tensor(entry[1][0]);
            }
        });
        dataset_updater(tensor_data_set);
        return true;
    } catch (error) {
        alert("Error loading saved training: " + error);
    }
}

// tell Snap! this is loaded
window.addEventListener('DOMContentLoaded', 
                        function (event) {
                            window.addEventListener('message', function (event) {
                                if (event.data === 'Show support iframe') {
                                    let children = document.body.children;
                                    Array.from(children).forEach(function (child) {
                                        child.style.opacity = 1;
                                    });
                                    window.postMessage('restart', "*");             
                                }
                            });
                            if (window.opener) {
                                window.opener.postMessage("Loaded", "*");
                            } else {
                                window.parent.postMessage("Loaded", "*");
                            }
                        },
                        false);