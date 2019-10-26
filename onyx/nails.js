// by Ken Kahn <toontalk@gmail.com> as part of the Onyx project at the University of Oxford
// copyright not yet determined but will be some sort of open source
'use strict';

let xs_validation = option === 'create model' ? [] : undefined;
let ys_validation = option === 'create model' ? [] : undefined;
let xs_test = option === 'create model' || option === 'experiment' ? [] : undefined;
let ys_test = option === 'create model' || option === 'experiment' ? [] : undefined;
let load_model_named = option !== 'create model' && model_name;
let loaded_model;

// if tensor_tsv is defined then collect all the logits of each image into a TSV string (tab-separated values)
let tensor_tsv   = projector_data ? "" : undefined;
let metadata_tsv = projector_data ? "" : undefined;
const CREATE_SPRITE_IMAGE = projector_data;

const VIDEO_WIDTH  = 224; // this version of MobileNet expects 224x224 images
const VIDEO_HEIGHT = 224;

const old_serious_name = "warrants second opinion";
const new_serious_name = "check with a doctor";
const name_substitutions = 
    {"warrants second opinion": new_serious_name,
     "non-serious": "abnormal but not serious"};
const border_class_name =
    {"warrants second opinion": "red-border",
     "non-serious": "amber-border",
     "normal": "green-border"};
const better_name = (name) =>
    name_substitutions[name] || name;

const number_of_random_images = 4;
const random_image_padding = 4;
const image_dimension = Math.floor(document.body.offsetWidth/number_of_random_images)
                        -2*random_image_padding;

if (is_chrome() && is_ios()) {
    const p = document.createElement('p');
    p.innerHTML = "<big>On iPhones and iPads this app only works in the Safari browser.</big>";
    document.body.insertBefore(p, document.body.firstChild)
}

const long_experimental_results = false;
const histogram_buckets = [];
const bucket_count = 20;
const histogram_image_size = 40;

const minimum_confidence = 60;

const confusion_matrix = [];

const class_names = typeof class_names_of_saved_tensors === 'undefined' ?
                    Object.keys(images) : 
                    class_names_of_saved_tensors;

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
    return (multi_nail_description && multi_nail_description.image_width) || 100; // 100x100 is used in the Korean images
};
const multi_nail_image_height = (multi_nail_description) => {
    return (multi_nail_description && multi_nail_description.image_height) || 100; // 100x100 is used in the Korean images
};
const multi_nail_image_delta_x = (multi_nail_description) => {
    return (multi_nail_description && multi_nail_description.delta_x) || 112; 
};
const multi_nail_image_delta_y = (multi_nail_description) => {
    return (multi_nail_description && multi_nail_description.delta_y) || 128; 
};
const multi_nail_image_start_x = (multi_nail_description) => {
    return (multi_nail_description && multi_nail_description.start_x) || 16; 
};
const multi_nail_image_start_y = (multi_nail_description) => {
    return (multi_nail_description && multi_nail_description.start_y) || 48; 
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

if (typeof images !== 'undefined') {
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
}

const number_precision = (x, n) => Math.round(x*Math.pow(10, n))/Math.pow(10, n);

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
    document.getElementById('camera-interface').appendChild(document.getElementById('camera-instructions'));
};

let email_link_added = false;

const display_results = (canvas) => {
    make_prediction(canvas, (results, logits) => {
        const data_url = canvas.toDataURL();
        const id = hex_md5(data_url);
        let result_description = process_prediction(results, canvas);
        const data = result_description
                     + "\nimage id = " + id
                     + "\ndata = " + logits;
//         if (!is_mobile()) {
//             result_description = "<img src='" + data_url + "' width=128 height=128></img><br>" 
//                                  + result_description;
//         }
        const message = result_description;
        const camera_image_element = document.getElementById('camera-image');
        if (is_mobile() && !is_beta()) {
            camera_image_element.width = 42;
            camera_image_element.height = 56;
            camera_image_element.hidden = false;
        }
        camera_image_element.src = data_url;
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

const is_beta = () => window.location.hash.indexOf('beta') >= 0;

const setup_camera = (callback) => {
  if (option !== 'diagnose') {
      callback();
      return;
  }
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
      if (is_mobile() || is_beta()) { // REMOVE is_beta eventually
          if (is_beta()) { // if successful is_mobile will do this without "beta"
              video.hidden = true;
              toggle_freeze_button.innerHTML = 
                    '<input type="file" accept="image/*" id="camera-input" name="camera-input" capture="environment">';
              toggle_freeze_button.addEventListener('change', (event) => {
                  if (event.target.files.length > 0) {
                      const file = event.target.files[0];
                      const url = window.URL.createObjectURL(file);
                      const image = predict_when_image_loaded();
                      image.src = url;
                  }
              });
          } else {
              toggle_freeze_button.innerHTML = "Click to take photo";
              toggle_freeze_button.addEventListener('click', analyse_camera_image);              
          }
      } else {
          toggle_freeze_button.addEventListener('click', toggle_click);  
      }
      video.onloadedmetadata = () => {
          if (is_mobile()) {
//               video.width = 224;
//               video.height = 224;
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
        display_message("Analysing...", 'random-image-response');
        const analyse_image_and_replace_self =
            (result) => {
                const class_index = class_names.indexOf(class_name);
                if (is_mobile()) {
                    // desktop version adds the image to its table
                    const image_element = document.getElementById('random-image-chosen');
                    image_element.src = get_url_from_image_or_canvas(image_or_canvas);
                    image_element.hidden = false;                    
                }
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

const load_image = function (image_url, callback, error_callback) {
    let image = new Image();
    image.onload = () => {
        callback(image);
    };
    if (error_callback) {
        image.onerror = error_callback;
    }
    image.src = image_url;
};

const get_url_from_image_or_canvas = (image_or_canvas) => {
    if (image_or_canvas instanceof HTMLCanvasElement) {
        return image_or_canvas.toDataURL();
    } else {
        return image_or_canvas.src;
    }
};

const shuffle = (a, seed) => {
/**
 * From https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
    const seedable_random = 
        seed ? 
        () => { // not so good but good enough
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }
        :
        Math.random;
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(seedable_random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;    
};

const start_training = () => {
    model_options.class_names = class_names.map(better_name); // for displaying confusion matrix
    model_options.model_name = model_name;
    let responses = [];
    const number_of_training_repeats = model_options.number_of_training_repeats;
    const next_training = () => {
        model_options.training_number = 1+responses.length; // for visualization tab names
        model_options.categorical = true;
        model_options.tfvis_options =
            {callbacks: ['onEpochEnd'],
             yAxisDomain: [.3, .8],
             width: 500,
             height: 300,
             measure_accuracy: true,
             display_confusion_matrix: true,
             display_collapsed_confusion_matrix: {indices: [[0, 1], [2]],
                                                  labels: ['OK', "Serious"]},
             display_layers_after_creation: true,
             display_layers_after_training: true,
             display_graphs: true};
        const error_callback = (error) => {
            report_error("Internal error: " + error.message);
        };
        model_options.datasets = collect_datasets();
        create_and_train_model(model_options,
                               model_callback,
                               error_callback);
    }
    const test_loss_message = document.createElement('p');
    let first_time = true;
    document.body.appendChild(test_loss_message);
    const model_callback = (response) => {
        if (first_time) {
            test_loss_message.innerHTML = response["Column labels for saving results in a spreadsheet"] + "<br>";
            first_time = false;
        }
        test_loss_message.innerHTML += response["Spreadsheet values"] + "<br>";
        responses.push(response);
        const label = "Save model #" + model_options.training_number;
        add_save_model_button(label, response.model, model_name);
        if (responses.length === number_of_training_repeats) {
            report_averages(responses, number_of_training_repeats);
        } else {
            next_training();
        }
    };
    next_training();
};

const collect_datasets = () => {
    return {xs_array: xs,
            ys_array: one_hot(ys, class_names.length),
            xs_validation_array: xs_validation,
            ys_validation_array: one_hot(ys_validation, class_names.length),
            xs_test_array: xs_test,
            ys_test_array: one_hot(ys_test, class_names.length)};
};

const one_hot = (array_of_class_indices, n) => {
    if (!array_of_class_indices) {
        return;
    }
    return array_of_class_indices.map((index) => {
        let vector = [];
        for (let i = 0; i < n; i++) {
            vector.push(i === index ? 1 : 0);
        }
        return vector;        
    });
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
            start_training();
        }
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
            logits.dispose();
        }   
        if (image_sprite_canvas) {
            add_image_to_sprite_image(class_images[image_index], image_sprite_canvas);
        }
        next_image(image_callback, when_all_finished)
    };
    next_image(image_callback, when_all_finished);
};

let current_logits;
const make_prediction = (image, callback) => {
    const logits = infer(image);
    if (current_logits) {
        current_logits.dispose(); // no longer needed
    }
    current_logits = logits;
    const logits_data = logits.dataSync();
    const prediction_tensor = loaded_model.predict([logits]);
    const prediction = prediction_tensor.dataSync();
    prediction_tensor.dispose();
    callback(prediction, logits_data);
};

// 'conv_preds' is the logits activation of MobileNet.
const infer = (image) => {
    if (!mobilenet_model) {
        return load_mobilenet(() => infer(image)); 
    }
    return mobilenet_model.infer(image, 'conv_preds');
};

const load_mobilenet = (callback) => {
    mobilenet.load({version: 2, alpha: 1}).then((model) => {
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
              start_up();
            },
         (error) => {
             unable_to_access_camera(error);       
         });
   } catch (error) {
        unable_to_access_camera(error);
   };
};

const report_error = (message) => {
    let info = document.getElementById('info');
    if (!info) {
        info = document.createElement('span');
        document.body.appendChild(info);
    }
    info.innerHTML = "<p style='font-size: x-large;'>" + message + "</p>";
};

const unable_to_access_camera = (error) => {
    report_error("Failed to access the camera. You can still click on random images. " + error.message);
};

const go_to_camera_interface = () => {
    document.getElementById('camera-interface').hidden = false;
    document.getElementById('tutorial-interface').hidden = true;
};

const go_to_tutorial_interface = () => {
    document.getElementById('camera-interface').hidden = true;
    document.getElementById('tutorial-interface').hidden = false;
};

const camera_interface = () => !document.getElementById('camera-interface').hidden;

const equalize_classes = () => {
    const sizes = [];
    let previous_start = 0;
    for (let class_index = 0; class_index < class_names.length; class_index++) {
        let start = ys.indexOf(class_index+1);
        if (start < 0) {
            start = ys.length;
        }
        const size = start-previous_start;
        sizes.push(size);
        previous_start = start;
    }
    const min_size = Math.min(...sizes);
    for (let class_index = 0; class_index < class_names.length; class_index++) {
        const excess = sizes[class_index]-min_size;
        const start = ys.indexOf(class_index);
        xs.splice(start, excess);
        ys.splice(start, excess);
        sources.splice(start, excess);
    }
    const stringify_with_new_lines = (array) => {
        let string = "[";
        array.forEach((element) => {
            string += element instanceof Array ? '[' + element + '],\n' : '"' + element + '",\n';
        });
        return string + "]";
    }
    add_download_button(stringify_with_new_lines(xs), "[" + ys + "]", stringify_with_new_lines(sources));
}

const de_duplicate = () => {
    const clean_up_source = (source) => {
        const undefined_start = source.indexOf('#undefined'); // should be there
        if (undefined_start >= 0) {
            return source.slice(0, undefined_start);
        }
        return source;
    };
    const threshold = 1e-3;
    const second_threshold = 1e-2; // didn't find any > 1e-3 and < 1e-2 - also tried 1e-1 but then did get clearly different images
    let new_xs = "[";
    let new_ys = "[";
    let new_sources = "[";
    for (let class_index = 0; class_index < class_names.length; class_index++) {
        ys.forEach((y, i) => {
            if (y === class_index) {
                // only look for duplicates within a class
                const xs_i_tensor = tf.tensor(xs[i]);
                let duplicate_found_distance = false;
                for (let j = i+1; j < xs.length; j++) {
                    if (ys[j] === class_index) {
                        const xs_j_tensor = tf.tensor(xs[j]);
                        const distance_tensor = tf.losses.meanSquaredError(xs_i_tensor, xs_j_tensor);
                        const distance = distance_tensor.dataSync()[0];
                        xs_j_tensor.dispose();
                        if (distance < second_threshold) {
                            duplicate_found_distance = distance;
                            if (distance >= threshold) {
                                // report those between the two thresholds
                                console.log(duplicate_found_distance, sources[i], sources[j], xs[i], ys[i]);
                            }
                            break;
                        }
                    }
                }
                if (duplicate_found_distance === false) {
                    new_xs += "[" + xs[i] + "],\n";
                    new_ys += ys[i] + ",";
                    new_sources += '"' + clean_up_source(sources[i]) + '",\n';
                } else {
                    duplicate_found_distance = false;
                }
                xs_i_tensor.dispose();
            }
        });
    }
    add_download_button(new_xs + "]", new_ys + "]", new_sources + "]");
};

const add_download_button = (xs_string, ys_string, sources_string) => {
    const button =
        download_string("Download tensors",
                        "saved-tensors.js",
                        "window.class_names_of_saved_tensors = " + JSON.stringify(class_names) + ";\n" +
                        "window.xs = " + xs_string + ";\n" +
                        "window.ys = " + ys_string + ";\n" +
                        "window.sources = " + sources_string + ";\n");
    document.body.appendChild(button);
};

const start_up = () => {
    if (option === 'create model') {
        document.body.innerHTML = "Training started";
        start_training();
        return;
    } 
    if (option === 'de-duplicate') {
        document.body.innerHTML = "De-duplication started";
        de_duplicate();
        return;
    }
    if (option === 'search') {
        document.body.innerHTML = "Hyperparameter search started. <span id='experiment-number'>0</span>";
        model_options.on_experiment_end = () => {
            document.getElementById('experiment-number').innerHTML =
                +document.getElementById('experiment-number').innerHTML + 1;
        }
        model_options.class_names = class_names;
        search(collect_datasets());
        return;
    }
    if (option === 'equalize') {
        document.body.innerHTML = "Equalization started";
        equalize_classes();
        return;
    }
//     const use_photo = "Or take a picture of a finger or toe nail on a screen or in a photograph. ";
    const instructions = is_mobile() ?
                         (is_beta() ? 
                            "Take a picture using your camera app by tapping 'Choose file'." :
                            "Take a picture of your fingernail using your device by clicking the button below. ")
//                          + use_photo
                         + "Make sure only one nail is visible in each photo." :
                         "Take a picture by clicking the button below. "
//                          + use_photo 
                         + "Then you will be able to select a nail in the image.";
    document.getElementById('camera-instructions').innerHTML = 
        video ? instructions : "Camera not available";
    if (typeof tensor_tsv === 'string' && long_experimental_results) {
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
    if (load_model_named) { 
        tf.loadLayersModel("models/" + load_model_named + ".json").then((model) => {
            loaded_model = model;
            if (option === 'experiment') {
                run_experiments();
            }
        });
    } else{
        alert("Expected load_model_named to have a value.")
    }
    document.getElementById('go-to-camera').addEventListener('click', go_to_camera_interface);
    document.getElementById('go-to-tutorial').addEventListener('click', go_to_tutorial_interface);
};


const remove_my_message = (event) => {
    // used in onclick in HTML
    const my_message = event.currentTarget.closest('.message-element');
    my_message.remove(); 
};

const display_message = (message, element_id, append) => {
    if (message === "") {
        return;
    }
    const element = document.getElementById(element_id || 'main');
    const message_element = document.createElement('span');
    message_element.className = 'message-element'; // no CSS used to remove this element later
    message_element.innerHTML = message;
    if (element && append && !is_mobile()) {
        element.insertBefore(message_element, element.firstChild);
    } else if (element.childElementCount === 0) {
        element.appendChild(message_element);
    } else {
        element.replaceChild(message_element, element.firstElementChild);
    }
};

const reset_response = () => {
    document.getElementById('camera-response').innerHTML = "";
};

const correct = (result, class_index) => {
    // only called if running tests
    let max_score = -1;
    let max_score_indices = [];
    for (let index = 0; index < class_names.length; index++) {
        let score = result[index];
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

const not_confident_message = "The app is not very sure whether the nail is OK or not. Sorry.";

const confidences = (result, full_description, correct_class_index) => {
    let message = "Analysis by this app indicates ";
    let scores = [];
    let scores_message = "";
    let traffic_light_class; // either "green_light", "amber_light", or "red_light"
//     let name_of_highest_scoring_class;
//     let name_of_second_highest_scoring_class;
//     let highest_score = 0;
//     let second_highest_score = 0;
    class_names.forEach((name, class_index) => {
        let score = Math.round(result[class_index]*100)
        if (full_description) {
            scores_message += better_name(name) + " = " + score + "%; ";
        }
        scores.push({name: name,
                     score: score});
    });
//     if (full_description) {
//         message += "<br>";
//     }
    scores.sort((name_score_1, name_score_2) => {
        return name_score_2.score-name_score_1.score;
    });
    if (scores[0].name === old_serious_name) {
        traffic_light_class = 'red-light';
    } else if (scores[0].name === 'non-serious') {
        traffic_light_class = 'amber-light';
    } else {
        traffic_light_class = 'green-light';
    }
    if (scores[0].score < minimum_confidence) {
        message = not_confident_message;
        traffic_light_class = 'gray-light';
    } else {
        if (scores[0].name === old_serious_name) {
            message += "it is most likely this warrants a second opinion and you should seek medical advice.";
            if (full_description) {
                message + " (Confidence score is " + scores[0].score + "%)";
            }
        } else if (scores.length > 1 && scores[1].name === old_serious_name && scores[1].score >= 20) {
            message += "that perhaps a doctor should be consulted.";
            if (full_description) {
                message + " (Confidence score is " + scores[1].score + "%)";
            }
        } else {
            message += "the nail's condition is " + better_name(scores[0].name);
            if (full_description) {
                message += " with a confidence of " + scores[0].score + "%. ";
                if (scores.length > 1 && scores[1].name === old_serious_name && scores[1].score > 0) {
                    message += "The confidence score for consulting a doctor is " + scores[1].score + "%.";
                } else if (scores.length > 1 && scores[1].score > 0) {
                    message += "Otherwise it is " + scores[1].name + " with confidence of " + scores[1].score + "%.";
                }
            } else {
                message += ".";
            }
        }
    }
    if (full_description) {
        message = scores_message + "<br>" + message;
    }
    return "<span class=" + traffic_light_class + ">" + message + "</span>";
};

const update_histogram = (result, correct_class_index, image_URL, title) => {
    const find_highest_wrong_class_index = (result, correct_class_index) => {
        let highest_wrong_class_index = class_names.length; // if no wrong scores returns number of classes
        let highest_wrong_score = 0;
        for (let index = 0; index < class_names.length; index++) {
            const confidence = result[index]
            if (index !== correct_class_index && confidence > highest_wrong_score) {
                highest_wrong_class_index = index;
                highest_wrong_score = confidence;
            }
        }
        return highest_wrong_class_index;
    };
    if (long_experimental_results) {
        class_names.forEach((name, class_index) => {
            const correct = correct_class_index === class_index;
            const score = Math.round(100*result[class_index]);
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
    }
};

const update_confusion_matrix = (result, correct_class_index) => {
    class_names.forEach((name, class_index) => {
        const correct = correct_class_index === class_index;
        const score = Math.round(result[class_index]*100);
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
    const source_width_height_ratio = source_width/source_height;
    const destination_width_height_ratio = destination_width/destination_height;
    const source_destination_ratio = source_width_height_ratio/destination_width_height_ratio;
    // if source doesn't have the same aspect ratio as the destination then
    // draw it centered without changing the aspect ratio
    if (source_destination_ratio > 1) {
        const height_before_adjustment = destination_height;
        destination_height /= source_destination_ratio;
        destination_y = (height_before_adjustment-destination_height)/2;
    } else if (source_destination_ratio < 1) {
        const width_before_adjustment = destination_width;
        destination_width *= source_destination_ratio;
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
                                          temporary_canvas.width,
                                          temporary_canvas.height,
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
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const image = predict_when_image_loaded();
        image.src = reader.result;
    };  
};

const predict_when_image_loaded = () => {
    const image = new Image();
    image.onload = (event) => {
        const canvas = document.getElementById('canvas');
        canvas.getContext('2d').drawImage(event.currentTarget, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        if (video) { // device might not have a camera
            canvas.hidden = false;
            video.hidden = true;
        }
        make_prediction(canvas, (results) => {
            display_message(process_prediction(results, canvas), 'camera-response', true);
            if (!is_mobile() || !is_beta()) {
                // only desktop non-beta do this
                display_message("You can select a sub-region of your image.", 'camera-response', true);
                if (video) {
                    const video_button = document.getElementById('toggle video');
                    video_button.innerHTML = "Restore camera";
                }
            }
        });
    };
    return image;
};

const canvas_of_multi_nail_image = (multi_nail_image, box, width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width || image_dimension;
    canvas.height = height || image_dimension;
    draw_maintaining_aspect_ratio(multi_nail_image,
                                  canvas,
                                  canvas.width,
                                  canvas.height,
                                  box.x,
                                  box.y,
                                  box.width,
                                  box.height);
    return canvas;
};

const multi_nail_image_box = (image_description, image_index, width) => {
    if (!width) {
        width = image_description.dimensions.width;
    } 
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

// redo this using https://stackoverflow.com/questions/57296471/how-can-one-use-tensorflow-js-tf-data-generator-for-remote-data-sources-since-ge

// partial attempt to use JavaScript generators but doesn't work well with callbacks from image loading
// const next_image_generator = {*generator () {
//     let class_index = 0;
//     let image_index = -1; // incremented to 0 soon - this is the index into the list of image file_names or multi-images
//     let image_count = 0;
//     let multi_nail_image; // image that has multiple nails on it
//     let multi_nail_description; // object with at least file_name and count attributes
//     let nails_remaining_in_multi_nail = 0;
//     const class_name = class_names[class_index];
//     if (image_count >= number_of_images[class_name]-1) { 
//         // no more images for this class_index
//         image_index = 0;
//         image_count = 0;
//         multi_nail_image = undefined;
//         class_index++;
//         if (class_index === class_names.length) { // no more classes 
//             return; // done
//         } else {
//             image_count++;
//             if (nails_remaining_in_multi_nail > 0) {
//                 nails_remaining_in_multi_nail--;
//             } else {
//                 image_index++;
//                 multi_nail_image = undefined;
//             }
//         }
//         const maximum_confidence = (confidences) => {
//             return Math.max(...Object.values(confidences));
//         };
//         const canvas_of_next_nail_in_multi_nail_image = (images_description) => 
//             canvas_of_multi_nail_image(multi_nail_image,
//                                        multi_nail_image_box(images_description, nails_remaining_in_multi_nail));
//         const load_or_extract_image = (image_callback) => {
//             const class_name = class_names[class_index];
//             const image_or_images_description = images[class_name][image_index];
//             if (!image_or_images_description) {
//                 // no images for this class since testing other things
//                 return;
//             }
//             if (typeof image_or_images_description !== 'string') {
//                 if (multi_nail_image) {
//                     // no need to load it again
//                     image_callback(canvas_of_next_nail_in_multi_nail_image(image_or_images_description),
//                                    class_index, image_index, image_count);
//                     return;
//                 }
//                 load_image(image_or_images_description.file_name,
//                            (image) => {
//                                multi_nail_image = image;
//                                multi_nail_description = image_or_images_description;
//                                nails_remaining_in_multi_nail = 
//                                    number_of_images_in_multi_nail_file(image_or_images_description);
//                                load_or_extract_image();
//                            });
//                 return;
//             }
//             load_image(image_or_images_description, 
//                        (image) => {
//                            image_callback(image, class_index, image_index, image_count);
//                        });
//         };
//         yield load_or_extract_image; // the function to call with an image callback to get an image
//     };
// }};

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
    const next_image = (image_callback, when_all_finished, skip) => {
        const class_name = class_names[class_index];
        if (image_count >= number_of_images[class_name]-1) { 
            image_index = 0;
            image_count = 0;
            multi_nail_image = undefined;
            class_index++;
            if (class_index === class_names.length) { // no more classes 
                if (when_all_finished) {
                    when_all_finished();
                };
                return;
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
            if (skip) {
                return;
            }
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
                                   class_index, image_index, image_count, nails_remaining_in_multi_nail);
                    return;
                }
                load_image(image_or_images_description.file_name,
                           (image) => {
                               multi_nail_image = image;
                               multi_nail_description = image_or_images_description;
                               nails_remaining_in_multi_nail = 
                                   number_of_images_in_multi_nail_file(image_or_images_description);
                               load_or_extract_image();
                           },
                           (error) => {
                               console.error(image_or_images_description.file_name);
                               next_image(image_callback, when_all_finished, skip);
                           });
                return;
            }
            load_image(image_or_images_description, 
                       (image) => {
                           image_callback(image, class_index, image_index, image_count);
                       },
                       (error) => {
                           console.error(image_or_images_description);
                           next_image(image_callback, when_all_finished, skip);
                       });
        };
        load_or_extract_image();
    };
    return [next_image, reset_next_image];
};

const run_experiments = () => {
    const [next_image, reset_next_image] = create_next_image_generator();
    let image_counter = 0;
    let confidences = {};
    class_names.forEach((class_name) => {
        confidences[class_name] = [];
    });
    const when_finished = () => {
        class_names.forEach((class_name, index) => {
            confidences[class_name].sort((x, y) => x[0]-y[0]).forEach((confidence_and_message) => {
                display_message(confidence_and_message[1], 'main', true);
            });
            if (long_experimental_results) {
                add_textarea(csv[class_name]);                
            }
        });
        report_final_statistics();
        display_message("<h2>" + load_model_named + "</h2>", 'main', true);      
    };
    const next = (image, class_index, image_index, image_count) => {
        image_counter++;
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
        confidences[class_name].push([confidence, message]);
        if (long_experimental_results) {
            csv[class_name] += "https://ecraft2learn.github.io/ai/onyx/"
                               + images[class_name][image_index] + ","
                               + image_count + "," + confidence + "\n";                
        }
        next_image(next, when_finished);
    };
    next_image(next);
};

let false_negatives = 0;
let false_positives = 0;
let true_negatives = 0;
let true_positives = 0;
let number_right = 0;
let not_confident_answers = 0; // less than minimum_confidence for top answer 

window.full_popup_messages = [];

const MORE_DETAILS = "More details";
// const LESS_DETAILS = "Less details";

const process_prediction = (result, image_or_canvas, class_index, image_index, image_count) => {
    const image_url = get_url_from_image_or_canvas(image_or_canvas);
    const correct_prediction = correct(result, class_index);
    let message = "<table><tr>";
    if (!is_mobile()) {
        message += "<td><img src='" + image_url + "' width=128 height=128></img></td>";
    }
    const full_confidence_message = confidences(result, true, class_index);
    const short_confidence_message = confidences(result, false, class_index);
    const class_name = class_names[class_index];
    window.full_popup_messages.push(full_confidence_message);
    const more_details_html = 
        "<td><div class='clickable' onclick='add_full_message(event, "
        + (window.full_popup_messages.length-1) + ")'"
        + " title='Click for more details.'>"
        + "<span class='generic-button more-button'>" + MORE_DETAILS + "</span>"
        + "</div></td>"
    message += "<td>" + short_confidence_message + "</td>";       
    if (image_or_canvas.title && window.location.hash.indexOf('debug') >= 0) {
        message += "&nbsp;"
                   + "<a href='"
                   + image_or_canvas.title
                   + "' target='_blank'>"
                   + "image source"
                   + "</a>";
    }
    if (typeof image_count !== 'undefined') { // or would option === 'experiment' be clearer
        message += "&nbsp;" + better_name(class_name) + "#" + image_count;
    } else if (class_name) {
        if (correct_prediction && short_confidence_message.indexOf(not_confident_message) < 0) {
            message += "<td>Experts who analysed this photo agree.</td>";
        } else {
            message += "<td><span style='color:red;'>However according to experts, this image is ";
            if (class_name === old_serious_name) {
                message += "a condition that should be seen by a doctor. ";
            } else if (class_name === 'non-serious') {
                message += "abnormal but not serious. ";
            } else if (class_name === 'normal') {
                message += "normal. ";
            }
            message += "</span></td>";
        }
    }
    if (correct_prediction) {
        number_right++;
        if (!long_experimental_results && option === 'experiment') {
            message = ""; // if not long results only display the problem cases
        }
    } else {
        if (long_experimental_results) {
            // highlight wrong ones in red
            message = "<span style='color:red'>" + message + "</span>";            
        }     
    }
    if (full_confidence_message.indexOf(not_confident_message) >= 0) {
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
        if (long_experimental_results) {
            update_histogram(result, class_index, image_url, plain_text(message));
            update_confusion_matrix(result, class_index);
            csv[class_name] += "https://ecraft2learn.github.io/ai/onyx/" + images[class_name][image_index] + "," +
                                image_count + ",";
            csv_class_names[class_name].forEach((name) => {
                // this re-orders the results
                const index = class_names.indexOf(name);
                const correct = index === class_index;
                const score = Math.round(result[index]*100);
                csv[class_name] += score;
                if (index < class_names.length-1) {
                    // no need to add comma to the last one
                    csv[class_name] += ",";
                }
            });
            csv[class_name] += "\n";
        }        
    }
    message = response_element(message + more_details_html);
    if (is_mobile()) {
        // saves screen real estate while results are being displayed
        document.getElementById('go-to-tutorial').classList.add('back-to-tutorial-button');
    }
    return message;
};

const full_response_class = 'response-text full-response';

const width_of_multi_nail_images = 2260;

const number_of_close_images = 10;
const size_of_close_images = 96;

const add_full_message = (event, message_number) => {
    event.stopPropagation();
    const full_response_element = document.createElement('div');
    full_response_element.className = full_response_class;
//     const hide_full_response = () => {
//         const full_response = event.currentTarget.children[1];
//         if (full_response && full_response.className === full_response_class) {
//             full_response.remove();
//             more_button.firstElementChild.innerHTML = MORE_DETAILS;            
//         }
//     };
    const more_button = event.currentTarget;
//     if (more_button.firstElementChild.innerText === MORE_DETAILS) {
//         more_button.firstElementChild.innerHTML = LESS_DETAILS;
//     } else {
//         hide_full_response();
//         return;
//     }
    const why_button = document.createElement('button');
    let explanation;
    const display_closest_images = (sorted_image_labels_and_sources) => {
        const images = document.createElement('div');
        images.className = "center-contents";
        let index = 0;
        const next_image = () => {
            const [label, source, distance] = sorted_image_labels_and_sources[index];
            let file_name, image_number;
            if (source.indexOf('#') < 0) {
                file_name = source;
            } else {
                [file_name, image_number] = source.split('#');
            }
            load_image(file_name,
                       (image_or_canvas) => {
                           if (index === 0) {
                               // first one displayed
                               document.getElementById('please-wait-for-images').remove();
                           }
                           if (image_number) {
                               const box = multi_nail_image_box(undefined, +image_number, width_of_multi_nail_images);
                               image_or_canvas = canvas_of_multi_nail_image(image_or_canvas, box, size_of_close_images, size_of_close_images);
                           } else {
                               image_or_canvas.width  = size_of_close_images;
                               image_or_canvas.height = size_of_close_images;
                           }
                           image_or_canvas.title = better_name(label) + " and distance is " + distance.toFixed(3) +
                                                   // following only useful for development
                                                   " (" + file_name + 
                                                   (image_number ? "#" + image_number : "") + ")";
                           const frame = document.createElement('span');
                           frame.className = border_class_name[label];
                           frame.appendChild(image_or_canvas);
                           images.appendChild(frame);
                           index++;
                           if (index < sorted_image_labels_and_sources.length) {
                               next_image();
                           }
                       });
        };
        next_image();
        full_response_element.appendChild(images);
    };
    const explain_why = (event) => {
        explanation = document.createElement('div');
        explanation.innerHTML = "Of the thousands of images used in training here are the " + 
                                number_of_close_images + " closest images." +
                                "<span id='please-wait-for-images'>&nbsp;Searching. Please wait.</span>";
        explanation.className = 'center-contents';
        full_response_element.appendChild(explanation);
        show_closest_images(number_of_close_images, current_logits, display_closest_images);
        why_button.remove();
    };
    why_button.innerHTML = "Why?";
    why_button.className = 'generic-button no-margin';
    why_button.title = "Click to see the images used in training closest to this one."
    why_button.addEventListener('click', explain_why);      
    const row = more_button.closest('tr');
    // copy of photo not in the row if mobile since there is only one row
    const short_response_element_index = is_mobile() ? 0 : 1; 
    const short_response_element = row.children[short_response_element_index];
    row.replaceChild(full_response_element, short_response_element);       
    full_response_element.innerHTML = window.full_popup_messages[message_number];
    more_button.parentElement.replaceChild(why_button, more_button); 
};

const response_element = (message) => {
    if (message === "") {
        return message;
    }
    if (is_mobile()) {
        return message + "</table>";
    }
    return message
           + "<td><button class='x-close-button' onclick='remove_my_message(event)'>&times;</button></td></table>";
};

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
    if (long_experimental_results) {
        add_textarea(histogram_buckets_to_html(histogram_buckets, histogram_image_size));
        add_textarea(confusion_matrix_to_html(confusion_matrix, 100));        
    }
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

const create_anchor_that_looks_like_a_button = (label, listener) => {
    let button = document.createElement('a');
    button.innerHTML = label;
    button.className = 'generic-button';
    button.href = "#";
    button.addEventListener('click', listener);
    return button;
};

const download_string = (label, name, data) => {
    const button = create_anchor_that_looks_like_a_button(label);
    const file = new Blob([data], {type: 'text'});
    button.href = URL.createObjectURL(file);
    button.download = name;
    return button;
};

const on_click = () => {
    const user_agreement = document.getElementById('user-agreement');
    if (!user_agreement) {
        return;
    }
    user_agreement.remove();
    document.getElementById('camera-interface').hidden = true;
    document.getElementById('main').hidden = false;
};

const update_page = () => {
    document.getElementById('agreement').innerHTML =
        "<p class='agreement-text'>The Onyx app contains general information about nail conditions and does not constitute medical advice. "
        + "If you have any specific questions about any medical matter, you should consult your doctor or other professional healthcare provider.</p>" 
        + "<p class='agreement-text'>Images taken through this app are processed locally on your device. "
        + "Images will neither be processed nor stored remotely.</p>"
        + "<p class='agreement-text'>The <a href='https://github.com/ecraft2learn/ai/tree/master/onyx' target='_blank'>source code</a> "
        + "for this app is available for inspection. Visit the <a href='http://www.mhealthpartners.org/projects/onyx/' target='_blank'>Onyx home page</a> "
        + "to learn more about this project and app.</p>"
};

const save_tensors = () => {
    let xs = "[";
    let ys = "[";
    let sources = "[";
    let image_counter = 0;
    const image_counts_per_class = class_names.map(() => 0);
    const [next_image, reset_next_image] = create_next_image_generator();
    const when_finished = () => {
        add_download_button(xs + "]", ys + "]", sources + "]");
         console.log(image_counts_per_class);
    }
    const next = (image_or_canvas, class_index, image_index, image_count, thumbnail_index) => {
        const logits = infer(image_or_canvas);
        const shorten_weight = (x) => {
            if (x === 0) {
                return 0;
            }
            const short_form = x.toFixed(4);
            if (short_form[0] === '0') {
                return short_form.slice(1); // save some space since 0.xx can occur almost 8 million times
            }
            return short_form;
        };
        const logits_as_string =  "[" + logits.arraySync()[0].map(shorten_weight) + "]";
        logits.dispose();
        const file_name_or_description = images[class_names[class_index]][image_index];
        const file_name = typeof file_name_or_description === 'string' ?
                          file_name_or_description :
                          file_name_or_description.file_name;
        if (xs.indexOf(logits_as_string) < 0) {
            xs += logits_as_string + ",\n";  
            ys += class_index + ",";
            image_counter++;
            image_counts_per_class[class_index]++;
            if (image_counter === stop) {
                when_finished();
                return;
            }
            sources += "'" + file_name + "#" + thumbnail_index + "',\n";   // new line since huge lines cause editors to hang
        } else {
            console.log(file_name, thumbnail_index);
        }
        next_image(next, when_finished);
    }
    next_image(next, when_finished);
};

const show_closest_images = (n, image_logits, callback) => {
    const when_tensors_loaded = () => {
        const sorted_images = image_sources_sorted_by_cosine_proximity(image_logits);
        callback(sorted_images.slice(0, n));
    };
    if (typeof xs === 'undefined') {
        load_saved_tensors(when_tensors_loaded);
    } else {
        when_tensors_loaded();
    }
};

const load_saved_tensors = (callback) => {
    const script = document.createElement('script');
    script.onload = callback;
    script.src = saved_tensor_file_name;
    script.charset = "UTF-8";
    document.head.appendChild(script);
};

const image_sources_sorted_by_cosine_proximity = (image_logits) => {
    if (xs instanceof Array) {
        xs = tf.tensor(xs);
    }
    const cosines_tensor = tf.metrics.cosineProximity(image_logits, xs);
    const cosines = cosines_tensor.arraySync();
    // using tf.tidy instead of explicitly disposing of tensors caused Snap! to repeated call this
    cosines_tensor.dispose();
    const labels_and_cosines =
        cosines.map((cosine, index) => [class_names_of_saved_tensors[ys[index]], sources[index], 1-Math.abs(cosine)]);                                       
    return labels_and_cosines.sort((a, b) => a[2]-b[2]);
};

window.addEventListener('DOMContentLoaded',
                        (event) => {
                            update_page();
                            load_mobilenet(() => {
                                if (option === 'save tensors') {
                                    save_tensors();
                                    return;
                                }
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

// if I ever need to sae and restore KNN classifiers:

// const save_tensors = (tensors) => {
//     // based upon https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
//     // tried using JSON.stringify but arrays became "0":xxx, "1":xxx, ...
//     // also needed to move tensors from GPU using dataSync
//     let json = '{"nails_tensors":{';
//     let keys = Object.keys(tensors);
//     const jsonify_tensor = (tensor) => {
//         let flat_array = tensor.dataSync();
//         let shape = tensor.shape;
//         json += '{"shape":' + JSON.stringify(shape) + ',' +
//                 '"data":' + JSON.stringify(Object.values(flat_array)) + '}';
//     };
//     keys.forEach(function (key, index) {
//         json += '"' + key + '":[';
//         let tensor_or_array_of_tensors = tensors[key];
//         if (tensor_or_array_of_tensors instanceof Array) {
//             json += '[';
//             tensor_or_array_of_tensors.forEach((tensor, index) => {
//                 jsonify_tensor(tensor);
//                 if (index < tensor_or_array_of_tensors.length-1) { // except for last one
//                     json += ',';
//                  }
//             });
//             json += ']';
//         } else {
//             jsonify_tensor(tensor_or_array_of_tensors);
//         }
//         if (index === keys.length-1) {
//             json += ']'; // no comma on the last one
//         } else {
//             json += '],';
//         }
//     });
//     json += '},';
//     json += '"labels":' + JSON.stringify(class_names);
//     json += '}';
//     add_textarea("window.saved_tensors = " + json);
// };

// const load_data_set = (data_set) => {
//     const restore_tensor = (shape_and_data) => tf.tensor(shape_and_data.data, shape_and_data.shape);
//     try {
//         let tensor_data_set = {};
//         Object.entries(data_set['nails_tensors']).forEach(function (entry) {
//             if (entry[1][0] instanceof Array) {
//                 tensor_data_set[entry[0]] = entry[1][0].map(restore_tensor);
//             } else {
//                 tensor_data_set[entry[0]] = restore_tensor(entry[1][0]);
//             }
//         });
//         classifier.setClassifierDataset(tensor_data_set);
//         return true;
//     } catch (error) {
//         alert("Error loading saved training: " + error);
//     }
// };