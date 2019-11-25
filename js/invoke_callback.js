 /**
 * Implements JavaScript functions that support JavaScript callbacks in a way that is extended when inside of Snap! to handle Snap! callbacks
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict"

let outstanding_callbacks = [];

const record_callbacks = (...args) => {
    args.forEach(function (callback) {
        if (typeof callback === 'function' && outstanding_callbacks.indexOf(callback) < 0) {
            outstanding_callbacks.push(callback);
        }
    });
};

const invoke_callback = (callback, ...args) => { // any number of additional arguments
    if (callback && callback.stopped_prematurely) {
        return;
    }
    if (typeof callback === 'function') { 
        callback.apply(this, args);
        const index = outstanding_callbacks.indexOf(callback);
        if (index >= 0) {
            outstanding_callbacks.splice(index, 1);
        }
    }
    // otherwise no callback provided so ignore it
};

const stop_all = () => {
    outstanding_callbacks.forEach(function (callback) {
        callback.stopped_prematurely = true;
    });
    outstanding_callbacks = [];
};