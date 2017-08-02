var get_ide = function () {
    var ancestor = this;
    var value;
    while (ancestor && !(ancestor instanceof IDE_Morph)) {
        ancestor = ancestor.parent;
    }
    if (ancestor) {
        return ancestor;
    } else {
        return world.children[0];
    }
}.bind(this);
var ide = get_ide();
var current_project_name = ide.projectName;
var callback = function () {
    // restore original project name
    ide.projectName = current_project_name;
    ide.controlBar.updateLabel();
};
if (typeof window.auto_save_counter === 'undefined') {
    window.auto_save_counter = 1;
} else {
    window.auto_save_counter = window.auto_save_counter +1;
}
var auto_save_file_name = file_name + " " + window.auto_save_counter;
if (in_cloud) {
        ide.setProjectName(auto_save_file_name );
        SnapCloud.saveProject(ide,  callback,  ide.cloudError());
} else {
    ide.rawSaveProject(auto_save_file_name);
    callback();
}
ide.showMessage(" ", .001); // remove save message as soon as possible