// Machine learning using Tensorflow.js as part of the eCraft2Learn Snap! library
// Written by Ken Kahn 
// License: New BSD

"use strict"

window.tensorflow = 
((function () {

let models = {};
const get_model = (name) => models[name];

let model; // used for defaults such as model name when creating a model

let data = {}; // training and validation data either for "all models" or named models
const get_data = (model_name, kind) => {
    if (kind === 'datasets') {
        const training_data = get_data(model_name, 'training');
        if (!training_data) {
            if (model_name !== 'all models') {
                return get_data('all models', kind);
            }
            return;
        }
        const xs_array = training_data.input;
        const ys_array = training_data.output;
        const validation_data = get_data(model_name, 'validation');
        let xs_validation_array, ys_validation_array;
        if (validation_data) {
            xs_validation_array = validation_data.input;
            ys_validation_array = validation_data.output;
         }
         return {model_name, xs_array, ys_array, xs_validation_array, ys_validation_array};
    }
    if (!data.hasOwnProperty(model_name) || !data[model_name].hasOwnProperty(kind)) {
        if (model_name !== 'all models') {
            return get_data('all models', kind);
        }
        return;
    }
    return data[model_name][kind];
};
const set_data = (model_name, kind, value, callback) => {
    if (!data.hasOwnProperty(model_name)) {
        data[model_name] = {};
    }
    if (value.hasOwnProperty('output')) {
        if (value.output.length > 0 && isNaN(+value.output[0])) {
            // values might be strings that represent numbers - only non-numeric strings can be category labels
            let labels;
            [value.output, labels] = to_one_hot(value.output, data[model_name].categories);
            data[model_name].categories = labels;
            if (model_name === 'all models') {
                // recreate all models with for example softmax and one-hot created before this data was available
                Object.keys(data).forEach((name) => {
                    if (data[name].hasOwnProperty('recreate')) {
                        data[name]['recreate'](callback);
                        callback = undefined;
                    }
                });
            } else if (data[model_name].hasOwnProperty('recreate')) {
                data[model_name]['recreate'](callback);
                callback = undefined;               
            }
        } else {
            value.output = value.output.map((n) => +n); // string to number
            data[model_name].categories = undefined;
        }        
    }
    data[model_name][kind] = value;
    if (kind === 'training') {
        optimize_hyperparameters_interface_button.disabled = false;
        train_button.disabled = false;
    }
    if (kind === 'training' && get_model(model_name)) {
        ensure_last_layer_right_size(get_model(model_name), value);
    }
    invoke_callback(callback);
};

const to_one_hot = (labels, current_labels) => {
    const unique_labels = current_labels || [];
    labels.forEach((label) => {
        if (unique_labels.indexOf(label) < 0) {
            unique_labels.push(label);
        }
    });
    const one_hot = (index, n) => {
        let vector = [];
        for (let i = 0; i < n; i++) {
            vector.push(i === index ? 1 : 0);
        }
        return vector;
    };
    const one_hot_labels =
        labels.map((label) => one_hot(unique_labels.indexOf(label), unique_labels.length));
    return [one_hot_labels, unique_labels];
};

const optimization_methods =
    {"Stochastic Gradient Descent": "sgd",
     "Momentum": "momentum",
     "Adaptive Stochastic Gradient Descent": "adagrad",
     "Adaptive Learning Rate Gradiant Descent": "adadelta",
     "Adaptive Moment Estimation": "adam",
     "Adaptive Moment Estimation Max": "adamax",
     "Root Mean Squared Prop": "rmsprop"};

const optimizer_named = (name, learning_rate) => {
    name = name.trim();
    if (name === 'Momentum' || name === 'momentum') {
        return tf.train.momentum((learning_rate || .001), .9);
    }
    return optimization_methods[name] || name;
};

const non_categorical_loss_functions = 
    {"Absolute Difference": "absoluteDifference",
//     "Compute Weighted Loss": "computeWeightedLoss", // caused "Cannot compute gradient: gradient function not found for notEqual." errors
//      "Cosine Distance": "cosineDistance", // was causing crazy predictions
//      "Hinge Loss": "hingeLoss", // appropriate for support vector machines
//      "Huber Loss": "huberLoss", // this caused training nonsense
     "Log Loss": "logLoss",
     "Mean Squared Error": "meanSquaredError"};

const categorical_loss_functions =
    {//"Sigmoid Cross Entropy": "sigmoidCrossEntropy", - requires more arguments - could supply them
    // and what about tf.metrics.binaryCrossentropy
     "Softmax Cross Entropy": "categoricalCrossentropy"};

const loss_functions = (categories) => categories ? categorical_loss_functions : non_categorical_loss_functions;

const loss_function_named = (name) => {
    name = name.trim();
    return non_categorical_loss_functions[name] || categorical_loss_functions[name] || name;
};

const add_to_models = function (new_model) {
    const current_model = models[new_model.name];
    if (current_model && current_model !== new_model && 
        !current_model.disposed) {
        try {
            current_model.dispose();
            current_model.disposed = true;
        } catch (error) {
            console.log("Unable to dispose of old version of model " + new_model.name);
            console.error(error);
        }
    }
    models[new_model.name] = new_model;
    model = new_model; // is now the current model
};

const shape_of_data = (data) => {
   if (typeof data === 'number') {
       return [1];
   } else if (typeof data[0] === "number") {
      return [data.length];
   } else {
      return [data.length].concat(shape_of_data(data[0]));
   }
};

const ensure_last_layer_right_size = (model, data) => {
    const output_size = Array.isArray(data.output[0]) ? data.output[0].length : 1;
    const last_layer_size = model.layers[model.layers.length-1].units;
    if (output_size !== last_layer_size) {
        throw new Error("The last layer of your model determines how many numbers are in each prediction. " +
                        "The size of your last layer is " + last_layer_size + 
                        " but the size of the training data output is " + output_size +
                        ". Please make sure the model's last layer is " + output_size);
    }   
};

// const create_model_old = (name, layers, optimizer_full_name, input_shape, options) => {
//     const training_data = get_data(name, 'training');
//     const validation_data = get_data(name, 'validation');
//     if (!input_shape && !training_data) {
//         throw new Error("Cannot create a model before knowing what the data is like.\nProvide at least one example of the data.");
//     }
//     const optimizer = optimizer_named(optimizer_full_name);
//     if (!optimizer) {
//         throw new Error("Could not recognise '" + optimizer_full_name + "' as an optimizer.");
//     }
//     if (typeof options !== 'object') {
//         options = {}; // none
//     }
//     const model = tf.sequential({name: name});
//     model.ready_for_training = false;
//     tensorflow.add_to_models(model); // using tensorflow.add_to_models in case it has been extended
//     const categories = get_data(name, "categories"); // if defined
//     if (!categories) {
//         // need to recreate this model if later it gets data that uses categories
//         set_data(name,
//                  'recreate',
//                  () => {
//                      create_model(name, layers, optimizer_full_name, input_shape, options);
//                  });
//     }
//     layers.forEach((configuration, index) => {
//         let layer_options = [];
//         let layer_activation, size;
//         if (typeof configuration === 'number') {
//             size = configuration;
//         } else {
//             let parts = configuration.split(' ');
//             size = +parts[0];
//             if (parts.length === 2) {
//                 layer_activation = parts[1];
//             } else if (parts.length > 2) {
//                 layer_options = parts.slice(1); // e.g. '10 dropout .5 activation relu' becomes ['dropout', '.5', 'activation', 'relu']
//             }
//         }
//         if (size > 0) {
//             let configuration = {units: size,
//                                  useBias: index !== layers.length-1}; // except for last layer
//             if (index === layers.length-1) {
//                 if (categories) {
//                     configuration.activation = 'softmax';
//                     configuration.units = categories.length;
//                 }
//             } else {
//                 // all but the last one has an activation function unless categorical 
//                 configuration.activation = options.activation || 'relu';              
//             }
//             // if explicitly specified override default activation function
//             if (layer_activation) {
//                 // for backwards compatibility
//                 configuration.activation = layer_activation;
//             } else if (layer_options.indexOf('activation') >= 0) {
//                 configuration.activation = layer_options[layer_options.indexOf('activation')+1];
//             }                  
//             if (index === 0) { // first one needs inputShape
//                 configuration.inputShape = input_shape ||
//                                            shape_of_data((training_data || validation_data).input[0]);    
//             }
//             model.add(tf.layers.dense(configuration));
//             if (index < layers.length-1 && layer_options.indexOf('dropout') >= 0) {
//                 const rate = +layer_options[layer_options.indexOf('dropout')+1];
//                 model.add(tf.layers.dropout({rate: rate}));
//             }
// //              model.add(tf.layers.batchNormalization());
//         }
//     });
//     if (!optimizer) {
//         optimizer = 'adam';
//     }
//     if (categories) {
//         options.loss_function = "Softmax Cross Entropy";
//         gui_state["Model"]["Loss function"] = options.loss_function;
//     }
//     let loss_function = loss_function_named(options.loss_function || default_loss_function(categories));
// //     tf.tidy(() => {
//         model.compile({loss: typeof loss_function === 'string' ? tf.losses[loss_function] : loss_function,
//                        optimizer: optimizer,
//                        metrics: categories && ['accuracy']
//                       });
// //     });
//     gui_state["Model"]["Layers"] = layers.toString();
//     gui_state["Model"]["Optimization method"] = optimizer_full_name;
//     if (options.loss_function) {
//         gui_state["Model"]["Loss function"] = options.loss_function;
//     }
//     model.ready_for_training = true;
//     if (model.callback_when_ready_for_training) {
//         model.callback_when_ready_for_training();
//         model.callback_when_ready_for_training = undefined;
//     }
//     if (training_data) {
//         ensure_last_layer_right_size(model, training_data);
//     }
//     return model;
// };

const normalize = (tensor) => {
    // divides all by max-min value
    let min = Math.min();
    let max = Math.max();
    const data = tensor.flatten().arraySync();
    data.forEach((x) => {
        if (x < min) {
            min = x;
        } else if (x > max) {
            max = x;
        }
    });
    const difference = max-min;
    if (difference !== 0) {
        return [difference, tensor.div(tf.scalar(difference))];
    }
};

// const train_model_old = async (model_or_model_name, training_data, validation_data, options,
//                            use_tfjs_vis, success_callback, error_callback, message_element) => {
//     // validation_data is optional - if provided not used for training only calculating loss
//     let message_to_user;
//     if (!model_or_model_name) {
//         model_or_model_name = model; // current model (if there is one)
//     }
//     if (!model_or_model_name) {
//         error_callback({message: "No model or name provided to train model."});
//         return;
//     }
//     if (typeof model_or_model_name === 'string') {
//         model = models[model_or_model_name];
//         if (!model) {
//             error_callback({message: "No model named '" + model_or_model_name + "'"});
//             return;
//         }
//     } else {
//         model = model_or_model_name;
//     }
//     try {
//         ensure_last_layer_right_size(model, training_data);
//     } catch (error) {
//         error_callback({message: error.message});
//         return;
//     }
//     if (!model.ready_for_training) {
//         let previous_callback = model.callback_when_ready_for_training;
//         model.callback_when_ready_for_training = 
//             () => {
//                 if (previous_callback) {
//                     previous_callback();
//                 }
//                 train_model(model, training_data, validation_data, options,
//                             use_tfjs_vis, success_callback, error_callback, message_element);
//             };
//         return;
//     }
//     const categories = get_data(model.name, 'categories');
//     try {
//         // callbacks based upon https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
//         let epoch_history = [];
//         const metrics = categories ? ['loss', 'val_loss', 'acc', 'val_acc'] : ['loss', 'val_loss'];
//         const container = {tab: 'Training',
//                            styles: { height: '400px' }};
//         container.name = categories ? 'Loss and accuracy' : 'Loss';                           
//         let callbacks;
//         let epoch_end_callback;
//         if (use_tfjs_vis &&
//             (window.parent === window || // not an iframe
//              !window.parent.ecraft2learn || // parent isn't ecraft2learn library
//              window.parent.ecraft2learn.support_window_visible("tensorflow.js"))) { // is visible
//             callbacks = tfvis.show.fitCallbacks(container, metrics, {callbacks: ['onEpochEnd'], yAxisDomain: [0, 1]});
//             epoch_end_callback = callbacks.onEpochEnd;
//         } else {
//             callbacks = {};
//         }
//         callbacks.onEpochEnd = (epoch, history) => {
//             if (epoch_end_callback) {
//                 epoch_end_callback(epoch, history);
//             }
//             if (isNaN(history.loss)) {
//                 throw new Error('Training stopped due to loss being "not a Number"');
//             }
//             // and in any case do the following 
//             if (epoch > 4 &&
//                 epoch_history[epoch-1].loss === history.loss &&
//                 epoch_history[epoch-2].loss === history.loss &&
//                 epoch_history[epoch-3].loss === history.loss) {
//                 // no progress for last 4 epochs 
//                 throw new Error('Training stopped after ' + (epoch-4) + ' steps due to lack of progress.');
//             }
//             epoch_history.push(history);
//         };
//         if (!model.optimizer) {
//             // loaded models lack an optimizer and loss function
//             const optimizer_full_name = gui_state["Model"]["Optimization method"];
//             const optimizer = optimizer_named(optimizer_full_name);
//             const loss_function_full_name = gui_state["Model"]["Loss function"];
//             const loss_function = loss_function_named(loss_function_full_name);
//             model.compile({loss: (loss_function || default_loss_function(categories)),
//                            optimizer: optimizer});
//         }
//         if (model.optimizer.learningRate && options.learning_rate) { 
//             // only if optimizer has a learningRate property
//             // perhaps it would be better to create optimizers with the correct learning_rate
//             // e.g. tf.train.xxx(learning_rate)
//             model.optimizer.learningRate = options.learning_rate;
//             gui_state["Training"]['Learning rate'] = options.learning_rate;
//         }
//         if (options.epochs) {
//             gui_state["Training"]['Number of iterations'] = options.epochs;
//         }
//         if (options.validation_split) {
//             gui_state["Training"]['Validation split'] = +options.validation_split;
//         }
//         if (typeof options.shuffle === 'boolean') {
//             gui_state["Training"]['Shuffle data'] = options.shuffle;
//         }
//         let [xs, ys] = get_tensors(model.name, 'training');
// //         const [normalization_factor, new_xs] = normalize(xs);
// //         if (normalization_factor) {
// //             xs.dispose();
// //             xs = new_xs;
// //             model.normalization_factor = normalization_factor;
// //         }
//         let configuration = {epochs: (+options.epochs || 10),
//                              shuffle: options.shuffle,
//                              validationSplit: +options.validation_split,
//                              callbacks: callbacks};
//         let validation_tensors = get_tensors(model.name, 'validation'); // undefined if no validation data
//         if (validation_tensors) {
//             configuration.validationData = validation_tensors;
//         }
//         const then_handler = (extra_info) => {
//             let duration = Math.round((Date.now()-start)/1000); // seconds to 3 decimal places
//             const last_epoch = epoch_history[epoch_history.length-1];
//             let response = last_epoch ?
//                            {"training loss":     last_epoch.loss.toFixed(3),
//                             "validation loss":   last_epoch.val_loss && last_epoch.val_loss.toFixed(3),
//                             "training accuracy": last_epoch.acc && (100*last_epoch.acc).toFixed(1) + "%",
//                             "validation accuracy": last_epoch.val_acc && (100*last_epoch.val_acc).toFixed(1) + "%",
//                             "duration in seconds": duration} : 
//                            {"duration in seconds": duration};
//             if (typeof extra_info === 'string') {
//                 response.extra_info = extra_info;
//             }
//             success_callback(response);
//             model.ready_for_prediction = true;
//             if (model.callback_when_ready_for_prediction) {
//                 model.callback_when_ready_for_prediction();
//                 model.callback_when_ready_for_prediction = undefined;
//             }
//             xs.dispose();
//             ys.dispose();
//             if (validation_tensors && validation_tensors.length === 2) {
//                 validation_tensors[0].dispose();
//                 validation_tensors[1].dispose();
//             }
//         };
//         const error_handler = (error) => {
//             if (error.message.indexOf('Training stopped') === 0) {
//                 // only did some training but not really an error
//                 then_handler(error.message);
//                 if (message_element) {
//                     message_element.innerHTML += "<br>" + error.message;
//                 }
//             } else {
//                 error_callback(error);
// //                  model.summary();
//             }
//         };
//         // Train the model using the data
//         let start = Date.now();
//         // do I really need tidy at all since I dispose of tensors explicitly
// //         if (configuration.validationSplit) {
// //             // see https://github.com/tensorflow/tfjs/issues/927
// //             // hack until resolved - note there may be a memory leak here
// //             // tests indicate that the memory loss is only for the first time this is run
// //             // presumably the validation set is cached 
// //             model.fit(xs, ys, configuration)
// //                 .then((x) => {
// //                          tf.tidy(() => {
// //                              then_handler(x);
// //                          });
// //                      },
// //                      error_handler);
// //         } else {
// //             tf.tidy(() => {
//                 model.fit(xs, ys, configuration)
//                     .then(then_handler, error_handler);
// //                 });       
// //         }
//     } catch (error) {
//         error_callback(error);
//     }
//     return message_to_user;
// };

const default_loss_function = (categories) => categories ? 'categoricalCrossentropy' : 'meanSquaredError';

const get_tensors = (model_name, kind) => {
    let data = get_data(model_name, kind);
    if (!data) {
        return;
    }
    let tensors = [];
    if (typeof data.input[0] === 'number') {
        tensors.push(tf.tensor2d(data.input,  [data.input.length, 1]));
    } else {
        tensors.push(tf.tensor(data.input));
    }
    if (typeof data.output[0] === 'number') {
        tensors.push(tf.tensor2d(data.output, [data.output.length, 1]));
    } else {
        tensors.push(tf.tensor(data.output));
    }
   return tensors;
};

let optimize_hyperparameters_messages; // only need one even if called multiple times
let lowest_loss;
let highest_accuracy;
let highest_score;
let metrics_of_highest_score;
let is_best_so_far;
let best_model;
let stop_on_next_experiment = false;
let hyperparameter_searching = false;
const optimize_hyperparameters_button = document.createElement('button');
const search_button_label = "Search for good parameters using current settings";
const stop_button_label = "Stop when next current experiment finishes";

const create_hyperparameter_optimization_tab = (model, add_messages_now) => {
    const surface = tfvis.visor().surface({name: 'Tensorflow', tab: 'Optimize'});
    const draw_area = surface.drawArea;
    if (optimize_hyperparameters_messages) {
        tfvis.visor().setActiveTab('Optimize');
        return; // already set up 
    }
    optimize_hyperparameters_messages = document.createElement('p');
    if (add_messages_now) {
        draw_area.appendChild(optimize_hyperparameters_messages);
    }
    optimize_hyperparameters_button.innerHTML = search_button_label;
    optimize_hyperparameters_button.className = "support-window-button";
    optimize_hyperparameters_button.addEventListener('click', 
                                                     () => {
                                                         if (hyperparameter_searching) {
                                                             stop_on_next_experiment = true;
                                                         } else {
                                                             hyperparameter_searching = true;
                                                             optimize_hyperparameters_with_parameters(draw_area, model);
                                                             optimize_hyperparameters_button.innerHTML = stop_button_label;
                                                         }
                                                     });
    draw_area.appendChild(optimize_hyperparameters_button);
    parameters_interface(create_parameters_interface).optimize.open();
};

const search_descriptions = 
    ["Search for best Optimization method",
     "Search for best loss function",
     "Search for best activation function",
     "Search for best shuffle data setting",
     "Search for best number of training iterations",
     "Search for best validation split",
     "Search for best dropout rate",
     "Search for best number of layers"];

const weight_descriptions =
    ["How much loss contributes to score",
     "How much accuracy contributes to score",
     "How much training time contributes to score",
     "How much size of model contributes to score"];

const display_trial = (parameters, element) => {
    if (parameters.layers) {
        element.innerHTML += "Layers = " + parameters.layers + "<br>";
    }
    if (parameters.epochs) {
        element.innerHTML += "Number of training iterations = " + parameters.epochs + "<br>";
    }
    if (parameters.learning_rate) {
        element.innerHTML += "Learning rate = " + parameters.learning_rate.toFixed(5) + "<br>";
    }
    if (typeof parameters.dropout_rate !== 'undefined') {
        element.innerHTML += "Dropout rate = " + parameters.dropout_rate.toFixed(3) + "<br>";
    }
    if (parameters.optimization_method) {
        element.innerHTML += "Optimization method = " + inverse_lookup(parameters.optimization_method, optimization_methods) + "<br>";
    }
    if (parameters.activation) {
        element.innerHTML += "Activation function = " + parameters.activation + "<br>";
    }
    if (parameters.loss_function) {
        element.innerHTML += "Loss function = " + 
                             inverse_lookup(parameters.loss_function,
                                            loss_functions(get_data(parameters.model_name, 'categories'))) + "<br>";
    }
    if (typeof parameters.validation_split !== 'undefined') {
        element.innerHTML += "Validation split = " + parameters.validation_split.toFixed(3) + "<br>";
    }
    if (typeof parameters.shuffle !== 'undefined') {
        element.innerHTML += "Shuffle data = " + parameters.shuffle + "<br>";
    }
};

const display_trial_results = (trial) => {
    const score = -trial.result.loss;
    if (trial.result.loss === Number.MAX_VALUE) {
        optimize_hyperparameters_messages.innerHTML += 
            "Training failed and reported a loss that is not a number.<br></b>";
        return;
    }
    const results = trial.result.results;
    const loss = typeof results["Lowest validation loss"] === 'undefined' ?
             results["Training loss"] : results["Lowest validation loss"];
    const accuracy = typeof results["Validation accuracy"] === 'undefined' ?
                     results["Training accuracy"] : results["Validation accuracy"];
    let message = "";
    const best_score = score >= highest_score;
    const best_loss = loss <= lowest_loss;
    const best_accuracy = accuracy >= highest_accuracy;
    if (best_score) {
        highest_score = score;
    }
    if (best_loss) {
        lowest_loss = loss;
    }
    if (best_accuracy) {
        highest_accuracy = accuracy;
    }
    if (best_score) {
        message = "<b>Best so far.<br>";
    }
    // tried toFixed(...) but error can be 1e-12 and shows up as just zeroes
    message += "Score = " + score;
    const add_samples = (kind) => {
        if (results.samples && results.samples.length > 1) {
            message += "<br>(";
            results.samples.forEach((sample) => {
                message += sample[kind] + ", ";
            });
            message += ")";
        }
    };        
    add_samples('score');
    message += "<br>Loss = " + loss;
    add_samples('loss');
    if (accuracy) {
        message += "<br>Accuracy = " + accuracy;
        add_samples('accuracy');
    }
    if (best_score) {
        message += "</b>";
    }
    optimize_hyperparameters_messages.innerHTML += message + "</b>";
};

const optimize_hyperparameters_with_parameters = (draw_area, model) => {
    draw_area.appendChild(optimize_hyperparameters_messages);
    const name_element = document.getElementById('name_element');
    const model_name = name_element ? name_element.value : model ? model.name : 'my-model';
    const categories = get_data(model_name, 'categories');
    const [xs, ys] = get_tensors(model_name, 'training');
    let validation_tensors = get_tensors(model_name, 'validation'); // undefined if no validation data
    let epochs = gui_state["Training"]["Number of iterations"];
    let onExperimentBegin = (i, trial) => {
        if (stop_on_next_experiment) {
            stop_on_next_experiment = false;
            hyperparameter_searching = false;
            optimize_hyperparameters_button.innerHTML = search_button_label;
            return true; // to stop the search
        }
        optimize_hyperparameters_messages.innerHTML += "<br><br>Experiment " + (i+1) + ":<br>";
        display_trial(trial.args, optimize_hyperparameters_messages);
    };
    const onExperimentEnd = (i, trial) => {
        display_trial_results(trial);
    };
//     optimize_hyperparameters_messages.innerHTML = "<b>Searching for good parameter values. Please wait.</b>";
    const error_handler = (error) => {
        optimize_hyperparameters_messages.innerHTML = "Sorry but an error occured.<br>" + error.message;
        draw_area.appendChild(optimize_hyperparameters_messages);
        optimize_hyperparameters_button.innerHTML = search_button_label;
        hyperparameter_searching = false;
        stop_on_next_experiment = false;
    };
    const number_of_experiments = Math.round(gui_state["Optimize"]["Number of experiments"]);
    const number_of_samples = Math.round(gui_state["Optimize"]["Number of samples"]);
    const what_to_optimize = search_descriptions.map(description => gui_state["Optimize"][description]);
    const scoring_weights = weight_descriptions.map(description => gui_state["Optimize"][description]);
    optimize(model_name, xs, ys, validation_tensors, number_of_experiments, epochs, 
             onExperimentBegin, onExperimentEnd, error_handler, 
             what_to_optimize, scoring_weights, number_of_samples)
        .then((result) => {
            if (!result) {
                // error has been handled
                return;
            }
            if (!best_model) {
                // all experiments failed
                const message = document.createElement('p');
                message.innerHTML = "All experiments failed. Try different settings.";
                draw_area.appendChild(message);
            } else {
                const install_settings_button = document.createElement('button');
                install_settings_button.className = "support-window-button";
                draw_area.appendChild(install_settings_button);
                const model_name = best_model.name;
                install_settings_button.innerHTML = "Click to set '" + model_name + "' to best one found (" +
                                                    "Loss = " + metrics_of_highest_score.average_loss +
                                                    (typeof metrics_of_highest_score.average_accuracy === 'undefined' ? 
                                                     "" : "; Accuracy = " + metrics_of_highest_score.average_accuracy) + 
                                                    ")<br>";
                display_trial(result.argmin, install_settings_button);
                const settings = result.argmin;
                settings.model_name = model_name;
                install_settings_button.addEventListener('click',
                                                         () => {
                                                             console.log("Installed", install_settings_button.innerHTML)
                                                             model = best_model;
                                                             add_to_models(model);
                                                             show_layers(model, 'Model after creation');
                                                             install_settings(settings);
                                                             install_settings_button.remove();
                                                         });
            }
            xs.dispose();
            ys.dispose();
            if (validation_tensors && validation_tensors.length === 2) {
                validation_tensors[0].dispose();
                validation_tensors[1].dispose();
            }
            optimize_hyperparameters_button.innerHTML = search_button_label;
            hyperparameter_searching = false;
            stop_on_next_experiment = false;
        });
};

const install_settings = (parameters) => {
    const hidden_layer_sizes = parameters.hidden_layer_sizes || parameters.layers; // layers is the older name
    if (hidden_layer_sizes) {
        gui_state["Model"]["Layers"] = hidden_layer_sizes.toString();
    }
    if (parameters.epochs) {
        gui_state["Training"]["Number of iterations"] = parameters.epochs;
    }
    if (parameters.learning_rate) {
        gui_state["Training"]["Learning rate"] = parameters.learning_rate;
    }
    const optimizer = parameters.optimizer || parameters.optimization_method;
    if (optimizer) {
        gui_state["Model"]["Optimization method"] = inverse_lookup(optimizer, optimization_methods);
    }
    if (parameters.loss_function) {
        gui_state["Model"]["Loss function"] = inverse_lookup(parameters.loss_function, loss_functions(get_data(parameters.model_name, 'categories')));
    }
    if (parameters.activation) {
        gui_state["Model"]["Activation function"] = parameters.activation;
    }
    if (typeof parameters.dropout_rate !== 'undefined') {
        gui_state["Model"]["Dropout rate"] = parameters.dropout_rate;
    }
    if (typeof parameters.validation_split !== 'undefined') {
        gui_state["Training"]["Validation split"] = parameters.validation_split;
    }
    if (typeof parameters.stop_if_no_progress_for_n_epochs === 'number') {
        gui_state["Training"]["Stop if no progress for number of iterations"] = parameters.stop_if_no_progress_for_n_epochs;
    }
    if (typeof parameters.shuffle === 'boolean') {
        gui_state["Training"]["Shuffle data"] = parameters.shuffle;
    }
    update_gui();
};

const update_gui = () => {
    const gui = parameters_interface(create_parameters_interface);
    gui.model.__controllers.forEach((controller) => {
        controller.updateDisplay();
    });
    gui.training.__controllers.forEach((controller) => {
        controller.updateDisplay();
    });
    gui.optimize.__controllers.forEach((controller) => {
        controller.updateDisplay();
    });
};

const inverse_lookup = (value, table) => {
    // useful for converting from internal names for loss functions and optimizatin methods
    // to user friendlier names
    let key;
    Object.entries(table).some((entry) => {
        if (value === entry[1]) {
            key = entry[0];
            return true;
        }
    });
    return key || value;
};

let previous_model;

const optimize_hyperparameters = (model_name, number_of_experiments, epochs,
                                  experiment_end_callback, success_callback, error_callback,
                                  what_to_optimize,
                                  scoring_weights,
                                  number_of_samples) => {
   // this is meant to be called when messages are received from a client page (e.g. Snap!)
   record_callbacks(success_callback, error_callback);
   create_hyperparameter_optimization_tab(model, true);
   const experiment_begin_callback = (i, trial) => {
        optimize_hyperparameters_messages.innerHTML += "<br><br>Experiment " + (i+1) + ":<br>";
        display_trial(trial.args, optimize_hyperparameters_messages);
   };
   const new_experiment_end_callback = (i, trial) => {
       display_trial_results(trial);
       if (experiment_end_callback) {
           experiment_end_callback(i, trial);
       }
   }
   gui_state["Training"]["Number of iterations"] = epochs;
   try {   
       const [xs, ys] = get_tensors(model_name, 'training');
       const validation_tensors = get_tensors(model_name, 'validation'); // undefined if no validation data
           optimize(model_name, xs, ys, validation_tensors, number_of_experiments, epochs, 
                    experiment_begin_callback, new_experiment_end_callback, error_callback, 
                    what_to_optimize,
                    scoring_weights,
                    number_of_samples)
              .then((result) => {
                  if (result) {
                      result.best_model = best_model || previous_model; // if no best model then previous had NaN loss
                  }
                  invoke_callback(success_callback, result);
                  if (previous_model && !previous_model.disposed && best_model && previous_model !== best_model) {
                      previous_model.dispose();
                      previous_model.disposed = true;
                      previous_model = undefined;
                  }
              });
   } catch (error) {
       if (error_callback) {
           let error_message;
           // try to generate more helpful error messages
           if (!get_model(model_name)) {
               error_message = "No model named '" + model_name + "'";
           } else if (!get_tensors(model_name, 'training')) {
               error_message = "No training data sent to the model named '" + model_name + "'";
           } else {
               error_message = error.message;
               console.log(tf.memory()); // in case is a GPU memory problem good to know this
           }
           invoke_callback(error_callback, new Error(error_message));
       } else {
           console.error(error);
       }
       return;
   }
};

const optimize = async (model_name, xs, ys, validation_tensors, 
                        number_of_experiments, // number of different parameters settings to explore
                        epochs,
                        onExperimentBegin, onExperimentEnd, error_callback,
                        what_to_optimize,
                        scoring_weights,
                        number_of_samples // how many times to repeat experiments on the same parameters
                        ) => {
    const create_and_train_model = async ({layers, optimization_method, loss_function, epochs, learning_rate,
                                           dropout_rate, validation_split, activation, shuffle}, 
                                          {xs, ys}) => {
        if (create_and_train_model.stopped_prematurely) {
            return;
        }
        if (!layers) {
            layers = get_layers();
        }
        if (!optimization_method) {
            optimization_method = optimizer_named(gui_state["Model"]["Optimization method"]);
        }
        if (!loss_function) {
            loss_function = loss_function_named(gui_state["Model"]["Loss function"]);
        }
        if (!activation) {
            activation = gui_state["Model"]["Activation function"]
        }
        if (!epochs) {
            epochs = Math.round(gui_state["Training"]["Number of iterations"]);
        }
        if (!learning_rate) {
            learning_rate = gui_state["Training"]["Learning rate"];
        }
        if (typeof dropout_rate === 'undefined') {
            dropout_rate = gui_state["Model"]["Dropout rate"];
        }
        if (typeof validation_split === 'undefined') {
            validation_split = gui_state["Training"]["Validation split"];
        }
        if (typeof shuffle !== 'boolean') {
            shuffle = to_boolean(gui_state["Training"]["Shuffle data"]);
        }
        const input_shape = shape_of_data(get_data(model_name, 'training').input[0]);
        const tensor_datasets = {xs, 
                                 ys,
                                 xs_validation: validation_tensors && validation_tensors[0],
                                 ys_validation: validation_tensors && validation_tensors[1],
                                };
        const make_model = () => {
            return create_model({model_name,
                                 tensor_datasets,
                                 input_shape,
                                 hidden_layer_sizes: layers,
                                 optimizer: optimization_method,
                                 loss_function,
                                 activation,
                                 dropout_rate,
                                 learning_rate});            
        };
        let model = make_model();
        let samples_remaining = number_of_samples;
        let samples = [];
        const sample_results = 
            async (results, resolve) => {
                previous_model = model;
                let loss = results["Lowest validation loss"];
                if (isNaN(loss)) {
                    loss = Number.MAX_VALUE;
                }
                const accuracy = results["Highest accuracy"];
                const duration = results["Duration in seconds"];
                const size = model.countParams();
                let score;
                if (scoring_weights) {
                    score = compute_score(cannonicalise_weights(scoring_weights), loss, accuracy, duration, size);
                } else if (accuracy) {
                    score = accuracy;
                } else {
                    score = -loss;
                }
                samples.push({score, loss, accuracy, duration, size});
                next_sample(resolve);
        };
        const next_sample = (resolve) => {
            samples_remaining--;
            model = make_model(); // recreate model
            train(resolve);
        };
        const final_results = 
            async (results, resolve) => {
                results.samples = samples;
                let average_score = 0;
                let average_loss = 0;
                let average_accuracy = 0;
                let average_duration = 0;
                let average_size = 0;
                samples.forEach(({score, loss, accuracy, duration, size}) => {
                    average_score += score/samples.length;
                    average_loss += loss/samples.length;
                    average_accuracy += accuracy/samples.length;
                    average_duration += duration/samples.length;
                    average_size += size/samples.length;
                });
                samples = [];
                samples_remaining = number_of_samples;
                is_best_so_far = average_score > highest_score || typeof highest_score === 'undefined';
                if (is_best_so_far) {
                    highest_score = average_score;
                    metrics_of_highest_score = {average_loss, average_accuracy, average_duration, average_size};
                    if (best_model) {
                        best_model.dispose();
                        best_model.disposed = true;
                    } else {
                        best_model = model;
                    }
                    resolve({loss: -average_score,
                             results,
                             best_model,
                             status: hpjs.STATUS_OK});
                }
        };
        const train = (resolve) => {
            train_model(model,
                        tensor_datasets,
                        {epochs, 
                         learning_rate,
                         validation_split,
                         shuffle},
                        (results) => {
                            if (samples_remaining === 0) {
                                final_results(results, resolve);
                            } else {
                                sample_results(results, resolve);
                            }
                        },
                        (error) => {
                            if (error.message === not_a_number_error_message) {
                                resolve({loss: Number.MAX_VALUE,
                                         status: hpjs.STATUS_OK});
                            } else if (error_callback) {
                                invoke_callback(error_callback, error);
                            }
                        });
        };
        return new Promise(train);
    };
    record_callbacks(create_and_train_model, error_callback);
    optimize_hyperparameters_messages.innerHTML = ""; // starting anew
    best_model = undefined; // to be found
    lowest_loss = Number.MAX_VALUE;
    highest_accuracy = 0;
    highest_score = -Number.MAX_VALUE;
    metrics_of_highest_score = undefined;
    is_best_so_far = false;
    const space = {};
    const categories = get_data(model_name, 'categories');
    gui_state["Optimize"]["Number of experiments"] = number_of_experiments;
    gui_state["Optimize"]["Number of samples"] = number_of_samples;
    if (what_to_optimize) {
        what_to_optimize.forEach((use, index) => {
            gui_state["Optimize"][search_descriptions[index]] = use;
        });
    }
    if (scoring_weights) {
        scoring_weights.forEach((weight, index) => {
            gui_state["Optimize"][weight_descriptions[index]] = weight;   
        });
    }
    update_gui();
    if (to_boolean(gui_state["Optimize"]["Search for best Optimization method"])) {
        space.optimization_method = hpjs.choice(Object.values(optimization_methods));
    }
    if (to_boolean(gui_state["Optimize"]["Search for best loss function"])) {
        space.loss_function = hpjs.choice(Object.values(loss_functions(categories)));
    }
    if (to_boolean(gui_state["Optimize"]["Search for best activation function"])) {
        space.activation = hpjs.choice(activation_functions);
    }
    if (to_boolean(gui_state["Optimize"]["Search for best shuffle data setting"])) {
        space.shuffle = hpjs.choice([true, false]);
    }
    if (to_boolean(gui_state["Optimize"]["Search for best number of training iterations"])) {
        const current_epochs = Math.round(gui_state["Training"]["Number of iterations"]);
        const minimum = Math.max(1, Math.round(current_epochs/2));
        const maximum = current_epochs*2;
        const number_of_choices = 10;
        const increment = Math.max(1, Math.round((maximum-minimum)/number_of_choices)); 
        space.epochs = hpjs.quniform(minimum, maximum, increment);
    }
    if (to_boolean(gui_state["Optimize"]["Search for best validation split"])) {
        const current_validation_split = gui_state["Training"]["Validation split"];
        const minimum = current_validation_split < .05 ? 0 : current_validation_split/2;
        const maximum = Math.min(.95, current_validation_split*1.5+.1);
        space.validation_split = hpjs.uniform(minimum, maximum);
    }
    if (to_boolean(gui_state["Optimize"]["Search for best dropout rate"])) {
        const current_dropout_rate = gui_state["Model"]["Dropout rate"];
        const minimum = current_dropout_rate < .05 ? 0 : current_dropout_rate/2;
        const maximum = Math.min(.75, current_dropout_rate*1.5+.1);
        space.dropout_rate = hpjs.uniform(minimum, maximum);
    }
    if (to_boolean(gui_state["Optimize"]["Search for best learning rate"])) {
        const current_learning_rate = gui_state["Training"]["Learning rate"];
        const current_learning_rate_log = Math.log(current_learning_rate);
        const number_of_choices = 10;
        space.learning_rate = hpjs.qloguniform(current_learning_rate_log-1, current_learning_rate_log+1, current_learning_rate/number_of_choices);
    }
    if (to_boolean(gui_state["Optimize"]["Search for best number of layers"])) {
        const current_layers = get_layers();
        const choices = [];
        choices.push(current_layers); // unchanged
        choices.push([Math.round(current_layers[0]*(1+Math.random()))].concat(current_layers)); // add up to 2x first layer
        choices.push([current_layers[0]].concat(current_layers)); // add copy of first layer
        if (current_layers.length > 2) {
            choices.push(current_layers.slice(1)); // all but first
        }
        choices.push(current_layers.map((size, index) => { // increase by 1x to 2x all but size of last layer
            if (index < current_layers.length-1) {
               // not the last one
               return Math.round(size*(1+Math.random()));
            } else {
               return size;
            }
        }));
        choices.push(current_layers.map((size, index) => { // decrease by .5x to 1x all but size of last layer
            if (index < current_layers.length-1) {
               // not the last one
               return Math.max(1, Math.round(size/(1+Math.random())));
            } else {
               return size;
            }
        }));
        space.layers = hpjs.choice(choices);
    }
    try {
        const result = await hpjs.fmin(create_and_train_model,
                                       space,
                                       hpjs.search.randomSearch,
                                       number_of_experiments,
                                       {xs, ys, callbacks: {onExperimentBegin, onExperimentEnd}});
        return result;
    } catch (error) {
        if (error_callback) {
            invoke_callback(error_callback, error);
        }
    }
};

const cannonicalise_weights = (weights) => {
    const sum = weights.reduce((a, b) => a+b, 0);
    return weights.map(x => x/sum);
};

const compute_score = (weights, loss, accuracy, duration, size) => {
// console.log('score', -Math.log(loss)*weights[0]+10*(accuracy || 0)*weights[1]-Math.log(duration/100)*weights[2]-Math.log(size/1000)*weights[3],
//             'loss', -Math.log(loss)*weights[0], 'accuracy', 10*(accuracy || 0)*weights[1],
//             'duration', -Math.log(duration/100)*weights[2], 'size', -Math.log(size/1000)*weights[3]);
    return -Math.log(loss)*weights[0]+10*(accuracy || 0)*weights[1]-Math.log(duration/100)*weights[2]-Math.log(size/1000)*weights[3];
};

let report_error = function (error) {
    console.log(error); // for now
};

const add_to_data = (new_data, model_name, kind) => {
    let old_data = get_data(model_name, kind);
    if (!old_data) {
        return new_data;
    }
    return {input:  old_data.input .concat(new_data.input),
            output: old_data.output.concat(new_data.output)};
};

const gui_state = 
  // following inspired by https://github.com/johnflux/deep-learning-tictactoe/blob/master/play.py
  {"Model": {"Layers": "100, 50, 20, 1",
             "Optimization method": 'Stochastic Gradient Descent',
             "Loss function": 'Mean Squared Error',
             "Activation function": 'relu',
             "Dropout rate": 0.5},
   "Training": {"Learning rate": .001,
                "Number of iterations": 100,
                "Stop if no progress for number of iterations": 20,
                "Validation split": 0.2,
                "Shuffle data": true,
                "Graph minimum loss": 0,
                "Graph maximum loss": 0,
                "Graph width": 500,
                "Graph height": 300
                },
   "Predictions": {},
   "Optimize": {"Number of experiments": 10,
                "Number of samples": 3,
                "Search for best Optimization method": true,
                "Search for best loss function": true,
                "Search for best dropout rate": true,
                "Search for best activation function": true,
                "Search for best number of training iterations": true,
                "Search for best number of layers": true,
                "Search for best learning rate": true,
                "Search for best validation split": true,
                "Search for best shuffle data setting": true,
                "How much loss contributes to score": 10,
                "How much accuracy contributes to score": 10,
                "How much training time contributes to score": 1,
                "How much size of model contributes to score": 2,
                }
};

const create_parameters_interface = function () {
  const parameters_gui = new dat.GUI({width: 650,
                                      autoPlace: false});
  const settings_element = document.getElementById('settings');
  settings_element.appendChild(parameters_gui.domElement);
  settings_element.style.display = "block";
  parameters_gui.domElement.style.padding = "12px";
  return {model: create_model_parameters(parameters_gui),
          training: create_training_parameters(parameters_gui),
          optimize: create_hyperparameter_optimize_parameters(parameters_gui)};
};

const activation_functions =
    ['elu', 'hardSigmoid', 'linear', 'relu', 'relu6', 'selu', 'sigmoid', 'softmax', 'softplus', 'softsign', 'tanh'];

const create_model_parameters = (parameters_gui) => {
    const model = parameters_gui.addFolder("Model");
    model.add(gui_state["Model"], "Layers");
    model.add(gui_state["Model"], 'Optimization method', Object.keys(optimization_methods));
    if (model && get_data(model.name, 'categories')) {
        model.add(gui_state["Model"], 'Loss function', Object.keys(categorical_loss_functions));
    } else {
        model.add(gui_state["Model"], 'Loss function', Object.keys(non_categorical_loss_functions));
    }
    model.add(gui_state["Model"], 'Dropout rate');
    model.add(gui_state["Model"], 'Activation function', activation_functions);
    return model;  
};

const create_training_parameters = (parameters_gui) => {
    const training = parameters_gui.addFolder("Training");
    // sliders weren't helping and sometimes caused mysterious errors
    training.add(gui_state["Training"], 'Number of iterations'); //.min(1).max(1000);
    training.add(gui_state["Training"], 'Stop if no progress for number of iterations');
    training.add(gui_state["Training"], 'Learning rate'); //.min(.00001).max(1);
    training.add(gui_state["Training"], 'Validation split'); //.min(0).max(.999);
    training.add(gui_state["Training"], 'Shuffle data', [true, false]);
    training.add(gui_state["Training"], 'Graph minimum loss');
    training.add(gui_state["Training"], 'Graph maximum loss');
    training.add(gui_state["Training"], 'Graph width');
    training.add(gui_state["Training"], 'Graph height');
    return training;
};

const create_hyperparameter_optimize_parameters = (parameters_gui) => {
    const optimize = parameters_gui.addFolder("Optimize");
    optimize.add(gui_state["Optimize"], 'Number of experiments');
    optimize.add(gui_state["Optimize"], 'Number of samples');
    optimize.add(gui_state["Optimize"], 'Search for best Optimization method', [true, false]);
    optimize.add(gui_state["Optimize"], 'Search for best loss function', [true, false]);
    optimize.add(gui_state["Optimize"], 'Search for best dropout rate', [true, false]);
    optimize.add(gui_state["Optimize"], 'Search for best activation function', [true, false]);
    optimize.add(gui_state["Optimize"], 'Search for best number of training iterations', [true, false]);
    optimize.add(gui_state["Optimize"], 'Search for best number of layers', [true, false]);
    optimize.add(gui_state["Optimize"], 'Search for best learning rate', [true, false]);
    optimize.add(gui_state["Optimize"], 'Search for best validation split', [true, false]);
    optimize.add(gui_state["Optimize"], 'Search for best shuffle data setting', [true, false]);
    optimize.add(gui_state["Optimize"], "How much loss contributes to score");
    optimize.add(gui_state["Optimize"], "How much accuracy contributes to score");
    optimize.add(gui_state["Optimize"], "How much training time contributes to score");
    optimize.add(gui_state["Optimize"], "How much size of model contributes to score");
    return optimize;
};

let parameters_gui;

const parameters_interface = function (interface_creator) {
  if (!parameters_gui) {
      parameters_gui = interface_creator();
  }
  return parameters_gui;
};

let create_model_with_current_settings_button;

const get_layers = () => {
  const quote_non_numeric_layers = (layers) => {
      const parts = layers.split(',');
      return parts.map(layer => {
          layers = layers.trim(); // remove extraneous white space
          if (layer.indexOf(' ') < 0) {
              return layer;
          } else {
              return '"' + layer + '"';
          }
      });
  };
  try {
       let json = quote_non_numeric_layers(gui_state["Model"]["Layers"]);
       return JSON.parse('[' + json + ']');
  } catch (error) {
       alert("Layers should a list of whole numbers separated by commas or numbers followed by an activation function name.");
       return;
  }
};

const create_model_with_parameters = function (surface_name) {
    const surface = tfvis.visor().surface({name: surface_name, tab: 'Model'});
    const draw_area = surface.drawArea;
    parameters_interface(create_parameters_interface).model.open();
    let name_input;
    let message;
    const create_model_with_current_settings = () => {
        let hidden_layer_sizes = get_layers();
        const model_name = name_input.value;
        const optimizer_full_name = gui_state["Model"]["Optimization method"];
        const optimizer = optimizer_named(optimizer_full_name);
        const loss_function_full_name = gui_state["Model"]["Loss function"];
        const loss_function = loss_function_named(loss_function_full_name);
        const datasets = get_data(model_name, 'datasets');
        try {
            model = create_model({model_name, hidden_layer_sizes, optimizer, loss_function, datasets});
            tensorflow.add_to_models(model);
        } catch (error) {
            message.innerHTML = error.message;
            report_error(error);
            return;
        }
        if (train_button) {
            train_button.disabled = false;
        }
        let html = "<br>A new model named '" + name + "' created and it is ready to be trained.";
        if (get_model(name)) {
            html += "<br>It replaces the old model of the same name.";
        }
        html += "<br>Its optimization method is '" + optimizer_full_name + "'.";
        html += "<br>Its loss function is '" + loss_function_full_name + "'.";
        model.summary(50, // line length
                      undefined,
                      (line) => {
                        html += "<br>" + line;
                      });
        message.innerHTML = html;
    };
    if (create_model_with_current_settings_button) {
        tfvis.visor().setActiveTab('Model');
    } else {
        name_input = document.createElement('input');
        name_input.type = 'text';
        name_input.id = "name_element";
        name_input.name = "name_element";
        name_input.value = model ? model.name : 'my-model';
        const label = document.createElement('label');
        label.for = "name_element";
        label.innerHTML = "Name of model: ";
        const div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(name_input);
        draw_area.appendChild(div);
        create_model_with_current_settings_button = 
            create_button("Create model with current settings", create_model_with_current_settings);
        draw_area.appendChild(create_model_with_current_settings_button);
        message = document.createElement('p');
        draw_area.appendChild(message);        
    }
    return model;
};

let train_with_current_settings_button;

const train_with_parameters = async function (surface_name) {
  const surface = tfvis.visor().surface({name: surface_name, tab: 'Training'});
  const draw_area = surface.drawArea;
  const train_with_current_settings = async function (model_name) {
    let message = document.createElement('p');
    let success_callback = (training_statistics) => {
        const final_epoch = training_statistics["Last epoch"];
        const loss = training_statistics["Training loss"];
        const accuracy = training_statistics["Training accuracy"];
        const validation_loss = training_statistics["Validation loss"];
        const lowest_validation_loss = training_statistics["Lowest validation loss"];
        const validation_accuracy = training_statistics["Validation accuracy"];
        message.innerHTML = "<br>Training " + model_name + " took " + training_statistics["Duration in seconds"].toFixed(2) + " seconds. ";
        if (isNaN(loss)) {
            message.innerHTML += "Training failed because some numbers became too large for the system. " +
                                 "This can be caused by many different things. " +
                                 "Try different optimization methods, loss functions, or convert the input data to numbers between -1 and 1. " +
                                 "Often the problem is due to <a href='https://en.wikipedia.org/wiki/Vanishing_gradient_problem' target='_blank'>vanishing gradients</a>.";
        } else {
            if (final_epoch < epochs-1) {
                message.innerHTML += "<br>There was no progress for " + stop_if_no_progress_for_n_epochs + " cycles so training stopped.";
            }
            message.innerHTML += "<br>Final error rate for training data is " + loss.toFixed(3) + ".";
            if (validation_loss) {
                message.innerHTML += "<br>Final validation data error is " + validation_loss.toFixed(3) + ".";
                if (validation_loss !== lowest_validation_loss) {
                    message.innerHTML += " The lowest validation error was " + lowest_validation_loss.toFixed(3) +  "." +
                                         " Using the trained model from cycle " + training_statistics["Lowest validation loss epoch"] +  ".";
                }
                if (validation_loss > 100) { 
                    message.innerHTML += " With such a high validation loss the model predictions are likely to be poor. " +
                                         " You might be able to fix this with more data, different sizes for the model's layers, or other settings.";
                }
            }
            if (accuracy) {
                message.innerHTML += "<br>Training data accuracy is " + accuracy.toFixed(3) + ".";
            }
            if (validation_accuracy) {
                message.innerHTML += "<br>Validation data accuracy is " + validation_accuracy.toFixed(3) + ".";
                if (validation_accuracy !== training_statistics["Highest validation accuracy"]) {
                    message.innerHTML += " The highest validation accuracy was " + training_statistics["Highest accuracy"] +  "." +
                                         " Using the trained model from cycle " + training_statistics["Highest accuracy epoch"] +  ".";
                }
            }
        }
        enable_evaluate_button();   
    };
    let error_callback = (error) => {
        message.innerHTML = "<br><b>Error:</b> " + error.message + "<br>";
    };
    record_callbacks(success_callback, error_callback);
    const epochs = Math.round(gui_state["Training"]["Number of iterations"]);
    const stop_if_no_progress_for_n_epochs = gui_state["Training"]["Stop if no progress for number of iterations"];
    draw_area.appendChild(message);
    let training_data   = get_data(model_name, 'training');
    let validation_data = get_data(model_name, 'validation');
    if (!training_data || !training_data.input) {
        invoke_callback(error_callback,
                        new Error("Cannot begin training before creating or loading training data."));
        return;
    }
    if (train_with_current_settings_button.firstChild.nextSibling) {
        // if there was an old message remove it
        train_with_current_settings_button.firstChild.nextSibling.remove();
    }
    message.innerHTML = "<br>Training started. Training data is " + training_data.input.length + " long";
    if (validation_data) {
        message.innerHTML += " and validation data is " + validation_data.input.length + " long";
    }
    message.innerHTML += ". Please wait.";
    setTimeout(async function () {
        // without the timeout the message above isn't displayed
        const categories = get_data(model_name, 'categories');
        const graph_minimum = gui_state["Training"]["Graph minimum loss"];
        const graph_maximum = gui_state["Training"]["Graph maximum loss"];
        const width = gui_state["Training"]["Graph width"];
        const height = gui_state["Training"]["Graph height"];
        const yAxisDomain = graph_minimum === graph_maximum ? undefined : [graph_minimum, graph_maximum];
        await train_model(get_model(model_name),
                          get_data(model_name, 'datasets'),
                          {epochs,
                           stop_if_no_progress_for_n_epochs,
                           learning_rate: gui_state["Training"]["Learning rate"],
                           validation_split: gui_state["Training"]["Validation split"],
                           shuffle: to_boolean(gui_state["Training"]["Shuffle data"]),
                           tfvis_options: {callbacks: ['onEpochEnd'],
                                           yAxisDomain,
                                           width,
                                           height,
                                           measure_accuracy: !!categories,
                                           display_graphs: true,
                                           display_layers: true,
                                           display_confusion_matrix: !!categories},
                           },
                          success_callback,
                          error_callback);

    });
  };
  const create_model_menu = (click_handler) => {
      const menu = document.createElement('ul');
      const model_names = Object.keys(models);
      model_names.forEach((name) => {
          const menu_item = create_button("Train <b>" + name + "</b> with current settings",
                                          () => {
                                              menu.remove();
                                              draw_area.insertBefore(train_with_current_settings_button,
                                                                     draw_area.firstChild);
                                              click_handler(name);
                                          });
          menu.appendChild(menu_item);
      });
      return menu;
  };
  parameters_interface(create_parameters_interface).training.open();
  if (train_with_current_settings_button) {
      tfvis.visor().setActiveTab('Training');
  } else {
      const display_model_menu = function () {
          const model_names = Object.keys(models);
          if (model_names.length === 0) {
              train_with_current_settings_button.appendChild(create_message_element("No models created yet."))
          } else if (model_names.length === 1) {
              train_with_current_settings(model_names[0]);
          } else {
              let menu = create_model_menu(train_with_current_settings);
              draw_area.insertBefore(menu, train_with_current_settings_button);
              train_with_current_settings_button.remove();
          }
      };
      train_with_current_settings_button = create_button("Train a model with current settings", display_model_menu);
      draw_area.appendChild(train_with_current_settings_button);
  }
};

const create_message_element = (html) => {
    const message = document.createElement('p');
    message.innerHTML = html;
    return message;
};

const create_prediction_interface = () => {
    const surface = tfvis.visor().surface({name: 'Tensorflow', tab: 'Prediction'});
    const draw_area = surface.drawArea;
    if (document.getElementById('prediction-input')) {
        tfvis.visor().setActiveTab('Prediction');
        return;
    }
    const input_element = document.createElement('input');
    input_element.type = 'text';
    input_element.id = "prediction-input";
    input_element.name = "prediction-input";
    input_element.value = 1;
    const label = document.createElement('label');
    label.for = "input_element";
    label.innerHTML = "Input for prediction: ";
    const div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(input_element);
    draw_area.appendChild(div);
    const make_prediction = (model_name) => {
        const success_callback = (results) => {
            const categories = get_data(model_name, 'categories');
            if (categories) {
                results = JSON.stringify(results);
            } else if (input_element.value.indexOf('[') < 0) {
                results = results[0]; // only one number in inputs so only one result
            } else {
                results = "[" + results + "]";
            }
            const message = create_message_element("<br>The " + model_name + " model predicts " + results + 
                                                   "<br>for input " + input_element.value + ".");
            draw_area.appendChild(message);
        };
        const error_callback = (error_message) => {
            draw_area.appendChild(create_message_element(error_message));
        };
        record_callbacks(success_callback, error_callback);
        try {
            let inputs = +input_element.value || JSON.parse(input_element.value);
            if (typeof inputs === 'number') {
                inputs = [inputs];
            }
            predict(get_model(model_name), 
                    inputs,
                    success_callback, error_callback,
                    get_data(model_name, 'categories'));
        } catch (error) {
            invoke_callback(error_callback, enhance_error_message(error.message));
        }
    };
    const choose_model_then_make_prediction = () => {
        const model_names = Object.keys(models);   
        const create_model_menu = (click_handler) => {
            const menu = document.createElement('ul');    
            model_names.forEach((name) => {
                const menu_item = create_button("Make prediction using model " + name,
                                                () => {
                                                    menu.remove();
                                                    draw_area.insertBefore(prediction_button,
                                                                           draw_area.firstChild.nextSibling);
                                                    click_handler(name);
                                                });
                menu.appendChild(menu_item);
            });
            return menu;
        };
        if (model_names.length === 1) {
            make_prediction(model_names[0]);
        } else {
            let menu = create_model_menu(make_prediction);
            draw_area.insertBefore(menu, prediction_button);
            prediction_button.remove(); 
        }
    };
    const prediction_button = create_button("Make prediction", choose_model_then_make_prediction);
    draw_area.appendChild(prediction_button);
};

let save_model_button;
let load_model_button;
let save_data_button;

const save_and_load = function () {
    const surface = tfvis.visor().surface({name: 'Tensorflow', tab: 'Save/Load'});
    const draw_area = surface.drawArea;
    if (save_model_button) {
        tfvis.visor().setActiveTab('Save/Load');
        return; // already set up 
    }
    draw_area.innerHTML = ""; // reset if rerun
    const create_model_menu = (click_handler) => {
        const menu = document.createElement('ul');
        const model_names = Object.keys(models);
        model_names.forEach((name) => {
            const menu_item = create_button("Save " + name,
                                            () => {
                                                menu.remove();
                                                draw_area.insertBefore(save_model_button,
                                                                       draw_area.firstChild);
                                                click_handler(name);
                                            });
            menu.appendChild(menu_item);
        });
        return menu;
    };
    const select_model_to_save = () => {
        const model_names = Object.keys(models);
        if (model_names.length === 1) {
            save_model(model_names[0]);
        } else {
            let menu = create_model_menu(save_model);
            draw_area.insertBefore(menu, save_model_button);
            save_model_button.remove();    
        }
    };
    save_model_button = create_button("Save a trained model", select_model_to_save);
    draw_area.appendChild(save_model_button);
    load_model_button = create_button("Load a trained model", load_model);
    draw_area.appendChild(load_model_button);
    const file_input = function(label, id) {
        const div = document.createElement('div');
        const label_element = document.createElement('label');
        const input_element = document.createElement('input');
        label_element.for = id;
        label_element.innerHTML = label;
        input_element.type = 'file';
        input_element.id = id;
        input_element.name = id;
        div.appendChild(label_element);
        div.appendChild(input_element);
        div.style.padding = "12px";
        return div;
    };
    const json_file_input    = file_input('Saved model JSON file: ', 'saved_json');
    const weights_file_input = file_input('Saved model weights file: ', 'saved_weights');
    json_file_input.title = "Before clicking 'Load a trained model' select the JSON file created when the desired model was saved.";
    weights_file_input.title = "Before clicking 'Load a trained model' select the weights file created when the desired model was saved.";
    draw_area.appendChild(json_file_input);
    draw_area.appendChild(weights_file_input);
    const create_anchor_that_looks_like_a_button = (label, class_name, listener) => {
        let button = document.createElement('a');
        button.innerHTML = label;
        button.className = class_name;
        button.href = "#";
        button.addEventListener('click', listener);
        return button;
    };
    save_data_button = 
        {training: 
            create_anchor_that_looks_like_a_button("Save training data",
                                                   "save-training-button", 
                                                   () => save_data('all models', 'training')),
         validation:
             create_anchor_that_looks_like_a_button("Save validation data",
                                                    "save-validation-button",
                                                    () => save_data('all models', 'validation'))};
    draw_area.appendChild(save_data_button.training);
    draw_area.appendChild(save_data_button.validation);
    let load_training_data_input = file_input("Load training data file: ", 'load_training_data');
    load_training_data_input.title = "Select the saved data that will be used to train a model.";
    load_training_data_input.onchange = make_load_data_listener('training', 'all models');
    const load_data_message = {training:   document.createElement('div'),
                               validation: document.createElement('div')};
    let load_validation_data_input = file_input("Load validation data file: ", 'load_validation_data');
    load_validation_data_input.title = "Select the saved data that will be used to evaluate the progress on each training step when computing the loss."
    load_validation_data_input.onchange = make_load_data_listener('validation', 'all models');
    draw_area.appendChild(load_training_data_input);
    draw_area.appendChild(load_data_message.training);
    draw_area.appendChild(load_validation_data_input);
    draw_area.appendChild(load_data_message.validation);
};

const save_model = async function (model_name) {
    let URL = 'downloads://' + model_name;
    return await models[model_name].save(URL);
};

const load_model = async function () {
  const saved_model_element = document.getElementById('saved_json');
  const saved_weights_element = document.getElementById('saved_weights');
  if (!saved_model_element.files[0] || !saved_weights_element.files[0]) {
      let message = document.createElement('p');
      message.innerHTML = "Please choose files below and then click this again.";
      replace_button_results(load_model_button, message);
      return;
  }
  try {
      model = await tf.loadLayersModel(tf.io.browserFiles([saved_model_element.files[0],
                                                           saved_weights_element.files[0]]));
  } catch (error) {
      replace_button_results(load_model_button, create_message_element(error.message));
      return;
  }
  let message = document.createElement('p');
  const model_name = saved_model_element.files[0].name.substring(0, saved_model_element.files[0].name.length-".json".length);
  message.innerHTML = model_name + " loaded and ready to evaluate.";
  model.name = model_name;
//   model.ready_for_training = true; -- must be compiled to do more training
  model.ready_for_prediction = true;
  if (models[name]) {
      message.innerHTML += "<br>Replaced a model with the same name.";
  }
  tensorflow.add_to_models(model);
  replace_button_results(load_model_button, message);  
  // to add more data enable these options
  create_model_button.disabled = false;
  enable_evaluate_button();
};

const enable_evaluate_button = () => {
    let evaluate_button = document.getElementById('evaluate');
    if (evaluate_button) {
        evaluate_button.disabled = false;    
    }
};

const save_data = (model_name, kind) => {
    let data = get_data(model_name, kind);
    if (!data) {
        alert('No "' + kind + '" data created or loaded.');
        return;
    }
    const file = new Blob([JSON.stringify(data)], {type: 'text'});
    save_data_button[kind].href = URL.createObjectURL(file);
    save_data_button[kind].download = kind + ' data.json';
};

const make_load_data_listener = (kind, model_name) => {
    return (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const json = reader.result;
            let message;
            try {
                let data = JSON.parse(json);
                message = "Loaded '" + file.name + "'. (" + data.input.length + " data items).";
                set_data(model_name, kind, data);
            } catch (error) {
                message = "Error interpreting the data in " + file.name + ". Error: " + error.message;
            }
            load_data_message[kind].innerHTML = message;
        }
        reader.readAsText(file);
    };
};

let create_button = function (label, click_handler) {
    const button = document.createElement('button');
    button.innerHTML = label;
    button.className = "support-window-button";
    if (click_handler) {
        button.addEventListener('click', click_handler);
    }
    button.id = label; // for ease of replacing it with a newer version
    return button;
};

const replace_button_results = function(element, child) {
    if (element.firstChild.nextSibling) {
        element.firstChild.nextSibling.remove();
    }
    element.appendChild(child);
};

const to_boolean = (x) => x === true || x === 'true';

let create_model_button, save_and_load_model_button, train_button, optimize_hyperparameters_interface_button, evaluate_button;

window.addEventListener('DOMContentLoaded',
                        () => {
                            create_model_button = document.getElementById('create_model');
                            save_and_load_model_button = document.getElementById('save_and_load');
                            train_button = document.getElementById('train');
                            optimize_hyperparameters_interface_button = document.getElementById('optimize');
                            evaluate_button = document.getElementById('evaluate');
                            create_model_button.addEventListener('click', 
                                                                 () => {
                                                                      create_model_with_parameters('Tensorflow');
                                                                 });
                            train_button.addEventListener('click',
                                                          () => {
                                                              train_with_parameters('Tensorflow');
                                                          });
                            optimize_hyperparameters_interface_button.addEventListener('click',
                                                          () => {
                                                              create_hyperparameter_optimization_tab(model);
                                                          });
                            evaluate_button.addEventListener('click', create_prediction_interface);
                            save_and_load_model_button.addEventListener('click', save_and_load);             
                            // not waiting for anything so loaded and ready are the same
                            window.parent.postMessage("Loaded", "*");
                            if (window !== window.parent) {
                                window.postMessage("Loaded", "*"); // for other files to react (e.g. test.js)
                            }
                            window.parent.postMessage("Ready", "*");
                        });

const contents_of_URL = (URL, success_callback, error_callback) => {
    record_callbacks(success_callback, error_callback);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.onreadystatechange = (event) => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            invoke_callback(success_callback, xhr.responseText);
        } else if (xhr.status >= 400) {
            invoke_callback(error_callback, new Error("Received error code " + xhr.status + "."));
        }
    };
    xhr.onerror = error_callback;
    xhr.send();
};

const receive_message =
    async (event) => {
        if (window.stopped_prematurely) {
            return;
        }
        let message = event.data;
        if (message === 'stop') {
            stop_all();
        } else if (typeof message.data !== 'undefined') {
            try {
                const kind = message.kind;
                const model_name = message.model_name || 'all models';
                const callback = () => {
                    event.source.postMessage({data_received: message.time_stamp}, "*"); 
                };
                if (message.ignore_old_dataset) {
                    set_data(model_name, kind, message.data);
                } else {
                    set_data(model_name, kind, add_to_data(message.data, model_name, kind));
                }
                invoke_callback(callback);
            } catch (error) {
                event.source.postMessage({data_message_failed: message.data,
                                          error_message: error.message}, "*");
            }
        } else if (typeof message.create_model !== 'undefined') {
            try {
                const options = message.create_model;
                const model_name = message.create_model.model_name;
                options.class_names = get_data(model_name, 'categories');
                if (options.loss_function === true) {
                    options.loss_function = default_loss_function(options.class_names);
                }
                options.loss_function = loss_function_named(options.loss_function);
                options.optimizer = optimizer_named(options.optimizer);
                options.datasets = get_data(model_name, 'datasets');   
                const model = create_model(options);
                install_settings(options);
                tensorflow.add_to_models(model);
                let description = [];
                model.summary(50, // line length
                              undefined,
                              (line) => {
                                  description.push(line);
                              });
                event.source.postMessage({model_created: model_name,
                                          description: description}, "*");
            } catch (error) {
                console.log(error);
                event.source.postMessage({create_model_failed: message.create_model.model_name,
                                          error_message: error.message}, "*");
            }
        } else if (typeof message.train !== 'undefined') {
            const success_callback = (information) => {
                // only post string and number values
                const concise_information = {};
                Object.entries(information).forEach(entry => {
                    const type = typeof entry[1];
                    if (type === 'number' || type === 'string') {
                        concise_information[entry[0]] = entry[1];
                    }
                });
                event.source.postMessage({training_completed: message.train.time_stamp,
                                          information: concise_information}, "*");
                enable_evaluate_button();
            };
            const error_callback = (error_message) => {
                if (typeof error_message === 'object') {
                    error_message = error_message.message;
                }
                event.source.postMessage({training_failed: message.train.time_stamp,
                                          error_message: error_message}, "*");
            };
            record_callbacks(success_callback, error_callback);
            let model_name = message.train.model_name;
            install_settings(message.train);
            const options = message.train;
            if (get_data(model_name, 'categories')) {
                options.tfvis_options.measure_accuracy = true;
            }
            train_model(get_model(model_name),
                        get_data(model_name, 'datasets'),
                        options,                         
                        success_callback,
                        error_callback);
        } else if (typeof message.predict !== 'undefined') {
            let results = [];
            const average_results = () => {
                if (typeof results[0] === 'number') {
                    let average = 0;
                    results.forEach(result => {
                        average += result/results.length;
                    });
                    return average;
                }
                if (categories) {
                    return average_categorical_results();
                }
                const averages = results[0].map(() => 0);
                results.forEach((result) => {
                    result.forEach((prediction, index) => {
                        averages[index] += prediction/results.length;
                    });                        
                });
                return averages;     
            }
            const average_categorical_results = () => {
                const keys = Object.keys(results[0][0]);
                const sums = results[0].map(scoring => {
                    const new_scoring = {};
                    keys.map(key => {
                        new_scoring[key] = 0;
                    });
                    return new_scoring;
                });
                results.forEach(result => {
                    result.forEach((next_scoring, scoring_index) => {
                        keys.forEach(key => {
                            sums[scoring_index][key] += next_scoring[key]/results.length;
                        });
                    }) 
                });
                return sums;
            };
            const success_callback = (result) => {
                results.push(result);
                if (results.length === model_names.length) {
                    event.source.postMessage({prediction: message.predict.time_stamp,
                                              result: average_results()}, "*");
                }
            };
            const error_callback = (error_message) => {
                event.source.postMessage({prediction_failed: message.predict.time_stamp, 
                                          error_message: error_message}, "*");
            };
            record_callbacks(success_callback, error_callback);
            let model_names = message.predict.model_names;
            if (typeof model_names === 'string') {
                model_names = [model_names];
            }
            const categories = message.predict.categories || get_data(model_names[0], 'categories');
            model_names.forEach(model_name => {
                const model = get_model(model_name);
                if (!model) {
                    invoke_callback(error_callback, 
                                    "Prediction not possible since there is no model named '" + model_name + "'.");
                    return;
                }
                predict(model, 
                        message.predict.input,
                        success_callback,
                        error_callback,
                        categories);
            });
        } else if (typeof message.is_model_ready_for_prediction !== 'undefined') {
            let name = message.is_model_ready_for_prediction.model_name;
            let model = models[name];
            let ready;
            if (model) {
                ready = !!model.ready_for_prediction; 
            } else {
//                 event.source.postMessage({error: "Unknown model '" + name + "' asked if ready for predictions."}, "*");
                ready = false; // unknown model is not ready
            }
            event.source.postMessage({ready_for_prediction: ready,
                                      model_name: name}, "*"); 
        } else if (typeof message.load_model_from_URL !== 'undefined') {
            try {
                let URL = message.load_model_from_URL;
                const error_callback = (error) => {
                    let error_message = error.message;
                    if (error_message.indexOf('in JSON at position 0') >= 0) {
                        // replace it with a clearer error message
                        error_message = 'Either the URL is incorrect or is not in JSON format.';
                    }
                    event.source.postMessage({error_loading_model: URL,
                                              error_message: 'Error reading ' + URL + ' to load a neural net. ' +
                                                             error_message}, "*");
                }
                tf.loadLayersModel(URL).then((model) => {
                                           model.ready_for_prediction = true;
                                           model.ready_for_training = true;
                                           // until https://github.com/tensorflow/tfjs/issues/885 is resolved need to update the name
                                           let name = URL.substring(URL.lastIndexOf('/')+1, URL.lastIndexOf('.'));
                                           model.name = name;
                                           tensorflow.add_to_models(model);
                                           enable_evaluate_button();
                                           event.source.postMessage({model_loaded: URL,
                                                                     model_name: name}, "*");
//                                            model.compile({loss: 'meanSquaredError', optimizer: 'adamax'});
                                           show_layers(model, 'Model after loading');
                                       },
                                       error_callback);
            } catch (error) {
                invoke_callback(error_callback, error);
            }
        } else if (typeof message.load_data_from_URL !== 'undefined') {
            let URL = message.load_data_from_URL;
            let kind = message.kind; // training or validation data
            let model_name = message.model_name || 'all models';
            const success_callback = (text) => {
                try {
                    let new_data = JSON.parse(text);
                    let info = new_data.input.length + ' data items loaded.';
                    if (message.add_to_previous_data) {
                        set_data(model_name, kind, add_to_data(new_data, model_name, kind));
                        info += ' Total is now ' + get_data(model_name, kind).input.length + '.';
                    } else {
                        set_data(model_name, kind, new_data);
                    } 
                    event.source.postMessage({data_loaded: URL,
                                              info: info}, "*");
                } catch (error) {
                    invoke_callback(error_callback, error);
                }
            };
            const error_callback = (error) => {
                event.source.postMessage({error_loading_data: URL,
                                          error_message: "Error loading data from " + URL + ". " + 
                                                         error.message}, "*");
            };
            record_callbacks(success_callback, error_callback);
            contents_of_URL(URL, success_callback, error_callback);
        } else if (typeof message.optimize_hyperparameters !== 'undefined') {
            let number_of_experiments = message.number_of_experiments;
            let epochs = message.epochs;
            let model_name = message.model_name || 'all models';
            const categories = get_data(model_name, 'categories');
            let time_stamp = message.time_stamp;
            const success_callback = (result) => {
                if (!result) {
                    error_callback(new Error("No results from search."));
                    return;
                }
                const best_parameters = result.argmin;
                best_parameters.input_shape = shape_of_data((get_data(model_name, 'training') || get_data(model_name, 'validation')).input[0]);
                best_parameters.optimization_method = inverse_lookup(best_parameters.optimization_method, optimization_methods);
                best_parameters.loss_function       = inverse_lookup(best_parameters.loss_function, loss_functions(categories));
                // So validation data is used when creating and training the model with the best parameters.
                best_parameters.used_validation_data = !!get_data(model_name, 'validation');
                if (lowest_loss > 0) {
                    best_parameters.lowest_loss = lowest_loss;
                }
                if (highest_accuracy > 0) {
                    best_parameters.highest_accuracy = highest_accuracy;
                }
                if (highest_score > 0) {
                    best_parameters.highest_score = highest_score;
                    best_parameters.metrics = metrics_of_highest_score;
                }
                const model = result.best_model;
                add_to_models(model);
                model.best_model = model;
                model.best_parameters = best_parameters;
                event.source.postMessage({optimize_hyperparameters_time_stamp: time_stamp,
                                          final_optimize_hyperparameters: best_parameters},
                                         "*");
            };
            const experiment_end_callback = (n, trial) => {
                let parameters = trial.args;
                parameters.optimization_method = inverse_lookup(parameters.optimization_method, optimization_methods);
                parameters.loss_function       = inverse_lookup(parameters.loss_function, loss_functions(categories));
                parameters.is_best_so_far      = is_best_so_far;
                event.source.postMessage({optimize_hyperparameters_time_stamp: time_stamp,
                                          trial_number: n,
                                          trial_optimize_hyperparameters: parameters,
                                          trial_score: trial.result.loss,
                                          is_best_so_far},
                                          "*");
            }
            const error_callback = (error) => {
                console.log(error);
                event.source.postMessage({optimize_hyperparameters_time_stamp: time_stamp,
                                          error_message: "Error while optimizing hyperparameters. " + 
                                                         error.message},
                                          "*");
            };
            record_callbacks(success_callback, error_callback, experiment_end_callback);
            optimize_hyperparameters(model_name, number_of_experiments, epochs,
                                     experiment_end_callback, success_callback, error_callback,
                                     message.what_to_optimize,
                                     message.scoring_weights,
                                     message.number_of_samples);
        } else if (typeof message.replace_with_best_model !== 'undefined') {
            const model_name = message.replace_with_best_model;
            replace_with_best_model(model_name,
                                    (parameters) => {
                                        event.source.postMessage({model_replaced: model_name,
                                                                  parameters});
                                    },
                                    (error_message) => {
                                        event.source.postMessage({error_replacing_model: model_name,
                                                                  error_message});
                                    });
        }
};

const replace_with_best_model = (name_of_model_used_in_search, success_callback, error_callback) => {
    const model = get_model(name_of_model_used_in_search);
    let error_message;
    if (!model) {
        error_message = "No model named '" + name_of_model_used_in_search + "' found.";
    } else if (!model.best_model) {
        error_message = "No model found by searching for better parameters for model '" + 
                        name_of_model_used_in_search +
                        "' to replace it."; 
    }
    if (error_message) {
        if (error_callback) {
            invoke_callback(error_callback, error_message);
            return;
        }
        throw new Error(error_message);        
    }
    add_to_models(model.best_model);
    install_settings(model.best_parameters);
    show_layers(model.best_model, 'Model found by parameter search');
    if (success_callback) {
        invoke_callback(success_callback, model.best_parameters);
    }
};

window.addEventListener('message', receive_message);

return {get_model: get_model, 
        add_to_models: add_to_models,
        models: () => models,
        get_data: get_data,
        set_data: set_data,
        add_to_data: add_to_data,
        create_model: create_model,
        train_model: train_model,
        predict: predict,
        gui_state: gui_state,
        parameters_interface: parameters_interface,
        create_model_parameters: create_model_parameters,
        create_model_with_parameters: create_model_with_parameters,
        create_training_parameters: create_training_parameters,
        create_hyperparameter_optimize_parameters: create_hyperparameter_optimize_parameters,
        train_with_parameters: train_with_parameters,
        create_hyperparameter_optimization_tab: create_hyperparameter_optimization_tab,
        save_and_load: save_and_load,
        create_button: create_button,
        replace_with_best_model: replace_with_best_model,
        replace_button_results: replace_button_results};
}()));
