
// HintDisplay: outputs hitns to the console

require('code-hint-dialog-box-morph');

function HintDisplay() { }

HintDisplay.prototype.initDisplay = function() {

};

HintDisplay.prototype.show = function() {

};

HintDisplay.prototype.hide = function() {

};

HintDisplay.prototype.willIgnoreHint = function(hint) {
    return false;
};

HintDisplay.prototype.showHint = function(hint) {
    // eslint-disable-next-line no-console
    console.log(hint.from + ' -> ' + hint.to);
};

HintDisplay.prototype.showDebugInfo = function(info) {

};

HintDisplay.prototype.showError = function(error, isNetwork) {
    // eslint-disable-next-line no-console
    console.error(error);
};

HintDisplay.prototype.clear = function() {
    // eslint-disable-next-line no-console
    console.log('-----------------------------------------');
};

HintDisplay.prototype.finishedHints = function() {

};

HintDisplay.prototype.getHintType = function() {
    return '';
};

HintDisplay.prototype.hintDialogShown = function() {

};

HintDisplay.prototype.hasCustomBlock = function(ref) {
    if (!ref) return false;
    return ref.label == 'customBlock' || this.hasCustomBlock(ref.parent);
};

// Gets the showing/editing version of a customBlock, or returns null if
// it is not currently being edited, since we can only generate hints for a
// showing/editing custom block
HintDisplay.prototype.editingCustomBlock = function(storedBlocks, index) {
    var storedBlock = storedBlocks.filter(function(block) {
        return !block.isImported;
    })[index];
    if (!storedBlock) return null;

    // Find the showing BlockEditorMorph with a matching guid
    var matchingBlocks = BlockEditorMorph.showing.filter(function(editor) {
        return editor.definition && editor.definition.guid == storedBlock.guid;
    });
    if (matchingBlocks.length === 0) return storedBlock;

    // There should be at most one, so if we find it, return it's ScriptsMorph
    return matchingBlocks[0].allChildren().filter(function (child) {
        return child instanceof ScriptsMorph;
    })[0];
};

HintDisplay.prototype.refHasAncestor = function(ref, type) {
    return ref && (ref.label === type || this.refHasAncestor(ref.parent, type));
};

HintDisplay.prototype.getCode = function(ref) {
    if (ref.parent == null) {
        return window.ide;
    }

    var parent = this.getCode(ref.parent);
    // If this is a non-showing custom block, we should just return it to show
    // a special hint
    if (parent == null || parent instanceof CustomBlockDefinition) {
        return parent;
    }

    var label = ref.label;
    var index = ref.index;

    var nVars, nScripts;

    // ScriptsMorphs can have non-BlockMorphs, e.g. CommentMorphs, so we need
    // to filter them out
    var parentScripts = null;
    var filterBlocks = function(block) {
        return block instanceof BlockMorph;
    };
    if (parent.scripts) {
        parentScripts = parent.scripts.children.filter(filterBlocks);
    }

    switch (ref.parent.label) {
    case 'snapshot':
        if (label == 'stage')
            return parent.stage;
        else if (label == 'customBlock')
            return this.editingCustomBlock(parent.stage.globalBlocks,
                index - 1);
        else if (label == 'varDec')
            return parent.globalVariables.vars;
        break;
    case 'stage':
        nVars = Object.keys(parent.variables.vars).length;
        nScripts = parentScripts.length;
        var nCustomBlocks = parent.customBlocks.length;
        if (label == 'sprite') {
            return parent.children.filter(function(child) {
                return child instanceof SpriteMorph;
            })[index - nVars - nScripts - nCustomBlocks];
        }
    case 'sprite':
        nVars = Object.keys(parent.variables.vars).length;
        nScripts = parentScripts.length;
        if (label == 'varDec')
            return parent.variables.vars;
        else if (label == 'script')
            return parentScripts[index - nVars];
        else if (label == 'customBlock')
            return this.editingCustomBlock(parent.customBlocks,
                index - nVars - nScripts);
        break;
    case 'script':
        var block = parent;
        if (block instanceof CSlotMorph) block = block.children[0];
        if (ref.parent.parent && ref.parent.parent.label == 'customBlock') {
            // Scripts in a custom block must skip one extra because the
            // first block is the header CustomHatBlock.
            block = block.nextBlock();
        }
        for (var i = 0; i < index; i++) block = block.nextBlock();
        return block;
    case 'customBlock':
        // We should only generate hints for the primary script in a custom
        // block
        if (ref.index > 0 || label != 'script' || !parent.children.length) {
            return null;
        }
        // If we manage to get a hold of it, we return the first script
        return parent.children.filter(filterBlocks)[0];
    default:
        return parent.inputs()[index];
    }
};

HintDisplay.prototype.redrawBlock = function(block) {
    if (!block) return;
    if (block.getShadow) {
        if (block.getShadow()) {
            block.removeShadow();
            block.addShadow();
        }
    }
    if (block.cachedFullBounds) {
        block.cachedFullBounds = block.fullBounds();
    }
    if (block.cachedFullImage) {
        block.cachedFullImage = null;
        block.cachedFullImage = block.fullImageClassic();
    }
};

// For a script (top block or CSlot), finds the enclosing block, or null
HintDisplay.prototype.getEnclosingParentBlock = function(block) {
    block = block.parent;
    if (block && block.enclosingBlock) return block.enclosingBlock();
    else return null;
};

// For a script, finds the index of the script in the enclosing block
HintDisplay.prototype.getScriptIndex = function(script, enclosingBlock) {
    var index = -1;
    if (enclosingBlock && enclosingBlock != script && enclosingBlock.inputs) {
        index = enclosingBlock.inputs().indexOf(script);
        if (index == -1) {
            Trace.logErrorMessage('Bad hint index!');
            index = 0;
        }
    }
    return index;
};

HintDisplay.prototype.parentSelector = function(enclosingBlock) {
    if (!enclosingBlock) return null;
    if (enclosingBlock.definition && enclosingBlock.definition.isImported) {
        // Use the spec as a proxy for the selector of an imported block
        return enclosingBlock.definition.spec;
    }
    return enclosingBlock.selector;
};

/**
 * Creates a function for logging and showing a script hint.
 *
 * @this HintDisplay
 * @param {boolean} simple Whether or not the CodeHintDialogBoxMorph should
 * display simple UI, or display the full rating UI.
 * @param {SyntaxElementMorph} root The node whose children are being edited
 * @param {BlockMorph} extraRoot Another block or script which is also being
 * displayed as part of the hint.
 * @param {string[][]} fromList An array of string arrays, each of which are
 * displayed as scripts on the from side of the script hint. The first is
 * the script to be edited, and an additional array is optional.
 * @param {string[]} to An array of selectors which are displayed as a script
 * on the to side of the script hint.
 * @param {function} onThumbsDown Optional callback to be called if the hint is
 * rated with a thumbs down.
 */
HintDisplay.prototype.createScriptHintCallback = function(simple, root,
        extraRoot, fromList, to, onThumbsDown) {

    // For logging, we find the parent block this script is inside of, or null
    var enclosingBlock = this.getEnclosingParentBlock(root);

    // If applicable, find the index of this script in it's parent (e.g. IfElse)
    var index = this.getScriptIndex(root, enclosingBlock);

    var rootID = root ? root.id : null;
    var extraRootID = extraRoot ? extraRoot.id : null;
    var parentSelector = this.parentSelector(enclosingBlock);
    var parentID = enclosingBlock ? enclosingBlock.id : null;

    if (root instanceof PrototypeHatBlockMorph) {
        fromList[0].unshift('prototypeHatBlock');
        to.unshift('prototypeHatBlock');

        // We can't use the PrototypeHatBlockMorph's id, since it is not logged
        // so we use the GUID of the custom block and set index to 0 to indicate
        // it's first (and only) script
        var blockEditor = root.parentThatIsA(BlockEditorMorph);
        if (blockEditor && blockEditor.definition) {
            parentID = blockEditor.definition.guid;
            index = 0;
        }
    }

    var data = {
        // For unnested scripts, the ID of the first block in the edited script
        'rootID': rootID,
        // The ID of the block or script also being shown with this hint.
        // In the case of LinkHints, this is the block on which the hint was
        // displayed.
        'extraRootID': extraRootID,
        // For nested scripts, the selector of the parent holding the script
        'parentSelector': parentSelector,
        // For nested scripts, the ID of the parent block holding the script
        'parentID': parentID,
        // For nested scripts, the index of the root script inside the parent
        'index': index,
        // An array containing first an array of selectors for the from side
        // and second an array of selectors from the extraRoot, if any
        'fromList': fromList,
        // An array containing the selectors on the to side of the hint
        'to': to,
    };

    var myself = this;
    return function() {
        Trace.log('SnapDisplay.showScriptHint', data);
        new CodeHintDialogBoxMorph(window.ide, simple)
            .showScriptHint(parentSelector, index, fromList, to)
            .onThumbsDown(onThumbsDown);
        myself.hintDialogShown();
    };
};

/**
 * Creates a function for logging and showing a block hint.
 *
 * @this HintDisplay
 * @param {boolean} simple Whether or not the CodeHintDialogBoxMorph should
 * display simple UI, or display the full rating UI.
 * @param {SyntaxElementMorph} root The node whose children are being edited
 * @param {BlockMorph} extraRoot Another block or script which is also being
 * displayed as part of the hint.
 * @param {string[]} from An array of selectors which are displayed as arguments
 * on the from side of the block hint.
 * @param {string[]} to An array of selectors which are displayed as arguments
 * on the to side of the script hint.
 * @param {string[]} otherBlocks An array of selectors which are also displayed
 * as a script on the from side of the script.
 * @param {function} onThumbsDown Optional callback to be called if the hint is
 * rated with a thumbs down.
 */
HintDisplay.prototype.createBlockHintCallback = function(simple, root,
        extraRoot, from, to, otherBlocks, onThumbsDown) {

    var enclosingBlock = root.enclosingBlock();
    var selector = this.parentSelector(enclosingBlock);
    var parentID = enclosingBlock ? enclosingBlock.id : null;
    var extraRootID = extraRoot ? extraRoot.id : null;
    var data = {
        // The selector of the block whose arguments are being edited
        'parentSelector': selector,
        // The ID of the block whose arguments are being edited
        'parentID': parentID,
        // The ID of any additional script being displayed on the from side.
        // In the case of LinkHints, this is the block on which the hint was
        // displayed.
        'extraRootID': extraRootID,
        // An array of selectors being shown as arguments on the from side
        'from': from,
        // An array of selectors being shown as arguments on the to side
        'to': to,
        // An array of selectors from the extraRoot, if any, shown on the from
        // side as a script
        'otherBlocks': otherBlocks,
    };

    var myself = this;
    return function() {
        Trace.log('SnapDisplay.showBlockHint', data);
        new CodeHintDialogBoxMorph(window.ide, simple)
            .showBlockHint(selector, from, to, otherBlocks)
            .onThumbsDown(onThumbsDown);
        myself.hintDialogShown();
    };
};

HintDisplay.prototype.createStructureHintCallback = function(simple, root,
        message, from, to, onThumbsDown) {

    var rootType = null;
    var rootID = null;
    if (root instanceof SpriteMorph) {
        rootType = 'sprite';
        rootID = root.name;
    } else if (root instanceof IDE_Morph) {
        rootType = 'snapshot';
    } else if (root instanceof StageMorph) {
        rootType = 'stage';
    } else if (root instanceof ScriptsMorph) {
        // ScriptsMorphs should only be the root for custom block hints
        rootType = 'customBlock';
        if (root.children[0] && root.children[0].definition) {
            rootID = root.children[0].definition.guid;
        }
    } else {
        // eslint-disable-next-line no-console
        console.warn('Unknown root type', root);
    }

    var data = {
        'rootType': rootType,
        'rootID': rootID,
        'message': message,
        'from': from,
        'to': to
    };

    return function() {
        Trace.log('SnapDisplay.showStructureHint', data);
        var dialog = new MessageHintDialogBoxMorph(window.ide, simple, message,
            'Suggestion');
        dialog.onThumbsDown(onThumbsDown);
        dialog.popUp();
    };
};

// Static method - shows a logged hints retrieved from the database
HintDisplay.showLoggedHint = function(data) {

    if (!data) {
        // If we have no hint data, clear any showing hints
        if (HintDialogBoxMorph.showing) {
            HintDialogBoxMorph.showing.destroy();
        }
        return;
    }

    var type = data.type;
    var fromList;
    if (type === 'StructureHint') {
        new MessageHintDialogBoxMorph(window.ide, true, data.message,
            'Suggestion').popUp();
    } else if (type === 'ScriptHint') {
        fromList = data.fromList || [data.from];
        var parent = null;
        if (data.parentSelector) {
            parent = data.parentSelector;
        } else if (data.parentID) {
            parent = ide.allChildren().filter(function(x) {
                return x instanceof BlockMorph && x.id === data.parentID;
            })[0] || null;
            if (parent != null) {
                parent = parent.selector;
            }
        }
        new CodeHintDialogBoxMorph(window.ide)
            .showScriptHint(parent, data.index, fromList, data.to);
    } else if (type === 'BlockHint') {
        fromList = data.fromList || [data.from, []];
        new CodeHintDialogBoxMorph(window.ide)
            .showBlockHint(data.parentSelector, fromList[0], data.to,
                fromList[1]);
    } else {
        Trace.logErrorMessage('Unknown logged hint type: ' + type);
    }
};

HintDisplay.prototype.addHintButton = function(text, onClick) {
    var hintButton = new PushButtonMorph(ide, onClick, text);
    hintButton.fontSize = DialogBoxMorph.prototype.buttonFontSize;
    hintButton.corner = DialogBoxMorph.prototype.buttonCorner;
    hintButton.edge = DialogBoxMorph.prototype.buttonEdge;
    hintButton.outline = DialogBoxMorph.prototype.buttonOutline;
    hintButton.outlineColor = ide.spriteBar.color;
    hintButton.outlineGradient = false;
    hintButton.padding = DialogBoxMorph.prototype.buttonPadding;
    hintButton.contrast = DialogBoxMorph.prototype.buttonContrast;
    hintButton.drawNew();
    hintButton.fixLayout();

    extendObject(window.ide, 'toggleAppMode', function(base, appMode) {
        base.call(this, appMode);
        if (hintButton.parent == null) return;
        if (this.isAppMode) hintButton.hide();
        else hintButton.show();
    });

    window.ide.controlBar.add(hintButton);
    window.ide.controlBar.hintButton = hintButton;
    window.ide.fixLayout();

    return hintButton;
};

extendObject(window, 'onWorldLoaded', function(base) {
    base.call(this);
    extendObject(ide, 'fixLayout', function(base, situation) {
        base.call(this, situation);
        var hintButton = this.controlBar.hintButton;
        if (hintButton) {
            hintButton.setPosition(new Point(
                this.stage.left() - hintButton.width() / 2 - 60,
                hintButton.top()));
        }
    });
});