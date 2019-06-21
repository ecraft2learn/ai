require('logger');

// Log to the console

ConsoleLogger.prototype = Object.create(Logger.prototype);

function ConsoleLogger(interval, logFunction) {
    Logger.call(this, interval);
    // eslint-disable-next-line no-console
    this.logFunction = logFunction || console.log;
}

ConsoleLogger.prototype.storeMessages = function(logs) {
    var myself = this;
    var out = this.logFunction;
    logs.forEach(function(log) {
        log.userInfo = myself.userInfo();
        out(log);
    });
};