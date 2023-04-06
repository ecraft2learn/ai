const trainBtn = document.getElementById("train-btn");
const predictionForm = document.getElementById("prediction-form");
const textInput = document.getElementById("text-input");
const resultDiv = document.getElementById("result");

let model;
let encoder;

async function loadData() {
  const response = await fetch("confidence.json");
  const data = await response.json();
  const texts = data.map(d => d.text);
  const labels = data.map(d => d.label);

  return { texts, labels };
}

async function prepareData(data) {
  encoder = await use.load();
  const embeddings = await encoder.embed(data.texts);
  const labels = tf.oneHot(data.labels.map(l => l + 1), 3);

  return { embeddings, labels };
}

function createModel() {
  const model = tf.sequential();

  model.add(tf.layers.dense({ units: 128, activation: "relu", inputShape: [512] }));
  model.add(tf.layers.dropout({ rate: 0.5 }));
  
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));
  model.add(tf.layers.dropout({ rate: 0.5 }));

  model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

  model.compile({ optimizer: tf.train.adam(0.001), loss: "categoricalCrossentropy", metrics: ["accuracy"] });

  return model;
}

function plotLoss(history) {
  const lossChartCanvas = document.getElementById("loss-chart").getContext("2d");
  const chartData = {
    labels: Array.from({ length: history.epoch.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Training Loss",
        data: history.history.loss,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: true,
      },
      {
        label: "Validation Loss",
        data: history.history.val_loss,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: true,
      },
    ],
  };

  const chartConfig = {
    type: "line",
    data: chartData,
    options: {
      scales: {
        x: { title: { text: "Epochs", display: true } },
        y: { title: { text: "Loss", display: true }, min: 0 },
      },
    },
  };

  new Chart(lossChartCanvas, chartConfig);
}

async function train() {
  // Get the input element for the number of epochs and parse its value
  const epochsInput = document.getElementById("epochs-input");
  const numEpochs = parseInt(epochsInput.value) || 20;

  // Load the dataset and prepare it for training
  const data = await loadData();
  const preparedData = await prepareData(data);

  // Create the model
  model = createModel();

  // Initialize the loss chart before starting the training
  const lossChart = initLossChart();

  // Define a callback function to update the chart after each epoch
  const onEpochEnd = (epoch, logs) => {
    updateLossChart(lossChart, epoch, logs.loss, logs.val_loss);
  };

  // Train the model and get the training history
  const history = await trainModel(model, preparedData, numEpochs, onEpochEnd);

  // Disable the train button and enable the text input for predictions
  trainBtn.disabled = true;
  textInput.disabled = false;
}


function initLossChart() {
  const lossChartCanvas = document.getElementById("loss-chart").getContext("2d");
  const chartData = {
    labels: [],
    datasets: [
      {
        label: "Training Loss",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: true,
      },
      {
        label: "Validation Loss",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: true,
      },
    ],
  };

const chartConfig = {
    type: "line",
    data: chartData,
    options: {
      animation: false,
      scales: {
        x: { title: { text: "Epochs", display: true } },
        y: { title: { text: "Loss", display: true }, min: 0 },
      },
    },
  };

  return new Chart(lossChartCanvas, chartConfig);
}

async function trainModel(model, data, numEpochs, onEpochEnd) {
  const history = await model.fit(data.embeddings, data.labels, {
    epochs: numEpochs,
    batchSize: 32,
    validationSplit: 0.1,
    callbacks: { onEpochEnd },
  });
  return history;
}

function updateLossChart(chart, epoch, trainLoss, valLoss) {
  chart.data.labels.push(epoch + 1);
  chart.data.datasets[0].data.push(trainLoss);
  chart.data.datasets[1].data.push(valLoss);
  chart.update();
}

async function predict(text) {
  const embedding = await encoder.embed([text]);
  const prediction = model.predict(embedding);
  const classIndex = prediction.argMax(-1).dataSync()[0];
  const softmaxScores = Array.from(prediction.dataSync());

  return { classIndex: classIndex - 1, softmaxScores };
}

trainBtn.addEventListener("click", () => {
  trainBtn.textContent = "Training...";
  train().then(() => {
    trainBtn.textContent = "Model Trained";
  });
});

predictionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!model) {
    alert("Please train the model before making predictions.");
    return;
  }

  // Preprocess the input text by converting it to lowercase
  const inputText = textInput.value.toLowerCase();
  const { classIndex, softmaxScores } = await predict(inputText);

  const confidenceLabels = ["Lack of confidence", "Neutral", "Confident"];
  const likelihoods = confidenceLabels.map((label, idx) => {
    const score = (softmaxScores[idx] * 100).toFixed(2);
    return `${label}: ${score}%`;
  });

  resultDiv.innerHTML = `
    <p>Prediction: ${confidenceLabels[classIndex + 1]}</p>
    <p>Likelihoods:</p>
    <ul>${likelihoods.map((l) => `<li>${l}</li>`).join("")}</ul>
  `;
});



