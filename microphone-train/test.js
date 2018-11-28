async function load_speech_recogniser () {
const baseRecognizer = SpeechCommands.create('BROWSER_FFT');
await baseRecognizer.ensureModelLoaded();

// Each instance of speech-command recognizer supports multiple
// transfer-learning models, each of which can be trained for a different
// new vocabulary.
// Therefore we give a name to the transfer-learning model we are about to
// train ('colors' in this case).
const transferRecognizer = baseRecognizer.createTransfer('colors');

// Call `collectExample()` to collect a number of audio examples
// via WebAudio.
await transferRecognizer.collectExample('red');
await transferRecognizer.collectExample('green');
await transferRecognizer.collectExample('blue');
await transferRecognizer.collectExample('red');
// Don't forget to collect some background-noise examples, so that the
// trasnfer-learned model will be able to detect moments of silence.
await transferRecognizer.collectExample('_background_noise_');
await transferRecognizer.collectExample('green');
await transferRecognizer.collectExample('blue');
await transferRecognizer.collectExample('_background_noise_');

await transferRecognizer.collectExample('pink');
await transferRecognizer.collectExample('purple');
await transferRecognizer.collectExample('white');
await transferRecognizer.collectExample('brown');
await transferRecognizer.collectExample('yellow');
await transferRecognizer.collectExample('orange');

await transferRecognizer.collectExample('mauve');
await transferRecognizer.collectExample('chartruse');
await transferRecognizer.collectExample('beige');
await transferRecognizer.collectExample('sky blue');
await transferRecognizer.collectExample('mud');

await transferRecognizer.collectExample('brick');
await transferRecognizer.collectExample('sea');
await transferRecognizer.collectExample('ocean');
await transferRecognizer.collectExample('sand');
await transferRecognizer.collectExample('foam');


// ... You would typically want to put `collectExample`
//     in the callback of a UI button to allow the user to collect
//     any desired number of examples in random order.

// You can check the counts of examples for different words that have been
// collect for this transfer-learning model.
console.log(transferRecognizer.countExamples());
// e.g., {'red': 2, 'green': 2', 'blue': 2, '_background_noise': 2};

// Start training of the transfer-learning model.
// You can specify `epochs` (number of training epochs) and `callback`
// (the Model.fit callback to use during training), among other configuration
// fields.
await transferRecognizer.train({
  epochs: 25,
  callback: {
    onEpochEnd: async (epoch, logs) => {
      console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
      console.info(epoch, logs);
    }
  }
});

// After the transfer learning completes, you can start online streaming
// recognition using the new model.
await transferRecognizer.startStreaming(result => {
  // - result.scores contains the scores for the new vocabulary, which
  //   can be checked with:
  const words = transferRecognizer.wordLabels();
  // `result.scores` contains the scores for the new words, not the original
  // words.
  for (let i = 0; i < words; ++i) {
    console.log(`score for word '${words[i]}' = ${result.scores[i]}`);
    console.info(words[i], result.scores[i]);
  }
}, {probabilityThreshold: 0.75});

// Stop the recognition in 10 seconds.
setTimeout(() => transferRecognizer.stopStreaming(), 10e3);
};

load_speech_recogniser();


