# Building a Speech Recognizer in JavaScript

This document will go into key details about how the JsSpeechRecognizer was built, and you can always look at the complete file for the full implementation.

## 1. Get Access to the Microphone

The first and probably most important step is to get access to the microphone. To do this we use WebRTC functions.

JsSpeechRecognizer uses the adapter.js file from the WebRTC project to accomplish this. Here is a link to their github repo: https://github.com/webrtc/adapter

````javascript
// Request access to the microphone
var constraints = {
    "audio": true
};

navigator.getUserMedia(constraints, successCallback, errorCallback);
````

## 2. Connect the Audio to an Analyser and Script Node

When we successfully get acces to the microphone, we hook up an Analyser. Click [here](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createAnalyser) for more details about the analyser. The analyser will take the raw audio samples and calculate a Fast Fourier Transform. This will give us the audio in the frequency domain. Frequency data is much more useful for distinguishing words than the raw audio data.

Notice that the Analyser is connected to a Script Node. A ScriptNode allows us to create a custom processing function.

````javascript
// Create an analyser
this.analyser = this.audioCtx.createAnalyser();
this.analyser.minDecibels = -80;
this.analyser.maxDecibels = -10;
this.analyser.smoothingTimeConstant = 0;
this.analyser.fftSize = 1024;

// Create the scriptNode
this.scriptNode = this.audioCtx.createScriptProcessor(this.analyser.fftSize, 1, 1);


// Acess to the microphone was granted
function successCallback(stream) {
    _this.stream = stream;
    _this.source = _this.audioCtx.createMediaStreamSource(stream);

    _this.source.connect(_this.analyser);
    _this.analyser.connect(_this.scriptNode);

    // This is needed for chrome
    _this.scriptNode.connect(_this.audioCtx.destination);
}
````

## 3. Normalize and Group the Frequencies

In the custom processing function for the script node, we normalize and group the frequencies. We normalize them to help accommodate for different volume levels of the recordings, and we group the frequencies to simplify the data.

The size and number of groupings was chosen through trial and error and may not be optimal. The number of groups and the size of the groups will affect how specific the data model is. A more specific data model will take up more memory, may take more time to process recognitions, but may also be more accurate.

````javascript
// Function for script node to process
var _this = this;
this.scriptNode.onaudioprocess = function(audioProcessingEvent) {

    var i = 0;

    // get the fft data
    var dataArray = new Uint8Array(_this.analyser.fftSize);
    _this.analyser.getByteFrequencyData(dataArray);

    // Find the max in the fft array
    var max = Math.max.apply(Math, dataArray);
    
    // If the max is zero ignore it.
    if (max === 0) {
        return;
    }

    // Normalize and Group the frequencies
    var numGroups = 25;
    var groupSize = 10;
    var groups = [];

    for (i = 0; i < numGroups; i++) {
        var peakGroupValue = 0;
        for (var j = 0; j < groupSize; j++) {
            var curPos = (groupSize * i) + j;

            // normalize the value
            var tempCalc = Math.floor((dataArray[curPos] / max) * 100);

            // Keep the peak normalized value for this group
            if (tempCalc > peakGroupValue) {
                peakGroupValue = tempCalc;
            }

        }
        groups.push(peakGroupValue);
    }
    _this.groupedValues.push(groups);
};
````

## Training or Recognizing?

Steps 1 through 3 are common to both training and recognition. Step 4, however, will differ depending on if you are training or recognizing.

## 4. (Training) Save to the Model

If we are training, after we save the results from step 3 into our model. The JsSpeechRecognizer allows for one word to be trained multiple times, so these steps can be repeated numerous amounts of times for one or more words.

## 4. (Recognizing) Match Recording to an Entry in the Model

If we are recognizing we want to take the results from the step 3, and compare it to all the entries we have stored in our model.

The comparison is simple, we simple take the difference of input value and the model value.

````javascript
JsSpeechRecognizer.prototype.findDistance = function(input, check) {
    var i = 0;
    var distance = 0;

    for (i = 0; i < Math.max(input.length, check.length); i++) {
        var checkVal = check[i] || 0;
        var inputVal = input[i] || 0;
        distance += Math.abs(checkVal - inputVal);
    }

    return distance;
};
````

We then transform this difference to a confidence value.

````javascript
JsSpeechRecognizer.prototype.calcConfidence = function(distance, matchArray) {
    var sum = 0;
    var i = 0;

    for (i = 0; i < matchArray.length; i++) {
        sum += matchArray[i];
    }

    return (1 - (distance / sum));
};
````

When all the confidences have been calculated, the highest value result is returned. This becomes our recognition hypothesis.

## That's It
Now go have fun playing with [the live demo](https://dreamdom.github.io/speechrec.html)! Be sure to read the tips on using the demo in the README file.
