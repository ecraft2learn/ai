importScripts('/ai/js/service-worker-utilities.js');

const cache_name = 'snap-help-v3',
    files_to_cache = [
'hyperparameter-search.html', // from Snap! help block
'AI QnA explanation.html',
'hyperparameters_search.html', // from TensorFlow support iframe
'layers_help.html',
'training_help.html',
'progressive-web-app.html',
'noisy-polygons-project-ideas.html',
'images/hyperparameter-search.png',
'images/install-pwa.png'

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