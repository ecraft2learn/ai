"use strict";
if (typeof ecraft2learn === 'object') {
    return ecraft2learn.run(function_name, parameters);
} else {
    alert("Any eCraft2Learn command must be run before the " + function_name + " reporter.");
    return 0;
}
