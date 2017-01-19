(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  var get_url_parameter = function (name, default_value) {
    var parts = window.location.search.substr(1).split('&');
    var value = default_value;
    parts.some(function (part) {
                   var name_and_value = part.split('=');
                   if (name_and_value[0] === name) {
                       value = name_and_value[1];
                       return true;
                   }
    });
    return value;
};

  var key = get_url_parameter("key");

  if (!key) {
      alert("No key provided in URL query");
  }

  var provider = get_url_parameter("provider", "Watson");

  var user = get_url_parameter("user");

  var authorization_token;

  function startup() {
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
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
      if (navigator.mediaDevices) {
           navigator.mediaDevices.getUserMedia(constraints)
                    .then(callback)
                    .catch(error_callback);
      } else {
         navigator.getMedia = ( navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.msGetUserMedia);
         navigator.mediaDevices.getUserMedia(constraints, callback,  error_callback);
      }
    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);
    
//     clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    var alternative_toBlob = function (callback, type, quality) {

      var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] ),
          len = binStr.length,
          arr = new Uint8Array(len);

      for (var i=0; i<len; i++ ) {
       arr[i] = binStr.charCodeAt(i);
      }

      callback( new Blob( [arr], {type: type || 'image/png'} ) );
    }

    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      var data = canvas.toDataURL('image/png');
      var javascript_to_snap = function (x) {
          if (Array.isArray(x)) {
              return x.map(javascript_to_snap);
          }
          if (typeof x === 'object') {
              return Object.keys(x).map(function (key) {
                                            return [key, javascript_to_snap(x[key])];
                                       });
          }
          return x;
      }
      switch (provider) {
        case "Watson":
          canvas.toBlob(function (blob) {
                            post_image(blob,
                                       function (event) {
                                           console.log(event.currentTarget.response);
                                           console.log(javascript_to_snap(JSON.parse(event.currentTarget.response)));
                                        });
                        },
                        "image/png");
           break;
         case "Google":
          post_image(data, function (event) {
                                console.log(event.currentTarget.response);
                             });
          break;
      }
      if (photo) {
         photo.setAttribute('src', data);
      } 
    } else {
//       clearphoto();
    }
  }

  var post_image = function (image, callback, error_callback) {
      // base upon https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript
      var XHR = new XMLHttpRequest();
      var formData = new FormData();
      XHR.addEventListener('load', function(event) {
          callback(event);
      });
      if (!error_callback) {
          error_callback = function (event) {
              console.error(event);
          }
      }
      XHR.addEventListener('error', error_callback);

      switch (provider) {
        case  "Watson":
          if (document.getElementById("myFileField").files.length > 0) {
              formData.append("images_file", document.getElementById("myFileField").files[0]);
          } else {
              formData.append("images_file", image, "blob.png");
          }
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
      }
  };

  var tone_analysis = function (text, callback, error_callback) {
      var XHR;
      if (!authorization_token) {
          get_authorization_token(function () {
                                      tone_analysis(text, callback, error_callback);
                                  },
                                  error_callback);
          return;
      }
      XHR = new XMLHttpRequest();
      XHR.addEventListener('load', callback);
      XHR.addEventListener('error', error_callback);
//       switch (provider) {
//         case  "Watson":
//           XHR.open('POST', "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&api_key=" + key + "&text=" +
//                            encodeURIComponent(text));
//           break;
//       }
      XHR.open("POST", "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19", true);
      XHR.setRequestHeader("Content-type", "application/json");
      XHR.setRequestHeader("X-Watson-Authorization-Token", authorization_token);
      XHR.send("{\"text\": \"" + text + "\"}");
  };

  var get_authorization_token = function (callback, error_callback) {
      var XHR = new XMLHttpRequest();
      var data = new FormData();
      var colon_index = user.indexOf(":");
      if (colon_index < 0) {
          console.error("user parameter should include a colon");
          return;
      }
      XHR.addEventListener('load', function (event) {
           console.log(event.currentTarget.response);
      });
      XHR.addEventListener('error', error_callback);
      // curl -u username:password "https://gateway.watsonplatform.net/authorization/api/v1/token?url=https://gateway.watsonplatform.net/tone-analyzer/api"
      XHR.open("POST", "https://gateway.watsonplatform.net/authorization/api/v1/token?url=https://gateway.watsonplatform.net/tone-analyzer/api");
      data.append('user', user.substring(0, colon_index));
      data.append('password', user.substring(colon_index+1));
      XHR.send(data);
  };
  
  setTimeout(function () {
    var text_input = document.getElementById("text-input");
    text_input.addEventListener('change',
                                function (event) {
                                    tone_analysis(text_input.value,
                                                  function (event) {
                                                       console.log(event.currentTarget.response);
                                                  },
                                                  function (event) {
                                                       console.error(event);
                                                  });
                                });    
  });


  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();