require('hint-display');
require('../isnap/lib/simplediff.min');

// DebugDisplay: outputs hints to a div

function DebugDisplay() {
    var myself = this;
    this.savedHints = {};

    var outer = document.createElement('div');
    outer.classList.add('debug');
    this.outer = outer;

    var showButton = document.createElement('button');
    showButton.classList.add('debugToggle');
    showButton.innerHTML = 'Hide';
    var hidden = false;
    showButton.onclick = outer.ondblclick = function() {
        hidden = !hidden;
        if (hidden) {
            outer.classList.add('hidden');
        } else {
            outer.classList.remove('hidden');
        }
        showButton.innerHTML = hidden ? 'Show' : 'Hide';
    };
    outer.appendChild(showButton);

    var moreButton = document.createElement('button');
    moreButton.classList.add('debugToggle');
    moreButton.innerHTML = 'More';
    moreButton.onclick = function() {
        myself.window = window.open('hints/debug/index.html',
            null, null, true);
        myself.window.onload = function() {
            myself.showDebugInfo(myself.lastDebugInfo);
        };
    };
    outer.appendChild(moreButton);

    this.div = document.createElement('div');
    outer.appendChild(this.div);
}

DebugDisplay.prototype = Object.create(HintDisplay.prototype);

DebugDisplay.prototype.show = function() {
    document.body.appendChild(this.outer);
};

DebugDisplay.prototype.hide = function() {
    document.body.removeChild(this.outer);
};

DebugDisplay.prototype.getHintType = function() {
    return 'debug';
};

DebugDisplay.prototype.showDebugInfo = function(info) {
    if (!info) return;
    if (this.window) this.window.showDebugInfo(info);
    this.lastDebugInfo = info;
};

DebugDisplay.prototype.showHint = function(hint) {
    // var myself = this;
    // var code = Trace.lastCode;

    var hintDiv = document.createElement('div');
    if (hint.data.caution || hint.ignored) {
        hintDiv.innerHTML += '*';
    }
    hintDiv.innerHTML += this.createDiff(hint.from, hint.to) + ' ';
    if (hint.data && hint.data.goal) {
        hintDiv.innerHTML += ' <code style="color: #333">| G:[' +
                hint.data.goal.join(', ') + ']</code> ';
    }

    // var hintSaved = this.savedHints[this.savedHintKey(hint, code)];

    // var texts = ['Good', 'Bad'];
    // var links = [];
    // for (var i = 0; i < texts.length; i++) {
    //     var link = document.createElement('a');
    //     link.innerHTML = '<small>' +
    //         (hintSaved ? '[' + hintSaved + ']' : texts[i]) + '</small>';
    //     link.href = '#';
    //     links.push(link);
    //     var space = document.createElement('span');
    //     space.innerHTML = ' ';
    //     hintDiv.appendChild(space);
    //     hintDiv.appendChild(link);
    //     if (!hintSaved) {
    //         (function (fi) {
    //             link.onclick = function(e) {
    //                 myself.saveHint(hint, code, links, fi == 0);
    //                 e.preventDefault();
    //             };
    //         })(i);
    //     }
    // }

    this.div.appendChild(hintDiv);
};

DebugDisplay.prototype.savedHintKey = function(hint, code) {
    return JSON.stringify(hint);
};

DebugDisplay.prototype.saveHint = function(hint, code, links, good) {
    var myself = this;

    if (!good) {
        hint = JSON.parse(JSON.stringify(hint));
        hint.data.badHint = true;
        hint.data.expectedFailure = true;
    }

    var xhr = createCORSRequest('POST',
        window.hintProvider.url + '?assignmentID=' + Assignment.getID() +
        '&hint=' + encodeURIComponent(JSON.stringify(hint, null, '\t')));

    if (!xhr) {
        myself.showError('CORS not supported on this browser.');
        return;
    }

    xhr.onload = function() {
        var id = xhr.responseText;
        links.forEach(function(link) {
            link.onclick = null;
            link.innerHTML = '<small>[' + id + ']</small>';
        });
        myself.savedHints[myself.savedHintKey(hint, code)] = id;
    };

    xhr.onerror = function(e) {
        myself.showError('Error contacting hint server!');
    };

    xhr.send(code);
};

DebugDisplay.prototype.showError = function(error) {
    if (error.message) error = error.message;
    this.div.innerHTML = error;
};

DebugDisplay.prototype.clear = function() {
    this.div.innerHTML =
        '<b>Debug Console</b>: Press "More" for more information.<hr />';
};

DebugDisplay.prototype.createDiff = function(from, to) {
    var cssMap = {
        '+': 'plus',
        '=': 'equals',
        '-': 'minus',
    };
    var matchRegex = /{|}|:|\[|\]|,|\s|%|->|\w*/g;
    var code0 = from.match(matchRegex);
    var code1 = to.match(matchRegex);
    var codeDiff = window.diff(code0, code1);
    var html = '<span class="hint">';
    for (var j = 0; j < codeDiff.length; j++) {
        var block = cssMap[codeDiff[j][0]];
        var code = codeDiff[j][1].join('');
        html += '<code class={0}>{1}</code>'.format(block, code);
    }
    html += '</span>';
    return html;
};