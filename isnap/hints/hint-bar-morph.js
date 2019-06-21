

function HintBarMorph(parent, maxAdjacent) {
    this.init(parent, maxAdjacent | 3);
}

HintBarMorph.prototype = Object.create(Morph.prototype);
HintBarMorph.prototype.constructor = HintBarMorph;
HintBarMorph.uber = Morph.prototype;

HintBarMorph.prototype.init = function(parent, maxAdjacent) {
    HintBarMorph.uber.init.call(this);
    this.color = new Color(0, 0, 0, 0);
    this.maxAdjacent = maxAdjacent;
    if (parent) parent.add(this);
};

// Makes the morph itself draw transparently
HintBarMorph.prototype.drawNew = function() {
    this.image = newCanvas(this.extent());
};

HintBarMorph.prototype.destroy = function() {
    HintBarMorph.uber.destroy.call(this);
    if (this.highlightBlock) {
        this.highlightBlock.removeHighlight();
    }
};

// Happens when the block this is attached to is duplicated
HintBarMorph.prototype.copy = function() {
    var copy = HintBarMorph.uber.copy.call(this);
    if (window.hintProvider) {
        window.hintProvider.displays.forEach(function(display) {
            if (display instanceof SnapDisplay) {
                display.hintBars.push(copy);
            }
        });
    }
    return copy;
};

HintBarMorph.prototype.addButton = function(button, parent, script) {
    this.add(button);

    if (!(parent instanceof SyntaxElementMorph)) {
        this.layout();
        return;
    }

    while (parent instanceof ArgMorph) {
        parent = parent.parent;
    }
    button.idealY = parent.top() - parent.topBlock().top();

    this.layout();

    if (!parent.addHighlight) {
        return;
    }

    var myself = this;
    var oldMouseEnter = button.mouseEnter;
    button.mouseEnter = function() {
        oldMouseEnter.call(button);
        myself.updateHighlight(parent, script, true);
    };

    var oldMouseLeave = button.mouseLeave;
    button.mouseLeave = function() {
        oldMouseLeave.call(button);
        myself.updateHighlight(parent, script, false);
    };
};

HintBarMorph.prototype.updateHighlight = function(block, script, hovering) {
    if (!hovering && this.highlightBlock == block) {
        block.removeHighlight();
        this.highlightBlock = null;
    }

    if (hovering) {
        if (this.highlightBlock) {
            if (this.highlightBlock == block) {
                return;
            } else {
                this.highlightBlock.removeHighlight();
            }
        }
        this.highlightBlock = block;
        if (script) {
            block.addHighlight();
        } else {
            block.addSingleHighlight();
        }
    }
};

HintBarMorph.prototype.layout = function(now) {
    if (!now) {
        if (!this.scheduledLayout) {
            this.scheduledLayout = true;
            var myself = this;
            setTimeout(function() {
                myself.scheduledLayout = false;
                myself.layout(true);
            }, 0);
        }
        return;
    }

    this.children.sort(function(a, b) {
        return (a.idealY || 0) - (b.idealY || 0);
    });
    var bottom = 0, left = this.right(), right = this.right(), adjacent = 1;
    for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        var idealY = this.top() + (child.idealY || 0);
        child.setRight(this.right());
        child.setTop(idealY);
        // loop currenty executes only once, but we keep it in case we want a
        // more comprehensive layout algorithm (note break at the bottom)
        for (var j = i - 1; j >= 0; j--) {
            var lastChild = this.children[i - 1];
            var minY = lastChild.bottom() + 3;
            var minX = lastChild.left() - 3;
            if (Math.abs(child.idealY - lastChild.idealY) < 15 &&
                (!this.maxAdjacent || adjacent < this.maxAdjacent)) {
                child.setRight(minX);
                child.setTop(lastChild.top());
                adjacent++;
            } else {
                if (idealY < minY) {
                    child.setTop(minY);
                }
                adjacent = 1;
            }
            break;
        }
        bottom = Math.max(bottom, child.bottom());
        left = Math.min(left, child.left());
    }
    var deltaX = this.left() - left;
    this.setLeft(left);
    this.children.forEach(function(child) {
        child.setRight(child.right() + deltaX);
    });
    this.setExtent(new Point(right - left, bottom - this.top()));
    // TODO: if (this.parent.adjustBounds) this.parent.adjustBounds();
};