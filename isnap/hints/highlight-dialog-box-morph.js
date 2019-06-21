require('gui-extensions');

function HighlightDialogBoxMorph(target, showInserts, autoClear) {
    this.init(target, showInserts, autoClear);
}

HighlightDialogBoxMorph.prototype = Object.create(DialogBoxMorph.prototype);
HighlightDialogBoxMorph.constructor = HighlightDialogBoxMorph;
HighlightDialogBoxMorph.uber = DialogBoxMorph.prototype;

HighlightDialogBoxMorph.showOnRun = true;
HighlightDialogBoxMorph.firstShowOnRun = true;
HighlightDialogBoxMorph.minimized = false;

HighlightDialogBoxMorph.prototype.init = function(target, showInserts,
        autoClear) {
    HighlightDialogBoxMorph.uber.init.call(this, target, null, target);

    this.key = 'highlightDialog';
    this.insertButton =
        this.addButton('toggleInsert', this.nextButtonText(showInserts));
    this.minimizeButton = this.addButton('toggleMinimized',
        this.minimizeButtonText());
    this.addButton('ok', localize('Done'));

    this.labelString = 'Checking your Work';
    this.createLabel();
    this.autoClear = autoClear;
    this.showInserts = showInserts;

    var bodyWrapper = new AlignmentMorph('column', this.padding);

    var body = new AlignmentMorph('column', this.padding);
    body.alignment = 'left';
    body.isVisible = !HighlightDialogBoxMorph.minimized;

    var fontSize = 13;
    var width = 430;
    function addText(text, bold, parent) {
        var textMorph = new TextMorph(localize(text), fontSize,
            null, bold, null, null, width);
        textMorph.drawNew();
        (parent || body).add(textMorph);
        return textMorph;
    }

    function createBlock(selector, highlightColor) {
        var block = SpriteMorph.prototype.blockForSelector(selector, true);
        if (highlightColor) block.addSingleHintHighlight(highlightColor);
        block.disable();
        return block;
    }

    function addBlock(selector, highlightColor, parent) {
        var block = createBlock(selector, highlightColor);
        (parent || body).add(block);
        return block;
    }

    function addBlockWithInput(parentSelector, childSelector, childIndex,
        childHighlightColor, parent) {
        var parentBlock = addBlock(parentSelector, null, parent || body);
        var childBlock = createBlock(childSelector, childHighlightColor);
        parentBlock.silentReplaceInput(parentBlock.inputs()[childIndex],
            childBlock);
    }

    addText(
        "I'm checking your work using previous students' solutions...\n" +
            '*These are suggestions and do not guarantee a correct solution!*',
        true, bodyWrapper
    );

    var mainFrame = new AlignmentMorph('column', this.padding);
    mainFrame.alignment = 'left';

    addText(
        "MAGENTA highlighted blocks probably don't belong in the solution:",
        null, mainFrame
    );
    addBlock('doAsk', HighlightDisplay.deleteColor, mainFrame);

    addText(
        'YELLOW highlighted blocks are probably part of ' +
        'the solution, but need to be moved or reordered. ' +
        'Hover over them to see where to move them:',
        null, mainFrame
    );
    var moveBlocks = new AlignmentMorph('row', this.padding);
    addBlock('forward', HighlightDisplay.moveColor, moveBlocks);
    addBlockWithInput('doSayFor', 'getLastAnswer', 0,
        HighlightDisplay.moveColor, moveBlocks);
    moveBlocks.fixLayout();
    mainFrame.add(moveBlocks);

    addText(
        "For a hint on what to do next, click the 'Show Next Steps' button " +
        'below.',
        null, mainFrame
    );

    mainFrame.fixLayout();
    if (showInserts) mainFrame.hide();
    body.add(mainFrame);
    this.mainFrame = mainFrame;

    var insertFrame = new AlignmentMorph('column', this.padding);
    insertFrame.alignment = 'left';

    addText(
        'BLUE highlighted inputs may need a new block added to them. ' +
        'Click on the input to get a suggestion.',
        null, insertFrame
    );
    var parentBlock = addBlock('reportEquals', null, insertFrame);
    parentBlock.inputs()[0].addSingleHintHighlight(
        HighlightDisplay.insertColor);

    addText(
        'BLUE [+] buttons will appear where you may need to add a new ' +
        'block to a script. Click on the button for a suggestion.',
        null, insertFrame
    );
    var hatBlock = addBlock('receiveGo', null, insertFrame);
    hatBlock.nextBlock(createBlock('doSayFor'));
    HighlightDisplay.prototype.createInsertButton(
        hatBlock, hatBlock, function() { }, HighlightDisplay.BOTTOM_LEFT);

    insertFrame.fixLayout();
    if (!showInserts) insertFrame.hide();
    this.insertFrame = insertFrame;
    hatBlock.setLeft(hatBlock.left() + 30);
    body.add(insertFrame);

    var checkShowOnRun = new ToggleMorph('checkbox', this, 'toggleShowOnRun',
        'Always check my work when I run scripts', function() {
            return HighlightDialogBoxMorph.showOnRun;
        });
    body.add(checkShowOnRun);

    var myself = this;
    var checkAutoClear = new ToggleMorph('checkbox', this, 'toggleAutoClear',
        'Clear highlights when I edit my code', function() {
            return myself.autoClear;
        });
    body.add(checkAutoClear);

    // By default, show() shows all children, so we must avoid this for
    // hidden frames where the visibility is manually controlled
    extendObject(mainFrame, 'show', function(base) {
        if (!myself.showInserts) base.call(this);
    });
    extendObject(insertFrame, 'show', function(base) {
        if (myself.showInserts) base.call(this);
    });
    extendObject(body, 'show', function(base) {
        if (!HighlightDialogBoxMorph.minimized) base.call(this);
    });
    body.fixLayout();
    this.bodyFrame = body;

    bodyWrapper.add(body);
    bodyWrapper.fixLayout();
    this.addBody(bodyWrapper);
    bodyWrapper.drawNew();
};

HighlightDialogBoxMorph.prototype.destroy = function() {
    if (!this.destroyed) {
        Trace.log('HighlightDialogBoxMorph.destroy');
        HighlightDialogBoxMorph.uber.destroy.call(this);
        this.destroyed = true;
        HighlightDisplay.stopHighlight();
        this.setDisplayShowInserts(false);
    }
};

HighlightDialogBoxMorph.prototype.setDisplayShowInserts = function(show) {
    window.hintProvider.displays.forEach(function(display) {
        if (!display instanceof HighlightDisplay) return;
        display.showInserts = show;
    });
    window.hintProvider.getHintsFromServer();
};

HighlightDialogBoxMorph.prototype.popUp = function() {
    var world = this.target.world();
    if (!world) return;

    // Defer to an existing dialog if one exists
    var showing = HighlightDialogBoxMorph.showing;
    if (showing && !showing.destroyed) {
        return;
    }

    this.fixLayout();
    this.drawNew();

    var origin = this.makeOrigin();

    HighlightDialogBoxMorph.showing = this;
    HighlightDialogBoxMorph.uber.popUp.call(this, world);

    this.recenter(origin);
};

HighlightDialogBoxMorph.prototype.makeOrigin = function() {
    var showing = HighlightDialogBoxMorph.showing;

    // Set the top-left corner to that of the previous dialog or the corralBar
    var origin = null;
    // Declare the variable in case it's not defined
    var ide = window.ide;
    if (showing) {
        origin = showing.bounds.origin;
    } else if (ide && ide.corralBar) {
        origin = ide.corralBar.bounds.origin;
    }
    // Make sure it doesn't pop up partially offscreen
    if (ide && origin) {
        origin.x = Math.min(origin.x, ide.width() - this.width());
        origin.y = Math.min(origin.y, ide.height() - this.height());
        origin.x = Math.max(origin.x, 0);
        origin.y = Math.max(origin.y, 0);
    }

    return origin;
};

HighlightDialogBoxMorph.prototype.recenter = function(origin) {
    if (!this.isVisible) return;
    origin = origin || this.makeOrigin();
    // Wait to set the origin until after popping up
    if (origin) {
        this.setLeft(origin.x);
        this.setTop(origin.y);
        this.fixLayout();
        this.drawNew();
    }
};

HighlightDialogBoxMorph.prototype.nextButtonText = function(showInserts) {
    return showInserts ? localize('Hide Next Steps') :
        localize('Show Next Steps');
};

HighlightDialogBoxMorph.prototype.toggleInsert = function() {
    this.showInserts = !this.showInserts;
    Trace.log('HighlightDialogBoxMorph.toggleInsert', this.showInserts);
    if (this.showInserts) {
        this.insertFrame.show();
        this.mainFrame.hide();
    } else {
        this.insertFrame.hide();
        this.mainFrame.show();
    }
    this.insertButton.labelString = this.nextButtonText(this.showInserts);
    this.insertButton.createLabel();
    this.insertButton.fixLayout();
    this.setDisplayShowInserts(this.showInserts);
    this.body.fixLayout();
    this.body.drawNew();
    this.fixLayout();
    this.drawNew();
};

HighlightDialogBoxMorph.prototype.minimizeButtonText = function() {
    return HighlightDialogBoxMorph.minimized ? localize('Show Instructions') :
        localize('Hide Instructions');
};

HighlightDialogBoxMorph.prototype.toggleMinimized = function() {
    var minimized = HighlightDialogBoxMorph.minimized =
        !HighlightDialogBoxMorph.minimized;
    this.minimizeButton.labelString = this.minimizeButtonText();
    this.minimizeButton.createLabel();
    this.minimizeButton.fixLayout();
    this.bodyFrame.isVisible = !minimized;
    this.body.fixLayout();
    this.body.drawNew();
    this.fixLayout();
    this.drawNew();
};

HighlightDialogBoxMorph.prototype.toggleShowOnRun = function() {
    HighlightDialogBoxMorph.showOnRun = !HighlightDialogBoxMorph.showOnRun;
    Trace.log('HighlightDialogBoxMorph.toggleShowOnRun',
        HighlightDialogBoxMorph.showOnRun);
};

HighlightDialogBoxMorph.prototype.toggleAutoClear = function() {
    var autoClear = this.autoClear = !this.autoClear;
    Trace.log('HighlightDialogBoxMorph.toggleAutoClear', autoClear);
    window.hintProvider.displays.forEach(function(display) {
        if (display instanceof HighlightDisplay) {
            display.autoClear = autoClear;
        }
    });
};

HighlightDialogBoxMorph.showHighlights = function() {
    if (!(window.hintProvider && window.hintProvider.isActive() &&
            window.hintProvider.containsDisplay(HighlightDisplay))) {
        return;
    }
    var showing = HighlightDialogBoxMorph.showing;
    if (showing && !showing.destroyed) return;

    var show = function() {
        Trace.log('HighlightDialogBoxMorph.showOnRun');
        HighlightDisplay.startHighlight();
    };
    if (HighlightDialogBoxMorph.firstShowOnRun) {
        Trace.log('HighlightDialogBoxMorph.promptShowOnRun');
        HighlightDialogBoxMorph.firstShowOnRun = false;
        var dialog = new DialogBoxMorph(null, function() {
            // Treat as if the button was clicked
            window.hintProvider.displays.forEach(function(display) {
                display.forceShowDialog = true;
            });
            show();
        });
        extendObject(dialog, 'cancel', function(base) {
            Trace.log('HighlightDialogBoxMorph.cancelShowOnRun');
            HighlightDialogBoxMorph.showOnRun = false;
            base.call(this);
        });
        dialog.askYesNo(
            localize('Checking your Work'),
            localize(
                'When you run your code, I can check your work for ' +
                'possible \nmistakes and make suggestions. Do you want ' +
                'to enable this?'),
            window.world
        );
    } else {
        show();
    }
};

extend(StageMorph, 'fireGreenFlagEvent', function(base) {
    var procs = base.call(this);
    if (HighlightDialogBoxMorph.showOnRun &&
            !HighlightDisplay.isSnapPresenting()) {
        HighlightDialogBoxMorph.showHighlights();
    }
    return procs;
});

extend(BlockMorph, 'mouseClickLeft', function(base) {
    base.call(this);
    var top = this.topBlock(),
        receiver = top.scriptTarget();
    if (!receiver) return;

    var children = top.allChildren().filter(function(child) {
        return child instanceof BlockMorph;
    }).length;

    // Limit click-run checking to 3-block scripts
    if (children < 3) return;

    var stage = top.scriptTarget().parentThatIsA(StageMorph);
    if (stage && HighlightDialogBoxMorph.showOnRun) {
        var process = stage.threads.findProcess(top);
        if (process && !process.readyToTerminate) {
            HighlightDialogBoxMorph.showHighlights();
        }
    }
});