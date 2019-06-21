require('hint-bar-morph');
require('hint-highlight-morph');

extend(SyntaxElementMorph, 'isNonPartMorph', function(base, block) {
    return base.call(this, block) ||
        block instanceof HintBarMorph ||
        block instanceof HintHighlightMorph ||
        block instanceof PushButtonMorph;
});

extend(Morph, 'fullBounds', function(base) {
    var result;
    result = this.bounds;
    this.children.forEach(function (child) {
        // Don't use "floating" children in fullBounds calculation
        if (child.isVisible && !child.float) {
            result = result.merge(child.fullBounds());
        }
    });
    return result;
});

SyntaxElementMorph.prototype.enclosingBlock = function() {
    var block = this;
    while (block && !(block instanceof BlockMorph)) {
        block = block.parent;
    }
    return block;
};

BlockMorph.prototype.topBlockInScript = function() {
    if (this.parent.nextBlock && this.parent.nextBlock() == this) {
        return this.parent.topBlockInScript();
    }
    return this;
};

// We need block highlights not to intercept pointer events
BlockHighlightMorph.prototype.topMorphAt = function(point) {
    return null;
};

BlockMorph.prototype.addActiveHighlightBasic =
    BlockMorph.prototype.addActiveHighlight;
BlockMorph.prototype.addActiveHighlight = function(color) {
    var index = this.children.indexOf(this.hintBar);
    if (index >= 0) {
        this.children.splice(index, 1);
        var highlight = this.addActiveHighlightBasic(color);
        this.children.splice(index, 0, this.hintBar);
        this.fullChanged();
        return highlight;
    } else {
        return this.addActiveHighlightBasic(color);
    }
};

BlockMorph.prototype.addSingleHighlight = function(color) {
    color = color || this.activeHighlight;
    var children = this.children;
    this.children = [];
    var highlight = this.addActiveHighlight(color);
    children.push(highlight);
    this.children = children;
    this.fullChanged();
    return highlight;
};

BlockMorph.prototype.disable = function() {
    noop = function() { return null; };
    this.userMenu = noop;
    this.allChildren().forEach(function (child) {
        if (instanceOfAny(child,
                [InputSlotMorph, StringMorph, MultiArgMorph])) {
            child.mouseClickLeft = noop;
            child.mouseDownLeft = noop;
        }
        if (child instanceof BlockMorph) {
            // TODO: for some reason this doesn't work on vars (e.g. in for)
            child.isDraggable = false;
        }
    });
};