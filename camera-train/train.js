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

// This file was copied and modified by Ken Kahn <toontalk@gmail.com> as part of the eCraft2Learn project

// import {KNNImageClassifier} from 'deeplearn-knn-image-classifier';
// import {NDArrayMathGPU, Array3D, ENV}from 'deeplearn';

// Number of classes to classify
var NUM_CLASSES = 3; // default
// Webcam Image size. Must be 227. 
const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;

const TOGETHER_JS = window.location.search.indexOf('together') >= 0;

var trainer;

let create_canvas = function () {
    let canvas = document.createElement('canvas');
    canvas.width  = IMAGE_SIZE;
    canvas.height = IMAGE_SIZE;
    return canvas;
};

let copy_video_to_canvas = function (video, canvas) {
    canvas.getContext('2d').drawImage(video, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
};

let load_image = function (image_url, callback) {
    let image = document.createElement('img');
    image.src = image_url;
    image.width  = IMAGE_SIZE;
    image.height = IMAGE_SIZE;
    image.onload = function () {
        callback(image);
    };
};

let add_image_to_training = function (image_url, label_index, post_to_tab) {
//     let hash = sha256(image_url + label_index);
//     if (hashes_of_images_added.indexOf(hash) >= 0) {
//         return;
//     }
//     hashes_of_images_added.push(hash);
    load_image(image_url,
               function (image) {
                   let image_as_Array3D = dl.fromPixels(image);
                   trainer.knn.addImage(image_as_Array3D, label_index);
                   response = trainer.knn.getClassExampleCount()[label_index];
                   if (post_to_tab) {
                       post_to_tab.postMessage({confirmation: response}, "*");
                   }
                   image_as_Array3D.dispose();
               });
};

// // hash copied from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
// let hex = function hex(buffer) {
//   var hexCodes = [];
//   var view = new DataView(buffer);
//   for (var i = 0; i < view.byteLength; i += 4) {
//     // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
//     var value = view.getUint32(i)
//     // toString(16) will give the hex representation of the number without padding
//     var stringValue = value.toString(16)
//     // We use concatenation and slice for padding
//     var padding = '00000000'
//     var paddedValue = (padding + stringValue).slice(-padding.length)
//     hexCodes.push(paddedValue);
//   };
// };

// let sha256 = function sha256(str) {
//   // We transform the string into an arraybuffer.
//   var buffer = new TextEncoder("utf-8").encode(str);
//   return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
//     return hex(hash);
//   });
// };

// let hashes_of_images_added = [];

class Main {
  constructor(training_class_names, source) {
    if (training_class_names) {
        NUM_CLASSES = training_class_names.length;
    } else {
        training_class_names = ["1", "2", "3"];
    }      
    // Initiate variables
    this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;
    this.training_class_names = training_class_names;
    
    // Initiate deeplearn.js math and knn classifier objects
    this.knn = new knn_image_classifier.KNNImageClassifier(NUM_CLASSES, TOPK);
    
    // Create video element that will contain the webcam image
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('playsinline', '');
    this.log_timings = window.location.hash.includes("log-timings");

    // listen for requests for predictions
    window.addEventListener("message",
                            function (event) {                       
                                if (typeof event.data.predict !== 'undefined') {
//                                  this.stop(); // done training -- might do more training later
//                                  no need to stop this since only runs when not hidden
                                    if (this.knn.getNumExamples() === 0) {
                                        event.source.postMessage({error: "Cannot make any predictions before training. " + 
                                                                         "Try this again after doing some training."},
                                                                 "*");
                                        return;
                                    }
                                    var image_url = event.data.predict;
                                    load_image(image_url,
                                               function (image) {
                                                  var canvas = create_canvas();
                                                  copy_video_to_canvas(image, canvas);
                                                  var image_as_Array3D = dl.fromPixels(canvas);
                                                  if (this.log_timings) {
                                                      console.time("Prediction - requested by message");
                                                  }
                                                  this.knn.predictClass(image_as_Array3D).then(
                                                      function (results) {
                                                          if (this.log_timings) {
                                                              console.timeEnd("Prediction - requested by message");
                                                          }
                                                          event.source.postMessage({confidences: results.confidences}, "*");
                                                          if (this.log_timings) {
                                                              console.log(results.confidences, "confidences posted");
                                                          }
                                                          image_as_Array3D.dispose();
                                                      }.bind(this));          
                                                }.bind(this));
                                } else if (typeof event.data.train !== 'undefined') {
                                    var image_url = event.data.train;
                                    var label_index = this.training_class_names.indexOf(event.data.label);
                                    var response;
                                    if (label_index < 0) {
                                        response = "Error: " + event.data.label + " is not one of " + this.training_class_names;
                                        event.source.postMessage({confirmation: response}, "*");
                                    } else {
                                        if (TOGETHER_JS) {
                                            TogetherJS.send({type:        'add_image_to_training',
                                                             image_url:   image_url,
                                                             label_index: label_index});
                                        }
                                        add_image_to_training(image_url, label_index, event.source);
                                    }
                                    
                                }
                            }.bind(this),
                            false);
    
    // Add video element to DOM
    document.body.appendChild(this.video);   
    
    // Setup webcam
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.width  = IMAGE_SIZE;
      this.video.height = IMAGE_SIZE;

      this.video.addEventListener('playing', ()=> this.videoPlaying = true);
      this.video.addEventListener('paused',  ()=> this.videoPlaying = false);
    })
    
    // Load knn model
    this.knn.load()
    .then(() => {this.start();
                 source.postMessage("Ready", "*");
    }); 
  }
  
  start(){
    if (this.timer) {
        this.stop();
    }
//  this.video.play(); // this caused an error on Android because it wasn't directly caused by a user action
//  Create training buttons and info texts 
    var train_on  = (i) => this.training = i;
    var train_off = (i) => this.training = -1;
    this.infoTexts = create_training_buttons(this.training_class_names, train_on, train_off); 
    create_return_to_snap_button(); 
    var please_wait = document.getElementById("please-wait");
    if (!please_wait.getAttribute("updated")) {
        please_wait.innerHTML = "<p>Ready to start training. Just hold down one of the buttons when the desired image is front of the camera. " +
                                "Do this until the system is sufficiently confident of the correct label when a new image is presented. " +
                                "Then return to the Snap! tab.</p>" +
                                "<p>Don't worry, we aren't sending any of your images to a remote server. " +
                                "All the machine learning is being done " +
                                "locally on device, and you can check out our source code on Github.</p>";
    }
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }
  
  stop() {
    this.video.pause();
    cancelAnimationFrame(this.timer);
    this.timer = undefined; // so don't restart multiple times
  }

  restart() {
    if (!this.timer) {
        this.video.play();
        this.timer = requestAnimationFrame(this.animate.bind(this));
    }
  }
  
  animate() {
    if (this.videoPlaying) {
      // Get image data from video element
      const image = dl.fromPixels(this.video);
      
      // Train class if one of the buttons is held down
      if (this.training != -1) {
        // Add current image to classifier
        if (this.log_timings) {
            console.time("Training " + this.training);
        }
        if (TOGETHER_JS) {
            let canvas = create_canvas();
            copy_video_to_canvas(trainer.video, canvas);
            let image_url = canvas.toDataURL('image/png');
            TogetherJS.send({type:        'add_image_to_training',
                             image_url:   image_url,
                             label_index: this.training});
        }
        this.knn.addImage(image, this.training);
        if (this.log_timings) {
            console.timeEnd("Training " + this.training);
        }
        this.infoTexts[this.training].innerHTML = 
            `&nbsp;&nbsp;&nbsp;${this.knn.getClassExampleCount()[this.training]} examples`;
      }
      
      // If any examples have been added, run predict
      const exampleCount = this.knn.getClassExampleCount();
      if (Math.max(...exampleCount) > 0 && this.training === -1) {
        // only predict if not also training (important for slow computers (and Android phones))
        if (this.log_timings) {
          console.time("Prediction");
        }
        this.knn.predictClass(image)
        .then((res)=>{
          if (this.log_timings) {
            console.timeEnd("Prediction");
          }
          for(let i=0;i<NUM_CLASSES; i++){
            // Make the predicted class bold
            if(res.classIndex == i){
              this.infoTexts[i].style.fontWeight = 'bold';
            } else {
              this.infoTexts[i].style.fontWeight = 'normal';
            }
            // Update info text
            if(exampleCount[i] > 0){
              this.infoTexts[i].innerHTML = 
                `&nbsp;&nbsp;&nbsp;${exampleCount[i]} <span class="notranslate" translate=no>examples</span> - ${Math.round(res.confidences[i]*100)}%`
            }
          }
        })
        // Dispose image when done
        .then(()=> image.dispose())
      } else {
        image.dispose()
      }
    }
    this.timer = requestAnimationFrame(this.animate.bind(this));
    window.addEventListener("message",
                            function (event) {
                                if (event.data === 'stop') {
                                    this.stop();
                                } else if (event.data === 'restart') {
                                    this.restart();
                                }
                            }.bind(this),
                            false);
  }
}

window.addEventListener("message",
                        function (event) {
                            if (typeof event.data.training_class_names !== 'undefined') {
                                // receive class names
                                trainer = new Main(event.data.training_class_names, event.source);
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
                                                             labels: trainer.training_class_names});
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
                                            if (!trainer) {
                                                trainer = new Main(message.labels, event.source);
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