

// IntentionDialogMorph ////////////////////////////////////////

// IntentionDialogMorph initialization

function IntentionDialogMorph(target) {
    this.init(target);
}

// IntentionDialogMorph inherits from DialogBoxMorph

IntentionDialogMorph.prototype = Object.create(DialogBoxMorph.prototype);
IntentionDialogMorph.prototype.constructor = IntentionDialogMorph;
IntentionDialogMorph.uber = DialogBoxMorph.prototype;

// Keep track of currently showing Intention Dialog
IntentionDialogMorph.showing = null;

IntentionDialogMorph.prototype.destroy = function() {
    IntentionDialogMorph.uber.destroy.apply(this, arguments);
    if (IntentionDialogMorph.showing != this) {
        return;
    }
    IntentionDialogMorph.showing = null;
};

IntentionDialogMorph.prototype.init = function (target) {
    // declare local variables
    var options;

    IntentionDialogMorph.showing = this;

    this.handle = null;

    // initialize inherited properties: (call parent constructor)
    IntentionDialogMorph.uber.init.call(
        this,
        target,
        null,
        target
    );

    this.createLabels();

    // override inherited properties
    this.key = 'intentionDialog';
    this.labelString = 'Help';
    this.createLabel();

    options = new AlignmentMorph('col', this.padding);
    options.alignment = 'left';
    this.addBody(options);

    this.addOptions();

    // add accept and decline button
    this.addButton('showHintBubbles', 'Show Suggestions');
    this.addButton('cancel', 'Cancel');

    // set layout
    this.fixExtent();
    this.fixLayout();
    // Trace.log('IntentionDialog.init');
};

IntentionDialogMorph.prototype.addOptions = function() {
    this.addOption("I don't know what to do next.");
    this.addOption("There's an error in my code.");
    this.addOtherOption();
};

IntentionDialogMorph.prototype.addOption = function(text) {
    var option, myself = this;

    // var selected = this.body.children.length == 0;
    var selected = false;
    option = new ToggleMorph(
        'checkbox',
        null,
        null,
        localize(text),
        function () {
            return selected;
        }
    );
    option.query = function() {
        return option.selected;
    };
    option.action = function () {
        myself.selectOption(option);
    };
    option.selected = selected;

    option.drawNew();
    option.fixLayout();

    this.body.add(option);

    return option;
};


IntentionDialogMorph.prototype.addOtherOption = function() {
    var option = this.addOption('Other...');
    var myself = this;

    var txt = new InputFieldMorph(
            '',
            false, // numeric?
            null, // drop-down dict, optional
            false
        );
    txt.setWidth(200);

    var text = txt.children[0];
    setTimeout(function() {
        if (window.world.cursor) {
            window.world.cursor.destroy();
        }
    }, 1);
    var oldClick = text.mouseClickLeft;
    text.mouseClickLeft = function(pos) {
        oldClick.call(text, pos);
        myself.selectOption(option);
    };

    this.textBox = txt;
    this.add(txt);
};


IntentionDialogMorph.prototype.selectOption = function(selected) {
    if (this.body) {
        this.body.children.forEach(function (child) {
            if (child instanceof ToggleMorph) {
                if (child == selected) child.selected = !child.selected;
                child.refresh();
            } else {
                child.children[0].selected = (child.children[0] == selected);
                child.children[0].refresh();
            }
        });
    }
};

IntentionDialogMorph.prototype.fixExtent = function() {
    var minWidth = 0,
        minHeight = 0,
        th = fontHeight(this.titleFontSize) + this.titlePadding * 2;

    this.buttons.fixLayout();
    this.buttons.fixLayout();
    this.body.fixLayout();
    this.body.fixLayout();

    minHeight = th + this.body.height() + 3 * this.padding +
        this.buttons.height() + this.labels.height();
    minWidth = Math.max(minWidth, this.body.width(), this.buttons.width(),
        this.body.children[this.body.children.length - 1].width() +
        3 * this.padding + this.textBox.width()) + 2 * this.padding;

    this.setExtent(new Point(minWidth, minHeight));
};

// create label for input field
IntentionDialogMorph.prototype.createLabels = function() {
    if (this.labels) {
        this.labels.destroy();
    }

    this.labels = new StringMorph(
            localize('What do you need help with?'),
            this.titleFontSize,
            this.fontStyle,
            true,
            false,
            false,
            null,
            this.titleBarColor.darker(this.contrast)
        );
    this.labels.color = new Color(0, 0, 0);
    this.labels.drawNew();
    this.add(this.labels);
};

// define function when Show Available Hints button is clicked
IntentionDialogMorph.prototype.showHintBubbles = function() {
    var options = [], otherText = null, myself = this;
    this.body.children.forEach(function(child) {
        if (child.selected) {
            options.push(child.captionString);
        }
    });
    otherText = myself.textBox.getValue();
    Trace.log('IntentionDialog.showAvailableHint', {
        'options': options,
        'otherText': otherText,
    });

    window.hintProvider.clearDisplays();
    window.hintProvider.setDisplayEnabled(SnapDisplay, true);

    this.close();
};

// define function when cancel button is clicked
IntentionDialogMorph.prototype.cancel = function() {
    Trace.log('IntentionDialog.cancel');
    this.close();
    ide.controlBar.hintButton.show();
};

IntentionDialogMorph.prototype.close = function() {
    // Trace.log('IntentionDialog.closed');
    this.destroy();
};

IntentionDialogMorph.prototype.popUp = function() {
    var minWidth = 0,
        minHeight = 0,
        th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        world = this.target.world();

    minHeight = th + this.body.height() + 3 * this.padding +
        this.buttons.height() + this.labels.height();
    minWidth = Math.max(minWidth, this.body.width(), this.buttons.width(),
        this.body.children[this.body.children.length - 1].width() +
        3 * this.padding + this.textBox.width()) + 2 * this.padding;

    if (world) {
        CodeHintDialogBoxMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            minWidth,
            minHeight,
            this.corner,
            this.corner
        );
    }

    Trace.log('IntentionDialog.popUp');
};

IntentionDialogMorph.prototype.fixLayout = function() {
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
        this.body.setLeft(this.left() + this.padding);
        this.body.setTop(this.top() + this.padding + th + this.labels.height());

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
        this.labels.setTop(this.body.top() - this.labels.height() - 4);
        this.labels.setLeft(this.body.left());
    }

    if (this.textBox) {
        this.textBox.setLeft(
                this.body.children[this.body.children.length - 1].right() +
                3 * this.padding);
        this.textBox.setTop(
            this.body.children[this.body.children.length - 1].top());
    }
};