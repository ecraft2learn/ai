// see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
var utterance = new SpeechSynthesisUtterance(message);
if (lang) {
   utterance.lang = lang;
}
if (pitch > 0) {
   utterance.pitch = pitch;
}
if (rate > 0) {
   utterance.rate = rate;
}
if (voice) {
   voices = window.speechSynthesis.getVoices();
   if (voice < voices.length) {
       utterance.voice = voices[voice];
   } else {
       alert("Only " + voices.length + " voices are available so you can't choose voice number " + voice);
   }
}
if (volume > 0) {
   utterance.volume = volume;
}
if (typeof finished_callback === 'object') {
   // callback provided
   utterance.onend = function (event) {
       invoke(finished_callback, new List([message]));
   };
}
if (window.speech_recognition) {
   window.speech_recognition.abort();
}
window.speechSynthesis.speak(utterance);
