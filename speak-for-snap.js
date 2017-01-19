var utterance = new SpeechSynthesisUtterance(message);
if (typeof finished_callback === 'object') {
   // callback provided
   utterance.onend = function (event) {
       invoke(finished_callback, new List([message]));
   };
}
window.speechSynthesis.speak(utterance);
