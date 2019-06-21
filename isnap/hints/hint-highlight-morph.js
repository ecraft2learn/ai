
function HintHighlightMorph() {
    this.init();
    // Never copy a HintHighlightMorph
    this.doNotCopy = true;
}

HintHighlightMorph.prototype = new Morph();
HintHighlightMorph.prototype.constructor = HintHighlightMorph;
HintHighlightMorph.uber = Morph.prototype;

HintHighlightMorph.prototype.topMorphAt = function(point) {
    return null;
};

SyntaxElementMorph.prototype.highlightImage =
    BlockMorph.prototype.highlightImage;

SyntaxElementMorph.prototype.addHintHighlight = function(color) {
    var isHidden = !this.isVisible,
        highlight;

    if (isHidden) {this.show(); }
    // Before adding, remove any normal block highlights
    var children = this.children;
    this.children = this.children.filter(function(child) {
        return !(child instanceof BlockHighlightMorph);
    });
    highlight = this.hintHighlight(color, 2);
    // After highlighting, manually add the morph and reset the children
    children.push(highlight);
    this.children = children;
    this.fullChanged();
    if (isHidden) {this.hide(); }
    return highlight;
};

SyntaxElementMorph.prototype.addSingleHintHighlight = function(color) {
    color = color || this.activeHighlight;
    var children = this.children;
    this.children = [];
    var highlight = this.addHintHighlight(color);
    highlight.isSingle = true;
    children.push(highlight);
    this.children = children;
    this.fullChanged();
    return highlight;
};

SyntaxElementMorph.prototype.removeHintHighlight = function () {
    var highlight = this.getHintHighlight();
    if (highlight !== null) {
        this.fullChanged();
        this.removeChild(highlight);
    }
    return highlight;
};

SyntaxElementMorph.prototype.hintHighlight = function (color, border) {
    var highlight = new HintHighlightMorph(),
        fb = this.fullBounds();
    highlight.setExtent(fb.extent().add(border * 2));
    highlight.color = color;
    highlight.image = this.highlightImage(color, border);
    highlight.setPosition(fb.origin.subtract(new Point(border, border)));
    highlight.parent = this;
    return highlight;
};

SyntaxElementMorph.prototype.getHintHighlight = function () {
    var highlights;
    highlights = this.children.slice(0).reverse().filter(
        function (child) {
            return child instanceof HintHighlightMorph;
        }
    );
    if (highlights.length !== 0) {
        return highlights[0];
    }
    return null;
};

SyntaxElementMorph.prototype.fixHintHighlight = function() {
    // TODO: This isn't triggered when input slots are edited, e.g. when a
    // user clicks twice to edit an input slot with a blue outline
    var oldHighlight = this.removeHintHighlight();
    if (oldHighlight) {
        if (oldHighlight.isSingle) {
            this.addSingleHintHighlight(oldHighlight.color);
        } else {
            this.addHintHighlight(oldHighlight.color);
        }
    }
};

extend(SyntaxElementMorph, 'fixLayout', function(base, silently) {
    base.call(this, silently);
    this.fixHintHighlight();
});

// Remove any copied morphic that was not supposed to be copied
// It would be ideal to simply not copy these morphs in the first place,
// but that would involve editing the original code, so we use this solution.
extend(Morph, 'copyRecordingReferences', function(base, map) {
    var copy = base.call(this, map);
    copy.children = copy.children.filter(function(child) {
        return !child.doNotCopy;
    });
    return copy;
});

ArgMorph.prototype.addFullHintHighlight = function(color) {
    var highlight = new HintHighlightMorph(),
        fb = this.fullBounds();
    highlight.setExtent(fb.extent());
    highlight.color = color;
    highlight.image = this.highlightImageFull(color);
    highlight.setPosition(fb.origin);
    this.addBack(highlight);
    this.fullChanged();
    return highlight;
};

ArgMorph.prototype.highlightImageFull = function (color) {
    var fb, img, hi, ctx;
    fb = this.fullBounds().extent();
    img = this.fullImage();

    hi = newCanvas(fb);
    ctx = hi.getContext('2d');
    ctx.fillStyle = color.toString();
    ctx.fillRect(0, 0, fb.x, fb.y);

    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(img, 0, 0);
    return hi;
};

ArgMorph.prototype.isHintClickable = function() {
    return this.onClick != null && !this.isHoverHintShowing();
}

ArgMorph.prototype.isHoverHintShowing = function() {
    return HintDialogBoxMorph.showing &&
        HintDialogBoxMorph.showing.sourceArgMorph === this;
}

ArgMorph.prototype.mouseEnter = function() {
    if (this.isHintClickable()) {
        this.fullHighlight =
			this.addFullHintHighlight(new Color(255, 255, 0, 0.7));
        document.body.style.cursor = 'pointer';
    }
};

ArgMorph.prototype.mouseLeave = function() {
    if (this.fullHighlight) {
        this.fullHighlight.destroy();
        this.fullHighlight = null;
        this.fullChanged();
    }
    document.body.style.cursor = 'inherit';
    this.fixEditable();
};

ArgMorph.prototype.fixEditable = function() {
    if (!this.contents) return;
    var contents = this.contents();
    if (contents) {
        contents.isEditable = contents.isEditable && !this.isHintClickable();
    }
};

ArgMorph.prototype.mouseClickLeft = function(pos) {
    if (this.isHintClickable()) {
        this.onClick.call(this);
    }
};

extend(InputSlotMorph, 'mouseClickLeft', function(base, pos) {
    if (this.isHintClickable()) {
        InputSlotMorph.uber.mouseClickLeft.call(this, pos);
    } else {
        base.call(this, pos);
    }
});

extend(InputSlotMorph, 'mouseDownLeft', function(base, pos) {
    if (!this.isHintClickable()) {
        base.call(this, pos);
    }
});

extend(InputSlotMorph, 'fixLayout', function(base) {
    base.call(this);
    this.fixEditable();
});

extend(BooleanSlotMorph, 'mouseEnter', function(base) {
    // Determine whether to call the base first, since calling the uber, the
    // dialog will be showing and it will always be true
    var callBase = !this.isHintClickable();
    BooleanSlotMorph.uber.mouseEnter.call(this);
    if (callBase) base.call(this);
});

extend(BooleanSlotMorph, 'mouseLeave', function(base) {
    BooleanSlotMorph.uber.mouseLeave.call(this);
    // Call the base either way, since we may need to remove the toggle
    base.call(this);
});

extend(BooleanSlotMorph, 'mouseClickLeft', function(base) {
    var callBase = !this.isHintClickable();
    BooleanSlotMorph.uber.mouseClickLeft.call(this);
    if (callBase) base.call(this);
});
