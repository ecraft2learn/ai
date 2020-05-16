 /**
 * Implements JavaScript functions that extend Snap! to access AI cloud services and the machine learning library tensorflow.js
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict";

let segmenter;

// listen for requests for segmentations and poses
const respond_to_messages =
    async (event) => {              
        if (typeof event.data.segmentations_and_poses !== 'undefined') {
            const image_data = event.data.segmentations_and_poses.image_data;
            const options = event.data.segmentations_and_poses.options;
            const config = options && options.config;
            let color_mapping = options["color mappings"];
            if (!Array.isArray(color_mapping)) {
                // if no valid color_mappings provided then default rainbow is used
                color_mapping = undefined; // not specified
            }
            let segmentations; // could be singular if !multi_person
            if (event.data.segmentations_and_poses.multi_person) {
                segmentations = await segmenter.segmentMultiPersonParts(image_data, config);
                if (options["create segmentation costume"]) {
                    const mask = bodyPix.toColoredPartMask(segmentations, color_mapping);
                    segmentations.forEach((segmentation) => {
                        segmentation.mask = mask; // they all share the same mask
                    });
                }
                if (options["create person bitmasks"]) {
                    const person_segmentations = await segmenter.segmentMultiPerson(image_data, config);
                    segmentations.forEach((segmentation, index) => {
                        segmentation["person bitmap"] = person_segmentations[index].data;  
                    });
                }                
            } else {
                segmentations = await segmenter.segmentPersonParts(image_data, config);
                if (options["create segmentation costume"]) {
                    segmentations.mask = bodyPix.toColoredPartMask(segmentations, color_mapping);
                }
            }
            event.source.postMessage({segmentation_response: segmentations,
                                      time_stamp: event.data.segmentations_and_poses.time_stamp}, "*");
        };
};

window.addEventListener('DOMContentLoaded', 
                        () => {
                            window.addEventListener("message", 
                                                    (event) => {
                                                        const error_handler = (error) => {
                                                            console.log(error);
                                                            event.source.postMessage({segmentation_failed: true,
                                                                                      error_message: error.message}, "*");
                                                        };
                                                        respond_to_messages(event).then().catch(error_handler);
                                                    });
                            bodyPix.load().then((model) => {
                                segmenter = model;
                                window.parent.postMessage("Ready", "*");
                            });
                        });
