// Logs things. Not a morphic.

require('console-logger.js');
require('diff-logger.js');
require('db-logger.js');

var Trace;

// Setup
(function () {
    if (!Assignment.initOrRedirect()) {
        // The above method is redirecting us to log in, which means we need to
        // stop loading the page and show a redirecting message, in case the
        // redirect is very slow.
        document.clear();
        document.write(
            '<h2><a href="' + Assignment.redirectURL +
            '">Redirecting...</a></h2>'
        );
        return;
    }

    if (window.createLogger) {
        Trace = window.createLogger(Assignment.getID());
    } else {
        Trace = new Logger(50);
    }

    if (window.easyReload && window.easyReload(Assignment.getID())) {
        setTimeout(function() {
            window.onbeforeunload = null;
        }, 2000);
    }

    window.onerror = function(msg, url, line, column, error) {
        Trace.logError({
            'message': msg,
            'fileName': url,
            'lineNumber': line,
            'columnNumber': column,
            'stack': error ? error.stack : null,
        });
    };
})();
