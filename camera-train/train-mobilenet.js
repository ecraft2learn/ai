// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// This file was originally copied and modified from the squeezenet KNN boiler plate example 
// and then updated to use mobilenet and tensorflow.js based upon 
// https://github.com/tensorflow/tfjs-models/tree/master/knn-classifier/demo
// by Ken Kahn <toontalk@gmail.com> as part of the eCraft2Learn project

// commented out since index.html loads these with script tags
// import * as mobilenetModule from '@tensorflow-models/mobilenet';
// import * as tf from '@tensorflow/tfjs';
// import Stats from 'stats.js'; // MISSING???

// import * as knnClassifier from '../src/index';

const videoWidth = 300;
const videoHeight = 250;
// const stats = new Stats();

// Number of classes to classify
let NUM_CLASSES = 3; // default
let training_class_names;

// K value for KNN
const TOPK = 10;

const TOGETHER_JS = window.location.search.indexOf('together') >= 0;

let infoTexts = [];
let training = -1;
let classifier;
let mobilenet_model;
let video;
let timer;

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width = videoWidth;
  video.height = videoHeight;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: mobile ? undefined : videoWidth,
      height: mobile ? undefined : videoHeight,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

const create_canvas = function () {
    let canvas = document.createElement('canvas');
    canvas.width  = videoWidth;
    canvas.height = videoHeight;
    return canvas;
};

const copy_video_to_canvas = function (video, canvas) {
    canvas.getContext('2d').drawImage(video, 0, 0, videoWidth, videoHeight);
};

const load_image = function (image_url, callback) {
    let image = new Image(); // document.createElement('img');
    image.src = image_url;
    image.width  = videoWidth;
    image.height = videoHeight;
    image.onload = function () {
        callback(image);
    };
};

// 'conv_preds' is the logits activation of MobileNet.
const infer = (image) => mobilenet_model.infer(image, 'conv_preds');

/**
 * Sets up a frames per second panel on the top-left of the window
 */
// function setupFPS() {
//   stats.showPanel(0);  // 0: fps, 1: ms, 2: mb, 3+: custom
//   document.body.appendChild(stats.dom);
// }

/**
 * Animation function called on each frame, running prediction
 */
async function animate() {
//   stats.begin();
  if (stopped) {
      return;
  }
  // Get image data from video element
  const image = tf.fromPixels(video);
  let logits;

  // Train class if one of the buttons is held down
  if (training != -1) {
    logits = infer(image);
    // Add current image to classifier
    classifier.addExample(logits, training);
      
    if (TOGETHER_JS) {
        let canvas = create_canvas();
        copy_video_to_canvas(video, canvas);
        let image_url = canvas.toDataURL('image/png');
        TogetherJS.send({type:        'add_image_to_training',
                         image_url:   image_url,
                         label_index: training});
    }
    infoTexts[training].innerHTML = 
        `&nbsp;&nbsp;&nbsp;${classifier.getClassExampleCount()[training]} examples`;
  }
      
   // If any examples have been added, run predict
   const exampleCount = classifier.getClassExampleCount();
   if (exampleCount[0] > 0 && training === -1) {
        // only predict if not also training (important for slow computers (and Android phones))
        // checking that at least the first class has some examples is sufficent
        logits = infer(image);
        let result = await classifier.predictClass(logits, TOPK);
        for (let i=0; i<NUM_CLASSES; i++) {
            // Make the predicted class bold
            if (result.classIndex == i){
              infoTexts[i].style.fontWeight = 'bold';
            } else {
              infoTexts[i].style.fontWeight = 'normal';
            }
            // Update info text
            if (exampleCount[i] > 0){
              infoTexts[i].innerHTML = 
                `&nbsp;&nbsp;&nbsp;${exampleCount[i]} <span class="notranslate" translate=no>examples</span> - ${Math.round(result.confidences[i]*100)}%`
            }
        }
   }
   image.dispose();
   if (logits != null) {
       logits.dispose();
    }

//   stats.end();

  requestAnimationFrame(animate);
}

const set_class_names = function (class_names) {
    if (class_names) {
        NUM_CLASSES = class_names.length;
        training_class_names = class_names;
    } else {
        training_class_names = ["1", "2", "3"];
    }
};

/**
 * Kicks off the demo by loading the knn model, finding and loading
 * available camera devices, and setting off the animate function.
 */
async function bindPage(incoming_training_class_names, source) {
  set_class_names(incoming_training_class_names);
  classifier = knnClassifier.create();
  mobilenet_model = await mobilenet.load(); // was mobilenetModule

  document.getElementById('main').style.display = 'block';

  // Setup the GUI
//   setupGui();
//   setupFPS();

  // Setup the camera
  try {
    video = await setupCamera();
    video.play();
  } catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this browser does not support video capture,' +
        'or this device does not have a camera';
    info.style.display = 'block';
    throw e;
  }

  start();
  source.postMessage("Ready", "*");
}

const create_save_training_button = function (innerHTML) {
    var save_training_button = document.createElement('button');
    if (!innerHTML) {
        innerHTML = "Save your training";
    }
    save_training_button.innerHTML = innerHTML;
    save_training_button.className = "save-training-button";
    save_training_button.title = "Clicking this will save the training you have done. " +
                                 "To restore the training use a 'load training data ...' block.";
    let save_training = function () {
      // based upon https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
        let tensors = classifier.getClassifierDataset();
        // tried using JSON.stringify but arrays became "0":xxx, "1":xxx, ...
        // also needed to move tensors from GPU using dataSync
//         let arrays = {};
//         Object.keys(tensors).forEach(function (key, index) {
//             arrays[key] = tensors[key].dataSync(); // move from GPU to normal memory
//         });
        let json = '{"saved_camera_training":{';
        let keys = Object.keys(tensors);
        keys.forEach(function (key, index) {
            json += '"' + key + '":[';
            let flat_array = tensors[key].dataSync();
            let shape = tensors[key].shape;
            let row_count = shape[0];
            let row_width = shape[1];
            for (let row = 0; row < row_count; row++) {
                json += '[' + flat_array.slice(row*row_width, (row+1)*row_width) + ']';
                if (row < row_count-1) { // not last one
                    json += ',';
                }
            }
            if (index === keys.length-1) {
                json += ']'; // no comma on the last one
            } else {
                json += '],';
            }
        });
        json += '},';
        let please_wait = document.getElementById("please-wait");
        if (please_wait.getAttribute("updated")) {
            json += '"html":"' + encodeURIComponent(please_wait.innerHTML) + '",';
        }
        json += '"labels":' + JSON.stringify(training_class_names);
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
};

const string_to_data_set = function (data_set_string) {
    const start = '{"saved_camera_training":';
    if (data_set_string.substring(0, start.length) === start) {
        try {
            return JSON.parse(data_set_string);
        } catch (error) {
            alert("Error parsing saved training file: " + error);
        } 
    } else {
        alert("File not saved training.");
    }
};

const load_data_set = function (data_set) {
    try {
        let tensor_data_set = {};
        Object.entries(data_set.saved_camera_training).forEach(function (entry) {
            tensor_data_set[entry[0]] = tf.tensor2d(entry[1]);
        });
        classifier.setClassifierDataset(tensor_data_set);
        return true;
    } catch (error) {
        alert("Error loading saved training: " + error);
    }
};

const load_data_set_file = function (file) {
    let reader = new FileReader();
    reader.onloadend = function () {
        let data_set = string_to_data_set(reader.result);
        load_data_set(data_set);
    };
    reader.readAsText(file);
};

const receive_drop = function (event) {
  // following based on https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
  // Prevent default behavior (Prevent file from being opened)
  event.preventDefault();

  let file;
  if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          file = event.dataTransfer.items[i].getAsFile();
          break;
        }
      }
  } else {
      // Use DataTransfer interface to access the file(s)
      file = event.dataTransfer.files[0].name;
  }

  load_data_set_file(file); 
  
};

function start() {
    if (timer) {
        stop();
    }
//  video.play(); // this caused an error on Android because it wasn't directly caused by a user action
//  Create training buttons and info texts 
    let train_on  = (i) => training = i;
    let train_off = (i) => training = -1;
    infoTexts = create_training_buttons(training_class_names, train_on, train_off); 
    create_save_training_button();
    create_return_to_snap_button();
    let please_wait = document.getElementById("please-wait");
    if (!please_wait.getAttribute("updated")) {
        please_wait.innerHTML = "<p>Ready to start training. Just hold down one of the buttons when the desired image is front of the camera. " +
                                "Do this until the system is sufficiently confident of the correct label when a new image is presented. " +
                                "Then return to the Snap! tab.</p>" +
                                "<p>Don't worry, we aren't sending any of your images to a remote server. " +
                                "All the machine learning is being done " +
                                "locally on device, and you can check out our source code on Github.</p>";
    }
    timer = requestAnimationFrame(animate);
}

let stopped = false;
  
function stop() {
    stopped = true;
    video.pause();
    cancelAnimationFrame(timer);
    timer = undefined; // so don't restart multiple times
}

function restart() {
    stopped = false;
    // video may be undefined because it is being created
    if (!timer && video) {
        video.play();
        timer = requestAnimationFrame(animate);
    }
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// listen for requests for predictions

const listen_for_messages = function (event) {
    let update_introduction = function (new_introduction) {
        let please_wait = document.getElementById("please-wait");
        please_wait.innerHTML = new_introduction;
        please_wait.setAttribute("updated", true);
    };                      
    if (typeof event.data.predict !== 'undefined') {
        let example_count = classifier.getClassExampleCount();
        if (example_count[0] === 0) {
            event.source.postMessage({error: "Cannot make any predictions before training. " + 
                                             "Try this again after doing some training."},
                                      "*");
            return;
        }
        let image_url = event.data.predict;
        load_image(image_url,
                   function (image) {
                       let canvas = create_canvas();
                       copy_video_to_canvas(image, canvas);
                       let image_as_tensor = tf.fromPixels(canvas);
                       logits = infer(image_as_tensor);
                       classifier.predictClass(logits, TOPK).then(
                           function (results) {
                               event.source.postMessage({confidences: Object.values(results.confidences)}, "*");
                               image_as_tensor.dispose();
                               logits.dispose();
                       });          
        });
    } else if (typeof event.data.train !== 'undefined') {
        let image_url = event.data.train;
        let label_index = training_class_names.indexOf(event.data.label);
        let response;
        if (label_index < 0) {
            response = "Error: " + event.data.label + " is not one of " + training_class_names;
            event.source.postMessage({confirmation: response}, "*");
        } else {
            if (TOGETHER_JS) {
                TogetherJS.send({type:        'add_image_to_training',
                                 image_url:   image_url,
                                 label_index: label_index});
            }
            add_image_to_training(image_url, label_index, event.source);
         }
    } else if (event.data === 'stop') {
        stop();
    } else if (event.data === 'restart') {
        restart();   
    } else if (typeof event.data.training_class_names !== 'undefined') {
        // receive class names
        bindPage(event.data.training_class_names, event.source);
    } else if (typeof event.data.new_introduction !== 'undefined') {
        // update HTML of the page with custom introduction
        update_introduction(event.data.new_introduction);
    } else if (typeof event.data.training_data !== 'undefined') {
        let data_set = string_to_data_set(event.data.training_data);
        if (data_set) {
            if (data_set.labels) {
                if (training_class_names) {
                    set_class_names(data_set.labels);
                } else {
                    bindPage(data_set.labels, event.source);
                }
            }
            if (data_set.html) {
                let introduction = decodeURIComponent(data_set.html);
                update_introduction(introduction);
            }
            if (load_data_set(data_set)) {
                // pass back training_class_names since Snap! doesn't know them
                event.source.postMessage({data_set_loaded: training_class_names}, "*");
            }
        }
    }
};

window.addEventListener('message', listen_for_messages, false);
// tell Snap! this is loaded
window.addEventListener('DOMContentLoaded', 
                        function (event) {
                            if (window.opener) {
                                // if collaboratively training only one has a Snap! window (just now)
                                window.opener.postMessage("Loaded", "*");
                            }
                            // following used to use addEventListener but Snap!'s drop listener interfered
                            // ecraft2learn.support_iframe['training using camera']
                            window.parent.document.body.ondrop = receive_drop;
                            if (TOGETHER_JS) {
                                // for production add window.TogetherJSConfig_ignoreMessages = true;
                                TogetherJSConfig_dontShowClicks = true;
                                // following made the interface less confusing but didn't invite the other either
//                              TogetherJSConfig_suppressInvite = true;
                                let script = document.createElement('script');
                                script.src = "https://togetherjs.com/togetherjs-min.js";
                                let add_together_listeners = function () {
                                    let send_labels =
                                        function (message) {
                                            if (!message.sameUrl) {
                                                return;
                                            }
                                            TogetherJS.send({type: 'training_labels',
                                                             labels: training_class_names});
                                        };
                                    let remove_button =
                                        function () {
                                            let collaboration_button = document.getElementById('collaboration_button');
                                            if (collaboration_button) {
                                                collaboration_button.style.display = 'none';
                                            }                                                
                                         };
                                    let share_together_url = 
                                        function() {
                                            if (window.opener) {
                                                window.opener.postMessage({together_url: TogetherJS.shareUrl()}, "*");
                                            }
                                        };
                                    let receive_labels = 
                                        function (message) {
                                            if (!timer) {
                                               bindPage(message.labels, event.source);
                                            }   
                                        };
                                    let receive_image_url =
                                        function (message) {
                                            add_image_to_training(message.image_url,
                                                                  message.label_index);
                                        };
                                    TogetherJS.hub.on("togetherjs.hello",           send_labels);
                                    TogetherJS.hub.on('togetherjs.hello-back',      remove_button);
                                    TogetherJS.hub.on('togetherjs.init-connection', share_together_url);
                                    TogetherJS.hub.on('training_labels',            receive_labels);
                                    TogetherJS.hub.on('add_image_to_training',      receive_image_url);
//                                     toggle_together_js(); // somehow this caused messages to be received twice
                                }
                                script.addEventListener('load', add_together_listeners);
                                document.head.appendChild(script);
                                let collaboration_button = document.createElement('button');
                                let running = typeof TogetherJS !== 'undefined' && TogetherJS.running;
                                let label_collaboration_button = function () {
                                    if (running) {
                                        collaboration_button.innerHTML = "Stop collaborating";
                                    } else {
                                        collaboration_button.innerHTML = "Get URL for collaboration";
                                    }
                                };
                                label_collaboration_button();
                                collaboration_button.id = 'collaboration_button';
                                collaboration_button.className = "together_button";
                                let toggle_together_js = function () {
                                    TogetherJS(collaboration_button);
                                    running = !running;
                                    label_collaboration_button();
                                }
                                collaboration_button.title = 
                                    "Clicking this will turn on or off collaborative training with others.";
                                collaboration_button.addEventListener('click',      toggle_together_js);
                                collaboration_button.addEventListener('touchstart', toggle_together_js);
                                document.body.insertBefore(collaboration_button, document.body.firstChild);
                            }
                        },
                        false);