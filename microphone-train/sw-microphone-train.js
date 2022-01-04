importScripts('/ai/js/service-worker-utilities.js');

const cache_name = 'snap-camera-train-v1',
    files_to_cache = [

'/ai/microphone-train/adapter.js',
'/ai/microphone-train/audio-train.js',
'/ai/microphone-train/index.html',
'/ai/microphone-train/JsSpeechRecognizer.js',
'/ai/microphone-train/LICENSE',
'/ai/microphone-train/README.md',
'/ai/microphone-train/speech-commands.js',
'/ai/microphone-train/speech-commands.min.js',
'/ai/microphone-train/speechrec.html',
'/ai/microphone-train/train.js'

];

self.addEventListener('install', (event) => {
    install_listener(event, cache_name, files_to_cache);
});

self.addEventListener('activate', (event) => {
    active_listener (event, cache_name);
    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    fetch_listener (event)
});