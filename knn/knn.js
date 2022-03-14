 /**
 * Responds to posted messages connecting with the TensorFlow KNN model
 * https://github.com/tensorflow/tfjs-models/tree/master/knn-classifier
 * Authors: Ken Kahn
 * License: New BSD
 */

let classifiers = {};

const get_classifier = (name) => {
    let classifier = classifiers[name];
    if (!classifier) {
        classifier = knnClassifier.create();
        classifiers[name] = classifier;
    }
    return classifier;
};

const listen_for_messages = (event) => {
    if (typeof event.data.add_example_to_knn_classifier !== 'undefined') {
        const payload = event.data.add_example_to_knn_classifier;
        const data = payload.data;
        // timestamp used to respond appropriately to multiple outstanding requests
        const time_stamp = payload.time_stamp;
        const label = payload.label;
        const classifier_name = payload.classifier_name;
        const classifer = get_classifier(classifier_name);
        if (Number.isFinite(data[0])) {
            classifer.addExample(tf.tensor(data), label);
        } else {
            data.forEach(example => {
                classifer.addExample(tf.tensor(example), label);
            });
        }
        window.parent.postMessage({example_added: true,
                                   time_stamp},
                                  '*');   
    } else if (typeof event.data.classify_using_knn_classifier !== 'undefined') {
        const payload = event.data.classify_using_knn_classifier;
        const data = payload.data;
        // timestamp used to respond appropriately to multiple outstanding requests
        const time_stamp = payload.time_stamp;
        const top_k = payload.top_k;
        const classifier_name = payload.classifier_name;
        const classifier = classifiers[classifier_name];
        if (classifier) {
            const data_tensor = tf.tensor(data);
            classifier.predictClass(data_tensor, top_k).then(predictions => {
                window.parent.postMessage({classify_response:
                                           {classifications: predictions,
                                            time_stamp}},
                                         '*');
                data_tensor.dispose();
            },
            (error) => {
                console.log(error);
                event.source.postMessage({classification_failed: true,
                                          error_message: error.message}, "*");
            });
        } else {
            window.parent.postMessage({error_message: 'No classifier named "' + classifier_name + 
                                                      '" exists. Use "add example" to create one.'});
        }
    } else if (typeof event.data.clear_or_dispose_knn_classifier !== 'undefined') {
        const payload = event.data.clear_or_dispose_knn_classifier;
        const {labels, dispose, classifier_name, time_stamp} = payload;
        const classifier = classifiers[classifier_name];
        if (classifier) {
            if (dispose) {
                classifier.dispose();
                classifiers[classifier_name] = undefined;
            } else if (labels.length === 0) {
                classifier.clearAllClasses();
            } else if (labels instanceof Array) {
                labels.forEach(label => {
                    classifier.clearClass(label);
                });
            } else {
                classifier.clearAllClasses();
            }
        } else {
            window.parent.postMessage({error_message: 'No classifier named "' + classifier_name + 
                                                      '" exists. Use "add example" to create one.'});
        }
    } else if (typeof event.data.get_knn_classifier_info != 'undefined') {
        const payload = event.data.get_knn_classifier_info;
        const {classifier_name, number_of_examples, number_of_classes, dataset, time_stamp} = payload;
        const classifier = classifiers[classifier_name];
        let classifier_info = {};
        if (classifier) {
            if (dataset) {
                const dataset = classifier.getClassifierDataset();
                const entries = Object.entries(dataset);
                entries.forEach(entry => {
                    classifier_info[entry[0]] = entry[1].arraySync();
                });
            } else if (number_of_examples) {
                classifier_info = classifier.getClassExampleCount();
            } else if (number_of_classes) {
                classifier_info = classifier.getNumClasses();
            } else {
                window.parent.postMessage({error_message: 'Bad KNN model info message: ' + JSON.stringify(payload)});
                return;
            }
            window.parent.postMessage({classifier_info, time_stamp});
        } else {
            window.parent.postMessage({error_message: 'No classifier named "' + classifier_name + 
                                                      '" exists. Use "add example" to create one.'});
        }
    } else if (typeof event.data.set_dataset_of_knn_classifier != 'undefined') {
        const payload = event.data.set_dataset_of_knn_classifier;
        const {classifier_name, dataset, time_stamp} = payload;
        const classifier = get_classifier(classifier_name);
        // const entries = Object.entries(dataset);
        const dataset_with_tensors = {};
        dataset.forEach(entry => {
            dataset_with_tensors[entry[0]] = tf.tensor(entry[1]);
        });
        classifier.setClassifierDataset(dataset_with_tensors);
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