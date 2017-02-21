var video = document.createElement('video');
var canvas = document.createElement('canvas');

var get_url_parameter = function (name, prompt_message) {
    var parts = window.location.search.substr(1).split('&');
    var value;
    parts.some(function (part) {
        var name_and_value = part.split('=');
        if (name_and_value[0] === name) {
            value = name_and_value[1];
            return true;
        }
    });
    if (prompt_message && typeof value === 'undefined') {
       return window.prompt(prompt_message);
    }
    return value;
};

var update_url = function () {
    if (!get_url_parameter("key")) {
       window.alert("The URL is about to be updated to include your key and cloud provider choice. Save this URL so you don't need to provide them each time.");
       window.onbeforeunload = null; // don't warn about reload
       // https is needed to access camera etc in some browsers
       window.location.replace("https://" + window.location.host + window.location.pathname +
                               "?provider=" + window.cloud_provider + "&key=" + key +
                               window.location.hash);
    }
};

window.cloud_provider = get_url_parameter("provider", "Please enter either Watson, Google, or Microsoft.");

if (window.cloud_provider !== "Watson" && window.cloud_provider !== "Google" && window.cloud_provider !== "Microsoft") {
   window.alert("This program will only work if the AI cloud service provider is Watson, Google, or Microsoft. Not " + window.cloud_provider);
   window.onbeforeunload = null; // don't warn about reload
   window.location.reload(true);
}

var key = get_url_parameter("key", "Please enter your API key or cancel if you don't have one.");

if (!key) {
   if (window.confirm("No key provided. Do you want to visit https://github.com/ToonTalk/ai-cloud/wiki to learn how to get a key?")) {
      window.onbeforeunload = null; // don't warn about reload
      window.assign("https://github.com/ToonTalk/ai-cloud/wiki");
   }
   return;
}

update_url();

var startup = function startup() {
    var callback = function(stream) {
        var vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL.createObjectURL(stream);
        video.play();
    };
    var error_callback = function(err) {
        console.log("An error occured! " + err);
    };
    var constraints = {video: true,
                       audio: false};
    video.style.display  = 'none';
    canvas.style.display = 'none';
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    document.body.appendChild(video);
    document.body.appendChild(canvas);
    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(callback)
            .catch(error_callback);
    } else {
console.log("test this");
        navigator.getMedia = (navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.msGetUserMedia);
        navigator.getMedia(constraints, callback, error_callback);
//      navigator.mediaDevices.getUserMedia(constraints, callback, error_callback);
    }
};

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

// available for external use by attaching it to window
window.take_picture_and_analyse = function (show_photo, callback) {
    var context, photo;
    if (!callback) {
        callback = console.log;
    }
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height, 0, 0, width, height);
    if (show_photo) {
        photo = document.createElement('img');
        photo.src = canvas.toDataURL('image/png');
        photo.setAttribute('width', width);
        photo.setAttribute('height', height);
        document.getElementById("world").style.display = "none";
        document.body.appendChild(photo);
        document.body.title = "Click me to restore Snap!";
        video.style.display  = ''; // display video
        document.body.addEventListener('click',
                                       function () {
                                           document.getElementById("world").style.display = '';
                                           video.style.display  = 'none';
                                           if (photo.parentElement) {
                                               document.body.removeChild(photo);
                                           }
                                           document.body.title = "";
                                       });
    }
    switch (window.cloud_provider) {
    case "Watson":
    case "Microsoft":
        canvas.toBlob(function (blob) {
            post_image(blob,
                       function (event) {
                           callback(event.currentTarget.response)
                       });
        },
                      "image/png");
        break;
    case "Google":
        post_image(canvas.toDataURL('image/png'),
                   function (event) {
                       callback(event.currentTarget.response);
                   });
        break;
    }
}

var post_image = function post_image(image, callback, error_callback) {
    // based upon https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript
    var XHR = new XMLHttpRequest();
    var formData;
    XHR.addEventListener('load', function(event) {
        callback(event);
    });
    if (!error_callback) {
        error_callback = function (event) {
            console.error(event);
        }
    }
    XHR.addEventListener('error', error_callback);
    switch (window.cloud_provider) {
    case  "Watson":
        formData = new FormData();
        formData.append("images_file", image, "blob.png");
        XHR.open('POST', "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?version=2016-05-19&api_key=" + key);
        XHR.send(formData);
        break;
    case "Google":
        XHR.open('POST', "https://vision.googleapis.com/v1/images:annotate?key=" + key);
        XHR.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        XHR.send(JSON.stringify({"requests":[{"image":{"content": image.substring("data:image/png;base64,".length)},
                                              "features":[{"type":"LABEL_DETECTION",
                                                           "maxResults":1},
                                                          {"type": "TEXT_DETECTION",
                                                           "maxResults":3},
                                                          {"type": "FACE_DETECTION",
                                                           "maxResults":1},
                                                          {"type": "IMAGE_PROPERTIES",
                                                           "maxResults":2}]}]
                                }));
        break;
    case "Microsoft":
        // see https://social.msdn.microsoft.com/Forums/en-US/807ee18d-45e5-410b-a339-c8dcb3bfa25b/testing-project-oxford-ocr-how-to-use-a-local-file-in-base64-for-example?forum=mlapi
        XHR.open('POST', "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description,Tags,Faces,Color,Categories&subscription-key=" + key);
        XHR.setRequestHeader('Content-Type', 'application/octet-stream');
        XHR.send(image);
        break;
    }
};
if (document.body) {
    startup();
} else {
    window.addEventListener('load', startup, false);
}
