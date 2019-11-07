 /**
 * Implements a function so that different scripts can be loaded if page is on localhost
 * This is important to provide functionality for those with no or poor Internet connections
 * Authors: Ken Kahn
 * License: New BSD
 */

function load_local_or_remote_scripts (local_URLs, remote_URLs, callback) {
    if (typeof local_URLs === 'string') {
        local_URLs = [local_URLs];
    }
    if (typeof remote_URLs === 'string') {
        remote_URLs = [remote_URLs];
    }
    const load_URLs = () => {
        if (scripts_remaining.length === 0) {
            // listeners for DOMContentLoaded above may have not yet been created when they loaded
            let event = document.createEvent('Event');
            event.initEvent('DOMContentLoaded', true, true);
            window.dispatchEvent(event);
            if (callback) {
                callback();
            }
            return;
        }
        let next_URL = scripts_remaining.splice(0, 1)[0];
        const script = document.createElement('script');
        script.onload = load_URLs;
        script.src = next_URL;
        script.charset = "UTF-8";
//         script.type = "module";
        document.head.appendChild(script);
    };
    let scripts_remaining = (window.location.hostname === "localhost" || window.location.protocol === "file") ?
                            local_URLs :
                            (remote_URLs || local_URLs); // if remote_URLs not provided just use local ones
    load_URLs();
}
