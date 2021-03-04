 /**
 * Implements JavaScript functions that extend Snap! to access AI cloud services and the machine learning library tensorflow.js
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict"

const compute_confusion_matrix = (predictions, truth, n) => {
    // predictions and truth flattened 
    let matrix = [];
    const row = () => {
        let row = [];
        for (let i = 0; i < n; i++) {
            row.push(0);
        }
        return row;
    };
    const index_of_max = (list) => {
        let max_index = 0;
        let max = list[0];
        list.forEach((element, index) => {
            if (element > max) {
                max_index = index;
                max = element;
            }
        });
        return max_index;
    };
    for (let i = 0; i < n; i++) {
        matrix.push(row());
    }
    for (let i = 0; i < predictions.length; i += n) {
        const prediction_value = index_of_max(predictions.slice(i,i+n));
        const truth_value = index_of_max(truth.slice(i,i+n));
        matrix[truth_value][prediction_value]++;
    }
    return matrix;
};

const collapse_confusion_matrix = (matrix, indices) => {
    const matrix_2x2 = [[0, 0], [0, 0]];    
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (indices[0].includes(i) && indices[0].includes(j)) {
                matrix_2x2[0][0] += matrix[i][j];
            } else if (indices[0].includes(i) && indices[1].includes(j)) {
                matrix_2x2[0][1] += matrix[i][j];
            } else if (indices[1].includes(i) && indices[0].includes(j)) {
                matrix_2x2[1][0] += matrix[i][j];
            } else  {
                matrix_2x2[1][1] += matrix[i][j];
            }
        }
    }
    return matrix_2x2;
};

const set_random_number_seed = (options) => {
     if (options.seed) {
        options.current_seed = options.seed(options.training_number || 1);
        Math.seedrandom(options.current_seed);
    }   
};

let next_slice = () => {
    console.log("next_slice not defined");
};

const create_and_train_model = (options, success_callback, failure_callback) => {
    // this isn't meant to be called by Snap! (despite the confusion that tensorflow.js has a local function with the same name)
    // is called by LIFE.js, nails.js, 
    options.success_callback = success_callback;
    set_random_number_seed(options);
    let model = create_model(options, failure_callback);
    let new_success_callback;
    if (options.slices_to_use) {
        next_slice = () => {
            next_slice_number(options);
            load_slice(options,
                       () => {
                           redo_training(model, options, success_callback, failure_callback);
                       });
        };
        // following led to out-of-memory errors - so running next_slice manually
//         new_success_callback = (results) => {
//             success_callback(results, next_slice);
//         };
    }
    return train_model(model, options.datasets, options, (new_success_callback || success_callback), failure_callback);
};

const next_slice_number = (options) => {
    // slice number is so can train with 1/n and then the next 1/n, etc.
    if (options.slices_to_use) {
        options.slice_number = options.slices_to_use[0];
        options.slices_to_use = options.slices_to_use.slice(1);
    } else {
        if (!options.slice_number) {
            options.slice_number = 0;
        }
    }
};

const create_model = (options, failure_callback) => {
    record_callbacks(failure_callback);
    try {
        const {model_name, hidden_layer_sizes, dropout_rate, optimizer, layer_initializer, batch_normalization, regularizer,
               learning_rate, loss_function, activation, last_activation, seed, datasets, custom_model_builder,
               load_model_for_further_training, training_number} = options;
        const tfvis_options = typeof tfvis === 'object' ? options.tfvis_options || {} : {}; // ignore options if tfvis not loaded
        let class_names = options.class_names;
        let {input_shape} = options;
        if (!input_shape) {
            if (datasets) {
                if (datasets.xs_array && datasets.xs_array.length > 0) {
                    input_shape = shape_of_data(datasets.xs_array[0]);
                } else if (datasets.xs) {
                    input_shape = datasets.xs.shape.slice(1);
                    if (input_shape.length === 0) {
                        input_shape = [1];
                    }
                }                   
            }
        }
        if (!input_shape) {
            throw new Error("Unable to create a model without knowing the shape of the input. Shape not provided and input data not known.");
        }
        if (typeof tensorflow !== 'undefined') {
            // running this from Snap!
            if (!class_names) {
                class_names = tensorflow.get_data(model_name, 'categories');
            }
            if (!class_names) {
                // need to recreate this model if later it gets data that uses categories
                tensorflow.set_data(model_name,
                                    'recreate',
                                    (callback) => {
                                        model = create_model(options, failure_callback);
                                        tensorflow.add_to_models(model);
                                        invoke_callback(callback);
                                    });
            }
        }
        if (datasets) {
            // transfer treats last layer with custom code
            let output_size;
            if (datasets.ys_array && datasets.ys_array.length > 0) {
                output_size = typeof datasets.ys_array[0] === 'number' ? 1 : datasets.ys_array[0].length;
            } else if (datasets.ys) {
                output_size = datasets.ys.shape.slice(1)[0];
            }
            const last_layer_size = +hidden_layer_sizes[hidden_layer_sizes.length-1];
            if (output_size !== last_layer_size) {
                hidden_layer_sizes.push(output_size);
            }
        }
        const build_model = () => {
            let model = tf.sequential({name: model_name});
            hidden_layer_sizes.forEach((size, index) => {
                const last_layer = index === hidden_layer_sizes.length-1;
                const kernelRegularizer = last_layer ? undefined : tfjs_function(regularizer, tf.regularizers, index);
                const kernelInitializer = last_layer ? undefined : tfjs_function(layer_initializer, tf.initializers, index);
                const activation_function = (typeof activation === 'string' ? activation : tfjs_function(activation, tf.layers, index)) || 'relu';
                const number_of_categories = class_names && Math.max(class_names.length, window.minimum_number_of_categories_for_textual_output || 0);
                const configuration = {inputShape: index === 0 ? input_shape : undefined,
                                       units: last_layer && class_names ? number_of_categories : +size,
                                       activation: last_layer ? last_activation || (class_names && 'softmax') : activation_function,
                                       kernelInitializer,
                                       kernelRegularizer,
                                       useBias: !last_layer, // last one has no bias 
                                      };
                model.add(tf.layers.dense(configuration));
                if (!last_layer) {
                    if (dropout_rate > 0) {
                        model.add(tf.layers.dropout({rate: dropout_rate}));
                    }
                    if (batch_normalization) {
                        const args = typeof batch_normalization === 'boolean' ? undefined : batch_normalization;
                        model.add(tf.layers.batchNormalization(args));
                    }
                }
           });
           return model;
        };
        const compile_model = (model) => {
           // We use categoricalCrossentropy which is the loss function we use for
           // categorical classification which measures the error between our predicted
           // probability distribution over classes (probability that an input is of each
           // class), versus the label (100% probability in the true class)
           const optimizer_function = ['Momentum', 'momentum'].includes(optimizer) ? 
                                      tf.train.momentum((typeof learning_rate === 'undefined' ? .001 : learning_rate), .9) :
                                      (typeof optimizer === 'string' ? optimizer : 
                                      (typeof optimizer === 'object' ? optimizer : optimizer()));
           let loss;
           if (typeof loss_function === 'object') {
               loss = loss_function;
           } else if (class_names) {
               loss = 'categoricalCrossentropy';
               if (typeof loss_function === 'string' && loss_function !== loss && loss_function !== 'Softmax Cross Entropy') {
                   console.log("Ignoring loss function '" + loss_function + "' and using instead '" + loss + "'");
               }
           } else if (typeof loss_function === 'string') {
               loss = tf.losses[loss_function] || loss_function;
           } else {
               loss = 'meanSquaredError';
           }
//            loss = (a, b) => {a.print(); b.print(); return tf.losses[loss_function](a,b);};
           const compile_options = {optimizer: optimizer_function,
                                    loss,
                                    metrics: class_names && ['accuracy','crossentropy']};
           model.compile(compile_options);
           model.compiled = true;
        };
        let model = (typeof loaded_model !== 'undefined' && loaded_model) || (custom_model_builder ? custom_model_builder() : build_model());
        compile_model(model);
        if (tfvis_options.display_layers_after_creation) {
            show_layers(model, 'Model after creation', training_number);
        }
        return model;
  } catch (error) {
      if (failure_callback) {
          invoke_callback(failure_callback, error);
       } else {
          throw error;
       }
  }
};

const tfjs_function = (fun, function_table, layer_index) => {
    if (!fun) {
        return;
    }
    if (typeof fun === 'string') {
        return function_table[fun]({});
    }
    return fun(layer_index);
};

const show_layers = (model, tab_name, training_number) => {
    tf.tidy(() => {
        const surface = {name: 'Layers', tab: tab_label(tab_name, training_number)};
        tfvis.show.modelSummary(surface, model);
        model.layers.forEach((layer, index) => {
            surface.name = "Layer#" + index;
            tfvis.show.layer(surface, layer);
        });
    });
};

const tab_label = (label, training_number) => label + (typeof training_number === 'undefined' ? '' : '#' + training_number);

const update_tensors = (datasets, batch_size) => {
    let {xs_array, ys_array, xs_validation_array, ys_validation_array, xs_test_array, ys_test_array} = datasets;
    if (datasets.use_tf_datasets) {
        // could add batch and/or shuffle here
        datasets.train = tf.data.zip({xs: tf.data.array(xs_array), 
                                      ys: tf.data.array(ys_array)}).batch(batch_size);
        datasets.validation = tf.data.zip({xs: tf.data.array(xs_validation_array), 
                                           ys: tf.data.array(ys_validation_array)}).batch(batch_size);
    } else {
        tf.dispose(datasets.xs);
        datasets.xs = tf.tensor(xs_array);
        tf.dispose(datasets.ys);
        datasets.ys = tf.tensor(ys_array);
        tf.dispose(datasets.xs_validation);
        datasets.xs_validation = xs_validation_array && xs_validation_array.length > 0 && tf.tensor(xs_validation_array);
        tf.dispose(datasets.ys_validation);
        datasets.ys_validation = ys_validation_array && ys_validation_array.length > 0 && tf.tensor(ys_validation_array);
        // not sure the tests need to become tensors
        tf.dispose(datasets.xs_test);
        datasets.xs_test = xs_test_array && xs_test_array.length > 0 && tf.tensor(xs_test_array);
        tf.dispose(datasets.ys_test);
        datasets.ys_test = ys_test_array && ys_test_array.length > 0 && tf.tensor(ys_test_array);
    }
};

const split_data = (datasets, options, fraction_to_keep) => {
    // if I want reproducability I should use tf.randomUniform with a seed
    if (!datasets.xs_array) {
        datasets.xs_array = datasets.xs.arraySync();
    }
    if (!datasets.ys_array) {
        datasets.ys_array = datasets.ys.arraySync();
    }
    if (!datasets.original_xs) {
        datasets.original_xs = datasets.xs_array;
        datasets.original_ys = datasets.ys_array;
    }
    const {original_xs, original_ys} = datasets;
    const {validation_fraction, testing_fraction} = options;
    let xs_ys = original_xs.map((x, index) => [x, original_ys[index]]);
    tf.util.shuffle(xs_ys);
    if (fraction_to_keep < 1) {
        xs_ys.splice(Math.round(fraction_to_keep * xs_ys.length));
    }
    xs_ys = xs_ys.sort((a,b) => a[1].indexOf(1) - b[1].indexOf(1));
    // sort by class to make equal quantities
    const find_start = (class_index) => {
        // assumes that each class is next to each other in the datasets
        for (let i = 0; i < xs_ys.length; i++) {
            if (xs_ys[i][1].indexOf(1) === class_index) {
                return i;
            }
        }
    };
    let starts = [];
    const output_size = datasets.ys ? datasets.ys.shape[1] : datasets.ys_array[0].length;
    for (let i = 0; i < output_size; i++) {
        starts.push(find_start(i));
    }
//     const starts = class_names.map((ignore, class_index) => find_start(class_index));
    const validation_count = Math.round(validation_fraction * xs_ys.length);
    const validation_count_per_class = Math.round(validation_count / output_size);
    const test_count = Math.round(testing_fraction * xs_ys.length);
    const test_count_per_class = Math.round(test_count / output_size);
    const new_count = xs_ys.length - (validation_count_per_class + test_count_per_class) * output_size;
    const validation_ends = starts.map((start) => start + validation_count_per_class);
    let xs_ys_validation = [];
    validation_ends.forEach((end, index) => {
        xs_ys_validation = xs_ys_validation.concat(xs_ys.slice(starts[index], end));
    });
    const test_ends = validation_ends.map((start) => start + test_count_per_class);
    let xs_ys_test = [];
    test_ends.forEach((end, index) => {
        xs_ys_test = xs_ys_test.concat(xs_ys.slice(validation_ends[index], end));
    });
    let new_xs_ys = [];
    starts.push(xs_ys.length);
    // so starts [index+1] is the end of the class
    test_ends.forEach((test_end, index) => {
        new_xs_ys = new_xs_ys.concat(xs_ys.slice(test_ends[index], starts[index + 1]));
    });
    datasets.xs_validation_array = xs_ys_validation.map((x_y) => x_y[0]);
    datasets.ys_validation_array = xs_ys_validation.map((x_y) => x_y[1]);
    datasets.xs_test_array = xs_ys_test.map((x_y) => x_y[0]);
    datasets.ys_test_array = xs_ys_test.map((x_y) => x_y[1]);
    if (datasets.xs_test_array.length === 0) {
        // if not setting aside test data then use validation for confusion matrix etc.
        datasets.xs_test_array = datasets.xs_validation_array;
        datasets.ys_test_array = datasets.ys_validation_array;
        datasets.test_and_validation_identical = true;
    }
    datasets.xs_array = new_xs_ys.map((x_y) => x_y[0]);
    datasets.ys_array = new_xs_ys.map((x_y) => x_y[1]);
    datasets.already_split = true;
};

const update_best_weights = (model, best_weights) => {
    if (best_weights) {
        best_weights.forEach((layer_weights) => {
            layer_weights.forEach((tensor) => {
                tensor.dispose();
            });
        });
    };
    best_weights = [];
    model.layers.forEach((layer) => {
        best_weights.push(layer.getWeights().map(tf.clone));
    });
    return best_weights;
};

const set_model_weights = (model, best_weights) => {
    if (best_weights && best_weights.length === model.layers) {
        try {
            model.layers.forEach((layer, index) => {
                layer.setWeights(best_weights[index]);
            });            
        } catch (error) {
            model.summary();
            console.log('failed to set model weights', error);
        }        
    }
};

const not_a_number_error_message = "Training loss has become 'not-a-number'.";

const reload_datasets_label = "Replace datasets";

const train_model = (model, datasets, options, success_callback, failure_callback) => {
    let error_message;
    if (!model) {
        error_message = "No model provided for training. " +
                        "Perhaps the name is misspelled or you are trying to train before the model was created.";
    } else if (!datasets) {
        error_message = "Cannot train '" + options.model_name + "' before sending some training data.";      
    }    
    if (error_message) {
        if (failure_callback) {
            invoke_callback(failure_callback, error_message);
            return;
        }
        throw new Error(error_message);         
    }
    record_callbacks(success_callback, failure_callback);
    if (!model.compiled) {
        // been loaded but never compiled
        // not clear how to provide options to override the following defaults
        model.compile({optimizer: 'sgd',
                       loss: 'meanSquaredError'});
        model.compiled = true;
    }
    const {class_names, batch_size, shuffle, epochs, validation_split, learning_rate, dropout_rate, batch_normalization, optimizer,
           layer_initializer, regularizer, seed, stop_if_no_progress_for_n_epochs, initialEpoch, slices_to_use,
           testing_fraction, validation_fraction, fraction_kept, split_data_on_each_experiment, training_number} 
          = options;
    const number_of_training_epochs = epochs;
    const use_tf_datasets = datasets.use_tf_datasets;
    const tfvis_options = typeof tfvis === 'object' ? options.tfvis_options || {} : {}; // ignore options if tfvis not loaded
    const model_name = model.name;
    const splitting_data = (split_data_on_each_experiment && !initialEpoch) || // not doing additional training
                           ((typeof datasets.xs_validation_array === 'undefined' || datasets.xs_validation_array.length === 0) && // no validation data provided
                            typeof datasets.train === 'undefined' &&
                            typeof validation_fraction === 'number' && 
                            typeof testing_fraction === 'number');
    const tab_name = tab_label('Training', training_number);
    const surface_name = tfvis_options.measure_accuracy ? 'Loss and accuracy' : 'Loss';
    let train_again_button;
    const add_train_again_button = () => {
        const surface = tfvis.visor().surface({name: surface_name, tab: tab_name});
        const draw_area = surface.drawArea;
        train_again_button = document.createElement('button');
        train_again_button.innerHTML = "Do more training";
        train_again_button.addEventListener('click', 
                                            () => {
                                                redo_training(model, options, success_callback, failure_callback);
                                            });
        draw_area.appendChild(train_again_button);
        if (options.replace_datasets) {
            reload_datasets_button.innerHTML = reload_datasets_label;
            reload_datasets_button.addEventListener('click',
                () => {
                    model_options.slice_number++;
                    load_slice(model_options);
                });
            draw_area.appendChild(reload_datasets_button);
        }
    }
    if (splitting_data && !datasets.already_split) {
        split_data(datasets, options, options.fraction_kept);
    }
    const create_tensors = !!datasets.xs_array && !datasets.train;
    if (create_tensors) {
        // datasets are JavaScript arrays (prior to possible splitting) so compute tensor version
        update_tensors(datasets, batch_size);
    }
    try {
        // callbacks based upon https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
        let epoch_history = [];
        const metrics = ['loss', 'val_loss'];
        if (tfvis_options.measure_accuracy) {
            metrics.push('acc');
            metrics.push('val_acc');
        };
        if (learning_rate) {
            model.optimizer.learningRate = learning_rate;
        }
        const container = tfvis_options.display_graphs &&
                          {name: surface_name,
                           tab: tab_name,
                           styles: {height: tfvis_options.container_height ? 
                                            tfvis_options.container_height : 
                                            tfvis_options.measure_accuracy ? 800 : 400}}; 
        const tfvis_callbacks = tfvis_options.display_graphs && tfvis.show.fitCallbacks(container, metrics, tfvis_options);
        if (!train_again_button && slices_to_use) {
            add_train_again_button();
        }
        // auto_stop replaced by the more controllable stop_if_no_progress_for_n_epochs
        //  const stop_early_callbacks = auto_stop && tf.callbacks.earlyStopping();
        let data_loss;
        let lowest_data_loss;
        let validation_loss;
        let data_accuracy;
        let validation_accuracy;
        let lowest_validation_loss;
        let lowest_validation_loss_epoch;
        let highest_accuracy;
        let highest_accuracy_epoch;
        let best_weights = [];
        let update_weights = false;
        let last_epoch = 0;
        const warmup_epochs = Math.round(epochs*0.1); // first 10% not reliable for discovering best parameters
        const stats_callback = 
            {onEpochEnd: async (epoch, history) => {
//                 console.log(history, epoch);
                epoch_history.push(history);
                last_epoch = epoch;
                data_loss = history.loss;
                if (isNaN(data_loss)) {
                    throw new Error(not_a_number_error_message);
                }
                // if there is no validation data then use the training dataset loss instead
                validation_loss = typeof history.val_loss === 'undefined' ? history.loss : history.val_loss;
                data_accuracy = history.acc;
                validation_accuracy = history.val_acc;
                if (epoch >= warmup_epochs && (typeof lowest_data_loss === 'undefined' || data_loss < lowest_data_loss)) {
                    lowest_data_loss = data_loss;
                    if (!validation_loss) { // only using training data 
                        update_weights = true;
                    }
                }
                if (epoch >= warmup_epochs && 
                    (typeof lowest_validation_loss === 'undefined' ||
                     (validation_loss-lowest_validation_loss)/lowest_validation_loss < -1e-6)) {
                    // ignore progress of less than one millionth in the loss
                    lowest_validation_loss = validation_loss;
                    lowest_validation_loss_epoch = epoch;
                    if (!validation_accuracy) {
                        update_weights = true;
                    }
                }
                if (epoch >= warmup_epochs && 
                    typeof validation_accuracy === 'number' && 
                    (typeof highest_accuracy === 'undefined' || validation_accuracy > highest_accuracy)) {
                    highest_accuracy = validation_accuracy;
                    highest_accuracy_epoch = epoch;
                    if (highest_accuracy_epoch) {
                        update_weights = true;
                    }
                }
                if (update_weights) {
                    best_weights = update_best_weights(model, best_weights);
                }
                if (tfvis_callbacks) {
                    tfvis_callbacks.onEpochEnd(epoch, history);
                }
                const abort = (message) => {
                    // first restore best weights
                    if (best_weights) {
                        set_model_weights(model, best_weights);
                    }
                    const error = new Error(message);
                    error.history = epoch_history;
                    throw error;
                }
                if (stop_if_no_progress_for_n_epochs &&
                    epoch >= warmup_epochs+stop_if_no_progress_for_n_epochs && 
                    (!highest_accuracy_epoch || (epoch-highest_accuracy_epoch >= stop_if_no_progress_for_n_epochs)) &&
                    epoch-lowest_validation_loss_epoch >= stop_if_no_progress_for_n_epochs) {
                    // if there has been no progress in accuracy or loss then stop
                    // or just loss if accuracy not appropriate
                    abort("No progress for " + stop_if_no_progress_for_n_epochs + " epochs at epoch " + epoch);
                }
                if (window.stop_hyperparameter_search) {
                    abort("User stopped hyperparameter search at epoch " + epoch);
                }
            }};
      const {xs, ys, xs_validation, ys_validation, xs_test, ys_test,
             xs_array, ys_array, xs_validation_array, ys_validation_array, xs_test_array, ys_test_array} = datasets;
      const configuration = {batchSize: batch_size,
                             epochs,
                             initialEpoch,
                             validationData: xs_validation && [xs_validation, ys_validation],
                             validationSplit: validation_split,
                             shuffle,
                             classWeight: typeof tensorflow === 'object'? tensorflow.get_data(model_name, 'class_weights') : undefined,
                             callbacks: stats_callback};
      const after_fit_callback = (full_history) => {
//           console.log(tf.memory());
//           console.log(full_history);
          const {xs, ys, xs_validation, ys_validation, 
                 xs_array, ys_array, xs_validation_array, ys_validation_array, xs_test_array, ys_test_array,
                 test_and_validation_identical} 
                 = datasets;
          let xs_test = datasets.xs_test; // not a constant - need to update below in some circumstances
          let ys_test = datasets.ys_test;
//           model.ready_for_prediction = true;
          const number_of_tests = xs_test && xs_test.shape[0];
          const percentage_of_tests = (x) => +(100*x/number_of_tests).toFixed(2);
          if (tfvis_options.display_layers_after_training) {
              show_layers(model, 'Model after training', training_number);
          }
          let confusion_matrix, test_loss, test_accuracy, number_of_classes;
          // following enables confusion matrices for fine-tuning but cause out of memory problems
//           if (class_names && use_tf_datasets) {
//              if (test_and_validation_identical) {
//                   xs_test = tf.tensor(xs_validation_array);
//                   ys_test = tf.tensor(ys_validation_array);
//               } else if (xs_test_array) {
//                   xs_test = tf.tensor(xs_test_array);
//                   ys_test = tf.tensor(ys_test_array);
//               }
//           }
          if ((options.add_confusion_to_csv || tfvis_options.display_confusion_matrix) && xs_test && class_names) {
              const test_loss_tensor = model.evaluate(xs_test, ys_test);
              test_loss = test_loss_tensor[0].dataSync()[0];
              test_accuracy = test_loss_tensor[1].dataSync()[0];
              tf.dispose(test_loss_tensor); // both of them
              const predictions = model.predict(xs_test, ys_test);
              number_of_classes = class_names && class_names.length;
              confusion_matrix = class_names && 
                                 compute_confusion_matrix(predictions.dataSync(), ys_test.dataSync(), number_of_classes);
              predictions.dispose();
              if (create_tensors) {
                  xs_test.dispose();
                  ys_test.dispose();
              }
          }
          if (create_tensors && !use_tf_datasets) {
              xs.dispose();
              ys.dispose();
          }
          if (create_tensors && xs_validation && !use_tf_datasets) {
              xs_validation.dispose();
              ys_validation.dispose();
          }
          const response =
              {"Training loss": data_loss,
               "Validation loss": validation_loss,
               "Test loss": test_loss,
               "Training accuracy": data_accuracy,
               "Validation accuracy": validation_accuracy,
               "Test accuracy": test_accuracy,
               "Lowest validation loss": lowest_validation_loss,
               "Lowest validation loss epoch": lowest_validation_loss_epoch, 
               "Highest accuracy": highest_accuracy,
               "Highest accuracy epoch": highest_accuracy_epoch,
               "Last epoch": last_epoch,
               "Duration in seconds": (Date.now()-start)/1000,
              };     
          let csv_labels = // CSV for pasting into a spreadsheet
              "Name, Layer1,Layer2,Layer3,layer4,layer5, Batch size, Dropout rate, Normalizer, Epochs, Optimizer, Initializer, Regularizer," +
              "Testing fraction, Validation fraction, Fraction kept, " +
              Object.keys(response) + ", seed, ";
          if (confusion_matrix && options.add_confusion_to_csv) {
              let confusion_labels = [];
              confusion_matrix.forEach((row, i) => {
                  row.forEach((item, j) => {
                      confusion_labels.push(class_names[i] + "-" + class_names[j]);
                  });
              });
              csv_labels += confusion_labels;
              confusion_labels.map((label, index) => {
                  response[label] = percentage_of_tests(confusion_matrix[index%number_of_classes] [Math.floor(index/number_of_classes)]);
              });  
          }
          let csv_values =  model_name + ", ";
          let i = 0;
          let values_recorded = 0;
          while (i < model.layers.length) {
              if (model.layers[i].units) {
                  csv_values += model.layers[i].units + ", ";
                  values_recorded++;
                  // otherwise ignore it - e.g. dropout layer  
              }
              i++;
          }
          for (; values_recorded < 5; values_recorded++) { // 5 is the maximum number of layers the spreadsheet can handle
              csv_values += "0, "; // unused layers
          }
          csv_values += batch_size + ", ";
          csv_values += dropout_rate + ", ";
          csv_values += batch_normalization + ", ";
          csv_values += epochs + ", ";
          csv_values += options.optimizer_name + ", ";
          csv_values += options.layer_initializer_name + ", ";
          csv_values += options.regularizer_name + ", ";
          csv_values += testing_fraction + ", ";
          csv_values += validation_fraction + ", ";
          csv_values += fraction_kept + ", ";    
          csv_values += data_loss + ", ";
          csv_values += validation_loss + ", ";
          csv_values += (test_loss && test_loss.toFixed(4)) + ", ";
          csv_values += (data_accuracy && data_accuracy.toFixed(4)) + ", ";
          csv_values += (validation_accuracy && validation_accuracy.toFixed(4)) + ", ";
          csv_values += (test_accuracy && test_accuracy.toFixed(4)) + ", ";
          const x_length = xs ? xs.shape[0] : xs_array.length;
          const x_validation_length = xs_validation ? xs_validation.shape[0] : (xs_validation_array ? xs_validation_array.length : 0);
          const x_test_length = xs_test ? xs_test.shape[0] : (xs_test_array ? xs_test_array.length : 0);
          if (!x_validation_length) {
              // what about validation_split????
              csv_values += x_length + ", ";
          } else if (!x_test_length || datasets.test_and_validation_identical) {
              csv_values += x_length + x_validation_length + ", ";
          } else {
              csv_values += x_length + x_validation_length + x_test_length + ", ";
          }
          csv_values += (lowest_validation_loss && lowest_validation_loss.toFixed(4)) + ", ";
          csv_values += (lowest_validation_loss_epoch && lowest_validation_loss_epoch) + ", ";
          csv_values += (highest_accuracy && highest_accuracy.toFixed(4)) + ", ";
          csv_values += (highest_accuracy_epoch && highest_accuracy_epoch) + ", ";
          csv_values += response["Duration in seconds"] +", ";
          csv_values += options.current_seed + ", ";               
          if (confusion_matrix && options.add_confusion_to_csv) {
              confusion_matrix.forEach(row => {
                  csv_values += row.map(percentage_of_tests) + ', '; 
              });      
          }
          response["Column labels for saving results in a spreadsheet"] = csv_labels;
          response["Spreadsheet values"] = csv_values;
          response.model = model;
          response.history = full_history;               
          invoke_callback(success_callback, response);
          if (confusion_matrix && tfvis_options.display_confusion_matrix) {
              tfvis.render.confusionMatrix({name: 'Confusion Matrix',
                                            tab: tab_label('Confusion', training_number)},
                                           {values: confusion_matrix,
                                            tickLabels: class_names});
          }
          if (confusion_matrix && tfvis_options.display_collapsed_confusion_matrix) { // special to Onyx
              tfvis.render.confusionMatrix({name: 'Confusion Matrix GP or not',
                                            tab: tab_label('Charts', training_number)},
                                           {values: collapse_confusion_matrix(confusion_matrix, 
                                                                              tfvis_options.display_collapsed_confusion_matrix.indices),
                                            tickLabels: tfvis_options.display_collapsed_confusion_matrix.labels});
          }
//           if (model.callback_when_ready_for_prediction) {
//               model.callback_when_ready_for_prediction();
//               model.callback_when_ready_for_prediction = undefined;
//           }
       };
       const fit_error_handler = (error) => {
           if (error.message.indexOf('No progress for ') >= 0 || 
               error.message.indexOf('User stopped hyperparameter search ') >= 0) {
               console.log(error.message);
               invoke_callback(after_fit_callback, error.history);
           } else {
               if (failure_callback) {
                   invoke_callback(failure_callback, error);
               } else {
                   throw error;
               }
           } 
       };
       record_callbacks(after_fit_callback);
       const start = Date.now();
       const then = (full_history) => invoke_callback(after_fit_callback, full_history);
       if (datasets.use_tf_datasets) {
           configuration.validationData = datasets.validation;
           model.fitDataset(datasets.train, configuration).then(then, fit_error_handler);
       } else {
           model.fit(datasets.xs, datasets.ys, configuration).then(then, fit_error_handler);
       }           
     } catch(error) {
         if (failure_callback) {
             invoke_callback(failure_callback, error);
         } else {
             throw error;
         }
     } 
};

const reload_datasets_button = document.createElement('button');

const load_slice = (options, callback) => {
    const datasets = options.datasets;
    tf.dispose(datasets.xs);
    tf.dispose(datasets.ys);
    tf.dispose(datasets.xs_validation);
    tf.dispose(datasets.ys_validation);
    tf.dispose(datasets.xs_test);
    tf.dispose(datasets.ys_test);
    options.datasets = undefined; 
    reload_datasets_button.innerHTML = "Loading slice #" + options.slice_number;
    options.replace_datasets(options,
                             () => {
                                 options.datasets = collect_datasets(options);
                                 split_data(model_options.datasets, options, 1); // 1 because already cut out fraction_kept
                                 reload_datasets_button.innerHTML = reload_datasets_label;
                                 if (callback) {
                                     callback();
                                 }
                             });
};

const redo_training = (model, options, callback, failure_callback) => {
    options.initialEpoch = options.number_of_training_epochs + (options.initialEpoch || 0);
    options.epochs = options.initialEpoch + options.number_of_training_epochs; // epochs is really the stop epoch
    train_model(model, options.datasets, options,
                (results) => {
                    options.success_callback(results, callback);
                },
                failure_callback);
};

const predict = (model, inputs, success_callback, error_callback, categories) => {
    if (!model) {
        invoke_callback(error_callback, "No model provided for prediction. Maybe the name is wrong.");
        return;
    }
    if (!inputs || inputs.length === 0) {
        invoke_callback(error_callback, "No input for prediction");
        return;
    }
    record_callbacks(success_callback, error_callback);
//     if (!model.ready_for_prediction) {
//         let previous_callback = model.callback_when_ready_for_prediction;
//         model.callback_when_ready_for_prediction = 
//             () => {
//                 if (previous_callback) {
//                     invoke_callback(previous_callback);
//                 }
//                 predict(model, inputs, success_callback, error_callback, categories);
//         };
//         record_callbacks(model.callback_when_ready_for_prediction);
//         return;
//     }
    try {
        let input_tensor;
        if (typeof inputs[0] === 'number') {
            input_tensor = tf.tensor2d(inputs, [inputs.length, 1]);
        } else {
            input_tensor = tf.tensor2d(inputs); 
        }
        if (model.normalization_factor) {
            const new_input_tensor = input_tensor.div(tf.scalar(model.normalization_factor));
            input_tensor.dispose();
            input_tensor = new_input_tensor;
        }
        let prediction = model.predict(input_tensor);
        const results = prediction.arraySync().map((element) => Array.isArray(element) && element.length === 1 ?
                                                                element[0] : element);
        if (categories) {
            invoke_callback(success_callback, categorical_results(results, categories));
        } else {
            invoke_callback(success_callback, results);
        }
    } catch (error) {
        invoke_callback(error_callback, enhance_error_message(error.message));
    }
};

const enhance_error_message = (error_message) => {
    const expected_shape_error_fragment = 'to have shape [null,';
    const expected_shape_error_index = error_message.indexOf(expected_shape_error_fragment);
    let explanation = '';
    if (expected_shape_error_index > 0) {
        const opening_bracket_index = error_message.indexOf('[', expected_shape_error_index);
        const closing_bracket_index = error_message.indexOf(']', opening_bracket_index);
        explanation = ' What is meant by ' + 
                      error_message.substring(opening_bracket_index, closing_bracket_index+1) +
                      ' is that the system expected a LIST of values with the shape [' +
                      error_message.substring(opening_bracket_index+'[null,'.length, closing_bracket_index+1);
    }
    return error_message + explanation;
};

const categorical_results = (results, categories) => 
    results.map((result) => {
        const result_as_object = {};
        categories.forEach((category, index) => {
            result_as_object[category] = result[index];
        })
        return result_as_object;
});

const shape_of_data = (data) => {
   if (typeof data === 'number') {
       return [1];
   } else if (typeof data[0] === "number") {
      return [data.length];
   } else {
      return [data.length].concat(shape_of_data(data[0]));
   }
};

const loss_measure = (results) =>
    results["Highest accuracy"] && -results["Highest accuracy"] || // minimize negative accuracy
    results['Lowest validation loss'] || 
    results['Validation loss'] || 
    results['Lowest training loss'] || 
    results['Training loss'];

let experiment_number = 0;

const hyperparameter_search = (options, datasets, success_callback, error_callback) => {
    experiment_number = 0;
    let previous_model;
    let lowest_loss;
    let best_model;
    options.datasets = datasets; // in case needed to compute input_shape
    if (!!datasets.xs_array) {
        // datasets are JavaScript arrays (prior to possible splitting) so compute tensor version
        update_tensors(datasets, options.batch_size);
    }
    const create_and_train = async (search_options) => {
        const new_options = Object.assign({}, options, search_options);
        set_random_number_seed(new_options);
        let model = create_model(new_options);
        return new Promise((resolve) => {
            train_model(model,
                        datasets,
                        new_options,
                        (results, callback) => {
                            experiment_number++;
                            previous_model = model;
                            let loss = loss_measure(results);
                            if (isNaN(loss)) {
                                loss = Number.MAX_VALUE;
                            }
                            if (loss < lowest_loss || typeof lowest_loss === 'undefined') {
                                lowest_loss = loss;
                                if (best_model && !best_model.disposed) {
                                    best_model.dispose();
                                    best_model.disposed = true;
                                }
                                best_model = model;
                            }
                            resolve({loss,
                                     results,
                                     best_model,
                                     status: hpjs.STATUS_OK});
                            if (callback) {
                                callback();
                            }
                        },
                        (error) => {
                            if (error.message !== not_a_number_error_message) {
                                stop_hyperparameter_search = true;
                                log(error);
                                invoke_callback(error_callback, error);
                            }
                            resolve({loss: Number.MAX_VALUE,
                                     status: hpjs.STATUS_OK});
                        });
            });
    };
    const space = options.search.space;
    Object.entries(space).forEach(([key, value]) => {
        space[key] = hpjs.choice(value);
    });
    if (model_options.on_experiment_end) {
        options.callbacks = {onExperimentBegin: 
                                () => window.stop_hyperparameter_search, // stop if this has been set
                             onExperimentEnd: model_options.on_experiment_end};
    }
    hpjs.fmin(create_and_train,
              space,
              hpjs.search[options.search.type],
              options.search.number_of_experiments,
              options)
        .then(success_callback)
        .catch(error_callback);
};
