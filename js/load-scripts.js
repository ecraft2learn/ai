 /**
 * Implements a function so that different scripts can be loaded if page is on localhost
 * This is important to provide functionality for those with no or poor Internet connections
 * Authors: Ken Kahn
 * License: New BSD
 */

function load_local_or_remote_scripts (local_URLs, remote_URLs) {
    const load_URL = (URL) => {
        const script = document.createElement('script');
        script.src = URL;
        script.charset = "UTF-8";
        document.head.appendChild(script);
    };
    if (window.location.hostname === "localhost") {
        local_URLs.forEach(load_URL);
    } else {
        remote_URLs.forEach(load_URL);
    }
}

