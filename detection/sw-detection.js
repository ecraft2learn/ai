importScripts('/ai/js/service-worker-utilities.js');

const cache_name = 'snap-detection-v2',
    files_to_cache = [
'/ai/js/tfjs.js',
'/ai/js/coco-ssd.js',
'/ai/js/translate.js',
'/ai/detection/detection.js',
'/ai/detection/index.html',
'/ai/detection/ssd_mobilenet_v2/group1-shard10of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard11of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard12of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard13of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard14of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard15of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard16of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard17of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard1of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard2of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard3of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard4of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard5of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard6of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard7of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard8of17',
'/ai/detection/ssd_mobilenet_v2/group1-shard9of17',
'/ai/detection/ssd_mobilenet_v2/model.json',
'/ai/detection/ssdlite_mobilenet_v2/group1-shard1of5',
'/ai/detection/ssdlite_mobilenet_v2/group1-shard2of5',
'/ai/detection/ssdlite_mobilenet_v2/group1-shard3of5',
'/ai/detection/ssdlite_mobilenet_v2/group1-shard4of5',
'/ai/detection/ssdlite_mobilenet_v2/group1-shard5of5',
'/ai/detection/ssdlite_mobilenet_v2/model.json'

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