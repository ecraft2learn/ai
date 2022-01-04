importScripts('/ai/js/service-worker-utilities.js');

const cache_name = 'snap-posenet-v1',
    files_to_cache = [
'/ai/posenet/camera.js',
'/ai/posenet/demo_util.js',
'/ai/posenet/index.html',
'/ai/posenet/pose%20properties.txt',
'/ai/posenet/sample.html',
'/ai/posenet/mobilenet/models/float/050/group1-shard1of1.bin',
'/ai/posenet/mobilenet/models/float/050/model-stride16.json',
'/ai/posenet/mobilenet/models/float/050/model-stride8.json',
'/ai/posenet/mobilenet/models/float/075/group1-shard1of2.bin',
'/ai/posenet/mobilenet/models/float/075/group1-shard2of2.bin',
'/ai/posenet/mobilenet/models/float/075/model-stride16.json',
'/ai/posenet/mobilenet/models/float/075/model-stride8.json',
'/posenet/mobilenet/models/float/100/group1-shard1of4.bin',
'/posenet/mobilenet/models/float/100/group1-shard2of4.bin',
'/posenet/mobilenet/models/float/100/group1-shard3of4.bin',
'/posenet/mobilenet/models/float/100/group1-shard4of4.bin',
'/posenet/mobilenet/models/float/100/model-stride16.json',
'/posenet/mobilenet/models/float/100/model-stride8.json',
'/posenet/mobilenet/models/quant1/050/group1-shard1of1.bin',
'/posenet/mobilenet/models/quant1/050/model-stride16.json',
'/posenet/mobilenet/models/quant1/050/model-stride8.json',
'/posenet/mobilenet/models/quant1/075/group1-shard1of1.bin',
'/posenet/mobilenet/models/quant1/075/model-stride16.json',
'/posenet/mobilenet/models/quant1/075/model-stride8.json',
'/posenet/mobilenet/models/quant1/100/group1-shard1of1.bin',
'/posenet/mobilenet/models/quant1/100/model-stride16.json',
'/posenet/mobilenet/models/quant1/100/model-stride8.json',
'/posenet/mobilenet/models/quant2/050/group1-shard1of1.bin',
'/posenet/mobilenet/models/quant2/050/model-stride16.json',
'/posenet/mobilenet/models/quant2/050/model-stride8.json',
'/posenet/mobilenet/models/quant2/075/group1-shard1of1.bin',
'/posenet/mobilenet/models/quant2/075/model-stride16.json',
'/posenet/mobilenet/models/quant2/075/model-stride8.json',
'/posenet/mobilenet/models/quant2/100/group1-shard1of2.bin',
'/posenet/mobilenet/models/quant2/100/group1-shard2of2.bin',
'/posenet/mobilenet/models/quant2/100/model-stride16.json',
'/posenet/mobilenet/models/quant2/100/model-stride8.json',
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


