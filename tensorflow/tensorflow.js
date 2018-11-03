// Machine learning using Tensorflow.js as part of the eCraft2Learn Snap! library
// Written by Ken Kahn 
// No rights reserved.

window.tensorflow = 
((function () {

let models = {};
let model;
let training_data;

const MAX_LAYER_COUNT = 5;

const optimization_methods =
    {"Stochastic Gradient Descent": "sgd",
//      "Momentum": "momentum",
     "Adaptive Stochastic Gradient Descent": "adagrad",
     "Adaptive Learning Rate Gradiant Descent": "adadelta",
     "Adaptive Moment Estimation": "adam",
     "Adaptive Moment Estimation Max": "adamax",
     "Root Mean Squared Prop": "rmsprop"};

const add_to_models = function (model) {
    let new_name = !models[model.name];
    models[model.name] = model;
};

const get_model = (name) => models[name];

const shape_of_data = (data) => {
   if (typeof data === 'number') {
       return [1];
   } else if (typeof data[0] === "number") {
      return [data.length];
   } else {
      return [data.length].concat(shape_of_data(data[0]));
   }
};

const create_model = function (name, layers, optimizer_full_name, input_shape) {
    if (!input_shape && (!training_data || typeof training_data.input === 'undefined')) {
        throw new Error("Cannot create a model before knowing what the data is like.\nProvide at least one example of the data.");
    }
    const optimizer = optimization_methods[optimizer_full_name];
    if (!optimizer) {
        report_error("Could not recognise '" + optimizer_full_name + "' as an optimizer.");
        return;
    }
    const model = tf.sequential({name: name});
    model.ready_for_training = false;
    add_to_models(model);
    layers.forEach((size, index) => {
        if (size > 0) {
            let configuration = {units: size,
                                 activation: 'relu'};
            if (index === 0) {
                configuration.inputShape = input_shape || shape_of_data(training_data.input[0]);
            }
            model.add(tf.layers.dense(configuration));
        }
        gui_state["Model"]["Size of layer " + (index + 1)] = size;
    });
    for (let i = layers.length; i < MAX_LAYER_COUNT; i++) {
        gui_state["Model"]["Size of layer " + (i + 1)] = 0;
    }
    if (layers[layers.length-1] > 1) {
       // not needed if last layer is already 1
       // what if prediction is for more than one number? 
       model.add(tf.layers.dense({units: 1,
                                  activation: 'relu',
                                  useBias: false}));     
    }
    if (!optimizer) {
        optimizer = 'adam';
    }
    model.compile({loss: 'meanSquaredError',
                   optimizer: optimizer});
    gui_state["Model"]["Optimization method"] = optimizer_full_name;
    model.ready_for_training = true;
    if (model.callback_when_ready_for_training) {
        model.callback_when_ready_for_training();
        model.callback_when_ready_for_training = undefined;
    }
    return model;
};

const train_model = async function (model_or_model_name, data, epochs, learning_rate, use_tfjs_vis, success_callback, error_callback) {
  if (!model_or_model_name) {
      error_callback({message: "No model or name provided to train model."});
      return;
  }
  if (typeof model_or_model_name === 'string') {
      model = models[model_or_model_name];
      if (!model) {
          error_callback({message: "No model named ''" + model_or_model_name + "'"});
          return;
      }
  } else {
      model = model_or_model_name;
  }
  if (!model.ready_for_training) {
      model.callback_when_ready_for_training = 
          () => {
              train_model(model, data, epochs, learning_rate, use_tfjs_vis, success_callback, error_callback);
          };
      return;
  }
  model.ready_for_prediction = false;
  let xs;
  let ys;
  if (typeof data.input[0] === 'number') {
      xs = tf.tensor2d(data.input,  [data.input.length, 1]);
  } else {
      xs = tf.tensor(data.input);
  }
  ys = tf.tensor2d(data.output, [data.output.length, 1]);
  // callbacks based upon https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
  const epoch_history = [];
  let callbacks = {onEpochEnd: async (epoch, h) => {
                       epoch_history.push(h);
                       if (use_tfjs_vis) {
                           tfvis.show.history({name: 'Error rate', tab: 'Training'},
                                              epoch_history,
                                              ['loss']);
                       }}
  }; 
  // Train the model using the data
  let start = Date.now();
  if (model.optimizer.learningRate) { // not every optimizer needs to have this property
      model.optimizer.learningRate = learning_rate;
  }
  gui_state["Training"]['Number of iterations'] = epochs;
  gui_state["Training"]['Learning rate'] = learning_rate;
  tf.tidy(() => {
      model.fit(xs,
                ys,
                {epochs: epochs,
                 callbacks: callbacks})
          .then(() => {
                  let duration = Math.round((Date.now()-start)/1000);
                  success_callback({duration: duration,
                                    loss: epoch_history[epochs-1].loss});
                  model.ready_for_prediction = true;
                  if (model.callback_when_ready_for_prediction) {
                      model.callback_when_ready_for_prediction();
                      model.callback_when_ready_for_prediction = undefined;
                  }
                },
                error_callback);
       });
};

let last_prediction;

const predict = (model_name, inputs, success_callback, error_callback) => {
    let model = models[model_name];
    if (!model) {
        error_callback("No model named " + model_name);
        return;
    }
    if (!model.ready_for_prediction) {
        model.callback_when_ready_for_prediction = 
            () => {
                predict(model_name, inputs, success_callback, error_callback);
        };
        return;
    }
    last_prediction = JSON.stringify(inputs);
    try {
        let input_tensor;
        if (typeof inputs === 'number') {
            inputs = [inputs];
        }
        input_tensor = tf.tensor2d(inputs); //, [inputs.length].concat(shape_of_data(inputs)));
        let prediction = model.predict(input_tensor);
        success_callback(prediction.dataSync());
    } catch (error) {
        error_callback(error.message);
    }
};

let report_error = function (error) {
    console.log(error); // for now
};

const add_to_dataset = (new_input, new_output) => {
    if (!training_data || typeof training_data.input === 'undefined') {
        return {input:  new_input,
                output: new_output};
    }
    return {input:  training_data.input.concat(new_input),
            output: training_data.output.concat(new_output)};
};

const gui_state = 
  // following inspired by https://github.com/johnflux/deep-learning-tictactoe/blob/master/play.py
  {"Model": {"Size of layer 1": 100,
             "Size of layer 2": 50,
             "Size of layer 3": 20,
             "Size of layer 4": 0,
             "Size of layer 5": 0,
             "Optimization method": 'Stochastic Gradient Descent'},
   "Training": {"Learning rate": .001,
                "Number of iterations": 120},
   "Predictions": {}
};

const create_parameters_interface = function () {
  const parameters_gui = new dat.GUI({width: 600,
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
    for (let i = 1; i <= MAX_LAYER_COUNT; i++) {
        model.add(gui_state["Model"], 'Size of layer ' + i).min(i === 1 ? 1 : 0).max(100);
    }
    model.add(gui_state["Model"], 'Optimization method', Object.keys(optimization_methods));
    return model;  
};

const create_training_parameters = (parameters_gui) => {
    const training = parameters_gui.addFolder("Training");
    training.add(gui_state["Training"], 'Number of iterations').min(1).max(1000);
    training.add(gui_state["Training"], 'Learning rate').min(.00001).max(.9999);
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
      let layers = [];
      for (let i = 1; i <= MAX_LAYER_COUNT; i++) {
          let layer_size = gui_state["Model"]["Size of layer " + i];
          if (layer_size > .5) {
              layers.push(Math.round(layer_size));
          }
      }
      const name = name_input.value;
      const optimizer_full_name = gui_state["Model"]["Optimization method"];
      try {
          model = create_model(name, layers, optimizer_full_name);
      } catch (error) {
          report_error(error);
      }
      if (train_button) {
          train_button.disabled = false;
      }
      let html = "<br>A new model named '" + name + "' created and it is ready to be trained.";
      if (get_model(name)) {
          html += "<br>It replaces the old model of the same name.";
      }
      html += "<br>Its optimization method is '" + optimizer_full_name + "'.";
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
      message = document.createElement('div');
      draw_area.appendChild(message);        
  }
};

let train_with_current_settings_button;

const train_with_parameters = async function (surface_name) {
  const surface = tfvis.visor().surface({name: surface_name, tab: 'Training'});
  const draw_area = surface.drawArea;
  const train_with_current_settings = async function () {
    let message = document.createElement('div');
    let success_callback = (training_statistics) => {
        let {duration, loss} = training_statistics;
        message.innerHTML = "<br>Training took " + duration + " seconds. Final error rate is " + loss +".";
        let evaluate_button = document.getElementById('evaluate');
        if (evaluate_button) {
            evaluate_button.disabled = false;
        }    
    };
    let error_callback = (error) => {
        message.innerHTML = "<br><b>Error:</b> " + error.message + "<br>";
    };
    message.innerHTML = "<br>Training started. Training data is " + training_data.input.length + " long. Please wait.";
    draw_area.appendChild(message);
    setTimeout(async function () {
        // without the timeout the message above isn't displayed
        await train_model(model,
                          training_data,
                          Math.round(gui_state["Training"]["Number of iterations"]),
                          gui_state["Training"]["Learning rate"],
                          true, // show progress using tfjs-vis 
                          success_callback,
                          error_callback);
    });
  };
  parameters_interface(create_parameters_interface).training.open();
  if (train_with_current_settings_button) {
      tfvis.visor().setActiveTab('Training');
  } else {
      train_with_current_settings_button = create_button("Train model with current settings", train_with_current_settings);
      draw_area.appendChild(train_with_current_settings_button);    
  }
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
    const make_prediction = 
        () => {
            try {
                const input = JSON.parse(input_input.value);
                predict(model.name, [input], success_callback, report_error);
            } catch (error) {
                report_error(error);
            }
    };
    const prediction_button = create_button("Make prediction", make_prediction);
    const success_callback = (result) => {
        const message = document.createElement('div');
        message.innerHTML = "<br>The " + model.name + " model predicts " + result[0] + " for input " + input_input.value + ".";
        draw_area.appendChild(message);
    };  
    draw_area.appendChild(prediction_button);
};

let save_button;
let load_button;

const save_and_load = function () {
    const surface = tfvis.visor().surface({name: 'Tensorflow', tab: 'Save/Load'});
    const draw_area = surface.drawArea;
    if (save_button) {
        tfvis.visor().setActiveTab('Save/Load');
        return; // already set up 
    }
    draw_area.innerHTML = ""; // reset if rerun
    save_button = create_button("Save trained model", save_model);
    draw_area.appendChild(save_button);
    load_button = create_button("Load a trained model", load_model);
    draw_area.appendChild(load_button);
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
    draw_area.appendChild(file_input('Saved model JSON file: ', 'saved_json'));
    draw_area.appendChild(file_input('Saved model weights file: ', 'saved_weights'));
};

const save_model = async function () {
  let URL = 'downloads://' + model.name;
  return await model.save(URL);
};

const load_model = async function () {
  const saved_model_element = document.getElementById('saved_json');
  const saved_weights_element = document.getElementById('saved_weights');
  if (!saved_model_element.files[0] || !saved_weights_element.files[0]) {
      let message = document.createElement('p');
      message.innerHTML = "Please choose files below and then click this again.";
      replace_button_results(load_button, message);
      return;
  }
  model = await tf.loadModel(tf.io.browserFiles([saved_model_element.files[0],
                                                 saved_weights_element.files[0]]));
  let message = document.createElement('p');
  const model_name = saved_model_element.files[0].name.substring(0, saved_model_element.files[0].name.length-".json".length);
  message.innerHTML = model_name + " loaded and ready to evaluate.";
  model.name = model_name;
  model.ready_for_prediction = true;
  if (models[name]) {
      message.innerHTML += "<br>Replaced a model with the same name.";
  }
  add_to_models(model);
  replace_button_results(load_button, message);  
  // to add more data enable these options
  create_model_button.disabled = false;
  let evaluate_button = document.getElementById('evaluate');
  if (evaluate_button) {
      evaluate_button.disabled = false;    
  }
};

let create_button = function (label, click_handler) {
  const button = document.createElement('button');
  button.innerHTML = label;
  button.className = "support-window-button";
  button.addEventListener('click', click_handler);
  button.id = label; // for ease of replacing it with a newer version
  return button;
};

const replace_button_results = function(element, child) {
    if (element.firstChild.nextSibling) {
        element.firstChild.nextSibling.remove();
    }
    element.appendChild(child);
};

let create_model_button, save_and_load_button, train_button, evaluate_button;

window.addEventListener('DOMContentLoaded',
                        () => {
                            create_model_button = document.getElementById('create_model');
                            save_and_load_button = document.getElementById('save_and_load');
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
                            save_and_load_button.addEventListener('click', save_and_load);             
                            // not waiting for anything so loaded and ready are the same
                            window.parent.postMessage("Loaded", "*");
                            if (window !== window.parent) {
                                window.postMessage("Loaded", "*"); // for other files to react (e.g. test.js)
                            }
                            window.parent.postMessage("Ready", "*");
                        });

const receive_message =
    (event) => {
        let message = event.data;
        if (typeof message.training_data !== 'undefined') {
            if (message.training_data.ignore_old_dataset) {
                training_data = {};
            }
            training_data =
                add_to_dataset(message.training_data.input,
                               message.training_data.output);
            event.source.postMessage({data_received: message.training_data.time_stamp}, "*");
        } else if (typeof message.create_model !== 'undefined') {
            try {
                const optimizer_full_name = message.create_model.optimizer.trim();
                const optimizer = optimization_methods[optimizer_full_name];
                if (!optimizer) {
                    event.source.postMessage({error: "Could not recognise '" + optimizer_full_name + "' as an optimizer."}, "*");
                    return;
                }
                let model = create_model(message.create_model.name,
                                         message.create_model.layers,
                                         optimizer_full_name,
                                         message.create_model.input_size);
                add_to_models(model);
            } catch (error) {
                event.source.postMessage({error: error.message}, "*");
            }
        } else if (typeof message.train !== 'undefined') {
            const success_callback = (information) => {
                event.source.postMessage({training_completed: information}, "*");
            };
            const error_callback = (error) => {
                event.source.postMessage({error: error.message}, "*");
            };
            train_model(message.train.model_name,
                        training_data,
                        (message.train.epochs || 10),
                        (message.train.learning_rate || .01),
                        message.train.show_progress, 
                        success_callback,
                        error_callback);
        } else if (typeof message.predict !== 'undefined') {
            const success_callback = (result) => {
                event.source.postMessage({prediction: result}, "*");
            };
            const error_callback = (error_message) => {
                event.source.postMessage({error: error_message}, "*");
            };
            predict(message.predict.model_name, message.predict.input, success_callback, error_callback);
        } else if (typeof message.is_model_ready_for_prediction !== 'undefined') {
            let name = message.is_model_ready_for_prediction.model_name;
            let model = models[name];
            let ready;
            if (model) {
                ready = !!model.ready_for_prediction; 
            } else {
                event.source.postMessage({error: "Unknown model '" + name + "' asked if ready for predictions."});
                ready = false; // unknown model is not ready
            }
            event.source.postMessage({ready_for_prediction: ready,
                                      model_name: name}); 
        } else if (message !== "Loaded" &&
                   message !== "Ready" &&
                   message !== "stop" &&
                   typeof message.training_completed === 'undefined' &&
                   typeof message.prediction === 'undefined') {
            console.log("Unhandled message: ", message); // just for debugging
        }
};

window.addEventListener('message', receive_message);

return {get_model: get_model, 
        add_to_models: add_to_models,
        training_data: () => training_data,
        set_training_data: (data) => {
            training_data = data;
        },
        add_to_dataset: add_to_dataset,
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

