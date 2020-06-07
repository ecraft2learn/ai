 /**
 * Implements JavaScript functions that extend Snap! to access coco-ssd, the object detection model in the machine learning library tensorflow.js
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict";

let detector;

// listen for requests for object detection
const respond_to_messages =
    async (event) => {              
        if (typeof event.data.detect_objects !== 'undefined') {
            const image_data = event.data.detect_objects.image_data;
            const options = event.data.detect_objects.options;
            detector.detect(image_data,
                            +options['maximum number of objects'] || 20,
                            +options['minimum score'] || 0.5)
            .then((detections) => {
                event.source.postMessage({detection_response: detections,
                                          time_stamp: event.data.detect_objects.time_stamp}, "*");
            });     
        };
};

window.addEventListener('DOMContentLoaded', 
                        () => {
                            window.addEventListener("message", 
                                                    (event) => {
                                                        const error_handler = (error) => {
                                                            console.log(error);
                                                            event.source.postMessage({detection_failed: true,
                                                                                      error_message: error.message}, "*");
                                                        };
                                                        respond_to_messages(event).then().catch(error_handler);
                                                    });
                            cocoSsd.load({base: 'mobilenet_v2'}).then((model) => { // come back to this so message can specify options
                                // mobilenet_v2 is the most accurate but is slower - but maybe OK for typical uses?
                                detector = model;
                                window.parent.postMessage("Ready", "*");
                            });
                        });
