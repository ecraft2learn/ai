require('hint-display');
require('hint-highlight-morph');
require('code-hint-dialog-box-morph');
require('message-hint-dialog-box-morph');
require('highlight-dialog-box-morph');

function HighlightDisplay(hintWarning) {
    this.hintWarning = hintWarning;
}

HighlightDisplay.prototype = Object.create(HintDisplay.prototype);
HighlightDisplay.constructor = HighlightDisplay;
HighlightDisplay.uber = HintDisplay.prototype;

HighlightDisplay.insertColor = new Color(0, 0, 255);
HighlightDisplay.deleteColor = new Color(255, 0, 255);
HighlightDisplay.moveColor = new Color(255, 255, 0);

HighlightDisplay.TOP_LEFT = 'top-left';
HighlightDisplay.BOTTOM_LEFT = 'bottom-left';
HighlightDisplay.ABOVE = 'above';
HighlightDisplay.LEFT = 'left';
HighlightDisplay.RIGHT = 'right';

HighlightDisplay.prototype.initDisplay = function() {
    // Start disabled until the highlight dialog box is shown
    this.enabled = false;
    // Show insert hints (next steps)
    this.showInserts = false;
    // Show a dialog, even if no hints were shown
    this.forceShowDialog = false;
    // Auto-clear the highlights after each edit
    this.autoClear = false;

    this.highlights = [];
    this.insertButtons = [];
    this.hoverHints = [];
    this.hiddenCustomBlockHintRoots = [];
    this.hoverInsertIndicatorBlocks = [];
    this.hiddenInsertHints = 0;
    this.addCustomBlock = false;
    this.hintsSinceStarted = 0;

    BlockEditorMorph.defaultHatBlockMargin = new Point(35, 20);

    var myself = this;
    extendObject(Trace, 'onCodeChanged', function(base, code) {
        // Don't show hints after next clear (but don't clear them now)
        if (myself.autoClear && myself.enabled) {
            Trace.log('HighlightDisplay.autoClear');
            myself.enabled = false;
        }
        base.call(this, code);
    });
};

HighlightDisplay.isSnapPresenting = function() {
    var hash = window.location.hash;
    return hash.includes('#present');
};

HighlightDisplay.prototype.show = function() {
    var myself = this;
    this.enabled = false;
    this.hintButton = this.addHintButton(localize('Check My Work'), function() {
        Trace.log('HighlightDisplay.checkMyWork');
        myself.forceShowDialog = true;
        HighlightDisplay.startHighlight();
    });
    var assignment = Assignment.get();
    if (assignment.promptHints && !window.hintProvider.reloadCode &&
            !HighlightDisplay.isSnapPresenting()) {
        Trace.log('HighlightDisplay.promptHints');
        var message = localize('Remember, if you get stuck, you can use ' +
            'the "Check My Work" button in\nthe top-right corner to get ' +
            'feedback and suggestions on what to do next.');
        new DialogBoxMorph().inform(localize('Help Available'), message,
            ide.world());
    }
};

HighlightDisplay.prototype.hide = function() {
    this.hintButton.destroy();
    if (HighlightDialogBoxMorph.showing) {
        HighlightDialogBoxMorph.showing.destroy();
    }
    if (HintDialogBoxMorph.showing) {
        HintDialogBoxMorph.showing.destroy();
    }
};

HighlightDisplay.startHighlight = function() {
    Trace.log('HighlightDisplay.startHighlight');
    var showing = HighlightDialogBoxMorph.showing;
    if (showing && !showing.destroyed) {
        showing.recenter();
    }
    window.hintProvider.setDisplayEnabled(HighlightDisplay, true);
};

HighlightDisplay.stopHighlight = function(clear) {
    Trace.log('HighlightDisplay.stopHighlight');
    window.hintProvider.setDisplayEnabled(HighlightDisplay, false);
};

HighlightDisplay.prototype.finishedHints = function() {
    var dialogShowing = HighlightDialogBoxMorph.showing &&
            !HighlightDialogBoxMorph.showing.destroyed;
    var hintsShown = this.highlights.length + this.insertButtons.length +
            this.hoverHints.length;

    // If the dialog isn't showing...
    if (!dialogShowing) {
        if (hintsShown) {
            // Show it if and we've shown hints
            new HighlightDialogBoxMorph(window.ide, this.showInserts,
                this.autoClear).popUp();
        } else {
            // Or disable highlights if not
            this.enabled = false;
            // If no hints were shown, but the user clicked the hint button...
            if (this.forceShowDialog) {
                if (this.hiddenInsertHints !== 0) {
                    // Show a dialog to confirm they want next-step hints
                    this.promptShowInserts();
                } else if (this.hiddenCustomBlockHintRoots.length !== 0) {
                    this.promptShowBlockHints();
                } else {
                    // Or tell them no hints are available
                    this.informNoHints();
                }
            }
        }
    }
    this.forceShowDialog = false;

    if (this.hintWarning && this.hintsSinceStarted >= this.hintWarning) {
        this.showHintWarning();
    }
};

HighlightDisplay.prototype.promptShowInserts = function() {
    Trace.log('HighlightDisplay.promptShowInserts');
    var myself = this;
    new DialogBoxMorph(this, function() {
        // If they say yes, show inserts and reshow this
        myself.showInserts = true;
        myself.forceShowDialog = true;
        window.hintProvider.setDisplayEnabled(HighlightDisplay, true);
        Trace.log('HighlightDisplay.showInsertsFromPrompt');
    }).askYesNo(
        localize('Check Passed'),
        localize (
            'Everything looks good so far. Would you like me to ' +
            'suggest some next steps?'
        ),
        window.world
    );
};

HighlightDisplay.prototype.promptShowBlockHints = function() {
    Trace.log('HighlightDisplay.promptShowBlockHints');
    var def = this.hiddenCustomBlockHintRoots[0];
    var name = def.spec.replace(/%'([^']*)'/g, '[$1]');
    var myself = this;
    new DialogBoxMorph(this, function() {
        Trace.log('HighlightDisplay.showCustomBlockFromPrompt', {
            'spec': def.spec,
            'guid': def.guid,
        });
        Morph.prototype.trackChanges = false;
        // Should this be the owning Sprite instead? Hard case to test...
        editor = new BlockEditorMorph(def, window.ide.currentSprite);
        editor.popUp();
        Morph.prototype.trackChanges = true;
        editor.changed();
        myself.forceShowDialog = true;
        window.hintProvider.setDisplayEnabled(HighlightDisplay, true);
    }).askYesNo(
        localize('Suggestions for Block'),
        localize ('I have some suggestions for the block ') +
            '"' + name + '".\n' +
            localize('Would you like to open it?'),
        window.world
    );
};

HighlightDisplay.prototype.informNoHints = function() {
    Trace.log('HighlightDisplay.informNoHints');
    new DialogBoxMorph(this).inform(
        localize('Check Passed'),
        localize('Everything on the screen looks good so far, but remember ' +
            "it's\nup to you to make sure everything works before you finish."),
        window.world
    );
};

HighlightDisplay.prototype.showHintWarning = function() {
    this.hintsSinceStarted = 0;
    Trace.log('HighlightDisplay.showHintWarning');
    new DialogBoxMorph(this, function() {
        Trace.log('HighlightDisplay.hideHintsFromWarning');
        HighlightDisplay.stopHighlight();
    }).askYesNo(
        localize("How's it Going?"),
        localize ('Are you feeling stuck?\n') +
            'If so, you may want to ask someone for help.\n' +
            'If not, try working on your own for a bit.\n\n' +
            localize('Should I stop checking your work?'),
        window.world
    );
};

HighlightDisplay.prototype.willIgnoreHint = function(hint) {
    // If there's no primary hint and no candidate, we ignore the hint entirely
    return this.ignorePrimaryHint(hint.data) && !this.getCandidate(hint);
};

HighlightDisplay.prototype.showHint = function(hint) {
    if (!hint.data) return;

    var action = hint.data.action;

    // Show insert candidates before any special handling, since they can't
    // be ignored and they don't count for hidden custom block hints
    if (action === 'insert') {
        this.showInsertCandidate(hint.data);
    }

    // We ignore some hints and keep this logic together
    if (this.ignorePrimaryHint(hint.data)) return;

    var parent = this.getCode(hint.data.parent);
    if (parent instanceof CustomBlockDefinition) {
        // For hints that are in hidden custom blocks, we store the
        // parents, but don't show it immediately
        this.hiddenCustomBlockHintRoots.push(parent);
        // Stop here, since the hint can't be shown
        return;
    }

    // Then show the hint
    switch (action) {
    case 'delete' : this.showDeleteHint(hint.data); break;
    case 'reorder': this.showReorderHint(hint.data); break;
    case 'insert': this.showInsertHint(hint.data); break;
    }
};

HighlightDisplay.prototype.showError = function(error, isNetwork) {
    if (this.forceShowDialog) {
        new DialogBoxMorph(this).inform(
            localize('Error'),
            localize("We've run into an error checking your work. " +
                'Please let you TA know.'),
            window.world
        );
        this.forceShowDialog = false;
        HighlightDisplay.stopHighlight();
    }
    if (isNetwork) {
        // If this is a network problem, disable the hint provider until an
        // explicit request is made again, and stop checking on run
        HighlightDisplay.stopHighlight();
        HighlightDialogBoxMorph.showOnRun = false;
        HighlightDialogBoxMorph.firstShowOnRun = false;
    }
};

HighlightDisplay.prototype.getHintType = function() {
    return 'highlight';
};

HighlightDisplay.prototype.hintDialogShown = function() {
    this.hintsSinceStarted++;
};

HighlightDisplay.prototype.clear = function() {
    if (!this.enabled) {
        this.hintsSinceStarted = 0;
    }

    var dialogShowing = HighlightDialogBoxMorph.showing &&
            !HighlightDialogBoxMorph.showing.destroyed;
    if (!this.enabled && dialogShowing) {
        HighlightDialogBoxMorph.showing.destroy();
    }

    var toRedraw = [];
    function redraw(block) {
        var parentBlock = block.parentThatIsA(BlockMorph);
        if (block.topBlock) {
            block = block.topBlock();
        } else if (parentBlock && parentBlock.topBlock) {
            block = parentBlock.topBlock();
        }
        if (!toRedraw.includes(block)) toRedraw.push(block);
    }
    this.highlights.forEach(function(block) {
        block.removeHintHighlight();
        redraw(block);
    });
    this.highlights = [];

    this.insertButtons.forEach(function(button) {
        button.destroy();
        redraw(button.parent);
    });
    this.insertButtons = [];

    toRedraw.forEach(function(block) {
        this.redrawBlock(block);
    }, this);

    this.hoverHints.forEach(function(argMorph) {
        if (argMorph.contents) {
            var contents = argMorph.contents();
            if (contents instanceof StringMorph) {
                contents.isEditable = !argMorph.isReadOnly;
            }
        }
        argMorph.onClick = null;
    });
    this.hoverHints = [];

    this.hoverInsertIndicatorBlocks.forEach(function(block) {
        delete block.feedbackBlock;
        delete block.feedbackInput;
        delete block.feedbackShowing;
    });
    window.ide.allChildren().forEach(function(child) {
        if (child instanceof ScriptsMorph) {
            delete child.hoverBlocks;
        }
    });
    this.hoverInsertIndicatorBlocks = [];

    this.hiddenCustomBlockHintRoots = [];
    this.hiddenInsertHints = 0;
    this.addCustomBlock = false;
};

HighlightDisplay.prototype.addHighlight = function(block, color, single) {
    if (color == HighlightDisplay.insertColor && !this.showInserts) return;
    // It's possible a candidate will be inside a hidden custom block, so just
    // suppress the highlight
    if (block instanceof CustomBlockDefinition) return;
    if (block instanceof MultiArgMorph) {
        block = block.parent;
    }
    if (!(block instanceof SyntaxElementMorph)) {
        Trace.logErrorMessage('Non-highlightable: ' +
            (block ? block.getDebugType() : null));
        return;
    }
    // First come, first highlight
    // TODO: Instead, have highlight priorities, since inserts may add delete
    if (block.getHintHighlight()) {
        // console.log(block, block.getHintHighlight());
        return;
        // block.removeHintHighlight();
    }
    if (single) {
        block.addSingleHintHighlight(color);
    } else {
        block.addHintHighlight(color);
    }
    this.highlights.push(block);
};

HighlightDisplay.prototype.showInsertCustomBlockDef = function(data) {
    // Only show this hint once
    if (this.addCustomBlock) return;
    if (!this.showInserts) {
        this.hiddenInsertHints++;
        return;
    }
    this.addCustomBlock = true;

    // Get the 'Variables' category button
    var button = window.ide.categories.children[7];
    if (!button) {
        Trace.logErrorMessage('Missing variables button');
        return;
    }

    var message = localize(
        'You probably need to make a new block. Do that ' +
        'by clicking\nthe "Variables" category and then click "Make a ' +
        'block."'
    );
    var callback = this.createStructureHintCallback(true, window.ide, message,
        data.from, data.to);

    // If the variables tab isn't selected, show the button there
    if (!button.state) {
        this.addInsertButton(button, HighlightDisplay.LEFT, callback, 7);
        return;
    }

    if (!ide.palette || !ide.palette.children[0]) return;
    var buttons = ide.palette.children[0].children.filter(function(child) {
        return child instanceof PushButtonMorph;
    });
    var createCustomBlock = buttons[buttons.length - 1];
    this.addInsertButton(createCustomBlock, HighlightDisplay.RIGHT, callback);
};

extend(IDE_Morph, 'changeCategory', function(base, category) {
    var changed = (category !== this.currentCategory);
    base.call(this, category);
    if (!changed || !window.hintProvider) return;

    // When the palette changes, if there's a addCustomBlock button, refresh
    // the hints to redraw it (probably a bit overkill, but it's clean)
    if (window.hintProvider.displays.some(function(display) {
        return display instanceof HighlightDisplay && display.addCustomBlock;
    })) {
        window.hintProvider.getHintsFromServer();
    }
});

HighlightDisplay.prototype.ignorePrimaryHint = function(data) {
    // Hints without a parent are only for candidate highlighting, and the
    // primary hint cannot be shown
    if (data.missingParent) return true;

    if (data.action === 'delete' || data.action === 'reorder') {
        // Only delete/reorder-highlight things that have a script ancestor
        if (!this.hasScriptAncestor(data.node)) return true;

        // Don't delete/reorder literals or variable declarations
        var ignoreLabels = ['literal', 'varDec'];
        // Don't reorder scripts
        if (data.action === 'reorder') ignoreLabels.push('script');

        if (ignoreLabels.includes(data.node.label)) return true;
    } else if (data.action == 'insert') {
        // Don't insert scripts or lists
        if (['list', 'script'].includes(data.type)) return true;
        // Don't insert new items into a list or custom block
        if ((data.parent.label === 'list' ||
                data.parent.label === 'evaluateCustomBlock') &&
                    !data.replacement) return true;
        // The only things we currently support inserting into snapshots/sprites
        // are custom blocks. We don't show hints for inserting variables,
        // sprites or scripts.
        if (data.parent.label === 'snapshot' || data.parent.label === 'stage' ||
                data.parent.label === 'sprite') {
            if (data.type !== 'customBlock') return true;
        }
    }

    return false;
};

HighlightDisplay.prototype.showDeleteHint = function(data) {
    var node = this.getCode(data.node);
    if (node == null) {
        Trace.logErrorMessage('Unknown node in delete hint');
        return;
    }

    this.addHighlight(node, HighlightDisplay.deleteColor,
        data.node.label !== 'script');
};

HighlightDisplay.prototype.showReorderHint = function(data) {
    var node = this.getCode(data.node);
    if (node == null) {
        Trace.logErrorMessage('Unknown node in reorder hint');
        return;
    }

    this.addHighlight(node, HighlightDisplay.moveColor, true);
    this.addHoverInsertIndicator(node, data.parent, data.index);
};

HighlightDisplay.prototype.hasScriptAncestor = function(blockRef) {
    while (blockRef && blockRef.label !== 'script') blockRef = blockRef.parent;
    return blockRef != null;
};

HighlightDisplay.prototype.getCandidate = function(data) {
    if (data.candidate && data.candidate.label !== 'literal') {
        var candidate = this.getCode(data.candidate);
        if (candidate instanceof CustomBlockDefinition) {
            // Don't show hidden candidates, but don't error either
            return null;
        } else if (!(candidate instanceof BlockMorph)) {
            // Otherwise, if it's null or not a BlockMorph, error
            Trace.logErrorMessage('Unknown candidate for insert hint');
            return null;
        }
        return candidate;
    }
    return null;
};

HighlightDisplay.prototype.showInsertCandidate = function(data) {
    // Don't highlight scripts or lists for movement
    if (data.type === 'script' || data.type === 'list') return;

    // Show candidate highlighting
    var candidate = this.getCandidate(data);
    if (!candidate) return;
    this.addHighlight(candidate, HighlightDisplay.moveColor, true);
};

HighlightDisplay.prototype.showInsertHint = function(data) {
    var parent = this.getCode(data.parent);
    if (!parent) {
        Trace.logErrorMessage('Unknown parent in insert hint');
        return;
    }

    var candidate = this.getCandidate(data);

    // Handle all the various things that can be inserted
    // TODO: what about custom blocks under sprites?
    if (data.parent.label === 'snapshot' && data.type === 'customBlock') {
        this.showInsertCustomBlockDef(data);
    } else if (data.replacement) {
        this.showInsertReplacement(data, parent, candidate);
    } else if (data.parent.label === 'script' &&
            !(parent instanceof CustomBlockDefinition)) {
        this.showInsertIntoScript(data, parent, candidate);
    } else if (data.parent.label === 'customBlock' &&
            parent instanceof ScriptsMorph) {
        this.showInsertCustomBlockInput(data, parent);
    } else {
        Trace.logErrorMessage('Insert unhandled for parent: ' +
            data.parent.label + ' <- ' + data.type);
        // TODO: maybe handle list/custom block inserts
        // If so, update ignorePrimaryHint() above
    }
};

// Handle inserting an input to replace another
HighlightDisplay.prototype.showInsertReplacement = function(
    data, parent, candidate
) {
    var replacement = this.getCode(data.replacement);
    if (replacement) {
        // The replacement will be a slot if there's only a literal there
        // at the moment, as opposed to another block
        var isSlot = replacement instanceof ArgMorph;
        var color = isSlot ? HighlightDisplay.insertColor :
                HighlightDisplay.deleteColor;
        this.addHighlight(replacement, color, true);

        if (isSlot) {
            var otherBlocks = [];
            if (candidate) {
                var type = candidate.selector;
                if (type === 'reportGetVar' && candidate.blockSpec) {
                    // For variables, add their spec (name)
                    type += ':' + candidate.blockSpec;
                }
                otherBlocks.push(type);
            }
            var onClick = this.createBlockHintCallback(true,
                parent.enclosingBlock(), candidate, data.from, data.to,
                otherBlocks);
            this.addHoverHint(replacement, onClick);
        }
        // Add a hover indicator if the replacement is a slot (optionally with
        // a block filling it)
        if (candidate &&
                (isSlot || replacement instanceof ReporterBlockMorph)) {
            this.addHoverInsertIndicator(candidate,
                data.replacement.parent, data.replacement.index);
        }
    } else {
        Trace.logErrorMessage('Unknown replacement in insert hint: ' +
            data.replacement.label);
    }
};

// Handle inserting an additional code element, e.g. a block into a script
HighlightDisplay.prototype.showInsertIntoScript = function(
    data, parent, candidate
) {
    var fromList = [data.from];
    if (data.candidate) fromList.push([data.candidate.label]);
    var callback = this.createScriptHintCallback(true, parent, candidate,
            fromList, data.to);

    var index = data.index;

    var insertRef = this.getInsertReference(parent, index);
    // Don't show insert on scripts that are just a ReporterBlockMorph
    if (!(insertRef.block instanceof ReporterBlockMorph)) {
        this.addInsertButton(insertRef.block, insertRef.position, callback);
        if (candidate) {
            this.addHoverInsertIndicator(candidate, data.parent, index);
        }
    }
};

HighlightDisplay.prototype.showInsertCustomBlockInput = function(data, parent) {
    var message = localize(
        'You probably need another input for this block. ' +
        'Add one with the plus button below.'
    );
    var callback = this.createStructureHintCallback(true, parent, message,
        data.from, data.to);
    this.addPlusHintButton(parent, callback);
};

HighlightDisplay.prototype.getInsertReference = function(parent, index) {
    // Increase the hint index by 1 if there's a PrototypeHatBlock
    if (parent instanceof PrototypeHatBlockMorph) index++;

    var block = parent, position = HighlightDisplay.BOTTOM_LEFT;
    if (index === 0) {
        position = HighlightDisplay.TOP_LEFT;
    } else {
        if (block instanceof CSlotMorph) block = block.children[0];
        for (var i = 0; i < index - 1 && block != null; i++) {
            block = block.nextBlock();
        }
    }
    return {
        'block': block,
        'position': position,
    };
};

HighlightDisplay.prototype.addHoverHint = function(argMorph, onClick) {
    if (!(argMorph instanceof ArgMorph)) return;
    if (!this.showInserts) {
        this.hiddenInsertHints++;
        return;
    }

    if (argMorph.contents) {
        var contents = argMorph.contents();
        if (contents instanceof StringMorph) {
            contents.isEditable = false;
        }
    }
    var myself = this;
    argMorph.onClick = function() {
        onClick();
        // After the callback, set the hint dialog box's source ArgMorph
        // so that the input slot knows it should be clickable while the
        // dialog is showing
        if (HintDialogBoxMorph.showing) {
            HintDialogBoxMorph.showing.sourceArgMorph = argMorph;
        }
        // Also clear any highlight/mouse cursor from the current hover
        argMorph.mouseLeave();
        argMorph.fixLayout();

        // Make sure all other input slots are properly uneditable
        myself.hoverHints.forEach(function(arg) {
            arg.fixEditable();
        });
    };

    this.hoverHints.push(argMorph);
};

HighlightDisplay.prototype.addInsertButton =
function(block, attachPoint, callback, size) {
    if (!instanceOfAny(block, [BlockMorph, CSlotMorph,
            BlockLabelPlaceHolderMorph, PushButtonMorph]))  {
        Trace.logErrorMessage('Non-insertable morph: ' +
            (block ? block.getDebugType() : null));
        return;
    }
    if (!this.showInserts) {
        this.hiddenInsertHints++;
        return;
    }
    // We use CSlotMorphs for positioning, but for consistency, we only use
    // blocks as parents
    var positionMorph = block;
    if (block instanceof CSlotMorph) block = block.parent;

    // Don't allow duplicate insert buttons in the same position
    if (this.insertButtons.some(function(button) {
        return button.positionMorph == positionMorph &&
            button.attachPoint == attachPoint;
    })) {
        return;
    }

    var button = this.createInsertButton(
            block, positionMorph, callback, attachPoint, size);
    this.insertButtons.push(button);
};

HighlightDisplay.prototype.createInsertButton =
function(parent, positionMorph, callback, attachPoint, size) {
    size = (size || 10) * SyntaxElementMorph.prototype.scale;
    var button = new PushButtonMorph(parent, callback,
        new SymbolMorph('plus', size));
    button.labelColor = HighlightDisplay.insertColor;
    button.positionMorph = positionMorph;
    button.attachPoint = attachPoint;
    button.float = true;

    layout = function(button) {
        var pMorph = button.positionMorph;
        var padding = 3;
        if (button.attachPoint === HighlightDisplay.TOP_LEFT) {
            button.setRight(pMorph.left() - padding);
            button.setTop(pMorph.top() - button.height() / 2);
        } else if (button.attachPoint === HighlightDisplay.BOTTOM_LEFT) {
            button.setRight(pMorph.left() - padding);
            button.setTop(pMorph.bottom() - button.height() / 2);
        } else if (button.attachPoint === HighlightDisplay.ABOVE) {
            button.setCenter(pMorph.center());
            button.setBottom(pMorph.top() - padding);
        } else if (button.attachPoint === HighlightDisplay.LEFT) {
            button.setCenter(pMorph.center());
            button.setRight(pMorph.left() - padding);
        } else if (button.attachPoint === HighlightDisplay.RIGHT) {
            button.setCenter(pMorph.center());
            button.setLeft(pMorph.right() + padding);
        } else {
            Trace.logErrorMessage('Unknown insert button attachPoint: ' +
                button.attachPoint);
        }
        button.fixLayout();
    };

    var layoutBlock = parent;
    while (!layoutBlock.fixLayout) layoutBlock = layoutBlock.parent;
    var oldFixLayout = layoutBlock.fixLayout;
    layoutBlock.fixLayout = function() {
        oldFixLayout.apply(this, arguments);
        layout(button);
    };

    parent.add(button);
    // Prevent the buttons from being copied (e.g. when their parent is copied
    // or stored when a custom block is serialized)
    button.doNotCopy = true;
    layoutBlock.fixLayout();
    return button;
};

HighlightDisplay.prototype.addPlusHintButton = function(parent, callback) {
    var prototypeHBM = parent.children[0];
    if (!(prototypeHBM instanceof PrototypeHatBlockMorph)) {
        Trace.logErrorMessage('Custom block without PrototypeHatBlockMorph');
        return;
    }
    var customCBM = prototypeHBM.children[0];
    if (!instanceOfAny(customCBM,
            [CustomCommandBlockMorph, CustomReporterBlockMorph])) {
        Trace.logErrorMessage('Custom block without CustomCommandBlockMorph');
        return;
    }
    var pluses = customCBM.children.filter(function (child) {
        return child instanceof BlockLabelPlaceHolderMorph;
    });
    if (pluses.length === 0) {
        Trace.logErrorMessage('Custom block without plusses');
        return;
    }
    var lastPlus = pluses[pluses.length - 1];
    this.addInsertButton(lastPlus, HighlightDisplay.ABOVE, callback);
};

HighlightDisplay.prototype.addHoverInsertIndicator = function(
    block, parentRef, index
) {
    var parent = this.getCode(parentRef);
    if (!parent) {
        Trace.logErrorMessage('Unknown parent in hover insert indicator');
        return;
    }

    var scriptParent;

    if (parentRef.label === 'script') {
        var insertRef = this.getInsertReference(parent, index);
        var isBottom = insertRef.position === HighlightDisplay.BOTTOM_LEFT;
        var attachBlock = insertRef.block;
        var attachPointFunction;
        var attachType;
        var attachLocation = isBottom ? 'bottom' : 'top';
        if (attachBlock instanceof CommandSlotMorph) {
            attachPointFunction = attachBlock.slotAttachPoint;
            attachType = 'slot';
        } else {
            if (isBottom) {
                attachPointFunction = attachBlock.bottomAttachPoint;
            } else {
                attachPointFunction = attachBlock.topAttachPoint;
            }
            attachType = 'block';
        }
        block.feedbackBlock =  {
            closestAttachTarget: function() {
                return {
                    point: attachPointFunction.call(attachBlock),
                    element: attachBlock,
                    type: attachType,
                    location: attachLocation,
                };
            },
            blockId: function() {
                // Attached above/below a block
                if (attachBlock.blockId) return attachBlock.blockId();
                // Attached in a CSlot morph
                if (attachBlock.argId) return attachBlock.argId();
                Trace.logErrorMessage('Unknow attachBlock: ' +
                        typeof attachBlock);
                return null;
            },
            showBelowTarget: isBottom,
        };
        scriptParent = attachBlock.parentThatIsA(ScriptsMorph);
    } else if (parent instanceof BlockMorph ||
            parent instanceof MultiArgMorph) {
        var input = parent.inputs()[index];
        // Only ArgMorphs (empty input slots) or ReporterBlockMorphs (filled
        // input slots) are valid feedbackInput targets
        if (!(input instanceof ArgMorph ||
                input instanceof ReporterBlockMorph)) {
            Trace.logErrorMessage('Bad index in insert indicator');
            return;
        }
        block.feedbackInput = input;
        scriptParent = input.parentThatIsA(ScriptsMorph);
    } else {
        Trace.logErrorMessage('Unknown parent type: ' +
            (parent ? parent.getDebugType() : parent));
        return;
    }
    if (!scriptParent) return;
    if (!scriptParent.hoverBlocks) {
        scriptParent.hoverBlocks = [];
    }
    scriptParent.hoverBlocks.push(block);
    this.hoverInsertIndicatorBlocks.push(block);
};

HighlightDisplay.logHoverInsertIndicator = function(block, showing) {
    var isScriptHint = block.feedbackBlock != null;
    var target = block.feedbackBlock || block.feedbackInput;
    if (target == null) {
        Trace.logErrorMessage('Insert indicator without target');
        return;
    }
    if (!block.blockId) {
        Trace.logErrorMessage('Non-block insert indicator: ' + typeof block);
        return;
    }
    var id;
    if (target.blockId) {
        id = target.blockId();
    } else if (target.argId) {
        id = target.argId();
    } else {
        Trace.logErrorMessage('Insert indicator without ID: ' + typeof target);
        return;
    }
    var args = {
        // ID of the block being hovered over
        candidate: block.blockId(),
        // ID of the block/arg (sibling) where the candidate should be inserted
        // For script hints, this is a sibling the candidates hould be inserted
        // above or below, or a CSlot the candidate should be inserted into.
        // For block hints, this is an InputSlot where the candidate should be
        // inserted, or a block it should replace.
        // This is a bit convoluted because script parents have no ID, so it's
        // not trivial just to give a parent ID and insert index, so instead we
        // descrive the location of the insert indicator itself.
        target: id,
    };
    if (isScriptHint) {
        // Whether the insert indicator is below the target block
        args.showBelowTarget = target.showBelowTarget;
        // Whether the target is a CSlotMorph (with argIndex)
        args.inCSlotTarget = id.argIndex != undefined;
        if (showing) {
            Trace.log('HighlightDisplay.showHoverScriptInsert', args);
        } else {
            Trace.log('HighlightDisplay.hideHoverScriptInsert', args);
        }
    } else {
        // Whether the target is a block (inside the target arg) to be replaced
        args.isReplacement = target.argId == null;
        if (showing) {
            Trace.log('HighlightDisplay.showHoverBlockInsert', args);
        } else {
            Trace.log('HighlightDisplay.hideHoverBlockInsert', args);
        }
    }
};

extend(ScriptsMorph, 'step', function(base) {
    base.call(this);
    if (!window.world.hand) {
        return; // not sure why I need this - ken kahn
    }
    // If the hand is grabbing, don't show hover feedback
    if (window.world.hand.children.length > 0) return;
    if (!this.hoverBlocks) return;

    // For each block with a hover action...
    var hoveringBlock = this.hoverBlocks.find(function(block) {
        // Find the top-child under the cursor
        var topMorph = block.topMorphAt(window.world.hand.position());
        // And ensure it exists, it's not a button and it is the hover block,
        // not some child block
        if (!topMorph || topMorph.parentThatIsA(PushButtonMorph) ||
                block != topMorph.parentThatIsA(BlockMorph)) {
            return false;
        }
        // Then show the appropriate feedback
        if (block.feedbackBlock) {
            this.showCommandDropFeedback(block.feedbackBlock);
            return true;
        } else if (block.feedbackInput) {
            this.showReporterDropFeedbackFromTarget(block,
                block.feedbackInput);
            return true;
        }
        return false;
    }, this);

    this.hoverBlocks.forEach(function(block) {
        var feedbackShowing = (block == hoveringBlock);
        if (!!block.feedbackShowing !== feedbackShowing) {
            HighlightDisplay.logHoverInsertIndicator(block, feedbackShowing);
        }
        block.feedbackShowing = feedbackShowing;
    });
});
