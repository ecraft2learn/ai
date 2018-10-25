// Machine learning using Tensorflow.js as part of the eCraft2Learn Snap! library
// Written by Ken Kahn 
// No rights reserved.

window.tensorflow = 
((function () {

let models = {};
let model;
let training_data;

const settings_element = document.getElementById('settings');
const create_data_button = document.getElementById('create_data');
const create_model_button = document.getElementById('create_model');
const train_button = document.getElementById('train');
const evaluate_button = document.getElementById('evaluate');
const save_and_load_button = document.getElementById('save_and_load');

const add_to_models = function (model) {
    let new_name = !models[model.name];
    models[model.name] = model;
};

const shape_of_data = (data) => {
   if (typeof data === 'number') {
       return [1];
   } else if (typeof data[0] === "number") {
      return [data.length];
   } else {
      return [data.length].concat(shape_of_data[data[0]]);
   }
};

const create_model = function (name, layers, optimizer) {
    if (!training_data || typeof training_data.input === 'undefined') {
        throw new Error("Cannot create a model before knowing what the data is like.\nProvide at least one example of the data.");
    }
    const model = tf.sequential({name: name});
    model.ready_for_training = false;
    add_to_models(model);
    layers.forEach((size, index) => {
        let configuration = {units: size,
                             activation: 'relu'};
        if (index === 0) {
            configuration.inputShape = shape_of_data(training_data.input[0]);
        }
        model.add(tf.layers.dense(configuration));  
    });
    if (layers[layers.length-1] > 1) {
       // not needed if last layer is already 1
       // what if prediction is for more than one number? 
       model.add(tf.layers.dense({units: 1,
                                  activation: 'relu',
                                  useBias: false}));     
    }
    model.compile({loss: 'meanSquaredError',
                   optimizer: (optimizer || 'adam')});
    model.ready_for_training = true;
    if (model.callback_when_ready_for_training) {
        model.callback_when_ready_for_training();
        model.callback_when_ready_for_training = undefined;
    }
    return model;
};

const train_model = async function (model_or_model_name, data, epochs, learning_rate, use_tfjs_vis, success_callback, error_callback) {
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
      ys = tf.tensor2d(data.output, [data.output.length, 1]);
  } else {
      xs = tf.tensor2d(data.input);
      ys = tf.tensor2d(data.output, [data.output.length, 1]);
  }
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

const predict = (model_name, input, success_callback, error_callback) => {
    let model = models[model_name];
    if (!model) {
        error_callback("No model named " + model_name);
        return;
    }
    if (!model.ready_for_prediction) {
        model.callback_when_ready_for_prediction = 
            () => {
                predict(model_name, input, success_callback, error_callback);
        };
        return;
    }
    try {
        let input_tensor;
        if (typeof input === 'number') {
            input_tensor = tf.tensor2d([input], [1, 1]);
        } else {
            input_tensor = tf.tensor2d([input], [1].concat(shape_of_data(input)));
        }
        let prediction = model.predict(input_tensor);
        success_callback(prediction.dataSync()[0]);
    } catch (error) {
        error_callback(error.message);
    }
};

let report_error = function (error) {
    console.log(error); // for now
};

const add_to_dataset = 
  (new_input, new_output) => {
      if (!training_data || typeof training_data.input === 'undefined') {
          return {input:  new_input,
                  output: new_output};
      }
      return {input:  training_data.input.concat(new_input),
              output: training_data.output.concat(new_output)};
};

// following needs to be updated
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
  if (models[name]) {
     message.innerHTML += "<br>Replaced a model with the same name.";
  }
  add_to_models(model);
  replace_button_results(load_button, message);  
  // to add more data enable these options
  create_model_button.disabled = false;
  evaluate_button.disabled = false;
};

let create_button = function (label, click_handler) {
  const button = document.createElement('button');
  button.innerHTML = label;
  button.className = "support-window-button";
  button.addEventListener('click', click_handler);
  button.id = label; // for ease of replacing it with a newer version
  return button;
};


window.addEventListener('DOMContentLoaded',
                        () => {
                            // not waiting for anything so loaded and ready are the same
                            window.parent.postMessage("Loaded", "*"); 
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
        } else if (typeof message.create_model !== 'undefined') {
            try {
                let model = create_model(message.create_model.name,
                                         message.create_model.layers,
                                         message.create_model.optimizer);
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
        } else if (message !== "Loaded" &&
                   message !== "Ready" &&
                   typeof message.training_completed === 'undefined' &&
                   typeof message.prediction === 'undefined') {
            console.log("Unhandled message: ", message); // just for debugging
        }
};

window.addEventListener('message', receive_message);

return {get_model: (name) => models[name], 
        add_to_models: add_to_models,
        training_data: () => training_data,
        set_training_data: (data) => {
            training_data = data;
        },
        add_to_dataset: add_to_dataset,
        create_model: create_model,
        train_model: train_model,
        predict: predict};
  
}()));

