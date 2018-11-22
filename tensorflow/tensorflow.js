// Machine learning using Tensorflow.js as part of the eCraft2Learn Snap! library
// Written by Ken Kahn 
// No rights reserved.

window.tensorflow = 
((function () {

let models = {};
const get_model = (name) => models[name];

let model; // used for defaults such as model name when creating a model

let data = {}; // training and validation data either for "all models" or named models
const get_data = (model_name, kind) => {
    if (typeof data[model_name] === 'undefined') {
        if (model_name !== 'all models') {
            return get_data('all models', kind);
        }
        return;
    }
    if (typeof data[model_name][kind] === 'undefined') {
        return;
    }
    return data[model_name][kind];
};
const set_data = (model_name, kind, value) => {
    if (typeof data[model_name] === 'undefined') {
        data[model_name] = {};
    }
    data[model_name][kind] = value;
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
    if (name === 'Momentum') {
        return  tf.train.momentum((learning_rate || .01), .9);
    }
    return optimization_methods[name] || name;
};

const loss_functions = 
    {"Absolute Distance": "absoluteDistance",
     "Compute Weighted Loss": "computeWeigghtedLoss",
     "Cosine Distance": "cosineDistance",
     "Hinge Loss": "hingeLoss",
     "Huber Loss": "huberLoss",
     "Log Loss": "logLoss",
     "Mean Squared Error": "meanSquaredError",
     "Sigmoid Cross Entropy": "sigmoidCrossEntropy",
     "Softmax Cross Entropy": "softmaxCrossEntropy"};

const loss_function_named = (name) => {
    return loss_functions[name] || name;
};

const add_to_models = function (new_model) {
    models[new_model.name] = new_model;
    model = new_model; // is now the current model
    train_button.disabled = false;
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

const create_model = function (name, layers, optimizer_full_name, input_shape, options) {
    if (!input_shape && !get_data(name, 'training') && !get_data(name, 'validation')) {
        throw new Error("Cannot create a model before knowing what the data is like.\nProvide at least one example of the data.");
    }
    const optimizer = optimizer_named(optimizer_full_name);
    if (!optimizer) {
        throw new Error("Could not recognise '" + optimizer_full_name + "' as an optimizer.");
    }
    if (typeof options !== 'object') {
        options = {}; // none
    }
    const model = tf.sequential({name: name});
    model.ready_for_training = false;
    tensorflow.add_to_models(model); // using tensorflow.add_to_models incase it has been extended
    layers.forEach((size, index) => {
        if (size > 0) {
            let configuration = {units: size,
                                 useBias: index !== layers.length-1}; // except for last layer
            if (index !== layers.length-1) {
                // all but the last one has an activation function
                configuration.activation = 'relu';
            }                   
            if (index === 0) { // first one needs inputShape
                configuration.inputShape = input_shape ||
                                           shape_of_data((get_data(name, 'training') || get_data(name, 'validation')).input[0]);    
            }
            model.add(tf.layers.dense(configuration));
        }
    });
    if (!optimizer) {
        optimizer = 'adam';
    }
    let loss_function = loss_function_named((options.loss || 'meanSquaredError'));
    model.compile({loss: loss_function,
                   optimizer: optimizer,
                   metrics: ['accuracy']
                  });
    gui_state["Model"]["Optimization method"] = optimizer_full_name;
    if (options.loss) {
        gui_state["Model"]["Loss function"] = options.loss
    }
    model.ready_for_training = true;
    if (model.callback_when_ready_for_training) {
        model.callback_when_ready_for_training();
        model.callback_when_ready_for_training = undefined;
    }
    return model;
};

const train_model = async (model_or_model_name, training_data, validation_data, options,
                           use_tfjs_vis, success_callback, error_callback) => {
    // validation_data is optional - if provided not used for training only calculating loss
    if (!model_or_model_name) {
        model_or_model_name = model; // current model (if there is one)
    }
    if (!model_or_model_name) {
        error_callback({message: "No model or name provided to train model."});
        return;
    }
    if (typeof model_or_model_name === 'string') {
        model = models[model_or_model_name];
        if (!model) {
            error_callback({message: "No model named '" + model_or_model_name + "'"});
            return;
        }
    } else {
        model = model_or_model_name;
    }
    if (!model.ready_for_training) {
        let previous_callback = model.callback_when_ready_for_training;
        model.callback_when_ready_for_training = 
            () => {
                if (previous_callback) {
                    previous_callback();
                }
                train_model(model, training_data, validation_data, options,
                            use_tfjs_vis, success_callback, error_callback);
            };
        return;
    }
    try {
        // callbacks based upon https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
        let epoch_history = [];
        const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
        const container = {name: 'Loss and accuracy',
                           tab: 'Training',
                           styles: { height: '400px' }};
        let callbacks;
        let epoch_end_callback;
        if (use_tfjs_vis &&
            (window.parent === window || // not an iframe
             !window.parent.ecraft2learn || // parent isn't ecraft2learn library
             window.parent.ecraft2learn.support_iframe_visible["tensorflow.js"])) { // is visible
            callbacks = tfvis.show.fitCallbacks(container, metrics, {callbacks: ['onEpochEnd']});
            epoch_end_callback = callbacks.onEpochEnd;
        } else {
            callbacks = {};
        }
        callbacks.onEpochEnd = (epoch, history) => {
            if (epoch_end_callback) {
                epoch_end_callback(epoch, history);
            }
            // and in any case do the following 
            if (epoch > 4 &&
                epoch_history[epoch-1].loss === history.loss &&
                epoch_history[epoch-2].loss === history.loss &&
                epoch_history[epoch-3].loss === history.loss) {
                // no progress for last 4 epochs 
                throw new Error('Training stuck after ' + (epoch-4) + ' steps');
            }
            epoch_history.push(history);
        };
        if (!model.optimizer) {
            // loaded models lack an optimizer and loss function
            const optimizer_full_name = gui_state["Model"]["Optimization method"];
            const optimizer = optimizer_named(optimizer_full_name);
            const loss_function_full_name = gui_state["Model"]["Loss function"];
            const loss_function = loss_function_named(loss_function_full_name);
            model.compile({loss: (loss_function || 'meanSquaredError'),
                           optimizer: optimizer});
        }
        if (model.optimizer.learningRate && options.learning_rate) { // not every optimizer needs to have this property
            model.optimizer.learningRate = options.learning_rate;
            gui_state["Training"]['Learning rate'] = options.learning_rate;
        }
        if (options.epochs) {
            gui_state["Training"]['Number of iterations'] = options.epochs;
        }
        if (options.validation_split) {
            gui_state["Training"]['Validation split'] = options.validation_split;
        }
        if (typeof options.shuffle === 'boolean') {
            gui_state["Training"]['Shuffle data'] = options.shuffle;
        }
        // when following was inside of tidy I got an error about backend being undefined
        const get_tensors = (kind) => {
            let data = get_data(model.name, kind);
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
        }
        let [xs, ys] = get_tensors('training');
        let configuration = {epochs: (options.epochs || 10),
                             shuffle: options.shuffle,
                             validationSplit: options.validation_split,
                             callbacks: callbacks};
        let validation_tensor = get_tensors('validation'); // undefined if no validation data
        if (validation_tensor) {
            configuration.validationData = validation_tensor;
        }
        const then_handler = (extra_info) => {
            let duration = Math.round((Date.now()-start)/1000); // seconds to 3 decimal places
            let response = {loss:     epoch_history[epoch_history.length-1].loss,
                            accuracy: epoch_history[epoch_history.length-1].acc,
                            "duration in seconds": duration};
            if (typeof extra_info === 'string') {
                response.extra_info = extra_info;
            }
            success_callback(response);
            model.ready_for_prediction = true;
            if (model.callback_when_ready_for_prediction) {
                model.callback_when_ready_for_prediction();
                model.callback_when_ready_for_prediction = undefined;
            }
            xs.dispose();
            ys.dispose();
            if (validation_tensor && validation_tensor.length === 2) {
                validation_tensor[0].dispose();
                validation_tensor[1].dispose();
            }
        };
        const error_handler = (error) => {
            if (error.message.indexOf('Training stuck') === 0) {
                // only did some training but not really an error
                then_handler(error.message);
            } else {
                 error_callback(error);
            }
        };
        // Train the model using the data
        let start = Date.now();
        // do I really need tidy at all since I dispose of tensors explicitly
        if (configuration.validationSplit) {
            // see https://github.com/tensorflow/tfjs/issues/927
            // hack until resolved - note there may be a memory leak here
            model.fit(xs, ys, configuration)
                .then((x) => {
                         tf.tidy(() => {
                             then_handler(x);
                         });
                     },
                     error_handler);
        } else {
            tf.tidy(() => {
                model.fit(xs, ys, configuration)
                    .then(then_handler, error_handler);
                });       
        }
    } catch (error) {
        error_callback(error);
    }
};

let last_prediction;

const predict = (model_name, inputs, success_callback, error_callback) => {
    let model = models[model_name];
    if (!model) {
        error_callback("No model named " + model_name);
        return;
    }
    if (!model.ready_for_prediction) {
        let previous_callback = model.callback_when_ready_for_prediction;
        model.callback_when_ready_for_prediction = 
            () => {
                if (previous_callback) {
                    previous_callback();
                }
                predict(model_name, inputs, success_callback, error_callback);
        };
        return;
    }
    last_prediction = JSON.stringify(inputs);
    try {
        let input_tensor;
        if (typeof inputs[0] === 'number') {
            input_tensor = tf.tensor2d(inputs, [inputs.length, 1]);
        } else {
            input_tensor = tf.tensor2d(inputs); //, [inputs.length].concat(shape_of_data(inputs))); 
        }
        let prediction = model.predict(input_tensor);
        success_callback(prediction.dataSync());
    } catch (error) {
        error_callback(error.message);
    }
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
             "Loss function": 'Mean Squared Error'},
   "Training": {"Learning rate": .001,
                "Number of iterations": 100,
                "Validation split": 0.1,
                "Shuffle data": true},
   "Predictions": {}
};

const create_parameters_interface = function () {
  const parameters_gui = new dat.GUI({width: 650,
                                      autoPlace: false});
  const settings_element = document.getElementById('settings');
  settings_element.appendChild(parameters_gui.domElement);
  settings_element.style.display = "block";
  parameters_gui.domElement.style.padding = "12px";
  return {model: create_model_parameters(parameters_gui),
          training: create_training_parameters(parameters_gui)};
};

const create_model_parameters = (parameters_gui) => {
    const model = parameters_gui.addFolder("Model");
    model.add(gui_state["Model"], "Layers");
    model.add(gui_state["Model"], 'Optimization method', Object.keys(optimization_methods));
    model.add(gui_state["Model"], 'Loss function', Object.keys(loss_functions));
    return model;  
};

const create_training_parameters = (parameters_gui) => {
    const training = parameters_gui.addFolder("Training");
    training.add(gui_state["Training"], 'Number of iterations').min(1).max(1000);
    training.add(gui_state["Training"], 'Learning rate').min(.00001).max(1);
    training.add(gui_state["Training"], 'Validation split').min(0).max(.999);
    training.add(gui_state["Training"], 'Shuffle data', [true, false]);
    return training;
};

let parameters_gui;

const parameters_interface = function (interface_creator) {
  if (!parameters_gui) {
      parameters_gui = interface_creator();
  }
  return parameters_gui;
};

let create_model_with_current_settings_button;

const create_model_with_parameters = function (surface_name) {
    const surface = tfvis.visor().surface({name: surface_name, tab: 'Model'});
    const draw_area = surface.drawArea;
    parameters_interface(create_parameters_interface).model.open();
    let name_input;
    let message;
    const create_model_with_current_settings = function () {
        let layers;
        try {
            layers = JSON.parse('[' + gui_state["Model"]["Layers"] + ']');
            if (!layers.every((n) => n > 0 && n === Math.round(n))) {
                alert("Layers should a list of positive whole numbers.");
                return;
            }
        } catch (error) {
            alert("Layers should a list of whole numbers separated by commas.");
            return;
        }
        const name = name_input.value;
        const optimizer_full_name = gui_state["Model"]["Optimization method"];
        const loss_function_full_name = gui_state["Model"]["Loss function"];
        try {
            model = create_model(name, layers, optimizer_full_name, undefined, {loss: loss_function_full_name});
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
        let loss = training_statistics.loss;
        let accuracy = training_statistics.accuracy;
        let duration = training_statistics["duration in seconds"];
        message.innerHTML = "<br>Training " + model_name + " took " + duration + " seconds. " +
                            "Final error rate is " + loss + " and accuracy is " + accuracy + ".";
        enable_evaluate_button();   
    };
    let error_callback = (error) => {
        message.innerHTML = "<br><b>Error:</b> " + error.message + "<br>";
    };
    draw_area.appendChild(message);
    let training_data   = get_data(model_name, 'training');
    let validation_data = get_data(model_name, 'validation');
    if (!training_data || !training_data.input) {
        error_callback(new Error("Cannot begin training before creating or loading training data."));
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
        await train_model(model_name,
                          training_data,
                          validation_data,
                          {epochs: Math.round(gui_state["Training"]["Number of iterations"]),
                           learning_rate: gui_state["Training"]["Learning rate"],
                           validation_split: gui_state["Training"]["Validation split"],
                           shuffle: gui_state["Training"]["Shuffle data"],
                          },
                          true, // show progress using tfjs-vis 
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
    const input_input = document.createElement('input');
    input_input.type = 'text';
    input_input.id = "prediction-input";
    input_input.name = "prediction-input";
    input_input.value = (last_prediction || 1);
    const label = document.createElement('label');
    label.for = "input_input";
    label.innerHTML = "Input for prediction: ";
    const div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(input_input);
    draw_area.appendChild(div);
    const make_prediction = (model_name) => {
        const success_callback = (results) => {
            if (input_input.value.indexOf('[') < 0) {
                results = results[0]; // only one number in inputs so only one result
            } else {
                results = "[" + results + "]";
            }
            const message = create_message_element("<br>The " + model_name + " model predicts " + results + 
                                                   "<br>for input " + input_input.value + ".");
            draw_area.appendChild(message);
        };
        const error_callback = (error_message) => {
            draw_area.appendChild(create_message_element(error_message));
        }; 
        try {
            let inputs = JSON.parse(input_input.value);
            if (typeof inputs === 'number') {
                inputs = [inputs];
            }
            predict(model_name, inputs, success_callback, error_callback);
        } catch (error) {
            error_callback(error.message);
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
    load_model_button.id = "load_model_button";
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
    load_data_message = {training:   document.createElement('div'),
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
      model = await tf.loadModel(tf.io.browserFiles([saved_model_element.files[0],
                                                    saved_weights_element.files[0]]));
  } catch (error) {
      replace_button_results(load_model_button, create_message_element(error.message));
      return;
  }
  let message = document.createElement('p');
  const model_name = saved_model_element.files[0].name.substring(0, saved_model_element.files[0].name.length-".json".length);
  message.innerHTML = model_name + " loaded and ready to evaluate.";
  model.name = model_name;
  model.ready_for_training = true;
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

let create_model_button, save_and_load_model_button, train_button, evaluate_button;

window.addEventListener('DOMContentLoaded',
                        () => {
                            create_model_button = document.getElementById('create_model');
                            save_and_load_model_button = document.getElementById('save_and_load');
                            train_button = document.getElementById('train');
                            evaluate_button = document.getElementById('evaluate');
                            create_model_button.addEventListener('click', 
                                                                 () => {
                                                                      create_model_with_parameters('Tensorflow');
                                                                 });
                            train_button.addEventListener('click',
                                                          () => {
                                                              train_with_parameters('Tensorflow');
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
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.onreadystatechange = (event) => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            success_callback(xhr.responseText);
        } else if (xhr.status >= 400) {
            error_callback(new Error("Received error code " + xhr.status + "."));
        }
    };
    xhr.onerror = error_callback;
    xhr.send();
};

const receive_message =
    async (event) => {
        let message = event.data;
        if (typeof message.data !== 'undefined') {
            let kind = message.kind;
            let model_name = message.model_name || 'all models';
            if (message.ignore_old_dataset) {
                set_data(model_name, kind, message.data);
            } else {
                set_data(model_name, kind, add_to_data(message.data, model_name, kind));
            }
            event.source.postMessage({data_received: message.time_stamp}, "*");
        } else if (typeof message.create_model !== 'undefined') {
            try {
                let model = create_model(message.create_model.name,
                                         message.create_model.layers,
                                         message.create_model.optimizer.trim(),
                                         message.create_model.input_size,
                                         message.create_model.options);
                tensorflow.add_to_models(model);
                event.source.postMessage({model_created: message.create_model.name}, "*");
            } catch (error) {
                event.source.postMessage({create_model_failed: message.create_model.name,
                                          error_message: error.message}, "*");
            }
        } else if (typeof message.train !== 'undefined') {
            const success_callback = (information) => {
                event.source.postMessage({training_completed: message.train.time_stamp,
                                          information: information}, "*");
            };
            const error_callback = (error_message) => {
                if (typeof error_message === 'object') {
                    error_message = error_message.message;
                }
                event.source.postMessage({training_failed: message.train.time_stamp,
                                          error_message: error_message}, "*");
            };
            let model_name = message.train.model_name;
            train_model(model_name,
                        get_data(model_name, 'training'),
                        get_data(model_name, 'validation'),
                        message.train.options,
                        message.train.show_progress, 
                        success_callback,
                        error_callback);
        } else if (typeof message.predict !== 'undefined') {
            const success_callback = (result) => {
                event.source.postMessage({prediction: message.predict.time_stamp,
                                          result: result}, "*");
            };
            const error_callback = (error_message) => {
                event.source.postMessage({prediction_failed: message.predict.time_stamp, 
                                          error_message: error_message}, "*");
            };
            predict(message.predict.model_name, message.predict.input, success_callback, error_callback);
        } else if (typeof message.is_model_ready_for_prediction !== 'undefined') {
            let name = message.is_model_ready_for_prediction.model_name;
            let model = models[name];
            let ready;
            if (model) {
                ready = !!model.ready_for_prediction; 
            } else {
                event.source.postMessage({error: "Unknown model '" + name + "' asked if ready for predictions."}, "*");
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
                tf.loadModel(URL).then((model) => {
                                           model.ready_for_prediction = true;
                                           // until https://github.com/tensorflow/tfjs/issues/885 is resolved need to update the name
                                           let name = URL.substring(URL.lastIndexOf('/')+1, URL.lastIndexOf('.'));
                                           model.name = name;
                                           add_to_models(model);
                                           enable_evaluate_button();
                                           event.source.postMessage({model_loaded: URL,
                                                                     model_name: name}, "*");
                                       },
                                       error_callback);
            } catch (error) {
                error_callback(error);
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
                    error_callback(error);
                }
            };
            const error_callback = (error) => {
                event.source.postMessage({error_loading_data: URL,
                                          error_message: "Error loading data from " + URL + ". " + 
                                                         error.message}, "*");
            };
            contents_of_URL(URL, success_callback, error_callback);
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
        train_with_parameters: train_with_parameters,
        save_and_load: save_and_load,
        create_button: create_button,
        replace_button_results: replace_button_results};
}()));

