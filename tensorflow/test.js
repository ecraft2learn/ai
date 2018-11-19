const test_1 = () => {
    // equivalent to https://js.tensorflow.org/#getting-started
    window.postMessage({data:
                        {input:  [1, 2, 3, 4],
                         output: [1, 3, 5, 7]},
                        kind: 'training',
//                         ignore_old_dataset: true,
                        model_name: 'all models',
                        time_stamp: Date.now()}, "*");
    window.postMessage({create_model:
                        {layers: [1],
                         optimizer: 'Stochastic Gradient Descent',
                         time_stamp: Date.now(),
                         name: 'test 1'}}, "*");
    window.postMessage({train: 
                        {epochs: 10,
                         learning_rate: .01,
                         time_stamp: Date.now(),
                         model_name: 'test 1'}}, "*");
    window.addEventListener('message',
        (event) => {
            if (event.data.training_completed) {
                console.log(event.data.training_completed);
                window.postMessage({predict: 
                                    {input: [5],
                                     time_stamp: Date.now(),
                                     model_name: 'test 1'}}, "*");
            } else if (typeof event.data.prediction !== 'undefined') {
                console.log("Prediction is " + event.data.result[0] + " (should ideally be close to 9)");
            }
        });    
};

window.addEventListener('message', (event) => {
    console.log(event.data);
    if (event.data === 'Loaded') {
        test_1();
    }
});
