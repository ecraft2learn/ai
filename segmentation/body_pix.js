 /**
 * Implements JavaScript functions that extend Snap! to use the bodyPix model in the machine learning library tensorflow.js
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict";

// based upon https://github.com/tensorflow/tfjs-models/tree/master/body-pix


const configs = {
    //ResNet (larger, slower, more accurate)
    ResNet50: {architecture: 'ResNet50',
               outputStride: 32,
               quantBytes: 2},
    //MobileNet (smaller, faster, less accurate)
    MobileNetV1: {architecture: 'MobileNetV1',
                  outputStride: 16,
                  multiplier: 0.75,
                  quantBytes: 2}
};

let models = {ResNet50: false,
              MobileNetV1: false};

let queued_events = [];

const respond_to_message = async (event) => {
    const image_data = event.data.segmentations_and_poses.image_data;
    const options = event.data.segmentations_and_poses.options;
    const config = options.config;
    const base = which_base(options);
    let color_mapping = options["color mappings"];
    if (!Array.isArray(color_mapping)) {
        // if no valid color_mappings provided then default rainbow is used
        color_mapping = undefined; // not specified
     }
     let segmentations; // could be singular if !multi_person
     if (event.data.segmentations_and_poses.multi_person) {
         segmentations = await models[base].segmentMultiPersonParts(image_data, config);
         if (options["create segmentation costume"]) {
             const mask = bodyPix.toColoredPartMask(segmentations, color_mapping);
             segmentations.forEach((segmentation) => {
                 segmentation.mask = mask; // they all share the same mask
             });
         }
         if (options["create person bitmasks"]) {
             const person_segmentations = await models[base].segmentMultiPerson(image_data, config);
             segmentations.forEach((segmentation, index) => {
                 segmentation["person bitmap"] = person_segmentations[index].data;  
             });
         }                
     } else {
         segmentations = await models[base].segmentPersonParts(image_data, config);
         if (options["create segmentation costume"]) {
             segmentations.mask = bodyPix.toColoredPartMask(segmentations, color_mapping);
         }
     }
     event.source.postMessage({segmentation_response: segmentations,
                               time_stamp: event.data.segmentations_and_poses.time_stamp}, "*");
};

const which_base = 
    (options) =>
         typeof options === 'object' && options["load smaller, faster, but less accurate model"] ? 'MobileNetV1' : 'ResNet50';

// listen for requests for segmentations and poses
const respond_to_messages =
    async (event) => {              
        if (typeof event.data.segmentations_and_poses !== 'undefined') {
            const options = event.data.segmentations_and_poses.options;
            const base = which_base(options);
            if (typeof models[base] === 'object') {
                respond_to_message(event);
            } else if (models[base] === 'loading') {
                queued_events.push(event);    
            } else {
                models[base] = 'loading';   
                bodyPix.load(configs[base]).then((model) => { 
                    models[base] = model;
                    respond_to_message(event);
                    queued_events.map(respond_to_message);
                    queued_events = [];
                });
            }
        }          
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
                             window.parent.postMessage("Ready", "*");
                        });
