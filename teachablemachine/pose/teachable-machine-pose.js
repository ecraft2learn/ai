// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// for testing can use https://teachablemachine.withgoogle.com/models/qaazhFQ5c/
// which recognizes a 'stop' gesture (or 'other')

let models = {};
const get_model = (url, continuation) => {
    if (models[url]) {
        continuation(models[url]);
    } else {
        // load the model and metadata
        // Note: the pose library adds a tmPose object to your window (window.tmPose)
        tmPose.load(url + "model.json", url + "metadata.json").then(model => {
            models[url] = model;
            continuation(models[url]);
        });
    }
};

const predict = (image_data, teachable_machine_model_url, time_stamp, event) => {
    get_model(teachable_machine_model_url,
              model => {
                    model.estimatePose(image_data).then(response => {
                        const {pose, posenetOutput} = response;
                        // Prediction 2: run input through teachable machine classification model
                        model.predict(posenetOutput).then(prediction => {
                            event.source.postMessage({teachable_machine_prediction: 
                                                      {prediction, 
                                                       additional_info: pose,
                                                       time_stamp}}, '*');
                        });
                    });
              });
};

window.addEventListener(
    'DOMContentLoaded',
    () => {
        window.addEventListener('message', 
                                (event) => {
                                    try {
                                        if (typeof event.data.teachable_machine_predict !== 'undefined') {
                                            const {image_data, teachable_machine_model_url, time_stamp} = event.data.teachable_machine_predict;
                                            predict(image_data, teachable_machine_model_url, time_stamp, event);
                                        }
                                    } catch(error) {
                                        console.log(error);
                                        event.source.postMessage({teachable_machine_prediction_failed: 
                                                                  {error_message: error.message,
                                                                   time_stamp}}, "*");
                                    }});
        window.parent.postMessage("Ready", '*');
     });