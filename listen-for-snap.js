if (!window.speech_recognition) {
    window.snap_listen =
        (function () {
            var restart = function () {
                if (window.speechSynthesis.speaking) { // don't listen while speaking
                    setTimeout(restart, 500); // try again in half a second
                    return;
                }
                try {
                    waiting_for_speech = true;
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
            window.speech_recognition = (typeof SpeechRecognition === 'undefined') ? 
                new webkitSpeechRecognition() :
                new SpeechRecognition();
            window.speech_recognition.onresult = function (event) {
                var spoken = event.results[0][0].transcript;
                console.log("Confidence is " + event.results[0][0].confidence + " for " + spoken);
                window.speech_recognition.stop();
                invoke(spoken_callback, new List([spoken]));
            };
            window.speech_recognition.onerror = function (event) {
                if (event.error === 'aborted') {
                    console.log("aborted so restarting speech recognition");
                    window.speech_recognition.start();
                    return;
                }
                if (event.error === 'no-speech') {
                    window.speech_recognition.onend = null;
                    window.speech_recognition.onresult = null;
                    window.speech_recognition.stop();
                    window.speech_recognition = null;
                }
                console.log("Recognition error: " + event.error);
                if (typeof error_callback === 'object') {
                    invoke(error_callback, new List([event.error]));
                }
            };
            window.speech_recognition.onend = function (event) {
                console.log("recognition ended");
                restart(); 
            };
            return restart;
        } ());
}
window.snap_listen();
