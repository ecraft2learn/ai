


/*******************************************
 * ThumbMorph
 ******************************************/

function ThumbMorph(
    thumbType, //'up' or 'down' or 'neutral'
    style, // 'checkbox' or 'radiobutton'
    target,
    action, // a toggle function
    labelString,
    query, // predicate/selector
    environment,
    hint,
    template,
    element, // optional Morph or Canvas to display
    builder // method which constructs the element (only for Morphs)
) {
    this.init(
        thumbType,
        style,
        target,
        action,
        labelString,
        query,
        environment,
        hint,
        template,
        element,
        builder
    );
}

ThumbMorph.prototype = new PushButtonMorph();
ThumbMorph.prototype.constructor = ThumbMorph;
ThumbMorph.uber = PushButtonMorph.prototype;

ThumbMorph.prototype.init = function (
    thumbType,
    style,
    target,
    action,
    labelString,
    query,
    environment,
    hint,
    template,
    element,
    builder
) {
    this.thumbType = thumbType;
    this.thumbSize = new Point(25, 25);
    this.padding = 1;
    style = style || 'checkbox';
    this.corner = (style === 'checkbox' ?
            0 : fontHeight(this.fontSize) / 2 + this.outline + this.padding);
    this.state = false;
    this.query = query || function () {return true; };
    this.tick = null;
    this.captionString = labelString || null;
    this.labelAlignment = 'right';
    this.element = element || null;
    this.builder = builder || null;
    this.toggleElement = null;

    // initialize inherited properties:
    ToggleMorph.uber.init.call(
        this,
        target,
        action,
        (style === 'checkbox' ? '\u2713' : '\u25CF'),
        environment,
        hint,
        template
    );
    this.refresh();

    this.drawNew();
    this.fixLayout();
    this.drawNew();
};

ThumbMorph.prototype.fixLayout = function () {
    var padding = this.padding * 2 + this.outline * 2,
        y;
    if (this.tick !== null) {
        this.setExtent(this.thumbSize);
        this.tick.setCenter(this.center());
    }
    if (this.toggleElement && (this.labelAlignment === 'right')) {
        y = this.top() + (this.height() - this.toggleElement.height()) / 2;
        this.toggleElement.setPosition(new Point(
            this.right() + padding,
            y
        ));
    }
    if (this.label !== null) {
        y = this.top() + (this.height() - this.label.height()) / 2;
        if (this.labelAlignment === 'right') {
            this.label.setPosition(new Point(
                this.toggleElement ?
                        this.toggleElement instanceof ToggleElementMorph ?
                                this.toggleElement.right()
                                : this.toggleElement.right() + padding
                        : this.right() + padding,
                y
            ));
        } else {
            this.label.setPosition(new Point(
                this.left() - this.label.width() - padding,
                y
            ));
        }
    }
};

ThumbMorph.prototype.createLabel = function () {
    if (this.label === null) {
        if (this.captionString) {
            this.label = new TextMorph(
                localize(this.captionString),
                this.fontSize,
                this.fontStyle,
                true
            );
            this.add(this.label);
        }
    }
    if (this.tick === null) {
        this.createTick();
    }
    if (this.toggleElement === null) {
        if (this.element) {
            if (this.element instanceof Morph) {
                this.toggleElement = new ToggleElementMorph(
                    this.target,
                    this.action,
                    this.element,
                    this.query,
                    this.environment,
                    this.hint,
                    this.builder
                );
            } else if (this.element instanceof HTMLCanvasElement) {
                this.toggleElement = new Morph();
                this.toggleElement.silentSetExtent(new Point(
                    this.element.width,
                    this.element.height
                ));
                this.toggleElement.image = this.element;
            }
            this.add(this.toggleElement);
        }
    }
};

ThumbMorph.prototype.createTick = function () {
    var myself = this;

    this.tick = new Morph();

    this.tick.setTexture = function (state) {
        var dir = 'hints/img/';
        if (myself.thumbType === 'up')
        {
            if (state) {
                this.texture = dir + 'thumb_up_selected.png';
            } else {
                this.texture = dir + 'thumb_up_unselected.png';
            }
        } else if (myself.thumbType === 'neutral') {
            if (state) {
                this.texture = dir + 'thumb_neutral_selected.png';
            } else {
                this.texture = dir + 'thumb_neutral_unselected.png';
            }
        } else {
            if (state) {
                this.texture = dir + 'thumb_down_selected.png';
            } else {
                this.texture = dir + 'thumb_down_unselected.png';
            }
        }
    };

    this.tick.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d'),
            isFlat = MorphicPreferences.isFlat && !this.is3D;

        context.fillStyle = myself.color.toString();
        context.beginPath();
        BoxMorph.prototype.outlinePath.call(
            this,
            context,
            isFlat ? 0 : Math.max(this.corner - this.outline, 0),
            this.outline
            );
        context.closePath();
        context.fill();
        context.lineWidth = this.outline;
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    this.tick.setTexture(this.state);
    this.tick.drawNew();
    this.tick.setExtent(new Point(18, 18));
    this.tick.setCenter(this.center());

    this.add(this.tick);
};

// ToggleMorph action:

ThumbMorph.prototype.trigger = function () {
    // Don't toggle, just stay pressed
    if (this.state) return;
    ToggleMorph.uber.trigger.call(this);
    this.refresh();
};

ThumbMorph.prototype.refresh = function () {
    /*
    if query is a function:
    execute the query with target as environment (can be null)
    for lambdafied (inline) actions

    else if query is a String:
    treat it as function property of target and execute it
    for selector-like queries
    */
    if (typeof this.query === 'function') {
        this.state = this.query.call(this.target);
    } else { // assume it's a String
        this.state = this.target[this.query]();
    }

    this.tick.setTexture(this.state);
    this.tick.drawNew();

    if (this.toggleElement && this.toggleElement.refresh) {
        this.toggleElement.refresh();
    }
};

// ToggleMorph events

ThumbMorph.prototype.mouseDownLeft = function () {
    PushButtonMorph.uber.mouseDownLeft.call(this);
    if (this.tick) {
        this.tick.setCenter(this.center().add(1));
    }
};

ThumbMorph.prototype.mouseClickLeft = function () {
    PushButtonMorph.uber.mouseClickLeft.call(this);
    if (this.tick) {
        this.tick.setCenter(this.center());
    }
};

ThumbMorph.prototype.mouseLeave = function () {
    PushButtonMorph.uber.mouseLeave.call(this);
    if (this.tick) {
        this.tick.setCenter(this.center());
    }
};

// ThumbMorph hiding and showing:

/*
    override the inherited behavior to recursively hide/show all
    children, so that my instances get restored correctly when
    hiding/showing my parent.
*/

ThumbMorph.prototype.hide = ToggleButtonMorph.prototype.hide;

ThumbMorph.prototype.show = ToggleButtonMorph.prototype.show;

