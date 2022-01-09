importScripts('/ai/js/service-worker-utilities.js');

const cache_name = 'snap-tensorflow-v6',
    files_to_cache = [
'/ai/tensorflow/index.html',
'/ai/tensorflow/tensorflow.js',
'/ai/js/tfjs.js',
'/ai/js/tfjs-vis.js',
'/ai/js/dat.gui.js',
'/ai/js/hyperparameters.min.js',
'/ai/js/train.js',
'/ai/js/invoke_callback.js',
'/ai/js/training-utilities.js',
'/ai/js/translate.js',
'/ai/css/ai-teacher-guide.css',
'/ai/models/guess%20relation.json',
'/ai/models/guess%20relation.weights.bin',
'/ai/models/AI%20blocks%20QA%20b.json',
'/ai/models/AI%20blocks%20QA%20b.weights.bin',
'/ai/models/AI%20blocks%20QA.json',
'/ai/models/AI%20blocks%20QA.weights.bin',
'/ai/models/naming%20colors.json',
'/ai/models/naming%20colors.weights.bin',
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


