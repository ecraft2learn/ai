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
    
    clearphoto();
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
      canvas.toBlob(function (blob) {
//       alternative_toBlob(function (blob) {
                        post_image(blob,
                                   function (event) {
                                       console.log(event.currentTarget.response);
                                       console.log(event);
                                   });
                    },
                    "image/png");
//                     "image/jpeg", 0.95);
//       post_image(data, function (event) {
//                             console.log(event.currentTarget.response);
//                             console.log(event);
//                          });
       var data = canvas.toDataURL('image/png');
       photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }

  var post_image = function (image_blob, callback, error_callback) {
      // base upon https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript
      var XHR = new XMLHttpRequest();
      var formData = new FormData();
      if (document.getElementById("myFileField").files.length > 0) {
          formData.append("images_file", document.getElementById("myFileField").files[0]);
      } else {
          formData.append("images_file", image_blob);
      }
      XHR.addEventListener('load', function(event) {
          callback(event);
      });

      // We define what will happen in case of error
      XHR.addEventListener('error', function(event) {
          if (error_callback) {
              error_callback(event);
          }
      });

      // We setup our request
      XHR.open('POST', "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?version=2016-05-19&api_key=" + key);

      if (document.getElementById("myFileField").files.length === 0) {
          XHR.setRequestHeader('Content-Type', 'multipart/form-data');
      }

     // And finally, We send our data.
     XHR.send(formData);
  };

  var tone_analysis = function (text, callback, error_callback) {
      var XHR = new XMLHttpRequest();
      var formData = new FormData();

      XHR.addEventListener('load', callback);

      XHR.addEventListener('error', error_callback)

      XHR.open('POST', "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&api_key=" + key + "&text=" +
                       encodeURIComponent(text));

      XHR.send(formData);
  }
  
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