// shared JavaScript between different service workingers implementing PWAs

// see https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle

/* Start the service worker and cache all of the app's content */
function install_listener (event, cache_name, files_to_cache) {
    console.log("Service worker " + cache_name + " waiting to install");
    event.waitUntil(
        caches.open(cache_name).then(function(cache) {
            console.log("Service worker " + cache_name + " installing");
            const result = cache.addAll(files_to_cache);
            // was cache.addAll(files_to_cache.map(file => new Request(file, {cache: 'reload'})));
            // but then every time I loaded a PWA it took a noticable long time
            console.log("Service worker " + cache_name + " cached all files");
            return result;
        })
    );
}

function active_listener (event, cache_name) {
    console.log("Service worker " + cache_name + " waiting to activate");
    if ('navigationPreload' in self.registration) {
        // suggested by https://googlechrome.github.io/samples/service-worker/custom-offline-page/
        self.registration.navigationPreload.enable();
    }
    event.waitUntil(
        caches.keys().then((keyList) => {
            console.log("Service worker " + cache_name + " activating");
            return Promise.all(keyList.map((key) => {
                if (key !== cache_name) {
                    console.log(key + " " + cache_name + " " + 
                                key.substring(0, key.lastIndexOf('-')) + " " + cache_name.substring(0, cache_name.lastIndexOf('-')));
                    if (key.substring(0, key.lastIndexOf('-')) === cache_name.substring(0, cache_name.lastIndexOf('-'))) {
                        // only delete old if different version of the same cache 
                        console.log("Deleting " + key + " since not equal to " + cache_name);
                        return caches.delete(key);
                    }
                }
            }));
        })
    );
}

/* Serve cached content when offline */
// note that https://googlechrome.github.io/samples/service-worker/custom-offline-page/
// has a very different way of doing this
function fetch_listener (event) {
    event.respondWith(
        caches.match(event.request, {'ignoreSearch': true}).then((response) => {
            try {
                return response || fetch(event.request);
            } catch (error) {
                console.error(error); 
            }
        },
        (error) => {
            console.error(error);
        })
    );
}