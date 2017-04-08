// see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
var utterance = new SpeechSynthesisUtterance(message);
if (language) {
   utterance.lang = language;
}
if (pitch > 0) {
   utterance.pitch = pitch;
}
if (rate > 0) {
   if (rate < .1) {
      // A very slow rate breaks Chrome's speech synthesiser
      rate = .1;
   }
   if (rate > 2) {
      rate = 2; // high rate also breaks Chrome's speech synthesis
   }
   utterance.rate = rate;
}
if (voice) {
   voices = window.speechSynthesis.getVoices();
   if (voice >= 0 && voice < voices.length) {
       utterance.voice = voices[Math.floor(voice)];
   } else {
       alert("Only " + voices.length + " voices are available. You can't choose voice number " + voice);
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
