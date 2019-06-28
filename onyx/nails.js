// by Ken Kahn <toontalk@gmail.com> as part of the Onyx project at the University of Oxford
// copyright not yet determined but will be some sort of open source
'use strict';

let xs = option === 'create model' ? [] : undefined;
let ys = option === 'create model' ? [] : undefined;
let xs_test = option === 'create model' || option === 'experiment' ? [] : undefined;
let ys_test = option === 'create model' || option === 'experiment' ? [] : undefined;
let xs_validation = option === 'create model' ? [] : undefined;
let ys_validation = option === 'create model' ? [] : undefined;
let load_model_named = option !== 'create model' && !use_knn ? model_name : undefined;
let loaded_model;

// if tensor_tsv is defined then collect all the logits of each image into a TSV string (tab-separated values)
let tensor_tsv   = projector_data ? "" : undefined;
let metadata_tsv = projector_data ? "" : undefined;
const CREATE_SPRITE_IMAGE = projector_data;

const SAVE_TENSORS = false; // if KNN

const VIDEO_WIDTH  = 224; // this version of MobileNet expects 224x224 images
const VIDEO_HEIGHT = 224;

const old_serious_name = "warrants second opinion";
const new_serious_name = "check with a GP";
const better_name = (name) =>
    name === old_serious_name ? new_serious_name : name;

const number_of_random_images = 4;
const random_image_padding = 4;
const image_dimension = Math.floor(document.body.offsetWidth/number_of_random_images)
                        -2*random_image_padding;

if (is_chrome() && is_ios()) {
    const p = document.createElement('p');
    p.innerHTML = "<big>On iPhones and iPads this app only works in the Safari browser.</big>";
    document.body.insertBefore(p, document.body.firstChild)
}

// number of nearest neighbours for KNN - one extra for experiments since we remove self-votes
let top_k = option === 'experiment' ? 6 : 5;

const histogram_buckets = [];
const bucket_count = 20;
const histogram_image_size = 40;

const minimum_confidence = 60;

const confusion_matrix = [];

const class_names = Object.keys(images);

const class_colors = ["green",
                      "red",
                      "brown",
                      "blue",
                      "orange",
                      "yellow",
                      "purple",
                      "pink",
                      "gray"];

class_colors[class_names.length] = 'white'; // no color after last class name

let csv = {};
let csv_class_names = {};
const create_csv_settings = () => {
    class_names.forEach((name) => {
        // this class name goes first
        let file_name = name + "-";
        csv[name] = "URL,ID," + name + ",";
        csv_class_names[name] = [name];
        class_names.forEach((other_name, index) => {
            if (name !== other_name) {
                csv[name] += other_name +  ",";
                file_name += other_name + "-";
                csv_class_names[name].push(other_name);
            }
        });
        csv[name] = file_name.slice(0, file_name.length-1) + ".csv\n" + csv[name].slice(0, csv.length-1) + "\n";
    });
};  
create_csv_settings();

const multi_nail_image_width = (multi_nail_description) => {
    return multi_nail_description.image_width || 100; // 100x100 is used in the Korean images
};
const multi_nail_image_height = (multi_nail_description) => {
    return multi_nail_description.image_height || 100; // 100x100 is used in the Korean images
};
const multi_nail_image_delta_x = (multi_nail_description) => {
    return multi_nail_description.delta_x || 112; 
};
const multi_nail_image_delta_y = (multi_nail_description) => {
    return multi_nail_description.delta_y || 128; 
};
const multi_nail_image_start_x = (multi_nail_description) => {
    return multi_nail_description.start_x || 16; 
};
const multi_nail_image_start_y = (multi_nail_description) => {
    return multi_nail_description.start_y || 48; 
};
const number_of_images_in_multi_nail_file = (multi_nail_description) => {
    const {width, height} = multi_nail_description.dimensions;
    const images_per_row = Math.floor((width-multi_nail_image_start_x(multi_nail_description))
                                      /multi_nail_image_delta_x(multi_nail_description));
    const number_of_rows = Math.floor((height-multi_nail_image_start_y(multi_nail_description))
                                      /multi_nail_image_delta_y(multi_nail_description));
    // subtract 1 since don't know how many blank images there are in the bottom row
    const number_of_images = images_per_row*(number_of_rows-1);
    if (multi_nail_description.count > 0) {
        return Math.min(number_of_images, multi_nail_description.count);
    }
    return number_of_images;    
};

const images_fitting_in = (height) => 20*(((height-68)/128)-1);

const number_of_images = {};

class_names.forEach((class_name) => {
    number_of_images[class_name] = 0;
    images[class_name].forEach((image_or_images) => {
        if (typeof image_or_images === 'string') {
            number_of_images[class_name]++;
        } else if (image_or_images.count)  {
            const total_available = number_of_images_in_multi_nail_file(image_or_images);
            if (image_or_images.count > total_available) {
                console.log("Count of " + image_or_images.count + " is greater than " + total_available
                            + " for " + image_or_images.file_name);
                image_or_images.count = total_available;
            }
            number_of_images[class_name] += image_or_images.count;
        } else {
            number_of_images[class_name] += number_of_images_in_multi_nail_file(image_or_images);
        }
    });
});

const number_precision = (x, n) => Math.round(x*Math.pow(10, n))/Math.pow(10, n);

let classifier;
let mobilenet_model;
let video;

const create_canvas = function () {
    const canvas = document.createElement('canvas');
    canvas.width  = VIDEO_WIDTH;
    canvas.height = VIDEO_HEIGHT;
    return canvas;
};

const analyse_camera_image = () => {
    const temporary_canvas = create_canvas();
    const context = temporary_canvas.getContext('2d');
    context.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    display_results(temporary_canvas);
    // move camera instructions to the end to make room
    document.getElementById('main').appendChild(document.getElementById('camera-instructions'));
};

let email_link_added = false;

const display_results = (canvas) => {
    make_prediction(canvas, (results, logits) => {
        const data_url = canvas.toDataURL();
        const id = hex_md5(data_url);
        let result_description = confidences(results, -1);
        const data = result_description
                     + "\nimage id = " + id
                     + "\ndata = " + logits;
        if (!is_mobile()) {
            result_description = "<img src='" + data_url + "' width=128 height=128></img><br>" 
                                 + result_description;
        }
        const message = response_element(result_description);
        const camera_image_element = document.getElementById('camera-image');
        camera_image_element.src = data_url;
        camera_image_element.hidden = false;
        display_message(message, 'camera-response', true);
        const display_data = (event) => {
            navigator.clipboard.writeText(data);
            alert("Clipboard has data for this image. Please send it to toontalk@gmail.com");
            if (!email_link_added) {
                const email_link = document.createElement('div');
                email_link.innerHTML = 
                    "<a href='mailto:toontalk@gmail.com?subject=Onyx image issue&body=Please paste data here.' target='_blank'>Click to send email.</a>";
                camera_image_element.parentElement.insertBefore(email_link, camera_image_element);
                email_link_added = true;             
            }
        };
        document.getElementById('camera-image').onclick = display_data;          
    });
};

const setup_camera = (callback) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
  }
  const video = document.getElementById('video');
  video.width  = VIDEO_WIDTH;
  video.height = VIDEO_HEIGHT;
  const mobile = is_mobile();
  navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: mobile ? 'environment' : 'user',
      width: mobile ? undefined : VIDEO_WIDTH,
      height: mobile ? undefined : VIDEO_HEIGHT,
    },
  }).then((stream) => {
      video.srcObject = stream;
      const toggle_click= () => {
          if (!video.paused && !video.hidden) {
              video.pause();
              toggle_freeze_button.innerHTML = "Resume video";
              document.getElementById('before-video-element').innerHTML =
                  "<b>Use the mouse to select a rectangle containing a nail.</b>";        
          } else {
              if (video.hidden) {
                  video.hidden = false;
                  document.getElementById('canvas').hidden = true;
              }
              video.play();
              toggle_freeze_button.innerHTML = "Freeze video";
              document.getElementById('before-video-element').innerHTML =
                  "<b>Freeze the video before selecting a nail.</b>";
          }
      };
      const toggle_freeze_button = document.getElementById('toggle video');
      if (is_mobile()) {
          toggle_freeze_button.innerHTML = "Click to take photo";
          toggle_freeze_button.addEventListener('click', analyse_camera_image);
      } else {
          toggle_freeze_button.addEventListener('click', toggle_click);  
      }
      video.onloadedmetadata = () => {
          if (is_mobile()) {
              video.width = 128;
              video.height = 128;
          } else if (video.videoWidth) {
              // in Chrome videoWidth is 0 but without this FireFox can't map the selection rectangle properly
              video.width = video.videoWidth;
              video.height = video.videoHeight;
          }
          callback(video);
      };          
     },
     (error) => {
         unable_to_access_camera(error);
         callback();
     });
};

const random_integer = (n) =>
    // returns an integer between 0 and n-1
    Math.floor(Math.random()*n);

const random_element = (array) =>
    array[random_integer(array.length)];

const add_image_or_canvas = (parent, image_or_canvas, class_name, image_to_replace, callback) => {
    // if image_to_replace is defined then image_or_canvas replaces it
    // otherwise image_or_canvas is added to parent element 
    image_or_canvas.classList.add('random-image-button');
    if (!image_or_canvas.width) {
        image_or_canvas.width = image_dimension;
        image_or_canvas.height = image_dimension;        
    }
    const analyse_image = (event) => {
        if (is_mobile()) {
            display_message("Analysing...", 'random-image-response');
        }
        const analyse_image_and_replace_self =
            (result) => {
                const class_index = class_names.indexOf(class_name);
                const image_element = document.getElementById('random-image-chosen');
                image_element.src = get_url_from_image_or_canvas(image_or_canvas);
                image_element.hidden = false;
                let message = process_prediction(result, image_or_canvas, class_index);
                display_message(message, 'random-image-response', true);
                add_random_image(null, image_or_canvas); // replaces self with new random image                      
        };
        make_prediction(image_or_canvas, analyse_image_and_replace_self);
    };
    image_or_canvas.addEventListener('click', analyse_image);
    if (image_to_replace) {
        image_to_replace.parentNode.replaceChild(image_or_canvas, image_to_replace);
    } else {
        parent.appendChild(image_or_canvas);
    }
    if (callback) {
        callback();
    }
};

const add_random_images = (callback) => {
    let count = 0;
    const after_image_added = () => {
        count++;
        if (count === number_of_random_images-1) {
            // last one
            add_random_image(document.getElementById('random-images'), undefined, callback);
        } else {
            add_random_image(document.getElementById('random-images'), undefined, after_image_added);
        }
    }
    add_random_image(document.getElementById('random-images'), undefined, after_image_added);
};

const add_random_image = (parent, image_to_replace, callback) => {
    const class_name = random_element(class_names);
    const image_description = random_element(images[class_name]);
    if (!image_description) {
        return; // e.g. for this test this class is empty
    }
    if (typeof image_description === 'string') {
        const image = document.createElement('img');
        image.src = image_description;
        image.title = image_description;
        add_image_or_canvas(parent, image, class_name, image_to_replace, callback);
    } else {
        load_image(image_description.file_name,
                   (multi_nail_image) => {
                       const box = multi_nail_image_box(image_description);
                       const canvas = canvas_of_multi_nail_image(multi_nail_image, box);
                       canvas.title = image_description.file_name + "#" + box.image_index;                                                                   
                       add_image_or_canvas(parent, canvas, class_name, image_to_replace, callback);
                   });                 
    }
};

const load_image = function (image_url, callback) {
    let image = new Image();
    image.src = image_url;
    image.onload = () => {
        callback(image);
    };
};

const get_url_from_image_or_canvas = (image_or_canvas) => {
    if (image_or_canvas instanceof HTMLCanvasElement) {
        return image_or_canvas.toDataURL();
    } else {
        return image_or_canvas.src;
    }
};

const add_images = (when_finished, just_one_class, only_class_index, except_image_index) => {
    let class_index = just_one_class ? only_class_index : 0;
    let image_index = -1; // incremented to 0 soon
    let image_counter = 0; // unlike image_index this is not local to a multi_nail_image
    const image_sprite_canvas = CREATE_SPRITE_IMAGE && create_sprite_image_canvas();
    if (image_sprite_canvas) {
        document.body.appendChild(image_sprite_canvas);
    }
    const [next_image, reset_next_image] = create_next_image_generator();
    const when_all_finished = () => {
        when_finished();
        if (image_sprite_canvas) {
            // can then save it 
            add_textarea(image_sprite_canvas.toDataURL() + "");
        }
        if (xs instanceof Array) {
//             const model_callback = (model) => {
//                 xs.forEach((logits, index) => {
//                     const prediction_tensor = model.predict(tf.tensor([logits]));
//                     const class_index = ys[index].indexOf(1);
//                     const class_name = class_names[class_index];
//                     const confidence = prediction_tensor.dataSync()[class_index];
//                     console.log(index, confidence, class_name, confidence < .6 ? "problem?" : "");
//                 });
//             };
            training_options.class_names = class_names; // for displaying confusion matrix
            train_model(xs,
                        ys,
                        xs_validation,
                        ys_validation,
                        xs_test,
                        ys_test,
                        training_options);
//                         model_callback);
        }
    };
    const one_shot = (index, n) => {
        let vector = [];
        for (let i = 0; i < n; i++) {
            vector.push(i === index ? 1 : 0);
        }
        return vector;
    };
    const image_callback = (image_or_canvas, class_index, image_index) => {
        if (image_index !== except_image_index) {
            image_counter++;
            const logits = infer(image_or_canvas);
            if (typeof metadata_tsv !== 'undefined' && metadata_tsv === "") {
                metadata_tsv = "Class\tImage ID\n";
            }
            if (typeof tensor_tsv !== 'undefined') {
                tensor_tsv += class_names[class_index] + "#" + image_index + "\t";
                tensor_tsv += save_logits_as_tsv(logits);                       
            }
            if (typeof metadata_tsv !== 'undefined') {
                metadata_tsv += class_names[class_index] + "\t" + class_names[class_index] + "#" + image_index + "\n";
            }
            if (use_knn) {
                classifier.addExample(logits, class_index);
            }
            if (xs instanceof Array) { // need this for training or testing
                const x = logits.dataSync();
                const y = one_shot(class_index, class_names.length);
                if (typeof every_nth_for_testing === 'number') {
                    if (image_counter%every_nth_for_testing === 0 && option === 'create model') {
                        xs_validation.push(x);
                        ys_validation.push(y);
                    } else if (image_counter%every_nth_for_testing === 1) {
                        xs_test.push(x);
                        ys_test.push(y);
                    } else {
                        xs.push(x);
                        ys.push(y);                       
                    }
                }
            }
            logits.dispose();
        }   
        if (image_sprite_canvas) {
            add_image_to_sprite_image(class_images[image_index], image_sprite_canvas);
        }
        next_image(image_callback, undefined, when_all_finished)
    };
    next_image(image_callback, undefined, when_all_finished);
};

const make_prediction = (image, callback) => {
    return tf.tidy(() => {
        const logits = infer(image);
        const logits_data = logits.dataSync();
        if (use_knn) {
            classifier.predictClass(logits, top_k).then((result) => {
                callback(result, logits_data);          
            });            
        } else {
            callback(loaded_model.predict([logits]).dataSync(),
                     logits_data)
        }
    });
};

// 'conv_preds' is the logits activation of MobileNet.
const infer = (image) => {
    if (!mobilenet_model) {
        return load_mobilenet(() => infer(image)); 
    }
    return mobilenet_model.infer(image, 'conv_preds');
};

const load_mobilenet = (callback) => {
    if (use_knn) {
        classifier = knnClassifier.create();
    }
    mobilenet.load(2).then((model) => { // version 2
        mobilenet_model = model;
        return callback();
    });  
};

const initialise_page = () => {
  try {
      setup_camera(
          (camera) => {
              if (!camera) {
                  start_up();
                  return;
              }
              video = camera;
              video.play();
              if (window.saved_tensors && use_knn && !CREATE_SPRITE_IMAGE && !SAVE_TENSORS && option !== 'experiment' && typeof xs === 'undefined') {
                  load_data_set(window.saved_tensors);
                  start_up();
              } else if (option === 'create model' || 
                         (use_knn && option !== 'diagnose')) {
                  add_images(start_up);
              } else {
                  start_up();
              }
            },
         (error) => {
             unable_to_access_camera(error);       
         });
   } catch (error) {
        unable_to_access_camera(error);
   };
};

const unable_to_access_camera = (error) => {
    let info = document.getElementById('info');
    info.innerHTML = "<p style='font-size: x-large;'>"
                     + "Failed to access the camera. You can still click on random images. "
                     + error.message
                     + "</p>";
//                       'This browser either does not support video capture, ' +
//                       'lacks permission to use the camera, ' +
//                       'or this device does not have a camera.';
};

const go_to_camera_interface = () => {
    document.getElementById('camera-interface').hidden = false;
    document.getElementById('tutorial-interface').hidden = true;
};

const go_to_tutorial_interface = () => {
    document.getElementById('camera-interface').hidden = true;
    document.getElementById('tutorial-interface').hidden = false;
};

const start_up = () => {
    const use_photo = "Or take a picture of a finger or toe nail on a screen or in a photograph. ";
    const instructions = is_mobile() ?
                         "Take a picture of your fingernail using your device by clicking the button below. "
                         + use_photo
                         + "Make sure only one nail is visible in each photo." :
                         "Take a picture by clicking the button below. "
                         + use_photo 
                         + "Then you will be able to select a nail in the image.";
    document.getElementById('camera-instructions').innerHTML = 
        video ? instructions : "Camera not available";
    if (typeof tensor_tsv === 'string') {
        add_textarea(tensor_tsv);
        add_textarea(metadata_tsv);
    }
    if (!is_mobile()) {
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
    }
    if (load_model_named) { // check that not training?
        tf.loadLayersModel("models/" + load_model_named + ".json").then((model) => {
            loaded_model = model;
            if (option === 'experiment') {
                run_new_experiments();
            }
        });
    } else if (option === 'experiment') {
        run_experiments(); // report any matches with confidence less than this confidence
    }
    if (SAVE_TENSORS) {
        save_tensors(classifier.getClassifierDataset());
    }
    document.getElementById('go-to-camera').addEventListener('click', go_to_camera_interface);
    document.getElementById('go-to-tutorial').addEventListener('click', go_to_tutorial_interface);
};


function remove_parent_element (event) {
    event.currentTarget.parentNode.remove();
}

const display_message = (message, element_id, append) => {
    if (append && !is_mobile()) {
        let after = "";
        if (message.indexOf("class='prediction-response'") >= 0) {
            after = "";
        } else {
            after = "<br>";
        }
        message = message + after + document.getElementById(element_id).innerHTML;
    }
    document.getElementById(element_id).innerHTML = message;
};

const reset_response = () => {
    document.getElementById('camera-response').innerHTML = "";
};

const remove_one_vote = (score, self_vote, running_tests) => {
    if (running_tests) {
        if (self_vote) {
            // remove the vote for itself
            score -= 1/top_k;
        }
        score *= top_k/(top_k-1); // one fewer voters since ignoring self vote        
    }
    return Math.round(100*score); // convert to percentage
};

const correct = (result, class_index) => {
    // only called if running tests
    let max_score = -1;
    let max_score_indices = [];
    for (let index = 0; index < class_names.length; index++) {
        let score = use_knn ? result.confidences[index] : result[index];
        if (index === class_index && use_knn) {
            score -= 1/top_k; // remove the self vote
        }
        if (score > max_score) {
            max_score = score;
            max_score_indices = [index];
        } else if (score === max_score) {
            max_score_indices.push(index);
        }
    }
    // doesn't count as correct if tied for first place
    return (max_score_indices.length === 1 && max_score_indices[0] === class_index);
};

const not_confident_message = "Not very sure whether the nail is OK or not. Sorry.";

const confidences = (result, correct_class_index, running_tests) => {
    let message = "<b>Analysis by this app: </b>";
    let scores = [];
//     let name_of_highest_scoring_class;
//     let name_of_second_highest_scoring_class;
//     let highest_score = 0;
//     let second_highest_score = 0;
    class_names.forEach((name, class_index) => {
        let score;
        if (use_knn) {
            score = remove_one_vote(result.confidences[class_index], correct_class_index === class_index, running_tests);
        } else {
            score = Math.round(result[class_index]*100)
        }
        message += better_name(name) + " = " + score + "%; ";
        scores.push({name: name,
                     score: score});
    });
    message += "<br>";
    scores.sort((name_score_1, name_score_2) => {
        return name_score_2.score-name_score_1.score;
    });
    if (scores[0].score < minimum_confidence) {
        message += not_confident_message;
    } else {
        if (scores[0].name === old_serious_name) {
            message += "It is most likely that the nail indicates something that warrants a second opinion and you should seek medical advice. (Confidence score is "
                       + scores[0].score + "%)";
        } else if (scores.length > 1 && scores[1].name === old_serious_name && scores[1].score >= 20) {
            message += "Perhaps a GP should be consulted " + " (confidence score is " + scores[1].score + "%) ";
        } else {
            message += "The nail's condition is " + scores[0].name + " with confidence score of " + scores[0].score + "%.";
            if (scores.length > 1 && scores[1].name === old_serious_name && scores[1].score > 0) {
                message += "<br>The confidence score for consulting a GP is " + scores[1].score + "%.";
            } else if (scores.length > 1 && scores[1].score > 0) {
                message += "<br>Otherwise it is " + scores[1].name + " with confidence score of " + scores[1].score + "%.";
            }
        }
    }
    return message;
};

const update_histogram = (result, correct_class_index, image_URL, title) => {
    const find_highest_wrong_class_index = (result, correct_class_index) => {
        let highest_wrong_class_index = class_names.length; // if no wrong scores returns number of classes
        let highest_wrong_score = 0;
        for (let index = 0; index < class_names.length; index++) {
            const confidence = use_knn ? result.confidences[index] : result[index]
            if (index !== correct_class_index && confidence > highest_wrong_score) {
                highest_wrong_class_index = index;
                highest_wrong_score = confidence;
            }
        }
        return highest_wrong_class_index;
    };
    class_names.forEach((name, class_index) => {
        const correct = correct_class_index === class_index;
        const score = use_knn ? remove_one_vote(result.confidences[class_index], correct, true) : 
                                Math.round(100*result[class_index]);
        const highest_wrong_class_index = find_highest_wrong_class_index(result, correct_class_index);
        // score-1 so that 0-20 is 0; 25-40 is 1; ... 85-100 is 4
        const bucket_index = Math.max(0, Math.floor((score-1)/(100/bucket_count)));
        let bucket = histogram_buckets[bucket_index];
        if (bucket === undefined) {
            bucket = [];
            histogram_buckets[bucket_index] = bucket;             
        }
        bucket.push({score: score,
                     correct_class_index: correct_class_index,
                     class_index: class_index,
                     highest_wrong_class_index: highest_wrong_class_index,
                     title: title,
                     image_URL: image_URL});
    });
};

const update_confusion_matrix = (result, correct_class_index) => {
    class_names.forEach((name, class_index) => {
        const correct = correct_class_index === class_index;
        const score = use_knn ? remove_one_vote(result.confidences[class_index], correct, true) :
                                Math.round(result[class_index]*100);
        if (confusion_matrix[correct_class_index] === undefined) {
            confusion_matrix[correct_class_index] = class_names.map(() => 0);
        }
        confusion_matrix[correct_class_index][class_index] += score;
    });
};

const html_header = "<html><body>\n<link href='../../css/ai-teacher-guide.css' rel='stylesheet'>\n";

const histogram_buckets_to_html = (histogram_buckets, image_size) => {
    const gap = 10;
    const border_size = 4;
    const delta = image_size+gap;
    const bucket_increment = Math.floor(100/histogram_buckets.length);
    let html = "histogram.html\n" + html_header;
    html += "<p>Border colours capture highest scoring wrong label: ";
    class_names.forEach((name, class_index) => {
        html += "<span style='color:" + class_colors[class_index] + ";'>" + name + "</span>" + "&nbsp;";
    });
    html += "and no border if the correct class received a score of 100%.";
    class_names.forEach((name, class_index) => {
        html += "<p>Histogram of " + name + "</p>\n";
        let max_correct_count = 0;
        histogram_buckets.forEach((bucket) => {
            let correct_count = 0;
            bucket.forEach((score) => {
                if (score.correct_class_index === class_index && score.class_index === class_index) {
                    correct_count++;
                }
            });
            if (correct_count > max_correct_count) {
                max_correct_count = correct_count;
            }
        });
        html += "<div class='grid_container' style='" 
                + "height:" + (max_correct_count+1)*delta
                + "px;'>\n";
        const buckets = histogram_buckets.map((bucket, bucket_index) => {
            let top = (max_correct_count-1)*delta;
            bucket.forEach((score) => {
                if (score.correct_class_index === class_index && score.class_index === class_index) {
                    let color_of_highest_wrong_class = class_colors[score.highest_wrong_class_index];
                    html += "<a href='" + score.image_URL + "' target='_blank'>"
                            + "<div class='grid_element' title='" + score.title + "' "
                            + "style='"
                            + "border: solid " + border_size + "px " + color_of_highest_wrong_class + ";"
                            + "left:" + (bucket_index*delta)  + "px;"
                            + " top:" + top + "px'>\n"
                            + " <img src='" + score.image_URL + "' width=" + image_size + " height=" + image_size + "  >\n"
                            + "</div></a>\n";
                    top -= delta;
                }
           });
        });
        let x = 0;
        histogram_buckets.forEach((bucket, bucket_index) => {
            html += "<span class='x-axis-label' style='left:" + (bucket_index*delta)
                    + "px;top:" + max_correct_count*delta + "px'>" + x + "</span>\n";
            x += bucket_increment;
        });
        html += "\n";
        html += "</div>\n";
   });
   html += "</body></html>\n";
   return html;
};

const confusion_matrix_to_html = (confusion_matrix, element_size) => {
    const gap = 5;
    const sum = (row) => row.reduce((accumulator, currentValue) => accumulator + currentValue);
    const normalise = (row) => {
        let total = sum(row);
        return row.map((n) => n/total);
    };
    const number_of_classes = class_names.length;
    const delta = (element_size+gap);
    let html = "confusion.html\n" + html_header;
    html += "<p>This is a confusion matrix. " 
            + "The darker the colour the higher the average score for the class of the column.</p>";
    html += "<div class='grid_container' style='" 
             + "width:"  + number_of_classes*delta + "px;"
             + "height:" + number_of_classes*delta + "px;"
             + "'>\n";
    class_names.forEach((name, class_index) => {
        html += "<span class='x-axis-label' title='Average predictions that it is " + name + "' " 
                + "style='left:" + (class_index+1)*delta
                + "px;top:0px;'>\n" + name.split(' ')[0] + "</span>";
    });
    let top = element_size/2; // room for the axis labels
    confusion_matrix.forEach((row, class_index) => {
        html += "<span class='y-axis-label' title='Tests with " + class_names[class_index] + " images' "
                + "style='left:10px;"
                + "top:" + (top+element_size/2) + "px;'>\n&nbsp;&nbsp;" + class_names[class_index].split(' ')[0] + "</span>";
        const normalised_row = normalise(row);
        let left = delta;
        normalised_row.forEach((fraction) => {
            html += "<div class='grid_element' title='" + Math.round(fraction*100) + "%' "
                    + "style='background-color:hsl(0,100%," + Math.round((1-fraction)*100) + "%);"
                    + "left:" + left + "px;"
                    + "top:" + top + "px;"
                    + "width:" + element_size + "px;"
                    + "height:" + element_size + "px;"
                    + "border:1px solid;"
                    + "'></div>\n";
            left += delta;
        });
        top += delta;
    });
    html += "</div></body></html>";
    return html;
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

const get_source_box = () => {
    const source = video.hidden ? document.getElementById('canvas') : video;
    const source_rectangle = source.getBoundingClientRect();
    const left = source_rectangle.left+window.scrollX;
    const top = source_rectangle.top+window.scrollY;
    return {left: left, 
            right: left+source_rectangle.width,
            top: top,
            bottom: top+source_rectangle.height};
};
           
const rectangle_selection = () => {
    const rectangle = document.getElementById('selection-rectangle');
    let start_x = 0;
    let start_y = 0;
    let end_x = 0;
    let end_y = 0;
    const outside_image_region = (event) => {
        const source_box = get_source_box();
        if (source_box.left > event.clientX+window.scrollX ||
            source_box.top > event.clientY+window.scrollY ||
            source_box.right < event.clientX+window.scrollX ||
            source_box.bottom < event.clientY+window.scrollY) {
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
        const source_box = get_source_box();
        let left   = Math.max(Math.min(start_x, end_x, source_box.right),  source_box.left);
        let right  = Math.min(Math.max(start_x, end_x, source_box.left),   source_box.right);
        let top    = Math.max(Math.min(start_y, end_y, source_box.bottom), source_box.top);
        let bottom = Math.min(Math.max(start_y, end_y, source_box.top),    source_box.bottom);
        rectangle.style.left   = left + 'px';
        rectangle.style.top    = top + 'px';
        rectangle.style.width  = right - left + 'px';
        rectangle.style.height = bottom - top + 'px';
    };
    document.body.addEventListener('mousedown', (event) => {
        if ((!video && canvas.hidden) ||
            outside_image_region(event)) {
            return;
        }
        rectangle.hidden = false;
        start_x = event.clientX+window.scrollX;
        start_y = event.clientY+window.scrollY;
        update_selection();
    });
    // adding listeners to video makes more sense but when tried only mousemove worked reliably
    document.body.addEventListener('mousemove', (event) => {
        if (!rectangle.hidden) {
            end_x = event.clientX+window.scrollX;
            end_y = event.clientY+window.scrollY;
            update_selection();          
        }
    });
    document.body.addEventListener('mouseup', (event) => {
        if ((!video && canvas.hidden) ||
            (!video.paused && !video.hidden)) {
            return;
        }
        const box = rectangle.getBoundingClientRect();
        const box_left = window.scrollX+box.left;
        const box_top  = window.scrollY+box.top;
        if (box.width > 0 && box.height > 0) {
            const source_box = get_source_box();
            let temporary_canvas = create_canvas();
            const source = video.hidden ? document.getElementById('canvas') : video;
            draw_maintaining_aspect_ratio(source,
                                          temporary_canvas,
                                          source.width,
                                          source.height,
                                          box_left-source_box.left,
                                          box_top-source_box.top,
                                          box.width,
                                          box.height,
                                          0,
                                          0);
            display_results(temporary_canvas);
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
            make_prediction(canvas, (results) => {
                display_message(confidences(results, -1), 'camera-response', true);
                display_message("You can select a sub-region of your image.", 'camera-response', true);
                const video_button = document.getElementById('toggle video');
                video_button.innerHTML = "Restore camera";
            });
        };
        image.src = reader.result;
    };  
};

const canvas_of_multi_nail_image = (multi_nail_image, box) => {
    const canvas = document.createElement('canvas');
    canvas.width = image_dimension;
    canvas.height = image_dimension;
    draw_maintaining_aspect_ratio(multi_nail_image,
                                  canvas,
                                  image_dimension,
                                  image_dimension,
                                  box.x,
                                  box.y,
                                  box.width,
                                  box.height);
    return canvas;
};

const multi_nail_image_box = (image_description, image_index) => {
    const width = image_description.dimensions.width;
    const images_per_row = Math.floor((width-multi_nail_image_start_x(image_description))
                                      /multi_nail_image_delta_x(image_description));
    if (typeof image_index === 'undefined') {
        // pick a random one
        image_index = random_integer(number_of_images_in_multi_nail_file(image_description));
    }
    const row_number = Math.floor(image_index/images_per_row);
    const column_number = image_index-(row_number*images_per_row);
    return {x: multi_nail_image_start_x(image_description)+column_number*multi_nail_image_delta_x(image_description),
            y: multi_nail_image_start_y(image_description)+row_number*multi_nail_image_delta_y(image_description),
            width: multi_nail_image_width(image_description),
            height: multi_nail_image_height(image_description),
            image_index: image_index};
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

const create_next_image_generator = () => {   
    let class_index;
    let image_index;
    let image_count;
    let multi_nail_image; // image that has multiple nails on it
    let multi_nail_description; // object with at least file_name and count attributes
    let nails_remaining_in_multi_nail;
    const reset_next_image = () => {
        class_index = 0;
        image_index = -1; // incremented to 0 soon - this is the index into the list of image file_names or multi-images
        image_count = 0;
        nails_remaining_in_multi_nail = 0;
    };
    reset_next_image();
    const next_image = (image_callback, when_class_finished, when_all_finished) => {
        const class_name = class_names[class_index];
        if (image_count >= number_of_images[class_name]-1) { 
            // no more images for this class_index
            if (when_class_finished) {
                when_class_finished(class_index);
            }
            image_index = 0;
            image_count = 0;
            multi_nail_image = undefined;
            class_index++;
            if (class_index === class_names.length) { // no more classes 
                if (when_all_finished) {
                    when_all_finished();
                };
                return;
//             } else {
//                 next_image(image_callback, when_class_finished, when_all_finished);
            }
        } else {
            image_count++;
            if (nails_remaining_in_multi_nail > 0) {
                nails_remaining_in_multi_nail--;
            } else {
                image_index++;
                multi_nail_image = undefined;
            }
        }
        const maximum_confidence = (confidences) => {
            return Math.max(...Object.values(confidences));
        };
        const canvas_of_next_nail_in_multi_nail_image = (images_description) => 
            canvas_of_multi_nail_image(multi_nail_image,
                                       multi_nail_image_box(images_description, nails_remaining_in_multi_nail));
        const load_or_extract_image = () => {
            const class_name = class_names[class_index];
            const image_or_images_description = images[class_name][image_index];
            if (!image_or_images_description) {
                // no images for this class since testing other things
                return;
            }
            if (typeof image_or_images_description !== 'string') {
                if (multi_nail_image) {
                    // no need to load it again
                    image_callback(canvas_of_next_nail_in_multi_nail_image(image_or_images_description),
                                   class_index, image_index, image_count);
                    return;
                }
                load_image(image_or_images_description.file_name,
                           (image) => {
                               multi_nail_image = image;
                               multi_nail_description = image_or_images_description;
                               nails_remaining_in_multi_nail = 
                                   number_of_images_in_multi_nail_file(image_or_images_description);
                               load_or_extract_image();
                           });
                return;
            }
            load_image(image_or_images_description, 
                       (image) => {
                           image_callback(image, class_index, image_index, image_count);
                       });
        };
        load_or_extract_image();
    };
    return [next_image, reset_next_image];
};

const run_new_experiments = () => {
    const [next_image, reset_next_image] = create_next_image_generator();
    let image_counter = 0;
    let confidences = {};
    class_names.forEach((class_name) => {
        confidences[class_name] = [];
    });
    const when_finished = () => {
        report_final_statistics();
        class_names.forEach((class_name, index) => {
            confidences[class_name].sort((x, y) => x[0]-y[0]).forEach((confidence_and_message) => {
                display_message(confidence_and_message[1], 'main', true);
            });
            add_textarea(csv[class_name]);
        });
    };
    const next = (image, class_index, image_index, image_count) => {
        image_counter++;
        if (typeof every_nth_for_testing !== 'number' ||
            image_counter%every_nth_for_testing === 1) {
            const logits = infer(image);
            const prediction_tensor = loaded_model.predict([logits]);
            const prediction = prediction_tensor.dataSync();
            const confidence = prediction[class_index];
            const class_name = class_names[class_index];
            const image_description = images[class_name][image_index];
            image.title = typeof image_description === 'string' ?
                          image_description :
                          image_description.file_name + "#" + image_count;
            let message = process_prediction(prediction, image, class_index, image_index, image_count);
    //         let message = "<img src='" + get_url_from_image_or_canvas(image) + "' width=100 height=100></img>" 
    //                       + class_names[class_index] + "#" + image_index + " (" + image_count + ") = " + number_precision(confidence, 4);
            confidences[class_name].push([confidence, message]);
            csv[class_name] += "https://ecraft2learn.github.io/ai/onyx/" + images[class_name][image_index] + "," +
                                image_count + "," + confidence + "\n";
        }
        next_image(next, undefined, when_finished);
    };
    next_image(next);
};

let false_negatives = 0;
let false_positives = 0;
let true_negatives = 0;
let true_positives = 0;
let number_right = 0;
let not_confident_answers = 0; // less than minimum_confidence for top answer 

const process_prediction = (result, image_or_canvas, class_index, image_index, image_count) => {
    const image_url = get_url_from_image_or_canvas(image_or_canvas);
    let message = option === 'diagnose' && is_mobile() ?
                  "" :
                  "<img src='" + image_url + "' width=100 height=100></img><br>";
    let confidence_message = confidences(result, class_index, true);
    const class_name = class_names[class_index];
    if (typeof image_count !== 'undefined') {
        message += "&nbsp;" + better_name(class_name) + "#" + image_count;
    } else {
        message += "According to experts ";
        if (class_name === old_serious_name) {
            message += "this is a condition that should be seen by a doctor.";
        } else if (class_name === 'non-serious') {
            message += "this is abnormal but not serious.";
        } else if (class_name === 'normal') {
            message += "this is normal.";
        }
    }
    message += "<br>" + confidence_message;
    if (image_or_canvas.title && window.location.hash.indexOf('debug') >= 0) {
        message += "&nbsp;"
                   + "<a href='"
                   + image_or_canvas.title
                   + "' target='_blank'>"
                   + "image source"
                   + "</a>";
    }
    let correct_prediction = correct(result, class_index);
    if (correct_prediction) {
        number_right++;
    } else {
        // highlight wrong ones in red
        message = "<span style='color:red'>" + message + "</span>";
    }
    if (confidence_message.indexOf(not_confident_message) >= 0) {
        not_confident_answers++;
    } else if (class_names[0] === 'normal' &&
               (class_names[1] === 'fungal' || class_names[1] === 'non-serious') &&
               (class_names.length === 2 || class_names[2] === old_serious_name)) {
        let positive_index = class_names[1] === 'fungal' ? 1 : 2;
        if (class_index === positive_index) { 
            if (correct_prediction) {
                true_positives++;
            } else {
                false_negatives++;
            }
        } else {
            if (correct_prediction) {
                true_negatives++;
            } else {
                false_positives++;
            }
        }
    }
    if (option === 'experiment') {
        update_histogram(result, class_index, image_url, plain_text(message));
        update_confusion_matrix(result, class_index);
        csv[class_name] += "https://ecraft2learn.github.io/ai/onyx/" + images[class_name][image_index] + "," +
                            image_count + ",";
        csv_class_names[class_name].forEach((name) => {
            // this re-orders the results
            const index = class_names.indexOf(name);
            const correct = index === class_index;
            const score = use_knn ? remove_one_vote(result.confidences[index], correct, true) :
                                    Math.round(result[index]*100);
            csv[class_name] += score;
            if (index < class_names.length-1) {
                // no need to add comma to the last one
                csv[class_name] += ",";
            }
        });
        csv[class_name] += "\n";        
    }
    return response_element(message);
};

const response_element = (message) =>
    (is_mobile() ? "" : "<div class='prediction-response'>")
    + message
    + (is_mobile() ? "" : "<button class='close-button' onclick='remove_parent_element(event)'>&times;</button>")
    + "</div>";

const maximum_confidence = (confidences) => {
    return Math.max(...Object.values(confidences));
};
const plain_text = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText;
};

const report_final_statistics = () => {
    const total = true_positives+true_negatives+false_positives+false_negatives+not_confident_answers;
    let sensitivity = number_precision(true_positives/(true_positives+false_negatives), 4);
    let specificity = number_precision(true_negatives/(true_negatives+false_positives), 4);
    let precision = number_precision(true_positives/(true_positives+false_positives), 4);
    let recall = number_precision(true_positives/(true_positives+false_negatives), 4);
    display_message("sensitivity = " + sensitivity + "<br>"
                    + "specificity = " + specificity + "<br>"
                    + "precision = " + precision + "<br>"
                    + "recall = " + recall + "<br>",
                    'main',
                    true);
    display_message("true positives = " + true_positives + "<br>"
                    + "true negatives = " + true_negatives + "<br>"
                    + "false positives = " + false_positives + "<br>"
                    + "false negatives = " + false_negatives + "<br>"
                    + "not confident of any answer = " + not_confident_answers + "<br>"
                    + "total = " + total + "<br>",
                    'main',
                    true);
    add_textarea(histogram_buckets_to_html(histogram_buckets, histogram_image_size));
    add_textarea(confusion_matrix_to_html(confusion_matrix, 100));
};

const run_experiments = () => {
    const [next_image, reset_next_image] = create_next_image_generator();
    display_message("<p><b>Confidence scores for each possible classification. " + 
                    "<span style=color:red>Red entries</span> are where the correct classification " +
                    "was not the most confident answer.</b></p>",
                    'main');
    const next_experiment = () => {
        const class_finished = (class_index) => {
            const class_name = class_names[class_index];
            const total = number_of_images[class_name];
            display_message("<p>Number whose highest confidence score is the correct answer = " + 
                            number_right + "/" + total + 
                            " (" + Math.round(100*number_right/total) + "%)</p>",
                            'main',
                            true);
            add_textarea(csv[class_name]);
            number_right = 0;
        };
        const image_callback = (image_or_canvas, class_index, image_index, image_count) => {
            make_prediction(image_or_canvas, 
                            (result) => {
                                display_message(process_prediction(result, image_or_canvas, class_index, image_index, image_count),
                                                'main',
                                                true);
                                next_experiment(); 
                            });
        };
        next_image(image_callback, class_finished, report_final_statistics);
    };
    next_experiment();
};

const save_logits_as_tsv = (logits) => {
    const embedding = logits.dataSync();
    let tsv_row = "";
    embedding.forEach((weight) => {
        tsv_row += weight + "\t";
    });
    return tsv_row + "\n";
};

const sprite_size = 64; // not sure what's good
let sprite_image_width;
let sprite_image_x = 0;
let sprite_image_y = 0;

const create_sprite_image_canvas = () => {
    const canvas = document.createElement('canvas');
    let total_number_of_images = 
        Object.values(number_of_images).reduce((accumulator, currentValue) => accumulator + currentValue);
    const images_per_row = Math.ceil(Math.sqrt(total_number_of_images));
    sprite_image_width = images_per_row*sprite_size;
    canvas.width  = sprite_image_width;
    canvas.height = sprite_image_width;
    return canvas;
};

const add_image_to_sprite_image = (image_or_canvas, sprite_image_canvas) => {
    let x = sprite_image_x; // close over the current value
    let y = sprite_image_y;
    draw_maintaining_aspect_ratio(image_or_canvas,
                                  sprite_image_canvas,
                                  sprite_size,
                                  sprite_size,
                                  0,
                                  0,
                                  image.width,
                                  image.height,
                                  x,
                                  y);
    sprite_image_x += sprite_size;
    if (sprite_image_x >= sprite_image_width) {
        // new row
        sprite_image_x = 0;
        sprite_image_y += sprite_size;
    }
};

const add_textarea = (text) => {
    const text_area = document.createElement('textarea');
    text_area.style = "width: 400px; height: 400px";
    text_area.value = text;
    document.body.appendChild(text_area);
};

const save_tensors = (tensors) => {
    // based upon https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    // tried using JSON.stringify but arrays became "0":xxx, "1":xxx, ...
    // also needed to move tensors from GPU using dataSync
    let json = '{"nails_tensors":{';
    let keys = Object.keys(tensors);
    const jsonify_tensor = (tensor) => {
        let flat_array = tensor.dataSync();
        let shape = tensor.shape;
        json += '{"shape":' + JSON.stringify(shape) + ',' +
                '"data":' + JSON.stringify(Object.values(flat_array)) + '}';
    };
    keys.forEach(function (key, index) {
        json += '"' + key + '":[';
        let tensor_or_array_of_tensors = tensors[key];
        if (tensor_or_array_of_tensors instanceof Array) {
            json += '[';
            tensor_or_array_of_tensors.forEach((tensor, index) => {
                jsonify_tensor(tensor);
                if (index < tensor_or_array_of_tensors.length-1) { // except for last one
                    json += ',';
                 }
            });
            json += ']';
        } else {
            jsonify_tensor(tensor_or_array_of_tensors);
        }
        if (index === keys.length-1) {
            json += ']'; // no comma on the last one
        } else {
            json += '],';
        }
    });
    json += '},';
    json += '"labels":' + JSON.stringify(class_names);
    json += '}';
    add_textarea("window.saved_tensors = " + json);
};

const load_data_set = (data_set) => {
    const restore_tensor = (shape_and_data) => tf.tensor(shape_and_data.data, shape_and_data.shape);
    try {
        let tensor_data_set = {};
        Object.entries(data_set['nails_tensors']).forEach(function (entry) {
            if (entry[1][0] instanceof Array) {
                tensor_data_set[entry[0]] = entry[1][0].map(restore_tensor);
            } else {
                tensor_data_set[entry[0]] = restore_tensor(entry[1][0]);
            }
        });
        classifier.setClassifierDataset(tensor_data_set);
        return true;
    } catch (error) {
        alert("Error loading saved training: " + error);
    }
};

const on_click = () => {
    document.getElementById('user-agreement').remove();
    document.getElementById('camera-interface').hidden = true;
    document.getElementById('main').hidden = false;
};

window.addEventListener('DOMContentLoaded',
                        (event) => {
                            load_mobilenet(() => {
                                initialise_page();
                                if (option === 'diagnose') {
                                    add_random_images(() => {
                                        const agreement_button = document.createElement('button');
                                        agreement_button.innerHTML = "Accept";
                                        agreement_button.className = 'generic-button';
                                        agreement_button.addEventListener('click', on_click);
                                        document.getElementById('user-agreement').appendChild(agreement_button);
                                        document.getElementById('please-wait').hidden = true;                                    
                                    });
                                } else { // no need for agreement when training or experimenting
                                    on_click();
                                };                      
                            });
                        },
                        false);