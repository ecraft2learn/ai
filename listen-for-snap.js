var restart = function () {
    if (window.speechSynthesis.speaking) { // don't listen while speaking
        setTimeout(restart, 500); // try again in half a second
        return;
    }
    try {
        window.speech_recognition.start();
        console.log("recognition started");
    } catch (error) {
        if (error.name === 'InvalidStateError') {
            // delay needed at least in Chrome 52
            setTimeout(restart, 2000);
        } else {
            console.log(error);
        }
    }
};
var handle_result = function (callback, event) {
    var spoken = event.results[0][0].transcript;
    console.log("Confidence is " + event.results[0][0].confidence + " for " + spoken, spoken_callback);
    window.speech_recognition.stop();
    invoke(callback, new List([spoken]));
};
var handle_error = function (callback, event) {
    if (event.error === 'aborted') {
        console.log("aborted so restarting speech recognition in half a second");
        setTimeout(restart, 500);
        return;
    }
    if (event.error === 'no-speech') {
        window.speech_recognition.onend = null;
        window.speech_recognition.onresult = null;
        window.speech_recognition.stop();
    }
    console.log("Recognition error: " + event.error);
    if (typeof callback === 'object') {
        invoke(callback, new List([event.error]));
    }
};
if (!window.speech_recognition) {
    window.speech_recognition = (typeof SpeechRecognition === 'undefined') ? 
        new webkitSpeechRecognition() :
        new SpeechRecognition();
}
window.speech_recognition.onresult = function (event) {
    handle_result(spoken_callback, event);
};
window.speech_recognition.onerror = function (event) {
    handle_error(error_callback, event);
};
window.speech_recognition.onend = function (event) {
    console.log("recognition ended");
    restart(); 
};
restart();
