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
	return {
	  run: function (function_name, parameters, snap_context) {
		if (typeof ecraft2learn[function_name] === 'undefined') {
			alert("Ecraft2learn library does not have a function named " + function_name);
			return;
		}
		return ecraft2learn[function_name].apply(snap_context, parameters.contents);
	  },

	  get_global_variable_value: function (name, default_value) {
		var ancestor = this;
		var value;
		while (ancestor && !(ancestor instanceof IDE_Morph)) {
		    ancestor = ancestor.parent;
		}
		try {
			if (ancestor) {
				value = ancestor.globalVariables.getVar(name);
			} else {
				value = world.children[0].globalVariables.getVar(name);
			}
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
	  }.bind(this),

	  start_microsoft_speech_recognition_batch: function (spoken_callback, error_callback, maximum_wait) {
	  	// spoken_callback is called with all that is spoken in the maximum_wait seconds (unless there is an error)
		var handle_response = function (callback, response) {
		    var spoken = response[0].transcript;
		    var confidence = response[0].confidence;
		    console.log("Confidence is " + confidence + " for " + spoken); // remove this eventually
		    invoke(callback, new List([spoken]));
		};
		var start_listening = function () {
			if (typeof this.microsoft_speech_client === 'undefined') {
				this.microsoft_speech_client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
					Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase,
					this.get_global_variable_value('language', "en-us"),
					this.get_global_variable_value('Microsoft speech key')
				);
			}
			this.stop_microsoft_speech_recognition_batch = function () {
				this.microsoft_speech_client.endMicAndRecognition();
			}.bind(this);
			if (typeof spoken_callback === 'object') {
				this.microsoft_speech_client.onFinalResponseReceived =
										function (response) {
											handle_response(spoken_callback, response);
											this.microsoft_speech_client.endMicAndRecognition(); // needed??
										}.bind(this);
				this.microsoft_speech_client.onPartialResponseReceived =
										function (response) {
											handle_response(spoken_callback, response);
										};
			}
			if (typeof error_callback === 'object') {
				this.microsoft_speech_client.onError =
					function (error, message) {
						invoke(error_callback, new List([]));
					};
			}
			this.microsoft_speech_client.startMicAndRecognition();
			maximum_wait = +maximum_wait; // convert to number
			setTimeout(function () {
						   this.microsoft_speech_client.endMicAndRecognition();
						   }.bind(this),
						   // maximum_wait given in seconds -- if not 5 second default
						   typeof maximum_wait === 'number' ? maximum_wait*1000 : 5000);			
		}.bind(this);
		if (typeof Microsoft === 'undefined' || typeof Microsoft.CognitiveServices.SpeechRecognition === 'undefined') {
			load_script("lib/speech.1.0.0.js", start_listening);
		} else {
	    	start_listening();
		}
	}.bind(this),

	start_microsoft_speech_recognition: function (as_recognized_callback, final_spoken_callback, error_callback) {
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
			var recognizer = setup(SDK,
			                       SDK.RecognitionMode.Interactive,
			                       this.get_global_variable_value('language', "en-us"),
			                       "Simple", // as opposed to "Detailed"
			                       this.get_global_variable_value('Microsoft speech key'));
			this.stop_microsoft_speech_recognition = function () {
				recognizer.AudioSource.TurnOff();
			};
			this.last_speech_recognized = undefined;
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
                        this.last_speech_recognized = event.Result.Text;
                        invoke(as_recognized_callback, new List([this.last_speech_recognized]));
                        break;
                    case "SpeechEndDetectedEvent":
                        if (this.last_speech_recognized) {
                        	invoke(final_spoken_callback, new List([this.last_speech_recognized]));
                        } else {
                        	invoke(error_callback, new List([]));
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
                invoke(error_callback, new List([]));
            });
		}.bind(this);
		if (this.microsoft_speech_sdk) {
			start_listening(this.microsoft_speech_sdk);
		} else {
			load_script("//cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min.js", 
					   function () {
						   load_script("lib/speech.browser.sdk-min.js",
						               function () {
						                	require(["Speech.Browser.Sdk"], function(SDK) {
												this.microsoft_speech_sdk = SDK;
												start_listening(SDK);
											}.bind(this));
					                   }.bind(this));
					   }.bind(this));
		}
	}.bind(this),

  setup_camera: function (width, height) {
  	var video  = document.createElement('video');
    var canvas = document.createElement('canvas');
    var get_key = function (provider) {
		var key = this.get_global_variable_value(provider + " key");
		if (key) {
			return key;
		}
		if (window.confirm("No value provided for the variable '" + provider + 
						   " key'. Do you want to visit https://github.com/ToonTalk/ai-cloud/wiki to learn how to get a key?")) {
			window.onbeforeunload = null; // don't warn about reload
			document.location.assign("https://github.com/ToonTalk/ai-cloud/wiki");
		}
	}.bind(this);
	var post_image = function post_image(image, cloud_provider, callback, error_callback) {
		// based upon https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript
		var key = get_key(cloud_provider);
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
	
  this.take_picture_and_analyse = function (cloud_provider, show_photo, snap_callback) {
  	var callback = function (response) {
		var javascript_to_snap = function (x) {
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
		if (typeof snap_callback !== 'object') { // if not provided 
			return;
		}
		switch (cloud_provider) {
			case "Watson":
				invoke(snap_callback, new List([javascript_to_snap(JSON.parse(response).images[0].classifiers[0].classes)]));
			    return;
			case "Google":
			     invoke(snap_callback, new List([javascript_to_snap(JSON.parse(response).responses)]));
				return;
			case "Microsoft":
			     invoke(snap_callback, new List([javascript_to_snap(JSON.parse(response))]));
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
  }.bind(this);

    if (document.body) {
		startup();
	} else {
		window.addEventListener('load', startup, false);
	}
  }.bind(this),

  speak: function (message, pitch, rate, voice, volume, language, finished_callback) {
  	// see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
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
	if (typeof finished_callback === 'object') {
	   // callback provided
	   utterance.onend = function (event) {
		   invoke(finished_callback, new List([message]));
	   };
	}
	if (window.speech_recognition) {
		// don't recognise synthetic speech
	    window.speech_recognition.abort();
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
  }
  }} ());
