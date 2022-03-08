 /**
 * Responds to posted messages connecting with the TensorFlow KNN model
 * https://github.com/tensorflow/tfjs-models/tree/master/knn-classifier
 * Authors: Ken Kahn
 * License: New BSD
 */

let classifiers = {};

const listen_for_messages = (event) => {
    if (typeof event.data.add_example_to_knn_classifier !== 'undefined') {
        const payload = event.data.add_example_to_knn_classifier;
        const data = payload.data;
        // timestamp used to respond appropriately to multiple outstanding requests
        const time_stamp = payload.time_stamp;
        const label = payload.label;
        const classifier_name = payload.classifier_name;
        let classifier = classifiers[classifier_name];
        if (!classifier) {
            classifier = knnClassifier.create();
            classifiers[classifier_name] = classifier;
        }
        classifier.addExample(tf.tensor(data), label);
    } else if (typeof event.data.classify !== 'undefined') {
        const data = tf.tensor(event.data.classify.data);
        // timestamp used to respond appropriately to multiple outstanding requests
        const time_stamp = event.data.classify.time_stamp;
        const top_k = event.data.classify.top_k;
        const classifier_name = event.data.classify.name;
        const classifer = classifiers[classifier_name];
        if (classifer) {
            classifier.classify(data, top_k).then(predictions => {
                window.parent.postMessage({classify_response:
                                           {classifications: predictions,
                                            time_stamp}},
                                         '*');
                data.dispose();
            });         
        } else {
            window.parent.postMessage({error_message: 'No classifier named "' + name + 
                                                      '" created. Use "add example" to create one.'});
        }
    }
};

window.addEventListener('DOMContentLoaded', 
                        () => {
                            window.addEventListener("message", 
                                                    (event) => {
                                                        try {
                                                            listen_for_messages(event);
                                                        } catch(error) {
                                                            console.log(error);
                                                            event.source.postMessage({detection_failed: true,
                                                                                      error_message: error.message}, "*"); 
                                                        }
                                                    });
                            window.parent.postMessage("Ready", "*");
                        });


