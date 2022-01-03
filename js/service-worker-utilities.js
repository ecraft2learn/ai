// shared JavaScript between different service workingers implementing PWAs

// see https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle

/* Start the service worker and cache all of the app's content */
function install_listener (event, cache_name, files_to_cache) {
    console.log("Service worker " + cache_name + " waiting to install");
    event.waitUntil(
        caches.open(cache_name).then(function(cache) {
            console.log("Service worker " + cache_name + " installing");
            return cache.addAll(files_to_cache);
        })
    );
}

function active_listener (event, cache_name) {
    console.log("Service worker " + cache_name + " waiting to activate");
    event.waitUntil(
        caches.keys().then((keyList) => {
            console.log("Service worker " + cache_name + " activating");
            return Promise.all(keyList.map((key) => {
                if (key !== cache_name) {
                    const last_hypen = key.lastIndexOf('-');
                    if (key.substring(0, last_hypen) === cache_name.substring(0, last_hypen)) {
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