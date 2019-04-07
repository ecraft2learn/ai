// by Ken Kahn <toontalk@gmail.com> as part of the Onyx project at the University of Oxford
// copyright not yet determined but will be some sort of open source

const RUN_EXPERIMENTS = false;
// if tsv is defined then collect all the logits of each image into a TSV string (tab-separated values)
let tsv = "";
const CREATE_SPRITE_IMAGE = false;

const TOPK = 20; // number of nearest neighbours for KNN
const THRESHOLD = .65; // report statistics for for fraction that matches with less than this threshold

const VIDEO_WIDTH  = 224; // this version of MobileNet expects 224x224 images
const VIDEO_HEIGHT = 224;

const images = {
"normal": [
"images/normal/Fingernail healthy Image_1a.jpg",
"images/normal/Fingernail healthy Image_1b.jpg",
"images/normal/Fingernail healthy Image_1c.jpg",
"images/normal/Fingernail healthy Image_1d.jpg",
"images/normal/Fingernail healthy Image_10a.jpg",
"images/normal/Fingernail healthy Image_10b.jpg",
"images/normal/Fingernail healthy Image_10c.jpg",
"images/normal/Fingernail healthy Image_10d.jpg",
"images/normal/Fingernail healthy Image_12a.jpg",
"images/normal/Fingernail healthy Image_12b.jpg",
"images/normal/Fingernail healthy Image_12c.jpg",
"images/normal/Fingernail healthy Image_12d.jpg",
"images/normal/Fingernail healthy Image_13.png",
"images/normal/Fingernail healthy Image_14a.png",
"images/normal/Fingernail healthy Image_14b.png",
"images/normal/Fingernail healthy Image_14c.png",
"images/normal/Fingernail healthy Image_14d.png",
"images/normal/Fingernail healthy Image_15a.png",
"images/normal/Fingernail healthy Image_15b.png",
"images/normal/Fingernail healthy Image_15c.png",
"images/normal/Fingernail healthy Image_17a.png",
"images/normal/Fingernail healthy Image_17b.png",
"images/normal/Fingernail healthy Image_17c.png",
"images/normal/Fingernail healthy Image_17d.png",
"images/normal/Fingernail healthy Image_18a.png",
"images/normal/Fingernail healthy Image_18b.png",
"images/normal/Fingernail healthy Image_18c.png",
"images/normal/Fingernail healthy Image_18d.png",
"images/normal/Fingernail healthy Image_18e.png",
"images/normal/Fingernail healthy Image_19a.png",
"images/normal/Fingernail healthy Image_19b.png",
"images/normal/Fingernail healthy Image_19c.png",
"images/normal/Fingernail healthy Image_19d.png",
"images/normal/Fingernail healthy Image_19e.png",
"images/normal/Fingernail healthy Image_2a.png",
"images/normal/Fingernail healthy Image_2b.png",
"images/normal/Fingernail healthy Image_2d.png",
"images/normal/Fingernail healthy Image_2d.png",
"images/normal/Fingernail healthy Image_20a.jpg",
"images/normal/Fingernail healthy Image_20b.jpg",
"images/normal/Fingernail healthy Image_20c.jpg",
"images/normal/Fingernail healthy Image_20d.jpg",
"images/normal/Fingernail healthy Image_3a.png",
"images/normal/Fingernail healthy Image_3b.png",
"images/normal/Fingernail healthy Image_3c.png",
"images/normal/Fingernail healthy Image_4a.png",
"images/normal/Fingernail healthy Image_4b.png",
"images/normal/Fingernail healthy Image_4c.png",
"images/normal/Fingernail healthy Image_4d.png",
"images/normal/Fingernail healthy Image_5a.jpg",
"images/normal/Fingernail healthy Image_5b.jpg",
"images/normal/Fingernail healthy Image_5c.jpg",
"images/normal/Fingernail healthy Image_6a.png",
"images/normal/Fingernail healthy Image_6b.png",
"images/normal/Fingernail healthy Image_6c.png",
"images/normal/Fingernail healthy Image_6d.png",
"images/normal/Fingernail healthy Image_7a.png",
"images/normal/Fingernail healthy Image_7b.png",
"images/normal/Fingernail healthy Image_7c.png",
"images/normal/Fingernail healthy Image_7d.png",
"images/normal/Fingernail healthy Image_8a.png",
"images/normal/Fingernail healthy Image_8b.png",
"images/normal/Fingernail healthy Image_8c.png",
"images/normal/Fingernail healthy Image_8d.png",
"images/normal/Fingernail healthy Image_9a.png",
"images/normal/Fingernail healthy Image_9b.png",
"images/normal/Fingernail healthy Image_9c.png",
"images/normal/Fingernail healthy Image_9d.png"
],
"fungal infection": [
"images/fungal-nails/nail-fungus-1a-600px.jpg",
"images/fungal-nails/nail-fungus-1b-600px.jpg",
"images/fungal-nails/nail-fungus-2-600px.jpg",
"images/fungal-nails/Slide1.PNG",
"images/fungal-nails/Slide10.PNG",
"images/fungal-nails/Slide11.PNG",
"images/fungal-nails/Slide12.PNG",
"images/fungal-nails/Slide13.PNG",
"images/fungal-nails/Slide14.PNG",
"images/fungal-nails/Slide15a.png",
"images/fungal-nails/Slide15b.png",
"images/fungal-nails/Slide18.PNG",
"images/fungal-nails/Slide19.PNG",
"images/fungal-nails/Slide2.PNG",
"images/fungal-nails/Slide20.PNG",
"images/fungal-nails/Slide21.PNG",
"images/fungal-nails/Slide22-1a.png",
"images/fungal-nails/Slide22-1b.png",
"images/fungal-nails/Slide22-1c.png",
"images/fungal-nails/Slide22-1d.png",
"images/fungal-nails/Slide22-2a.png",
"images/fungal-nails/Slide22-2b.png",
"images/fungal-nails/Slide22-2c.png",
"images/fungal-nails/Slide22-2d.png",
"images/fungal-nails/Slide22-3a.png",
"images/fungal-nails/Slide22-3b.png",
"images/fungal-nails/Slide22-3c.png",
"images/fungal-nails/Slide23.PNG",
"images/fungal-nails/Slide25a.png",
"images/fungal-nails/Slide25b.png",
"images/fungal-nails/Slide26.PNG",
"images/fungal-nails/Slide3.PNG",
"images/fungal-nails/Slide4.PNG",
"images/fungal-nails/Slide5.PNG",
"images/fungal-nails/Slide6.PNG",
"images/fungal-nails/Slide7.PNG",
"images/fungal-nails/Slide8.PNG",
"images/fungal-nails/Slide9.PNG"
],
"other": [
"images/other/architecture-1836070_960_720.jpg",
"images/other/Bali 064.jpg",
"images/other/Bali 102.jpg",
"images/other/Bali 118.jpg",
"images/other/brown.png",
"images/other/cat-3336579_960_720.jpg",
"images/other/Fingernail healthy Image_10.jpg",
"images/other/Fingernail healthy Image_14.png",
"images/other/Fingernail healthy Image_15.png",
"images/other/Fingernail healthy Image_17.png",
"images/other/Fingernail healthy Image_19.png",
"images/other/Fingernail healthy Image_2.png",
"images/other/Fingernail healthy Image_8.png",
"images/other/Fingernail unhealthy Image_16.png",
"images/other/Fingernail unhealthy Image_17.png",
"images/other/Fingernail unhealthy Image_18.png",
"images/other/Fingernail unhealthy Image_19.png",
"images/other/Fingernail unhealthy Image_24.png",
"images/other/Fingernail unhealthy Image_25.png",
"images/other/Fingernail unhealthy Image_32.jpg",
"images/other/Fingernail unhealthy Image_35.jpg",
"images/other/Fingernail unhealthy Image_50.png",
"images/other/grass.jpg",
"images/other/hand_WIN_20190405_13_58_34_Pro.jpg",
"images/other/hong kong.jpg",
"images/other/person-822681_960_720.jpg",
"images/other/Slide22.PNG",
"images/other/small IMG_1990.JPG",
"images/other/snoopy.jpg",
"images/other/snow.jpg",
"images/other/tree-740901_960_720.jpg",
"images/other/white.png",
]
};

let class_names = Object.keys(images);

// let info_texts = [];
// let training = -1;
let classifier;
let mobilenet_model;
let video;

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width  = VIDEO_WIDTH;
  video.height = VIDEO_HEIGHT;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: mobile ? undefined : VIDEO_WIDTH,
      height: mobile ? undefined : VIDEO_HEIGHT,
    },
  });
  video.srcObject = stream;

  const toggle_freeze_button = document.getElementById('toggle video');
  toggle_freeze_button.addEventListener('click',
      (event) => {
          if (!video.paused && !video.hidden) {
              video.pause();
              toggle_freeze_button.innerHTML = "Resume video";
              display_message("<b>Use the mouse to select a rectangle containing the nail.</b>");        
          } else {
              if (video.hidden) {
                  video.hidden = false;
                  document.getElementById('canvas').hidden = true;
              }
              video.play();
              toggle_freeze_button.innerHTML = "Freeze video";
              display_message("<b>Freeze the video before selecting the nail.</b>");
          }
      });
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

const load_image = function (image_url, callback) {
    let image = new Image();
    image.src = image_url;
//     image.width  = VIDEO_WIDTH;
//     image.height = VIDEO_HEIGHT;
    image.onload = () => {
        callback(image);
    };
};

const add_images = (when_finished, just_one_class, only_class_index, except_image_index) => {
    let class_index = just_one_class ? only_class_index : 0;
    let label = class_names[class_index];
    let image_index = -1; // incremented to 0 soon
    const image_sprite_canvas = CREATE_SPRITE_IMAGE && create_sprite_image_canvas();
    if (image_sprite_canvas) {
        document.body.appendChild(image_sprite_canvas);
    }
    const next_image = () => {
        let class_images = images[class_names[class_index]];
        if (image_index === class_images.length-1) {
            // no more images for this class 
            image_index = 0;
            class_index++;
            if (class_index === class_names.length || (just_one_class && only_class_index)) {
                // no more classes
                when_finished();
                if (image_sprite_canvas) {
                    // can then save it 
                    document.write(image_sprite_canvas.toDataURL());
                }
                return;
            }
        } else {
            image_index++;
        }
        if (image_index !== except_image_index) {
            add_image_to_training(class_images[image_index], class_index, next_image);
            if (image_sprite_canvas) {
                add_image_to_sprite_image(class_images[image_index], image_sprite_canvas);
            }
        } else {
            next_image();
        }
    };
    next_image();
};

const predict_class = (image, callback) => {
    return tf.tidy(() => {
        const image_pixels = tf.browser.fromPixels(image);
        const logits = infer(image_pixels);
        classifier.predictClass(logits, TOPK).then((result) => {
//             console.log(tf.memory());
            callback(result);          
        });
    });
};

const add_image_to_training = (image_url, class_index, continuation) => {
    load_image(image_url,
               (image) => {
                   logits = infer(image);
                   if (tsv !== undefined) {
                       const embedding = logits.dataSync();
                       if (tsv === "") {
                           // need to add column headers
                           tsv += "URL\t";
                           embedding.forEach((datum, index) => {
                               tsv += index + "\t";
                           });
                           tsv += "\n";
                       }
                       tsv += save_logits_as_tsv(image_url, logits);
                   }
                   classifier.addExample(logits, class_index);
                   logits.dispose();
                   continuation();     
    });
};

// 'conv_preds' is the logits activation of MobileNet.
const infer = (image) => {
    if (!mobilenet_model) {
        load_mobilenet();
    }
    return mobilenet_model.infer(image, 'conv_preds');
};

// async function animate() {
  // Get image data from video element
//   const image = tf.browser.fromPixels(video);
//   let logits;

//   // Train class if one of the buttons is held down
//   if (training != -1) {
//     logits = infer(image);
//     // Add current image to classifier
//     classifier.addExample(logits, training);
//     info_texts[training].innerHTML = 
//         `&nbsp;&nbsp;&nbsp;${classifier.getClassExampleCount()[training]} examples`;
//   }
      
//    // If any examples have been added, run predict
//    const exampleCount = classifier.getClassExampleCount();
//    if (exampleCount[0] > 0 && training === -1 && mobilenet_model) { 
//         // only predict if not also training (important for slow computers (and Android phones))
//         // checking that at least the first class has some examples is sufficent
//         // don't do this if haven't yet loaded mobilenet_model
//         // note this shouldn't be running if stopped because returned to Snap!
//         logits = infer(image);
//         let result = await classifier.predictClass(logits, TOPK);
//         for (let i=0; i < class_names.length; i++) {
//             // Make the predicted class bold
//             if (result.classIndex == i){
//               info_texts[i].style.fontWeight = 'bold';
//             } else {
//               info_texts[i].style.fontWeight = 'normal';
//             }
//             // Update info text
//             if (exampleCount[i] > 0){
//               info_texts[i].innerHTML = 
//                 `&nbsp;&nbsp;&nbsp;${exampleCount[i]} <span class="notranslate" translate=no>examples</span> - ${Math.round(result.confidences[i]*100)}%`
//             }
//         }
//    }
//    image.dispose();
//    if (logits != null) {
//        logits.dispose();
//     }

//   requestAnimationFrame(animate);
// }

const load_mobilenet = async function () {
    classifier = knnClassifier.create();
    mobilenet_model = await mobilenet.load(); 
};

/**
 * Initialises by loading the knn model, finding and loading
 * available camera devices, loading the images, and initialising the interface
 */
const initialise_page = async () => {
    // Setup the camera
    try {
      video = await setupCamera();
      video.play();
    } catch (e) {
      let info = document.getElementById('info');
      if (!info) {
          info = document.createElement('p');
          info.id = 'info';
          document.body.appendChild(info);
      }
      info.textContent = 'This browser does not support video capture, ' +
                         'lacks permission to use the camera, '
                         'or this device does not have a camera.';
      info.style.display = 'block';
      throw e;
    }
    add_images(() => {
        if (tsv) {
            const text_area = document.createElement('textarea');
            text_area.value = tsv;
            document.body.appendChild(text_area);
            return;
        }
        document.getElementById('please-wait').hidden = true;
        document.getElementById('introduction').hidden = false;
        document.getElementById('main').hidden = false;
        rectangle_selection();
        document.addEventListener('drop',
                                  (event) => {
                                      receive_drop(event);
                                      document.body.style.backgroundColor = 'white';
                                  },
                                  false);
        document.addEventListener('dragenter', (event) => {
             event.preventDefault();
             document.body.style.backgroundColor = 'pink';
        });
        document.addEventListener('dragover', (event) => {
             event.preventDefault();
        });
        document.addEventListener('dragexit', (event) => {
             event.preventDefault();
             document.body.style.backgroundColor = 'white';
        });
        if (RUN_EXPERIMENTS) {
            run_experiments(THRESHOLD); // report any matches with confidence less than this confidence
        }
    });
};

const display_message = (message, append) => {
    if (append) {
        message = document.getElementById('response').innerHTML + "<br>" + message;
    }
    document.getElementById('response').innerHTML = message;
};

const confidences = (result) => {
    let message = "<b>Confidences: </b>";
    class_names.forEach((name, index) => {
        message += name + " = " + Math.round(100*result.confidences[index]) + "%; ";
    });
    return message;
};

const draw_maintaining_aspect_ratio = (source,
                                       canvas,
                                       destination_width,
                                       destination_height,
                                       source_x,
                                       source_y,
                                       source_width,
                                       source_height,
                                       x_offset,
                                       y_offset) => {
    if (typeof x_offset !== 'number') {
        x_offset = 0;
    }
    if (typeof y_offset !== 'number') {
        y_offset = 0;
    }
    const context = canvas.getContext('2d');
    let destination_x = 0;
    let destination_y = 0;
    const width_height_ratio = source_width/source_height;
    // if source doesn't have the same aspect ratio as the destination then
    // draw it centered without changing the aspect ratio
    if (width_height_ratio > 1) {
        const height_before_adjustment = destination_height;
        destination_height /= width_height_ratio;
        destination_y = (height_before_adjustment-destination_height)/2;
    } else if (width_height_ratio < 1) {
        const width_before_adjustment = destination_width;
        destination_width *= width_height_ratio;
        destination_x = (width_before_adjustment-destination_width)/2;
    }
    context.drawImage(source, 
                      source_x,
                      source_y,
                      source_width,
                      source_height,
                      destination_x+x_offset,
                      destination_y+y_offset,
                      destination_width,
                      destination_height);
};
           
const rectangle_selection = () => {
    const rectangle = document.getElementById('selection-rectangle');
//     const video = document.getElementById('video');
    const video_rectangle = video.getBoundingClientRect();
    let start_x = 0;
    let start_y = 0;
    let end_x = 0;
    let end_y = 0;
    let video_left   = video_rectangle.left; // perhaps need to add scrollingElement offsets when using these?
    let video_right  = video_left+video_rectangle.width;
    let video_top    = video_rectangle.top;
    let video_bottom = video_top+video_rectangle.height;
    const outside_image_region = (event) => {
        if (video_left > event.screenX ||
            video_top > event.screenY ||
            video_right < event.clientX ||
            video_bottom < event.clientY) {
           // reset rectangle
           rectangle.style.width  = "0px";
           rectangle.style.height = "0px";
           return true; // mouse is outside of image region
        }
    };
    let update_selection = () => {
        if (!video.paused && !video.hidden) {
            return;
        }
        let left   = Math.max(Math.min(start_x, end_x, video_right),  video_left);
        let right  = Math.min(Math.max(start_x, end_x, video_left),   video_right);
        let top    = Math.max(Math.min(start_y, end_y, video_bottom), video_top);
        let bottom = Math.min(Math.max(start_y, end_y, video_top),    video_bottom);
        rectangle.style.left   = left + 'px';
        rectangle.style.top    = top + 'px';
        rectangle.style.width  = right - left + 'px';
        rectangle.style.height = bottom - top + 'px';
    };
    const create_canvas = function () {
        let canvas = document.createElement('canvas');
        canvas.width  = VIDEO_WIDTH;
        canvas.height = VIDEO_HEIGHT;
        return canvas;
    };
    document.body.addEventListener('mousedown', (event) => {
        if (outside_image_region(event)) {
            return;
        }
        rectangle.hidden = false;
        start_x = event.clientX+document.scrollingElement.scrollLeft;
        start_y = event.clientY+document.scrollingElement.scrollTop;
        update_selection();
    });
    // adding listeners to video makes more sense but when tried only mousemove worked reliably
    document.body.addEventListener('mousemove', (event) => {
        if (!rectangle.hidden) {
            end_x = event.clientX+document.scrollingElement.scrollLeft;
            end_y = event.clientY+document.scrollingElement.scrollTop;
            update_selection();          
        }
    });
    document.body.addEventListener('mouseup', (event) => {
        if (!video.paused && !video.hidden) {
            return;
        }
        const box = rectangle.getBoundingClientRect();
        const box_left = document.scrollingElement.scrollLeft+box.left;
        const box_top  = document.scrollingElement.scrollTop+box.top;
        if (box.width > 0 && box.height > 0) {
            let temporaray_canvas = create_canvas();
            const source = video.hidden ? document.getElementById('canvas') : video;
            draw_maintaining_aspect_ratio(source,
                                          temporaray_canvas,
                                          VIDEO_WIDTH,
                                          VIDEO_HEIGHT,
                                          box_left-video_left,
                                          box_top-video_top,
                                          box.width,
                                          box.height,
                                          0,
                                          0);
            predict_class(temporaray_canvas, (results) => {
                display_message(confidences(results));
                console.log(results);
            });  
        }
        rectangle.hidden = true; 
    });
};

const receive_drop = (event) => {
    // following based on https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    let file;
    if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            file = event.dataTransfer.items[i].getAsFile();
            break;
          }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        file = event.dataTransfer.files[0].name;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.getElementById('canvas');
            canvas.getContext('2d').drawImage(image, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
            canvas.hidden = false;
            video.hidden = true;
            predict_class(canvas, (results) => {
                display_message(confidences(results));
                console.log(results);
                display_message("You can select a sub-region of your image.", true);
                const video_button = document.getElementById('toggle video');
                video_button.innerHTML = "Restore camera";
            });
        };
        image.src = reader.result;
    };  
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                 
//     if (typeof event.data.predict !== 'undefined') {
//         let example_count = classifier.getClassExampleCount();
//         if (!example_count[0]) { // includes undefined as well as 0
//             event.source.postMessage({error: "Cannot make any predictions before training. " + 
//                                              "Try this again after doing some training."},
//                                       "*");
//             return;
//         }
//         let image_url = event.data.predict;
//         load_image(image_url,
//                    function (image) {
//                        let canvas = create_canvas();
//                        copy_video_to_canvas(image, canvas);
//                        let image_as_tensor = tf.browser.fromPixels(canvas);
//                        logits = infer(image_as_tensor);
//                        classifier.predictClass(logits, TOPK).then(
//                            (results) => {
//                                event.source.postMessage({confidences: Object.values(results.confidences)}, "*");
//                                image_as_tensor.dispose();
//                                logits.dispose();
//                            },
//                            (error) => {
//                                event.source.postMessage({error: error.message}, "*");
//                            });
//         });
//     } else if (typeof event.data.train !== 'undefined') {
//         let image_url = event.data.train;
//         let label_index = class_names.indexOf(event.data.label);
//         let response;
//         if (label_index < 0) {
//             response = "Error: " + event.data.label + " is not one of " + class_names;
//             event.source.postMessage({confirmation: response}, "*");
//         } else {
//             add_image_to_training(image_url, label_index, event.source);
//          }
//     } else if (typeof event.data.get_image_features !== 'undefined') {
//         image_url_to_features_vector(event.data.get_image_features.URL, 
//                                      event.data.get_image_features.time_stamp,
//                                      event.source); 
//     } else if (typeof event.data.training_data !== 'undefined') {
//         let data_set = string_to_data_set('camera', event.data.training_data);
//         if (data_set) {
//             if (data_set.labels) {
//                 if (class_names) {
//                     set_class_names(data_set.labels);
//                 } else {
//                     initialise_page(data_set.labels, event.source);
//                 }
//             }
//             if (data_set.html) {
//                 let introduction = decodeURIComponent(data_set.html);
//                 update_introduction(introduction);
//             }
//             if (load_data_set('camera', data_set, classifier.setClassifierDataset.bind(classifier))) {
//                 // pass back class_names since Snap! doesn't know them
//                 event.source.postMessage({data_set_loaded: class_names}, "*");
//             }
//         }
//     }

const run_experiments = (threshold) => {
    let class_index = 0;
    let image_index = -1; // incremented to 0 soon
    let within_threshold_count = 0;
    display_message("<b>Results with a threshold of " + threshold + 
                    " and " + TOPK + " nearest neighbours.</b>");
    const next_experiment = () => {
        let class_images = images[class_names[class_index]];
        if (image_index === class_images.length-1) {
            // no more images for this class_index
            display_message("<p>Number at or above threshold of " + threshold + 
                            " = " + within_threshold_count + "/" + class_images.length + 
                            " (" + Math.round(100*within_threshold_count/class_images.length) + "%)</p>",
                            true);
            within_threshold_count = 0;
            image_index = 0;
            class_index++;
            if (class_index === class_names.length) {
                return;
            }
        } else {
            image_index++;
        }
        const maximum_confidence = (confidences) => {
            return Math.max(...Object.values(confidences));
        };
        const test_image = () => {
            const class_name = class_names[class_index];
            load_image(images[class_name][image_index],
                       async(image) => {
                           predict_class(image, (result) => {
                               let confidence = result.confidences[class_index];
                               display_message("<img src='" + images[class_name][image_index] + "' width=100 height=100></img>", true);
                               let message = class_name + "#" + image_index + " " + confidences(result);
                               if (confidence <= .5) {
                                   if (class_name !== 'other' || // confidence too low so highlight this message
                                       (class_name === 'other' && maximum_confidence(result.confidences) > .5)) {  
                                       message = "<span style='color:red'>" + message + "</span>";
                                   }                                       
                               }
                               if (confidence >= threshold) {
                                   within_threshold_count++;
                               }
                               display_message(message, true);
                               next_experiment();                          
                           });
                       });
        };
        const clear_just_one_class = false;
        if (clear_just_one_class) {
            classifier.clearClass(class_index); // remove elements from this class
        } else {
            classifier.dispose();
            classifier = knnClassifier.create();
        }
        add_images(test_image, clear_just_one_class, class_index, image_index); // put back all one
    };
    next_experiment();
};

const save_logits_as_tsv = (image_url, logits) => {
    const embedding = logits.dataSync();
    let tsv_row = image_url + "\t";
    embedding.forEach((weight) => {
        tsv_row += weight + "\t";
    });
    return tsv_row + "\n";
};

const sprite_size = 64; // not sure what's good
const sprite_image_width = 1024;
let sprite_image_x = 0;
let sprite_image_y = 0;

const create_sprite_image_canvas = () => {
    const canvas = document.createElement('canvas');
    let number_of_images = 0;
    Object.values(images).forEach((class_images) => {
        number_of_images += class_images.length;
    });
    const images_per_row = sprite_image_width/sprite_size;
    const number_of_rows = Math.ceil(number_of_images/images_per_row);
    canvas.width  = sprite_image_width;
    canvas.height = number_of_rows*sprite_size;
    return canvas;
};

add_image_to_sprite_image = (image_url, sprite_image_canvas) => {
    let x = sprite_image_x; // close over the current value
    let y = sprite_image_y;
    let image = new Image();
    image.src = image_url;
    image.onload = () => {
        draw_maintaining_aspect_ratio(image,
                                      sprite_image_canvas,
                                      sprite_size,
                                      sprite_size,
                                      0,
                                      0,
                                      image.width,
                                      image.height,
                                      x,
                                      y);
    };
    sprite_image_x += sprite_size;
    if (sprite_image_x >= sprite_image_width) {
        // new row
        sprite_image_x = 0;
        sprite_image_y += sprite_size;
    }
};

window.addEventListener('DOMContentLoaded',
                        function (event) {
                            load_mobilenet().then(initialise_page);
                        },
                        false);