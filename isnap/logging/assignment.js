// Static class for handling assignment gets and sets.
// TODO: Still stores the assignmentID in window, but should probably own it

var Assignment = {

};

Assignment.redirectURL = 'logging/assignment.html';

Assignment.initOrRedirect = function() {
    // Get the assignment passed via GET parameter
    window.assignmentID = getSearchParameters()['assignment'];

    var redirectURL = Assignment.redirectURL;

    if (window.requireAssignment && (!window.assignments ||
            !window.assignments[assignmentID])) {
        // redirect if no assignment is listed
        redirectURL += window.location.hash;
        window.location.replace(redirectURL);
        return false;
    }

    // Also check for a userID
    window.userID = getSearchParameters()['user'];
    if (!window.userID || window.userID.length == 0) {
        window.userID = window.userID || getCookie('snapIDHash');
    }
    if (window.requireLogin && !userID && window.assignmentID !== 'view') {
        if (window.assignmentID) {
            redirectURL += '?assignment=' + window.assignmentID;
        }
        redirectURL += window.location.hash;
        // redirect if the user isn't logged in
        window.location.replace(redirectURL);
        return false;
    }
    return true;
};

Assignment.onChangedHandlers = [];

Assignment.get = function() {
    if (!window.assignmentID || !window.assignments) return null;
    return window.assignments[window.assignmentID];
};

Assignment.getID = function() {
    return window.assignmentID;
};

Assignment.setID = function(assignmentID) {
    if (assignmentID === Assignment.getID()) return;
    if (!window.assignments || !window.assignments[assignmentID]) {
        Trace.logErrorMessage('Invalid assignment: ' + assignmentID);
        return;
    }

    // Log the change twice, so it will show up for both assignments
    var formerID = Assignment.getID();
    Trace.log('Assignment.setID', assignmentID);
    window.assignmentID = assignmentID;
    // Update the project's assignment (overwrite it) to the new assignmentID
    // This will only matter if the project is saved, which presumably implies
    // the change was intended to be permanent
    Assignment.updateStageAssignment(true);

    // Force the code to be re-logged so that we have an initial code state for
    // the new assignment log
    Trace.log('Assignment.setIDFrom', formerID, false, true);

    var params = getSearchParameters();
    var path = location.pathname;
    var keys = Object.keys(params);
    var sep = '?';
    keys.forEach(function(key) {
        var val = params[key];
        if (key === 'assignment') val = assignmentID;
        path += sep + encodeURIComponent(key) + '=' +
            encodeURIComponent(val);
        sep = '&';
    });
    window.history.replaceState(assignmentID, assignmentID, path);

    var assignment = Assignment.get();
    Assignment.onChangedHandlers.forEach(function(handler) {
        if (handler) handler(assignment);
    });

    if (window.ide) ide.fixLayout();
};

Assignment.updateStageAssignment = function(overwrite) {
    // If overwriting or the project's assignment is 'none' or null,
    // update it to match the current assignmentID
    if (window.ide && ide.stage && (overwrite || ide.stage.assignment == null ||
            ide.stage.assignment === '' || ide.stage.assignment === 'none')) {
        ide.stage.assignment = Assignment.getID();
    }
};

Assignment.onChanged = function(handler) {
    Assignment.onChangedHandlers.push(handler);
};

extend(StageMorph, 'init', function(base, globals) {
    base.call(this, globals);
    this.assignment = Assignment.getID();
});

extend(SnapSerializer, 'openProject', function(base, project, ide) {
    base.call(this, project, ide);
    Assignment.updateStageAssignment();

    // When a project is opened, update the current assignment to match
    if (ide.stage && ide.stage.assignment !== Assignment.getID() &&
            window.assignments) {
        var currentAssignment = Assignment.get();
        var projectAssignmentID = ide.stage.assignment;
        // Make sure the project's assignment is listed and not a prequel of
        // the current assignment
        if (window.assignments[projectAssignmentID] &&
                currentAssignment.prequel !== projectAssignmentID) {
            // Then update to the project's assignment
            Trace.log('Assignment.updateAssignmentOnOpen');
            Assignment.setID(projectAssignmentID);
        }

    }
});

extend(IDE_Morph, 'createControlBar', function(baseCreate) {
    baseCreate.call(this);
    var ide = this;
    extendObject(this.controlBar, 'updateLabel', function(base) {
        base.call(this);
        if (ide.isAppMode) return;
        var assignment = Assignment.get();
        if (!assignment) return;
        // A bit of a crude approximation, but it's not worth measuring exactly
        var maxLength = Math.max(0, (ide.spriteEditor.width() / 6) - 35);
        var text = this.label.text;
        if (Assignment.getID() !== 'none' && (maxLength - text.length) > 5) {
            text += ' - ' + assignment.name;
        }
        if (text.length > maxLength) {
            text = text.slice(0, maxLength) + '...';
        }
        this.label.text = text;
        this.label.parent = null;
        this.label.drawNew();
        this.label.parent = this;

        if (!window.allowChangeAssignment) return;

        this.label.mouseEnter = function() {
            document.body.style.cursor = 'pointer';
        };

        this.label.mouseLeave = function() {
            document.body.style.cursor = 'inherit';
        };

        this.label.mouseClickLeft = function() {
            var menu = new MenuMorph(ide);
            var pos = ide.controlBar.label.bottomLeft();
            menu.addItem(
                localize('Change assignment:'), null, null, null, true);
            Object.keys(window.assignments).forEach(function(key) {
                if (key === 'test' || key === 'view') return;
                var assignment = window.assignments[key];
                var name = assignment.name;
                if (assignment.hint) {
                    name += ' (' + assignment.hint + ')';
                }
                menu.addItem(name, function() {
                    Assignment.setID(key);
                    ide.controlBar.updateLabel();
                    ide.controlBar.fixLayout();
                }, null, null, key === Assignment.getID());
            });
            menu.popup(world, pos);
        };
    });
});