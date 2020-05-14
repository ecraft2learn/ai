 /**
 * Implements JavaScript functions that extend Snap! to access AI cloud services and the machine learning library tensorflow.js
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict";

const convert_color_mapping = (color_mapping) => {
    if (!Array.isArray(color_mapping)) {
        // if no valid color_mappings provided then default rainbow is used
        color_mapping = undefined; // not specified
    }
    if (color_mapping) {
        if (typeof color_mapping[0][0] === 'string') {
            // remove body part names
            color_mapping = color_mapping.map((mapping) => mapping[1]);
        };
        color_mapping = color_mapping.slice(1); // eCraft2Learn starts with the color for not a body part
    }
    return color_mapping;
};

let segmenter;

// listen for requests for segmentations and poses
const respond_to_messages =
    async (event) => {              
        if (typeof event.data.segmentation_and_pose !== 'undefined') {
            const image_data = event.data.segmentation_and_pose.image_data;
            const options = event.data.segmentation_and_pose.options;
            const config = options && options.config;
            const segmentation = await segmenter.segmentPersonParts(image_data, config);
            let color_mapping = convert_color_mapping(options["color mappings"]);
            if (options["create segmentation costume"]) {
                segmentation.mask = bodyPix.toColoredPartMask(segmentation, color_mapping);
            }
            event.source.postMessage({segmentation_response: segmentation,
                                      time_stamp: event.data.segmentation_and_pose.time_stamp}, "*");
        } else if (typeof event.data.segmentations_and_poses !== 'undefined') {
            const image_data = event.data.segmentations_and_poses.image_data;
            const options = event.data.segmentations_and_poses.options;
            const config = options && options.config;
            const segmentations = await segmenter.segmentMultiPersonParts(image_data, config);
            let color_mapping = convert_color_mapping(options["color mappings"]);
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
            event.source.postMessage({segmentation_response: segmentations,
                                      time_stamp: event.data.segmentations_and_poses.time_stamp}, "*");
        };
};

window.addEventListener('DOMContentLoaded', 
                        () => {
                            window.addEventListener("message", respond_to_messages);
                            bodyPix.load().then((model) => {
                                segmenter = model;
                                window.parent.postMessage("Ready", "*");
                            });
                        });
