window.ecraft2learn =
    (function () {
	"use strict";
	return {
	    get_global_variable_value: function (name) {
		var ancestor = this;
		var value;
		while (ancestor && !(ancestor instanceof IDE_Morph)) {
		    ancestor = ancestor.parent;
		}
		if (ancestor) {
		    value = ancestor.globalVariables.getVar(name);
		} else {
		    value = world.children[0].globalVariables.getVar(name);
		}
		if (typeof value ===  'string') {
		    return value;
		}
		return value.contents;
	    }.bind(this),
	    start_microsoft_speech_recognition: function () {
		var handle_response = function (callback, response) {
		    var spoken = response[0].transcript;
		    var confidence = response[0].confidence;
		    console.log("Confidence is " + confidence + " for " + spoken); // remove this eventually
		    invoke(callback, new List([spoken]));
		};
		var client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
		    Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase,
		    "en-us",
		    get_global_variable_value('Microsoft speech key'));

		client.onFinalResponseReceived = function (response) {
		    handle_response(spoken_callback, response);
		};

		client.onPartialResponseReceived = function (response) {
		    handle_response(spoken_callback, response);
		};

		client.startMicAndRecognition();

		setTimeout(function () {
                    client.endMicAndRecognition();
		},
			   5000);
	    }
	};
    } ());
	

