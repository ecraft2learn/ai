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

class Main {
  constructor(training_class_names){
    if (training_class_names) {
        NUM_CLASSES = training_class_names.length;
    } else {
        training_class_names = ["1", "2", "3"];
    }
    // Initiate variables
    this.infoTexts = [];
    this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;
    this.training_class_names = training_class_names;
    
    // Initiate deeplearn.js math and knn classifier objects
    this.knn = new knn_image_classifier.KNNImageClassifier(NUM_CLASSES, TOPK, ENV.math);
    
    // Create video element that will contain the webcam image
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('playsinline', '');

    // listen for requests for predictions
    window.addEventListener("message",
                            function (event) {
                                if (typeof event.data.predict !== 'undefined') {
//                                  this.stop(); // done training
                                    var image_url = event.data.predict;
                                    var image = document.createElement('img');
                                    var canvas = document.createElement('canvas');
                                    canvas.width = IMAGE_SIZE;
                                    canvas.height = IMAGE_SIZE;
                                    image.src = image_url;
                                    image.width = IMAGE_SIZE;
                                    image.height = IMAGE_SIZE;
                                    image.onload = function () {
                                      canvas.getContext('2d').drawImage(image, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
//                                       this.video.pause();
                                      var image_as_Array3D = dl.Array3D.fromPixels(canvas);
                                      this.knn.predictClass(image_as_Array3D).then(
                                          function (results) {
                                              event.source.postMessage(results.confidences, "*");
                                              console.log(results.confidences, "confidences posted");
//                                               this.video.play();
                                              image_as_Array3D.dispose();
                                          }.bind(this));          
                                    }.bind(this);
                                }
                            }.bind(this),
                            false);
    
    // Add video element to DOM
    document.body.appendChild(this.video);   
    
    // Setup webcam
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.width = IMAGE_SIZE;
      this.video.height = IMAGE_SIZE;

      this.video.addEventListener('playing', ()=> this.videoPlaying = true);
      this.video.addEventListener('paused', ()=> this.videoPlaying = false);
    })
    
    // Load knn model
    this.knn.load()
    .then(() => this.start()); 
  }
  
  start(){
    if (this.timer) {
      this.stop();
    }
//     this.video.play(); // this caused an error on Android because it wasn't directly caused by a user action
        // Create training buttons and info texts    
    for(let i=0;i<NUM_CLASSES; i++){
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.style.marginBottom = '10px';

      // Create training button
      const button = document.createElement('button')
      button.innerText = "Train " + this.training_class_names[i];
      div.appendChild(button);

      // Listen for mouse events when clicking the button
      button.addEventListener('mousedown', () => this.training = i);
      button.addEventListener('mouseup', () => this.training = -1);
      
      // Create info text
      const infoText = document.createElement('span')
      infoText.innerText = " No examples added";
      div.appendChild(infoText);
      this.infoTexts.push(infoText);
    }
    var please_wait = document.getElementById("please-wait");
    please_wait.innerText = "Ready to start training. Just hold down one of the buttons when the desired image is front of the camera. " +
                            "Do this until the system is sufficiently confident of the correct label when a new image is presented. " +
                            "Then return to the Snap! tab.";

    this.timer = requestAnimationFrame(this.animate.bind(this));
  }
  
  stop(){
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }
  
  animate(){
    if(this.videoPlaying){
      // Get image data from video element
      const image = dl.Array3D.fromPixels(this.video);
      
      // Train class if one of the buttons is held down
      if(this.training != -1){
        // Add current image to classifier
        this.knn.addImage(image, this.training);
      }
      
      // If any examples have been added, run predict
      const exampleCount = this.knn.getClassExampleCount();
      if(Math.max(...exampleCount) > 0){
        this.knn.predictClass(image)
        .then((res)=>{
          for(let i=0;i<NUM_CLASSES; i++){
            // Make the predicted class bold
            if(res.classIndex == i){
              this.infoTexts[i].style.fontWeight = 'bold';
            } else {
              this.infoTexts[i].style.fontWeight = 'normal';
            }

            // Update info text
            if(exampleCount[i] > 0){
              this.infoTexts[i].innerText = ` ${exampleCount[i]} examples - ${res.confidences[i]*100}%`
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
  }
}

// receive class names
window.addEventListener("message",
                        function (event) {
                            if (typeof event.data.training_class_names !== 'undefined') {
                                new Main(event.data.training_class_names);
                                event.source.postMessage("Ready", "*");
                            }
                        },
                        false);

// tell Snap! this is loaded
window.addEventListener('load', 
                        function (event) {
                            window.opener.postMessage("Loaded", "*");
                        },
                        false);