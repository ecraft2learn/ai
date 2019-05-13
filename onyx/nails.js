// by Ken Kahn <toontalk@gmail.com> as part of the Onyx project at the University of Oxford
// copyright not yet determined but will be some sort of open source

const RUN_EXPERIMENTS = false;
// if tensor_tsv is defined then collect all the logits of each image into a TSV string (tab-separated values)
let tensor_tsv; // = "";
let metadata_tsv; // = "";
const CREATE_SPRITE_IMAGE = false;
const SAVE_TENSORS = false;
const class_names = ["normal",
                     "splinter haemorrhage",
                     "fungal infection",
                     "hands",
                     "other"]; 
const csv = {"normal": "URL,ID,Normal,Splinter,Fungal,Hands,Other\n", // headers for normal images
             "splinter haemorrhage": "URL,ID,Splinter,Fungal,Normal,Hands,Other\n",
             "fungal infection": "URL,ID,Fungal,Splinter,Normal,Hands,Other\n",
             "hands": "URL,ID,Hands,Other,Normal,Splinter,Fungal\n",
             "other":  "URL,ID,Other,Hands,Normal,Splinter,Fungal\n"};
const csv_class_names = {"normal": ["normal", "fungal infection", "fungal infection", "hands", "other"],
                         "splinter haemorrhage": ["splinter haemorrhage", "fungal infection", "normal", "hands", "other"],
                         "fungal infection": ["fungal infection", "splinter haemorrhage", "normal", "hands", "other"],
                         "hands": ["hands", "other", "normal", "splinter haemorrhage", "fungal infection"],
                         "other": ["other", "hands", "normal", "splinter haemorrhage", "fungal infection"]};   

const TOPK = 21; // number of nearest neighbours for KNN - 20 is good and 1 for self vote that will be ignored

const histogram_buckets = [];
const bucket_count = 10;
const histogram_image_size = 40;

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
"splinter haemorrhage": [
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
"images/splinter-haemorrhage/Fingernail unhealthy Image_9.png"],
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
        classifier.predictClass(logits, TOPK).then((result) => {
            callback(result);          
        });
    });
};

const add_image_to_training = (image_url, class_index, image_index, continuation) => {
    load_image(image_url,
               (image) => {
                   logits = infer(image);
                   if (metadata_tsv === "") {
                       metadata_tsv = "Class\tImage ID\n";
                   }
                   if (tensor_tsv !== undefined) {
                       tensor_tsv += class_names[class_index] + "#" + image_index + "\t";
                       tensor_tsv += save_logits_as_tsv(logits);                       
                   }
                   if (metadata_tsv !== undefined) {
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
        if (tensor_tsv) {
            add_textarea(tensor_tsv);
            add_textarea(metadata_tsv);
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
            run_experiments(); // report any matches with confidence less than this confidence
        }
        if (SAVE_TENSORS) {
            save_tensors(classifier.getClassifierDataset());
        }
    };
    if (window.saved_tensors) {
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

const remove_one_vote = (score, self_vote) => {
    if (self_vote) {
        // remove the vote for itself
        score -= 1/TOPK;
    }
    score *= TOPK/(TOPK-1); // one fewer voters since ignoring self vote
    return Math.round(100*score); // convert to percentage
};

const correct = (result, class_index) => {
    const confidences = result.confidences;
    let max_score = -1;
    let max_score_indices = [];
    for (let index = 0; index < class_names.length; index++) {
        let score = confidences[index];
        if (index === class_index) {
            score -= 1/TOPK; // remove the self vote
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

const confidences = (result, correct_class_index) => {
    let message = "<b>Confidences: </b>";
    class_names.forEach((name, class_index) => {
        message += name + " = " + 
                   remove_one_vote(result.confidences[class_index], correct_class_index === class_index) + "%; ";
    });
    return message;
};

const update_histogram = (result, correct_class_index, image_URL, title) => {
    class_names.forEach((name, class_index) => {
        const correct = correct_class_index === class_index;
        const score = remove_one_vote(result.confidences[class_index], correct);
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
                     title: title,
                     image_URL: image_URL});
    });
};

const histogram_buckets_to_html = (histogram_buckets, image_size) => {
    const margin = 10;
    const bucket_increment = Math.floor(100/histogram_buckets.length);
    let html = "<html><body>\n";
    html += "<link href='../css/ai-teacher-guide.css' rel='stylesheet'>\n";
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
        html += "<div class='histogram_container' style='" 
                + "height:" + (max_correct_count+2)*(image_size+margin)
                + "px;'>\n";
        const buckets = histogram_buckets.map((bucket, bucket_index) => {
            let top = max_correct_count*(image_size+margin);
            bucket.forEach((score) => {
                if (score.correct_class_index === class_index && score.class_index === class_index) {
                    html += "<div class='histogram_image' title='" + score.title + "' "
                            + "style='"
                            + "left:" + (bucket_index*image_size+margin)  + "px;"
                            + " top:" + top + "px'>\n"
                            + "  <img src='" + score.image_URL + "' width=" + image_size + " height=" + image_size + "  >\n"
                            + "</div>\n";
                    top -= image_size+margin;
                }
           });
        });
        let x = 0;
        histogram_buckets.forEach((bucket, bucket_index) => {
            html += "<span class='x-axis-labels' style='left:" + (bucket_index*image_size+margin)
                    + "px;top:" + (max_correct_count+1)*(image_size+margin) + "px'>\n" + x + "</span>";
            x += bucket_increment;
        });
        html += "\n";
        html += "</div>\n";
   });
   html += "</body></html>\n";
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
                display_message(confidences(results, -1));
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
                display_message(confidences(results, -1));
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
                add_textarea(histogram_buckets_to_html(histogram_buckets, histogram_image_size));
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
                               let message = class_name + "#" + image_index + " " + confidences(result, class_index);
                               if (correct(result, class_index)) {
                                   number_right++;
                               } else {
                                   // highlight wrong ones in red
                                   message = "<span style='color:red'>" + message + "</span>";
                               }
                               display_message(message, true);
                               update_histogram(result, class_index, image_URL, plain_text(message));
                               csv[class_name] += "https://ecraft2learn.github.io/ai/onyx/" + images[class_name][image_index] + "," +
                                                  image_index + ",";
                               csv_class_names[class_name].forEach((name) => {
                                   // this re-orders the results
                                   const index = class_names.indexOf(name);
                                   const correct = index === class_index;
                                   const score = remove_one_vote(result.confidences[index], correct);
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
    add_textarea(json);
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