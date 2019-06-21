// Logger classes

require('assignment');

function Logger(interval) {
    this.init(interval);
}

Logger.sessionID = newGuid();
Logger.prototype.serializer = new SnapSerializer();
Logger.prototype.serializer.excludeMedia = true;

Logger.prototype.init = function(interval) {
    this.queue = [];
    this.onCodeChanged = function(code) { };
    this.log('Logger.started');
    this.start(interval);
    this.forceLogCode = false;
};

// Get user identifying user info and bundle it as an object
Logger.prototype.userInfo = function() {
    var browserID = null;
    // browser ID stored in cache or local storage
    if (typeof(Storage) !== 'undefined' && localStorage) {
        browserID = localStorage.getItem('browserID');
        if (!browserID) {
            browserID = newGuid();
            localStorage.setItem('browserID', browserID);
        }
    }
    return {
        'userID': userID,
        'sessionID': Logger.sessionID,
        'browserID': browserID,
    };
};

Logger.prototype.flushSaveCode = function() {
    // If we have a pending saveCode function, run it and cancel the callback
    if (this.saveCode) {
        this.saveCode();
        if (this.saveCodeTimeout) {
            clearTimeout(this.saveCodeTimeout);
            this.saveCodeTimeout = null;
        }
    }
};

/**
 * Logs a message. Depending on the logger being used, the message
 * may be output to the console or sent to be stored in a database.
 *
 * @this {Logger}
 * @param {string} message The message to be logged. This is usually
 * of the form '[Class].[action]', e.g. 'Logger.started', 'IDE.selectSprite'
 * or 'Block.snapped'
 * @param {object} data A javascript object to be logged in its entirety. Be
 * careful not to pass large objects here.
 * @param {boolean} saveImmediately If true, the code state will be saved
 * immediately. By default, the code is saved on the next frame, allowing
 * logging calls to capture code changes that occur immediately the logging
 * statement. For example, this allows a logging statement to come at the
 * beginning of a method which alters the code, and have that state change
 * still captured.
 * @param {boolean} forceLogCode Forces the logger to log the code state, even
 * if unchanged.
 */
Logger.prototype.log = function(message, data, saveImmediately, forceLogCode) {
    if (!(message || data)) return;

    this.flushSaveCode();

    var log = {
        'message': message,
        'data': data,
        'time': Date.now(),
        'assignmentID': Assignment.getID(),
    };

    this.forceLogCode |= forceLogCode;

    // Set a callback to save the code state in 1ms
    // This allows us to call log() at the beginning of a method
    // and save the code after it's finished executing
    // (or before the next log() call, per the code above)
    var myself = this;
    this.saveCode = function() {
        myself.saveCode = null;
        myself.addCode(log);
    };
    // If saveImmediately is true, we just run it now
    if (saveImmediately) {
        this.saveCode();
    } else {
        this.saveCodeTimeout = setTimeout(this.saveCode, 1);
    }

    this.queue.push(log);
};

// Log a message as an error
Logger.prototype.logErrorMessage = function(error) {
    if (!error || !error.length) return;
    var maxLength = 5000;
    if (error.length > maxLength) {
        error = error.substring(0, maxLength) + '...';
    }
    try {
        // Have to actually throw the error for .stack to show up on IE
        throw new Error(error);
    } catch (e) {
        this.logError(e);
    }
};

// Log a javascript error
Logger.prototype.logError = function(error) {
    if (!error) return;
    // eslint-disable-next-line no-console
    console.error(error);
    this.log('Error', {
        'message': error.message,
        'url': error.fileName,
        'line': error.lineNumber,
        'column': error.columnNumber,
        'stack': error.stack,
        'browser': this.getBrowser(),
    });
};

// Credit: http://stackoverflow.com/a/9851769/816458
Logger.prototype.getBrowser = function() {
    try {
        if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
            return 'Opera';
        }
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        if (typeof InstallTrigger !== 'undefined') return 'Firefox';
        // At least Safari 3+: '[object HTMLElementConstructor]'
        if (Object.prototype.toString.call(window.HTMLElement)
                .indexOf('Constructor') > 0) {
            return 'Safari';
        }
        // Chrome 1+
        if (window.chrome) return 'Chrome';
        // At least IE6
        if (/*@cc_on!@*/false || !!document.documentMode) return 'IE';
    } catch (e) {
        // empty
    }
    return null;
};

Logger.prototype.addCode = function(log) {
    if (typeof(ide) == 'undefined' || !ide.stage) return;
    log.projectID = ide.stage.guid;

    var code = this.simpleCodeXML();

    if (this.forceLogCode || this.hasCodeChanged(this.lastCode, code)) {
        this.forceLogCode = false;
        log.code = code;
        this.lastCode = code;
        if (this.onCodeChanged) this.onCodeChanged(code);
    }
};

Logger.prototype.removeCoordinates = function(xml) {
    if (!xml) return xml;
    // Remove the tags that have coordinates (and nothing else of interest)
    return xml.replace(/<(sprite|stage|watcher|script) [^>]*>/g, '');
};

Logger.prototype.hasCodeChanged = function(xml1, xml2) {
    // Remove coordinates before comparing code, since we don't need to
    // log these unimportant changes to the code state
    return this.removeCoordinates(xml1) !== this.removeCoordinates(xml2);
};

Logger.prototype.addXmlNewlines = function(xml) {
    // Add newlines at the end of each tag
    // TODO: there's probably a better regex way to do this
    if (!xml) return xml;
    xml = xml.replace(/(<[^<>]*>)/g, '$1\n');
    xml = xml.replace(/(.)(<[^<>]*>)/g, '$1\n$2');
    xml = xml.trim();
    return xml;
};

Logger.prototype.storeMessages = function(logs) {

};

/**
 * Stops the logger from posting messages.
 * Messages can still be logged and will post
 * when the logger is started.
 *
 * @this {Logger}
 */
Logger.prototype.stop = function() {
    clearInterval(this.storeCallback);
};

/**
 * Starts the logger. Messages will be posted
 * at the provided interval.
 *
 * @param {int} interval The interval at which to post
 * logged messages.
 */
Logger.prototype.start = function(interval) {
    if (!interval) return;
    var myself = this;
    this.storeCallback = setInterval(function() {
        myself.sendLogs();
    }, interval);
};

Logger.prototype.sendLogs = function() {
    if (this.queue.length === 0) return;
    this.flushSaveCode();
    this.storeMessages(this.queue);
    this.queue = [];
};

Logger.prototype.simpleCodeXML = function() {
    // Don't serialize the project while it's still opening
    if (Logger.openingProject) return this.lastCode || '';

    // Add a special flag to make the VariableFrame omit variable state
    VariableFrame.dontSerializeVariableState = true;
    var xml = this.serializer.serialize(ide.stage);
    // Then make sure to reset it
    VariableFrame.dontSerializeVariableState = false;

    if (!xml) return xml;
    // We don't want to log the stage image every time
    xml = xml.replace(/data:image\/[^<\"]*/g, '');
    xml = xml.replace(/data:audio\/[^<\"]*/g, '');
    return xml;
};

extend(VariableFrame, 'toXML', function(base, serializer) {
    var removeValues = VariableFrame.dontSerializeVariableState;
    var valueMap = null;
    var myself = this;

    if (removeValues) {
        // If needed, we remove the value of non-literal variables first
        // and store them in a map for later replacement
        valueMap = { };
        Object.keys(this.vars).forEach(function(key) {
            var value = myself.vars[key].value;
            if (typeof value === 'object') {
                valueMap[key] = value;
                myself.vars[key].value = null;
            }
        });
    }

    var value = base.call(this, serializer);

    if (valueMap) {
        // then we add it back after
        Object.keys(valueMap).forEach(function(key) {
            myself.vars[key].value = valueMap[key];
        });
    }

    return value;
});

extend(SnapSerializer, 'openProject', function(base, project, ide) {
    Logger.openingProject = true;
    base.call(this, project, ide);
    Logger.openingProject = false;
});