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
            const options = event.data.segmentations_and_poses.options;
            const config = options && options.config;
            const when_image_loaded =
                async (image) => {
                    console.time("segmentation");
                    const segmentations = await segmenter.segmentMultiPersonParts(image, config);
                    console.timeLog("segmentation");
                    let color_mappings = options["color mappings"];
                    let color_mapping;
                    if (color_mappings) {
                        color_mappings = color_mappings.map((color_mapping) => {
                            if (typeof color_mapping[0][0] === 'string') {
                                // remove body part names
                                return color_mapping.map((mapping) => mapping[1]);
                            } else {
                                return color_mapping;
                            }
                        });
                    }
                    if (options["create costume"]) {
                        if (color_mappings && color_mappings.length > 1) {
                            // each segmentation (i.e. person) has a different color mapping
                            segmentations.forEach((segmentation, index) => {
                                segmentations[index].mask = bodyPix.toColoredPartMask(segmentations, color_mappings[index].slice(1));
                            });
                        } else {
                            const color_mapping = color_mappings && color_mappings[0].slice(1); // .map((rgba) => rgba.slice(0, 3));
                            // if no color_mappings then default rainbow is used
                            const mask = bodyPix.toColoredPartMask(segmentations, color_mapping);
                            segmentations.forEach((segmentation) => {
                                segmentation.mask = mask; // they all share the same mask
                            });
                        }
                        console.timeLog("segmentation");
                    } else if (color_mappings) {
                        segmentations.forEach((segmentation, index) => {
                            color_mapping = color_mappings.length > 1 ? color_mappings[index] : color_mappings[0];
                            segmentation.pixels = [];
                            segmentation.data.forEach((part_id) => {
                                segmentation.pixels.push(color_mapping[part_id+1]); // +1 since -1 is "no body part"
                            });
                            console.timeLog("segmentation");
                        });
                    }
                    console.timeEnd("segmentation");
                    event.source.postMessage({segmentation_response: segmentations,
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
