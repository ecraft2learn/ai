window.ecraft2learn =
  (function () {
  	"use strict";
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
	  start_microsoft_speech_recognition: function (spoken_callback, error_callback, maximum_wait) {
		var handle_response = function (callback, response) {
		    var spoken = response[0].transcript;
		    var confidence = response[0].confidence;
		    console.log("Confidence is " + confidence + " for " + spoken); // remove this eventually
		    invoke(callback, new List([spoken]));
		};
		if (!this.microsoft_speech_client) {
			this.microsoft_speech_client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
				Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase,
				this.get_global_variable_value('language', "en-us"),
				this.get_global_variable_value('Microsoft speech key')
			);
		}
		this.stop_microsoft_speech_recognition = function () {
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
					   maximum_wait ? maximum_wait/1000 : 5000);
	}
  }} ());

