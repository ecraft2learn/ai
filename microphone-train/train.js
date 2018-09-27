const initialise = async function (training_class_names) {
    const base_recognizer = SpeechCommands.create('BROWSER_FFT');
    await base_recognizer.ensureModelLoaded();
    let user_recognizer = training_class_names && base_recognizer.createTransfer('user trained');
    const receive_messages = function (event) {
        if (typeof event.data.predict === 'boolean') {
            // classification requested
            let user_training = event.data.predict;
            if (user_training && !user_recognizer) {
                window.parent.postMessage({error: "Cannot predict with user trained model before it is trained."});
                return;
            }
            let recognizer = user_training ? User_recognizer : base_recognizer;
//             setTimeout(() => recognizer.stopStreaming(), event.data.predict);
            recognise(recognizer,
                      minimum_probability,
                      recognitions => {
                          window.parent.postMessage({confidences: recognitions}, "*");
                      });
        };
    };
    // these listeners need to be in the scope of initialise
    window.addEventListener("message", receive_messages, false);
    let minimum_probability = .01; // to be displayed - not the same as probabilityThreshold which refers to the best result
    const recognise = function (recognizer, minimum_probability, callback) {
        recognizer.startStreaming(
            recognition => {
                let scores = recognition.scores.slice().sort().reverse(); // slice() to not clobber it using 'sort'
                let labels = recognizer.wordLabels();
                let results = [];
                scores.forEach(function (score, index) {
                    if (score >= minimum_probability) {
                        results.push([labels[recognition.scores.indexOf(score)], (score*100).toFixed(0)]);
                    }
                });
                callback(results);
            },
            {probabilityThreshold: 0.5,
             invokeCallbackOnNoiseAndUnknown: true});
    };
    let train_on = async function (class_index, info_text) {
        await transferRecognizer.collectExample(training_class_names[class_index]);
        info_text.innerHTML = " Release the button when finished speaking";       
    };
    let train_off = function (class_index, info_text) {
        if (typeof info_text.count !== 'number') {
            info_text.count = 1;
            info_text.innerHTML = " " + info_text.count + " example trained";
        } else {
            info_text.count++;
            info_text.innerHTML = " " + info_text.count + " examples trained";
        }
    };
    const create_test_button = function (training_class_names) {
        const button = document.createElement('button');
        button.innerText = "Start testing";
        button.className = "testing-button";
        const results_div = document.createElement('div');
        document.body.appendChild(button);
        document.body.appendChild(results_div);
        let button_down = function () {
            recognise(recognizer,
                      minimum_probability,
                      function (recognitions) {
                          results_div.innerHTML = "";
                          recognitions.forEach(function (label_and_score) {
                              results_div.innerHTML +=
                                  label_and_score[0] + " " + label_and_score[1] + "% confidence score<br>";
                          });
                      });
            results_div.innerText = "Release when finished speaking.";
        };
        let button_up = function () {
            recognizer.stopStreaming();
        };
        button.addEventListener('mousedown',  button_down);
        button.addEventListener('touchstart', button_down);
        button.addEventListener('mouseup',    button_up);
        button.addEventListener('touchend',   button_up);
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
    create_test_button(training_class_names);
    // see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
//     if (speech_recognizer.audioCtx) {
//         document.querySelectorAll('button').forEach(function (button) {
//             button.addEventListener('click', function() {
//                 speech_recognizer.audioCtx.resume();
//             });
//         });
//     }
    create_return_to_snap_button();
};

window.addEventListener(
    "message", 
    function (event) {
        if (typeof event.data.training_class_names !== 'undefined') {
            // received the names of the classes so ready to initialise
            initialise(event.data.training_class_names, event.data.training_name);
            window.parent.postMessage("Ready", "*");
         } else if (typeof event.data.new_introduction !== 'undefined') {
            // introductory text overridden
            let introduction = document.getElementById("introduction");
            introduction.innerHTML = event.data.new_introduction;
            introduction.setAttribute("updated", true);
         }
    },
    false);