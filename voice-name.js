var voices = window.speechSynthesis.getVoices();
if (voice >= 0 && voice < voices.length) {
    return voices[Math.floor(voice)].name;
} else {
    alert("Only " + voices.length + " voices are available. You can't choose voice number " + voice);
}
