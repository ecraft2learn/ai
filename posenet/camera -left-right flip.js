/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licnses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

// based upon https://github.com/hpssjellis/beginner-tensorflowjs-examples-in-javascript/tree/master/tf-examples/posenet/camera

const maxVideoSize = 513;
const canvasSize = 400;
const stats = new Stats();

async function getCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(({kind}) => kind === 'videoinput');
}

let currentStream = null;

function stopCurrentVideoStream() {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => {
      track.stop();
    });
  }
}

function loadVideo(cameraId) {
  return new Promise((resolve, reject) => {
    stopCurrentVideoStream();

    const video = document.getElementById('video');

    video.width = maxVideoSize;
    video.height = maxVideoSize;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        video: {
          width: maxVideoSize,
          height: maxVideoSize,
          deviceId: {exact: cameraId},
        },
      }, handleVideo, videoError);
    }

    function handleVideo(stream) {
      currentStream = stream;
      video.srcObject = stream;

      resolve(video);
    }

    function videoError(e) {
      // do something
      reject(e);
    }
  });
}

const guiState = {
  algorithm: 'single-pose',
  input: {
    mobileNetArchitecture: '1.01',
    outputStride: 16,
    imageScaleFactor: 0.5,
  },
  singlePoseDetection: {
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5,
  },
  multiPoseDetection: {
    maxPoseDetections: 2,
    minPoseConfidence: 0.1,
    minPartConfidence: 0.3,
    nmsRadius: 20.0,
  },
  output: {
    showVideo: true,
    showSkeleton: true,
    showPoints: true,
  },
  net: null,
};

function setupGui(cameras, net) {
  guiState.net = net;

  if (cameras.length > 0) {
    guiState.camera = cameras[0].deviceId;
  }

  const cameraOptions = cameras.reduce((result, {label, deviceId}) => {
    result[label] = deviceId;
    return result;
  }, {});

  const gui = new dat.GUI({width: 300});

  gui.add(guiState, 'camera', cameraOptions).onChange((deviceId) => {
    loadVideo(deviceId);
  });
  const algorithmController = gui.add(
    guiState, 'algorithm', ['single-pose', 'multi-pose'] );

  let input = gui.addFolder('Input');
  const architectureController =
    input.add(guiState.input, 'mobileNetArchitecture', ['1.01', '1.00', '0.75', '0.50']);
  input.add(guiState.input, 'outputStride', [8, 16, 32]);
  input.add(guiState.input, 'imageScaleFactor').min(0.2).max(1.0);
  input.open();

  let single = gui.addFolder('Single Pose Detection');
  single.add(guiState.singlePoseDetection, 'minPoseConfidence', 0.0, 1.0);
  single.add(guiState.singlePoseDetection, 'minPartConfidence', 0.0, 1.0);
  single.open();

  let multi = gui.addFolder('Multi Pose Detection');
  multi.add(
    guiState.multiPoseDetection, 'maxPoseDetections').min(1).max(20).step(1);
  multi.add(guiState.multiPoseDetection, 'minPoseConfidence', 0.0, 1.0);
  multi.add(guiState.multiPoseDetection, 'minPartConfidence', 0.0, 1.0);
  multi.add(guiState.multiPoseDetection, 'nmsRadius').min(0.0).max(40.0);

  let output = gui.addFolder('Output');
  output.add(guiState.output, 'showVideo');
  output.add(guiState.output, 'showSkeleton');
  output.add(guiState.output, 'showPoints');
  output.open();


  architectureController.onChange(function(architecture) {
    guiState.changeToArchitecture = architecture;
  });

  algorithmController.onChange(function(value) {
    switch (guiState.algorithm) {
    case 'single-pose':
      multi.close();
      single.open();
      break;
    case 'multi-pose':
      single.close();
      multi.open();
      break;
    }
  });
}

function setupFPS() {
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  stats.dom.style.left = '200px'; // to avoid operlap with possible language translation element
  document.body.appendChild(stats.dom);
}

let first_time = true;
let timer = undefined;
let stopped = false;
let poseDetectionFrame; // at this scope so can easily restart

let stop = function stop() { 
    document.getElementById('video').pause();
    cancelAnimationFrame(timer);
    timer = undefined; // so don't restart multiple times
    stopped = true;
};

let restart = function restart() {
    if (stopped) {
        document.getElementById('video').play();
        timer = requestAnimationFrame(poseDetectionFrame);
        stopped = false;
    }
};

window.addEventListener("message",
                        function (event) {
                            if (event.data === 'stop') {
                                stop();
                            } else if (event.data === 'restart') {
                                restart();
                            }
                        });

function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');
  const flipHorizontal = false; // was true - see https://github.com/tensorflow/tfjs/issues/493#issuecomment-433513147

  canvas.width = canvasSize;
  canvas.height = canvasSize;

  poseDetectionFrame = async function poseDetectionFrame() {
    if (guiState.changeToArchitecture) {
      guiState.net.dispose();

      guiState.net = await posenet.load(Number(guiState.changeToArchitecture));

      guiState.changeToArchitecture = null;
    }

    stats.begin();

    const imageScaleFactor = guiState.input.imageScaleFactor;
    const outputStride = Number(guiState.input.outputStride);

    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;
    switch (guiState.algorithm) {
    case 'single-pose':
//    console.log("in loop output is " + document.getElementById('output'));
      const pose = await guiState.net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
      poses.push(pose);

      minPoseConfidence = Number(
        guiState.singlePoseDetection.minPoseConfidence);
      minPartConfidence = Number(
        guiState.singlePoseDetection.minPartConfidence);
      break;
    case 'multi-pose':
      poses = await guiState.net.estimateMultiplePoses(video, imageScaleFactor, flipHorizontal, outputStride,
        guiState.multiPoseDetection.maxPoseDetections,
        guiState.multiPoseDetection.minPartConfidence,
        guiState.multiPoseDetection.nmsRadius);

      minPoseConfidence = Number(guiState.multiPoseDetection.minPoseConfidence);
      minPartConfidence = Number(guiState.multiPoseDetection.minPartConfidence);
      break;
    }

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    if (guiState.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvasSize*-1, canvasSize);
      ctx.restore();
    }

    const scale = canvasSize / video.width;

    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (guiState.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, ctx, scale);
        }
        if (guiState.output.showSkeleton) {
          drawSkeleton(keypoints, minPartConfidence, ctx, scale);
        }
      }
    });

    stats.end();

    if (first_time) {
        window.parent.postMessage("Ready", "*");
        create_return_to_snap_button();
        first_time = false;
    }
    if (!stopped) {
       timer = requestAnimationFrame(poseDetectionFrame);
    } 
  }
  // poseDetectionFrame() can lead to Error: The DOM is not ready yet.
  const wait_for_output_canvas = function () {
      if (document.getElementById('output')) {
          setTimeout(function () {
              poseDetectionFrame();
              window.addEventListener("message", respond_to_messages);
              window.parent.postMessage("Loaded", "*");                          
           }, 
           1000); // delay reduces (eliminates?) the chance of Error: The DOM is not ready yet.
      } else {
          setTimeout(wait_for_output_canvas, 500); // wait for output canvas
      }
  };
  wait_for_output_canvas();
}

async function bindPage() {
  const net = await posenet.load();

  document.getElementById('loading').style.display = 'none';
  document.getElementById('main').style.display = 'block';

  const cameras = await getCameras();

  if (cameras.length === 0) {
    alert('No webcams available.  Reload the page when a webcam is available.');
    return;
  }

  const video = await loadVideo(cameras[0].deviceId);
  setupGui(cameras, net);
  setupFPS();
  detectPoseInRealTime(video, net);
}

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

// listen for requests for poses
const respond_to_messages =
    function (event) {
        const create_canvas = function () {
            let canvas = document.createElement('canvas');
            canvas.width  = canvasSize;
            canvas.height = canvasSize;
            return canvas;
        };
        const copy_video_to_canvas = function (video, canvas) {
            canvas.getContext('2d').drawImage(video, 0, 0, canvasSize, canvasSize);
        };
        const load_image = function (image_url, callback) {
            let image = document.createElement('img');
            image.src = image_url;
            image.width  = canvasSize;
            image.height = canvasSize;
            image.onload = function () {
                callback(image);
            };
        };                
        if (typeof event.data.compute_poses !== 'undefined') {
            const image_url = event.data.compute_poses;
            const compute_poses =
                async function (image) {
                    const canvas = create_canvas();
                    const flipHorizontal = false; // was true
                    copy_video_to_canvas(image, canvas);
                    const image_as_Array3D = tf.browser.fromPixels(canvas);
                    let poses = [];
                    document.getElementById('video').play();
                    switch (guiState.algorithm) {
                        case 'single-pose':
                            const pose = await guiState.net.estimateSinglePose(video, 
                                                                               guiState.input.imageScaleFactor,
                                                                               flipHorizontal,
                                                                               guiState.input.outputStride);
                            poses.push(pose);
                            break;
                         case 'multi-pose':
                            poses = await guiState.net.estimateMultiplePoses(video, 
                                                                             guiState.input.imageScaleFactor, 
                                                                             flipHorizontal, 
                                                                             guiState.input.outputStride,
                                                                             guiState.multiPoseDetection.maxPoseDetections,
                                                                             guiState.multiPoseDetection.minPartConfidence,
                                                                             guiState.multiPoseDetection.nmsRadius);
                            break;
                       }
                       event.source.postMessage({poses: poses}, "*");
                       image_as_Array3D.dispose();
                 };
             load_image(image_url, compute_poses);
//              window.removeEventListener("message", respond_to_messages);
        }
    };

// tell Snap! this is loaded
window.addEventListener('DOMContentLoaded', bindPage);

                            
