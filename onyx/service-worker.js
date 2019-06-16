// Service worker for progressive web app 
// caches files locally
// based upon https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

const cache_name = "onyx-nail-v1";

const files_to_cache = [
"/ai/onyx/dev.html",
"/ai/css/ai-teacher-guide.css",
"/ai/js/load-scripts.js",
"/ai/js/tfjs.js",
"/ai/js/tfjs-vis.js",
"/ai/js/mobilenet.js",
"/ai/js/knn-classifier.js",
"/ai/onyx/korean.js",
"/ai/onyx/nails.js",
"/ai/onyx/md5-min.js",
"/ai/onyx/train.js",
"/ai/js/mobilenet_v2_100_224/classification/2/model.json?tfjs-format=file",
"/ai/js/mobilenet_v2_100_224/classification/2/group1-shard1of4?tfjs-format=file",
"/ai/js/mobilenet_v2_100_224/classification/2/group1-shard2of4?tfjs-format=file",
"/ai/js/mobilenet_v2_100_224/classification/2/group1-shard3of4?tfjs-format=file",
"/ai/js/mobilenet_v2_100_224/classification/2/group1-shard4of4?tfjs-format=file",
"/ai/onyx/images/korean/L_NAIL_5nail_5nail2010_1_normalnail.png",
"/ai/onyx/images/korean/L_NAIL_5nail_5nail2014_1_normalnail.png",
"/ai/onyx/images/korean/L_NAIL_5nail_5nail2004_2_onychomycosis.png",
"/ai/onyx/images/korean/L_NAIL_5nail_5nail2006_onychomycosis_onychomycosis.png",
"/ai/onyx/images/korean/L_NAIL_5nail_5nail2005_2_onychomycosis.png",
"/ai/onyx/images/korean/L_NAIL_5nailA2_lesion_melanonychia3_melanonychia.png",
"/ai/onyx/images/korean/L_NAIL_5nail_nail2005_2_melanonychia.png",
"/ai/onyx/models/normal-fungal-serious-1000-every-5.json",
"/ai/onyx/models/normal-fungal-serious-1000-every-5.weights.bin",

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