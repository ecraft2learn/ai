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
    for (let i = 0; i < predictions.length; i += 3) {
        const prediction_value = index_of_max(predictions.slice(i,i+3));
        const truth_value = index_of_max(truth.slice(i,i+3));
        matrix[truth_value][prediction_value]++;
    }
    return matrix;
};

const combine_normal_and_non_serious = (matrix_3x3) => {
    const serious = 2;
    const matrix_2x2 = [[0, 0], [0, 0]];
    matrix_2x2[0][0] = matrix_3x3[0][0]+matrix_3x3[0][1]+matrix_3x3[1][0]+matrix_3x3[1][1];
    matrix_2x2[0][1] = matrix_3x3[0][2]+matrix_3x3[1][2];
    matrix_2x2[1][0] = matrix_3x3[2][0]+matrix_3x3[2][1];
    matrix_2x2[1][1] = matrix_3x3[2][2];
    return matrix_2x2;
};

let tfjs_vis_surface;

const train_model = (xs_array, ys_array, xs_validation_array, ys_validation_array, xs_test_array, ys_test_array, options, callback) => {
    const {model_name, class_names, hidden_layer_sizes, batch_size, epochs, drop_out_rate, optimizer, layer_initializer} 
          = options;
    let model;
    const input_size = xs_array[0].length;
    const number_of_classes = class_names.length;
    const xs = tf.tensor(xs_array);
    const ys = tf.tensor(ys_array);
    const xs_validation = tf.tensor(xs_validation_array);
    const ys_validation = tf.tensor(ys_validation_array);
    const xs_test = tf.tensor(xs_test_array);
    const ys_test = tf.tensor(ys_test_array);

    const surface = tfjs_vis_surface || (tfvis && tfvis.visor().surface({name: model_name, tab: 'Training'}));
    tfjs_vis_surface = surface;
    // callbacks based upon https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
    let epoch_history = [];
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {name: 'Loss and accuracy',
                       tab: 'Training',
                       styles: { height: '600px' }};
    const ftfvis_options = {callbacks: ['onEpochEnd'],
                            yAxisDomain: [.2, .5],
                            height: 300};
    let callbacks = tfvis ? tfvis.show.fitCallbacks(container, metrics, ftfvis_options) : {};
    let data_loss;
    let validation_loss;
    let data_accuracy;
    let validation_accuracy;
    let lowest_validation_loss = 100000;
    let lowest_validation_loss_epoch;
    let highest_accuracy = 0;
    let highest_accuracy_epoch;
    if (tfvis) {
        const epoch_end_callback = callbacks.onEpochEnd;
        callbacks.onEpochEnd = (epoch, history) => {
            if (epoch_end_callback) {
                epoch_end_callback(epoch, history);
            }
            epoch_history.push(history);
            data_loss = history.loss;
            validation_loss = history.val_loss;
            data_accuracy = history.acc;
            validation_accuracy = history.val_acc;
            if (validation_loss < lowest_validation_loss) {
                lowest_validation_loss = validation_loss;
                lowest_validation_loss_epoch = epoch;
            }
            if (validation_accuracy > highest_accuracy) {
                highest_accuracy = validation_accuracy;
                highest_accuracy_epoch = epoch;
            }
        };      
    }
/**
 * Sets up and trains the classifier.
 */
  // Creates a fully connected model. By creating a separate model,
  // rather than adding layers to the mobilenet model, we "freeze" the weights
  // of the mobilenet model, and only train weights from the new model.
  model = tf.sequential({name: model_name});
  hidden_layer_sizes.forEach((size, index) => {
       model.add(tf.layers.dense({inputShape: index === 0 ? input_size : undefined,
                                  units: size,
                                  activation: 'relu',
                                  kernelInitializer: layer_initializer(index),
                                  useBias: true
                                 }));
       if (drop_out_rate > 0) {
           model.add(tf.layers.dropout(drop_out_rate));
       }
  });
  // last layer. The number of units of the last layer should correspond
  // to the number of classes we want to predict.
  model.add(tf.layers.dense({units: number_of_classes,
                             kernelInitializer: layer_initializer(hidden_layer_sizes.length),
                             useBias: false,
                             activation: 'softmax'
                            }));
  // We use categoricalCrossentropy which is the loss function we use for
  // categorical classification which measures the error between our predicted
  // probability distribution over classes (probability that an input is of each
  // class), versus the label (100% probability in the true class)>
  model.compile({optimizer: optimizer(),
                 loss: 'categoricalCrossentropy',
                 metrics: ['accuracy']});

  // Train the model! Model.fit() will shuffle xs & ys so we don't have to.
  model.fit(xs, ys, {
    batch_size,
    epochs: epochs,
//     validationSplit: .2,
    validationData: [xs_validation, ys_validation],
    shuffle: true,
    callbacks: callbacks}).then(() => {
       const save_model = async () => {
          return await model.save('downloads://' + model_name);
       };
       const button = document.createElement('button');
       button.innerHTML = "Save model";
       button.className = "save-training-button";
       button.addEventListener('click', save_model);
       document.body.appendChild(button);
       const test_loss_tensor = model.evaluate(xs_test, ys_test);
       const test_loss = test_loss_tensor[0].dataSync()[0];
       const test_accuracy = test_loss_tensor[1].dataSync()[0];
       tf.dispose(test_loss_tensor); // both of them
       const response =
           {"Data loss ": data_loss,
            "Validation loss": validation_loss,
            "Test loss": test_loss,
            "Data accuracy": data_accuracy,
            "Validation accuracy": validation_accuracy,
            "Test accuracy": test_accuracy,
            "Lowest validation loss": lowest_validation_loss,
            "Lowest validation loss epoch": lowest_validation_loss_epoch, 
            "Highest accuracy": highest_accuracy,
            "Highest accuracy epoch": highest_accuracy_epoch
           };
       const test_loss_message = document.createElement('p');      
       let results = // CSV for pasting into a spreadsheet
           "<br>Name, Layer1,Layer2,Layer3,layer4,layer5, Batch size, Dropout rate, Epochs, Optimizer, Initializer, " +
           "Testing fraction, Validation fraction, Fraction kept, " +
           "Data loss, Validation loss, Test loss, Data accuracy, Validation accuracy, Test accuracy, Image count, " +
           "Lowest validation loss, Lowest validation loss epoch, Highest accuracy, Highest accuracy epoch";
       results += "<br>";
       results +=  model_name + ", ";
       for (let i = 0; i < 5; i++) {
           if (i < hidden_layer_sizes.length) {
               results += hidden_layer_sizes[i];
           } else {
               results += 0;
           }
           results += ", ";
       }
       results += batch_size + ", ";
       results += drop_out_rate + ", ";
       results += epochs + ", ";
       results += options.optimizer_name + ", ";
       results += options.layer_initializer_name + ", ";
       results += testing_fraction + ", ";
       results += validation_fraction + ", ";
       results += fraction_kept + ", ";
       results += data_loss + ", ";
       results += validation_loss + ", ";
       results += test_loss + ", ";
       results += data_accuracy + ", ";
       results += validation_accuracy + ", ";
       results += test_accuracy + ", ";
       results += xs_array.length + xs_validation_array.length + xs_test_array.length + ", ";
       results += lowest_validation_loss + ", ";
       results += lowest_validation_loss_epoch + ", ";
       results += highest_accuracy + ", ";
       results += highest_accuracy_epoch + ", ";
       test_loss_message.innerHTML = results;                  
       document.body.appendChild(test_loss_message);
       if (callback) {
           callback(response);
       }
       const predictions = model.predict(xs_test, ys_test);
       const matrix = compute_confusion_matrix(predictions.dataSync(), ys_test.dataSync(), number_of_classes);
       predictions.dispose();
//        tf.dispose(model); // still may want to save it if it is a good one
       tfvis.render.confusionMatrix({name: 'Confusion Matrix All',
                                     tab: 'Charts'},
                                    {values: matrix,
                                     tickLabels: class_names});
       tfvis.render.confusionMatrix({name: 'Confusion Matrix GP or not',
                                     tab: 'Charts'},
                                    {values: combine_normal_and_non_serious(matrix),
                                     tickLabels: ['ok', 'serious']});
  });

};




