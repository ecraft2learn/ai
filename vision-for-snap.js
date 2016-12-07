  var video = document.createElement('video');
  var canvas = document.createElement('canvas');
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
         navigator.getMedia = (navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.msGetUserMedia);
         navigator.mediaDevices.getUserMedia(constraints, callback,  error_callback);
      }
   };
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.
  // available for external use by attaching it to window
  window.take_picture_and_analyse = function take_picture_and_analyse(show_photo, callback) {
      var context, photo;
      if (!callback) {
          callback = console.log;
      }
      context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, width, height);
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
     switch (provider) {
        case "Watson":
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
  }
  var post_image = function post_image(image, callback, error_callback) {
      // base upon https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript
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
      switch (provider) {
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
      }
  };
  if (document.body) {
      startup();
  } else {
      window.addEventListener('load', startup, false);
  }
