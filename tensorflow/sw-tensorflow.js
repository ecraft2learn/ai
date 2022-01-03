importScripts('/ai/js/service-worker-utilities.js');

const cache_name = 'snap-tensorflow-v4',
    files_to_cache = [
'/ai/tensorflow/index.html',
'/ai/tensorflow/tensorflow.js',
'/ai/tensorflow/hyperparameters_search.html',
'/ai/tensorflow/layers_help.html',
'/ai/tensorflow/training_help.html',
'/ai/js/tfjs.js',
'/ai/js/tfjs-vis.js',
'/ai/js/dat.gui.js',
'/ai/js/hyperparameters.min.js',
'/ai/js/train.js',
'/ai/js/invoke_callback.js',
'/ai/js/training-utilities.js',
'/ai/js/translate.js',
'/ai/css/ai-teacher-guide.css'
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


