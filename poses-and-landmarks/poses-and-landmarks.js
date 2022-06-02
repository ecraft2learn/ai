 /**
 * Implements JavaScript functions that extend Snap! to use the body and hand pose models 
 * and the face landmark in the machine learning library tensorflow.js
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict";

// based upon 
// https://github.com/tensorflow/tfjs-models/tree/master/face-detection
// https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
// https://github.com/tensorflow/tfjs-models/tree/master/pose-detection

let detectors = {};
let queued_events = {};

const load_scripts = (urls, onload, onerror) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = urls[0];
    if (urls.length > 1) {
        script.onload = () => {
            load_scripts(urls.slice(1), onload, onerror);
        };
    } else {
        script.onload = onload;
        script.onerror = onerror;        
    }
    document.head.appendChild(script);
};

const urls = {MediaPipeFaceDetector: ['face-detection.js'],
              MediaPipeFaceMesh: ['face-detection.js', 'face-landmarks-detection.js'],
              MediaPipeHands: ['hand-pose-detection.js'],
              MoveNet: ['pose-detection.js'],
              PoseNet: ['pose-detection.js'],
              BlazePose: ['pose-detection.js']};

const estimator = {MediaPipeFaceDetector:  'estimateFaces',
                   MediaPipeFaceMesh:      'estimateFaces',
                   MediaPipeHands:         'estimateHands',
                   MoveNet:                'estimatePoses',
                   PoseNet:                'estimatePoses',
                   BlazePose:              'estimatePoses'};

const get_detector = (options, callback, error_handler) => {
    let model;
    let detector_creator;
    const model_name = options['model name'];
    if (!options.runtime) {
        options.runtime = 'tfjs';
    }
    if (model_name === 'MediaPipeFaceDetector') {
        detector_creator = faceDetection;
    } else if (model_name === 'MediaPipeFaceMesh') {
        detector_creator = faceLandmarksDetection;
    } else if (model_name === 'MediaPipeHands') {
        detector_creator = handPoseDetection;
    } else if (['MoveNet', 'PoseNet', 'BlazePose'].includes(model_name)) {
        detector_creator = poseDetection;
    } else {
        error_handler(new Error('"model name" option given to "poses and landmarks" ' + model_name + ' is not supported.'));
        return;
    }
    model = detector_creator.SupportedModels[model_name];
    if (!model) {
        error_handler(new Error(options['model name'] + ' model not found'));
        return;
    }
    detector_creator.createDetector(model, options)
        .then(detector => {
            callback(detector);
        })
        .catch(error_handler);
};

const get_model_type = (options) => {
    const model_type = options['modelType'];
    const model_name = options['model name'];
    if (model_type) {
        return model_type;
    }
    if (model_name === 'MoveNet') {
        return 'SinglePose.Lightning';
    } else {
        return 'full';
    }
}

// listen for requests for body and hand poses and face landmarks requests
const respond_to_messages = (event, error_handler) => {              
    if (typeof event.data.poses_and_landmarks !== 'undefined') {
        const options = event.data.poses_and_landmarks.options;
        const model_name = options['model name'];
        const detector_id = model_name + '.' + get_model_type(options);
        const scripts_loaded = () => {
            get_detector(options,
                         (detector) => {
                             detectors[detector_id] = detector;
                             event.source.postMessage({poses_and_landmarks_show_message: 'Model loaded.',
                                                       poses_and_landmarks_show_message_duration: 0.1},
                                                      '*');
                             detectors[model_name] = true;                                 
                             respond_to_message(event, error_handler);
                             queued_events[detector_id].map((event) => {
                                 respond_to_message(event, error_handler);
                             });
                             queued_events[detector_id] = [];
                         },
                         error_handler);
        };
        if (typeof detectors[detector_id] === 'object') {
            respond_to_message(event);
        } else if (detectors[detector_id] === 'loading') {
            if (!queued_events[detector_id]) {
                queued_events[detector_id] = [];
            }
            queued_events[detector_id].push(event);    
        } else {
            detectors[detector_id] = 'loading';
            event.source.postMessage({poses_and_landmarks_show_message: 'Loading model...'}, '*');
            if (detectors[model_name]) {
                scripts_loaded(); // scripts previously loaded but now modelType
            } else {
                load_scripts(urls[model_name], scripts_loaded);
            }
        }
    }          
};

const respond_to_message = async (event, error_handler) => {
    const {image_data, options, time_stamp} = event.data.poses_and_landmarks;
    const model_name = options['model name'];
    const detector_id = model_name + '.' + get_model_type(options);
    detectors[detector_id][estimator[model_name]](image_data)
        .then(response => {
            event.source.postMessage({poses_and_landmarks_response: response,
                                      time_stamp}, "*");
        })
        .catch(error_handler);
};

window.addEventListener('DOMContentLoaded', 
                        () => {
                            window.addEventListener("message", 
                                                    (event) => {
                                                        const error_handler = (error) => {
                                                            if (error.message === "Cannot read properties of undefined (reading 'map')") {
                                                                return; // spurious error from body pose detector
                                                            }
                                                            console.log(error);
                                                            event.source.postMessage({poses_and_landmarks_failed: true,
                                                                                      error_message: error.message}, "*");
                                                        };
                                                        respond_to_messages(event, error_handler);
                                                    });
                             window.parent.postMessage("Ready", "*");
                        });
