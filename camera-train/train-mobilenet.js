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
    let image = document.createElement('img');
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

/**
 * Kicks off the demo by loading the knn model, finding and loading
 * available camera devices, and setting off the animate function.
 */
async function bindPage(incoming_training_class_names, source) {
    if (incoming_training_class_names) {
        NUM_CLASSES = incoming_training_class_names.length;
        training_class_names = incoming_training_class_names;
    } else {
        training_class_names = ["1", "2", "3"];
    }
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
}

function start() {
    if (timer) {
        stop();
    }
//  video.play(); // this caused an error on Android because it wasn't directly caused by a user action
//  Create training buttons and info texts 
    let train_on  = (i) => training = i;
    let train_off = (i) => training = -1;
    infoTexts = create_training_buttons(training_class_names, train_on, train_off); 
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
  
function stop() {
    video.pause();
    cancelAnimationFrame(timer);
    timer = undefined; // so don't restart multiple times
}

function restart() {
    if (!timer) {
        video.play();
        timer = requestAnimationFrame(animate);
    }
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // listen for requests for predictions
    window.addEventListener('message',
                            function (event) {                       
                                if (typeof event.data.predict !== 'undefined') {
                                    let example_count = classifier.getClassExampleCount();
                                    if (example_count[0] === 0) {
                                        event.source.postMessage({error: "Cannot make any predictions before training. " + 
                                                                         "Try this again after doing some training."},
                                                                 "*");
                                        return;
                                    }
                                    var image_url = event.data.predict;
                                    load_image(image_url,
                                               function (image) {
                                                  let canvas = create_canvas();
                                                  copy_video_to_canvas(image, canvas);
                                                  var image_as_tensor = tf.fromPixels(canvas);
                                                  logits = infer(image_as_tensor);
                                                  classifier.predictClass(logits, TOPK).then(
                                                      function (results) {
                                                          event.source.postMessage({confidences: Object.values(results.confidences)}, "*");
                                                          image_as_tensor.dispose();
                                                          logits.dispose();
                                                      });          
                                                });
                                } else if (typeof event.data.train !== 'undefined') {
                                    var image_url = event.data.train;
                                    var label_index = training_class_names.indexOf(event.data.label);
                                    var response;
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
                                    var please_wait = document.getElementById("please-wait");
                                    please_wait.innerHTML = event.data.new_introduction;
                                    please_wait.setAttribute("updated", true);
                                }
                             },
                             false);

// tell Snap! this is loaded
window.addEventListener('DOMContentLoaded', 
                        function (event) {
                            if (window.opener) {
                                // if collaboratively training only one has a Snap! window (just now)
                                window.opener.postMessage("Loaded", "*");
                            }
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