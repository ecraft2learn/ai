
// generated by GPT-4 https://shareg.pt/dVmbCVa
function generateTrainingData(size) {
    const inputs = [];
    const outputs = [];

    for (let i = 0; i < size; i++) {
        const input = Math.random() * 100;
        inputs.push(input);
        outputs.push(Math.sqrt(input));
    }

    return { inputs, outputs };
}
async function trainModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, inputShape: [1], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' }); // Change the learning rate

    const trainingDataSize = 10000; // Increase the number of training examples

    const { inputs, outputs } = generateTrainingData(trainingDataSize);

    const inputTensor = tf.tensor2d(inputs, [trainingDataSize, 1]);
    const outputTensor = tf.tensor2d(outputs, [trainingDataSize, 1]);

    const epochs = 100; 

    const trainingLossElement = document.getElementById('trainingLoss');

    await model.fit(inputTensor, outputTensor, {
        epochs,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                trainingLossElement.innerHTML = logs.loss.toFixed(4);
            },
        },
    });

    return model;
}
async function estimateSquareRoot(model) {
    const inputNumberElement = document.getElementById('inputNumber');
    const outputSqrtElement = document.getElementById('outputSqrt');

    const inputValue = parseFloat(inputNumberElement.value);
    const inputTensor = tf.tensor2d([inputValue], [1, 1]);

    const outputTensor = model.predict(inputTensor);

    const outputValue = outputTensor.dataSync()[0];
    outputSqrtElement.innerHTML = outputValue.toFixed(2);
}
async function initializeApp() {
    const model = await trainModel();

    document.getElementById('estimateButton').addEventListener('click', () => {
        estimateSquareRoot(model);
    });
}
initializeApp();
