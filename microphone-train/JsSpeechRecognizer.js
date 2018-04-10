/**
 * JavaScript based speech recognizer.
 * 
 * Copyright 2016, Dominic Winkelman
 * Free to use under the Apache 2.0 License
 * 
 * https://github.com/dreamdom/JsSpeechRecognizer
 * 
 * Requires the WebRTC adapter.js file.
 */

/**
 * Constructor for JsSpeechRecognizer.
 * Sets a number of parameters to default values.
 */
function JsSpeechRecognizer() {

    // Constants
    this.RecordingEnum = { "NOT_RECORDING": 0, "TRAINING": 1, "RECOGNITION": 2, "KEYWORD_SPOTTING": 3, "KEYWORD_SPOTTING_NOISY": 4 };
    Object.freeze(this.RecordingEnum);
    this.RecognitionModel = { "TRAINED": 0, "AVERAGE": 1, "COMPOSITE": 2 };
    Object.freeze(this.RecognitionModel);

    // Variables for recording data
    this.recordingBufferArray = [];
    this.currentRecordingBuffer = [];
    this.wordBuffer = [];
    this.modelBuffer = [];
    this.groupedValues = [];
    this.keywordSpottingGroupBuffer = [];
    this.keywordSpottingRecordingBuffer = [];

    // The speech recognition model
    this.model = {};

    this.recordingState = this.RecordingEnum.NOT_RECORDING;
    this.useRecognitionModel = this.RecognitionModel.COMPOSITE;

    // Get an audio context
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();


    // Generate functions for keyword spotting
    this.findDistanceForKeywordSpotting = this.generateFindDistanceForKeywordSpotting(-1);
    this.findDistanceForKeywordSpotting0 = this.generateFindDistanceForKeywordSpotting(0);
    this.findDistanceForKeywordSpotting5 = this.generateFindDistanceForKeywordSpotting(5);
    this.findDistanceForKeywordSpotting15 = this.generateFindDistanceForKeywordSpotting(15);


    // Adjustable parameters

    // Create an analyser
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.minDecibels = -80;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0;
    this.analyser.fftSize = 1024;

    // Create the scriptNode
    this.scriptNode = this.audioCtx.createScriptProcessor(this.analyser.fftSize, 1, 1);
    this.scriptNode.onaudioprocess = this.generateOnAudioProcess();

    // Parameters for the model calculation
    this.numGroups = 25;
    this.groupSize = 10;
    this.minPower = 0.01;

    // Keyword spotting parameters
    this.keywordSpottingMinConfidence = 0.50;
    this.keywordSpottingBufferCount = 80;
    this.keywordSpottingLastVoiceActivity = 0;
    this.keywordSpottingMaxVoiceActivityGap = 300;
    this.keywordSpottedCallback = null;

}

/**
 * Requests access to the microphone.
 * @public
 */
JsSpeechRecognizer.prototype.openMic = function() {

    var constraints = {
        "audio": true
    };

    navigator.getUserMedia(constraints, successCallback, errorCallback);

    var _this = this;
    // Acess to the microphone was granted
    function successCallback(stream) {
        _this.stream = stream;
        _this.source = _this.audioCtx.createMediaStreamSource(stream);

        _this.source.connect(_this.analyser);
        _this.analyser.connect(_this.scriptNode);

        // This is needed for chrome
        _this.scriptNode.connect(_this.audioCtx.destination);
    }

    function errorCallback(error) {
        console.error('navigator.getUserMedia error: ', error);
    }
};

/**
 * Returns false if the recognizer is not recording. True otherwise.
 * @public.
 */
JsSpeechRecognizer.prototype.isRecording = function() {
    return (this.recordingState !== this.RecordingEnum.NOT_RECORDING);
};

/**
 * Starts recording in TRAINING mode.
 * @public
 */
JsSpeechRecognizer.prototype.startTrainingRecording = function(curWord) {
    this.resetBuffers();
    this.recordingState = this.RecordingEnum.TRAINING;
    this.wordBuffer.push(curWord);
};

/**
 * Starts recording in RECOGNITION mode.
 * @public
 */
JsSpeechRecognizer.prototype.startRecognitionRecording = function() {
    this.resetBuffers();
    this.recordingState = this.RecordingEnum.RECOGNITION;
};

/**
 * Starts recording in KEYWORD_SPOTTING mode.
 * @public
 */
JsSpeechRecognizer.prototype.startKeywordSpottingRecording = function() {
    this.resetBuffers();
    this.recordingState = this.RecordingEnum.KEYWORD_SPOTTING;
};

/**
 * Starts a recording in KEYWORD_SPOTTING_NOISY mode.
 * @public
 */
JsSpeechRecognizer.prototype.startKeywordSpottingNoisyRecording = function() {
    this.resetBuffers();
    this.recordingState = this.RecordingEnum.KEYWORD_SPOTTING_NOISY;
};

/**
 * Stops recording.
 * @return {Number} the length of the training buffer.
 * @public
 */
JsSpeechRecognizer.prototype.stopRecording = function() {

    this.groupedValues = [].concat.apply([], this.groupedValues);
    this.normalizeInput(this.groupedValues);

    // If we are training we want to save to the recongition model buffer
    if (this.recordingState === this.RecordingEnum.TRAINING) {
        this.recordingBufferArray.push(this.currentRecordingBuffer.slice(0));
        this.modelBuffer.push(this.groupedValues.slice(0));
    }

    this.recordingState = this.RecordingEnum.NOT_RECORDING;

    return this.recordingBufferArray.length;
};

/**
 * Plays training audio for the specified index.
 * @param {Number} index
 * @public
 */
JsSpeechRecognizer.prototype.playTrainingBuffer = function(index) {
    this.playMonoAudio(this.recordingBufferArray[index]);
};

/**
 * Delete training data for the specified index.
 * @param {Number} index
 * @public
 */
JsSpeechRecognizer.prototype.deleteTrainingBuffer = function(index) {
    this.modelBuffer[index] = null;
};

/**
 * Play mono audio.
 * @param {Array} playBuffer
 * @public
 */
JsSpeechRecognizer.prototype.playMonoAudio = function(playBuffer) {

    var channels = 1;
    var frameCount = playBuffer.length;
    var myArrayBuffer = this.audioCtx.createBuffer(channels, frameCount, this.audioCtx.sampleRate);

    for (var channel = 0; channel < channels; channel++) {
        var nowBuffering = myArrayBuffer.getChannelData(channel);
        for (var i = 0; i < frameCount; i++) {
            nowBuffering[i] = playBuffer[i];
        }
    }

    var playSource = this.audioCtx.createBufferSource();
    playSource.buffer = myArrayBuffer;
    playSource.connect(this.audioCtx.destination);
    playSource.start();
};

/**
 * Returns an array of the top recognition hypotheses.
 * @param {Number} numResults
 * @return {Array}
 * @public
 */
JsSpeechRecognizer.prototype.getTopRecognitionHypotheses = function(numResults) {
    return this.findClosestMatch(this.groupedValues, numResults, this.model, this.findDistance);
};

/**
 * Method to generate the new speech recognition model from the training data.
 * @public
 */
JsSpeechRecognizer.prototype.generateModel = function() {

    var i = 0;
    var j = 0;
    var k = 0;
    var key = "";
    var averageModel = {};

    // Reset the model
    this.model = {};

    for (i = 0; i < this.wordBuffer.length; i++) {
        key = this.wordBuffer[i];
        this.model[key] = [];
    }

    for (i = 0; i < this.modelBuffer.length; i++) {
        if (this.modelBuffer[i] !== null) {
            key = this.wordBuffer[i];
            this.model[key].push(this.modelBuffer[i]);
        }
    }

    // If we are only using the trained entries, no need to anything else
    if (this.useRecognitionModel === this.RecognitionModel.TRAINED) {
        return;
    }

    // Average Model
    // Holds one entry for each key. That entry is the average of all the entries in the model
    for (key in this.model) {
        var average = [];
        for (i = 0; i < this.model[key].length; i++) {
            for (j = 0; j < this.model[key][i].length; j++) {
                average[j] = (average[j] || 0) + (this.model[key][i][j] / this.model[key].length);
            }
        }

        averageModel[key] = [];
        averageModel[key].push(average);
    }

    // Interpolation - Take the average of each pair of entries for a key and 
    // add it to the average model
    for (key in this.model) {

        var averageInterpolation = [];
        for (k = 0; k < this.model[key].length; k++) {
            for (i = k + 1; i < this.model[key].length; i++) {

                averageInterpolation = [];
                for (j = 0; j < Math.max(this.model[key][k].length, this.model[key][i].length); j++) {
                    var entryOne = this.model[key][k][j] || 0;
                    var entryTwo = this.model[key][i][j] || 0;
                    averageInterpolation[j] = (entryOne + entryTwo) / 2;
                }

                averageModel[key].push(averageInterpolation);
            }
        }
    }

    if (this.useRecognitionModel === this.RecognitionModel.AVERAGE) {
        this.model = averageModel;
    } else if (this.useRecognitionModel === this.RecognitionModel.COMPOSITE) {
        // Merge the average model into the model
        for (key in this.model) {
            this.model[key] = this.model[key].concat(averageModel[key]);
        }
    }

};


// Private internal functions

/**
 * Resets the recording buffers.
 * @private
 */
JsSpeechRecognizer.prototype.resetBuffers = function() {
    this.currentRecordingBuffer = [];
    this.groupedValues = [];

    this.keywordSpottingGroupBuffer = [];
    this.keywordSpottingRecordingBuffer = [];
};

// Audio Processing functions

/**
 * Generates an audioProcess function.
 * @return {Function}
 * @private
 */
JsSpeechRecognizer.prototype.generateOnAudioProcess = function() {
    var _this = this;
    return function(audioProcessingEvent) {

        var i = 0;

        // If we aren't recording, don't do anything
        if (_this.recordingState === _this.RecordingEnum.NOT_RECORDING) {
            return;
        }

        // get the fft data
        var dataArray = new Uint8Array(_this.analyser.fftSize);
        _this.analyser.getByteFrequencyData(dataArray);

        // Find the max in the fft array
        var max = Math.max.apply(Math, dataArray);

        // If the max is zero ignore it.
        if (max === 0) {
            return;
        }

        // Get the audio data. For simplicity just take one channel
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var leftChannel = inputBuffer.getChannelData(0);

        // Calculate the power
        var curFrame = new Float32Array(leftChannel);
        var power = 0;
        for (i = 0; i < curFrame.length; i++) {
            power += curFrame[i] * curFrame[i];
        }

        // Check for the proper power level
        if (power < _this.minPower) {
            return;
        }

        // Save the data for playback.
        Array.prototype.push.apply(_this.currentRecordingBuffer, curFrame);

        // Normalize and Group the frequencies
        var groups = [];

        for (i = 0; i < _this.numGroups; i++) {
            var peakGroupValue = 0;
            for (var j = 0; j < _this.groupSize; j++) {
                var curPos = (_this.groupSize * i) + j;

                // Keep the peak normalized value for this group
                if (dataArray[curPos] > peakGroupValue) {
                    peakGroupValue = dataArray[curPos];
                }

            }
            groups.push(peakGroupValue);
        }

        // Depending on the state, handle the data differently
        if (_this.recordingState === _this.RecordingEnum.KEYWORD_SPOTTING || _this.recordingState === _this.RecordingEnum.KEYWORD_SPOTTING_NOISY) {

            // Check if we should reset the buffers
            var now = new Date().getTime();
            if (now - _this.keywordSpottingLastVoiceActivity > _this.keywordSpottingMaxVoiceActivityGap) {
                _this.resetBuffers();
            }
            _this.keywordSpottingLastVoiceActivity = now;

            _this.keywordSpottingProcessFrame(groups, curFrame);
        } else {
            _this.groupedValues.push(groups);
        }

    };
};

/**
 * Process a new frame of data while in recording state KEYWORD_SPOTTING.
 * @param{Array} groups - the group data for the frame
 * @param{Array} curFrame - the raw audio data for the frame
 * @private
 */
JsSpeechRecognizer.prototype.keywordSpottingProcessFrame = function(groups, curFrame) {

    var computedLength;
    var key;
    var allResults = [];
    var recordingLength;
    var workingGroupBuffer = [];

    // Append to the keywordspotting buffer
    this.keywordSpottingGroupBuffer.push(groups);
    this.keywordSpottingGroupBuffer = [].concat.apply([], this.keywordSpottingGroupBuffer);

    // Trim the buffer if necessary
    computedLength = (this.keywordSpottingBufferCount * this.numGroups);
    if (this.keywordSpottingGroupBuffer.length > computedLength) {
        this.keywordSpottingGroupBuffer = this.keywordSpottingGroupBuffer.slice(this.keywordSpottingGroupBuffer.length - computedLength, this.keywordSpottingGroupBuffer.length);
    }

    // Save the audio data
    Array.prototype.push.apply(this.keywordSpottingRecordingBuffer, curFrame);

    // Trim the buffer if necessary
    computedLength = (this.keywordSpottingBufferCount * this.analyser.fftSize);
    if (this.keywordSpottingRecordingBuffer.length > computedLength) {
        this.keywordSpottingRecordingBuffer = this.keywordSpottingRecordingBuffer.slice(this.keywordSpottingRecordingBuffer.length - computedLength, this.keywordSpottingRecordingBuffer.length);
    }

    // Copy buffer, and normalize it, and use it to find the closest match
    workingGroupBuffer = this.keywordSpottingGroupBuffer.slice(0);
    this.normalizeInput(workingGroupBuffer);

    // Use the correct keyword spotting function
    if (this.recordingState === this.RecordingEnum.KEYWORD_SPOTTING_NOISY) {
        allResults = this.keywordDetectedNoisy(workingGroupBuffer);
    } else {
        allResults = this.keywordDetectedNormal(workingGroupBuffer);
    }


    // See if a keyword was spotted
    if (allResults !== null && allResults[0] !== undefined) {

        // Save the audio
        recordingLength = (allResults[0].frameCount / this.numGroups) * this.analyser.fftSize;

        if (recordingLength > this.keywordSpottingRecordingBuffer.length) {
            recordingLength = this.keywordSpottingRecordingBuffer.length;
        }

        allResults[0].audioBuffer = this.keywordSpottingRecordingBuffer.slice(this.keywordSpottingRecordingBuffer.length - recordingLength, this.keywordSpottingRecordingBuffer.length);

        this.resetBuffers();
        if (this.keywordSpottedCallback !== undefined && this.keywordSpottedCallback !== null) {
            this.keywordSpottedCallback(allResults[0]);
        }

    }

};

// Keyword spotting functions

/**
 * Analyzes a buffer to determine if a keyword has been found.
 * Will return an array if a keyword was found, null otherwise.
 * 
 * @param {Array} workingGroupBuffer
 * @return {Array|null}
 * @private
 */
JsSpeechRecognizer.prototype.keywordDetectedNormal = function(workingGroupBuffer) {
    var allResults = {};

    allResults = this.findClosestMatch(workingGroupBuffer, 1, this.model, this.findDistanceForKeywordSpotting);

    if (allResults[0] !== undefined && allResults[0].confidence > this.keywordSpottingMinConfidence) {
        return allResults;
    }

    return null;
};

/**
 * Analyzes a buffer to determine if a keyword has been found.
 * Will return an array if a keyword was found, null otherwise.
 * Designed to adjust for different levels of noise.
 * 
 * @param {Array} workingGroupBuffer
 * @return {Array|null}
 * @private
 */
JsSpeechRecognizer.prototype.keywordDetectedNoisy = function(workingGroupBuffer) {

    // TODO: Make it possible for a user to specify the number of keyword spotting functions
    // And change this duplicated code to a loop!

    var allResults15 = {};
    var allResults15MinConfidence = this.keywordSpottingMinConfidence;

    allResults15 = this.findClosestMatch(workingGroupBuffer, 1, this.model, this.findDistanceForKeywordSpotting15);

    if (allResults15[0].confidence <= allResults15MinConfidence) {
        return null;
    }


    var allResults5 = {};
    var allResults5MinConfidence = this.keywordSpottingMinConfidence - 0.1;

    allResults5 = this.findClosestMatch(workingGroupBuffer, 1, this.model, this.findDistanceForKeywordSpotting5);

    if (allResults5[0].confidence <= allResults5MinConfidence) {
        return null;
    }


    var allResults0 = {};
    var allResults0MinConfidence = this.keywordSpottingMinConfidence - 0.15;

    allResults0 = this.findClosestMatch(workingGroupBuffer, 1, this.model, this.findDistanceForKeywordSpotting0);

    if (allResults0[0].confidence <= allResults0MinConfidence) {
        return null;
    }


    // finally, run the normal check
    var allResults = {};

    allResults = this.findClosestMatch(workingGroupBuffer, 1, this.model, this.findDistanceForKeywordSpotting);

    // Calculate the minimum confidence
    var allResultsMinConfidence = this.keywordSpottingMinConfidence - 0.1 - (Math.max((allResults[0].noise * 1.25) - 1, 0) * 0.75);

    // Final check for returning the results
    if (allResults[0] !== undefined && allResults[0].confidence > allResultsMinConfidence) {
        return allResults;
    }

    return null;
};

// Calculation functions

/**
 * Normalizes an input array to a scale from 0 to 100.
 * 
 * @param {Array} input
 * @private
 */
JsSpeechRecognizer.prototype.normalizeInput = function(input) {
    // Find the max in the fft array
    var max = Math.max.apply(Math, input);

    for (var i = 0; i < input.length; i++) {
        input[i] = Math.floor((input[i] / max) * 100);
    }
};

/**
 * Finds the closest matches for an input, for a specified model.
 * Uses specified findDistance function, or a default one.
 * 
 * @param {Array} input
 * @param {Number} numResults
 * @param {Object} speechModel
 * @param {Function} findDistance
 * @return {Array}
 * @private
 */
JsSpeechRecognizer.prototype.findClosestMatch = function(input, numResults, speechModel, findDistanceFunction) {

    var i = 0;
    var key = "";
    var allResults = [];

    // If no findDistance function is defined, use the default
    if (findDistanceFunction === undefined) {
        findDistanceFunction = this.findDistanceFunction;
    }

    // Loop through all the keys in the model
    for (key in speechModel) {
        // Loop through all entries for that key
        for (i = 0; i < speechModel[key].length; i++) {

            var curDistance = findDistanceFunction(input, speechModel[key][i]);
            var curConfidence = this.calcConfidence(curDistance, speechModel[key][i]);
            var curNoise = this.calculateNoise(input, speechModel[key][i]);

            var newResult = {};
            newResult.match = key;
            newResult.confidence = curConfidence;
            newResult.noise = curNoise;
            newResult.frameCount = speechModel[key][i].length;
            allResults.push(newResult);
        }

    }

    allResults.sort(function(a, b) { return b.confidence - a.confidence; });

    if (numResults === -1) {
        return allResults;
    }

    return allResults.slice(0, numResults);
};

/**
 * Computes the sum of differances between an input and a modelEntry.
 * 
 * @param {Array} input
 * @param {Array} modelEntry
 * @return {Number}
 * @private
 */
JsSpeechRecognizer.prototype.findDistance = function(input, modelEntry) {
    var i = 0;
    var distance = 0;

    for (i = 0; i < Math.max(input.length, modelEntry.length); i++) {
        var modelVal = modelEntry[i] || 0;
        var inputVal = input[i] || 0;
        distance += Math.abs(modelVal - inputVal);
    }

    return distance;
};

/**
 * Will generate a distanceForKeywordSpotting function.
 * The function will calculate differences for entries in the model that
 * are greater than the parameter modelEntryGreaterThanVal.
 * 
 * @param {Number} modelEntryGreaterThanVal
 * @return {Function}
 * @private
 */
JsSpeechRecognizer.prototype.generateFindDistanceForKeywordSpotting = function(modelEntryGreaterThanVal) {

    /**
     * Calculates the keyword spotting distance an input is from a model entry.
     * 
     * @param {Array} input
     * @param {Array} modelEntry
     * @return {Number}
     * @private
     */
    return function(input, modelEntry) {
        var i = 0;
        var distance = 0;

        // Compare from the end of the input, for modelEntry.length entries
        for (i = 1; i <= modelEntry.length; i++) {
            var modelVal = modelEntry[modelEntry.length - i] || 0;
            var inputVal = input[input.length - i] || 0;
            if (modelVal > modelEntryGreaterThanVal) {
                distance += Math.abs(modelVal - inputVal);
            }
        }

        return distance;
    };
};

/**
 * Calculates a confidence value based on the distance form a model entry.
 * Max confidence is 1, min is negative infinity.
 * 
 * @param {Number} distance
 * @param {Array} modelEntry
 * @return {Number}
 * @private
 */
JsSpeechRecognizer.prototype.calcConfidence = function(distance, modelEntry) {
    var sum = 0;
    var i = 0;

    for (i = 0; i < modelEntry.length; i++) {
        sum += modelEntry[i];
    }

    return (1 - (distance / sum));
};

/**
 * Calculates how noisy an input is compared to a model entry.
 * 
 * @param {Array} input
 * @param {Array} modelEntry
 * @return {Number}
 * @private
 */
JsSpeechRecognizer.prototype.calculateNoise = function(input, modelEntry) {
    var i = 0;
    var sumIn = 0;
    var sumEntry = 0;

    // Compare from the end of the input, for modelEntry.length entries
    for (i = 1; i <= modelEntry.length; i++) {
        var modelVal = modelEntry[modelEntry.length - i] || 0;
        var inputVal = input[input.length - i] || 0;
        sumIn += inputVal * inputVal;

        // TODO: Optimize by caching the calculation for the model
        sumEntry += modelVal * modelVal;
    }

    return (sumIn / sumEntry);
};
