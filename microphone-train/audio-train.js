// A file that defines the behaviour of the audio training support window for the eCraft2Learn Snap! AI library
// Written by Ken Kahn 
// No rights reserved.

((function () {
let new_introduction;

const initialise = async function (training_class_names) {
    let report_error = function (error_message) {
        if (window.parent.ecraft2learn.support_iframe_visible['training using microphone']) {
            alert(error_message);
        } else {
            window.parent.postMessage({error: error_message}, "*");
        }
    }
    window.parent.postMessage({show_message: "Loading..."}, "*");
    const builtin_recognizer = SpeechCommands.create('BROWSER_FFT');
    await builtin_recognizer.ensureModelLoaded();
    builtin_recognizer.params().sampleRateHz = 48000;
    let user_recognizer;
    if (training_class_names.length !== 0) {
        training_class_names.push('_background_noise_');
        const base_recognizer = SpeechCommands.create('BROWSER_FFT');
        await base_recognizer.ensureModelLoaded();
        base_recognizer.params().sampleRateHz = 48000;
        user_recognizer = base_recognizer.createTransfer('user trained');
    }
    let currently_listening_recognizer;
    const receive_messages = function (event) {
        if (typeof event.data.predict === 'boolean') {
            // classification requested
            let user_training = event.data.predict;
            if (user_training && !user_recognizer) {
                report_error("Cannot predict with user trained model before it is trained.");
                return;
            }
            let recognizer = user_training ? user_recognizer : builtin_recognizer;
            recognise(recognizer,
                      minimum_probability,
                      recognitions => {
                          window.parent.postMessage({confidences: recognitions}, "*");
                      });
        } else if (event.data === 'stop') { // from clicking on stop sign
            pending_recognitions = [];
            stop_recognising(true);
        } else if (event.data === 'stop_recognising') {
            stop_recognising(true); // just the current recognition - let the next one start 
        };
    };
    // these listeners need to be in the scope of initialise
    window.addEventListener("message", receive_messages, false);
    let minimum_probability = .01; // to be displayed - not the same as probabilityThreshold which refers to the best result
    let pending_recognitions = [];
    const recognise = async function (recognizer, minimum_probability, callback) {
        if (recognizer !== builtin_recognizer) {
            await add_samples_to_model();
        }
        if (currently_listening_recognizer) {
            // already listening
            pending_recognitions.push(async function () {
                await recognise(recognizer, minimum_probability, callback);
            })
            return;
        }
        currently_listening_recognizer = recognizer;
        recognizer
            .startStreaming(
                recognition => {
                    let scores = recognition.scores.slice().sort().reverse(); // slice() to not clobber it using 'sort'
                    let labels = recognizer.wordLabels();
                    let results = [];
                    scores.forEach(function (score, index) {
                        let original_index = recognition.scores.indexOf(score);
                        if (original_index > 1 && score >= minimum_probability) {
                            results.push([labels[original_index], (score*100).toFixed(0)]);
                        }
                    });
//                     console.log(recognition.scores.indexOf(Math.max(...recognition.scores)));
                    if (results.length > 0) {
                        callback(results);
                    }
                },
                {probabilityThreshold: 0.75,
                 invokeCallbackOnNoiseAndUnknown: false})
            .catch (error => {
                 report_error(error.message);
            });
    };
    const stop_recognising = function (clear_pending_recognitions) {
        if (currently_listening_recognizer) {
            currently_listening_recognizer.stopStreaming()
                .then(() => {
                    currently_listening_recognizer = undefined;
                    if (pending_recognitions && pending_recognitions.length > 0) {
                        (pending_recognitions.pop()());
                    }
                })
                .catch(error => {
                          console.log(error);
                          currently_listening_recognizer = undefined;
                       });  
        }
        if (clear_pending_recognitions) {
            pending_recognitions = [];
        }
    };
    let examples_collected = 0;
    let train_on = async function (class_index, info_text) {
        await stop_recognising(true);
        await user_recognizer.collectExample(training_class_names[class_index])
            .then(() => {
                examples_collected++;
                if (typeof info_text.count !== 'number') {
                    info_text.count = 1;
                    info_text.innerHTML = " " + info_text.count + " example trained";
                } else {
                     info_text.count++;
                     info_text.innerHTML = " " + info_text.count + " examples trained";
                }                         
         });
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
            add_samples_to_model().then(() => {
                recognise(user_recognizer,
                          minimum_probability,
                          function (recognitions) {
                              results_div.innerHTML = "";
                              recognitions.forEach(function (label_and_score) {
                                  results_div.innerHTML +=
                                      label_and_score[0] + " " + label_and_score[1] + "% confidence score<br>";
                              });
                          });                
                });
            results_div.innerHTML = "<p>Release when finished speaking.</p>";
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
        if (examples_collected === 0) {
            return;
        }
        examples_collected = 0;
//         console.log(user_recognizer.countExamples());
        window.parent.postMessage({show_message: "Training model with new examples"}, "*"); // probably hidden so this won't be seen
        user_recognizer
            .train({
                  epochs: 25,
                  callback: {
                    onEpochEnd: async (epoch, logs) => {
                      console.log(`Epoch ${epochs}: loss=${logs.loss}, accuracy=${logs.acc}`);
                    }
                  }
                })
            .then(() => {
                    window.parent.postMessage({show_message: "Training finished",
                                               duration: 2},
                                               "*");
                })
            .catch (error => {
                 report_error(error.message);
            });
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
    window.parent.postMessage({show_message: "Ready",
                               duration: 2},
                               "*");
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
    async function (event) {
        if (typeof event.data.training_class_names !== 'undefined') {
            // received the names of the classes so ready to initialise
            await initialise(event.data.training_class_names);
            let please_wait_element = document.getElementById('please-wait');
            if (please_wait_element && event.data.training_class_names.length > 0) {
                please_wait_element.remove();
                let introduction = document.getElementById("introduction");
                introduction.style.display = 'block'; // was hidden until everything is loaded
            }
            window.parent.postMessage("Ready", "*");
         } else if (typeof event.data.new_introduction !== 'undefined') {
            // introductory text overridde
            let introduction = document.getElementById("introduction");
            introduction.innerHTML = event.data.new_introduction;
            introduction.setAttribute("updated", true);
         }
    },
    false);

} ()));