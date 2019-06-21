require('hint-dialog-box-morph');

// MessageHintDialogMorph ////////////////////////////////////////
function MessageHintDialogBoxMorph(target, simple, message, title) {
    this.init(target, simple, message, title);
}

// MessageHintDialogMorph inherits from DialogBoxMorph

MessageHintDialogBoxMorph.prototype =
    Object.create(HintDialogBoxMorph.prototype);
MessageHintDialogBoxMorph.prototype.constructor = MessageHintDialogBoxMorph;
MessageHintDialogBoxMorph.uber = HintDialogBoxMorph.prototype;

// initialize Message Hint Dialogue box
MessageHintDialogBoxMorph.prototype.init =
function (target, simple, message, title) {
    var txt;

    this.handle = null;

    MessageHintDialogBoxMorph.uber.init.call(
        this,
        target,
        null,
        target
        );

    this.key = 'messageHintDialog';
    this.labelString = title;
    this.createLabel();

    txt = new TextMorph(
        localize(message),
        16,
        this.fontStyle,
        true,
        false,
        'center',
        null,
        null,
        new Point(1, 1),
        new Color(255, 255, 255)
    );
    this.addBody(txt);

    this.initButtons(simple);

    this.fixExtent();
    this.fixLayout();
};

MessageHintDialogBoxMorph.prototype.popUp = function() {
    this.fixLayout();
    this.drawNew();
    this.fixLayout();
    MessageHintDialogBoxMorph.uber.popUp.call(this);
};

MessageHintDialogBoxMorph.prototype.fixLayout = function() {
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
        this.body.setTop(this.top() + this.padding + th);

    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(this.top() + (th - this.label.height()) / 2);
    }

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    if (this.thumbContainer) {
        this.thumbContainer.setCenter(this.center());
        this.thumbContainer.setBottom(
            this.bottom() - 2 * this.padding - this.buttons.height());
    }
};

MessageHintDialogBoxMorph.prototype.fixExtent = function() {
    var th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        w = 0,
        h = 0;

    this.buttons.fixLayout();
    this.buttons.fixLayout(); //doesn't know why it needs two times but it works

    w = Math.max(this.body.width(), this.buttons.width());
    if (this.thumbContainer) {
        w = Math.max(w, this.thumbContainer.width());
    }
    w += 2 * this.padding;

    h = this.body.height() + th + this.buttons.height() + 4 * this.padding;
    if (this.thumbContainer) {
        h += this.thumbContainer.height();
    }

    this.setExtent(new Point(w, h));
};