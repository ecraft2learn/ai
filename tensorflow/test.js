const test_1 = () => {
    // equivalent to https://js.tensorflow.org/#getting-started
    window.postMessage({training_data:
                        {input:  [1, 2, 3, 4],
                         output: [1, 3, 5, 7]}}, "*");
    window.postMessage({create_model:
                        {layers: [1],
                         optimizer: 'Stochastic Gradient Descent',
                         name: 'test 1'}}, "*");
    window.postMessage({train: 
                        {epochs: 10,
                         learning_rate: .01,
                         model_name: 'test 1'}}, "*");
    window.addEventListener('message',
        (event) => {
            if (event.data.training_completed) {
                console.log(event.data.training_completed);
                window.postMessage({predict: 
                                    {input: 5,
                                     model_name: 'test 1'}}, "*");
            } else if (typeof event.data.prediction !== 'undefined') {
                console.log("Prediction is " + event.data.prediction + " (should ideally be close to 9)");
            }
        });    
};

window.addEventListener('message', (event) => {
    if (event.data === 'Loaded') {
        test_1();
    }
});
