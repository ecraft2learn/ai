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

const train_model = (xs_array, ys_array, xs_validation_array, ys_validation_array, xs_test_array, ys_test_array, options, callback) => {
    const {model_name, hidden_layer_sizes, batch_size_fraction, epochs, drop_out_rate, optimizer} = options;
    let model;
    const input_size = xs_array[0].length;
    const number_of_classes = ys_array[0].length;
    const xs = tf.tensor(xs_array);
    const ys = tf.tensor(ys_array);
    const xs_validation = tf.tensor(xs_validation_array);
    const ys_validation = tf.tensor(ys_validation_array);
    const xs_test = tf.tensor(xs_test_array);
    const ys_test = tf.tensor(ys_test_array);

    const surface = tfvis && tfvis.visor().surface({name: model_name, tab: 'Training'});
    // callbacks based upon https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
    let epoch_history = [];
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {name: 'Loss and accuracy',
                       tab: 'Training',
                       styles: { height: '600px' }};
    let callbacks = tfvis ? tfvis.show.fitCallbacks(container, metrics, {callbacks: ['onEpochEnd']})
                                       : {};
    let data_loss;
    let validation_loss;
    let data_accuracy;
    let validation_accuracy;
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
//             console.log(batch, logs);
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
                                  kernelInitializer: index === 0 ? 'varianceScaling' : undefined,
                                  useBias: true
                                 }));
       if (drop_out_rate > 0) {
           model.add(tf.layers.dropout(drop_out_rate));
       }
  });
  // last layer. The number of units of the last layer should correspond
  // to the number of classes we want to predict.
  model.add(tf.layers.dense({units: number_of_classes,
                             kernelInitializer: 'varianceScaling', // 'leCunNormal',
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

  // We parameterize batch size as a fraction of the entire dataset because the
  // number of examples that are collected depends on how many examples the user
  // collects. This allows us to have a flexible batch size.
  const batchSize =
      Math.floor(input_size * batch_size_fraction);
  if (!(batchSize > 0)) {
    throw new Error(
        `Batch size is 0 or NaN. Please choose a non-zero fraction.`);
  }

  // Train the model! Model.fit() will shuffle xs & ys so we don't have to.
  model.fit(xs, ys, {
    batchSize,
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
       const test_loss = model.evaluate(xs_test, ys_test);
       const test_loss_message = document.createElement('p');
       test_loss_message.innerHTML = "Data loss = " + data_loss
                                     + "; Validation loss = " + validation_loss
                                     + "; Data accuracy = " + data_accuracy
                                     + "; Validation accuracy = " + validation_accuracy
                                     + "; Test loss = " + test_loss[0].dataSync()[0]
                                     + "; Test accuracy = " + test_loss[1].dataSync()[0];
       document.body.appendChild(test_loss_message);
       if (callback) {
           callback(model);
       }
  });

};




