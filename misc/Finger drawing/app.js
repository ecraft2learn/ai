const video = document.getElementById('webcam');

let currentColor = 'black'; // Default color

async function setupWebcam() {
    try {
        const constraints = { video: { width: 640, height: 480 } };
        video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });
    } catch (err) {
        console.error(err);
    }
}

setupWebcam();

async function loadHandposeModel() {
    const model = await handpose.load();
    return model;
}

async function detectFingerDirection(predictions) {
    if (predictions.length > 0) {
        const keypoints = predictions[0].landmarks;
        const indexFingerTip = keypoints[8];
        const indexFingerBase = keypoints[5];

        const directionVector = {
            x: indexFingerTip[0] - indexFingerBase[0],
            y: indexFingerTip[1] - indexFingerBase[1],
        };

        return directionVector;
    }

    return null;
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function draw(x, y, color) {
    if (!drawing) return;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error('Speech recognition not supported in this browser.');
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    return recognition;
}

function extractColor(transcript) {
    // Define a list of supported colors
    const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'black', 'white'];

    const words = transcript.toLowerCase().split(' ');
    for (const word of words) {
        if (colors.includes(word)) {
            return word;
        }
    }

    return null;
}

async function mainLoop(model) {
    const predictions = await model.estimateHands(video);
    const directionVector = await detectFingerDirection(predictions);

    if (directionVector && predictions.length > 0) {
        const indexFingerTip = predictions[0].landmarks[8];
        const x = indexFingerTip[0];
        const y = indexFingerTip[1];

        if (directionVector.y < 0) {
            // Finger is pointing upwards, start drawing
            drawing = true;
            draw(x, y, currentColor);
        } else {
            // Finger is not pointing upwards, stop drawing
            drawing = false;
            ctx.beginPath();
        }
    }

    requestAnimationFrame(() => mainLoop(model));
}

document.addEventListener('DOMContentLoaded', async () => {
    const model = await loadHandposeModel();
    const recognition = setupSpeechRecognition();
    if (recognition) {
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            const extractedColor = extractColor(transcript);
        
            if (extractedColor) {
                currentColor = extractedColor;
            }
        
            // Update the content of the last spoken and current color elements
            document.getElementById('last-spoken').textContent = `Last spoken: ${transcript}`;
            document.getElementById('current-color').textContent = `Current color: ${currentColor}`;
        };
        recognition.start();
    }
    await setupWebcam();
    mainLoop(model);
});









