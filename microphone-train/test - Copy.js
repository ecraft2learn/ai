async function load_speech_recogniser () {
//     const recognizer = SpeechCommands.create('BROWSER_FFT');
//     await recognizer.ensureModelLoaded();

const baseRecognizer = SpeechCommands.create('BROWSER_FFT');
await baseRecognizer.ensureModelLoaded();
const transferRecognizer = baseRecognizer.createTransfer('colors');

await transferRecognizer.collectExample('red');
await transferRecognizer.collectExample('green');
await transferRecognizer.collectExample('blue');
await transferRecognizer.collectExample('red');

await transferRecognizer.train({
  epochs: 25,
  callback: {
    onEpochEnd: async (epoch, logs) => {
      console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
    }
  }
});

await transferRecognizer.startStreaming(result => {
  // - result.scores contains the scores for the new vocabulary, which
  //   can be checked with:
  const words = transferRecognizer.wordLabels();
  // `result.scores` contains the scores for the new words, not the original
  // words.
  for (let i = 0; i < words; ++i) {
    console.log(`score for word '${words[i]}' = ${result.scores[i]}`);
  }
}, {probabilityThreshold: 0.75});

// Stop the recognition in 10 seconds.
setTimeout(() => transferRecognizer.stopStreaming(), 10e3);

// transferRecognizer.startStreaming(result => {
//   console.log(result);
//   console.log(transferRecognizer.wordLabels());
// }, {
//   probabilityThreshold: 0.75
// });

// Stop the recognition in 10 seconds.
setTimeout(() => transferRecognizer.stopStreaming(), 10e3);
};

load_speech_recogniser();


