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

const urls = {MediaPipeFaceDetector: ['https://cdn.jsdelivr.net/npm/@tensorflow-models/face-detection'],
              MediaPipeFaceMesh: ['https://cdn.jsdelivr.net/npm/@tensorflow-models/face-detection',
                                  'https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection'],
              MediaPipeHands: ['https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection'],
              MoveNet: ['https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection'],
              PoseNet: ['https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection'],
              BlazePose: ['https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection'],
              ARPortraitDepth: ['https://cdn.jsdelivr.net/npm/@tensorflow-models/body-segmentation',
                                'https://cdn.jsdelivr.net/npm/@tensorflow-models/depth-estimation']};

const estimator = {MediaPipeFaceDetector:  'estimateFaces',
                   MediaPipeFaceMesh:      'estimateFaces',
                   MediaPipeHands:         'estimateHands',
                   MoveNet:                'estimatePoses',
                   PoseNet:                'estimatePoses',
                   BlazePose:              'estimatePoses',
                   ARPortraitDepth:        'estimateDepth'};

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
    } else if (model_name === 'ARPortraitDepth') {
        detector_creator = depthEstimation;
    } else {
        error_handler(new Error('"model name" option given to "poses and landmarks" ' + model_name + ' is not supported.'));
        return;
    }
    model = detector_creator.SupportedModels[model_name];
    if (!model) {
        error_handler(new Error(options['model name'] + ' model not found'));
        return;
    }
    if (model_name === 'ARPortraitDepth') {
        detector_creator.createEstimator(model, options)
                .then(callback)
                .catch(error_handler); 
    } else {
        detector_creator.createDetector(model, options)
                .then(callback)
                .catch(error_handler);        
    }
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

// caused strange errors and isn't that important to use video element directly
// const get_video = async (event) => {
//     const video_elements = event.source.parent.document.getElementsByTagName('video');
//     if (video_elements.length > 0) {
//         return video_elements[0];
//     } else {
//         const video_element = document.createElement('video');
//         document.body.appendChild(video_element);
//         const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
//         video_element.srcObject = stream;
//         video_element.play();
//         return video_element;
//     }
// };

const respond_to_message = async (event, error_handler) => {
    const {image_data, options, time_stamp} = event.data.poses_and_landmarks;
    // if (!(image_data instanceof ImageData)) {
    //     image_data = await get_video(event);
    // }
    const model_name = options['model name'];
    const detector_id = model_name + '.' + get_model_type(options);
    const config = model_name === 'ARPortraitDepth' ? {minDepth: 0, maxDepth: 1} : undefined;
    detectors[detector_id][estimator[model_name]](image_data, config)
        .then(response => {
            if (model_name === 'ARPortraitDepth') {
                response.toArray() // response is a depth object
                    .then((array) => {
                              event.source.postMessage({poses_and_landmarks_response: array,
                                                        time_stamp}, "*");
                        });
            } else {
                event.source.postMessage({poses_and_landmarks_response: response,
                                         time_stamp}, "*");
            }
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
