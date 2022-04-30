// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

let models = {};
const get_model = (url, continuation) => {
    if (models[url]) {
        continuation(models[url]);
    } else {
        // load the model and metadata
        // Note: the pose library adds a tmPose object to your window (window.tmPose)
        tmImage.load(url + "model.json", url + "metadata.json").then(model => {
            models[url] = model;
            continuation(models[url]);
        });
    }
};

let canvas;

const predict = (image_data, teachable_machine_model_url, time_stamp, event) => {
    get_model(teachable_machine_model_url,
              model => {
                    // predict doesn't accept imageData
                    if (!canvas) {
                        canvas = document.createElement('canvas');
                    }
                    canvas.getContext('2d').putImageData(image_data, 0, 0);
                    model.predict(canvas).then(prediction => {
                            event.source.postMessage({teachable_machine_prediction: 
                                                      {prediction, 
                                                       time_stamp}}, '*');
                        },
                        error => {
                            console.log(error);
                            event.source.postMessage({teachable_machine_prediction_failed: 
                                                      {error_message: error.message,
                                                       time_stamp}}, "*"); 
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