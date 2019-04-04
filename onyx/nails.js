// This file was originally copied and modified from the squeezenet KNN boiler plate example 
// and then updated to use mobilenet and tensorflow.js based upon 
// https://github.com/tensorflow/tfjs-models/tree/master/knn-classifier/demo
// by Ken Kahn <toontalk@gmail.com> as part of the eCraft2Learn project

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

const VIDEO_WIDTH  = 224;
const VIDEO_HEIGHT = 224;

const images = {
"normal": [
"images/normal/Fingernail healthy Image_1a.jpg",
"images/normal/Fingernail healthy Image_1b.jpg",
"images/normal/Fingernail healthy Image_1c.jpg",
"images/normal/Fingernail healthy Image_1d.jpg",
"images/normal/Fingernail healthy Image_10a.jpg",
"images/normal/Fingernail healthy Image_10b.jpg",
"images/normal/Fingernail healthy Image_10c.jpg",
"images/normal/Fingernail healthy Image_10d.jpg",
"images/normal/Fingernail healthy Image_12a.jpg",
"images/normal/Fingernail healthy Image_12b.jpg",
"images/normal/Fingernail healthy Image_12c.jpg",
"images/normal/Fingernail healthy Image_12d.jpg",
"images/normal/Fingernail healthy Image_13.png",
"images/normal/Fingernail healthy Image_14a.png",
"images/normal/Fingernail healthy Image_14b.png",
"images/normal/Fingernail healthy Image_14c.png",
"images/normal/Fingernail healthy Image_14d.png",
"images/normal/Fingernail healthy Image_15a.png",
"images/normal/Fingernail healthy Image_15b.png",
"images/normal/Fingernail healthy Image_15c.png",
"images/normal/Fingernail healthy Image_17a.png",
"images/normal/Fingernail healthy Image_17b.png",
"images/normal/Fingernail healthy Image_17c.png",
"images/normal/Fingernail healthy Image_17d.png",
"images/normal/Fingernail healthy Image_18a.png",
"images/normal/Fingernail healthy Image_18b.png",
"images/normal/Fingernail healthy Image_18c.png",
"images/normal/Fingernail healthy Image_18d.png",
"images/normal/Fingernail healthy Image_18e.png",
"images/normal/Fingernail healthy Image_19a.png",
"images/normal/Fingernail healthy Image_19b.png",
"images/normal/Fingernail healthy Image_19c.png",
"images/normal/Fingernail healthy Image_19d.png",
"images/normal/Fingernail healthy Image_19e.png",
"images/normal/Fingernail healthy Image_2a.png",
"images/normal/Fingernail healthy Image_2b.png",
"images/normal/Fingernail healthy Image_2d.png",
"images/normal/Fingernail healthy Image_2d.png",
"images/normal/Fingernail healthy Image_20a.jpg",
"images/normal/Fingernail healthy Image_20b.jpg",
"images/normal/Fingernail healthy Image_20c.jpg",
"images/normal/Fingernail healthy Image_20d.jpg",
"images/normal/Fingernail healthy Image_3a.png",
"images/normal/Fingernail healthy Image_3b.png",
"images/normal/Fingernail healthy Image_3c.png",
"images/normal/Fingernail healthy Image_4a.png",
"images/normal/Fingernail healthy Image_4b.png",
"images/normal/Fingernail healthy Image_4c.png",
"images/normal/Fingernail healthy Image_4d.png",
"images/normal/Fingernail healthy Image_5a.jpg",
"images/normal/Fingernail healthy Image_5b.jpg",
"images/normal/Fingernail healthy Image_5c.jpg",
"images/normal/Fingernail healthy Image_6a.png",
"images/normal/Fingernail healthy Image_6b.png",
"images/normal/Fingernail healthy Image_6c.png",
"images/normal/Fingernail healthy Image_6d.png",
"images/normal/Fingernail healthy Image_7a.png",
"images/normal/Fingernail healthy Image_7b.png",
"images/normal/Fingernail healthy Image_7c.png",
"images/normal/Fingernail healthy Image_7d.png",
"images/normal/Fingernail healthy Image_8a.png",
"images/normal/Fingernail healthy Image_8b.png",
"images/normal/Fingernail healthy Image_8c.png",
"images/normal/Fingernail healthy Image_8d.png",
"images/normal/Fingernail healthy Image_9a.png",
"images/normal/Fingernail healthy Image_9b.png",
"images/normal/Fingernail healthy Image_9c.png",
"images/normal/Fingernail healthy Image_9d.png"
],
"fungal infection": [
"images/fungal-nails/nail-fungus-1a-600px.jpg",
"images/fungal-nails/nail-fungus-1b-600px.jpg",
"images/fungal-nails/nail-fungus-2-600px.jpg",
"images/fungal-nails/Slide1.PNG",
"images/fungal-nails/Slide10.PNG",
"images/fungal-nails/Slide11.PNG",
"images/fungal-nails/Slide12.PNG",
"images/fungal-nails/Slide13.PNG",
"images/fungal-nails/Slide14.PNG",
"images/fungal-nails/Slide15a.png",
"images/fungal-nails/Slide15b.png",
"images/fungal-nails/Slide18.PNG",
"images/fungal-nails/Slide19.PNG",
"images/fungal-nails/Slide2.PNG",
"images/fungal-nails/Slide20.PNG",
"images/fungal-nails/Slide21.PNG",
"images/fungal-nails/Slide22-1a.png",
"images/fungal-nails/Slide22-1b.png",
"images/fungal-nails/Slide22-1c.png",
"images/fungal-nails/Slide22-1d.png",
"images/fungal-nails/Slide22-2a.png",
"images/fungal-nails/Slide22-2b.png",
"images/fungal-nails/Slide22-2c.png",
"images/fungal-nails/Slide22-2d.png",
"images/fungal-nails/Slide22-3a.png",
"images/fungal-nails/Slide22-3b.png",
"images/fungal-nails/Slide22-3c.png",
"images/fungal-nails/Slide23.PNG",
"images/fungal-nails/Slide24.PNG",
"images/fungal-nails/Slide25a.png",
"images/fungal-nails/Slide25b.png",
"images/fungal-nails/Slide26.PNG",
"images/fungal-nails/Slide3.PNG",
"images/fungal-nails/Slide4.PNG",
"images/fungal-nails/Slide5.PNG",
"images/fungal-nails/Slide6.PNG",
"images/fungal-nails/Slide7.PNG",
"images/fungal-nails/Slide8.PNG",
"images/fungal-nails/Slide9.PNG"
],
"other": [
"images/other/architecture-1836070_960_720.jpg",
"images/other/cat-3336579_960_720.jpg",
"images/other/person-822681_960_720.jpg",
"images/other/tree-740901_960_720.jpg"
]
};

let class_names = Object.keys(images);

// K value for KNN - experiment with different values
const TOPK = 10;

// let info_texts = [];
// let training = -1;
let classifier;
let mobilenet_model;
let video;
let video_paused = false;

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
  video.width  = VIDEO_WIDTH;
  video.height = VIDEO_HEIGHT;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: mobile ? undefined : VIDEO_WIDTH,
      height: mobile ? undefined : VIDEO_HEIGHT,
    },
  });
  video.srcObject = stream;

  const toggle_freeze_button = document.getElementById('toggle video');
  toggle_freeze_button.addEventListener('click',
      (event) => {
          if (video_paused) {
              video.play();
              video_paused = false;
              toggle_freeze_button.innerHTML = "Freeze video";
              display_message("<b>Freeze the video before selecting the nail.</b>");
          } else {
              video.pause();
              video_paused = true;
              toggle_freeze_button.innerHTML = "Resume video";
              display_message("<b>Use the mouse to select a rectangle containing the nail.</b>");        
          }
      });
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

const load_image = function (image_url, callback) {
    let image = new Image();
    image.src = image_url;
    image.width  = VIDEO_WIDTH;
    image.height = VIDEO_HEIGHT;
    image.onload = function () {
        callback(image);
    };
};

const add_images = (when_finished) => {
    let label_index = 0;
    let label = class_names[label_index];
    let image_index = 0;
    const next_image = () => {
        let class_images = images[class_names[label_index]];
        if (image_index === class_images.length-1) {
            // no more images for this class 
            image_index = 0;
            label_index++;
            if (label_index === class_names.length) {
                // no more classes
                when_finished();
                return;
            }
        } else {
            image_index++;
        }
        add_image_to_training(class_images[image_index], label_index, next_image);
    };
    next_image();
};

const add_image_to_training = (image_url, label_index, continuation) => {
    load_image(image_url,
               (image) => {
                   logits = infer(image);
                   classifier.addExample(logits, label_index);
                   logits.dispose();
                   continuation();     
    });
};

// 'conv_preds' is the logits activation of MobileNet.
const infer = (image) => {
    if (!mobilenet_model) {
        load_mobilenet();
    }
    return mobilenet_model.infer(image, 'conv_preds');
};

// async function animate() {
  // Get image data from video element
//   const image = tf.browser.fromPixels(video);
//   let logits;

//   // Train class if one of the buttons is held down
//   if (training != -1) {
//     logits = infer(image);
//     // Add current image to classifier
//     classifier.addExample(logits, training);
//     info_texts[training].innerHTML = 
//         `&nbsp;&nbsp;&nbsp;${classifier.getClassExampleCount()[training]} examples`;
//   }
      
//    // If any examples have been added, run predict
//    const exampleCount = classifier.getClassExampleCount();
//    if (exampleCount[0] > 0 && training === -1 && mobilenet_model) { 
//         // only predict if not also training (important for slow computers (and Android phones))
//         // checking that at least the first class has some examples is sufficent
//         // don't do this if haven't yet loaded mobilenet_model
//         // note this shouldn't be running if stopped because returned to Snap!
//         logits = infer(image);
//         let result = await classifier.predictClass(logits, TOPK);
//         for (let i=0; i < class_names.length; i++) {
//             // Make the predicted class bold
//             if (result.classIndex == i){
//               info_texts[i].style.fontWeight = 'bold';
//             } else {
//               info_texts[i].style.fontWeight = 'normal';
//             }
//             // Update info text
//             if (exampleCount[i] > 0){
//               info_texts[i].innerHTML = 
//                 `&nbsp;&nbsp;&nbsp;${exampleCount[i]} <span class="notranslate" translate=no>examples</span> - ${Math.round(result.confidences[i]*100)}%`
//             }
//         }
//    }
//    image.dispose();
//    if (logits != null) {
//        logits.dispose();
//     }

//   requestAnimationFrame(animate);
// }

const load_mobilenet = async function () {
    classifier = knnClassifier.create();
    mobilenet_model = await mobilenet.load(); 
};

/**
 * Initialises by loading the knn model, finding and loading
 * available camera devices, and ...
 */
const initialise_page = async () => {
  // Setup the camera
  try {
    video = await setupCamera();
    video.play();
  } catch (e) {
    let info = document.getElementById('info');
    if (!info) {
        info = document.createElement('p');
        info.id = 'info';
        document.body.appendChild(info);
    }
    info.textContent = 'This browser does not support video capture, ' +
                       'lacks permission to use the camera, '
                       'or this device does not have a camera.';
    info.style.display = 'block';
    throw e;
  }
  add_images(() => {
      document.getElementById('please-wait').hidden = true;
      document.getElementById('introduction').hidden = false;
      document.getElementById('main').hidden = false;
      rectangle_selection();
  });
};

const display_message = (message) => {
    document.getElementById('response').innerHTML = message;
};
            
const rectangle_selection = () => {
    let rectangle = document.getElementById('selection-rectangle');
    let video_rectangle = document.getElementById('video').getBoundingClientRect();
    let start_x = 0;
    let start_y = 0;
    let end_x = 0;
    let end_y = 0;
    let video_left = video_rectangle.left;
    let video_right = video_left+video_rectangle.width;
    let video_top = video_rectangle.top;
    let video_bottom = video_top+video_rectangle.height;
    let update_selection = () => {
        if (!video_paused) {
            return;
        }
        let left   = Math.max(Math.min(start_x, end_x, video_right),  video_left);
        let right  = Math.min(Math.max(start_x, end_x, video_left),   video_right);
        let top    = Math.max(Math.min(start_y, end_y, video_bottom), video_top);
        let bottom = Math.min(Math.max(start_y, end_y, video_top),    video_bottom);
        rectangle.style.left   = left + 'px';
        rectangle.style.top    = top + 'px';
        rectangle.style.width  = right - left + 'px';
        rectangle.style.height = bottom - top + 'px';
    };
    onmousedown = (e) => {
        rectangle.hidden = false;
        start_x = e.clientX;
        start_y = e.clientY;
        update_selection();
    };
    onmousemove = (e) => {
        if (!rectangle.hidden) {
            end_x = e.clientX;
            end_y = e.clientY;
            update_selection();          
        }
    };
    onmouseup = async (e) => {
        if (!video_paused) {
            return;
        }
        const box = rectangle.getBoundingClientRect();
        if (box.width > 0 && box.height > 0) {
            console.log(box.width, box.height);
            let canvas = document.getElementById('canvas');
            canvas.width  = VIDEO_WIDTH;
            canvas.height = VIDEO_HEIGHT;
            canvas.getContext('2d').drawImage(video, 
                                              box.left-video_left,
                                              box.top-video_top,
                                              box.width,
                                              box.height,
                                              0,
                                              0,
                                              VIDEO_WIDTH,
                                              VIDEO_HEIGHT);
            const image = tf.browser.fromPixels(canvas);
            const logits = infer(image);
            const result = await classifier.predictClass(logits, TOPK);
            let message = "<b>Confidences: </b>";
            class_names.forEach((name, index) => {
                message += name + " = " + Math.round(100*result.confidences[index]) + "%; ";
            });
            display_message(message);
            rectangle.style.width  = "0px";
            rectangle.style.height = "0px";
            console.log(result);          
        }
        rectangle.hidden = true; 
    };
};

// const receive_drop = function (event) {
//   // following based on https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
//   // Prevent default behavior (Prevent file from being opened)
//   event.preventDefault();

//   let file;
//   if (event.dataTransfer.items) {
//       // Use DataTransferItemList interface to access the file(s)
//       for (let i = 0; i < event.dataTransfer.items.length; i++) {
//         // If dropped items aren't files, reject them
//         if (event.dataTransfer.items[i].kind === 'file') {
//           file = event.dataTransfer.items[i].getAsFile();
//           break;
//         }
//       }
//   } else {
//       // Use DataTransfer interface to access the file(s)
//       file = event.dataTransfer.files[0].name;
//   }

//   load_data_set_file(file); 
  
// };

// function start() {
// //  video.play(); // this caused an error on Android because it wasn't directly caused by a user action
//     timer = requestAnimationFrame(animate);
// }
  
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                 
//     if (typeof event.data.predict !== 'undefined') {
//         let example_count = classifier.getClassExampleCount();
//         if (!example_count[0]) { // includes undefined as well as 0
//             event.source.postMessage({error: "Cannot make any predictions before training. " + 
//                                              "Try this again after doing some training."},
//                                       "*");
//             return;
//         }
//         let image_url = event.data.predict;
//         load_image(image_url,
//                    function (image) {
//                        let canvas = create_canvas();
//                        copy_video_to_canvas(image, canvas);
//                        let image_as_tensor = tf.browser.fromPixels(canvas);
//                        logits = infer(image_as_tensor);
//                        classifier.predictClass(logits, TOPK).then(
//                            (results) => {
//                                event.source.postMessage({confidences: Object.values(results.confidences)}, "*");
//                                image_as_tensor.dispose();
//                                logits.dispose();
//                            },
//                            (error) => {
//                                event.source.postMessage({error: error.message}, "*");
//                            });
//         });
//     } else if (typeof event.data.train !== 'undefined') {
//         let image_url = event.data.train;
//         let label_index = class_names.indexOf(event.data.label);
//         let response;
//         if (label_index < 0) {
//             response = "Error: " + event.data.label + " is not one of " + class_names;
//             event.source.postMessage({confirmation: response}, "*");
//         } else {
//             add_image_to_training(image_url, label_index, event.source);
//          }
//     } else if (typeof event.data.get_image_features !== 'undefined') {
//         image_url_to_features_vector(event.data.get_image_features.URL, 
//                                      event.data.get_image_features.time_stamp,
//                                      event.source); 
//     } else if (typeof event.data.training_data !== 'undefined') {
//         let data_set = string_to_data_set('camera', event.data.training_data);
//         if (data_set) {
//             if (data_set.labels) {
//                 if (class_names) {
//                     set_class_names(data_set.labels);
//                 } else {
//                     initialise_page(data_set.labels, event.source);
//                 }
//             }
//             if (data_set.html) {
//                 let introduction = decodeURIComponent(data_set.html);
//                 update_introduction(introduction);
//             }
//             if (load_data_set('camera', data_set, classifier.setClassifierDataset.bind(classifier))) {
//                 // pass back class_names since Snap! doesn't know them
//                 event.source.postMessage({data_set_loaded: class_names}, "*");
//             }
//         }
//     }

window.addEventListener('DOMContentLoaded',
                        function (event) {
                            load_mobilenet().then(initialise_page);
                        },
                        false);