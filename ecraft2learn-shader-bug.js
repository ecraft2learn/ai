 /**
 * Implements JavaScript functions that extend Snap! to access AI cloud services and the machine learning library tensorflow.js
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict";
window.ecraft2learn =
  (function () {
      let this_url = document.querySelector('script[src*="ecraft2learn.js"]').src; // the URL where this library lives
      let load_script = function (url, when_loaded, if_error) {
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
          if (if_error) {
              script.addEventListener('error', if_error);
          }
          document.head.appendChild(script);
      };
      const inside_snap = function () {
          // this library can be used directly in JavaScript or with other JavaScript-based languages
          // a small amount is Snap! specific and this is used to make those parts conditional on being inside Snap!
          return typeof world === 'object' && typeof WorldMorph === 'function' && world instanceof WorldMorph;
      };
      let get_key = function (key_name) {
          // API keys are provided by Snap! reporters
          var key = run_snap_block(key_name);
          var get_hash_parameter = function (name, parameters, default_value) {
              var parts = decodeURI(parameters).split('&');
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
              let parameters = top.window.location.hash || top.window.location.search;
              // location.search appropriate if this is running inside of the AI guide
              if (parameters) {
                  // top.window in case this is running in an iframe
                  key = get_hash_parameter(key_name, parameters.substring(1));
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
          inform("Missing API key",
                 "No value reported by the '" + key_name +
                 "' reporter. After obtaining the key edit the reporter in the 'Variables' area.\n" +
                 "Do you want to visit https://github.com/ecraft2learn/ai/wiki to learn how to get a key?",
                 function () {
                       window.onbeforeunload = null; // don't warn about reload
                       document.location.assign("https://github.com/ecraft2learn/ai/wiki");                                 
                 });
      };
      let run_snap_block = function (labelSpec) { // add parameters later
          // runs a Snap! block that matches labelSpec
          // labelSpec if it takes areguments will look something like 'label %txt of size %n'
          var ide = get_snap_ide(ecraft2learn.snap_context);
          // based upon https://github.com/jmoenig/Snap--Build-Your-Own-Blocks/issues/1791#issuecomment-313529328
          var allBlocks = ide.sprites.asArray().concat([ide.stage])
                         .map(function (item) {return item.customBlocks})
                         .reduce(function (a, b) {return a.concat(b)})
                         .concat(ide.stage.globalBlocks);
          var blockSpecs = allBlocks.map(function (block) {return block.blockSpec()});
          var index = blockSpecs.indexOf(labelSpec);
          if (index < 0) {
              return;
          }
          var blockTemplate = allBlocks[index].templateInstance();
          return invoke_block_morph(blockTemplate);
      };
      let get_snap_ide = function (start) {
          // finds the Snap! IDE_Morph that is the element 'start' or one of its ancestors
          if (!inside_snap()) {
              return;
          }
          let ide = start;
          while (ide && !(ide instanceof IDE_Morph)) {
              ide = ide.parent;
          }
          if (!ide) {
              // not as general but works well (for now)
              return world.children[0];
          }
          return ide;
      };
      const enhance_snap_openProject = function () {
          if (!inside_snap()) {
              return;
          }
          if (typeof world.Arduino === 'function') {
              return; // inside Snap4Arduino
          }
          let original_open_project = SnapSerializer.prototype.openProject;
          SnapSerializer.prototype.openProject = function (project, ide) {
              if (ecraft2learn.snap_project_opened && window.parent === window) {
                  // already been opened and not inside an iframe
                  // problem with the following is that some ecraft2learn functions have
                  // closed over outer variables and also some window's listeners have been added
//                 ecraft2learn.initialise_all();
                   // find the URL where this library lives and reload it
                  let this_url = document.querySelector('script[src*="ecraft2learn.js"]').src;
                  ecraft2learn = undefined;
                  load_script(this_url, 
                              function () {
                                  original_open_project(project, ide);
                                  ecraft2learn.snap_project_opened = true;
                              });
              } else {
                  original_open_project(project, ide);
                  ecraft2learn.snap_project_opened = true;
              }      
          };        
      };
      const stop_all_scripts = function () {
          if (window.speechSynthesis) {
              window.speechSynthesis.cancel(); // should stop all utterances
          }
          if (ecraft2learn.stop_speech_recognition) {
              ecraft2learn.stop_speech_recognition();
          }
          if (ecraft2learn.support_window) {
              Object.values(ecraft2learn.support_window).forEach(function (support_window) {
                  support_window.postMessage('stop', '*');
              });
          }
          ecraft2learn.outstanding_callbacks.forEach(function (callback) {
              callback.stopped_by_user = true;
          });
          ecraft2learn.outstanding_callbacks = []; // removes all outstanding callbacks
      };
      const track_whether_snap_is_stopped = function () {
          if (!inside_snap()) {
              return;
          }
          var ide = get_snap_ide();
          var original_stopAllScripts = ide.stopAllScripts.bind(ide);
          ide.stopAllScripts = function () {
              stop_all_scripts();
              original_stopAllScripts();
          };      
      };
      if (document.body) {
          track_whether_snap_is_stopped();
          enhance_snap_openProject();
      } else {
          window.addEventListener('load', track_whether_snap_is_stopped, false);
          window.addEventListener('load', enhance_snap_openProject, false);
      }
      let get_global_variable_value = function (name, default_value) {
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
    const record_callbacks = function () {
        Array.from(arguments).forEach(function (callback) {
            if (callback && inside_snap() && callback instanceof Context) {
                ecraft2learn.outstanding_callbacks.push(callback);
            }
        });
    };
    let invoke_callback = function (callback) { // any number of additional arguments
        // callback could either be a Snap! object or a JavaScript function
        if (inside_snap() && inside_snap() && callback instanceof Context) { // assume Snap! callback
            if (callback.stopped_by_user) {
                return;
            }
            if (!(callback.expression instanceof CommandBlockMorph ||
                  callback.expression instanceof ReporterBlockMorph)) {
                return;
            }
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
            // callback.emptySlots+1 is in case callback is passed more arguments than callback has empty slots
            let parameters = callback.emptySlots > 0 ?
                             Array.prototype.slice.call(arguments, 1, callback.emptySlots+1) :
                             Array.prototype.slice.call(arguments, 1);
            process.initializeFor(callback, new List(parameters));
            stage.threads.processes.push(process);
            return process;
        } else if (typeof callback === 'function') { // assume JavaScript callback
            callback.apply(this, Array.prototype.slice.call(arguments, 1));
        }
        // otherwise no callback provided so ignore it
    };
    let invoke_block_morph = function (block_morph) {
        if (!(block_morph instanceof BlockMorph)) {
            console.error("Invoke_block_morph called on non-BlockMorph");
            return;
        }
        return invoke(block_morph, new List(Array.prototype.slice.call(arguments, 1)), block_morph);
    };
    let is_callback = function (x) {
        return (inside_snap() && x instanceof Context) || typeof x === 'function';
    };
    let javascript_to_snap = function (x) {
        if (!inside_snap()) {
            return x;
        }
        if (Array.isArray(x) || x instanceof Float32Array) {
            return new List(x.map(javascript_to_snap));
        }
        if (typeof x === 'object') {
            if (x instanceof List) {
                return x;
            }
            if (x === null) {
                return []; // is the best we can do?
            }
            return new List(Object.keys(x).map(function (key) {
                                                   return new List([key, javascript_to_snap(x[key])]);
                                               }));
        }
        return x;
    };
    const snap_to_javascript = (x, only_numbers) => {
        const numberify = function (x) {
            if (typeof x === 'string') {
                return +x;
            }
            return x;
        }
        if (x instanceof List) {
            x = snap_to_javascript(x.asArray(), only_numbers);
        } else if (x instanceof Array) {
            x = x.map((y) => snap_to_javascript(y, only_numbers));
        }
        if (only_numbers) {
            return numberify(x);
        }
        return x;       
    };
    let add_photo_to_canvas = function (image_or_video, width, height) {
        // Capture a photo by fetching the current contents of the video
        // and drawing it into a canvas, then converting that to a PNG
        // format data URL. By drawing it on an offscreen canvas and then
        // drawing that to the screen, we can change its size and/or apply
        // other changes before drawing it.
        if (!image_or_video) {
            image_or_video = ecraft2learn.video;
        }
        if (!width) {
            width = image_or_video.width;
        }
        if (!height) {
            height = image_or_video.height;
        }
        let canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
//         canvas.setAttribute('width',  width);
//         canvas.setAttribute('height', height);
        let draw_image = function () {
            // is this still used? Only if camera is being used before it has been initialised?
            canvas.getContext('2d').drawImage(image_or_video, 0, 0, width, height);
            ecraft2learn.video.removeEventListener('waiting', draw_image);
        };
        ecraft2learn.video.addEventListener('waiting', draw_image);
        canvas.getContext('2d').drawImage(image_or_video, 0, 0, width, height);
        return canvas;
    };
    let get_mary_tts_voice = function (voice_number) { // official name
        return get_voice_from(voice_number, mary_tts_voices.map(function (voice) { return voice[0]; }));
    };
    var get_voice = function (voice_number) {
        return get_voice_from(voice_number, window.speechSynthesis.getVoices());
    };
    var warned_about_missing_voice_numbers = [];
    var get_voice_from = function (voice_number, voices) {
        if (voices.length === 0) {
            inform("No voices",
                   "This browser has no voices available.\n" + 
                   "Either try a different browser or try using the MARY TTS instead.");
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
            } else if (warned_about_missing_voice_numbers.indexOf(voice_number) < 0) {
                warned_about_missing_voice_numbers.push(voice_number);
                inform("No such voice",
                       "Only voice numbers between 1 and " + voices.length + " are available.\n" + 
                       "There is no voice number " + (voice_number+1) + ".");
            }
        }
    };
    var check_for_voices = function (no_voices_callback, voices_callback) {
        if (window.speechSynthesis.getVoices().length === 0) {
            // either there are no voices or they haven't loaded yet
            if (ecraft2learn.waited_for_voices) {
                invoke_callback(no_voices_callback);
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
                                   invoke_callback(no_voices_callback);
                                   window.speechSynthesis.onvoiceschanged = undefined;
                               }
                           },
                           10000);
                return;         
            }
        } else {
            invoke_callback(voices_callback);
        }
    };
    var get_matching_voice = function (builtin_voices, name_parts) { 
        var voices = builtin_voices ? 
                     window.speechSynthesis.getVoices().map(function (voice) { return voice.name.toLowerCase(); }) :
                     mary_tts_voices.map(function (voice) { return voice[1].toLowerCase(); });
        var voice_number;
        if (!Array.isArray(name_parts) && typeof name_parts !== 'string') {
            // convert from a Snap list to a JavaScript array
            name_parts = name_parts.contents;
        }
        name_parts = name_parts.map(function (part) {
                                        return part.toLowerCase();
                                    });
        var name_parts_double_white_space = name_parts.map(function (part) {
                                                              return " " + part + " ";
        });
        var name_parts_left_white_space   = name_parts.map(function (part) {
                                                              return " " + part;
        });
        var name_parts_right_white_space  = name_parts.map(function (part) {
                                                              return part + " ";
        });
        var name_matches = function (name, parts) {
            return parts.every(function (part) {
                                   return name.indexOf(part) >= 0;
                               });
        };
        [name_parts_double_white_space, name_parts_left_white_space, name_parts_right_white_space, name_parts].some(
             // prefer matches with white space
             // so that "male" doesn't match "female" unless no other choice
             function (parts) {
                 voices.some(function (voice_name, index) {
                                 if (name_matches(voice_name, parts)) {
                                     voice_number = index+1; // using 1-indexing
                                     return true;
                                 }
                             });
                 return voice_number > 0;               
        });          
        if (voice_number >= 0) {
            return voice_number;
        }
        // no match so try using just the first argument to find a matching language entry
        var matching_language_entry = language_entry(name_parts[0]);
        if (matching_language_entry) {
            voice_number = voice_number_of_language_code(matching_language_entry[1], builtin_voices);
        }
        if (voice_number >= 0) {
            return voice_number;
        }
        if (ecraft2learn.language_defaults[name_parts[0]]) {
            // try again since the defaults don't necessaryily match the list of languages
            // e.g. zh-CN is not the same as cmn-Hans-CN
            voice_number = voice_number_of_language_code(ecraft2learn.language_defaults[name_parts[0]], builtin_voices);
        }
        if (voice_number >= 0) {
            return voice_number;
        }
        inform("Unable to find a matching voice",
               "This browser does not have a voice that matches " + name_parts.join("-"));
        return 0; // interpreted as the default voice for the default_language
    };
    var voice_number_of_language_code = function (code, builtin_voices) {
        if (builtin_voices) {
            return builtin_voice_number_with_language_code(code);
        }
        return mary_tts_voice_number_with_language_code(code);
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
        record_callbacks(finished_callback);
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
        if (typeof language === 'string' && language !== "") {
            utterance.lang = language;
            if (!voice_number) {
                voice_number = get_matching_voice(true, [language]);
                if (voice_number === undefined) {
                    voice_number = 0;
                }
            }
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
        if (!voice_number && ecraft2learn.default_language) {
            var voices = window.speechSynthesis.getVoices();
            voices.some(function (voice, index) {
                if (voice.lang === ecraft2learn.default_language) {
                    voice_number = index+1; // 1-indexing
                    return true;
                }
            });
        }
        utterance.voice = get_voice(voice_number);
        volume = +volume;
        if (typeof volume && volume > 0) {
            utterance.volume = volume;
        }
        utterance.onend = function (event) {
            ecraft2learn.speaking_ongoing = false;
            invoke_callback(finished_callback, message);
        };
        ecraft2learn.speaking_ongoing = true;
        window.speechSynthesis.speak(utterance);
    };
    var no_voices_alert = function () {
        if (!ecraft2learn.no_voices_alert_given) {
            ecraft2learn.no_voices_alert_given = true;
            inform("No voices available",
                   "This browser has no voices available.\n" + 
                   "Either try a different browser or try using the MARY TTS instead.");
        }
    };
    const read_file = function (file, callback) {
        let reader = new FileReader();
        reader.onloadend = function () {
            invoke_callback(callback, reader.result);
        };
        reader.readAsText(file);
    };
    const file_to_string = function (callback) {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = function () {
            document.getElementById("world").style.display = 'block';
            input_container.remove();
            read_file(input.files[0], callback);
        }
        document.getElementById("world").style.display = 'none';
        let input_container = document.createElement('div');
        let instructions = document.createElement('p');
        instructions.innerHTML = "<b> Click the file chooser and select a saved training file.</b> It should be a JSON file.";
        input_container.appendChild(instructions);
        input_container.appendChild(input);
        document.body.appendChild(input_container);
    };
    const load_transfer_training_from_file = (source_name, callback) => {
        file_to_string((training_data_as_string) => {
                           load_transfer_training(source_name, training_data_as_string, callback);
                       });
    };
    const load_transfer_training_from_URL = function(source_name, URL, user_callback) {
        let error_callback = function (message) {
            inform("Error reading " + URL, message);
        };
        let callback = function (training_data_as_string) {
            load_transfer_training(source_name, training_data_as_string, user_callback);
        }
        ecraft2learn.read_url(URL, callback, error_callback);
    };
    const create_costume = function (canvas, name) {
        if (!name) {
            name =  "photo " + Date.now(); // needs to be unique
        }
        return new Costume(canvas, name);
    };
    const add_costume = function (costume, sprite) {
        var ide = get_snap_ide();
        if (!sprite) {
            sprite = ide.stage;
        }
        sprite.addCostume(costume);
        sprite.wearCostume(costume);
        ide.hasChangedMedia = true;
    };
    const post_image = function post_image(image, cloud_provider, callback, error_callback) {
        // based upon https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript
        cloud_provider = cloud_provider.trim();
        if (cloud_provider === 'Watson') {
            cloud_provider = 'IBM Watson';
        }
        let key = get_key(cloud_provider + " image key");
        let formData;
        if (!key) {
            callback("No key provided so unable to ask " + cloud_provider + " to analyse an image.");
            return;
        }
        let XHR = new XMLHttpRequest();
        XHR.addEventListener('load', function(event) {
            show_message(""); // remove loading message
            callback(event);
        });
        if (!error_callback) {
            error_callback = function (event) {
                console.error(event);
            }
        }
        XHR.addEventListener('error', function (event) {
            show_message(""); // remove loading message
            error_callback(event);
        });
        show_message("Contacting " + cloud_provider);
        switch (cloud_provider) {
          case "IBM Watson":
              formData = new FormData();
              formData.append("images_file", image, "blob.png");
              // beginning early December 2017 Watson began signalling No 'Access-Control-Allow-Origin' header
              // Note that "Lite" plans are deleted after 30 days of inactivity...
//               var proxy_url = "https://toontalk.appspot.com/p/" + 
//               encodeURIComponent("https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?version=2016-05-19&api_key=" + key);
//               XHR.open('POST', proxy_url);
              XHR.open('POST', "https://apikey:" + key + "gateway.watsonplatform.net/visual-recognition/api/v3/classify?version=2018-03-19");
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
    const machine_learning_browser_warning = function () {
        if (window.navigator.userAgent.indexOf("Chrome") < 0) {
            inform("Possible browser compatibility problem",
                    "Machine learning has been tested in Chrome. If you encounter problems switch to Chrome.");
        } else if (window.navigator.userAgent.indexOf("arm") >= 0 && 
                   window.navigator.userAgent.indexOf("X11") >= 0) {
            inform("Possible Raspberry Pi problem",
                   "You may find that the Raspberry Pi is too slow for machine learning to work well.");
        }       
    };
    let load_transfer_training = (source_name, training_data, callback) => {
        record_callbacks(callback);
        let source;
        const training_heading = '{"saved_' + source_name + '_training":';
        if (training_data.slice(0, training_heading.length) === training_heading) {
            source = 'training using ' + source_name;
        } else {
            inform("Error loading " + source_name + " training", "Unrecognised saved training");
            return;
        }
        let new_window = !ecraft2learn.support_window[source] || ecraft2learn.support_window[source].closed;
        if (new_window) {
            create_machine_learning_window(source, undefined, undefined, undefined, true);    
        } else {
            ecraft2learn.support_window[source].postMessage({training_data: training_data}, "*");
        }
        let receive_messages_from_iframe = 
            function (event) {
                if (event.data === "Loaded") {
                    ecraft2learn.support_window[source].postMessage({training_data: training_data}, "*");
                } else if (typeof event.data.data_set_loaded !== 'undefined') {
                    ecraft2learn.training_buckets[source] = event.data.data_set_loaded;
                    invoke_callback(callback, "Ready");
                    window.removeEventListener('message', receive_messages_from_iframe);
                }
        };
        window.addEventListener('message', receive_messages_from_iframe, false);               
    };
    let train = function (options) {
      // options can be
      let source = options.source; // can be 'training using camera','training using microphone', "posenet", or more
      let buckets_as_snap_list = options.buckets_as_snap_list; // list of labels (as Snap! object)
      let add_to_previous_training = options.add_to_previous_training; // if false will throw away any current training
      let page_introduction = options.page_introduction; // optional HTML that will appear in place of the default on training page
      let callback = options.callback; // if defined will be called when training finished 
      let together = options.together; // if true enable togetherJS collaboration
      let together_url = options.together_url; // another Snap! (or NetsBlox) wants to collaborate using this URL
      let iframe_in_new_tab = options.iframe_in_new_tab; // if not true then iframe is either full size covering up Snap! or a single pixel
      let training_name = options.training_name; // used by audio training 
      let buckets = buckets_as_snap_list.contents;
      if (source === 'training using microphone' && buckets.indexOf('_background_noise_') < 0) {
          buckets.push('_background_noise_');
      }
      let buckets_equal = function (buckets1, buckets2) {
          if (!buckets1 || !buckets2) {
              return false;
          }
          return buckets1 === buckets2 ||
                 (buckets1.length === buckets2.length &&
                  buckets1.every(function (bucket_name, index) {
                      return bucket_name === buckets2[index];
                  }));
      };
      record_callbacks(callback);
      if (!ecraft2learn.support_window[source] || ecraft2learn.support_window[source].closed) {
          let machine_learning_window = create_machine_learning_window(source);
          ecraft2learn.training_buckets[source] = buckets;
          let receive_messages_from_iframe = 
              function (event) {
                  if (event.data === "Loaded") {
                      machine_learning_window.postMessage({training_class_names: buckets,
                                                           training_name: training_name},
                                                          "*");
                  } else if (event.data === "Ready") {
                      if (page_introduction) {
                          machine_learning_window.postMessage({new_introduction: page_introduction}, "*");
                      }
                      invoke_callback(callback, "Ready");
                  }
          };
          window.addEventListener('message', receive_messages_from_iframe, false);               
          return;
      }           
      if (add_to_previous_training &&
          // either the same bucket labels or the previous one was empty 
          (ecraft2learn.training_buckets[source] && ecraft2learn.training_buckets[source].length === 0 ||
           buckets_equal(buckets, ecraft2learn.training_buckets[source]))) {
          if (ecraft2learn.support_iframe[source]) {
              if (ecraft2learn.training_buckets[source].length === 0) {
                  ecraft2learn.training_buckets[source] = buckets;
                  ecraft2learn.support_window[source].postMessage({training_class_names: buckets,
                                                                   training_name: training_name},
                                                                  "*");
                  if (page_introduction) {
                      ecraft2learn.support_window[source].postMessage({new_introduction: page_introduction}, "*");
                  }
              }
              open_support_window(source);
          } else if (iframe_in_new_tab) {
              // would like to go to that window: ecraft2learn.support_window.focus[source]();
              // but browsers don't allow it unless clear the user initiated it
              inform("Training tab ready",
                     "Go to the training window whenever you want to add to the training.");           
          }
          ecraft2learn.support_window[source].postMessage('restart', '*');
          invoke_callback(callback, "Ready");
      } else {
          if (iframe_in_new_tab) {
              ecraft2learn.support_window[source].close();              
          }
          if (ecraft2learn.support_iframe[source]) {
              ecraft2learn.support_iframe[source].remove();
          }
          ecraft2learn.support_window[source] = undefined;
          // start over
          train(options);
      }
  };
  const open_support_window = function (source) {
      if (!ecraft2learn.support_window[source] || ecraft2learn.support_window[source].closed) {
          create_machine_learning_window(source);
      }
      ecraft2learn.support_iframe[source].style.width  = "100%";
      ecraft2learn.support_iframe[source].style.height = "100%";
      ecraft2learn.support_window[source].postMessage('Show support iframe', '*');
  };
  const create_machine_learning_window = function (source, iframe_in_new_tab, together_url, together, one_pixel_iframe) {
      let URL, support_window;
      source = source.trim(); // ignore white spaces on ends
      if (together_url) {
          URL = together_url;
      } else {
          if (source === 'training using camera') {
              URL = "/camera-train/index.html?translate=1";
              if (together) {
                  URL += "&together=1";
              }                  
          } else if (source === 'training using microphone') {
              URL = "/microphone-train/index.html?translate=1";
          } else if (source === 'training using microphone (old version)') {
              URL = "/microphone-train/index-old.html?translate=1";
          } else if (source === 'posenet') {
              URL = "/posenet/index.html?translate=1";
          } else if (source === 'style transfer') {
              URL = "/style-transfer/index.html";
          } else if (source === 'image classifier') {
              URL = "/mobilenet/index.html";
          } else if (source === 'tensorflow.js') {
              URL = "/tensorflow/index.html";
          }
          if (window.location.hostname === "localhost" || window.location.protocol === 'file') {
              URL = ".." + URL;
          } else {
              URL = "https://ecraft2learn.github.io/ai" + URL;
          }
      }
      if (iframe_in_new_tab) {
          // deprecated -- only works for source === 'training using camera'
          machine_learning_browser_warning();
          support_window = window.open(URL, "Training " + buckets);
          window.addEventListener('unload',
                                  function () {
                                      support_window.close();
                                  });
      } else {
          let iframe = document.createElement('iframe');
          document.body.appendChild(iframe);
          iframe.src = URL;
          if (one_pixel_iframe) {
              iframe.style.width = '1px';
              iframe.style.height = '1px';
          } else {
              iframe.style.width = '100%';
              iframe.style.height = '100%';
          }
          iframe.style.border = 0;
          iframe.style.position = 'absolute';
          iframe.style.backgroundColor = 'white';
          // see https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-permissions-in-cross-origin-iframes
          if (source === 'training using microphone') {
              iframe.allow = "microphone"; 
          } else if (source === 'training using camera' || source === 'classify image' || source === 'posenet') {
              iframe.allow = "camera";
          }
          ecraft2learn.support_iframe[source] = iframe;
          support_window = iframe.contentWindow;
      }
      ecraft2learn.support_window[source] = support_window;
      window.addEventListener(
          'message',
          function (event) {
              if (event.data === 'Hide support iframe') {
                  if (typeof ecraft2learn.support_iframe[source] !== 'undefined') {
                      ecraft2learn.support_iframe[source].style.width  = "1px";
                      ecraft2learn.support_iframe[source].style.height = "1px";
                  }
              } else if (event.data === "Ready" && typeof ecraft2learn.support_window_is_ready !== 'undefined') {
                  ecraft2learn.support_window_is_ready[source] = true;             
              } else if (typeof event.data.show_message !== 'undefined') {
                  show_message(event.data.show_message, event.data.duration);
              } else if (typeof event.data.error !== 'undefined') {
                  inform("Error message received from a support window", event.data.error);
              }
          },
          false);
      return support_window;
  };
  const open_posenet_window = function () {
      machine_learning_browser_warning();
      return create_machine_learning_window('posenet');
  };
  const machine_learning_window_request = function (machine_learning_window, 
                                                    message_maker, 
                                                    training_image_width,
                                                    training_image_height,
                                                    image,
                                                    alert_message){
      if (!machine_learning_window) {
          if (alert_message) {
              inform("Training request warning", alert_message);
          }
          return;
      }
      let post_image = function () {
          let canvas = add_photo_to_canvas(image || ecraft2learn.video, 
                                           training_image_width,
                                           training_image_height);
          let image_URL = canvas.toDataURL('image/png');
          machine_learning_window.postMessage(message_maker(image_URL), "*");   
      }
      if (ecraft2learn.video) {
          post_image();
      } else {
          // better to use 640x480 and then scale it down before sending it off to the training tab
          ecraft2learn.setup_camera(640, 480, post_image);
      }    
  };
  const posenet_window_request = 
      function (message_maker, training_image_width, training_image_height, image, alert_message) {
          // if image is undefined then the video element is used
          // if alert_message is undefined no message is displayed if the posenet window hasn't been created
          machine_learning_window_request(ecraft2learn.support_window['posenet'], message_maker, training_image_width, training_image_height, image, alert_message);
      };
  const support_window_request = 
      function (alert_message, message_maker, training_image_width, training_image_height, image) {
          machine_learning_window_request(ecraft2learn.support_window['training using camera'], message_maker, training_image_width, training_image_height, image, alert_message);
  };
  const TRAINING_IMAGE_WIDTH  = 300;
  const TRAINING_IMAGE_HEIGHT = 250;
  var get_costumes = function (sprite) {
        if (!sprite) {
            alert("get_costumes called without specifying which sprite");
            return;
        }
        return sprite.costumes.contents;  
    };
    var costume_of_sprite = function (costume_number, sprite) {
        var costumes = get_costumes(sprite);
        if (costume_number < 0 || costume_number > costumes.length) {
            inform("Invalid costume number",
                   "Cannot add costume number " + costume_number +
                   " to training bucket.\n" + 
                   "Only numbers between 1 and " + 
                   costumes.length + " are permitted.");
            return;
        }
        return costumes[costume_number-1]; // 1-indexing to zero-indexing
    };
    const create_costume_with_style = function(style, costume, callback) {
        // adds a costume to the sprite by applying the style of the sprite's costume number
        // callback if provided will be called after this completes
        // style can be any of the following
        if (not_a_costume(costume, 'create costume in style', callback)) {
            return;
        }
        let style_to_folder_name = {
            "Katsushika Hokusai's Wave": 'wave',
            "Francis Picabia's Udnie": 'udnie',
            "Pablo Picasso's La Muse": 'la_muse',
            "Mathura Style": 'mathura',
            "Leonid Afremov's Rain Princess": 'rain_princess',
            "Edvard Munch's Scream": 'scream',
            "Théodore Géricault's Raft of the Medusa": 'wreck',
            "Matilde Pérez": 'matilde_perez', // this one doesn't work well so isn't in the menu of styles
            "Roberto Matta": 'matta',
        };
        let time_stamp = Date.now();
        let costume_canvas = costume.contents;
        request_of_support_window('style transfer',
                                  'Ready',
                                  () => {
                                      return {style_transfer_request: {URL: costume_canvas.toDataURL(),
                                                                       style: style_to_folder_name[style.trim()],
                                                                       time_stamp: time_stamp}};
                                  },
                                  (message) => {
                                      return typeof message.style_transfer_response !== 'undefined' && 
                                             // reponse received and it is for the same request (time stamps match)
                                             message.style_transfer_response.time_stamp === time_stamp;
                                  },
                                  (message) => {
                                      // support window has responded with a data URL
                                      // need to create a canvas and draw the image on it
                                      let new_canvas = document.createElement('canvas');
                                      new_canvas.height = costume_canvas.height;
                                      new_canvas.width  = costume_canvas.width;
                                      let image = new Image();
                                      image.src = event.data.style_transfer_response.URL;
                                      // remove so this only runs once
                                      // alternatively could use the {once: true} option to addEventListener 
                                      // but not all browsers accept that
                                      image.onload = function() {
                                          new_canvas.getContext('2d').drawImage(image, 0, 0, costume_canvas.width, costume_canvas.height);
                                          // create the costume and pass it to callback
                                          invoke_callback(callback, create_costume(new_canvas, style + " of " + costume.name));
                                      }
                                   });
    };
    const get_image_features = function(costume, callback) {
        // uses mobilenet to compute a feature vector for the costume
        if (not_a_costume(costume, 'get costume features of', callback)) {
            return;
        }
        let time_stamp = Date.now();
        let costume_canvas = costume.contents;
        request_of_support_window('training using camera',
                                  'MobileNet loaded',
                                  () => {
                                      return {get_image_features: {URL: costume_canvas.toDataURL(),
                                                                   time_stamp: time_stamp}};
                                  },
                                  (message) => {
                                      return typeof message.image_features !== 'undefined' && 
                                             // reponse received and it is for the same request (time stamps match)
                                             message.time_stamp === time_stamp;
                                  },
                                  (message) => {
                                      // support window has responded with the list of features
                                      invoke_callback(callback, javascript_to_snap(event.data.image_features));
                                  });      
    };
    const request_of_support_window = (support_window_type, window_ready_state, request_generator, 
                                       // following are optional if don't care about the response
                                       message_filter,
                                       message_receiver) => {
        let send_request = () => {
            if (message_filter) {
                const receive_message = (event) => {
                    if (message_filter(event.data)) {
                        if (!message_receiver(event.data)) {
                            // most receivers are one-shot and should be removed
                            // but if the receiver returns true it is kept
                            window.removeEventListener('message', receive_message);
                        }
                    }
                };
                window.addEventListener('message', receive_message);            
            }
            ecraft2learn.support_window[support_window_type].postMessage(request_generator(), '*');
        };
        send_request_when_support_window_is(window_ready_state, support_window_type, send_request);
    };
    // following functions use the layers level of tensorflow.js to create models, train, and predict
    const create_tensorflow_model = function(name, layers, optimizer, loss_function, input_size, success_callback, error_callback,
                                             activation_function_name) { // nothing uses this just yet defaults to 'relu'
        if (typeof input_size === 'string' && +input_size !== NaN) {
            input_size = +input_size; // convert string to number
        }
        record_callbacks(success_callback, error_callback);
        const time_stamp = Date.now();
        request_of_support_window('tensorflow.js',
                                  'Loaded',
                                  () => {
                                      let configuration = {name: name,
                                                           layers: snap_to_javascript(layers),
                                                           optimizer: optimizer,
                                                           options: {loss_function: loss_function,
                                                                     activation: activation_function_name},
                                                           time_stamp: time_stamp};
                                      // if no size is provided then it will be computed from the training data
                                      if (typeof input_size === 'number') {
                                          configuration.input_size = [input_size];
                                      } else if (input_size instanceof List) {
                                          configuration.input_size = snap_to_javascript(input_size, true); 
                                      } else if (input_size instanceof Array) {
                                          configuration.input_size = input_size; 
                                      }
                                      return {create_model: configuration};
                                  },
                                  (message) => {
                                      return message.model_created === name ||
                                             message.create_model_failed === name;
                                  },
                                  (message) => {
                                      if (message.model_created === name) {
                                          invoke_callback(success_callback, true);
                                      } else if (message.create_model_failed) {
                                          if (error_callback) {
                                              invoke_callback(error_callback, message.error_message);
                                          } else {
                                              inform("Error creating a model", message.error_message);
                                          }
                                      }
                                  });
    };
    const send_data = function(model_name, kind, input, output, ignore_old_dataset, callback) {
        record_callbacks(callback);
        const time_stamp = Date.now();
        request_of_support_window('tensorflow.js',
                                  'Loaded',
                                  () => {
                                      return {data: {input: snap_to_javascript(input, true),
                                                     output: snap_to_javascript(output, true)},
                                              model_name: model_name,
                                              kind: kind,
                                              ignore_old_dataset: ignore_old_dataset,
                                              time_stamp: time_stamp};
                                  },
                                  (message) => {
                                      return message.data_received === time_stamp;
                                  },
                                  (message) => {
                                      invoke_callback(callback, true);
                                  }); // there is no error response
    };
    const train_model = (model_name, epochs, learning_rate, shuffle, validation_split,
                         success_callback, error_callback) => {
        record_callbacks(success_callback, error_callback);
        const time_stamp = Date.now();
        request_of_support_window('tensorflow.js',
                                  'Loaded',
                                  () => {
                                      return {train: {model_name: model_name,
                                                      options: {epochs: epochs,
                                                                learning_rate: learning_rate,
                                                                shuffle: shuffle,
                                                                validation_split: validation_split},
                                                      time_stamp: time_stamp}};
                                  },
                                  (message) => {
                                      return message.training_completed === time_stamp ||
                                             message.training_failed === time_stamp;
                                  },
                                  (message) => {
                                      if (message.training_completed === time_stamp) {
                                          invoke_callback(success_callback,
                                                          javascript_to_snap(message.information));                                          
                                      } else if (error_callback) {
                                          console.log(message.error_message);
                                          invoke_callback(error_callback,
                                                          javascript_to_snap(message.error_message));                                          
                                      } else {
                                          inform("Error in training", message.error_message);
                                      }
                                  });
    };
    const is_model_ready_for_prediction = (model_name, callback) => {
        record_callbacks(callback);
        request_of_support_window('tensorflow.js',
                                  'Loaded',
                                  () => {
                                      return {is_model_ready_for_prediction: {model_name: model_name}};
                                  },
                                  (message) => {
                                      return typeof message.ready_for_prediction === 'boolean' &&
                                             message.model_name === model_name;
                                  },
                                  (message) => {
                                      invoke_callback(callback, javascript_to_snap(message.ready_for_prediction));
                                  });
    };
    const predictions_from_model = (model_name, inputs, success_callback, error_callback) => {
        record_callbacks(success_callback, error_callback);
        const time_stamp = Date.now();
        request_of_support_window('tensorflow.js',
                                  'Loaded',
                                  () => {
                                      return {predict: {model_name: model_name,
                                                        input: snap_to_javascript(inputs, true),
                                                        time_stamp: time_stamp}};
                                  },
                                  (message) => {
                                      return message.prediction === time_stamp ||
                                             message.prediction_failed === time_stamp;
                                  },
                                  (message) => {
                                      if (message.prediction === time_stamp) {
                                          invoke_callback(success_callback, javascript_to_snap(message.result));
                                      } else if (error_callback) {
                                          console.log(message.error_message);
                                          invoke_callback(error_callback, javascript_to_snap(message.error_message));
                                      } else {
                                          inform("Error in prediction", message.error_message);
                                      }
                                  });
    };
    const load_tensorflow_model_from_URL = (URL, success_callback, error_callback) => {
        record_callbacks(success_callback, error_callback);
        request_of_support_window('tensorflow.js',
                                  'Loaded',
                                  () => {
                                      return {load_model_from_URL: URL};
                                  },
                                  (message) => {
                                      return message.model_loaded === URL ||
                                             message.error_loading_model === URL;
                                  },
                                  (message) => {
                                      if (message.model_loaded === URL) {
                                          invoke_callback(success_callback, javascript_to_snap(message.model_name));
                                      } else if (error_callback) {
                                          console.log(message.error_message);
                                          invoke_callback(error_callback, javascript_to_snap(message.error_message));
                                      } else {
                                          inform("Error in loading a model from a URL", message.error_message);
                                      }
                                  });
    };
    const load_data_from_URL = (kind, URL, add_to_previous_data, model_name, success_callback, error_callback) => {
        record_callbacks(success_callback, error_callback);
        // kind is either 'training' or 'validation'
        request_of_support_window('tensorflow.js',
                                  'Loaded',
                                  () => {
                                      return {load_data_from_URL: URL,
                                              kind: kind,
                                              model_name: model_name,
                                              add_to_previous_data: add_to_previous_data};
                                  },
                                  (message) => {
                                      return message.data_loaded === URL ||
                                             message.error_loading_data === URL;
                                  },
                                  (message) => {
                                      if (message.data_loaded === URL) {
                                          invoke_callback(success_callback, javascript_to_snap(message.info));
                                      } else if (error_callback) {
                                          console.log(message.error_message);
                                          invoke_callback(error_callback, javascript_to_snap(message.error_message));
                                      } else {
                                          inform("Error in loading training data from a URL", message.error_message);
                                      }
                                  });
    };
    const optimize_hyperparameters = (model_name, number_of_experiments,
                                      trial_end_callback, success_callback, error_callback) => {
        record_callbacks(trial_end_callback, success_callback, error_callback);
        const time_stamp = Date.now();
        request_of_support_window('tensorflow.js',
                                  'Loaded',
                                  () => {
                                      return {optimize_hyperparameters: true,
                                              model_name: model_name,
                                              number_of_experiments: number_of_experiments,
                                              time_stamp: time_stamp};
                                  },
                                  (message) => {
                                      return message.optimize_hyperparameters_time_stamp === time_stamp;
                                  },
                                  (message) => {
                                      if (message.trial_optimize_hyperparameters) {
                                          invoke_callback(trial_end_callback,
                                                          javascript_to_snap(message.trial_optimize_hyperparameters),
                                                          message.trial_number);
                                          return true; // keep this message receiver for subsequent messages
                                      } else if (message.final_optimize_hyperparameters) {
                                          invoke_callback(success_callback, javascript_to_snap(message.final_optimize_hyperparameters));
                                      } else if (error_callback) {
                                          console.log(message.error_message);
                                          invoke_callback(error_callback, javascript_to_snap(message.error_message));
                                      } else {
                                          inform("Error while optimizing hyperparameters", message.error_message);
                                      }
                                  });
    }
    var image_url_of_costume = function (costume) {
        var canvas = costume.contents;
        return canvas.toDataURL('image/png');        
    };
    var costume_to_image = function (costume, when_loaded) {
        let image_url = image_url_of_costume(costume);
        let image = document.createElement('img');
        image.src = image_url;
        image.onload = function () {
                           when_loaded(image);
                       };
    };
    const not_a_costume = (costume, block_name, callback_1, callback_2) => {
        if (!(costume instanceof Costume)) {
            const error_message = "Input was not a costume but " + typeof costume + " instead.";
            inform("Error from '" + block_name + "'", error_message);
            invoke_callback(callback_1, error_message);
            invoke_callback(callback_2, error_message);
            return true;
        }
    };
    const image_class = function (costume, top_k, labels_callback, probabilities_callback) {
        if (not_a_costume(costume, 'Labels for costume', labels_callback, probabilities_callback)) {
            return;
        }
        image_class_from_canvas(costume.contents, top_k, labels_callback, probabilities_callback);
    };
    const image_class_from_canvas = function(canvas, top_k, labels_callback, probabilities_callback) {
        // timestamp used to respond appropriately to multiple outstanding requests
        let time_stamp = Date.now();
        request_of_support_window('image classifier',
                                  'Ready',                                  
                                  () => {
                                      return {classify: {URL: canvas.toDataURL(),
                                                         top_k: top_k,
                                                         time_stamp: time_stamp}};
                                  },
                                  (message) => {
                                      return typeof message.classify_response !== 'undefined' &&
                                             // reponse received and it is for the same request (time stamps match)
                                             message.classify_response.time_stamp === time_stamp;
                                  },
                                  (message) => {
                                      let classifications = event.data.classify_response.classifications;
                                      // classifications are an array of objects like
                                      // {className: "croquet ball", probability: 0.6669674515724182}
                                      invoke_callback(labels_callback,
                                                      javascript_to_snap(classifications.map(function (classification) {
                                                          return classification.className;
                                                      })));
                                      invoke_callback(probabilities_callback,                
                                                      javascript_to_snap(classifications.map(function (classification) {
                                                          return classification.probability;
                                                      })));
                                                    });    
    };
    const send_request_when_support_window_is = function (state, source, send_request) {
        const receive_message = (event) => {
            if (event.data === state) {
                // support window is ready to receive requests
                ecraft2learn.support_window_is_ready[source] = true;
                send_request();
                window.removeEventListener('message', receive_message);
            }
        };
        window.addEventListener('message', receive_message);
        if (typeof ecraft2learn.support_window[source] === 'undefined') {
            // create the support window as 1x1 pixel
            create_machine_learning_window(source, undefined, undefined, undefined, true);
        }
        if (ecraft2learn.support_window_is_ready[source]) {
            // is already ready to send request
            send_request();
        }
    };
    let language_entry = function (language) {
        var matching_language_entry;
        if (language === "") {
            // use the browser's default language
            return language_entry(window.navigator.language);
        }
        language = language.toLowerCase().trim(); // ignore case and white space at the ends in matching 
        ecraft2learn.chrome_languages.some(function (language_entry) {
            // language_entry is [Language name, Language code, English language name, right-to-left]
            if (language === language_entry[1].toLowerCase()) {
                // code matches
                matching_language_entry = language_entry;
                return true;
            }
        });
        if (matching_language_entry) {
            return matching_language_entry;
        }
        ecraft2learn.chrome_languages.some(function (language_entry) {
            if (language === language_entry[0].toLowerCase() ||
                language === language_entry[2].toLowerCase()) {
                // language name (in itself or in English) matches
                matching_language_entry = language_entry;
                return true;
            }
        });
        if (matching_language_entry) {
            return matching_language_entry;
        }
        if (ecraft2learn.language_defaults[language]) {
            // try again if just language name is given and it is ambiguous
            return language_entry(ecraft2learn.language_defaults[language]);
        }
        if (language.length === 2) {
           // code is is just 2 letters so try repeating it (e.g. id-ID)
           return language_entry(language + "-" + language);
        }
        ecraft2learn.chrome_languages.some(function (language_entry) {
            if (language_entry[0].toLowerCase().indexOf(language) >= 0 ||
                language_entry[2].toLowerCase().indexOf(language) >= 0) {
                // language (in itself or in English) is a substring of a language name
                matching_language_entry = language_entry;
                return true;
            }
        });
        return matching_language_entry; // could be undefined
    };
    const extract_language_code = function (language_string) {
        let language = typeof language_string === 'string' ?
                       language_string.trim() :
                       "";
        if (language) {
            if (language.length === 2) {
                return language;
            }
            if (language.toLowerCase() === "chinese") {
                // many forms of Chinese and none use the zh code
                return "zh";
            }
            if (language.toLowerCase() === "sinhalese") {
                // Wikipedia and Google dictionary prefers sinhalese while Chrome only knows of Sinhala
                return "si";
            }
            language = language_entry(language);
            if (language) {
                return language[1].substring(0, 2);
            } else {
                inform("Unknown language",
                       "Unable to understand what language '" + language_string + "' is.\n" + 
                       "Using the current default language: " + (ecraft2learn.default_language_name || "English"));
            }
        }
        if (ecraft2learn.default_language) {
            return ecraft2learn.default_language.substring(0, 2);
        } else {
            return 'en';
        }
    };
    var builtin_voice_number_with_language_code = function (language_code) {
        var voices = window.speechSynthesis.getVoices();
        var builtin_voice_number;
        voices.some(function (voice, index) {
            if (voice.lang.toLowerCase() === language_code.toLowerCase()) {
                builtin_voice_number = index+1; // 1-indexing
                return true;
            }
        });
        return builtin_voice_number;
    };
    var mary_tts_voice_number_with_language_code = function (language_code) {
        var mary_tts_voice_number;
        mary_tts_voices.some(function (voice, index) {
            if (voice[2].indexOf("-") >= 0) {
                // language and dialect specified
                if (voice[2].toLowerCase() === language_code.toLowerCase()) {
                    mary_tts_voice_number = index+1; // 1-indexing
                    return true;
                }
            } else {
                if (voice[2].toLowerCase() === language_code.substring(0, 2).toLowerCase()) {
                    mary_tts_voice_number = index+1;
                    return true;
                }
            }
        });
        return mary_tts_voice_number;
    };
    var history_of_informs = [];
    const show_message = function (message, seconds) {
        if (inside_snap()) {
            var ide = get_snap_ide(ecraft2learn.snap_context);
            ide.showMessage(message, seconds);
        } else {
            alert(message);
        }
    };
    var inform = function(title, message, callback, ok_to_repeat) {
        if (!ok_to_repeat) {
            let title_and_message = title + "::::" + message;
            if (history_of_informs.indexOf(title_and_message) >= 0) {
                console.log('Repeat of message "' + message + '" with title "' + title + '".');
                return;
            }
            history_of_informs.push(title_and_message);
        }
        // based upon Snap4Arduino index file  
        if (!inside_snap()) { // not inside of snap
            if (callback) {
                if (window.confirm(message)) {
                    callback();
                }
            } else {
                window.alert(message);
            }
            return;
        }
        record_callbacks(callback);
        var ide = get_snap_ide(ecraft2learn.snap_context);
        if (!ide.informing) {
            var box = new DialogBoxMorph();
            ide.informing = true;
            box.ok = function() { 
                ide.informing = false;
                if (callback) { 
                    invoke_callback(callback);
                }
                this.accept();
            };
            if (callback) {
                box.cancel = function () {
                   ide.informing = false;
                   this.accept();
                }
                box.askYesNo(title, message, world);
            } else {
                box.inform(title, message, world);
                if (window.frameElement && window.frameElement.className.indexOf("iframe-clipped") >= 0) {
                    // move it from center of Snap! window to iframe window
                    box.setPosition(new Point(230, 110));
                }
            }   
        }
    };
    let magnitude = function (vector) {
        let sum_of_squares = 0;
        vector.forEach(function (element) {
            sum_of_squares += element*element;
        });
        return Math.sqrt(sum_of_squares);
    };
    let dot_product = function (list1, list2) {
        if (list1.length !== list2.length) {
            list1 = list1.slice(Math.min(list1.length, list2.length)-1);
            list2 = list2.slice(Math.min(list1.length, list2.length)-1);
//             throw "Lists passed to dot_product not the same length";
        }
        let result = 0;
        list1.forEach(function (item, index) {
            result += item*list2[index];
        });
        return result;
    };
    const cosine_similarity = function(features1, features2, magnitude1, magnitude2) {
        features1 = snap_to_javascript(features1);
        features2 = snap_to_javascript(features2);
        magnitude1 = snap_to_javascript(magnitude1);
        magnitude2 = snap_to_javascript(magnitude2);
        return dot_product(features1, features2) /
               ((magnitude1 || magnitude(features1))*(magnitude2 || magnitude(features2)));
    };
    const distance_squared = function(features1, features2) {
        features1 = snap_to_javascript(features1);
        features2 = snap_to_javascript(features2);
        let result = 0;
        features1.forEach(function (feature, index) {
            let difference = feature-features2[index];
            result += difference*difference;
        });
        return result;
    };
    const word_to_features_or_location = function (word, language, features) {
        if (typeof word !== 'string') {
            inform((features ? 'features' : 'location') + " of word",
                   "Expected word to be text but instead is a " + typeof word);
            return;
        }
        language = extract_language_code(language);
        if (typeof words_to_features[language] !== 'object') {
            console.error("word_to_features_or_location called before word embeddings loaded.")
            return;
        }
        const canonical_word = word.trim().toLowerCase();
        const result = (features ? words_to_features [language][canonical_word]:
                                   words_to_locations[language][canonical_word]) || 
                       [];
        if (inside_snap()) {
            return new List(result);
        }
        return result;      
    };
    window.words_to_features  = {};
    window.words_to_locations = {};
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
["bits1-hsmm", "BITS1 German female", "de"],
["dfki-ot-hsmm", "Ot Turkish male", "tr"],
["istc-lucia-hsmm", "Lucia Italian female", "it"],
["marylux", "Mary Luxembourgian female", "lb"],
// ["cmu-nk-hsmm", "NK Teluga female", "te"], // Teluga doesn't work with roman letters or digits
];
   
    var image_recognitions = {}; // record of most recent results from calls to take_picture_and_analyse

    var debugging = false; // if true console will fill with information

    let loading_tensor_flow = false;

    window.addEventListener("message",
                            function (event) {
                                  if (typeof event.data.together_url !== 'undefined') {
                                      ecraft2learn.together_URL = event.data.together_url;
                                  }
                            });

    // the following are the ecraft2learn functions available via this library

    return {
      inside_snap: inside_snap, // determine if this is still needed
      url_for_collaboration: function () {
          return ecraft2learn.together_URL;
      },
      run: function (function_name, parameters) {
          // runs one of the functions in this library
          if (typeof ecraft2learn[function_name] === 'undefined') {
              if (function_name === "add_photo_as_costume") { // needed for backwards compatibility
                  // define it now with default image dimensions
                  // when setup finishes then run add_photo_as_costume
                  ecraft2learn.setup_camera(640, 
                                            480, 
                                            function () {
                                                ecraft2learn[function_name].apply(null, parameters.contents);
                                            });
                  return;
              } else if (function_name === "stop_speech_recognition") {
                  return; // ignore if called before speech_recognition started
              }
              inform("No such function",
                     "eCraft2learn library does not have a function named '" + function_name + "'.");
              return;
          }
          return ecraft2learn[function_name].apply(null, (parameters.contents || [parameters]));
      },

      read_url: function (url, callback, error_callback, access_token, json_format) {
          // calls callback with the contents of the 'url' unless an error occurs and then error_callback is called
          // ironically this is the rare function that may be useful when there is no Internet connection
          // since it can be used to communicate with localhost (e.g. to read/write Raspberry Pi or Arduino pins)
          var xhr = new XMLHttpRequest();
          record_callbacks(callback, error_callback);
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

      start_speech_recognition: function (final_spoken_callback, 
                                          // following are optional
                                          error_callback, 
                                          interim_spoken_callback, 
                                          language, 
                                          max_alternatives,
                                          all_results_callback,
                                          all_confidence_values_callback,
                                          grammar) {
          // final_spoken_callback and interim_spoken_callback are called
          // with the text recognised by the browser's speech recognition capability
          // interim_spoken_callback 
          // or error_callback if an error occurs
          // language is of the form en-US and is optional
          // maxAlternatives
          // all_results_callback and all_confidence_values_callback receive the list of results and their confidences
          // grammar -- see https://www.w3.org/TR/jsgf/ for JSGF format
          // if the browser has no support for speech recognition then the Microsoft Speech API is used (API key required)
          if (typeof SpeechRecognition === 'undefined' && typeof webkitSpeechRecognition === 'undefined') {
              // no support from this browser so try using the Microsoft Speech API
              inform("This browser does not support speech recognition",
                     "You could use Chrome or you can use Microsoft's speech recognition service.\n" +
                     "Go ahead and use the Microsoft service? (It requires an API key.)",
                      function () {
                           ecraft2learn.start_microsoft_speech_recognition(interim_spoken_callback, final_spoken_callback, error_callback);
                      });                  
              return;
          }
          if (window.speechSynthesis.speaking || ecraft2learn.speaking_ongoing || ecraft2learn.speech_recognition) { 
              // don't listen while speaking or while listening is still in progress
              // added ecraft2learn.speaking_ongoing since window.speechSynthesis.speaking wasn't sufficient on some systems
              if (debugging) {
                  console.log("Delaying start due to " + (window.speechSynthesis.speaking ? "speaking" : "listen in progress"));
              }
              setTimeout(function () {
                             ecraft2learn.start_speech_recognition(final_spoken_callback, error_callback, interim_spoken_callback, language, 
                                                                   max_alternatives, all_results_callback, all_confidence_values_callback,
                                                                   grammar); 
                         },
                         100); // try again in a tenth of a second
              return;
          }
          record_callbacks(final_spoken_callback, error_callback, interim_spoken_callback, all_results_callback, all_confidence_values_callback);
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
              if (inside_snap()) {
                  // event breaks things for Snap! callbacks
                  invoke_callback(final ? final_spoken_callback : interim_spoken_callback, spoken);
              } else {
                  invoke_callback(final ? final_spoken_callback : interim_spoken_callback, spoken, event);
              }         
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
                  var matching_language_entry = language_entry(language);
                  if (matching_language_entry) {
                      speech_recognition.lang = matching_language_entry[1];
                  } else {
                      inform("No matching language",
                             "Could not a find a language that matches '" + language + "'.");
                  }
              } 
              if (ecraft2learn.default_language && !speech_recognition.lang) {
                  speech_recognition.lang = ecraft2learn.default_language;
              }
              if (max_alternatives > 1) {
                  speech_recognition.maxAlternatives = max_alternatives;
              }
              speech_recognition.profanityFilter = true; // so more appropriate use in schools, e.g. f*** will result
              if (grammar) {
                  // grammar currently ignored by Chrome 
                  var speechGrammarList = typeof SpeechGrammarList === 'undefined' ?
                                          webkitSpeechGrammarList :
                                          SpeechGrammarList;
                  grammar = '#JSGF V1.0; grammar commands; public <commands> = ' + grammar + ';';
                  let speechRecognitionList = new speechGrammarList();
                  speechRecognitionList.addFromString(grammar, 1);
                  speech_recognition.grammars = speechRecognitionList;
              }
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
          // if the tab or window is minimised or hidden then
          // speech recognition is paused until the window or tab is shown again
          let process_messages = function(message) {
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
               // remove so this only runs once
               // alternatively could use the {once: true} option to addEventListener 
               // but not all browsers accept that
               window.removeEventListener("message", process_messages);
          };
          window.addEventListener("message", process_messages);
    },

    set_default_language: function (language) {
        var matching_language_entry = language_entry(language);
        if (!matching_language_entry) {
            inform("Unrecognised language",
                   "Unable to recognise which language is described by '" + language + "'.\n" +
                   "Default language unchanged.");
        } else if (ecraft2learn.default_language !== matching_language_entry[1]) {
            // default has been changed so notify user
            ecraft2learn.default_language = matching_language_entry[1];
            ecraft2learn.default_language_name = matching_language_entry[2];
            var mary_tts_voice_number = mary_tts_voice_number_with_language_code(matching_language_entry[1]);
            var message = "Speech recognition will expect " + ecraft2learn.default_language_name + " to be spoken.\n";
            var no_voices_callback = function () {
                if (mary_tts_voice_number >= 0) {
                    message += "No matching browser speech synthesis voice found but Mary TTS voice " +
                               mary_tts_voices[mary_tts_voice_number-1][1] + " can be used.\n" +
                               "Use the Speak (using Mary TTS engine) command.";
                } else {
                    message += "No speech synthesis support for " + ecraft2learn.default_language_name + " found so English will be used.";
                }
                inform("Default language set", message);
            };
            var voices_callback = function () {
                var builtin_voice_number = builtin_voice_number_with_language_code(matching_language_entry[1]);
                if (builtin_voice_number >= 0) {
                    message += "Speech synthesis will use the browser's voice named ''" + 
                               // subtract 1 since getVoices is zero-indexed
                               window.speechSynthesis.getVoices()[builtin_voice_number-1].name + "''.";
                    inform("Default language set", message);
                } else {
                    no_voices_callback();
                }
            };
            // the following will wait for voices to be loaded (or time out) before responding
            check_for_voices(no_voices_callback, voices_callback);  
        }
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
        record_callbacks(as_recognized_callback, final_spoken_callback, error_callback);
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

  camera_ready: function () {
     return !!ecraft2learn.video && 
            ecraft2learn.video.readyState === 4; 
  },

  set_camera_dimensions: function (width, height) {
      // is this still needed?
      if (ecraft2learn.video && width && height) {
          let stage = world.children[0].stage;
          ecraft2learn.video.width  = Math.min(+width, stage.width());
          ecraft2learn.video.height = Math.min(+height, stage.height());
          return true;
      }
      return false;
  },

  setup_camera: function (width, height, after_setup_callback) {
      // sets up the camera for taking photos and sending them to an AI cloud service for recognition
      // causes some methods to be defined in this scope
      // supported service providers are currently 'Google', 'Microsoft', and IBM 'Watson' (or 'IBM Watson')
      // after_setup_callback is optional and called once setup completes
      if (ecraft2learn.video &&
           (width === 0 || (ecraft2learn.video.width === +width && ecraft2learn.video.height === +height))) {
          // already initialised and not changing the dimensions
          invoke_callback(after_setup_callback);
          return;
      }
      let stage = world.children[0].stage;
      if (width) {
          width  = +width; // convert to number if string
      } else if (stage) {
          width = stage.width();
      } else {
          width = 640;
      }
      if (height) {
          height = +height;
      } else if (stage) {
          height = stage.height();
      } else {
          height = 480;
      }
      // if video and canvas already exist this may change its dimensions
      let video  = ecraft2learn.video  || document.createElement('video');
//       let canvas = document.createElement('canvas');
      let callback = function(stream) {
          video.srcObject = stream;
          video.width  = width;
          video.height = height;
          video.play();
          ecraft2learn.video = video;
          invoke_callback(after_setup_callback);
      };
      const error_callback = function(error) {
          inform("Camera access error", error.message);
          console.log(error);
      };
      let constraints = {video: true,
                         audio: false};
      video.style.display  = 'none';
//       canvas.style.display = 'none';
//       canvas.width = width;
//       canvas.height = height;
      document.body.appendChild(video);
//       document.body.appendChild(canvas);
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
      }
      video.setAttribute('autoplay', '');
      video.setAttribute('playsinline', '');
  },

  add_photo_as_costume: function (sprite) {
      // deprecated once I understood that costumes were first-class objects - see costume_from_camera
      let canvas = add_photo_to_canvas();
      add_costume(create_costume(canvas), sprite);
  },

  costume_from_camera: function () {
      let canvas = add_photo_to_canvas();
      return create_costume(canvas);
  },

  update_costume_from_video: function (costume_or_costume_number, sprite) {
      // costume_number is deprecated but kept for backwards compatibility
      let costume = costume_or_costume_number instanceof Costume ?
                        costume_or_costume_number :
                        costume_of_sprite(costume_or_costume_number, sprite);
      if (not_a_costume(costume, 'a costume block')) {
          return;
      }
      let canvas = costume.contents;
      let context = canvas.getContext('2d');
      context.drawImage(ecraft2learn.video, 0, 0, ecraft2learn.video.width, ecraft2learn.video.height);
      sprite.drawNew();
  },

  take_picture_and_analyse: function (cloud_provider, show_photo_or_costume, snap_callback) {
      // snap_callback is called with the result of the image recognition
      // show_photo_or_costume if a boolean displays the photo when it is taken -- for backwards compatibility
      // the new normal use if that show_photo_or_costume is a costume to be sent to the services
      cloud_provider = cloud_provider.trim();
      if (cloud_provider === 'Watson') {
          cloud_provider = 'IBM Watson';
      }
      let canvas_for_analysis;
      record_callbacks(snap_callback);
      var callback = function (response_string) {
          let response = JSON.parse(response_string);
          if (response.error) {
              image_recognitions[cloud_provider].error = response.error;
              invoke_callback(snap_callback, javascript_to_snap(response.error));
              return;
          }
          let response_as_javascript_object;
          switch (cloud_provider) {
              case "IBM Watson":
                  response_as_javascript_object = response.images[0].classifiers[0].classes;
                  break;
              case "Google":
                  response_as_javascript_object = response.responses[0];
                  break;
              case "Microsoft":
                  response_as_javascript_object = response;
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
    let costume;
    if (show_photo_or_costume instanceof Costume) {
        costume = show_photo_or_costume;
        canvas_for_analysis = costume.contents;
    } else {
        let canvas = add_photo_to_canvas();
        costume = create_costume(canvas);
        canvas_for_analysis = canvas;
    }
    if (show_photo_or_costume === true) {
        add_costume(costume);
    }
    image_recognitions[cloud_provider] = {costume: create_costume(canvas_for_analysis)};
    switch (cloud_provider) {
    case "IBM Watson":
    case "Microsoft":
        canvas_for_analysis.toBlob(
            function (blob) {
                post_image(blob,
                           cloud_provider,
                           function (event) {
                               if (typeof event === 'string') {
                                   inform("Error from service provider", event);
                               } else {
                                   callback(event.currentTarget.response);
                               }
                           });
            },
            "image/png");
        break;
    case "Google":
        post_image(canvas_for_analysis.toDataURL('image/png'),
                   cloud_provider,
                   function (event) {
                       if (typeof event === 'string') {
                           inform("Error from Google", event);
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
  },

  image_property: function (cloud_provider, property_name_or_names) {
      cloud_provider = cloud_provider.trim();
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
      // deprecated
      cloud_provider = cloud_provider.trim();
      var recognition = image_recognitions[cloud_provider];
      if (!recognition || !recognition.costume) {
          if (cloud_provider === "") {
              inform("No service provided selected",
                     "A vision recognition service provider needs to be chosen.");
          } else {
              inform("No photo",
                     "No photo has been created for " + cloud_provider + " to recognize.");
          }
      } else {
          add_costume(recognition.costume);
      }
  },

  current_photo_as_costume: function (cloud_provider) {
      cloud_provider = cloud_provider.trim();
      let recognition = image_recognitions[cloud_provider];
      if (!recognition || !recognition.costume) {
          if (cloud_provider === "") {
              inform("No service provided selected",
                     "A vision recognition service provider needs to be chosen.");
          } else {
              inform("No photo",
                     "No photo has been created for " + cloud_provider + " to recognize.");
          }
      } else {
          return recognition.costume;
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
  check_for_voices: check_for_voices, // export this to Snap! to test if voices available
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
     // due to possible use of default_language the following can't use the voice_number
     var locale = mary_tts_voices[mary_tts_voices.findIndex(function (entry) {return entry[0] === voice;})][2];
     var locale_parameter = "&LOCALE=" + locale;
     let audio_url_without_domain = "/process?INPUT_TEXT=" + 
                                    (typeof message === 'string' ? message.replace(/\s/g, "+") : message) + 
                                    "&INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&AUDIO=WAVE_FILE" +
                                    voice_parameter +
                                    locale_parameter;
     let create_sound = function (domain) {
         let sound = new Audio(domain + audio_url_without_domain);
         try {
             if (finished_callback) {
                 sound.addEventListener("ended", 
                                        function () {
                                            invoke_callback(finished_callback,
                                                            javascript_to_snap(message));
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
                                        if (domain !== "http://mary.dfki.de:59125") {
                                            create_sound("http://mary.dfki.de:59125");
                                        } else {
                                            invoke_callback(finished_callback,
                                                            javascript_to_snap(sound.error.message));                                    
                                        }
                                    });
         } catch (e) {
             // listening to errors so no need to have this one 
             create_sound("http://mary.dfki.de:59125");
         };
     };
     record_callbacks(finished_callback);
     create_sound("http://localhost:59125");     
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
  console_log: function (message) {
      message = snap_to_javascript(message);
      console.log(message);
  },
  console_time: function (label) {
      console.time(label);
  },
  console_time_end: function (label) {
      console.timeEnd(label);
  },
  open_help_page: function () {
      // prefer window.open but that is blocked as a popup
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
  handle_server_json_response_to_pins_request: function (response_text,
                                                         callback_for_pins_read,
                                                         callback_for_pins_written,
                                                         callback_for_errors) {
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
  train_using_camera: function (buckets_as_snap_list, add_to_previous_training, page_introduction, callback, together, together_url) {
      train({source: 'training using camera', 
             buckets_as_snap_list: buckets_as_snap_list, 
             add_to_previous_training: add_to_previous_training,
             page_introduction: page_introduction,
             callback: callback,
             together: together,
             together_url: together_url});
  },
  train_using_images: function (buckets_as_snap_list, add_to_previous_training, page_introduction, callback, together, together_url) {
      // old name kept for backwards compatibility
      train({source: 'training using camera', 
             buckets_as_snap_list: buckets_as_snap_list, 
             add_to_previous_training: add_to_previous_training,
             page_introduction: page_introduction,
             callback: callback,
             together: together,
             together_url: together_url});
  },
  tensorflow_train_using_microphone: function (buckets_as_snap_list, add_to_previous_training, page_introduction, callback, training_name) {
      train({source: 'training using microphone', 
             buckets_as_snap_list: buckets_as_snap_list, 
             add_to_previous_training: add_to_previous_training,
             page_introduction: page_introduction,
             callback: callback,
             training_name: training_name});
  },
  train_using_microphone: function (buckets_as_snap_list, add_to_previous_training, page_introduction, callback, training_name) {
      // old version kept for backwards compatibility and for tiny computers such as Raspberry Pi
      train({source: 'training using microphone (old version)', 
             buckets_as_snap_list: buckets_as_snap_list, 
             add_to_previous_training: add_to_previous_training,
             page_introduction: page_introduction,
             callback: callback,
             training_name: training_name});
  },
  image_confidences: function (callback) {
      var receive_confidences = function (event) {
          if (typeof event.data.confidences !== 'undefined') {
              invoke_callback(callback, javascript_to_snap(event.data.confidences));
              window.removeEventListener("message", receive_confidences);
          };
      };
      record_callbacks(callback);
      support_window_request("You need to train the system before using 'Current image label confidences'.\n" +
                              "Run the 'Train using image buckets ...' command before this.", 
                              function (image_URL) {
                                  return {predict: image_URL};
                              }, 
                              TRAINING_IMAGE_WIDTH,
                              TRAINING_IMAGE_HEIGHT);
       window.addEventListener("message", receive_confidences);
  },
  costume_confidences: function (costume_or_costume_number, callback, sprite) {
      let receive_confidences = function (event) {
          if (typeof event.data.confidences !== 'undefined') {
              invoke_callback(callback, javascript_to_snap(event.data.confidences));
              window.removeEventListener("message", receive_confidences);
          };
      };
      let costume = typeof costume_or_costume_number === 'object' ?
                           costume_or_costume_number :
                           costume_of_sprite(costume_or_costume_number, sprite);
      if (not_a_costume(costume, 'Analyse costume', callback)) {
          return;
      }
      record_callbacks(callback);
      costume_to_image(costume,
                       function (image) {
                           support_window_request("You need to train the system before using 'Image label confidences'.\n" +
                                                   "Run the 'Add costume ...' block before this.", 
                                                   function (image_URL) {
                                                                 return {predict: image_URL};
                                                   },
                                                   TRAINING_IMAGE_WIDTH,
                                                   TRAINING_IMAGE_HEIGHT,
                                                   image);
                            window.addEventListener("message", receive_confidences);
                        });                            
  },
  microphone_confidences: function (builtin_recognizer, callback) {
      let receive_confidences = function (event) {
          if (typeof event.data.confidences !== 'undefined') {
              invoke_callback(callback, javascript_to_snap(event.data.confidences));
              // remove this when stopped 
              ecraft2learn.outstanding_callbacks.push(function () {
                  window.removeEventListener("message", receive_confidences);
              });              
           }
      };
      record_callbacks(callback);
      if (!ecraft2learn.support_window['training using microphone']) {
          if (!builtin_recognizer) {
              inform("Training request warning",
                     "Run the 'Train with audio buckets ...' command before using 'Audio label confidences'");
              return;              
          }
          // create a hidden support window
          ecraft2learn.support_window['training using microphone'] =
              create_machine_learning_window('training using microphone', undefined, undefined, undefined, true);
          window.addEventListener(
              'message',
              function (event) {
                  if (event.data === "Loaded") {
                      ecraft2learn.support_window['training using microphone'].postMessage({training_class_names: []}, "*");
                      ecraft2learn.training_buckets['training using microphone'] = [];
                  } else if (event.data === "Ready") {
                      ecraft2learn.support_window['training using microphone'].postMessage({predict: !builtin_recognizer}, "*");
                  }
          });
      } else {
          ecraft2learn.support_window['training using microphone'].postMessage({predict: !builtin_recognizer}, "*");
      }
      window.addEventListener("message", receive_confidences);
  },
  stop_audio_recognition: () => {
      if (ecraft2learn.support_window['training using microphone']) {
          ecraft2learn.support_window['training using microphone'].postMessage('stop', "*");
      }  
  },
  audio_confidences: function (callback, duration_in_seconds, version) {
      // deprecated version
      var receive_confidences = function (event) {
          if (typeof event.data.confidences !== 'undefined') {
              invoke_callback(callback, javascript_to_snap(event.data.confidences));
              window.removeEventListener("message", receive_confidences);
           };
      };
      record_callbacks(callback);
      if (!ecraft2learn.support_window['training using microphone (old version)']) {
          inform("Training request warning",
                 "Run the 'Train with audio buckets ...' command before using 'Audio label confidences'");
          return;
      }
      if (typeof duration_in_seconds != 'number' || duration_in_seconds <= 0) {
          duration_in_seconds = 3; // 3 second default 
      }
      // convert from milliseconds to seconds
      ecraft2learn.support_window['training using microphone (old version)'].postMessage({predict: duration_in_seconds*1000}, "*");
      window.addEventListener("message", receive_confidences);  
  },
  stop_audio_recognition: function () {
      if (ecraft2learn.support_window['training using microphone']) {
          ecraft2learn.support_window['training using microphone'].postMessage('stop_recognising', "*");
      }
  },
  add_image_to_training: function (costume_or_costume_number, label, callback, sprite) {
      // costume_number supported for backwards compatibility
      var receive_comfirmation = 
          function (event) {
              if (typeof event.data.confirmation !== 'undefined') {
                  invoke_callback(callback, event.data.confirmation);
                  window.removeEventListener("message", receive_comfirmation);
              };
      };
      var costume = typeof costume_or_costume_number === 'object' ?
                    costume_or_costume_number :
                    costume_of_sprite(costume_or_costume_number, sprite);
      record_callbacks(callback);
      costume_to_image(costume,
                       function (image) {
                           support_window_request("You need to start training before using 'Add image to training'.\n" +
                                                   "Run 'Train using camera ...' before this " +
                                                   " so the system knows the list of possible labels.", 
                                                   function (image_URL) {
                                                       return {train: image_URL,
                                                               label: label};
                                                   },
                                                   TRAINING_IMAGE_WIDTH,
                                                   TRAINING_IMAGE_HEIGHT,
                                                   image);
                            window.addEventListener("message", receive_comfirmation);
                       });
  },
  costume_count: function (sprite) {
      return get_costumes(sprite).length;
  },
  support_window_ready: function (source) {
      if (!source) {
          source = 'training using camera';
      }
      return typeof ecraft2learn.support_window !== 'undefined' && 
             typeof ecraft2learn.support_window[source] !== 'undefined' && 
             !ecraft2learn.support_window[source].closed &&
             ecraft2learn.support_window_is_ready[source] === true;
  },
  support_window_visible: function (source) {
      if (!ecraft2learn.support_iframe[source]) {
          return false;
      }
      if (!source) {
          source = 'training using camera';
      }
      return ecraft2learn.support_iframe[source].style.width === "100%";
  },
  poses: function (callback) {
      var ask_for_poses = function (window_just_created) {
          if (!ecraft2learn.support_window['posenet'] || ecraft2learn.support_window['posenet'].closed) {
              open_posenet_window();
              const listen_for_posenet_window_ready = function (event) {
                  if (event.data == "Ready") {
                      ask_for_poses(true);
                      window.removeEventListener("message", listen_for_posenet_window_ready);
                  }
              }
              window.addEventListener("message", listen_for_posenet_window_ready);
              return;                      
          }
          record_callbacks(callback);
          const message_maker = function (image_URL) {
                                    return {compute_poses: image_URL};
                                };
          posenet_window_request(message_maker, 400, 400);
          const receive_poses = function (event) {
              if (typeof event.data.poses !== 'undefined') {
                  event.data.poses.forEach(function (pose) {
                      pose.window_just_created = !!window_just_created;
                  });
                  invoke_callback(callback, javascript_to_snap(event.data.poses));
                  window.removeEventListener("message", receive_poses);
              };
          };
          window.addEventListener("message", receive_poses);
      };
      ask_for_poses();
  },
  weather: function (place, element_name, units, callback, error_callback) {
      // element names documented at https://developer.yahoo.com/weather/documentation.html
      // units can be either 'metric' or 'imperial'
      place = place.trim();
      element_name = element_name.trim();
      units = units.trim();
      let query_name = element_name; // except for those that are under 'item'
      if (element_name === 'everything') {
          element_name = '*';
          query_name = '*';
      } else if (element_name === 'latitude') {
          element_name = 'lat';
          query_name = 'item';
      } else if (element_name === 'longitude') {
          element_name = 'long';   
          query_name = 'item';
      } else if (element_name === 'forecast' || element_name === 'condition') {
          query_name = 'item';
      }
//       if (!error_callback) {
//           error_callback = function (error) {
//               inform("Error from Yahoo! weather service", error);
//           };
//       };
      let units_code = units === 'metric' ? 'c' : 'f';
      window.callback_for_yahoo = function (data) {
          if (data.query.results) {
              let channel = data.query.results.channel;
              let response = query_name === 'item' ? 
                             channel.item[element_name] : 
                             (element_name === '*' ? channel : channel[element_name]);
              if (response) {
                  invoke_callback(callback, javascript_to_snap(response));
              } else {
                  invoke_callback(error_callback, "Unable to extract " + element_name + " from response.");
              }                     
          } else {
              invoke_callback(error_callback, "No results returned for " + element_name + " of " + place);
          }
      }
      let URL = "https://query.yahooapis.com/v1/public/yql?q=select " +
                query_name +
                " from weather.forecast where u='" + units_code + "' and " +
                "woeid in (select woeid from geo.places(1) where text='" +
                place + 
                "')&format=json&callback=callback_for_yahoo";      
      load_script(URL, undefined, error_callback);
  },
  create_costume_with_style: create_costume_with_style,
  get_image_features: get_image_features,
  create_tensorflow_model: create_tensorflow_model,
  send_data: send_data,
  train_model: train_model,
  is_model_ready_for_prediction: is_model_ready_for_prediction,
  predictions_from_model: predictions_from_model,
  load_tensorflow_model_from_URL: load_tensorflow_model_from_URL,
  load_data_from_URL: load_data_from_URL,
  optimize_hyperparameters: optimize_hyperparameters,
  display_support_window: open_support_window,
  image_class: image_class,
  inform: inform,
  show_message: show_message,
  load_camera_training_from_file: (callback) => {
      load_transfer_training_from_file('camera', callback);
  },
  load_camera_training_from_URL: (URL, user_callback) => {
      load_transfer_training_from_URL('camera', URL, user_callback);
  },
  load_microphone_training_from_file: (callback) => {
      load_transfer_training_from_file('microphone', callback);
  },
  load_microphone_training_from_URL: (URL, user_callback) => {
      load_transfer_training_from_URL('microphone', URL, user_callback);
  },
  // following is for backwards compatibility (name change to avoid confusion with generic training data)
  load_training_from_file: (callback) => {
      load_transfer_training_from_file('camera', callback);
  },
  load_training_from_URL: (URL, user_callback) => {
      load_transfer_training_from_URL('camera', URL, user_callback);
  },
  // some word embedding functionality
  dot_product: dot_product,
  cosine_similarity: cosine_similarity,
  euclidean_distance: (x, y) => Math.sqrt(distance_squared(x, y)),
  word_embeddings_ready: function (language, callback, word_embeddings_url) {
      let word_locations_url;
      language = extract_language_code(language);
      if (typeof words_to_features[language] === 'object') {
          invoke_callback(callback, "loaded");
          return;
      }
      if (typeof words_to_features[language] !== 'object') {
          if (!word_embeddings_url) {
              word_embeddings_url = "word-embeddings/" + language + "/wiki-words.js";
              word_locations_url  = "word-embeddings/" + language + "/word-locations.js";
          }
          show_message("Loading words ...");
          let error_handler = function (event) {
                                  show_message("Error while loading '" + word_embeddings_url + "'.\nTry another language.");
                                  invoke_callback(callback, "error");
                              }
          let load_word_embeddings = function () {
              load_script(word_embeddings_url,
                          function () {
                              show_message("");
                              invoke_callback(callback, "loaded");
                          },
                          error_handler);           
          };
          if (word_locations_url) {
              load_script(word_locations_url, load_word_embeddings, error_handler);
          }
          
      }
  },
  word_to_location: function (word, language) {
      return word_to_features_or_location(word, language, false);
  },
  word_to_features: function (word, language) {
      return word_to_features_or_location(word, language, true);
  },
  words_to_features: function (word, language) {
      // for backwards compatibility
      return word_to_features_or_location(word, language, true);
  },
  all_words_with_features: function (language) {
      return new List(Object.keys(words_to_features[extract_language_code(language)]));
  },
  closest_word: function (target_features, exceptions, word_found_callback, distance_measure, language) {
      // distance_measure is either Euclidean distance or Cosine similarity 
      // some researchers use cosine similarity and others Euclidean distance
      // see https://en.wikipedia.org/wiki/Cosine_similarity
      language = extract_language_code(language);
      if (typeof words_to_features[language] !== 'object') {
          console.error("closest_word called before word embeddings loaded.")
          return;
      }
      if (typeof exceptions !== 'object') {
          exceptions = [];
      } else if (!(exceptions instanceof Array)) {
          exceptions = exceptions.asArray();
      }
      if (!(target_features instanceof Array)) {
          target_features = target_features.asArray();
      }
      if (target_features.length === 0) {
          return "Can't find the closest word to the empty vector.\nProbably due to requesting the features of an unknown word.";
      }
      let use_distance = distance_measure === 'Euclidean distance';
      let words_considered = 0;
      let best_word, distance;
      let best_distance = Number.MAX_VALUE;
      let current_process;
      let pending_callbacks = [];
      let report_progress = function (best_word, best_distance, words_considered, status) {
          if (word_found_callback) {
              if (use_distance) {
                  best_distance = Math.sqrt(best_distance); // distance was squared for efficiency
              }
              // report only 5 decimal digits
              best_distance = Math.round(100000*best_distance)/100000;
              let invoke_callback_or_wait_for_previous_callback = 
                  function (called_by_timeout, best_word, best_distance, words_considered, status) {
                      if (!called_by_timeout) {
                          pending_callbacks.push(
                              function () {
//                                console.log(best_word, best_distance, words_considered);
                                  current_process = invoke_callback(word_found_callback, 
                                                                    best_word, best_distance, words_considered, status);
                               });
                      }
                      if (!current_process || !current_process.context || current_process.readyToTerminate) {
                          if (pending_callbacks.length > 0) {
                              // dequeue a callback and run it
                              pending_callbacks.splice(0, 1)[0]();
                          }
                          return;
                      }
                      // check again in a while if previous process finished
                      setTimeout(function () {
                                     invoke_callback_or_wait_for_previous_callback(true);
                                 },
                                 500);                         
              };
              invoke_callback_or_wait_for_previous_callback(false, best_word, best_distance, words_considered, status);                    
          };
      };
      const target_magnitude = magnitude(target_features);
      Object.keys(words_to_features[language]).forEach(function (word) {
          if (exceptions.indexOf(word) < 0) {
              let candidate_features = words_to_features[language][word];
              words_considered++;
              distance = use_distance ? distance_squared(target_features, candidate_features) :
                                        // subtract 1 since closest cosine similarity is 1
                                        1-cosine_similarity(target_features, candidate_features, target_magnitude); 
              if (distance < best_distance) {
                  best_word = word;
                  best_distance = distance;
                  report_progress(best_word, best_distance, words_considered, 'interim');
              }
          }
      });
      report_progress(best_word, best_distance, words_considered, 'final');
      return best_word;
  },
  initialise_all: function () {
      Object.values(ecraft2learn.support_window).forEach(function (support_window) {
          support_window.close();
      });
      ecraft2learn.outstanding_callbacks = [];
      ecraft2learn.support_window = {};
      ecraft2learn.support_window_is_ready = {};
      ecraft2learn.support_iframe = {};
      ecraft2learn.training_buckets = {};
      stop_all_scripts();      
  },
  reload: function () {
      // for debugging
      let this_url = document.querySelector('script[src*="ecraft2learn.js"]').src;
      ecraft2learn = undefined;
      load_script(this_url);
  },
  send_to_arduino_bot: function (blocks, alternative_server) {
      // loads support for compiling Snap4Arduino blocks to Arduino sketch using ArduinoBot
      // and then loads it on the Arduino 
      // see https://github.com/ecraft2learn/arduinobot
      // alternative_server should be provided if the default raspberrypi.local isn't working
      if (ecraft2learn.send_blocks_to_arduinobot) {
          ecraft2learn.send_blocks_to_arduinobot(blocks, alternative_server);
          return;
      }
      let this_url = document.querySelector('script[src*="ecraft2learn.js"]').src;
      let this_folder = this_url.substring(0, this_url.lastIndexOf('/'));
      load_script(this_folder + "/ArduinoBot/mqttws.js",
                  function () {
                      load_script(this_folder + "/ArduinoBot/arduinobot.js",
                                  function () {
                                      ecraft2learn.arduino_bot.addConnectSuccessListener(function () {
                                          ecraft2learn.send_blocks_to_arduinobot(blocks, alternative_server);
                                      });
                                      ecraft2learn.arduino_bot.connect(alternative_server);
                                   });
                  });
  },     
  outstanding_callbacks: [],
  support_window: {},
  support_window_is_ready: {},
  support_iframe: {},
  training_buckets: {},
  snap_project_opened: false,
}} ());
window.speechSynthesis.getVoices(); // to avoid a possible long wait while voices are loaded
ecraft2learn.chrome_languages =
[
// based upon https://cloud.google.com/speech/docs/languages
// [Language name, Language code, English language name, right-to-left]
["Afrikaans (Suid-Afrika)", "af-ZA", "Afrikaans (South Africa)"],
["አማርኛ (ኢትዮጵያ)", "am-ET", "Amharic (Ethiopia)"],
["Հայ (Հայաստան)", "hy-AM", "Armenian (Armenia)"],
["Azərbaycan (Azərbaycan)", "az-AZ", "Azerbaijani (Azerbaijan)"],
["Bahasa Indonesia (Indonesia)", "id-ID", "Indonesian (Indonesia)"],
["Bahasa Melayu (Malaysia)", "ms-MY", "Malay (Malaysia)"],
["বাংলা (বাংলাদেশ)", "bn-BD", "Bengali (Bangladesh)"],
["বাংলা (ভারত)", "bn-IN", "Bengali (India)"],
["Català (Espanya)", "ca-ES", "Catalan (Spain)"],
["Čeština (Česká republika)", "cs-CZ", "Czech (Czech Republic)"],
["Dansk (Danmark)", "da-DK", "Danish (Denmark)"],
["Deutsch (Deutschland)", "de-DE", "German (Germany)"],
["English (Australia)", "en-AU", "English (Australia)"],
["English (Canada)", "en-CA", "English (Canada)"],
["English (Ghana)", "en-GH", "English (Ghana)"],
["English (Great Britain)", "en-GB", "English (United Kingdom)"],
["English (India)", "en-IN", "English (India)"],
["English (Ireland)", "en-IE", "English (Ireland)"],
["English (Kenya)", "en-KE", "English (Kenya)"],
["English (New Zealand)", "en-NZ", "English (New Zealand)"],
["English (Nigeria)", "en-NG", "English (Nigeria)"],
["English (Philippines)", "en-PH", "English (Philippines)"],
["English (South Africa)", "en-ZA", "English (South Africa)"],
["English (Tanzania)", "en-TZ", "English (Tanzania)"],
["English (United States)", "en-US", "English (United States)"],
["Español (Argentina)", "es-AR", "Spanish (Argentina)"],
["Español (Bolivia)", "es-BO", "Spanish (Bolivia)"],
["Español (Chile)", "es-CL", "Spanish (Chile)"],
["Español (Colombia)", "es-CO", "Spanish (Colombia)"],
["Español (Costa Rica)", "es-CR", "Spanish (Costa Rica)"],
["Español (Ecuador)", "es-EC", "Spanish (Ecuador)"],
["Español (El Salvador)", "es-SV", "Spanish (El Salvador)"],
["Español (España)", "es-ES", "Spanish (Spain)"],
["Español (Estados Unidos)", "es-US", "Spanish (United States)"],
["Español (Guatemala)", "es-GT", "Spanish (Guatemala)"],
["Español (Honduras)", "es-HN", "Spanish (Honduras)"],
["Español (México)", "es-MX", "Spanish (Mexico)"],
["Español (Nicaragua)", "es-NI", "Spanish (Nicaragua)"],
["Español (Panamá)", "es-PA", "Spanish (Panama)"],
["Español (Paraguay)", "es-PY", "Spanish (Paraguay)"],
["Español (Perú)", "es-PE", "Spanish (Peru)"],
["Español (Puerto Rico)", "es-PR", "Spanish (Puerto Rico)"],
["Español (República Dominicana)", "es-DO", "Spanish (Dominican Republic)"],
["Español (Uruguay)", "es-UY", "Spanish (Uruguay)"],
["Español (Venezuela)", "es-VE", "Spanish (Venezuela)"],
["Euskara (Espainia)", "eu-ES", "Basque (Spain)"],
["Filipino (Pilipinas)", "fil-PH", "Filipino (Philippines)"],
["Français (Canada)", "fr-CA", "French (Canada)"],
["Français (France)", "fr-FR", "French (France)"],
["Galego (España)", "gl-ES", "Galician (Spain)"],
["ქართული (საქართველო)", "ka-GE", "Georgian (Georgia)"],
["ગુજરાતી (ભારત)", "gu-IN", "Gujarati (India)"],
["Hrvatski (Hrvatska)", "hr-HR", "Croatian (Croatia)"],
["IsiZulu (Ningizimu Afrika)", "zu-ZA", "Zulu (South Africa)"],
["Íslenska (Ísland)", "is-IS", "Icelandic (Iceland)"],
["Italiano (Italia)", "it-IT", "Italian (Italy)"],
["Jawa (Indonesia)", "jv-ID", "Javanese (Indonesia)"],
["ಕನ್ನಡ (ಭಾರತ)", "kn-IN", "Kannada (India)"],
["ភាសាខ្មែរ (កម្ពុជា)", "km-KH", "Khmer (Cambodia)"],
["ລາວ (ລາວ)", "lo-LA", "Lao (Laos)"],
["Latviešu (latviešu)", "lv-LV", "Latvian (Latvia)"],
["Lietuvių (Lietuva)", "lt-LT", "Lithuanian (Lithuania)"],
["Magyar (Magyarország)", "hu-HU", "Hungarian (Hungary)"],
["മലയാളം (ഇന്ത്യ)", "ml-IN", "Malayalam (India)"],
["मराठी (भारत)", "mr-IN", "Marathi (India)"],
["Nederlands (Nederland)", "nl-NL", "Dutch (Netherlands)"],
["नेपाली (नेपाल)", "ne-NP", "Nepali (Nepal)"],
["Norsk bokmål (Norge)", "nb-NO", "Norwegian Bokmål (Norway)"],
["Polski (Polska)", "pl-PL", "Polish (Poland)"],
["Português (Brasil)", "pt-BR", "Portuguese (Brazil)"],
["Português (Portugal)", "pt-PT", "Portuguese (Portugal)"],
["Română (România)", "ro-RO", "Romanian (Romania)"],
["සිංහල (ශ්රී ලංකාව)", "si-LK", "Sinhala (Sri Lanka)"],
["Slovenčina (Slovensko)", "sk-SK", "Slovak (Slovakia)"],
["Slovenščina (Slovenija)", "sl-SI", "Slovenian (Slovenia)"],
["Urang (Indonesia)", "su-ID", "Sundanese (Indonesia)"],
["Swahili (Tanzania)", "sw-TZ", "Swahili (Tanzania)"],
["Swahili (Kenya)", "sw-KE", "Swahili (Kenya)"],
["Suomi (Suomi)", "fi-FI", "Finnish (Finland)"],
["Svenska (Sverige)", "sv-SE", "Swedish (Sweden)"],
["தமிழ் (இந்தியா)", "ta-IN", "Tamil (India)"],
["தமிழ் (சிங்கப்பூர்)", "ta-SG", "Tamil (Singapore)"],
["தமிழ் (இலங்கை)", "ta-LK", "Tamil (Sri Lanka)"],
["தமிழ் (மலேசியா)", "ta-MY", "Tamil (Malaysia)"],
["తెలుగు (భారతదేశం)", "te-IN", "Telugu (India)"],
["Tiếng Việt (Việt Nam)", "vi-VN", "Vietnamese (Vietnam)"],
["Türkçe (Türkiye)", "tr-TR", "Turkish (Turkey)"],
["(اردو (پاکستان", "ur-PK", "Urdu (Pakistan)", true],
["(اردو (بھارت", "ur-IN", "Urdu (India)", true],
["Ελληνικά (Ελλάδα)", "el-GR", "Greek (Greece)"],
["Български (България)", "bg-BG", "Bulgarian (Bulgaria)"],
["Русский (Россия)", "ru-RU", "Russian (Russia)"],
["Српски (Србија)", "sr-RS", "Serbian (Serbia)"],
["Українська (Україна)", "uk-UA", "Ukrainian (Ukraine)"],
["(עברית (ישראל", "he-IL", "Hebrew (Israel)", true],
["(العربية (إسرائيل", "ar-IL", "Arabic (Israel)", true],
["(العربية (الأردن", "ar-JO", "Arabic (Jordan)", true],
["(العربية (الإمارات", "ar-AE", "Arabic (United Arab Emirates)", true],
["(العربية (البحرين", "ar-BH", "Arabic (Bahrain)", true],
["(العربية (الجزائر", "ar-DZ", "Arabic (Algeria)", true],
["(العربية (السعودية", "ar-SA", "Arabic (Saudi Arabia)", true],
["(العربية (العراق", "ar-IQ", "Arabic (Iraq)", true],
["(العربية (تونس", "ar-KW", "Arabic (Kuwait)", true],
["(العربية (المغرب", "ar-MA", "Arabic (Morocco)", true],
["(العربية (عُمان", "ar-TN", "Arabic (Tunisia)", true],
["(العربية (فلسطين", "ar-OM", "Arabic (Oman)", true],
["(العربية (قطر", "ar-PS", "Arabic (State of Palestine)", true],
["(العربية (لبنان", "ar-QA", "Arabic (Qatar)", true],
["(العربية (مصر", "ar-LB", "Arabic (Lebanon)", true],
["(العربية (مصر", "ar-EG", "Arabic (Egypt)", true],
["(فارسی (ایران", "fa-IR", "Persian (Iran)", true],
["हिन्दी (भारत)", "hi-IN", "Hindi (India)"],
["ไทย (ประเทศไทย)", "th-TH", "Thai (Thailand)"],
["한국어 (대한민국)", "ko-KR", "Korean (South Korea)"],
["國語 (台灣)", "cmn-Hant-TW", "Chinese, Mandarin (Traditional, Taiwan)"],
["廣東話 (香港)", "yue-Hant-HK", "Chinese, Cantonese (Traditional, Hong Kong)"],
["日本語（日本）", "ja-JP", "Japanese (Japan)"],
["普通話 (香港)", "cmn-Hans-HK", "Chinese, Mandarin (Simplified, Hong Kong)"],
["普通话 (中国大陆)", "cmn-Hans-CN", "Chinese, Mandarin (Simplified, China)"],
];
ecraft2learn.language_defaults =
 // many arbitrary choices but some default is needed
 {english:    "en-GB",
  en:         "en-GB",
  español:    "es-ES",
  spanish:    "es-ES",
  français:   "fr-FR",
  french:     "fr-FR",
  português:  "pt-PT",
  portuguese: "pt-PT",
  swahili:    "sw-KE", 
  தமிழ்:      "ta-IN",
  tamil:      "ta-IN",
  "اردو":     "ur-PK",
  urdu:       "ur-PK",
  "العربية":  "ar-SA",
  arabic:      "ar-SA",
  chinese:     "zh-CN"
};

