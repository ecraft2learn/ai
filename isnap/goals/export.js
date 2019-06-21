function createChild(parent, tag, html, clazz) {
    var element = document.createElement(tag);
    if (html) element.innerHTML = html;
    if (clazz) element.classList.add(clazz);
    if (parent) parent.appendChild(element);
    return element;
}

function writeAssignment(assignment) {
    if (!assignment.goals) return;
    var out = document.getElementById('out');
    var div = createChild(out, 'div');
    createChild(div, 'h2', assignment.name);
    var table = createChild(div, 'table');
    var header = createChild(table, 'tr');
    createChild(header, 'th', 'Goal');
    createChild(header, 'th', 'Dependencies');
    createChild(header, 'th', 'Description');
    assignment.goals.forEach(function(goal) {
        writeGoal(table, goal);
    });
}

function writeGoal(parent, goal) {
    var row = createChild(parent, 'tr');
    var deps = '';
    for (var i = 0; i < goal.prerequisites.length; i++) {
        if (i > 0) deps += ', ';
        deps += goal.prerequisites[i];
    }
    createChild(row, 'td', '<b>' + goal.title + '</b>');
    createChild(row, 'td', deps);
    createChild(row, 'td', goal.description);
}

(function() {
    if (!window.assignments) return;
    for (var key in window.assignments) {
        if (!window.assignments.hasOwnProperty(key)) continue;
        writeAssignment(window.assignments[key]);
    }
})();