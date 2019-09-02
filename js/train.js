/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

// Based on https://github.com/tensorflow/tfjs-examples/blob/master/webcam-transfer-learning/index.js

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

let tfjs_vis_surface;

const create_and_train_model = (datasets, options, success_callback, failure_callback) => {
    options.datasets = datasets; // in case needed to compute input_shape
    const model = create_model(options, failure_callback);
    train_model(model, datasets, options, success_callback, failure_callback);
};

const create_model = (options, failure_callback) => {
    try {
        const {model_name, class_names, hidden_layer_sizes, drop_out_rate, optimizer, layer_initializer, regularizer, 
               loss_function, activation, last_activation, seed, datasets} = options;
        let {input_shape, output_size} = options;
        if (!input_shape) {
            if (datasets) {
                input_shape = shape_of_data(datasets.xs_array[0]);
            }
        }
        if (!input_shape) {
            throw new Error("Unable to create a model without knowing the shape of the input. Shape not provided and input data not known.");
        }
        if (!output_size) {
            if (datasets) {
                output_size = typeof datasets.ys_array[0] === 'number' ? 1 : datasets.ys_array[0].length;
            }
        }
        // Creates a fully connected model. By creating a separate model,
        // rather than adding layers to the mobilenet model, we "freeze" the weights
        // of the mobilenet model, and only train weights from the new model.
        const model = tf.sequential({name: model_name});
        const tfjs_function = (fun, function_table, layer_index) => {
            if (!fun) {
                return;
            }
            if (typeof fun === 'string') {
                return function_table[fun]();
            }
            return fun(layer_index);
        };
        // if output_size isn't provided then assume user specified it as the last hidden_layer_sizes
        if (!output_size) {
            output_size = hidden_layer_sizes.splice(-1)[0]; // remove last item and use it as the output_size
        }
        hidden_layer_sizes.forEach((size, index) => {
             const kernelRegularizer = tfjs_function(regularizer, tf.regularizers, index);
             const kernelInitializer = tfjs_function(layer_initializer, tf.initializers, index);
             const activation_function = tfjs_function(activation, tf, index) || 'relu';
             model.add(tf.layers.dense({inputShape: index === 0 ? input_shape : undefined,
                                        units: +size,
                                        activation_function,
                                        kernelInitializer,
//                                         biasInitializer: kernelInitializer,
                                        kernelRegularizer,
                                        useBias: true,
                                       }));
             if (drop_out_rate > 0) {
                 // Error: Non-default seed is not implemented in Dropout layer yet: 1
                 model.add(tf.layers.dropout({rate: drop_out_rate,
                                              seed: SEED}));
             }
        });
        // last layer. The number of units of the last layer should correspond
        // to the output size (number of classes if categorical)
        model.add(tf.layers.dense({units: +output_size,
                                   kernelInitializer: tfjs_function(layer_initializer, tf.initializers, hidden_layer_sizes.length),
                                   useBias: false,
                                   activation: last_activation || (class_names && 'softmax')
                                  }));
        // We use categoricalCrossentropy which is the loss function we use for
        // categorical classification which measures the error between our predicted
        // probability distribution over classes (probability that an input is of each
        // class), versus the label (100% probability in the true class)
        model.compile({optimizer: typeof optimizer === 'string' ? optimizer : optimizer(),
                       loss: loss_function || (class_names ? 'categoricalCrossentropy' : 'meanSquaredError'),
                       metrics: class_names && ['accuracy']});
        return model;
  } catch (error) {
      if (failure_callback) {
          failure_callback(error);
       } else {
          throw error;
       }
  }
};

const train_model = (model, datasets, options, success_callback, failure_callback) => {
    try {
        let {xs_array, ys_array, xs_validation_array, ys_validation_array, xs_test_array, ys_test_array} = datasets;
        const {class_names, hidden_layer_sizes, batch_size, shuffle, epochs, validation_split, learning_rate, drop_out_rate, optimizer,
               layer_initializer, training_number, regularizer, seed, stop_if_no_progress_for_n_epochs,
               testing_fraction, validation_fraction, fraction_kept,
               tfvis_options} 
              = options;
        const model_name = model.name;
        const splitting_data = (!xs_validation_array ||  xs_validation_array.length === 0) && // no validation data provided
              typeof validation_fraction === 'number' && 
              typeof testing_fraction === 'number';
        const original_xs = xs_array;
        const original_ys = ys_array;
        const split_data = () => {
            // if I want reproducability I should use tf.randomUniform with a seed
            let xs_ys = original_xs.map((x, index) => [x, original_ys[index]]);
            tf.util.shuffle(xs_ys); // this is a better shuffle but unlike the following has no random seed for reproducability
    //         shuffle(xs_ys, SEED);
            if (fraction_kept < 1) {
                xs_ys.splice(Math.round((1-fraction_kept)*xs_ys.length));
            }
            xs_ys = xs_ys.sort((a, b) => a[1].indexOf(1)-b[1].indexOf(1)); // sort by class to make equal quantities
            const find_start = (class_index) => {
                for (let i = 0; i < xs_ys.length; i++) {
                    if (xs_ys[i][1] === class_index) {
                        return i;
                    }
                }
            };
            const starts = class_names.map((ignore, class_index) => find_start(class_index));
            const validation_count = Math.round(validation_fraction*xs_ys.length);
            const validation_count_per_class = Math.round(validation_count/class_names.length);
            const test_count = Math.round(testing_fraction*xs_ys.length);
            const test_count_per_class = Math.round(test_count/class_names.length);
            const new_count = xs_ys.length-(validation_count_per_class+test_count_per_class)*class_names.length;
            const validation_ends = starts.map((start) => start+validation_count_per_class);
            let xs_ys_validation = [];
            validation_ends.forEach((end, index) => {
                xs_ys_validation = xs_ys_validation.concat(xs_ys.slice(starts[index], end));
            });
            const test_ends = validation_ends.map((start) => start+test_count_per_class);
            let xs_ys_test = [];
            test_ends.forEach((end, index) => {
                xs_ys_test = xs_ys_test.concat(xs_ys.slice(validation_ends[index], end));
            });
            let new_xs_ys = [];
            starts.push(xs_ys.length); // so starts [index+1] is the end of the class
            test_ends.forEach((test_end, index) => {
                new_xs_ys = new_xs_ys.concat(xs_ys.slice(test_ends[index], starts[index+1]));
            });
            xs_validation_array = xs_ys_validation.map((x_y) => x_y[0]);
            ys_validation_array = xs_ys_validation.map((x_y) => x_y[1]);
            xs_test_array = xs_ys_test.map((x_y) => x_y[0]);
            ys_test_array = xs_ys_test.map((x_y) => x_y[1]);
            if (xs_test_array.length === 0) {
                // if not setting aside test data then use validation for confusion matrix etc.
                xs_test_array = xs_validation_array;
                ys_test_array = ys_validation_array;
            }
            xs_array = new_xs_ys.map((x_y) => x_y[0]);
            ys_array = new_xs_ys.map((x_y) => x_y[1]);
        };
        if (splitting_data) {
            split_data();
        }
        const xs = tf.tensor(xs_array);
        const ys = tf.tensor(ys_array);
        const xs_validation = xs_validation_array && xs_validation_array.length > 0 && tf.tensor(xs_validation_array);
        const ys_validation = ys_validation_array && ys_validation_array.length > 0 && tf.tensor(ys_validation_array);
        const xs_test = xs_test_array && xs_test_array.length > 0 && tf.tensor(xs_test_array);
        const ys_test = ys_test_array && ys_test_array.length > 0 && tf.tensor(ys_test_array);
        const surface = tfjs_vis_surface || (tfvis_options && tfvis && tfvis.visor().surface({name: model_name, tab: 'Training#' + training_number}));
        tfjs_vis_surface = surface; // re-use same one accross multiple calls
        // callbacks based upon https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
        let epoch_history = [];
        const metrics = ['loss', 'val_loss'];
        if (tfvis_options && tfvis_options.measure_accuracy) {
            metrics.push('acc');
            metrics.push('val_acc');
        };
        if (learning_rate) {
            model.optimizer.learningRate = learning_rate;
        }
        const container = tfvis_options &&
                          {name: tfvis_options.measure_accuracy ? 'Loss and accuracy' : 'Loss',
                           tab: 'Training#' + training_number,
                           styles: { height: '800px' }};
        const tfvis_callbacks = tfvis_options && tfvis.show.fitCallbacks(container, metrics, tfvis_options);
        // auto_stop replaced by the more controllable stop_if_no_progress_for_n_epochs
        //  const stop_early_callbacks = auto_stop && tf.callbacks.earlyStopping();
        let data_loss;
        let validation_loss;
        let data_accuracy;
        let validation_accuracy;
        let lowest_validation_loss;
        let lowest_validation_loss_epoch;
        let highest_accuracy;
        let highest_accuracy_epoch;
        let highest_accuracy_weights = [];
        let last_epoch = 0;
        const stats_callback = 
            {onEpochEnd: async (epoch, history) => {
                epoch_history.push(history);
                last_epoch = epoch;
                data_loss = history.loss;
                validation_loss = history.val_loss;
                data_accuracy = history.acc;
                validation_accuracy = history.val_acc;
                if (typeof lowest_validation_loss === 'undefined' || validation_loss < lowest_validation_loss) {
                    lowest_validation_loss = validation_loss;
                    lowest_validation_loss_epoch = epoch;
                }
                if (validation_accuracy && (typeof highest_accuracy === 'undefined' || validation_accuracy > highest_accuracy)) {
                    highest_accuracy = validation_accuracy;
                    highest_accuracy_epoch = epoch;
                    if (highest_accuracy_epoch) {
                        highest_accuracy_weights.forEach((layer_weights) => {
                            layer_weights.forEach((tensor) => {
                                tensor.dispose();
                            });
                        });
                        highest_accuracy_weights = [];
                        model.layers.forEach((layer) => {
                            highest_accuracy_weights.push(layer.getWeights().map(tf.clone));
                        });                  
                    }
                }
                if (tfvis_callbacks) {
                    tfvis_callbacks.onEpochEnd(epoch, history);
                }
                if (stop_if_no_progress_for_n_epochs &&
                    (!highest_accuracy_epoch || (epoch-highest_accuracy_epoch >= stop_if_no_progress_for_n_epochs)) &&
                    epoch-lowest_validation_loss_epoch >= stop_if_no_progress_for_n_epochs) {
                    // if there has been no progress in accuracy or loss then stop
                    // or just loss if accuracy not appropriate
                    // first restore best weights
                    model.layers.forEach((layer, index) => {
                        layer.setWeights(highest_accuracy_weights[index]);
                    });  
                    throw new Error("No progress for " + stop_if_no_progress_for_n_epochs + " epochs at epoch " + epoch);
                }
            }};
      const config = {batch_size,
                      epochs,
                      validationData: xs_validation && [xs_validation, ys_validation],
                      validation_split,
                      shuffle,
                      callbacks: stats_callback};
      const after_fit_callback = () => { 
         const percentage_of_tests = (x) => +(100*x/xs_test_array.length).toFixed(2);
         const show_layers = () => {
             const surface = {name: 'Layers', tab: 'Model inspection#' + training_number};
             tfvis.show.modelSummary(surface, model);
             for (let i = 0; i < model.layers.length; i++) {
                 tfvis.show.layer(surface, model.getLayer(undefined, i));
             } 
         };
         if (tfvis_options && tfvis_options.display_layers) {
             show_layers();
         }
         let confusion_matrix, test_loss, test_accuracy, number_of_classes;
         if (xs_test && class_names) {
             const test_loss_tensor = model.evaluate(xs_test, ys_test);
             test_loss = test_loss_tensor[0].dataSync()[0];
             test_accuracy = test_loss_tensor[1].dataSync()[0];
             const predictions = model.predict(xs_test, ys_test);
             number_of_classes = class_names && class_names.length;
             confusion_matrix = class_names && tfvis_options.display_confusion_matrix &&
                                compute_confusion_matrix(predictions.dataSync(), ys_test.dataSync(), number_of_classes);
             predictions.dispose();
             tf.dispose(test_loss_tensor); // both of them 
             xs_test.dispose();
             ys_test.dispose();              
         }
         xs.dispose();
         ys.dispose();
         if (xs_validation) {
             xs_validation.dispose();
             ys_validation.dispose();
         }
         const response =
             {"Training loss ": data_loss,
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
             };     
         let csv_labels = // CSV for pasting into a spreadsheet
             "Name, Layer1,Layer2,Layer3,layer4,layer5, Batch size, Dropout rate, Epochs, Optimizer, Initializer, Regularizer," +
             "Testing fraction, Validation fraction, Fraction kept, " +
             Object.keys(response) + ", ";
         if (confusion_matrix) {
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
         csv_values += drop_out_rate + ", ";
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
         if (!xs_validation_array) {
             // what about validation_split????
             csv_values += xs_array.length + ", ";
         } else if (xs_validation_array === xs_test_array) {
             csv_values += xs_array.length + xs_validation_array.length + ", ";
         } else {
             csv_values += xs_array.length + xs_validation_array.length + xs_test_array.length + ", ";
         }
         csv_values += (lowest_validation_loss && lowest_validation_loss.toFixed(4)) + ", ";
         csv_values += (lowest_validation_loss_epoch && lowest_validation_loss_epoch) + ", ";
         csv_values += (highest_accuracy && highest_accuracy.toFixed(4)) + ", ";
         csv_values += (highest_accuracy_epoch && highest_accuracy_epoch) + ", ";
         if (confusion_matrix) {
             confusion_matrix.forEach(row => {
                 csv_values += row.map(percentage_of_tests) + ', '; 
             });      
         }
         response.csv_labels = csv_labels;
         response.csv_values = csv_values;
         response.model = model;
         if (success_callback) {
             success_callback(response);
         }
         if (confusion_matrix) {
             tfvis.render.confusionMatrix({name: 'Confusion Matrix All',
                                           tab: 'Charts#' + training_number},
                                          {values: confusion_matrix,
                                           tickLabels: class_names});
             if (tfvis_options.display_collapsed_confusion_matrix) {
                 tfvis.render.confusionMatrix({name: 'Confusion Matrix GP or not',
                                               tab: 'Charts#' + training_number},
                                              {values: collapse_confusion_matrix(confusion_matrix, 
                                                                                 tfvis_options.display_collapsed_confusion_matrix.indices),
                                               tickLabels: tfvis_options.display_collapsed_confusion_matrix.labels});
             }
         } 
      };
      const fit_error_handler = (error) => {
          if (error.message.indexOf('No progress for ') >= 0) {
              console.log(error.message);
              after_fit_callback();
          } else {
              if (failure_callback) {
                  failure_callback(error);
              } else {
                  throw error;
              }
          }
      };
      model.fit(xs, ys, config).then(after_fit_callback, fit_error_handler);
    } catch(error) {
        if (failure_callback) {
            failure_callback(error);
        } else {
            throw error;
        }
    }
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




