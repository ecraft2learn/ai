const initialise = async function (training_class_names) {
    const builtin_recognizer = SpeechCommands.create('BROWSER_FFT');
    await builtin_recognizer.ensureModelLoaded();
    let user_recognizer;
    if (training_class_names !== []) {
        const base_recognizer = SpeechCommands.create('BROWSER_FFT');
        await base_recognizer.ensureModelLoaded();
        user_recognizer = base_recognizer.createTransfer('user trained');
    }
    let currently_listening_recognizer;
    const receive_messages = function (event) {
        if (typeof event.data.predict === 'boolean') {
            // classification requested
            let user_training = event.data.predict;
            if (user_training && !user_recognizer) {
                window.parent.postMessage({error: "Cannot predict with user trained model before it is trained."});
                return;
            }
            let recognizer = user_training ? User_recognizer : builtin_recognizer;
            recognise(recognizer,
                      minimum_probability,
                      recognitions => {
                          window.parent.postMessage({confidences: recognitions}, "*");
                      });
        } else if (typeof event.data === 'stop') { // from clicking on stop sign
            pending_recognitions = [];
            stop_recognising();
        } else if (event.data === 'stop_recognising') {
            stop_recognising(); // just the current recognition - let the next one start 
        };
    };
    // these listeners need to be in the scope of initialise
    window.addEventListener("message", receive_messages, false);
    let minimum_probability = .01; // to be displayed - not the same as probabilityThreshold which refers to the best result
    let pending_recognitions = [];
    const recognise = async function (recognizer, minimum_probability, callback) {
        if (recognizer.vocabulary !== '18w') {
            await add_samples_to_model();
        }
        if (currently_listening_recognizer) {
            // already listening
            pending_recognitions.push(function () {
                recognise(recognizer, minimum_probability, callback);
            })
            return;
        }
        currently_listening_recognizer = recognizer;
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
    const stop_recognising = function () {
        if (currently_listening_recognizer) {
            currently_listening_recognizer.stopStreaming();
            currently_listening_recognizer = undefined;
        }
        if (pending_recognitions && pending_recognitions.length > 0) {
            (pending_recognitions.pop()());
        }
    };
    let train_on = async function (class_index, info_text) {
        await user_recognizer.collectExample(training_class_names[class_index]);
        if (typeof info_text.count !== 'number') {
            info_text.count = 1;
            info_text.innerHTML = " " + info_text.count + " example trained";
        } else {
            info_text.count++;
            info_text.innerHTML = " " + info_text.count + " examples trained";
        }       
    };
    let train_off = function (class_index, info_text) {
        // obsolete
    };
    const create_test_button = function (training_class_names) {
        const button = document.createElement('button');
        button.innerText = "Start testing";
        button.className = "testing-button";
        const results_div = document.createElement('div');
        document.body.appendChild(button);
        document.body.appendChild(results_div);
        let button_down = async function () {
            await add_samples_to_model();
            recognise(user_recognizer,
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
            stop_recognising();
        };
        button.addEventListener('mousedown',  button_down);
        button.addEventListener('touchstart', button_down);
        button.addEventListener('mouseup',    button_up);
        button.addEventListener('touchend',   button_up);
    };
    const add_samples_to_model = async function () {
        try {
            console.log(user_recognizer.countExamples());
            await user_recognizer.train({
                  epochs: 25,
                  callback: {
                    onEpochEnd: async (epoch, logs) => {
                      console.log(`Epoch ${epochs}: loss=${logs.loss}, accuracy=${logs.acc}`);
                    }
                  }
                });
        } catch (error) {
            window.parent.postMessage({error: error.message}, "*");
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
    create_test_button(training_class_names);
    create_return_to_snap_button();
    // see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
//     if (speech_recognizer.audioCtx) {
//         document.querySelectorAll('button').forEach(function (button) {
//             button.addEventListener('click', function() {
//                 speech_recognizer.audioCtx.resume();
//             });
//         });
//     }

};

window.addEventListener(
    "message", 
    function (event) {
        if (typeof event.data.training_class_names !== 'undefined') {
            // received the names of the classes so ready to initialise
            initialise(event.data.training_class_names);
            let please_wait_element = document.getElementById('please-wait');
            if (please_wait_element) {
                please_wait_element.remove();
            }
            window.parent.postMessage("Ready", "*");
         } else if (typeof event.data.new_introduction !== 'undefined') {
            // introductory text overridden
            let introduction = document.getElementById("introduction");
            introduction.innerHTML = event.data.new_introduction;
            introduction.setAttribute("updated", true);
         }
    },
    false);