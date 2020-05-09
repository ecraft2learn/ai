 /**
 * Implements JavaScript functions that extend Snap! to access AI cloud services and the machine learning library tensorflow.js
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict";

let segmenter;
      
const load_image = (image_url, callback) => {
    let image = document.createElement('img');
    image.src = image_url;
    image.onload = function () {
        callback(image);
    };
};                

// listen for requests for segmentations and poses
const respond_to_messages =
    (event) => {              
        if (typeof event.data.segmentations_and_poses !== 'undefined') {
            const image_url = event.data.segmentations_and_poses.image_url;
            const config = event.data.segmentations_and_poses.config;
            // timestamp?? 
            const when_image_loaded =
                async (image) => {
                    const segmentation = 
                        await segmenter.segmentMultiPersonParts(image, config);
                     event.source.postMessage({segmentation_response: segmentation,
                                               time_stamp: event.data.segmentations_and_poses.time_stamp}, "*");
                 };
             load_image(image_url, when_image_loaded);
        }
    };

window.addEventListener('DOMContentLoaded', 
                        () => {
                            window.addEventListener("message", respond_to_messages);
                            bodyPix.load().then((model) => {
                                segmenter = model;
                                window.parent.postMessage("Ready", "*");
                            });
                        });
