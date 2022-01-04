importScripts('/ai/js/service-worker-utilities.js');

const cache_name = 'snap-segmentation-v1',
    files_to_cache = [
'/ai/segmentation/body_pix.js',
'/ai/segmentation/index.html',
'/ai/segmentation/part_to_color.txt',
'/ai/segmentation/mobilenet/quant2/075/group1-shard1of1.bin',
'/ai/segmentation/mobilenet/quant2/075/model-stride16.json',
'/ai/segmentation/resnet50/quant2/group1-shard10of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard11of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard12of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard1of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard2of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard3of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard4of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard5of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard6of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard7of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard8of12.bin',
'/ai/segmentation/resnet50/quant2/group1-shard9of12.bin',
'/ai/segmentation/resnet50/quant2/model-stride32.json',
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


