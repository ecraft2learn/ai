importScripts('/ai/js/service-worker-utilities.js');

const cache_name = 'snap-mobilenet-v2',
    files_to_cache = [
'/ai/js/tfjs.js',
'/ai/js/mobilenet.js',
'/ai/mobilenet/index.html',
'/ai/mobilenet/classify.js',
'/ai/js/mobilenet_v1_1.0_224/group1-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group10-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group11-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group12-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group13-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group14-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group15-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group16-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group17-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group18-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group19-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group2-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group20-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group21-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group22-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group23-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group24-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group25-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group26-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group27-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group28-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group29-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group3-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group30-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group31-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group32-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group33-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group34-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group35-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group36-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group37-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group38-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group39-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group4-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group40-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group41-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group42-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group43-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group44-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group45-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group46-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group47-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group48-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group49-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group5-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group50-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group51-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group52-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group53-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group54-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group55-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group6-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group7-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group8-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/group9-shard1of1',
'/ai/js/mobilenet_v1_1.0_224/model.json',
'/ai/js/mobilenet_v2_100_224/classification/2/group1-shard1of4',
'/ai/js/mobilenet_v2_100_224/classification/2/group1-shard2of4',
'/ai/js/mobilenet_v2_100_224/classification/2/group1-shard3of4',
'/ai/js/mobilenet_v2_100_224/classification/2/group1-shard4of4',
'/ai/js/mobilenet_v2_100_224/classification/2/model.json',

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