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
		var key = run_snap_block(key_name);
		if (key && key !== "Enter your key here") {
			return key;
		}
		if (window.confirm("No value reported by the '" + key_name +
						   " reporter. After obtaining the key edit the reporter in the 'Variables' area. Do you want to visit https://github.com/ToonTalk/ai-cloud/wiki to learn how to get a key?")) {
			window.onbeforeunload = null; // don't warn about reload
			document.location.assign("https://github.com/ToonTalk/ai-cloud/wiki");
		}
	};
  	var run_snap_block = function (labelSpec) { // add parameters later
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
  	}.bind(this);
  	var get_snap_ide = function (start) {
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
	  	if (typeof callback === 'object') { // assume Snap! callback
	  		return invoke(callback, new List(Array.prototype.slice.call(arguments, 1)));
	  	}
	  	if (typeof callback === 'function') { // assume JavaScript callback
	  		callback.apply(this, arguments);
	  	}
	  	// otherwise no callback provided so ignore it
	};

	return {
	  inside_snap: typeof world === 'object' && world instanceof WorldMorph,
	  run: function (function_name, parameters) {
		if (typeof ecraft2learn[function_name] === 'undefined') {
			alert("Ecraft2learn library does not have a function named " + function_name);
			return;
		}
		return ecraft2learn[function_name].apply(null, parameters.contents);
	  },

	  read_url: function (url, callback, error_callback, access_token) {
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
	  	if (typeof SpeechRecognition === 'undefined' && typeof webkitSpeechRecognition === 'undefined') {
	  		// no support from this browser so try using the Microsoft Speech API
	  		ecraft2learn.start_microsoft_speech_recognition_batch(spoken_callback, error_callback);
	  		return;
	  	}
	  	var stopped = false;
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
// 				console.log("Speech recognition started");
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
// 			console.log("Recognition error: " + event.error);
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
// 			console.log("recognition ended");
			restart();
		};
		ecraft2learn.stop_speech_recognition = function () {
 			ecraft2learn.speech_recognition.onend    = null;
			ecraft2learn.speech_recognition.onresult = null;
			ecraft2learn.speech_recognition.stop();
		};
		restart();

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

	  start_microsoft_speech_recognition_batch: function (spoken_callback, error_callback, maximum_wait, key) {
	  	// spoken_callback is called with all that is spoken in the maximum_wait seconds (unless there is an error)
		var handle_response = function (callback, response) {
		    var spoken = response[0].transcript;
		    var confidence = response[0].confidence;
		    console.log("Confidence is " + confidence + " for " + spoken); // remove this eventually
		    invoke_callback(callback, spoken);
		};
		var start_listening = function () {
			var key;
			if (typeof ecraft2learn.microsoft_speech_client === 'undefined') {
				if (!key) {
					key = get_key('Microsoft speech key');
				}
				ecraft2learn.microsoft_speech_client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
					Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase,
					get_global_variable_value('language', "en-us"),
					key);
			}
			ecraft2learn.stop_microsoft_speech_recognition_batch = function () {
				ecraft2learn.microsoft_speech_client.endMicAndRecognition();
			};
			if (typeof spoken_callback === 'object') {
				ecraft2learn.microsoft_speech_client.onFinalResponseReceived =
										function (response) {
											handle_response(spoken_callback, response);
											ecraft2learn.microsoft_speech_client.endMicAndRecognition(); // needed??
										};
				ecraft2learn.microsoft_speech_client.onPartialResponseReceived =
										function (response) {
											handle_response(spoken_callback, response);
										};
			}
			if (typeof error_callback === 'object') {
				ecraft2learn.microsoft_speech_client.onError =
					function (error, message) {
						invoke_callback(error_callback);
					};
			}
			ecraft2learn.microsoft_speech_client.startMicAndRecognition();
			maximum_wait = +maximum_wait; // convert to number
			setTimeout(function () {
						   ecraft2learn.microsoft_speech_client.endMicAndRecognition();
						   },
						   // maximum_wait given in seconds -- if not 5 second default
						   typeof maximum_wait === 'number' ? maximum_wait*1000 : 5000);			
		};
		if (typeof Microsoft === 'undefined' || typeof Microsoft.CognitiveServices.SpeechRecognition === 'undefined') {
			load_script("lib/speech.1.0.0.js", start_listening);
		} else {
	    	start_listening();
		}
	},

	start_microsoft_speech_recognition: function (as_recognized_callback, final_spoken_callback, error_callback, provided_key) {
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
  	var video  = document.createElement('video');
    var canvas = document.createElement('canvas');
	var post_image = function post_image(image, cloud_provider, callback, error_callback) {
		// based upon https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript
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
			XHR.open('POST', "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description,Tags,Faces,Color,Categories&subscription-key=" + key);
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
	width = +width; // convert to number
	height = +height;

  ecraft2learn.take_picture_and_analyse = function (cloud_provider, show_photo, snap_callback) {
  	var callback = function (response) {
		var javascript_to_snap = function (x) {
			if (!ecraft2learn.inside_snap) {
				return x;
			}
			if (Array.isArray(x)) {
				return new List(x.map(javascript_to_snap));
			}
			if (typeof x === 'object') {
				return new List(Object.keys(x).map(function (key) {
                                                       return new List([key, javascript_to_snap(x[key])]);
						                           }));
			}
			return x;
		};
		if (typeof snap_callback !== 'object' && typeof snap_callback !== 'function') { // if not provided
			return;
		}
		switch (cloud_provider) {
			case "Watson":
				invoke_callback(snap_callback, javascript_to_snap(JSON.parse(response).images[0].classifiers[0].classes));
			    return;
			case "Google":
			    invoke_callback(snap_callback, javascript_to_snap(JSON.parse(response).responses));
				return;
			case "Microsoft":
			    invoke_callback(snap_callback, javascript_to_snap(JSON.parse(response)));
				return;
		}
	};
    var context, photo;
    // Capture a photo by fetching the current contents of the video
	// and drawing it into a canvas, then converting that to a PNG
	// format data URL. By drawing it on an offscreen canvas and then
	// drawing that to the screen, we can change its size and/or apply
	// other changes before drawing it.
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
    }
  };

    if (document.body) {
		startup();
	} else {
		window.addEventListener('load', startup, false);
	}
  },

  speak: function (message, pitch, rate, voice, volume, language, finished_callback) {
  	// see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
  	if (window.speechSynthesis.getVoices().length === 0) {
  		// voices not loaded so wait for them and try again
  		window.speechSynthesis.onvoiceschanged = function () {
  			ecraft2learn.speak(message, pitch, rate, voice, volume, language, finished_callback);
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
            speak(segment, pitch, rate, voice, volume, language, callback)
        });
        return;
    }
    // else is less than the maximum_length
	var utterance = new SpeechSynthesisUtterance(message);
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
	voice = +voice;
	if (typeof voice === 'number') {
	   var voices = window.speechSynthesis.getVoices();
	   if (voice >= 0 && voice < voices.length) {
		   utterance.voice = voices[Math.floor(voice)];
	   } else if (voice > 0) {
		   alert("Only " + voices.length + " voices are available. You can't choose voice number " + voice);
	   }
	}
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
  get_voice_name: function (voice) {
  	voice = +voice; // convert to nunber if is a string
	if (typeof voice === 'number') {
	   var voices = window.speechSynthesis.getVoices();
	   if (voice >= 0 && voice < voices.length) {
		   return voices[Math.floor(voice)].name;
	   } else if (voice > 0) {
		   alert("Only " + voices.length + " voices are available. There is no voice number " + voice);
	   }
	}
  },
  open_project: function (name) {
  	get_snap_ide().openProject(name);
  },
  save_project: function (name) {
	get_snap_ide().saveProject(name);
  }
  }} ());
