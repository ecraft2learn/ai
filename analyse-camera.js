var video  = document.createElement('video');
var canvas = document.createElement('canvas');

var get_global_variable_value = function (name) {
    var ancestor = this;
    var value;
    while (ancestor && !(ancestor instanceof IDE_Morph)) {
        ancestor = ancestor.parent;
    }
    if (ancestor) {
        value = ancestor.globalVariables.getVar(name);
    } else {
        value =  world.children[0].globalVariables.getVar(name);
    }
    if (typeof value ===  'string') {
       return value;
    }
    return value.contents;
}.bind(this);

var cloud_providers = get_global_variable_value('AI cloud providers');

var keys = [];

cloud_providers.forEach(function (provider) {
    var key = get_global_variable_value(provider + " key");
    if (key) {
        keys[provider] = key;
        return;
    }
    if (window.confirm("No value provided for the variable '" + provider + " key'. Do you want to visit https://github.com/ToonTalk/ai-cloud/wiki to learn how to get a key?")) {
        window.onbeforeunload = null; // don't warn about reload
        document.location.assign("https://github.com/ToonTalk/ai-cloud/wiki");
    }
});

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
window.take_picture_and_analyse = function (cloud_provider, show_photo, callback) {
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
    switch (cloud_provider) {
    case "Watson":
    case "Microsoft":
        canvas.toBlob(
            function (blob) {
                post_image(blob,
                           cloud_provider,
                           function (event) {
                               callback(event.currentTarget.response);
                           });
            },
            "image/png");
        break;
    case "Google":
        post_image(canvas.toDataURL('image/png'),
                   cloud_provider,
                   function (event) {
                       callback(event.currentTarget.response);
                   });
        break;
    }
};

var post_image = function post_image(image, cloud_provider, callback, error_callback) {
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
    switch (cloud_provider) {
    case  "Watson":
        formData = new FormData();
        formData.append("images_file", image, "blob.png");
        XHR.open('POST', "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?version=2016-05-19&api_key=" + keys.Watson);
        XHR.send(formData);
        break;
    case "Google":
        XHR.open('POST', "https://vision.googleapis.com/v1/images:annotate?key=" + keys.Google);
        XHR.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        XHR.send(JSON.stringify({"requests":[{"image":{"content": image.substring("data:image/png;base64,".length)},
                                              "features":[{"type":"LABEL_DETECTION",
                                                           "maxResults":32},
//                                                          {"type": "TEXT_DETECTION",
//                                                           "maxResults":3},
//                                                          {"type": "FACE_DETECTION",
//                                                           "maxResults":1},
//                                                          {"type": "IMAGE_PROPERTIES",
//                                                           "maxResults":2}
]}]
                                }));
        break;
    case "Microsoft":
        // see https://social.msdn.microsoft.com/Forums/en-US/807ee18d-45e5-410b-a339-c8dcb3bfa25b/testing-project-oxford-ocr-how-to-use-a-local-file-in-base64-for-example?forum=mlapi
        XHR.open('POST', "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description,Tags,Faces,Color,Categories&subscription-key=" + keys.Microsoft);
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
