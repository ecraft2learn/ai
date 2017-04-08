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

get_ide().openProject(name);
// get_ide().saveProject(name);
