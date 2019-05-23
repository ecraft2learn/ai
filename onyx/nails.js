// by Ken Kahn <toontalk@gmail.com> as part of the Onyx project at the University of Oxford
// copyright not yet determined but will be some sort of open source

const RUN_EXPERIMENTS = true;
// if tensor_tsv is defined then collect all the logits of each image into a TSV string (tab-separated values)
// let tensor_tsv; = "";
// let metadata_tsv = "";
const CREATE_SPRITE_IMAGE = false;
const SAVE_TENSORS = false;
const combine_non_serious = true;
let class_names = ["normal",
                   "serious",
                   "fungal",
                   "trauma"];
let class_colors = ["green",
                    "red",
                    "brown",
                    "blue",
                    "white"]; // no class
if (combine_non_serious) {
    class_names = class_names.slice(0, class_names.length-2);
    class_names.push("non-serious");
    class_colors =["green",
                    "red",
                    "brown",
//                  "blue",
                    "white"]; // no class
}
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

// number of nearest neighbours for KNN - one extra for experiments since we remove self-votes
let top_k = RUN_EXPERIMENTS ? 6 : 5;

const histogram_buckets = [];
const bucket_count = 5;
const histogram_image_size = 40;

const minimum_confidence = 60;

let false_negatives = 0;
let false_positives = 0;
let true_negatives = 0;
let true_positives = 0;
let not_confident_answers = 0; // less than minimum_confidence for top answer

const confusion_matrix = [];

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
"images/normal/Fingernail healthy Image_9d.png",
"images/normal/Karen IMG_1621-b.jpg",
],
"fungal": [
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
"trauma": [
"images/trauma/nail trauma 1.png",
// #2 was so insured that is wasn't usable
"images/trauma/nail trauma 3.png",
"images/trauma/nail trauma 4.png",
"images/trauma/nail trauma 5.png",
"images/trauma/nail trauma 6.png",
"images/trauma/nail trauma 7.png",
"images/trauma/nail trauma 8.png",
"images/trauma/nail trauma 9.png",
"images/trauma/nail trauma 10.png",
"images/trauma/nail trauma 11.png",
"images/trauma/nail trauma 12.png",
"images/Nail Images from Library book/minor trauma nail 1 habit tic deformity-a.jpg",
"images/Nail Images from Library book/minor trauma nail 1 habit tic deformity-b.jpg",
"images/Nail Images from Library book/minor trauma nail 2 habit tic deformity.jpg",
"images/trauma/Karen IMG_1621-a.jpg",
],
"serious": [
"images/splinter-haemorrhage/Fingernail unhealthy Image_1.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_10.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_11.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_12.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_13.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_14.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_15a.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_15b.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_15c.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_15d.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_15e.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_16a.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_16b.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_16c.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_17a.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_17b.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_17c.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_17d.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_17e.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_18a.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_18b.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_19a.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_19b.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_2.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_20a.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_20b.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_21a.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_21b.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_22.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_23.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_24.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_25.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_3.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_4a.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_4b.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_4c.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_4d.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_5.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_6.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_7.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_8a.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_8b.png",
"images/splinter-haemorrhage/Fingernail unhealthy Image_9.png",
"images/Nail Images from Library book/acute paronychia.jpg",
"images/Nail Images from Library book/glomus tumor of nail bed.jpg",
"images/Nail Images from Library book/half-and-half nail patient with renal failure.jpg",
"images/Nail Images from Library book/keratoachatoma of nailbed.jpg",
"images/Nail Images from Library book/keratonacanthoma of nail bed.jpg",
"images/Nail Images from Library book/Leuckonychia.jpg",
"images/Nail Images from Library book/Malignant melanoma of nail.jpg",
"images/Nail Images from Library book/median nail dystrophy.jpg",
"images/Nail Images from Library book/Melanoma in situ.jpg",
"images/Nail Images from Library book/melanotic macule.jpg",
"images/Nail Images from Library book/Mucous cyst.jpg",
"images/Nail Images from Library book/muehrche_s nails in patient with low albumin-a.jpg",
"images/Nail Images from Library book/muehrche_s nails in patient with low albumin-b.jpg",
"images/Nail Images from Library book/muehrche_s nails in patient with low albumin-c.jpg",
"images/Nail Images from Library book/muehrche_s nails in patient with low albumin-d.jpg",
"images/Nail Images from Library book/muehrche_s nails in patient with low albumin-e.jpg",
"images/Nail Images from Library book/muehrche_s nails in patient with low albumin-f.jpg",
"images/Nail Images from Library book/Myxoid pseudocyst of finger.jpg",
"images/Nail Images from Library book/Myxoid pseudocyst on toe.jpg",
"images/Nail Images from Library book/Onychomatricomas.jpg",
"images/Nail Images from Library book/Onychoschizia 2a.jpg",
"images/Nail Images from Library book/Onychoschizia 2b.jpg",
"images/Nail Images from Library book/Onychoschizia-a.jpg",
"images/Nail Images from Library book/Onychoschizia-b.jpg",
"images/Nail Images from Library book/secondary pseudomonas infection in onycholysis-a.jpg",
"images/Nail Images from Library book/secondary pseudomonas infection in onycholysis-b.jpg",
"images/Nail Images from Library book/squamous cell carcinoma 2.jpg",
"images/Nail Images from Library book/squamous cell carcinoma in situ nail.png",
"images/Nail Images from Library book/squamous cell carcinoma nail.JPG",
"images/Nail Images from Library book/staphylococcal infection.jpg",
"images/Nail Images from Library book/subungual exostosis of the nail.jpg",
"images/Nail Images from Library book/subungual exostosis of toe.jpg",
"images/Nail Images from Library book/subungual squamous cell carcinoma in situ.jpg"
],
"hands": [
"images/hands/Fingernail healthy Image_10.jpg",
"images/hands/Fingernail healthy Image_14.png",
"images/hands/Fingernail healthy Image_15.png",
"images/hands/Fingernail healthy Image_17.png",
"images/hands/Fingernail healthy Image_19.png",
"images/hands/Fingernail healthy Image_2.png",
"images/hands/Fingernail healthy Image_8.png",
"images/hands/Fingernail unhealthy Image_16.png",
"images/hands/Fingernail unhealthy Image_17.png",
"images/hands/Fingernail unhealthy Image_18.png",
"images/hands/Fingernail unhealthy Image_19.png",
"images/hands/Fingernail unhealthy Image_32.jpg",
"images/hands/Fingernail unhealthy Image_35.jpg",
"images/hands/Fingernail unhealthy Image_50.png",
"images/hands/Slide22.PNG",
],
"other": [
"images/other/architecture-1836070_960_720.jpg",
"images/other/Bali 064.jpg",
"images/other/Bali 102.jpg",
"images/other/Bali 118.jpg",
"images/other/brown.png",
"images/other/cat-3336579_960_720.jpg",
"images/other/grass.jpg",
"images/other/hand_WIN_20190405_13_58_34_Pro.jpg",
"images/other/hong kong.jpg",
"images/other/person-822681_960_720.jpg",
"images/other/small IMG_1990.JPG",
"images/other/snoopy.jpg",
"images/other/snow.jpg",
"images/other/tree-740901_960_720.jpg",
"images/other/white.png",
]
};

if (combine_non_serious) {
    images["non-serious"] = images["fungal"].concat(images["trauma"]);
}

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
  const reset_response_button = document.getElementById('reset_response');
  reset_response_button.addEventListener('click', reset_response);
  return new Promise((resolve) => {
      video.onloadedmetadata = () => {
          resolve(video);
      };
  });
}

const load_image = function (image_url, callback) {
    let image = new Image();
    image.src = image_url;
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
                    add_textarea(image_sprite_canvas.toDataURL() + "");
                }
                return;
            }
        } else {
            image_index++;
        }
        if (image_index !== except_image_index) {
            add_image_to_training(class_images[image_index], class_index, image_index, next_image);
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
        classifier.predictClass(logits, top_k).then((result) => {
            callback(result);          
        });
    });
};

const add_image_to_training = (image_url, class_index, image_index, continuation) => {
    load_image(image_url,
               (image) => {
                   logits = infer(image);
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

const load_mobilenet = async function () {
    classifier = knnClassifier.create();
    mobilenet_model = await mobilenet.load(2);  // version 2
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
    const start_up = () => {
        if (typeof tensor_tsv === 'string') {
            add_textarea(tensor_tsv);
            add_textarea(metadata_tsv);
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
            run_experiments(); // report any matches with confidence less than this confidence
        }
        if (SAVE_TENSORS) {
            save_tensors(classifier.getClassifierDataset());
        }
    };
    if (window.saved_tensors && !CREATE_SPRITE_IMAGE && !SAVE_TENSORS && !RUN_EXPERIMENTS) {
        load_data_set(window.saved_tensors);
        start_up();
    } else {
        add_images(start_up);
    }
};

const display_message = (message, append) => {
    if (append) {
        message = document.getElementById('response').innerHTML + "<br>" + message;
    }
    document.getElementById('response').innerHTML = message;
};

const reset_response = () => {
    document.getElementById('response').innerHTML = "";
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
    const confidences = result.confidences;
    let max_score = -1;
    let max_score_indices = [];
    for (let index = 0; index < class_names.length; index++) {
        let score = confidences[index];
        if (index === class_index) {
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
    let message = "<b>Confidences: </b>";
    let scores = [];
//     let name_of_highest_scoring_class;
//     let name_of_second_highest_scoring_class;
//     let highest_score = 0;
//     let second_highest_score = 0;
    class_names.forEach((name, class_index) => {
        let score = remove_one_vote(result.confidences[class_index], correct_class_index === class_index, running_tests);
        message += name + " = " + score + "%; ";
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
        if (scores[0].name === 'serious') {
            message += "It is most likely that the nail indicates something serious and you should seek medical advise. (Confidence score is "
                       + scores[0].score + "%)";
        } else if (scores[1].name === 'serious' && scores[1].score >= 20) {
            message += "It might be serious " + " (confidence score is " + scores[1].score + "%) ";
        } else {
            message += "The nail's condition is " + scores[0].name + " with confidence score of " + scores[0].score + "%.";
            if (scores[1].name === 'serious' && scores[1].score > 0) {
                message += " The confidence score for it being serious is " + scores[1].score + "%.";
            } else if (scores[1].score > 0) {
                message += " Otherwise it is " + scores[1].name + " with confidence score of " + scores[1].score + "%.";
            }
        }
    }
    return message;
};

const update_histogram = (result, correct_class_index, image_URL, title) => {
    const find_highest_wrong_class_index = (confidences, correct_class_index) => {
        let highest_wrong_class_index = class_names.length; // if no wrong scores returns number of classes
        let highest_wrong_score = 0;
        for (let index = 0; index < class_names.length; index++) {
            if (index !== correct_class_index && confidences[index] > highest_wrong_score) {
                highest_wrong_class_index = index;
                highest_wrong_score = confidences[index];
            }
        }
        return highest_wrong_class_index;
    };
    class_names.forEach((name, class_index) => {
        const correct = correct_class_index === class_index;
        const score = remove_one_vote(result.confidences[class_index], correct, true);
        const highest_wrong_class_index = find_highest_wrong_class_index(result.confidences, correct_class_index);
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
        const score = remove_one_vote(result.confidences[class_index], correct, true);
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
                            + "  <img src='../" + score.image_URL + "' width=" + image_size + " height=" + image_size + "  >\n"
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
        if (video_left > event.clientX ||
            video_top > event.clientY ||
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
                display_message("<img width=60 height=60 src='" + temporaray_canvas.toDataURL() + "'>", true);
                display_message(confidences(results, -1), true);
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
                display_message(confidences(results, -1), true);
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

const run_experiments = () => {   
    let class_index = 0;
    let image_index = -1; // incremented to 0 soon
    let number_right = 0;
    display_message("<p><b>Confidence scores for each possible classification. " + 
                    "<span style=color:red>Red entries</span> are where the correct classification " +
                    "was not the most confident answer.</b></p>");
    const next_experiment = () => {
        let class_images = images[class_names[class_index]];
        if (image_index === class_images.length-1) {
            // no more images for this class_index
            display_message("<p>Number whose highest confidence score is the correct answer = " + 
                            number_right + "/" + class_images.length + 
                            " (" + Math.round(100*number_right/class_images.length) + "%)</p>",
                            true);
            add_textarea(csv[class_names[class_index]]);
            number_right = 0;
            image_index = 0;
            class_index++;
            if (class_index === class_names.length) {
                let total = true_positives+true_negatives+false_positives+false_negatives+not_confident_answers;
                display_message("true positives = " + true_positives + "<br>"
                                + "true negatives = " + true_negatives + "<br>"
                                + "false positives = " + false_positives + "<br>"
                                + "false negatives = " + false_negatives + "<br>"
                                + "not confident of any answer = " + not_confident_answers + "<br>"
                                + "total = " + total + "<br>",
                                true);
                const number_precision = (x, n) => Math.round(x*Math.pow(10, n))/Math.pow(10, n);
                let sensitivity = number_precision(true_positives/(true_positives+false_negatives), 4);
                let specificity = number_precision(true_negatives/(true_negatives+false_positives), 4);
                let precision = number_precision(true_positives/(true_positives+false_positives), 4);
                let recall = number_precision(true_positives/(true_positives+false_negatives), 4);
                display_message("sensitivity = " + sensitivity + "<br>"
                                + "specificity = " + specificity + "<br>"
                                + "precision = " + precision + "<br>"
                                + "recall = " + recall + "<br>",
                                true);
                add_textarea(histogram_buckets_to_html(histogram_buckets, histogram_image_size));
                add_textarea(confusion_matrix_to_html(confusion_matrix, 100));
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
            const image_URL = images[class_name][image_index];
            const plain_text = (html) => {
                const div = document.createElement('div');
                div.innerHTML = html;
                return div.innerText;
            };
            load_image(image_URL,
                       async(image) => {
                           predict_class(image, (result) => {
                               let confidence = result.confidences[class_index];
                               display_message("<img src='" + image_URL + "' width=100 height=100></img>", true);
                               let confidence_message = confidences(result, class_index, true);
                               let message = class_name + "#" + image_index + " " + confidence_message;
                               let correct_prediction = correct(result, class_index);
                               if (correct_prediction) {
                                   number_right++;
                               } else {
                                   // highlight wrong ones in red
                                   message = "<span style='color:red'>" + message + "</span>";
                               }
                               if (combine_non_serious) {
                                   if (confidence_message.indexOf(not_confident_message) >= 0) {
                                       not_confident_answers++;
                                   } else if (class_index === 1) {// serious is index 1
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
                               display_message(message, true);
                               update_histogram(result, class_index, image_URL, plain_text(message));
                               update_confusion_matrix(result, class_index);
                               csv[class_name] += "https://ecraft2learn.github.io/ai/onyx/" + images[class_name][image_index] + "," +
                                                  image_index + ",";
                               csv_class_names[class_name].forEach((name) => {
                                   // this re-orders the results
                                   const index = class_names.indexOf(name);
                                   const correct = index === class_index;
                                   const score = remove_one_vote(result.confidences[index], correct, true);
                                   csv[class_name] += score;
                                   if (index < class_names.length-1) {
                                       // no need to add comma to the last one
                                       csv[class_name] += ",";
                                   }
                               });
                               csv[class_name] += "\n";
                               next_experiment();                          
                           });
                       });
        };
        test_image();
//         const clear_just_one_class = false;
//         if (clear_just_one_class) {
//             classifier.clearClass(class_index); // remove elements from this class
//         } else {
//             classifier.dispose();
//             classifier = knnClassifier.create();
//         }
//         add_images(test_image, clear_just_one_class, class_index, image_index); // put back all one
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
    let number_of_images = 0;
    Object.values(images).forEach((class_images) => {
        number_of_images += class_images.length;
    });
    const images_per_row = Math.ceil(Math.sqrt(number_of_images));
//     const images_per_row = sprite_image_width/sprite_size;
//     const number_of_rows = Math.ceil(number_of_images/images_per_row);
    sprite_image_width = images_per_row*sprite_size;
    canvas.width  = sprite_image_width;
    canvas.height = sprite_image_width;
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

const add_textarea = (text) => {
    const text_area = document.createElement('textarea');
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

window.addEventListener('DOMContentLoaded',
                        function (event) {
                            load_mobilenet().then(initialise_page);
                        },
                        false);