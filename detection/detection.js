 /**
 * Implements JavaScript functions that extend Snap! to access coco-ssd, the object detection model in the machine learning library tensorflow.js
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict";

// using https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd

let models = {mobilenet_v2: false,
              lite_mobilenet_v2: false};

let queued_events = [];

const respond_to_message = (event) => {
    const image_data = event.data.detect_objects.image_data;
    const options = event.data.detect_objects.options;
    const base = which_base(options);
    models[base].detect(image_data,
                        +options['maximum number of objects'] || 20,
                        +options['minimum confidence score'] || 0.5)
    .then((detections) => {
        event.source.postMessage({detection_response: detections,
                                  time_stamp: event.data.detect_objects.time_stamp},
                                 "*");
    }); 
};

const which_base = 
    // base: Controls the base cnn model, can be 'mobilenet_v1', 'mobilenet_v2' or 'lite_mobilenet_v2'.
    // 'mobilenet_v1' not used since others are better (I think)
    // lite_mobilenet_v2 is smallest in size, and fastest in inference speed. 
    // mobilenet_v2 has the highest classification accuracy.  
    (options) =>
         typeof options === 'object' && options["load smaller, faster, but less accurate model"] ? 'lite_mobilenet_v2' : 'mobilenet_v2';

// listen for requests for object detection
const respond_to_messages =
    (event) => {              
        if (typeof event.data.detect_objects !== 'undefined') {
            const options = event.data.detect_objects.options;
            const base = which_base(options);
            if (typeof models[base] === 'object') {
                respond_to_message(event);
            } else if (models[base] === 'loading') {
                queued_events.push(event);    
            } else {
                models[base] = 'loading';               
                cocoSsd.load({base})
                .then((model) => { 
                    models[base] = model;
                    respond_to_message(event);
                    queued_events.map(respond_to_message);
                    queued_events = [];
                });
            }  
        };
};

window.addEventListener('DOMContentLoaded', 
                        () => {
                            window.addEventListener("message", 
                                                    (event) => {
                                                        try {
                                                            respond_to_messages(event);
                                                        } catch(error) {
                                                            console.log(error);
                                                            event.source.postMessage({detection_failed: true,
                                                                                      error_message: error.message}, "*"); 
                                                        }
                                                    });
                            window.parent.postMessage("Ready", "*");
                        });
