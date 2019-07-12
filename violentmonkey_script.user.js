// ==UserScript==
// @name ADD IME TO SNAP
// @namespace Violentmonkey Scripts
// @match https://snap.berkeley.edu/*
// @match https://ecraft2learn.github.io/ai/*
// @match http://localhost:8080/ai/*
// @grant none
// ==/UserScript==

// patch the classes
InputSlotMorph.prototype.mouseDownLeft = function (pos) {
    if (this.isReadOnly || this.arrow().bounds.containsPoint(pos)) {
        this.escalateEvent('mouseDownLeft', pos);
    } else {
        this.selectForEdit().contents().edit();
    }
};

CursorMorph.prototype.init = function (aStringOrTextMorph) {
    var ls;

    // additional properties:
    this.keyDownEventUsed = false;
    this.target = aStringOrTextMorph;
    this.originalContents = this.target.text;
    this.originalAlignment = this.target.alignment;
    this.slot = this.target.text.length;
    CursorMorph.uber.init.call(this);
    ls = fontHeight(this.target.fontSize);
    this.setExtent(new Point(Math.max(Math.floor(ls / 20), 1), ls));
    this.drawNew();
    this.image.getContext('2d').font = this.target.font();
    if (this.target instanceof TextMorph &&
            (this.target.alignment !== 'left')) {
        this.target.setAlignmentToLeft();
    }
    this.gotoSlot(this.slot);
    this.initializeTextarea();
};

CursorMorph.prototype.initializeTextarea = function () {
    var myself = this;

    this.textarea = document.createElement('textarea');
    this.textarea.style.zIndex = -1;
    this.textarea.style.position = 'absolute';
    this.textarea.wrap = "off";
    this.textarea.style.overflow = "hidden";
    //this.textarea.style.fontSize = this.target.fontSize + 'px';
    this.textarea.autofocus = true;
    this.textarea.value = this.target.text;
    document.body.appendChild(this.textarea);
    this.updateTextAreaPosition();
    this.syncTextareaSelectionWith(this.target);


    /* The following keyboard events causes special actions in Snap, so we
    don't want the textarea to handle it:
    - ctrl-d, ctrl-i and ctrl-p: doit, inspect it and print it
    - tab: goto next text field
    - esc: discard the editing
    - enter / shift+enter: accept the editing
    */
    this.textarea.addEventListener('keydown', function (event) {
        // other part of the world need to know the current key
        myself.world().currentKey = event.keyCode;

        var keyName = event.key;
        var shift = event.shiftKey;
        var singleLineText = myself.target instanceof StringMorph;

        if (!isNil(myself.target.receiver) &&
                    (event.ctrlKey || event.metaKey)) {
            if (keyName === 'd') {
                myself.target.doIt();
            } else if (keyName === 'i') {
                myself.target.inspectIt();
            } else if (keyName === 'p') {
                myself.target.showIt();
            }
            event.preventDefault();
        } else if (keyName === 'Tab' || keyName === 'U+0009') {
            if (shift) {
                myself.target.backTab(myself.target);
            } else {
                myself.target.tab(myself.target);
            }
            event.preventDefault();
            myself.target.escalateEvent('reactToEdit', myself.target);
        } else if (keyName === 'Escape') {
            myself.cancel();
        } else if (keyName === "Enter" && (singleLineText || shift)) {
            myself.accept();
        } else {
//             myself.target.escalateEvent('reactToKeystroke', event);
        }
    });

    // For other keyboard events, first let the textarea element handle the
    // events, then we take its state and update the target morph and cursor
    // morph accordingly.
    this.textarea.addEventListener('input', function (event) {
        myself.world().currentKey = null;

        var target = myself.target;
        var textarea = myself.textarea;
        var filteredContent;
        
        // filter invalid chars for numeric fields
        function filterText (content) {
            var points = 0;
            var result = '';
            for (var i=0; i < content.length; i++) {
                var ch = content.charAt(i);
                var valid = (
                    ('0' <= ch && ch <= '9') || // digits
                    (i === 0 && ch === '-')  || // leading '-'
                    (ch === '.' && points === 0) // at most '.'
                );
                if (valid) {
                    result += ch;
                    if (ch === '.') points++;
                }
            }
            return result;
        }
        
        if (target.isNumeric) {
            filteredContent = filterText(textarea.value);
        } else {
            filteredContent = textarea.value;
        }
        
        if (filteredContent.length < textarea.value.length) {
            textarea.value = filteredContent;
            var caret = Math.min(textarea.selectionStart, filteredContent.length);
            textarea.selectionEnd = caret;
            textarea.selectionStart = caret;
        }
        // target morph: copy the content and selection status to the target.        
        target.text = filteredContent;
        if (textarea.selectionStart === textarea.selectionEnd) {
            target.startMark = null;
            target.endMark = null;
        } else {
            if (textarea.selectionDirection === 'backward') {
                target.startMark = textarea.selectionEnd;
                target.endMark = textarea.selectionStart;
            } else {
                target.startMark = textarea.selectionStart;
                target.endMark = textarea.selectionEnd;
            }
        }
        target.changed();
        target.drawNew();
        target.changed();

        // cursor morph: copy the caret position to cursor morph.
        myself.gotoSlot(textarea.selectionStart);

        myself.updateTextAreaPosition();
        target.escalateEvent('reactToKeystroke', event);
    });
    this.textarea.addEventListener('keyup', function (event) {
        var textarea = myself.textarea;
        var target = myself.target;

        if (textarea.selectionStart === textarea.selectionEnd) {
            target.startMark = null;
            target.endMark = null;
        } else {
            if (textarea.selectionDirection === 'backward') {
                target.startMark = textarea.selectionEnd;
                target.endMark = textarea.selectionStart;
            } else {
                target.startMark = textarea.selectionStart;
                target.endMark = textarea.selectionEnd;
            }
        }
        target.changed();
        target.drawNew();
        target.changed();
        myself.gotoSlot(textarea.selectionEnd);
    });
};


CursorMorph.prototype.updateTextAreaPosition = function () {
    function number2px (n) {
        return Math.ceil(n) + 'px';
    }
    var origin = this.target.bounds.origin;
    this.textarea.style.top = number2px(origin.y);
    this.textarea.style.left = number2px(origin.x);
};

CursorMorph.prototype.syncTextareaSelectionWith = function (targetMorph) {
    var start = targetMorph.startMark;
    var end = targetMorph.endMark;

    if (start === end) {
        this.textarea.setSelectionRange(this.slot, this.slot, 'none');
    } else if (start < end) {
        this.textarea.setSelectionRange(start, end, 'forward');
    } else {
        this.textarea.setSelectionRange(end, start, 'backward');
    }
    this.textarea.focus();
};

CursorMorph.prototype.destroy = function () {
    if (this.target.alignment !== this.originalAlignment) {
        this.target.alignment = this.originalAlignment;
        this.target.drawNew();
        this.target.changed();
    }
    this.destroyTextarea();
    CursorMorph.uber.destroy.call(this);
};


CursorMorph.prototype.destroyTextarea = function () {
    document.body.removeChild(this.textarea);
    this.textarea = null;
};

StringMorph.prototype.selectAll = function () {
    var cursor;
    if (this.isEditable) {
        this.startMark = 0;
        cursor = this.root().cursor;
        this.endMark = this.text.length;
        if (cursor) {
            cursor.gotoSlot(this.text.length);
            cursor.syncTextareaSelectionWith(this);
        }
        this.drawNew();
        this.changed();
    }
};

StringMorph.prototype.shiftClick = function (pos) {
    var cursor = this.root().cursor;

    if (cursor) {
        if (!this.startMark) {
            this.startMark = cursor.slot;
        }
        cursor.gotoPos(pos);
        this.endMark = cursor.slot;
        cursor.syncTextareaSelectionWith(this);
        this.drawNew();
        this.changed();
    }
    this.currentlySelecting = false;
    this.escalateEvent('mouseDownLeft', pos);
};

StringMorph.prototype.mouseDoubleClick = function (pos) {
    // selects the word at pos
    // if there is no word, we select whatever is between
    // the previous and next words
    var slot = this.slotAt(pos);

    if (this.isEditable) {
        this.edit();

        if (slot === this.text.length) {
            slot -= 1;
        }

        if (this.text[slot] && isWordChar(this.text[slot])) {
            this.selectWordAt(slot);
        } else if (this.text[slot]) {
            this.selectBetweenWordsAt(slot);
        } else {
            // special case for when we click right after the
            // last slot in multi line TextMorphs
            this.selectAll();
        }
        this.root().cursor.syncTextareaSelectionWith(this);
    } else {
        this.escalateEvent('mouseDoubleClick', pos);
    }
};

StringMorph.prototype.enableSelecting = function () {
    this.mouseDownLeft = function (pos) {
        var crs = this.root().cursor,
            already = crs ? crs.target === this : false;
        if (this.world().currentKey === 16) {
            this.shiftClick(pos);
        } else {
            this.clearSelection();
            if (this.isEditable && (!this.isDraggable)) {
                this.edit();
                this.root().cursor.gotoPos(pos);
                this.startMark = this.slotAt(pos);
                this.endMark = this.startMark;
                this.currentlySelecting = true;
                this.root().cursor.syncTextareaSelectionWith(this);
                if (!already) {this.escalateEvent('mouseDownLeft', pos); }
            }
        }
    };
    this.mouseMove = function (pos) {
        if (this.isEditable &&
                this.currentlySelecting &&
                (!this.isDraggable)) {
            var newMark = this.slotAt(pos);
            if (newMark !== this.endMark) {
                this.endMark = newMark;
                this.root().cursor.syncTextareaSelectionWith(this);
                this.drawNew();
                this.changed();
            }
        }
    };
};

WorldMorph.prototype.edit = function (aStringOrTextMorph) {
    if (this.lastEditedText === aStringOrTextMorph) {
        return;
    }
    if (!isNil(this.lastEditedText)) {
        this.stopEditing();
    }

    var pos = getDocumentPositionOf(this.worldCanvas);

    if (!aStringOrTextMorph.isEditable) {
        return null;
    }
    if (this.cursor) {
        this.cursor.destroy();
    }
    this.cursor = new CursorMorph(aStringOrTextMorph);
    aStringOrTextMorph.parent.add(this.cursor);
    this.keyboardReceiver = this.cursor;

    this.initVirtualKeyboard();
    if (MorphicPreferences.isTouchDevice
            && MorphicPreferences.useVirtualKeyboard) {
        this.virtualKeyboard.style.top = this.cursor.top() + pos.y + "px";
        this.virtualKeyboard.style.left = this.cursor.left() + pos.x + "px";
        this.virtualKeyboard.focus();
    }

    if (MorphicPreferences.useSliderForInput) {
        if (!aStringOrTextMorph.parentThatIsA(MenuMorph)) {
            this.slide(aStringOrTextMorph);
        }
    }

    if (this.lastEditedText !== aStringOrTextMorph) {
        aStringOrTextMorph.escalateEvent('freshTextEdit', aStringOrTextMorph);
    }
    this.lastEditedText = aStringOrTextMorph;
};

// following not needed when used within modified Snap! (and it causes errors)
// document.addEventListener('DOMContentLoaded', () => {
//     // recreate the world (modified from the inline javascript file of snap.html)
//     world = new WorldMorph(document.getElementById('world'));
//     world.worldCanvas.focus();
//     new IDE_Morph().openIn(world);
//     loop();   
// });
