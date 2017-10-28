 /**
 * Implements JavaScript functions that extend Snap! to access AI cloud services
 * Authors: Ken Kahn
 * License: New BSD
 */

 "use strict";
window.ecraft2learn =
  (function () {
      var this_url = document.querySelector('script[src*="ecraft2learn-dev.js"]').src; // the URL where this library lives
      var load_script = function (url, when_loaded) {
          var script = document.createElement("script");
          script.type = "text/javascript";
          if (url.indexOf("//") < 0) {
              // is relative to this_url
              var last_slash_index = this_url.lastIndexOf('/');
              url = this_url.substring(0, last_slash_index+1) + url;
          }
          script.src = url;
          if (when_loaded) {
              script.addEventListener('load', when_loaded);
          }
          document.head.appendChild(script);
      };
      var get_key = function (key_name) {
          // API keys are provided by Snap! reporters
          var key = run_snap_block(key_name);
          if (key && key !== "Enter your key here") {
              return key;
          }
          // key missing to explain how to obtain keys
          if (window.confirm("No value reported by the '" + key_name +
                             " reporter. After obtaining the key edit the reporter in the 'Variables' area. Do you want to visit https://github.com/ToonTalk/ai-cloud/wiki to learn how to get a key?")) {
              window.onbeforeunload = null; // don't warn about reload
              document.location.assign("https://github.com/ToonTalk/ai-cloud/wiki");
          }
      };
      var run_snap_block = function (labelSpec) { // add parameters later
          // runs a Snap! block that matches labelSpec
          // labelSpec if it takes areguments will look something like 'label %txt of size %n'
          var ide = get_snap_ide(ecraft2learn.snap_context);
          // based upon https://github.com/jmoenig/Snap--Build-Your-Own-Blocks/issues/1791#issuecomment-313529328
          var allBlocks = ide.sprites.asArray().concat([ide.stage]).map(function (item) {return item.customBlocks}).reduce(function (a, b) {return a.concat(b)}).concat(ide.stage.globalBlocks);
          var blockSpecs = allBlocks.map(function (block) {return block.blockSpec()});
          var index = blockSpecs.indexOf(labelSpec);
          if (index < 0) {
              return;
          }
          var blockTemplate = allBlocks[index].templateInstance();
          return invoke_callback(blockTemplate);
      };
      var get_snap_ide = function (start) {
          // finds the Snap! IDE_Morph that is the element 'start' or one of its ancestors
          var ide = start;
          while (ide && !(ide instanceof IDE_Morph)) {
              ide = ide.parent;
          }
          if (!ide) {
              // not as general but works well (for now)
              return world.children[0];
          }
          return ide;
      };
      var get_global_variable_value = function (name, default_value) {
          // returns the value of the Snap! global variable named 'name'
          // if none exists returns default_value
          var ide = get_snap_ide(ecraft2learn.snap_context);
          var value;
          try {
              value = ide.globalVariables.getVar(name);
          } catch (e) {
              return default_value;
          }
          if (value === undefined) {
              return default_value;
          }
          if (typeof value ===  'string') {
              return value;
          }
          return value.contents;
    };
    var invoke_callback = function (callback) {
        // callback could either be a Snap! object or a JavaScript function
        if (typeof callback === 'object') { // assume Snap! callback
            // invoke the callback with the argments (other than the callback itself)
            // if BlockMorph then needs a receiver -- apparently callback is good enough
            return invoke(callback, new List(Array.prototype.slice.call(arguments, 1)), (callback instanceof BlockMorph && callback)); 
        }
        if (typeof callback === 'function') { // assume JavaScript callback
            callback.apply(this, arguments);
        }
          // otherwise no callback provided so ignore it
    };
    var javascript_to_snap = function (x) {
        if (!ecraft2learn.inside_snap) {
            return x;
        }
        if (Array.isArray(x)) {
            return new List(x.map(javascript_to_snap));
        }
        if (typeof x === 'object') {
            if (x instanceof List) {
                return x;
            }
            return new List(Object.keys(x).map(function (key) {
                                                   return new List([key, javascript_to_snap(x[key])]);
                                               }));
        }
        return x;
    };
    var add_photo_to_canvas = function (canvas, video, width, height) {
        // Capture a photo by fetching the current contents of the video
        // and drawing it into a canvas, then converting that to a PNG
        // format data URL. By drawing it on an offscreen canvas and then
        // drawing that to the screen, we can change its size and/or apply
        // other changes before drawing it.
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, width, height, 0, 0, width, height);
    };
    var get_voice = function (voice_number) {
        voice_number = +voice_number; // convert to nunber if is a string
        if (typeof voice_number === 'number') {
            var voices = window.speechSynthesis.getVoices();
            voice_number--; // Snap (and Scratch) use 1-indexing so convert here
            if (voice_number >= 0 && voice_number < voices.length) {
               return voices[Math.floor(voice_number)];
            } else if (voices.length > 0) {
               alert("Only voice numbers between 1 and " + voices.length + " are available. There is no voice number " + (voice_number+1));
            }
        }
    };
    var create_costume = function (canvas, name) {
        if (!name) {
            if (typeof  ecraft2learn.photo_count === 'undefined') {
                ecraft2learn.photo_count = 1;
            }
            name =  "photo " + ecraft2learn.photo_count;
            ecraft2learn.photo_count = ecraft2learn.photo_count+1;
        }
        return new Costume(canvas, name);;
    }
    var add_costume = function (costume, sprite) {
        var ide = get_snap_ide();
        if (!sprite) {
            sprite = ide.stage;
        }
        sprite.addCostume(costume);
        sprite.wearCostume(costume);
        ide.hasChangedMedia = true;
    };

    var arduino_bot = // based upon https://github.com/evothings/ecraft2learn/blob/master/arduinobot/client/app.js
        (function () {
  /* global $ */

  // Constants
  var defaultPortNumber = 1884

  // MQTT
  var mqttClient = null
  var editor = null
  var sketch = 'blinky'
  var server = 'raspberrypi.local:1884'

//   document.addEventListener("deviceready", onDeviceReady, false);

//   function onDeviceReady () {
//     connect()
//   }

  function connect () {
    disconnectMQTT()
    connectMQTT()
    // console.log('info', '', 'Connecting to MQTT ...', true)
  }

  // We need a unique client id when connecting to MQTT
  function guid () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }

  function connectMQTT () {
    var clientID = guid()
    var portNumber = defaultPortNumber
    var serverAndPort = server.split(':')
    if (serverAndPort.length === 2) {
      portNumber = parseInt(serverAndPort[1])
    }
    mqttClient = new window.Paho.MQTT.Client(serverAndPort[0], portNumber, clientID)
    mqttClient.onConnectionLost = onConnectionLost
    mqttClient.onMessageArrived = onMessageArrived
    var options =
      {
        userName: 'test',
        password: 'test',
        useSSL: false,
        reconnect: true,
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure
      }
    mqttClient.connect(options)
  }

  function verify (source, upload) {
    // Select command
    var command = 'verify'
    if (upload) {
      command = 'upload'
    }

    // Generate an id for the response we want to get
    var responseId = guid()

    // Subscribe in advance for that response
    subscribe('response/' + command + '/' + responseId)

    // Construct a job to run
    var job = {
      'sketch': sketch + '.ino',
      'src': window.btoa(source)
    }

    // Save sketch
    publish('sketch/' + sketch, job, true)

    // Submit job
    publish(command + '/' + responseId, job)
  }

  function handleResponse (topic, payload) {
    var jobId = payload.id
    subscribe('result/' + jobId)
    unsubscribe(topic)
  }

  function handleResult (topic, payload) {
    var type = payload.type
    var command = payload.command
    unsubscribe(topic)
    if (type === 'success') {
      console.log('Exit code: ' + payload.exitCode)
      console.log('Stdout: ' + payload.stdout)
      console.log('Stderr: ' + payload.stderr)
      console.log('Errors: ' + JSON.stringify(payload.errors))
      if (payload.exitCode === 0) {
        if (command === 'verify') {
          console.log('success', 'Success!', 'No compilation errors')
        } else {
          console.log('success', 'Success!', 'No compilation errors and upload was performed correctly')
        }
      } else {
        if (command === 'verify') {
          console.log('danger', 'Failed!', 'Compilation errors detected: ' + payload.errors.length)
        } else {
          console.log('danger', 'Failed!', 'Compilation errors detected: ' + payload.errors.length + '. Upload not performed')
        }
      }
    } else {
      console.log('danger', 'Failed!', 'Job failed: ' + payload.message)
    }
  }

  function onMessageArrived (message) {
    var payload = JSON.parse(message.payloadString)
    console.log('Topic: ' + message.topic + ' payload: ' + message.payloadString)
    handleMessage(message.topic, payload)
  }

  function onConnectSuccess (context) {
    console.log('info', '', 'Connected', true)
    subscribeToSketch()
  }

  function onConnectFailure (error) {
    console.log('Failed to connect: ' + JSON.stringify(error))
    console.log('danger', 'Connect failed!', 'Reconnecting ...', true)
  }

  function onConnectionLost (responseObject) {
    console.log('Connection lost: ' + responseObject.errorMessage)
    console.log('warning', 'Connection was lost!', 'Reconnecting ...', true)
  }

  function publish (topic, payload, retained) {
    var message = new window.Paho.MQTT.Message(JSON.stringify(payload))
    message.destinationName = topic
    message.retained = !!retained
    mqttClient.send(message)
  }

  function subscribe (topic) {
    mqttClient.subscribe(topic)
    console.log('Subscribed: ' + topic)
  }

  function subscribeToSketch () {
    subscribe('sketch/' + sketch)
  }

  function unsubscribe (topic) {
    mqttClient.unsubscribe(topic)
    console.log('Unsubscribed: ' + topic)
  }

  function disconnectMQTT () {
    if (mqttClient && mqttClient.isConnected()) {
      mqttClient.disconnect()
    }
    mqttClient = null
  }

  function handleMessage (topic, payload) {
    try {
      if (topic.startsWith('response/')) {
        return handleResponse(topic, payload)
      } else if (topic.startsWith('result/')) {
        return handleResult(topic, payload)
//       } else if (topic.startsWith('sketch/')) {
//         return handleSketch(topic, payload)
      }
      console.log('Unknown topic: ' + topic)
    } catch (error) {
      console.log('Error handling payload: ' + error)
    }
  }

  // connect to ArduinoBot (should really be conditional upon needing it)
  connect()
  // return external interface to ArduinoBot
  return {verify: verify}
})();

    var image_recognitions = {}; // record of most recent results from calls to take_picture_and_analyse

    // the following are the ecraft2learn functions available via this library

    return {
      inside_snap: typeof world === 'object' && world instanceof WorldMorph,
      run: function (function_name, parameters) {
          // runs one of the functions in this library
          if (typeof ecraft2learn[function_name] === 'undefined') {
              alert("Ecraft2learn library does not have a function named " + function_name);
              return;
          }
          return ecraft2learn[function_name].apply(null, parameters.contents);
      },

      read_url: function (url, callback, error_callback, access_token) {
          // calls callback with the contents of the 'url' unless an error occurs and then error_callback is called
          // ironically this is the rare function that may be useful when there is no Internet connection
          // since it can be used to communicate with localhost (e.g. to read/write Raspberry Pi or Arduino pins)
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          if (access_token) {
              xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          }
          xhr.onload = function() {
              invoke_callback(callback, xhr.responseText);
          };
          xhr.onerror = function(error) {
              invoke_callback(error_callback, url + " error is " + error.message);
          };
          xhr.onloadend = function() {
              if (xhr.status >= 400) {
                  invoke_callback(error_callback, url + " replied " + xhr.statusText);
              } else if (xhr.status === 0) {
                  invoke_callback(error_callback, url + " failed to load.");
              }
          };
          xhr.send();
      },

      start_speech_recognition: function (spoken_callback, error_callback) {
          // spoken_callback is called with the text recognised by the browser's speech recognition capability
          // or error_callback if an error occurs
          // if the browser has no support for speech recognition then the Microsoft Speech API is used (API key required)
          if (typeof SpeechRecognition === 'undefined' && typeof webkitSpeechRecognition === 'undefined') {
              // no support from this browser so try using the Microsoft Speech API
              ecraft2learn.start_microsoft_speech_recognition(null, spoken_callback, error_callback);
              return;
          }
          var stopped = false; // used to suspend listening when tab is hidden
          var restart = function () {
              if (stopped) {
                 return;
              }
              if (window.speechSynthesis.speaking) { // don't listen while speaking
                  setTimeout(restart, 500); // try again in half a second
                  return;
              }
              try {
                  ecraft2learn.speech_recognition.start();
  //                 console.log("Speech recognition started");
              } catch (error) {
                  if (error.name === 'InvalidStateError') {
                      // delay needed, at least in Chrome 52
                      setTimeout(restart, 2000);
                  } else {
                      console.log(error);
                  }
              }
          };
          var handle_result = function (callback, event) {
              var spoken = event.results[0][0].transcript;
              console.log("Confidence is " + event.results[0][0].confidence + " for " + spoken);
              ecraft2learn.speech_recognition.stop();
              invoke_callback(callback, spoken);
          };
          var handle_error = function (callback, event) {
              if (event.error === 'aborted') {
                  if (!stopped) {
                      console.log("Aborted so restarting speech recognition in half a second");
                      setTimeout(restart, 500);
                  }
                  return;
              }
  //             console.log("Recognition error: " + event.error);
              invoke_callback(callback,event.error);
          };
          if (!ecraft2learn.speech_recognition) {
              ecraft2learn.speech_recognition = (typeof SpeechRecognition === 'undefined') ?
                  new webkitSpeechRecognition() :
                  new SpeechRecognition();
          }
          ecraft2learn.speech_recognition.onresult = function (event) {
              handle_result(spoken_callback, event);
          };
          ecraft2learn.speech_recognition.onerror = function (event) {
              handle_error(error_callback, event);
          };
          ecraft2learn.speech_recognition.onend = function (event) {
  //             console.log("recognition ended");
              restart();
          };
          ecraft2learn.stop_speech_recognition = function () {
               ecraft2learn.speech_recognition.onend    = null;
              ecraft2learn.speech_recognition.onresult = null;
              ecraft2learn.speech_recognition.onerror  = null;
              ecraft2learn.speech_recognition.stop();
          };
          restart();
          // if the tab or window is minimised or hidden then speech recognition is paused until the window or tab is shown again
          window.addEventListener("message",
                                  function(message) {
                                      if (message.data === 'hidden') {
                                          stopped = true;
                                          ecraft2learn.speech_recognition.stop();
                                          console.log("Stopped because tab/window hidden.");
                                      } else if (message.data === 'shown') {
                                          stopped = false;
                                          restart();
                                          console.log("Restarted because tab/window shown.");
                                      }
                                  });
    },

    start_microsoft_speech_recognition: function (as_recognized_callback, final_spoken_callback, error_callback, provided_key) {
        // As spoken words are recognised as_recognized_callback is called with the result so far
        // When the recogniser determines that the speaking is finished then the final_spoken_callback is called with the final text
        // error_callback is called if an error occurs
        // provided_key is either the API key to use the Microsoft Speech API or
        // if not specified then the key is obtained from the Snap! 'Microsoft speech key' reporter
        var start_listening = function (SDK) {
            var setup = function(SDK, recognitionMode, language, format, subscriptionKey) {
                var recognizerConfig = new SDK.RecognizerConfig(
                    new SDK.SpeechConfig(
                        new SDK.Context(
                            new SDK.OS(navigator.userAgent, "Browser", null),
                            new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
                    recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation>)
                    language,        // Supported laguages are specific to each recognition mode. Refer to docs.
                    format);         // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)
                // Alternatively use SDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
                var authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);
                return SDK.CreateRecognizer(recognizerConfig, authentication);
            };
            var key = provided_key || get_key('Microsoft speech key');
            if (!key) {
                return;
            }
            var recognizer = setup(SDK,
                                   SDK.RecognitionMode.Interactive,
                                   get_global_variable_value('language', "en-us"),
                                   "Simple", // as opposed to "Detailed"
                                   key);
            ecraft2learn.stop_microsoft_speech_recognition = function () {
                recognizer.AudioSource.TurnOff();
            };
            ecraft2learn.last_speech_recognized = undefined;
            recognizer.Recognize(function (event) {
                switch (event.Name) {
                    case "RecognitionTriggeredEvent":
                        break;
                    case "ListeningStartedEvent":
                        break;
                    case "RecognitionStartedEvent":
                        break;
                    case "SpeechStartDetectedEvent":
                        break;
                    case "SpeechHypothesisEvent":
                        ecraft2learn.last_speech_recognized = event.Result.Text;
                        ecraft2learn.invoke_callback(as_recognized_callback, ecraft2learn.last_speech_recognized);
                        break;
                    case "SpeechEndDetectedEvent":
                        if (ecraft2learn.last_speech_recognized) {
                            invoke_callback(final_spoken_callback, ecraft2learn.last_speech_recognized);
                        } else {
                            invoke_callback(error_callback);
                        }
                        break;
                    case "SpeechSimplePhraseEvent":
                        break;
                    case "SpeechDetailedPhraseEvent":
                        break;
                    case "RecognitionEndedEvent":
                        break;
                }
            })
            .On(function () {
                // The request succeeded. Nothing to do here.
            },
            function (error) {
                console.error(error);
                invoke_callback(error_callback);
            });
        };
        if (ecraft2learn.microsoft_speech_sdk) {
            start_listening(ecraft2learn.microsoft_speech_sdk);
        } else {
            load_script("//cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min.js", 
                       function () {
                           load_script("lib/speech.browser.sdk-min.js",
                                       function () {
                                            require(["Speech.Browser.Sdk"], function(SDK) {
                                                ecraft2learn.microsoft_speech_sdk = SDK;
                                                start_listening(SDK);
                                            });
                                       });
                       });
        }
    },

  setup_camera: function (width, height, provided_key) {
      // sets up the camera for taking photos and sending them to an AI cloud service for recognition
      // causes take_picture_and_analyse to be defined
      // supported service providers are currently 'Google', 'Microsoft', and IBM 'Watson' (or 'IBM Watson')
      var video  = document.createElement('video');
      var canvas = document.createElement('canvas');
      var post_image = function post_image(image, cloud_provider, callback, error_callback) {
          // based upon https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript
          if (cloud_provider === 'Watson') {
              cloud_provider = 'IBM Watson';
          }
          var key = provided_key || get_key(cloud_provider + " image key");
          var formData, XHR;
          if (!key) {
             callback("No key provided so unable to ask " + cloud_provider + " to analyse an image.");
             return;
          }
          XHR = new XMLHttpRequest();
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
          case "IBM Watson":
              formData = new FormData();
              formData.append("images_file", image, "blob.png");
              XHR.open('POST', "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?version=2016-05-19&api_key=" + key);
              XHR.send(formData);
              break;
          case "Google":
              XHR.open('POST', "https://vision.googleapis.com/v1/images:annotate?key=" + key);
              XHR.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
              XHR.send(JSON.stringify({"requests":[{"image":{"content": image.substring("data:image/png;base64,".length)},
                                                    "features":[{"type": "LABEL_DETECTION",  "maxResults":32},
                                                                {"type": "TEXT_DETECTION",   "maxResults":32},
                                                                {"type": "FACE_DETECTION",   "maxResults":32},
                                                                {"type": "IMAGE_PROPERTIES", "maxResults":32}
                                                               ]}]
                                      }));
              break;
          case "Microsoft":
              // see https://social.msdn.microsoft.com/Forums/en-US/807ee18d-45e5-410b-a339-c8dcb3bfa25b/testing-project-oxford-ocr-how-to-use-a-local-file-in-base64-for-example?forum=mlapi
              XHR.open('POST', "https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description,Tags,Faces,Color,Categories&subscription-key=" + key);
              XHR.setRequestHeader('Content-Type', 'application/octet-stream');
              XHR.send(image);
              break;
          }
      };
      var startup = function startup() {
          var callback = function(stream) {
              var vendorURL = window.URL || window.webkitURL;
              video.src = vendorURL.createObjectURL(stream);
              video.play();
          };
          var error_callback = function(error) {
              console.log("An error in getting access to camera: " + error.message);
              console.log(error);
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
      width = +width; // convert to number
      height = +height;

  // define new functions in the scope of setup_camera

  ecraft2learn.add_photo_as_costume = function () {
      add_photo_to_canvas(canvas, video, width, height);
      add_costume(create_costume(canvas), get_snap_ide().currentSprite);
  };

  ecraft2learn.take_picture_and_analyse = function (cloud_provider, show_photo, snap_callback) {
      // snap_callback is called with the result of the image recognition
      // show_photo displays the photo when it is taken
      if (cloud_provider === 'Watson') {
          cloud_provider = 'IBM Watson';
      }
      var callback = function (response) {
          var response_as_javascript_object;
          switch (cloud_provider) {
              case "IBM Watson":
                  response_as_javascript_object = JSON.parse(response).images[0].classifiers[0].classes;
                  break;
              case "Google":
                  response_as_javascript_object = JSON.parse(response).responses[0];
                  break;
              case "Microsoft":
                  response_as_javascript_object = JSON.parse(response);
                  break;
              default:
                  invoke_callback(snap_callback, "Unknown cloud provider: " + cloud_provider);
                  return;
          }
          image_recognitions[cloud_provider].response = response_as_javascript_object;
          if (typeof snap_callback !== 'object' && typeof snap_callback !== 'function') { // if not provided
              return;
          }
          invoke_callback(snap_callback, javascript_to_snap(response_as_javascript_object));
    };
    var costume;
    add_photo_to_canvas(canvas, video, width, height);
    costume = create_costume(canvas);
    image_recognitions[cloud_provider] = {costume: create_costume(canvas)};
    if (show_photo) {
        add_costume(costume);
    }
    switch (cloud_provider) {
    case "IBM Watson":
    case "Microsoft":
        canvas.toBlob(
            function (blob) {
                post_image(blob,
                           cloud_provider,
                           function (event) {
                               if (typeof event === 'string') {
                                   alert(event);
                               } else {
                                   callback(event.currentTarget.response);
                               }
                           });
            },
            "image/png");
        break;
    case "Google":
        post_image(canvas.toDataURL('image/png'),
                   cloud_provider,
                   function (event) {
                       if (typeof event === 'string') {
                           alert(event);
                       } else {
                           callback(event.currentTarget.response);
                       }
                   });
        break;
    default:
        invoke_callback(snap_callback, "Unknown cloud provider: " + cloud_provider);
    }
  };

    if (document.body) {
        startup();
    } else {
        window.addEventListener('load', startup, false);
    }
  },

  image_property: function (cloud_provider, property_name_or_names) {
      var get_property = function (array_or_object, property_name_or_names) {
          var property;
          if (Array.isArray(array_or_object)) {
              return new List(array_or_object.map(function (item) {
                                                      return get_property(item, property_name_or_names);
                                                  }));
          } else if (typeof property_name_or_names === 'string') {
              property = array_or_object[property_name_or_names];
              if (!property) {
                  return "No property named " + property_name_or_names + " found.";
              }
              return property;
          } else if (property_name_or_names.length < 1) {
              return array_or_object;
          } else if (property_name_or_names.length < 2) {
              return get_property(array_or_object, property_name_or_names[0]);
          } else if (array_or_object.statusCode >= 400 && array_or_object.statusCode <= 404) {
              return "Unable to connect to " + cloud_provider + ". " + array_or_object.message;
          } else {
              property = array_or_object[property_name_or_names[0]];
              if (!property) {
                  return "No property named " + property_name_or_names[0] + " found.";
              }
              return get_property(property, property_name_or_names.splice(1));
          }
      };
      if (cloud_provider === 'Watson') {
          cloud_provider = 'IBM Watson';
      }
      var recognition = image_recognitions[cloud_provider];
      if (!recognition) {
          return cloud_provider + " has not been asked to recognize a photo.";
      }
      if (!recognition.response) {
          return cloud_provider + " has not (yet) recognized the image.";
      }
      if (!Array.isArray(property_name_or_names) && typeof property_name_or_names !== 'string') {
          // convert from a Snap list to a JavaScript array
          property_name_or_names = property_name_or_names.contents;
      }
      return javascript_to_snap(get_property(recognition.response, property_name_or_names));
  },

  add_current_photo_as_costume: function (cloud_provider) {
      var recognition = image_recognitions[cloud_provider];
      if (!recognition || !recognition.costume) {
          return "No photo has been created for " + cloud_provider + " to recognize.";
      }
      add_costume(recognition.costume);
  },

  speak: function (message, pitch, rate, voice_number, volume, language, finished_callback) {
    // speaks 'message' optionally with the specified pitch, rate, voice, volume, and language
    // finished_callback is called with the spoken text
    // see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
    if (window.speechSynthesis.getVoices().length === 0) {
        // voices not loaded so wait for them and try again
        window.speechSynthesis.onvoiceschanged = function () {
            ecraft2learn.speak(message, pitch, rate, voice_number, volume, language, finished_callback);
            window.speechSynthesis.onvoiceschanged = undefined;
        };
        return;
    }
    var maximum_length = 200; // not sure what a good value is but long text isn't spoken in some browsers
    var break_into_short_segments = function (text) {
        var segments = [];
        var break_text = function (text) {
            var segment, index;
            if (text.length < maximum_length) {
                return text.length+1;
            }
            segment = text.substring(0, maximum_length);
            index = segment.lastIndexOf(". ") || segment.lastIndexOf(".\n");
            if (index > 0) {
                return index+2;
            }
            index = segment.lastIndexOf(".");
            if (index === segment.length-1) {
                // final period need not have space after it
                return index+1;
            }
            index = segment.lastIndexOf(", ");
            if (index > 0) {
                return index+2;
            }
            index = segment.lastIndexOf(" ");
            if (index > 0) {
                return index+1;
            }
            // give up - no periods, commas, or spaces
            return Math.min(text.length+1, maximum_length);
        };
        var best_break;
        while (text.length > 0) {
            best_break = break_text(text);
            if (best_break > 1) {
                segments.push(text.substring(0, best_break-1));
            }
            text = text.substring(best_break);
        }
        return segments;
    };
    var segments, speech_utterance_index;
    if (message.length > maximum_length) {
        segments = break_into_short_segments(message);
        segments.forEach(function (segment, index) {
            // finished_callback is only for the last segment
            var callback = index === segments.length-1 && 
                           finished_callback &&
                           function () {
                               invoke_callback(finished_callback, message); // entire message not just the segments
                           };
            ecraft2learn.speak(segment, pitch, rate, voice_number, volume, language, callback)
        });
        return;
    }
    // else is less than the maximum_length
    var utterance = new SpeechSynthesisUtterance(message);
    ecraft2learn.utterance = utterance; // without this utterance may be garbage collected before onend can run
    if (typeof language === 'string') {
        utterance.lang = language;
    }
    pitch = +pitch; // if string try convering to a number
    if (typeof pitch === 'number' && pitch > 0) {
        utterance.pitch = pitch;
    }
    rate = +rate;
    if (typeof rate === 'number' && rate > 0) {
        if (rate < .1) {
           // A very slow rate breaks Chrome's speech synthesiser
           rate = .1;
        }
        if (rate > 2) {
           rate = 2; // high rate also breaks Chrome's speech synthesis
        }
        utterance.rate = rate;
    }
    utterance.voice = get_voice(voice_number);
    volume = +volume;
    if (typeof volume && volume > 0) {
        utterance.volume = volume;
    }
    utterance.onend = function (event) {
        invoke_callback(finished_callback, message);
    };
    if (ecraft2learn.speech_recognition) {
        // don't recognise synthetic speech
        ecraft2learn.speech_recognition.abort();
    }
    window.speechSynthesis.speak(utterance);
  },
  get_voice_names: function () {
    return new List(window.speechSynthesis.getVoices().map(function (voice) {
        return voice.name;
    }));
  },
  get_voice_name: function (voice_number) {
      var voice = get_voice(voice_number);
      if (voice) {
          return voice.name;
      }
      return "No voice numbered " + voice_number;
  },
  open_project: function (name) {
      get_snap_ide().openProject(name);
  },
  save_project: function (name) {
      get_snap_ide().saveProject(name);
  },
  // experimenting with compiling Snap4Arduino to Arduino C sketch
  transpile_to_arduino_sketch: function () {
//     var block = block_context.expression;
    try {
        arduino_bot.verify(
                this.world().Arduino.transpile(
                 block.mappedCode(),
                 this.scripts.children.filter(
                     function (each) {
                           return each instanceof HatBlockMorph &&
                                each.selector == 'receiveMessage'
                      })),
                 true);
    } catch (error) {
       alert("Error exporting to Arduino sketch!  " + error.message)
    }
  },
  console_log: function (message) {
      console.log(message);
  },
  handle_server_json_response: function (response, callback) {
     invoke_callback(callback, javascript_to_snap(JSON.parse(response)));
  },
  handle_server_json_response_to_pins_request: function (response_text, callback_for_pins_read, callback_for_pins_written, callback_for_errors) {
      try {
          var response = JSON.parse(response_text);
          var read = response.pins;
          var written = response.write_responses;
          invoke_callback(callback_for_pins_read,    javascript_to_snap(read));
          invoke_callback(callback_for_pins_written, javascript_to_snap(written));
      } catch (error) {
          invoke_callback(callback_for_errors, error.message);
      }
  }
}} ());
