// Service worker for progressive web app 
// caches files locally
// based upon https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

const cache_name = "life-support-v9";

const files_to_cache = [
"/ai/LIFE/index.html",
"/ai/css/LIFE.css",
"/ai/ecraft2learn.js",
"/ai/js/tfjs.js",
"/ai/js/train.js",
"/ai/js/invoke_callback.js",
"/ai/js/train-report-results.js",
"/ai/js/load-scripts.js",
"/ai/js/universal-sentence-encoder.js",
"/ai/js/user-agent.js",
"/ai/js/knn-classifier.js",
"/ai/LIFE/LIFE.js",
"/ai/LIFE/context_sensitive_covid_questions.js",
"/ai/LIFE/algorithm.html",
"/ai/LIFE/covid-scenario-1.js",
"/ai/LIFE/knn-dataset-covid-qa-cdc-africa.js",
"/ai/js/universal-sentence-encoder/model.json",
"/ai/js/universal-sentence-encoder/vocab.json",
"/ai/LIFE/sounds/12 bad.WAV",
"/ai/LIFE/sounds/pop2.WAV",
"/ai/LIFE/sounds/pop3.WAV",
"/ai/LIFE/sounds/pop5.WAV",
"/ai/LIFE/sounds/select good.WAV",
"/ai/LIFE/sounds/type.mp3",
"/ai/LIFE/images/credits.png",
"/ai/LIFE/images/DOC_FEMALE_MASK_1.png",
"/ai/LIFE/images/DOC_FEMALE_MASK_2.png",
"/ai/LIFE/images/legal.png",
"/ai/LIFE/images/start.png",
"/ai/LIFE/images/oxford-logo.png",
"/ai/LIFE/icons/icon-32.png",
"/ai/LIFE/icons/icon-256.png",
"/ai/LIFE/movies/How to fit check guidance 360p.mp4",
"/ai/LIFE/movies/PPE REMOVAL - Aerosol generating procedures 360p.mp4",
"/ai/js/universal-sentence-encoder/group1-shard1of7",
"/ai/js/universal-sentence-encoder/group1-shard2of7",
"/ai/js/universal-sentence-encoder/group1-shard3of7",
"/ai/js/universal-sentence-encoder/group1-shard4of7",
"/ai/js/universal-sentence-encoder/group1-shard5of7",
"/ai/js/universal-sentence-encoder/group1-shard6of7",
"/ai/js/universal-sentence-encoder/group1-shard7of7",
"/ai/LIFE/models/12-10-2020-covid.json",
"/ai/LIFE/models/12-10-2020-covid.weights.bin",
"/ai/LIFE/LIFE.webmanifest",
];

self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cache_name).then(function(cache) {
          console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(files_to_cache);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
          console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
                return caches.open(cache_name).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
          return Promise.all(keyList.map(function(key) {
        if(cache_name.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});