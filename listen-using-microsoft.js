var load_script = function (url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    if (typeof callback === 'object') {
        script.addEventListener('load', function () {
            callback();
        });
    };
    document.head.appendChild(script);
};

var get_global_variable_value = function (name) {
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
}.bind(this);

var handle_response = function (callback, response) {
    var spoken = response[0].transcript;
    var confidence = response[0].confidence;
    console.log("Confidence is " + confidence + " for " + spoken);
    invoke(callback, new List([spoken]));
};

var start_recognition = function () {
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
};

if (typeof Microsoft === 'undefined' || typeof Microsoft.CognitiveServices.SpeechRecognition === 'undefined') {
    load_script("https://toontalk.github.io/ai-cloud/lib/speech.1.0.0.js", start_recognition);
} else {
    start_recognition();
}

