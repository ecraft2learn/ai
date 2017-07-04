window.ecraft2learn =
  (function () {
  	"use strict";
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
			if (!this.microsoft_speech_client) {
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
			setTimeout(function () {
						   this.microsoft_speech_client.endMicAndRecognition();
						   }.bind(this),
						   // maximum_wait given in seconds -- if not 5 second default 
						   maximum_wait ? maximum_wait*1000 : 5000);			
		}.bind(this);
		if (typeof Microsoft === 'undefined' || typeof Microsoft.CognitiveServices.SpeechRecognition === 'undefined') {
			load_script("lib/speech.1.0.0.js", start_listening);
		} else {
	    	start_listening();
		}
	},
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
	}
  }} ());

