 /**
 * Implements JavaScript functions that extend Snap! to access AI cloud services
 * Authors: Ken Kahn
 * License: New BSD
 */

 "use strict";
window.ecraft2learn =
  (function () {
      var this_url = document.querySelector('script[src*="ecraft2learn-beta.js"]').src; // the URL where this library lives
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
      var run_snap_block = function (proc, labelSpec) { // add parameters later
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
          return invoke_callback(blockTemplate, proc);
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
    var invoke_callback = function (callback, proc) {
        // callback could either be a Snap! object or a JavaScript function
        if (typeof callback === 'object') { // assume Snap! callback
            // invoke the callback with the argments (other than the callback itself)
            // if BlockMorph then needs a receiver -- apparently callback is good enough
//             return invoke(callback, new List(Array.prototype.slice.call(arguments, 1)), (callback instanceof BlockMorph && callback));
//             proc.evaluate(callback, new List(Array.prototype.slice.call(arguments, 2)), true);
            var stage = world.children[0].stage; // this.parentThatIsA(StageMorph);
            var process = stage.threads.startProcess(callback.expression,
                                                     callback.receiver,
                                                     stage.isThreadSafe,
                                                     true,
                                                     function (result) {
                                                       console.log(result);
                                                     },
                                                     false,
                                                     false);
            process.initializeFor(callback, new List(Array.prototype.slice.call(arguments, 2)));
            return; 
        }
        if (typeof callback === 'function') { // assume JavaScript callback
            callback.apply(this, arguments);
        }
        // otherwise no callback provided so ignore it
    };
    var is_callback = function (x) {
        return typeof x === 'object' || typeof x === 'function';
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
    var get_mary_tts_voice = function (voice_number) { // offical name
        return get_voice_from(voice_number, mary_tts_voices.map(function (voice) { return voice[0]; }));
    };
    var get_voice = function (voice_number) {
        return get_voice_from(voice_number, window.speechSynthesis.getVoices());
    };
    var get_voice_from = function (voice_number, voices) {
        voice_number = +voice_number; // convert to nunber if is a string
        if (typeof voice_number === 'number' && !isNaN(voice_number)) {
            voice_number--; // Snap (and Scratch) use 1-indexing so convert here
            if (voice_number === -1) {
                voice_number = 0;
            }
            if (voice_number >= 0 && voice_number < voices.length) {
               return voices[Math.floor(voice_number)];
            } else {
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
    // see http://mary.dfki.de:59125/documentation.html for documentation of Mary TTS
    var mary_tts_voices =
    [ // name, human readable name, and locale
["dfki-spike-hsmm", "Spike British English male", "en-GB"],
["dfki-prudence", "Prudence British English female", "en-GB"],
["dfki-poppy", "Poppy British English female", "en-GB"],
["dfki-obadiah-hsmm", "Obadiah British English male", "en-GB"],
["cmu-slt-hsmm", "SLT US English female", "en-US"],
["cmu-rms-hsmm", "RMS US English male", "en-US"],
["cmu-bdl-hsmm", "BDL US English male", "en-US"],
["upmc-pierre-hsmm", "Pierre French male", "fr"],
["upmc-jessica-hsmm", "Jessica Fremch female", "fr"],
["enst-dennys-hsmm", "Dennys French male", "fr"],
["enst-camille-hsmm", "Camille French female", "fr"],
["dfki-pavoque-styles", "Pavoque German male", "de"],
["bits4", "BITS4 German female", "de"],
["bits3-hsmm", "BITS3 German male", "de"],
["bits2", "BITS2 German male", "de"],
["bits1-hsmm", "BITS1 German demale", "de"],
["dfki-ot-hsmm", "Ot Turkish male", "tr"],
["istc-lucia-hsmm", "Lucia Italian female", "it"],
["marylux", "Mary Luxembourgian female", "lb"],
// ["cmu-nk-hsmm", "NK Teluga female", "te"], // Teluga doesn't work with roman letters or digits
];
   
    var image_recognitions = {}; // record of most recent results from calls to take_picture_and_analyse
    
    var speech_recognition_in_progress = false; // used to prevent overlapping calls to start_speech_recognition

    var debugging = true;

    // the following are the ecraft2learn functions available via this library

    return {
      inside_snap: typeof world === 'object' && world instanceof WorldMorph,

      run: function (function_name, proc, parameters) {
          // runs one of the functions in this library
          if (typeof ecraft2learn[function_name] === 'undefined') {
              alert("Ecraft2learn library does not have a function named " + function_name);
              return;
          }
          // add proc to args passed to function
          ecraft2learn.proc_context = proc.context;
          var args = new Array(proc).concat(parameters.contents);
          return ecraft2learn[function_name].apply(null, args);
      },

      read_url: function (proc, url, callback, error_callback, access_token) {
          // calls callback with the contents of the 'url' unless an error occurs and then error_callback is called
          // ironically this is the rare function that may be useful when there is no Internet connection
          // since it can be used to communicate with localhost (e.g. to read/write Raspberry Pi or Arduino pins)
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          if (access_token) {
              xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          }
          xhr.onload = function() {
              invoke_callback(callback, proc, xhr.responseText);
          };
          xhr.onerror = function(error) {
              invoke_callback(error_callback, proc, url + " error is " + error.message);
          };
          xhr.onloadend = function() {
              if (xhr.status >= 400) {
                  invoke_callback(error_callback, proc, url + " replied " + xhr.statusText);
              } else if (xhr.status === 0) {
                  invoke_callback(error_callback, proc, url + " failed to load.");
              }
          };
          xhr.send();
      },

      start_speech_recognition: function (proc, final_spoken_callback, error_callback, interim_spoken_callback, language, 
                                          max_alternatives, all_results_callback, all_confidence_values_callback) {
          // final_spoken_callback and interim_spoken_callback are called with the text recognised by the browser's speech recognition capability
          // interim_spoken_callback is optional 
          // or error_callback if an error occurs
          // language is of the form en-US and is optional
          // maxAlternatives 
          // if the browser has no support for speech recognition then the Microsoft Speech API is used (API key required)
          if (typeof SpeechRecognition === 'undefined' && typeof webkitSpeechRecognition === 'undefined') {
              // no support from this browser so try using the Microsoft Speech API
              ecraft2learn.start_microsoft_speech_recognition(proc, interim_spoken_callback, spoken_callback, error_callback);
              return;
          }
          if (window.speechSynthesis.speaking || speech_recognition_in_progress) { 
              // don't listen while speaking or while listening is still in progress
              if (debugging) {
                  console.log("Delaying start due to " + (window.speechSynthesis.speaking ? "speaking" : "listen in progress"));
              }
              setTimeout(function () {
                             ecraft2learn.start_speech_recognition(proc, final_spoken_callback, error_callback, interim_spoken_callback, language, 
                                                                   max_alternatives, all_results_callback, all_confidence_values_callback); 
                         },
                         100); // try again in a tenth of a second
              return;
          }
          if (debugging) {
              console.log("start_speech_recognition called.");
          }
          var restart = function () {
              if (speech_recognition_stopped) {
                  if (debugging) {
                      console.log("restart exited becuase speech_recognition_stopped");
                  }
                  return;
              }
              try {
                  speech_recognition_in_progress = true;
                  if (debugging) {
                      console.log("Recognition started");
                  }
                  speech_recognition.start();
 //               console.log("Speech recognition started");
              } catch (error) {
                  speech_recognition_in_progress = false;
                  if (error.name === 'InvalidStateError') {
                      if (debugging) {
                          console.log("restart delayed becuase InvalidStateError");
                      }
                      // delay needed, at least in Chrome 52
                      setTimeout(restart, 2000);
                  } else {
                      console.log(error);
                  }
              }
          };
          var handle_result = function (event) {
              var spoken = event.results[event.resultIndex][0].transcript; // first result            
//               if (event.results[0].isFinal) {
//                   // not clear if this is still needed
//                   speech_recognition.stop();
//               }
              invoke_callback(event.results[event.resultIndex].isFinal ? final_spoken_callback : interim_spoken_callback, proc, spoken);
              if (debugging) {
                  console.log("Just invoked callback for " + spoken + ". isFinal is " + event.results[event.resultIndex].isFinal);
              }
              if (is_callback(all_results_callback)) {
                  handle_all_results(event);
              }
              if (is_callback(all_confidence_values_callback)) {
                  handle_all_confidence_values(event);
              } else {
                  console.log("Confidence is " + event.results[event.resultIndex][0].confidence + " for " + spoken);
              }
          };
          var handle_all_results = function (event) {
              var results = [];
              var result = event.results[event.resultIndex];
              for (var i = 0; i < result.length; i++) {
                  results.push(result[i].transcript);
              }
              invoke_callback(all_results_callback, proc, javascript_to_snap(results));
          };
          var handle_all_confidence_values = function (event) {
              var confidences = [];
              var result = event.results[event.resultIndex];
              for (var i = 0; i < result.length; i++) {
                  confidences.push(result[i].confidence);
              }
              invoke_callback(all_confidence_values_callback, proc, javascript_to_snap(confidences));
          };
          var handle_error = function (event) {
//               if (event.error === 'aborted') {
//                   if (!speech_recognition_stopped) {
//                       console.log("Aborted so restarting speech recognition in half a second");
//                       setTimeout(restart, 500);
//                   }
//                   return;
//               }
              ecraft2learn.stop_speech_recognition();
              if (debugging) {
                   console.log("Recognition error: " + event.error);
              }
              invoke_callback(error_callback, proc, event.error);
          };
          var speech_recognition_stopped = false; // used to suspend listening when tab is hidden
          var speech_recognition = (typeof SpeechRecognition === 'undefined') ?
                                   new webkitSpeechRecognition() :
                                   new SpeechRecognition();
          speech_recognition.interimResults = is_callback(interim_spoken_callback);
          if (typeof language === 'string') {
              speech_recognition.lang = language;
          }
          if (max_alternatives > 1) {
              speech_recognition.maxAlternatives = max_alternatives;
          }
          speech_recognition.profanityFilter = true; // so more appropriate use in schools, e.g. f*** will result
          speech_recognition.onresult = handle_result;
          speech_recognition.onerror = handle_error;
          speech_recognition.onend = function (event) {
              speech_recognition_in_progress = false;
          };
          ecraft2learn.stop_speech_recognition = function () {
              if (debugging) {
                  console.log("Stopped.");
              }
              speech_recognition_in_progress = false;
              if (speech_recognition) {
                  speech_recognition.onend    = null;
                  speech_recognition.onresult = null;
                  speech_recognition.onerror  = null;
                  speech_recognition.stop();
              }
          };
          restart();
          // if the tab or window is minimised or hidden then speech recognition is paused until the window or tab is shown again
          window.addEventListener("message",
                                  function(message) {
                                      if (message.data === 'hidden') {
                                          speech_recognition_stopped = true;
                                          if (debugging) {
                                              console.log("Stopped because tab/window hidden.");
                                          }     
                                      } else if (message.data === 'shown') {
                                          speech_recognition_stopped = false;
                                          restart();
                                          if (debugging) {
                                              console.log("Restarted because tab/window shown.");
                                          }
                                      }
                                  });
    },

    start_microsoft_speech_recognition: function (proc, as_recognized_callback, final_spoken_callback, error_callback, provided_key) {
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
                        invoke_callback(as_recognized_callback, proc, ecraft2learn.last_speech_recognized);
                        break;
                    case "SpeechEndDetectedEvent":
                        if (ecraft2learn.last_speech_recognized) {
                            invoke_callback(final_spoken_callback, proc, ecraft2learn.last_speech_recognized);
                        } else {
                            invoke_callback(error_callback, proc);
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
                invoke_callback(error_callback, proc);
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

  ecraft2learn.take_picture_and_analyse = function (proc, cloud_provider, show_photo, snap_callback) {
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
                  invoke_callback(snap_callback, proc, "Unknown cloud provider: " + cloud_provider);
                  return;
          }
          image_recognitions[cloud_provider].response = response_as_javascript_object;
          if (typeof snap_callback !== 'object' && typeof snap_callback !== 'function') { // if not provided
              return;
          }
          invoke_callback(snap_callback, proc, javascript_to_snap(response_as_javascript_object));
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
        invoke_callback(snap_callback, proc, "Unknown cloud provider: " + cloud_provider);
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

  speak: function (proc, message, pitch, rate, voice_number, volume, language, finished_callback) {
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
                               invoke_callback(finished_callback, proc, message); // entire message not just the segments
                           };
            ecraft2learn.speak(proc, segment, pitch, rate, voice_number, volume, language, callback)
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
        invoke_callback(finished_callback, proc, message);
    };
//     if (speech_recognition) {
//         // don't recognise synthetic speech
//         ecraft2learn.speech_recognition.abort();
//     }
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
  get_mary_tts_voice_name: function (voice_number) { // user friendly name
      return get_voice_from(voice_number, mary_tts_voices.map(function (voice) { return voice[1]; }));
  },
  speak_using_mary_tts: function (message, volume, voice_number, finished_callback) {
     var voice = get_mary_tts_voice(voice_number);
     var voice_parameter = voice ? "&VOICE=" + voice : "";
     var voice_number_index = +voice_number > 0 ? (+voice_number)-1 : 0;
     var locale_parameter = "&LOCALE=" + mary_tts_voices[voice_number_index][2];
     var sound = new Audio("http://mary.dfki.de:59125/process?INPUT_TEXT=" + (typeof message === 'string' ? message.replace(/\s/g, "+") : message) + 
                           "&INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&AUDIO=WAVE_FILE" + voice_parameter + locale_parameter);
     if (finished_callback) {
         sound.addEventListener("ended", 
                                function () {
                                     invoke_callback(finished_callback, proc, javascript_to_snap(message));
                                },
                                false);
     }
     if (+volume > 0) {
         sound.volume = +volume;
     }
     sound.play();
  },
  get_mary_tts_voice_names: function () {
    return new List(mary_tts_voices.map(function (voice) { return voice[1]; }));
  },
  speak_using_browser_voices_or_mary_tts: function (message, finished_callback) {
    if (window.speechSynthesis.getVoices().length === 0) {
        // either there are no voices 
        ecraft2learn.speak_using_mary_tts(message, 1, 1, finished_callback);
    } else {
        ecraft2learn.speak(message, 0, 0, 1, 0, 0, finished_callback);
    }
  },
  open_project: function (name) {
      get_snap_ide().openProject(name);
  },
  save_project: function (name) {
      get_snap_ide().saveProject(name);
  },
  // experimenting with compiling Snap4Arduino to Arduino C sketch
//   transpile_to_arduino_sketch: function () {
//     try {
//         console.log(
//                 this.world().Arduino.transpile(
//                     this.mappedCode(),
//                     this.parentThatIsA(ScriptsMorph).children.filter(
//                         function (each) {
//                             return each instanceof HatBlockMorph &&
//                                 each.selector == 'receiveMessage';
//                         })));
//     } catch (error) {
//         console.log('Error exporting to Arduino sketch!', error.message)
//     }
//   },
  console_log: function (message) {
      console.log(message);
  },
  handle_server_json_response: function (proc, response, callback) {
     invoke_callback(callback, proc, javascript_to_snap(JSON.parse(response)));
  },
  handle_server_json_response_to_pins_request: function (proc, response_text, callback_for_pins_read, callback_for_pins_written, callback_for_errors) {
      try {
          var response = JSON.parse(response_text);
          var read = response.pins;
          var written = response.write_responses;
          invoke_callback(callback_for_pins_read, proc,    javascript_to_snap(read));
          invoke_callback(callback_for_pins_written, proc, javascript_to_snap(written));
      } catch (error) {
          invoke_callback(callback_for_errors, proc, error.message);
      }
  }
}} ());
