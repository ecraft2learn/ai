const cacheName = 'snap-tensorflow-v3',
    filesToCache = [
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

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
    console.log("Service worker " + cacheName + " waiting to install");
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("Service worker " + cacheName + " installing");
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', (evt) => {
    console.log("Service worker " + cacheName + " waiting to activate");
    evt.waitUntil(
        caches.keys().then((keyList) => {
            console.log("Service worker " + cacheName + " activating");
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    console.log("Deleting " + key + " since not equal to " + cacheName);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request, {'ignoreSearch': true}).then(function(response) {
                   try {
                       return response || fetch(e.request);
                   } catch (error) {
                       console.error(error); 
                   }
        },
        (error) => {
            console.error(error);
        })
    );
});


