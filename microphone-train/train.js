(function (speech_recognizer) {
 var initialise = function (training_class_names) {
    speech_recognizer.openMic();
    var train_on = function (class_index, info_text) {
        speech_recognizer.startTrainingRecording(training_class_names[class_index]);
        info_text.innerHTML = " Release the button when finished speaking";       
    };
    var train_off =
        function (class_index, info_text) {
            var recording = speech_recognizer.stopRecording();
            // regenerate the model
            speech_recognizer.generateModel();
            if (typeof info_text.count !== 'number') {
                info_text.count = 1;
                info_text.innerHTML = " " + info_text.count + " example trained";
            } else {
                info_text.count++;
                info_text.innerHTML = " " + info_text.count + " examples trained";
            }
    };
    // remove any previously added buttons
    let buttons = document.body.getElementsByTagName('button');
    Array.from(buttons).forEach(function (button) {
        button.remove();
    });
    let training_buttons_with_info = document.body.getElementsByClassName('training-button-and-info');
    Array.from(training_buttons_with_info).forEach(function (training_button_with_info) {
        training_button_with_info.remove();
    });
    create_training_buttons(training_class_names, train_on, train_off);
    create_test_button(training_class_names, speech_recognizer);
    // see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
    if (speech_recognizer.audioCtx) {
        document.querySelectorAll('button').forEach(function (button) {
            button.addEventListener('click', function() {
                speech_recognizer.audioCtx.resume();
            });
        });
    }
    create_return_to_snap_button();
};

var create_test_button = function (training_class_names, speech_recognizer) {
    const button = document.createElement('button');
    button.innerText = "Start testing";
    button.className = "testing-button";
    const results_div = document.createElement('div');
    document.body.appendChild(button);
    document.body.appendChild(results_div);
    var button_down = function () {
        speech_recognizer.startRecognitionRecording();
        results_div.innerText = "Release when finished speaking.";
    };
    var button_up = function () {
        speech_recognizer.stopRecording();
        var result = speech_recognizer.getTopRecognitionHypotheses(1); // top result only
        // Format and display results
        results_div.innerHTML = "";
        if (result.length > 0 && result[0].confidence > 0) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].confidence > 0) {
                    results_div.innerHTML +=
                        result[i].match + " " + (result[i].confidence*100).toFixed(0) + " confidence score<br>";
                }            
            }
        } else {
            results_div.innerHTML = "No matches.";
        }
    };
    button.addEventListener('mousedown',  button_down);
    button.addEventListener('touchstart', button_down);
    button.addEventListener('mouseup',    button_up);
    button.addEventListener('touchend',   button_up);
};

// receive class names
window.addEventListener("message",
                        function (event) {
                            if (typeof event.data.training_class_names !== 'undefined') {
                                // received the names of the classes so ready to initialise
                                initialise(event.data.training_class_names);
                                window.parent.postMessage("Ready", "*");
                            } else if (typeof event.data.new_introduction !== 'undefined') {
                                // introductory text overridden
                                var introduction = document.getElementById("introduction");
                                introduction.innerHTML = event.data.new_introduction;
                                introduction.setAttribute("updated", true);
                            } else if (typeof event.data.predict === 'number') {
                                // classification requested
                                let duration = event.data.predict;
                                speech_recognizer.startRecognitionRecording();
                                setTimeout(function () {
                                               speech_recognizer.stopRecording();
                                               // top result only 
                                               let results = speech_recognizer.getTopRecognitionHypotheses(1);
                                               let confidence = Math.max(0, (results[0].confidence*100).toFixed(0));
                                               window.parent.postMessage({confidences:
                                                                         results.length > 0 ?
                                                                         [results[0].match, confidence]:
                                                                         []},
                                                                        "*");
                                           },
                                           duration);
                            }
                        },
                        false);
} (new JsSpeechRecognizer()))