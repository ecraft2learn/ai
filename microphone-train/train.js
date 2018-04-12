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
    create_training_buttons(training_class_names, train_on, train_off);
    create_test_button(training_class_names, speech_recognizer);
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
                        result[i].match + " " + (result[i].confidence*100).toFixed(0) + "% confidence<br>";
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

create_return_to_snap_button = function () {
    var return_to_snap_button = document.createElement('button');
    return_to_snap_button.innerHTML = "Return to Snap!";
    return_to_snap_button.className = "return-to-snap-button";
    return_to_snap_button.addEventListener('click',
                                           function(event) {
                                               window.frameElement.style.width  = "1px";
                                               window.frameElement.style.height = "1px";
                                           });
    document.body.appendChild(return_to_snap_button);
}

// tell Snap! this is loaded
window.addEventListener('DOMContentLoaded', 
                        function (event) {
                            if (window.opener) {
                                window.opener.postMessage("Loaded", "*");
                            } else if (window.parent) {
                                window.parent.postMessage("Loaded", "*");
                            }
                        },
                        false);
// receive class names
window.addEventListener("message",
                        function (event) {
                            if (typeof event.data.training_class_names !== 'undefined') {
                                // received the names of the classes so ready to initialise
                                initialise(event.data.training_class_names);
                                event.source.postMessage("Ready", "*");
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
                                               // top result only for now
                                               var results = speech_recognizer.getTopRecognitionHypotheses(1);
                                               event.source.postMessage({confidences: results[0]}, "*");
                                           },
                                           duration);
                            }
                        },
                        false);
} (new JsSpeechRecognizer()))