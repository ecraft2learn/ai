 /**
 * Defines the behaviour of the audio training support window for the eCraft2Learn Snap! AI library
 * Builds upon https://github.com/tensorflow/tfjs-models/tree/master/speech-commands
 * Authors: Ken Kahn
 * License: New BSD
 */

((function () {
let new_introduction; // HTML on page introducing things
let builtin_recognizer; // recognises 20 words
let user_recognizer; // recognizer trained by user (as opposed to 20-word built in recognizer)
let training_classes; // names of the classes
let info_texts; // used to update information on each training button

const create_user_recognizer = async () => {
    if (user_recognizer) {
        return user_recognizer;
    }
    builtin_recognizer = speechCommands.create('BROWSER_FFT');
    await builtin_recognizer.ensureModelLoaded();
    builtin_recognizer.params().sampleRateHz = 44100; // avoids a warning about 48000 expected
    user_recognizer = builtin_recognizer.createTransfer('user trained'); // cache user's recognizer
    return user_recognizer;
};

const update_info_texts = (labels, tensor_data_set) => {
    if (!info_texts || !tensor_data_set) {
        return; // too early to update them
    }
    labels.forEach((word, index) => {
         if (tensor_data_set[word]) {
             let count = tensor_data_set[word].length;
             if (count > 1) {
                 info_texts[index].innerHTML = "&nbsp;&nbsp;" + count + " examples trained";
             } else if (count === 1) {
                 info_texts[index].innerHTML = "&nbsp;&nbsp;" + count + " example trained";
             }                                    
         }
     });    
};

const train_user_recognizer = () => {
    user_recognizer.train({epochs: 25,
                      callback: {
                        onEpochEnd: async (epoch, logs) => {
                          console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
                        }
                      }
                            })
                        .then(() => {
                                window.parent.postMessage({show_message: "Training finished",
                                                           duration: 2},
                                                           "*");
                            })
                        .catch (error => {
                            if (error.message !== "Cannot read property 'toString' of null") {
                                // this error doesn't seem to matter...
                                report_error(error.message);
                            }
                        });
};

const initialise = async function (training_class_names) {
    if (training_classes) {
        // already initialised
        return;
    }
    window.parent.postMessage({show_message: "Loading..."}, "*");
    create_user_recognizer().then(() => {
        training_classes = training_class_names;
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
                add_samples_to_model().then(() => {
                    recognise(recognizer,
                          recognitions => {
                              window.parent.postMessage({confidences: recognitions}, "*");
                          });
                });
            } else if (event.data === 'stop') { // from clicking on stop sign or running eCraft2Learn.stop_audio_recognition
                pending_recognitions = [];
                stop_recognising(true);
            } else if (event.data === 'stop_recognising') {
                stop_recognising(true); // just the current recognition - let the next one start 
            };
        };
        // these listeners need to be in the scope of initialise
        window.addEventListener("message", receive_messages, false);
        let pending_recognitions = [];
        const recognise = async function (recognizer, callback) {
            if (currently_listening_recognizer) {
                // already listening
                pending_recognitions.push(async function () {
                    await recognise(recognizer, callback);
                });
                return;
            }
            currently_listening_recognizer = recognizer;
            recognizer.listen(
                    recognition => {
                        let scores = recognition.scores;
                        let labels = recognizer.wordLabels();
                        let results = labels.map((label, index) => [label, Math.round(scores[index]*100)]);
                        callback(results.sort((x, y) => x[1] < y[1] ? 1 : -1));
                    },
                    {probabilityThreshold: 0.75,
                     invokeCallbackOnNoiseAndUnknown: false})
                .catch (error => {
                     report_error(error.message);
                });
        };
        const stop_recognising = function (clear_pending_recognitions) {
            if (currently_listening_recognizer) {
                currently_listening_recognizer.stopListening()
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
            user_recognizer.collectExample(training_class_names[class_index])
                .then(() => {
                    examples_collected++;
                    if (typeof info_text.count !== 'number') {
                        info_text.count = 1;
                        info_text.innerHTML = "&nbsp;&nbsp;" + info_text.count + " example trained";
                    } else {
                         info_text.count++;
                         info_text.innerHTML = "&nbsp;&nbsp;" + info_text.count + " examples trained";
                    }                         
             })
             .catch(error => {
                 report_error(error.message);
             });
        };
        let train_off = function (class_index, info_text) {
            // obsolete
        };
        const create_test_button = function (training_class_names) {
            const button = document.createElement('button');
            const start_label = "Start testing";
            const stop_label = "Stop testing";
            button.innerText = start_label;
            button.className = "testing-button";
            const results_div = document.createElement('div');
            document.body.appendChild(button);
            document.body.appendChild(results_div);
            const start = () => {
                const example_counts = user_recognizer.countExamples();
                if (Object.keys(example_counts).length !== training_class_names.length) {
                    results_div.innerHTML = "Training is missing. Only " + Object.keys(example_counts).length +
                                            " words have been trained. Expected all " + training_class_names.length +
                                            " words to be trained.";
                    return;
                }
                results_div.innerHTML = "<p>Start speaking.</p>";
                add_samples_to_model().then(() => {
                    recognise(user_recognizer,
                              function (recognitions) {
                                  results_div.innerHTML = "";
                                  recognitions.forEach(function (label_and_score) {
                                      results_div.innerHTML +=
                                          label_and_score[0] + " " + label_and_score[1] + "% confidence score<br>";
                                  });
                              });                
                    });
            };
            const stop = () => {
                results_div.innerHTML = "<p>No longer listening.</p>";
                pending_recognitions = [];
                stop_recognising();
            };
            let toggle_recognition = () => {
                if (button.innerText === start_label) {
                    start();
                    button.innerText = stop_label;
                } else {
                    stop();
                    button.innerText = start_label;
                }
            };
            button.addEventListener('click',    toggle_recognition);
            button.addEventListener('touchend', toggle_recognition);
        };
        const add_samples_to_model = async function () {
            if (examples_collected === 0) {
                return;
            }
            examples_collected = 0;
            train_user_recognizer();
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
        info_texts = create_training_buttons(training_class_names, train_on, train_off);
        if (user_recognizer) {
            update_info_texts(training_class_names, user_recognizer.transferExamples);
        }
        create_test_button(training_class_names);
        create_save_training_button('microphone',
                                    () => user_recognizer.transferExamples,
                                    () => user_recognizer.wordLabels());
        create_return_to_snap_button();
        window.parent.postMessage({show_message: "Ready",
                                   duration: 2},
                                   "*");
        window.parent.postMessage({data_set_loaded: training_classes}, "*");            
    });
    // see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
//     if (speech_recognizer.audioCtx) {
//         document.querySelectorAll('button').forEach(function (button) {
//             button.addEventListener('click', function() {
//                 speech_recognizer.audioCtx.resume();
//             });
//         });
//     }
};

const report_error = function (error_message) {
    try { // since window.parent.ecraft2learn may trigger a permission error
        if (window.parent.ecraft2learn.support_window_visible('training using microphone')) {
            alert(error_message);
        } else {
            window.parent.postMessage({error: error_message}, "*");
        }
    } catch (error) {
        console.error(error_message);
        window.parent.postMessage({error: error_message}, "*");
    }
};

const message_receiver = 
    async (event) => {
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
         } else if (typeof event.data.training_data !== 'undefined') {
            let data_set = string_to_data_set('microphone', event.data.training_data);
            if (data_set) {
                if (data_set.html) {
                    let introduction = decodeURIComponent(data_set.html);
                    update_introduction(introduction);
                }
                load_data_set('microphone',
                              data_set,
                              (tensor_data_set) => {
                                  create_user_recognizer()
                                      .then(async (recognizer) => {
                                          recognizer.transferExamples = tensor_data_set;
                                          let labels = training_classes || Object.keys(tensor_data_set);
                                          recognizer.words = labels;
                                          update_info_texts(labels, tensor_data_set);
                                          // pass back labels in case Snap! doesn't know them
                                          event.source.postMessage({data_set_loaded: labels}, "*");
                                          train_user_recognizer();
                                          event.source.postMessage("Ready", "*");
                                          initialise(labels); // no-op if already initialised                                            
                                      });
                              });
            }
        }
    };

    window.addEventListener('DOMContentLoaded', 
        (event) => {
            window.addEventListener("message", message_receiver, false);
            window.parent.postMessage("Audio support loaded", "*");     
        });


} ()));