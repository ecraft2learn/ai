require('thumb-morph');

function HintDialogBoxMorph() {
    this.init();
}

// HintDialogBox inherits from DialogBoxMorph
HintDialogBoxMorph.prototype = Object.create(DialogBoxMorph.prototype);
HintDialogBoxMorph.prototype.constructor = HintDialogBoxMorph;
HintDialogBoxMorph.uber = DialogBoxMorph.prototype;

// Keep track of the currently showing dialogue box
HintDialogBoxMorph.showing = null;

HintDialogBoxMorph.prototype.initButtons = function(simple) {
    if (simple) {
        this.acceptButtons = [
            this.addButton('ok', localize('Ok')),
        ];
    } else {
        this.acceptButtons = [
            this.addButton('done', localize('Done with Help')),
            this.addButton('otherHints', localize('Other Suggestions')),
        ];
    }
};

HintDialogBoxMorph.prototype.setButtonsEnabled = function(enabled) {
    this.acceptButtons.forEach(function(button) {
        button.setEnabled(enabled);
    });
};

HintDialogBoxMorph.prototype.createThumbButtons = function () {
    var thumbButtons, txt, myself = this;

    // Vertically aligned container to hold instructions and buttons
    container = new AlignmentMorph('column', this.padding / 2);
    this.thumbContainer = container;
    this.add(container);

    // Instruction text
    txt = new StringMorph(
        localize('Please rate the suggestion to dismiss.'),
        14,
        this.fontStyle
    );
    txt.drawNew();
    container.add(txt);

    // Button container
    thumbButtons = new AlignmentMorph('row', this.padding);
    container.add(thumbButtons);
    this.thumbButtons = thumbButtons;

    this.addThumbButton('up');
    this.addThumbButton('down');

    var button = new PushButtonMorph(
        this,
        myself.newHint,
        localize('Pick Another')
    );
    button.drawNew();
    button.fixLayout();
    this.thumbButtons.add(button);

    // This is in fact required twice. Not sure why...
    thumbButtons.fixLayout();
    thumbButtons.fixLayout();
    container.fixLayout();
    container.fixLayout();

    this.setButtonsEnabled(false);
};

HintDialogBoxMorph.prototype.onThumbsDown = function(handler) {
    this.onThumbsDownHandler = handler;
};

// define popUp function
HintDialogBoxMorph.prototype.popUp = function () {
    if (HintDialogBoxMorph.showing) {
        HintDialogBoxMorph.showing.destroy();
    }

    // Set currently showing dialogue to this;
    HintDialogBoxMorph.showing = this;

    var minWidth = 0,
        minHeight = 0,
        world = this.target.world();

    // The minimum width and minimum height when adjusting dialogue scale
    minWidth = this.width();
    minHeight = this.height();

    if (world) {
        HintDialogBoxMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            minWidth,
            minHeight,
            this.corner,
            this.corner
        );
    }

    // Try not to pop up over a block editor
    // TODO: could easily add more complex non-collision logic
    if (BlockEditorMorph.showing.length > 0) {
        var left = BlockEditorMorph.showing[0].bounds.corner.x + 10;
        // Only position to the right of the editor if it's further right
        // of our current position and won't go off the screen
        if (left > this.left() && left + this.width() < world.width()) {
            this.setLeft(left);
        }
    }

    window.hintProvider.setDisplayEnabled(SnapDisplay, false);
};

HintDialogBoxMorph.prototype.addThumbButton = function (thumbType) {
    var selected = false, myself = this;

    var thumbButton = new ThumbMorph(
        thumbType,
        'radiobutton',
        function() {
            myself.setButtonsEnabled(true);
        },
        null,
        null,
        function () {
            return selected;
        }
    );
    thumbButton.action = function() {
        myself.selectThumbButton(thumbButton);
    };
    thumbButton.query = function() {
        return thumbButton.state;
    };
    thumbButton.selected = selected;

    this.thumbButtons.add(thumbButton);
};

HintDialogBoxMorph.prototype.selectThumbButton = function (thumbButton) {
    if (this.thumbButtons) {
        this.thumbButtons.children.forEach(function (child) {
            if (child instanceof ThumbMorph) {
                if (child === thumbButton) {
                    child.state = !child.state;
                } else {
                    child.state = false;
                }
                child.refresh();
            }
        });
    }
};

HintDialogBoxMorph.prototype.logFeedback = function() {
    if (!this.thumbButtons) return;
    var feedback = this.getFeedback();
    if (this.onThumbsDownHandler && feedback && feedback.length == 1 &&
            feedback[0] === 'down') {
        this.onThumbsDownHandler();
    }
    Trace.log('HintDialogBox.logFeedback', feedback);
};

HintDialogBoxMorph.prototype.getFeedback = function() {
    if (!this.thumbButtons) return null;
    var feedback = [];
    this.thumbButtons.children.forEach(function(child) {
        if (child instanceof ThumbMorph) {
            if (child.state) {
                feedback.push(child.thumbType);
            }
        }
    });
    return feedback;
};

HintDialogBoxMorph.prototype.done = function() {
    Trace.log('HintDialogBox.done');
    this.logFeedback();
    setHintsActive(false);
    this.destroy();
};

HintDialogBoxMorph.prototype.otherHints = function() {
    Trace.log('HintDialogBox.otherHints');
    this.logFeedback();
    setHintsActive(true);
    this.destroy();
};

HintDialogBoxMorph.prototype.newHint = function() {
    Trace.log('HintDialogBox.newHint');
    setHintsActive(true);
    this.destroy();
};

// define close function
HintDialogBoxMorph.prototype.destroy = function() {

    if (HintDialogBoxMorph.showing == this)
        HintDialogBoxMorph.showing = null;

    if (!this.destroyed) {
        // Only log destroyed events once (since this can be called repeatedly)
        Trace.log('HintDialogBox.destroy');
        this.destroyed = true;
    }
    if (ide.controlBar.hintButton) {
        window.hintProvider.setDisplayEnabled(SnapDisplay,
                ide.controlBar.hintButton.active);
    }
    HintDialogBoxMorph.uber.destroy.call(this);
};
