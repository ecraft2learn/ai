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

async function repeatUserSpeech() {
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

        recognition.onresult = async (event) => {
            const last = event.results.length - 1;
            const text = event.results[last][0].transcript;

            const randomLanguage = getRandomLanguage();
            const availableVoices = synth.getVoices().filter(voice => voice.lang.startsWith(randomLanguage.lang));

            if (availableVoices.length > 0) {
                const randomVoice = getRandomVoice(availableVoices);
                const pitch = 1 + getRandomNumber(10) / 10; // Range 1 to 2
                const rate = 0.5 + getRandomNumber(10) / 10; // Range 0.5 to 1.5

                const translatedText = await translateText(text, randomLanguage.lang);

                const utterance = new SpeechSynthesisUtterance(translatedText);

                utterance.lang = randomVoice.lang;
                utterance.voice = randomVoice;
                utterance.pitch = pitch;
                utterance.rate = rate;

                synth.speak(utterance);

                displayOutput(`
                    Text Heard: ${text}<br>
                    Translated Text: ${translatedText}<br>
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

async function translateText(text, targetLanguage) {
    if (!userApiKey) {
        displayOutput('Please enter your Google Translate API Key');
        return text;
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${userApiKey}`;

    const requestBody = {
        q: text,
        target: targetLanguage,
        format: 'text',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (result.error) {
        console.error('Error translating text:', result.error.message);
        return text;
    } else {
        return result.data.translations[0].translatedText;
    }
}

// commented out the Huggingface version since most of the time it responded that the model was being loaded...
// could have tried to wait...
// async function translateText(text, targetLanguage) {
//     if (!userApiKey) {
//         displayOutput('Please enter your Google Translate API Key');
//         return text;
//     }

//     const url = 'https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-' + targetLanguage;
//     const headers = new Headers({
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + userApiKey,
//     });

//     const body = {
//         inputs: text,
//     };

//     const requestOptions = {
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(body),
//     };

//     const response = await fetch(url, requestOptions);
//     // if (response.status !== 200) {
//     //     console.error(`Error translating text: HTTP status code ${response.status}`);
//     //     displayOutput('Translation service is temporarily unavailable. Please try again later.');
//     //     return text;
//     // }

//     const result = await response.json();

//     if (result.error) {
//         console.error('Error translating text:', result.error.message);
//         return text;
//     } else {
//         return result[0].generated_text;
//     }
// }

let userApiKey = '';

function storeApiKey() {
    const apiKeyInput = document.getElementById('api-key');
    userApiKey = apiKeyInput.value;
    if (userApiKey) {
        apiKeyInput.style.borderColor = '';
    } else {
        apiKeyInput.style.borderColor = 'red';
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
