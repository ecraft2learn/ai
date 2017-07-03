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
	  start_microsoft_speech_recognition: function (spoken_callback, maximum_wait) {
		var handle_response = function (callback, response) {
		    var spoken = response[0].transcript;
		    var confidence = response[0].confidence;
		    console.log("Confidence is " + confidence + " for " + spoken); // remove this eventually
		    invoke(callback, new List([spoken]));
		};
		var client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
		    Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase,
		    this.get_global_variable_value('language', "en-us"),
		    this.get_global_variable_value('Microsoft speech key')
		);
		this.stop_microsoft_speech_recognition = function () {
			client.endMicAndRecognition();
		};
		if (typeof spoken_callback === 'object') {
			client.addEventListener('FinalResponseReceived',
			                        function (response) {
										handle_response(spoken_callback, response);
										client.endMicAndRecognition();
									});
			client.addEventListener('PartialResponseReceived',
			                        function (response) {
										handle_response(spoken_callback, response);
									});
			client.addEventListener('error',
			                        function (error, message) {
										console.log(error, message);
// 										console.log(JSON.parse(message));
									});
		}
		client.startMicAndRecognition();
		setTimeout(function () {
			client.endMicAndRecognition();
		    },
		    // maximum_wait given in seconds -- if not 5 second default 
		    maximum_wait ? maximum_wait/1000 : 5000);
	}
  }} ());

