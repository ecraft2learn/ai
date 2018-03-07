 /**
 * Implements JavaScript functions that extend Snap! to access AI cloud services
 * Authors: Ken Kahn
 * License: New BSD
 */

 "use strict";
window.ecraft2learn =
  (function () {
      var this_url = document.querySelector('script[src*="ecraft2learn.js"]').src; // the URL where this library lives
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
          var get_hash_parameter = function (name, parameters, default_value) {
              var parts = parameters.split('&');
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
          if (key && key !== "Enter your key here") {
              return key;
          }
          try {
              if (top.window.location.hash) {
                  // top.window in case this is running in an iframe
                  key = get_hash_parameter(key_name, top.window.location.hash.substring(1));
                  if (key) {
                      return key;
                  }
              }
              var element = top.document.getElementById(key_name);
              if (element) {
                  return element.value;
              }
          } catch (ignore) {
              // top.window may signal an error if iframe and container are different domains
          }
          // key missing to explain how to obtain keys
          if (window.confirm("No value reported by the '" + key_name +
                             " reporter. After obtaining the key edit the reporter in the 'Variables' area. Do you want to visit https://github.com/ecraft2learn/ai/wiki to learn how to get a key?")) {
              window.onbeforeunload = null; // don't warn about reload
              document.location.assign("https://github.com/ecraft2learn/ai/wiki");
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
          return invoke_block_morph(blockTemplate);
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
    var invoke_callback = function (callback) { // any number of additional arguments
        // callback could either be a Snap! object or a JavaScript function
        if (callback instanceof Context) { // assume Snap! callback
            // invoke the callback with the argments (other than the callback itself)
            // if BlockMorph then needs a receiver -- apparently callback is good enough
//             return invoke(callback, new List(Array.prototype.slice.call(arguments, 1)), (callback instanceof BlockMorph && callback)); 
            var stage = world.children[0].stage; // this.parentThatIsA(StageMorph);
//             var process = stage.threads.startProcess(callback.expression,
//                                                      callback.receiver,
//                                                      stage.isThreadSafe,
//                                                      true,
//                                                      function (result) {
//                                                        console.log(result);
//                                                      },
//                                                      false,
//                                                      false);
            var process = new Process(null, callback.receiver, null, true);
            process.initializeFor(callback, new List(Array.prototype.slice.call(arguments, 1)));
            stage.threads.processes.push(process);
        } else if (typeof callback === 'function') { // assume JavaScript callback
            callback.apply(this, arguments);
        }
        // otherwise no callback provided so ignore it
    };
    var invoke_block_morph = function (block_morph) {
        if (!(block_morph instanceof BlockMorph)) {
            console.error("Invoke_block_morph called on non-BlockMorph");
            return;
        }
        return invoke(block_morph, new List(Array.prototype.slice.call(arguments, 1)), block_morph);
    };
    var is_callback = function (x) {
        return x instanceof Context || typeof x === 'function';
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
        context.drawImage(video, 0, 0, width, height);
    };
    var get_mary_tts_voice = function (voice_number) { // offical name
        return get_voice_from(voice_number, mary_tts_voices.map(function (voice) { return voice[0]; }));
    };
    var get_voice = function (voice_number) {
        return get_voice_from(voice_number, window.speechSynthesis.getVoices());
    };
    var get_voice_from = function (voice_number, voices) {
        if (voices.length === 0) {
            window.alert("This browser has no voices available. Either try a different browser or try using the MARY TTS instead.");
            return;
        }
        voice_number = +voice_number; // convert to nunber if is a string
        if (typeof voice_number === 'number' && !isNaN(voice_number)) {
            voice_number--; // Snap (and Scratch) use 1-indexing so convert here
            if (voice_number === -1) {
                voice_number = 0;
                if (ecraft2learn.default_language) {
                    mary_tts_voices.some(function (voice, index) {
                        if (voice[2].indexOf("-") >= 0) {
                            // language and dialect specified
                            if (voice[2] === ecraft2learn.default_language) {
                                voice_number = index;
                                return true;
                            }
                        } else {
                            if (voice[2] === ecraft2learn.default_language.substring(0, 2)) {
                                voice_number = index;
                                return true;
                            }
                        }
                    });
                }
            }
            if (voice_number >= 0 && voice_number < voices.length) {
               return voices[Math.floor(voice_number)];
            } else {
               alert("Only voice numbers between 1 and " + voices.length + " are available. There is no voice number " + (voice_number+1));
            }
        }
    };
    var check_for_voices = function (no_voices_callback, voices_callback) {
        if (window.speechSynthesis.getVoices().length === 0) {
            // either there are no voices or they haven't loaded yet
            if (ecraft2learn.waited_for_voices) {
                no_voices_callback();
            } else {
                // voices not loaded so wait for them and try again
                var onvoiceschanged_ran = false; // so both onvoiceschanged_ran and timeout don't both run
                window.speechSynthesis.onvoiceschanged = function () {
                    onvoiceschanged_ran = true;
                    ecraft2learn.waited_for_voices = true;
                    check_for_voices(no_voices_callback, voices_callback);
                    window.speechSynthesis.onvoiceschanged = undefined;
                };
                // but don't wait forever because there might not be any
                setTimeout(function () {
                               if (!onvoiceschanged_ran) {
                                   // only if onvoiceschanged didn't run
                                   ecraft2learn.waited_for_voices = true;
                                   no_voices_callback();
                                   window.speechSynthesis.onvoiceschanged = undefined;
                               }
                           },
                           10000);
                return;         
            }
        } else {
            voices_callback();
        }
    };
    var get_matching_voice = function (builtin_voices, name_parts) { 
      var voices = builtin_voices ? window.speechSynthesis.getVoices().map(function (voice) { return voice.name.toLowerCase(); }) :
                                    mary_tts_voices.map(function (voice) { return voice[1].toLowerCase(); });
      var voice_number = 0;
      if (!Array.isArray(name_parts) && typeof name_parts !== 'string') {
          // convert from a Snap list to a JavaScript array
          name_parts = name_parts.contents;
      }
      name_parts = name_parts.map(function (part) {
                                      return part.toLowerCase();
                                  });
      var name_matches = function (name) {
          return name_parts.every(function (part) {
                                      return name.indexOf(part) >= 0;
                                  });
      };
      voices.some(function (voice_name, index) {
                      if (name_matches(voice_name)) {
                          voice_number = index+1; // using 1-indexing
                          return true;
                      }
                  });
       return voice_number;
    };
    var speak = function (message, pitch, rate, voice_number, volume, language, finished_callback) {
        // speaks 'message' optionally with the specified pitch, rate, voice, volume, and language
        // finished_callback is called with the spoken text
        // see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
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
        } else if (ecraft2learn.default_language) {
            utterance.lang = ecraft2learn.default_language;
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
        if (voice_number === 0 && ecraft2learn.default_language) {
            var voices = window.speechSynthesis.getVoices();
            voices.some(function (voice, index) {
                if (voice.lang === ecraft2learn.default_language) {
                    voice_number = index+1; // 1-indexing
                }
            })
        }
        utterance.voice = get_voice(voice_number);
        volume = +volume;
        if (typeof volume && volume > 0) {
            utterance.volume = volume;
        }
        utterance.onend = function (event) {
            invoke_callback(finished_callback, message);
        };
    //     if (speech_recognition) {
    //         // don't recognise synthetic speech
    //         ecraft2learn.speech_recognition.abort();
    //     }
        window.speechSynthesis.speak(utterance);
    };
    var no_voices_alert = function () {
        if (!ecraft2learn.no_voices_alert_given) {
            ecraft2learn.no_voices_alert_given = true;
            window.alert("This browser has no voices available. Either try a different browser or try using the MARY TTS instead.");
        }
    };
    var create_costume = function (canvas, name) {
        if (!name) {
            name =  "photo " + Date.now(); // needs to be unique
        }
        return new Costume(canvas, name);
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
    var training_window_request = function (alert_message, message_maker, response_listener, image) {
        var training_image_width  = 227;
        var training_image_height = 227;
        if (!ecraft2learn.machine_learning_window) {
            window.alert(alert_message);
            return;
        }
        var post_image = function (canvas, video) {
            ecraft2learn.canvas = canvas;
            ecraft2learn.video  = video;
            add_photo_to_canvas(canvas, image || video, training_image_width, training_image_height);
            var image_URL = canvas.toDataURL('image/png');
            ecraft2learn.machine_learning_window.postMessage(message_maker(image_URL), "*");
            window.addEventListener("message", response_listener);
        }
        if (ecraft2learn.canvas) {
            post_image(ecraft2learn.canvas, ecraft2learn.video);
        } else {
            // better to use 640x480 and then scale it down before sending it off to the training tab
            ecraft2learn.canvas = ecraft2learn.setup_camera(640, 480, undefined, post_image);
        }
    };
    var get_costumes = function (sprite) {
        if (!sprite) {
            alsert("get_costumes called without specifying which sprite");
            return;
        }
        return sprite.costumes.contents;  
    };
    var costume_of_sprite = function (costume_number, sprite) {
        var costumes = get_costumes(sprite);
        if (costume_number < 0 || costume_number > costumes.length) {
            alert("Cannot add costume number " + costume_number +
                  " to " + label + " training bucket. Only numbers between 1 and " + 
                  costumes.length + " are permitted.");
            return;
        }
        return costumes[costume_number-1]; // 1-indexing to zero-indexing
    };
    var image_url_of_costume = function (costume) {
        var canvas = costume.contents;
        return canvas.toDataURL('image/png');        
    };
    var costume_to_image = function (costume, when_loaded) {
        var image_url = image_url_of_costume(costume);
        var image = document.createElement('img');
        image.src = image_url;
        image.onload = function () {
                           when_loaded(image);
                       };
    }
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

    var debugging = false; // if true console will fill with information

    // the following are the ecraft2learn functions available via this library

    return {
      inside_snap: typeof world === 'object' && world instanceof WorldMorph,
      run: function (function_name, parameters) {
          // runs one of the functions in this library
          if (typeof ecraft2learn[function_name] === 'undefined') {
              if (function_name === "take_picture_and_analyse" ||
                  function_name === "add_photo_as_costume" ||
                  function_name === "update_costume_from_video") {
                  // define it now with default image dimensions
                  // when setup finishes then run take_picture_and_analyse
                  ecraft2learn.setup_camera(640, 
                                            480, 
                                            undefined, // no key
                                            function () {
                                                // delay a second so camera is on when first image is captured
                                                setTimeout(function () {
                                                               ecraft2learn[function_name].apply(null, parameters.contents);
                                                          },
                                                          1000);
                                            });
                  return;
              } else if (function_name === "stop_speech_recognition") {
                  return; // ignore if called before speech_recognition started
              }
              alert("Ecraft2learn library does not have a function named " + function_name);
              return;
          }
          return ecraft2learn[function_name].apply(null, parameters.contents);
      },

      read_url: function (url, callback, error_callback, access_token, json_format) {
          // calls callback with the contents of the 'url' unless an error occurs and then error_callback is called
          // ironically this is the rare function that may be useful when there is no Internet connection
          // since it can be used to communicate with localhost (e.g. to read/write Raspberry Pi or Arduino pins)
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          if (access_token) {
              xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          }
          xhr.onload = function() {
              invoke_callback(callback, json_format ? javascript_to_snap(JSON.parse(xhr.responseText)) : xhr.responseText);
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

      start_speech_recognition: function (final_spoken_callback, error_callback, interim_spoken_callback, language, 
                                          max_alternatives, all_results_callback, all_confidence_values_callback) {
          // final_spoken_callback and interim_spoken_callback are called with the text recognised by the browser's speech recognition capability
          // interim_spoken_callback is optional 
          // or error_callback if an error occurs
          // language is of the form en-US and is optional
          // maxAlternatives 
          // if the browser has no support for speech recognition then the Microsoft Speech API is used (API key required)
          if (typeof SpeechRecognition === 'undefined' && typeof webkitSpeechRecognition === 'undefined') {
              // no support from this browser so try using the Microsoft Speech API
              if (window.confirm("This browser does not support speech recognition. You could use Chrome or you can use Microsoft's speech recognition service. Go ahead and use the Microsoft service?")) {
                  ecraft2learn.start_microsoft_speech_recognition(interim_spoken_callback, final_spoken_callback, error_callback);
              }
              return;
          }
          if (window.speechSynthesis.speaking || ecraft2learn.speech_recognition) { 
              // don't listen while speaking or while listening is still in progress
              if (debugging) {
                  console.log("Delaying start due to " + (window.speechSynthesis.speaking ? "speaking" : "listen in progress"));
              }
              setTimeout(function () {
                             ecraft2learn.start_speech_recognition(final_spoken_callback, error_callback, interim_spoken_callback, language, 
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
                  if (debugging) {
                      console.log("Recognition started");
                  }
                  speech_recognition.start();
 //               console.log("Speech recognition started");
              } catch (error) {
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
              var final = event.results[event.resultIndex].isFinal;         
              invoke_callback(final ? final_spoken_callback : interim_spoken_callback, spoken);
              if (debugging) {
                  console.log("Just invoked callback for " + spoken + ". isFinal is " + event.results[event.resultIndex].isFinal);
              }
              if (is_callback(all_results_callback)) {
                  handle_all_results(event);
              }
              if (is_callback(all_confidence_values_callback)) {
                  handle_all_confidence_values(event);
              } else {
                  // if callback for confidence values isn't used then log the top confidence value
                  console.log("Confidence is " + event.results[event.resultIndex][0].confidence + " for " + spoken);
              }
              if (final) {
                  ecraft2learn.stop_speech_recognition();
              }
          };
          var handle_all_results = function (event) {
              var results = [];
              var result = event.results[event.resultIndex];
              for (var i = 0; i < result.length; i++) {
                  results.push(result[i].transcript);
              }
              invoke_callback(all_results_callback, javascript_to_snap(results));
          };
          var handle_all_confidence_values = function (event) {
              var confidences = [];
              var result = event.results[event.resultIndex];
              for (var i = 0; i < result.length; i++) {
                  confidences.push(result[i].confidence);
              }
              invoke_callback(all_confidence_values_callback, javascript_to_snap(confidences));
          };
          var handle_error = function (event) {
              ecraft2learn.stop_speech_recognition();
              if (debugging) {
                  console.log("Recognition error: " + event.error);
              }
              invoke_callback(error_callback, event.error);
          };
          var speech_recognition_stopped = false; // used to suspend listening when tab is hidden
          var speech_recognition;
          var create_speech_recognition_object = function () {
              speech_recognition = (typeof SpeechRecognition === 'undefined') ?
                                   new webkitSpeechRecognition() :
                                   new SpeechRecognition();
              // following prevents speech_recognition from being garbage collected before its listeners run
              // it is also used to prevent multiple speech recognitions to occur simultaneously
              ecraft2learn.speech_recognition = speech_recognition;
              speech_recognition.interimResults = is_callback(interim_spoken_callback);
              if (typeof language === 'string') {
                  speech_recognition.lang = language;
              } else if (ecraft2learn.default_language) {
                  speech_recognition.lang = ecraft2learn.default_language;
              }
              if (max_alternatives > 1) {
                  speech_recognition.maxAlternatives = max_alternatives;
              }
              speech_recognition.profanityFilter = true; // so more appropriate use in schools, e.g. f*** will result
              speech_recognition.onresult = handle_result;
              speech_recognition.onerror = handle_error;
              speech_recognition.onend = function (event) {
                  if (debugging) {
                      console.log("On end triggered.");
                  }
                  if (ecraft2learn.speech_recognition) {
                      if (debugging) {
                          console.log("On end but no result or error so stopping then restarting.");
                      }
                      ecraft2learn.stop_speech_recognition();
                      create_speech_recognition_object();
                      restart();
                  }                
              };
          };
          create_speech_recognition_object();
          ecraft2learn.stop_speech_recognition = function () {
              if (debugging) {
                  console.log("Stopped.");
              }
              ecraft2learn.speech_recognition = null;
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

    set_default_language: function (language) {
        if (language.indexOf("-") < 0) {
            language = language.toLowerCase() + "-" + language.toUpperCase();
        }
        ecraft2learn.default_language = language;
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
                        invoke_callback(as_recognized_callback, ecraft2learn.last_speech_recognized);
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

  setup_camera: function (width, height, provided_key, after_setup_callback) {
      // sets up the camera for taking photos and sending them to an AI cloud service for recognition
      // causes take_picture_and_analyse to be defined
      // supported service providers are currently 'Google', 'Microsoft', and IBM 'Watson' (or 'IBM Watson')
      // after_setup_callback is optional and called once setup completes
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
              // beginning early December 2017 Watson began signalling No 'Access-Control-Allow-Origin' header
              // so the following proxy should have fixed it but didn't 
              // This may be a temporary problem at IBM and hopefully things will be restored soon
//            var proxy_url = "https://toontalk.appspot.com/p/" + encodeURIComponent("https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?version=2016-05-19&api_key=" + key)
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
//               var vendorURL = window.URL || window.webkitURL;
//               video.src = vendorURL.createObjectURL(stream);
              video.srcObject = stream;
              video.width  = width;
              video.height = height;
              video.play();
              if (after_setup_callback) {
                  after_setup_callback(canvas, video);
              }
          };
          var error_callback = function(error) {
              console.log("An error in getting access to camera: " + error.message);
              console.log(error);
          };
          var constraints = {video: true,
                             audio: false};
          video.style.display  = 'none';
          canvas.style.display = 'none';
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
      video.setAttribute('autoplay', '');
      video.setAttribute('playsinline', '');
      width  = +width; // convert to number
      height = +height;

  // define new functions in the scope of setup_camera

  ecraft2learn.add_photo_as_costume = function () {
      add_photo_to_canvas(canvas, video, width, height);
      add_costume(create_costume(canvas), get_snap_ide().currentSprite);
  };

  ecraft2learn.update_costume_from_video = function (costume_number, sprite) {
      var costume = costume_of_sprite(costume_number, sprite);
      var canvas = costume.contents;
//       canvas.setAttribute('width', width);
//       canvas.setAttribute('height', height);
      var context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, width, height);
      sprite.drawNew();
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
                  // already checked cloud_provider so shouldn't happen here
                  console.error("Unknown cloud provider: " + cloud_provider);
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
        invoke_callback(snap_callback, cloud_provider === "" ? 
                                       "A vision recognition service provider needs to be chosen." :
                                       "Unknown cloud provider: " + cloud_provider);
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
          if (cloud_provider === "") {
              window.alert("A vision recognition service provider needs to be chosen.");
          } else {
              window.alert("No photo has been created for " + cloud_provider + " to recognize.");
          }
      } else {
          add_costume(recognition.costume);
      }
  },

  speak: function (message, pitch, rate, voice_number, volume, language, finished_callback) {
      check_for_voices(function () {
                          no_voices_alert();
                       },
                       function () {
                           speak(message, pitch, rate, voice_number, volume, language, finished_callback)
                       });
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
  get_voice_number_matching: function (name_parts) {
      return get_matching_voice(true, name_parts);
  },
  get_mary_tts_voice_number_matching: function (name_parts) {
      return get_matching_voice(false, name_parts);
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
                                     invoke_callback(finished_callback, javascript_to_snap(message));
                                },
                                false);
     }
     if (+volume > 0) {
         sound.volume = +volume;
     }
     sound.addEventListener('canplay',
                            function () {
                                sound.play();
                            });
     sound.addEventListener('error',
                            function () {
                                invoke_callback(finished_callback, javascript_to_snap(sound.error.message));
                            });
  },
  get_mary_tts_voice_names: function () {
    return new List(mary_tts_voices.map(function (voice) { return voice[1]; }));
  },
  speak_using_browser_voices_or_mary_tts: function (message, finished_callback) {
    check_for_voices(function () {
                         // no voices in browser to use Mary TTS
                         ecraft2learn.speak_using_mary_tts(message, 1, 0, finished_callback);
                     },
                     function () {
                         ecraft2learn.speak(message, 0, 0, 0, 0, 0, finished_callback);
                     });
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
  open_help_page: function () {
      // prefer window.open but then is blocked as a popup
      document.location.assign("https://github.com/ecraft2learn/ai/wiki", "_blank");
  },
  wikipedia_domain: function () {
      if (ecraft2learn.default_language) {
          return "https://" + ecraft2learn.default_language.substring(0, 2) + ".wikipedia.org";
      }
      return "https://en.wikipedia.org";
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
  },
  train_using_images: function (buckets_as_snap_list, add_to_previous_training, page_introduction, callback) {
      var buckets = buckets_as_snap_list.contents;
      var buckets_equal = function (buckets1, buckets2) {
          return buckets1 === buckets2 ||
                 (buckets1.length === buckets2.length &&
                  buckets1.every(function (bucket_name, index) {
                      return bucket_name === buckets2[index];
                  }));
      };
      var open_machine_learning_window = function () {
          var URL = "/ai/camera-train/index.html?translate=1";
          return window.open(URL, "Training " + buckets);
      };
      if (!ecraft2learn.machine_learning_window || ecraft2learn.machine_learning_window.closed) {
          ecraft2learn.image_learning_buckets = buckets;
          var machine_learning_window = open_machine_learning_window();
          ecraft2learn.machine_learning_window = machine_learning_window;
          var receive_ready = 
              function (event) {
                  if (event.data === "Loaded") {
                      machine_learning_window.postMessage({training_class_names: buckets}, "*");
                  } else if (event.data === "Ready") {
                      ecraft2learn.machine_learning_window_ready = true;
                      if (page_introduction) {
                          machine_learning_window.postMessage({new_introduction: page_introduction}, "*");
                      }
                      invoke_callback(callback, "Ready");
                  }
          };      
          window.addEventListener("message", receive_ready, false);                     
          return;
      }     
      if (add_to_previous_training && buckets_equal(buckets, ecraft2learn.image_learning_buckets)) {
          // would like to go to that window:  ecraft2learn.machine_learning_window.focus();
          // but browsers don't allow it unless clear the user initiated it
          window.alert("Go to the training window whenever you want to add to the training.");
      } else {
          ecraft2learn.machine_learning_window.close();
          // start over
          ecraft2learn.train_using_images(buckets_as_snap_list, add_to_previous_training, page_introduction, callback);
      }
  },
  image_confidences: function (callback) {
      // if no costume_number provided then camera is used
      var receive_confidences = function (event) {
                                    if (typeof event.data.confidences !== 'undefined') {
                                        invoke_callback(callback, javascript_to_snap(event.data.confidences));
                                        window.removeEventListener("message", receive_confidences);
                                    };
                                };
      training_window_request("You need to train the system before using 'Current image label confidences'. " +
                              "Run 'Train using camera ...' before this.", 
                              function (image) {
                                  return {predict: image};
                              }, 
                              receive_confidences);
  },
  costume_confidences: function (costume_number, callback, sprite) {
        var costume = costume_of_sprite(costume_number, sprite);
        var receive_confidences = function (event) {
                                    if (typeof event.data.confidences !== 'undefined') {
                                        invoke_callback(callback, javascript_to_snap(event.data.confidences));
                                        window.removeEventListener("message", receive_confidences);
                                    };
                                };
        costume_to_image(costume,
                         function (image) {
                            training_window_request("You need to train the system before using 'Image label confidences'. " +
                                                    "Run 'Train using camera ...' before this.", 
                                                    function (image_URL) {
                                                                 return {predict: image_URL};
                                                    },
                                                    receive_confidences,
                                                    image);
                         });                            
  },
  add_image_to_training: function (costume_number, label, callback, sprite) {
      var receive_comfirmation = 
          function (event) {
              if (typeof event.data.confirmation !== 'undefined') {
                  invoke_callback(callback, event.data.confirmation);
                  window.removeEventListener("message", receive_comfirmation);
              };
      };
      var costume = costume_of_sprite(costume_number, sprite);
      costume_to_image(costume,
                       function (image) {
                          training_window_request("You need to train the system before using 'Add image to training'. " +
                                                  "Run 'Train using camera ...' before this so the system knows the list of possible labels.", 
                                                  function (image_URL) {
                                                      return {train: image_URL,
                                                              label: label};
                                                  },
                                                  receive_comfirmation,
                                                  image);
                       });
  },
  costume_count: function (sprite) {
      return get_costumes(sprite).length;
  },
  training_window_ready: function () {
      return ecraft2learn.machine_learning_window && 
      !ecraft2learn.machine_learning_window.closed &&
      ecraft2learn.machine_learning_window_ready;
  },
        
}} ());
ecraft2learn.get_voice_names(); // to ensure voices are loaded
ecraft2learn.inside_snap = true;
