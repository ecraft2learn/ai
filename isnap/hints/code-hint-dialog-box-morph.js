require('hint-dialog-box-morph');
require('gui-extensions');

// HintDialogBoxMorph instance creation
function CodeHintDialogBoxMorph(target, simple) {
    this.init(target, simple);
}

// HintDialogBox inherits from DialogBoxMorph
CodeHintDialogBoxMorph.prototype = Object.create(HintDialogBoxMorph.prototype);
CodeHintDialogBoxMorph.prototype.constructor = CodeHintDialogBoxMorph;
CodeHintDialogBoxMorph.uber = HintDialogBoxMorph.prototype;

// Initialize Hint Dialogue Box
CodeHintDialogBoxMorph.prototype.init = function (target, simple) {
    var scripts,
        scriptsFrame;

    // additional properties:
    this.handle = null; //doesn't know if useful

    // initialize inherited properties: (call parent constructor)
    CodeHintDialogBoxMorph.uber.init.call(
        this,
        target,
        null,
        target
        );

    // override inherited properties
    this.key = 'hintDialog';
    this.labelString = 'Suggestion';
    this.createLabel();

    // create labels for scripts frame
    this.createLabels();

    // create scripting area
    scripts = new ScriptsMorph(target);
    scripts.isDraggable = false;
    scripts.color = IDE_Morph.prototype.groupColor;
    scripts.cachedTexture = IDE_Morph.prototype.scriptsPaneTexture;
    scripts.cleanUpMargin = 10; //No idea what this does?
    scripts.userMenu = function() { return null; };

    // create scripts frame for scripts
    scriptsFrame = new ScrollFrameMorph(scripts);
    scriptsFrame.padding = 10;
    scriptsFrame.growth = 50;
    scriptsFrame.isDraggable = false;
    scriptsFrame.acceptsDrops = false;
    scriptsFrame.contents.acceptsDrops = true;
    //don't allow scrolling by dragging
    scriptsFrame.mouseDownLeft = function () { };
     // don't allow scroll by mouse
    scriptsFrame.mouseScroll = function () { };
     //don't allow autoscroll
    scriptsFrame.startAutoScrolling = function () { };
    scripts.scrollFrame = scriptsFrame;
    scripts.acceptsDrops = false; //does not allow edit

    // add elements to dialogue box
    this.addBody(new AlignmentMorph('row', this.padding));

    // add 2 scriptFrames to this.body
    this.addScriptsFrame(scriptsFrame);
    this.addScriptsFrame(scriptsFrame.fullCopy());

    // add buttons to the dialogue
    this.initButtons(simple);

    if (!simple) {
        this.createThumbButtons();
    }

    // set layout
    this.fixLayout();
};

// interface for showing hint for a single block
CodeHintDialogBoxMorph.prototype.showBlockHint =
function (parentSelector, from, to, otherFromBlocks) {
    var block1, block2;

    //set HintDialogBox body alignment to vertical alignment
    this.body.orientation = 'col'; //set alignment to vertical
    // change padding to 2 times of original padding
    this.body.padding = 2 * this.padding;
    this.body.drawNew(); //re-draw alignmentMorph

    if (!parentSelector) {
        Trace.logErrorMessage('bad parentSelector in ' +
            'HintDialogBoxMorph.prototype.showBlockHint: 1');
        return;
    }
    if (!to) {
        Trace.logErrorMessage(
            'bad to in HintDialogBoxMorph.prototype.showBlockHint: 1');
        return;
    }

    // Create parent block with the two sets of parameters
    block1 = this.createBlockWithParams(parentSelector, from);
    block2 = this.createBlockWithParams(parentSelector, to);

    // blck1 is null means arg1 is incorrect
    if (block1 === null) {
        Trace.logErrorMessage('bad parentSelector and from in ' +
            'HintDialogBoxMorph.prototype.showBlockHint: 2');
        return;
    }

    // blck2 is null means arg3 is incorrect
    if (block2 === null) {
        Trace.logErrorMessage('bad parentSelector and to in ' +
            'HintDialogBoxMorph.prototype.showBlockHint: 2');
        return;
    }

    // Add blocks to the scriptsFrame
    this.addBlock(block1, 0);
    this.addBlock(block2, 1);
    otherFromBlocks.forEach(function(block) {
        this.addBlock(this.createBlock(block), 0);
    }, this);

    // refresh layout
    this.fixExtent(); // fix Extent to fit the hints
    this.fixLayout();
    // adjust v and h scroll bars to original position and hide them
    this.adjustScroll();

    this.popUp();
    return this;
};

CodeHintDialogBoxMorph.prototype.createBlockWithParams =
function(selector, params) {
    var block = this.createBlock(selector, null, params.length);
    var inputs = block.inputs();
    if (inputs.length == 1 && inputs[0] instanceof MultiArgMorph) {
        var multiArg = inputs[0];
        while (multiArg.inputs().length > params.length) {
            multiArg.removeInput();
        }
        while (multiArg.inputs().length < params.length) {
            multiArg.addInput();
        }
        inputs = multiArg.inputs();
    }
    this.clearParameter(block);
    for (var i = 0; i < params.length; i++) {
        var paramSelector = params[i];
        if (!paramSelector || paramSelector.startsWith('script')) continue;
        var value = this.parseValue(params[i]);
        paramSelector = this.parseType(paramSelector);
        var input = inputs[i];
        if (paramSelector === 'literal') {
            if (input.setContents && value) {
                input.setContents(value);
            }
        } else if (paramSelector === 'varMenu' &&
                input.choices != null && value !== null) {
            // If this is a drop-down menu input slot, and the replacement is
            // a variable, we create and select a menu item instead
            input.choices = [value];
            input.setContents(value);
        } else {
            // Otherwise just insert the child
            var param = this.createBlock(params[i], input);
            this.clearParameter(param);
            input.parent.silentReplaceInput(input, param);
        }
    }
    return block;
};


CodeHintDialogBoxMorph.prototype.fakeCustomBlock =
function (type, category, spec) {
    inputs = new Array((spec.match(/%/g) || []).length);
    var definition = {
        type: type,
        category: category,
        blockSpec: function() { return spec; },
        // HACK(rzhi): temporarily fix the localizedSpec not defined bug
        localizedSpec: function() {return spec;},
        variableNames: [],
        inputOptionsOfIdx: function() { return inputs; }
    };
    if (type === 'command') {
        return new CustomCommandBlockMorph(definition);
    } else if (type === 'reporter' || type === 'predicate')  {
        return new CustomReporterBlockMorph(definition, type === 'predicate');
    }
};

CodeHintDialogBoxMorph.prototype.fakeHatBlock = function () {
    var hat = new HatBlockMorph();
    hat.setCategory('control');
    hat.setSpec('Custom Block');
    return hat;
};

CodeHintDialogBoxMorph.prototype.parseValue = function(selector) {
    var colonIndex = selector.indexOf(':');
    if (colonIndex >= 0) {
        return selector.substring(colonIndex + 1);
    }
    return null;
};

CodeHintDialogBoxMorph.prototype.parseType = function(selector) {
    var colonIndex = selector.indexOf(':');
    if (colonIndex >= 0) {
        return selector.substring(0, colonIndex);
    }
    return selector;
};

CodeHintDialogBoxMorph.prototype.createBlock =
function(selector, parent, numArgs) {
    numArgs = numArgs || 0;
    var param;
    var value = this.parseValue(selector);
    selector = this.parseType(selector);
    if (selector === 'var' || selector === 'reportGetVar') {
        // Create variable (getter) blocks
        param = SpriteMorph.prototype.variableBlock(value || 'var');
        param.isDraggable = false;
    } else if (selector == 'prototypeHatBlock') {
        // Create custom block header blocks
        param = this.fakeHatBlock();
    } else if (selector === 'doCustomBlock' ||
               selector === 'evaluateCustomBlock') {
        // Create custom blocks
        type = 'command';
        if (parent) {
            type = parent instanceof BooleanSlotMorph ?
                'predicate' : 'reporter';
        }
        spec = value || 'Custom Block';
        if (numArgs) {
            spec += ':' ;
            for (var i = 0; i < numArgs; i++) spec += ' %s';
        }
        param = this.fakeCustomBlock(type, 'other', spec);
        param.isDraggable = false;
    } else {
        // Create everything else
        param = SpriteMorph.prototype.blockForSelector(selector, true);
        if (!param) {
            // Check for imported tools that match this selector
            var defs = ide.stage.globalBlocks.filter(function(def) {
                if (!def.isImported) return false;
                var spec = def.spec;
                // The spec may match exactly if we got the selector from an
                // existing block
                if (spec === selector) return true;
                // Else, we do some substitutions on the spec to turn it into a
                // selector, which are also performed on the server side
                spec = spec.replace(/%'([^']*)'/g, '_');
                spec = spec.replace(/\s/g, '');
                spec = spec.replace(/[^A-Za-z_]/g, '*');
                if (spec === selector) return true;
            });
            if (defs.length > 1) {
                Trace.logErrorMessage('Multiple matching tools for selector: ' +
                    selector);
            }
            if (defs.length > 0) {
                param = defs[0].blockInstance();
                param.isDraggable = false;
            }
        }
    }
    if (param == null) {
        Trace.logErrorMessage('Cannot initialize selector: ' + selector);
        return null;
    }

    // Make sure the block doesn't respond to menus and clicks
    param.disable();

    return param;
};

// interface for showing hint for a script(sequence of blocks)
CodeHintDialogBoxMorph.prototype.showScriptHint =
function (parentSelector, index, from, to) {
    //set HintDialogBox body alignment to horizontal alignment
    this.body.orientation = 'row'; //set alignment to horizontal
    this.body.drawNew(); //re-draw alignmentMorph

    // Create the from and to blocks and put them in the ScriptMorphs
    var fromBlock = this.createBlockFromList(from[0], parentSelector, index);
    if (fromBlock) {
        // Only the fromBlock can be null (for custom blocks with no body)
        this.addBlock(fromBlock, 0);
        this.clearParameter(fromBlock);
    }
    var toBlock = this.createBlockFromList(to, parentSelector, index);
    this.clearParameter(toBlock);
    this.addBlock(toBlock, 1);

    // Add any additional from blocks (which won't have the same parent)
    for (var i = 1; i < from.length; i++) {
        this.addBlock(this.createBlockFromList(from[i]), 0);
    }

    // refresh layout
    this.fixExtent(); // fix Extent to fit the hints
    this.fixLayout();
    // adjust v and h scroll bars to original position and hide them
    this.adjustScroll();

    this.popUp();
    return this;
};

CodeHintDialogBoxMorph.prototype.createBlockFromList =
function(list, parentSelector, index) {
    var block = this.readBlocks(list);
    if (parentSelector != null) {
        var parent = this.createBlock(parentSelector);
        var input = parent.inputs()[index];
        if (input instanceof CSlotMorph) {
            // If the input is a CSlotMorph, then it is a nested structure
            input.nestedBlock(block);
        } else {
            // Else, it is parameter input
            // eslint-disable-next-line no-console
            console.warn('DOES THIS EVER HAPPEN?');
            // eslint-disable-next-line no-console
            console.log(parent, index, input);
            input.parent.silentReplaceInput(input, block);
        }
        return parent;
    }
    return block;
};

// add scriptsFrame to AlignmentMorph in body
CodeHintDialogBoxMorph.prototype.addScriptsFrame = function (scriptsFrame) {
    if (this.body) {
        this.body.add(scriptsFrame);
    }
};

// add block to a scriptsFrame specified by num
CodeHintDialogBoxMorph.prototype.addBlock = function(blck, num) {
    // check if blck exists
    if (blck === null) {
        Trace.logErrorMessage(
            'blck is null in HintDialogBoxMorph.prototype.addBlock: 1');
        return;
    }
    // check if specified scriptsFrame exists
    if (typeof this.body.children[num] === 'undefined') {
        Trace.logErrorMessage(
            'bad num in HintDialogBoxMorph.prototype.addBlock: 1');
        return;
    }

    this.body.children[num].contents.add(blck);
    this.body.children[num].contents.cleanUp(true);
    this.body.children[num].contents.changed();
};

// customized fixExtend function
// first resize two scriptFrame to fit the hint blocks
// then resize this.extent to fit the scriptFrames and buttons
CodeHintDialogBoxMorph.prototype.fixExtent = function() {
    var th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        w = 0,
        h = 0;

    this.buttons.fixLayout();

    // calculate the size of scriptsFrame
    this.body.children.forEach(function(child) {
        if (!child.contents) return;
        var fullBounds = child.contents.children.reduce(function(a, b) {
            return a ? a.merge(b.fullBounds()) : b.fullBounds();
        }, null) || new Rectangle();
        w = Math.max(w, fullBounds.width());
        h = Math.max(h, fullBounds.height());
    });

    w = w + 2 * this.padding; // final width of a single scriptFrame
    h = h + 2 * this.padding; // final height of a single scriptFrame

    this.body.children.forEach(function(child) {
        child.setExtent(new Point(w, h));
    });

    var thumbSize = this.thumbContainer ?
            new Point(this.thumbContainer.width(),
                    this.thumbContainer.height() + this.padding) :
            new Point(0, 0);

    // decide the extent of HintDialogBox based on body orientation
    if (this.body.orientation === 'row') {
        this.buttons.fixLayout();

        w = Math.max(2 * w + this.padding,
                    thumbSize.x,
                    this.buttons.width(),
                    this.label.width(),
                    this.labels[0].width() + this.labels[1].width() +
                        5 * this.padding
        );

        this.setExtent(new Point(w + 2 * this.padding,
            th + this.buttons.height() + h + 3 * this.padding +
            this.labels[0].height() + thumbSize.y));
    } else {
        this.buttons.fixLayout(); //fix button layout before calculating width

        w = Math.max(w,
                    this.label.width(),
                    this.buttons.width(),
                    thumbSize.x
        );

        this.setExtent(new Point(w + 2 * this.padding,
            th + this.buttons.height() + 2 * h + 4 * this.padding +
            2 * this.labels[0].height() + thumbSize.y));
    }
};


// adjust v and h scroll bars to original position and hide them
CodeHintDialogBoxMorph.prototype.adjustScroll = function() {
    this.body.children.forEach(function(child) {
        if (!child.contents) return;
        child.scrollX(child.contents.width());
        child.scrollY(child.contents.height());
        child.hBar.destroy(); // hide horizontal scroll bar
        child.vBar.destroy(); // hide vertical scroll bar
    });
};


// read a sequence of block morph, concat them and return the one on top
// pure sequence block without parameter
CodeHintDialogBoxMorph.prototype.readBlocks = function (list) {
    var blck = null; //store the first hint block, init with null

    // used for testing
    // list = ['forward','turn','turnLeft'];

    //read blocks and add to scripts
    if (list !== null) {
        for (var i = list.length - 1; i >= 0; i -= 1) {
            if (blck === null) {
                blck = this.createBlock(list[i]);
                this.clearParameter(blck);
            } else {
                var secondBlock = blck;
                blck = this.createBlock(list[i]);
                this.clearParameter(blck);
                blck.nextBlock(secondBlock);
            }
        }

        return blck;
    }
};

// clear specific/all parameter input in a blck
// num is optional
CodeHintDialogBoxMorph.prototype.clearParameter = function (blck, num) {
    var inputs = blck.inputs();
    if (inputs.length == 1 && inputs[0] instanceof MultiArgMorph) {
        inputs = inputs[0].inputs();
    }

    // if num is left empty, or input other than number, clear all parameters
    if (num === null || typeof num === 'undefined' || typeof num === 'string' ||
            typeof num === 'boolean') {
        inputs.forEach(function (input) {
            if (input instanceof InputSlotMorph) {
                input.setContents(null);
                // disable editing of input slots
                if (input.children[0] instanceof StringMorph) {
                    input.children[0].isEditable = false;
                }
                // disable this function to avoid error
                input.getVarNamesDict = function() {};
            }
        });
    // else clear the slot at specific position
    } else {
        // check if the InputSlot specified by num actually exists/defined
        if (inputs[num] instanceof InputSlotMorph) {
            inputs[num].setContents(null);
        }
    }
};

// create labels for scripts frame
CodeHintDialogBoxMorph.prototype.createLabels = function() {
    var myself = this;
    if (this.labels) {
        this.labels.destroy();
    }
    // create a alignmentMorph to
    this.labels = [new StringMorph(
            localize('Your Code'),
            this.titleFontSize,
            this.fontStyle,
            true,
            false,
            false,
            null,
            this.titleBarColor.darker(this.contrast)
        ),
        new StringMorph(
            localize('Suggested Code'),
            this.titleFontSize,
            this.fontStyle,
            true,
            false,
            false,
            null,
            this.titleBarColor.darker(this.contrast)
        )];

    this.labels.forEach(function(label) {
        label.color = new Color(0, 0, 0);
        label.drawNew();
        myself.add(label);
    });
};

// define HintDialogBoxMorph layout
CodeHintDialogBoxMorph.prototype.fixLayout = function() {
    var th = fontHeight(this.titleFontSize) + this.titlePadding * 2;

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.fixLayout();
    }

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            th + this.padding
        )));
        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
           this.height() - this.padding * 3 - th - this.buttons.height()
        ));
        this.body.setCenter(this.center());
        this.body.setTop(this.top() + this.padding + th +
            this.labels[0].height());

    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(this.top() + (th - this.label.height()) / 2);
    }

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    if (this.labels) {
        this.labels[0].setTop(this.body.children[0].top() -
            this.labels[0].height() - 4);
        this.labels[0].setLeft(this.body.children[0].left());
        this.labels[1].setTop(this.body.children[1].top() -
            this.labels[0].height() - 4);
        this.labels[1].setLeft(this.body.children[1].left());
    }

    if (this.thumbContainer) {
        this.thumbContainer.setCenter(this.center());
        this.thumbContainer.setBottom(this.bottom() -
            2 * this.padding - this.buttons.height());
    }
};
