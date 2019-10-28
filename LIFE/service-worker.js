// Service worker for progressive web app 
// caches files locally
// based upon https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

const cache_name = "life-support-v6";

const files_to_cache = [
"/ai/LIFE/index.html",
"/ai/css/ai-teacher-guide.css",
"/ai/ecraft2learn.js",
"/ai/js/tfjs.js",
"/ai/js/train.js",
"/ai/js/train-report-results.js",
"/ai/js/load-scripts.js",
"/ai/LIFE/encoder/universal-sentence-encoder.js",
"/ai/js/user-agent.js",
"/ai/LIFE/LIFE.js",
"/ai/LIFE/encoder/model.json",
"/ai/LIFE/encoder/vocab.json",
"/ai/LIFE/type.mp3",
"/ai/LIFE/encoder/group1-shard1of7",
"/ai/LIFE/encoder/group1-shard2of7",
"/ai/LIFE/encoder/group1-shard3of7",
"/ai/LIFE/encoder/group1-shard4of7",
"/ai/LIFE/encoder/group1-shard5of7",
"/ai/LIFE/encoder/group1-shard6of7",
"/ai/LIFE/encoder/group1-shard7of7",
"/ai/LIFE/models/26-10-2019b.json",
"/ai/LIFE/models/26-10-2019b.weights.bin",
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