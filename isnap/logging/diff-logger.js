
require('logger');
require('../isnap/lib/simplediff.min');

// The DiffLogger requires a reference to simplediff, not currently setup
// https://github.com/paulgb/simplediff
// It reduces output by only recordering the diff between two code states.
function DiffLogger(interval) {
    Logger.call(this, interval);
}

DiffLogger.prototype = Object.create(Logger.prototype);

DiffLogger.prototype.codeDiff = function(a, b, addNewLines) {
    if (addNewLines) {
        a = this.addXmlNewlines(a);
        b = this.addXmlNewlines(b);
    }

    var aArray = a.split('\n');
    var bArray = b.split('\n');

    var difference = window.diff(aArray, bArray);
    var out = [];
    var line = 0;
    for (var i = 0; i < difference.length; i++) {
        var op = difference[i][0];
        var values = difference[i][1];
        if (op === '+') {
            out.push([line, '+', values.join('\n')]);
            line += values.length;
        } else if (op == '-') {
            out.push([line, '-', values.length]);
        } else {
            line += values.length;
        }
    }
    return out;
};

DiffLogger.prototype.addCode = function(log) {
    Logger.prototype.addCode.call(this, log);
    if (!log.code) return;

    if (!this.lastCode || this.lastProject != log.projectID) this.lastCode = '';
    var code = this.addXmlNewlines(log.code);
    log.code = this.codeDiff(this.lastCode, code);

    this.lastCode = code;
    this.lastProject = log.projectID;
};
