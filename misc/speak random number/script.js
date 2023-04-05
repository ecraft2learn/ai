let voicesLoaded = false;
let languages = [];

function extractLanguagesFromVoices(voices) {
    const langs = new Set();
    voices.forEach(voice => {
        const languageCode = voice.lang.split('-')[0];
        langs.add(languageCode);
    });
    return Array.from(langs).map(lang => ({ lang }));
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

function getRandomLanguage() {
    return languages[getRandomNumber(languages.length)];
}

function getRandomVoice(voices) {
    return voices[getRandomNumber(voices.length)];
}

function displayOutput(message) {
    const output = document.getElementById("output");
    output.innerHTML = message;
}

function speakRandomInteger() {
    if (!voicesLoaded) {
        displayOutput('Voices not loaded yet. Please try again.');
        return;
    }

    const randomInteger = getRandomNumber(1000);
    const randomLanguage = getRandomLanguage();
    const synth = window.speechSynthesis;
    
    const availableVoices = synth.getVoices().filter(voice => voice.lang.startsWith(randomLanguage.lang));

    if (availableVoices.length > 0) {
        const randomVoice = getRandomVoice(availableVoices);
        const pitch = 1 + getRandomNumber(10) / 10; // Range 1 to 2
        const rate = 0.5 + getRandomNumber(10) / 10; // Range 0.5 to 1.5

        const utterance = new SpeechSynthesisUtterance(randomInteger.toString());
        utterance.lang = randomVoice.lang;
        utterance.voice = randomVoice;
        utterance.pitch = pitch;
        utterance.rate = rate;

        synth.speak(utterance);

        displayOutput(`
            Number: ${randomInteger}<br>
            Language: ${randomVoice.lang}<br>
            Voice: ${randomVoice.name}<br>
            Pitch: ${pitch.toFixed(1)}<br>
            Rate: ${rate.toFixed(1)}
        `);
    } else {
        displayOutput('No voices available for the selected language');
    }
}

function repeatUserSpeech() {
    if (!voicesLoaded) {
        displayOutput('Voices not loaded yet. Please try again.');
        return;
    }

    const synth = window.speechSynthesis;

    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const text = event.results[last][0].transcript;

            const randomLanguage = getRandomLanguage();
            const availableVoices = synth.getVoices().filter(voice => voice.lang.startsWith(randomLanguage.lang));

            if (availableVoices.length > 0) {
                const randomVoice = getRandomVoice(availableVoices);
                const pitch = 1 + getRandomNumber(10) / 10; // Range 1 to 2
                const rate = 0.5 + getRandomNumber(10) / 10; // Range 0.5 to 1.5

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = randomVoice.lang;
                utterance.voice = randomVoice;
                utterance.pitch = pitch;
                utterance.rate = rate;

                synth.speak(utterance);

                displayOutput(`
                    Text Heard: ${text}<br>
                    Language: ${randomVoice.lang}<br>
                    Voice: ${randomVoice.name}<br>
                    Pitch: ${pitch.toFixed(1)}<br>
                    Rate: ${rate.toFixed(1)}
                `);
            } else {
                displayOutput('No voices available for the selected language');
            }
        };

        recognition.start();
    } else {
        displayOutput('Speech Recognition API not supported in this browser');
    }
}

if (typeof window.speechSynthesis !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = () => {
        languages = extractLanguagesFromVoices(window.speechSynthesis.getVoices());
        voicesLoaded = true;
    };
} else {
    displayOutput('Web Speech API not supported in this browser');
}
