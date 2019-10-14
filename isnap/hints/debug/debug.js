showDebugInfo = function(info) {

    if (localStorage) localStorage.setItem('last-info', JSON.stringify(info));

    $('#from-container').html('<pre id="debug-from">{0}</pre>'.format(
        prettyPrintNode(info.from, true)));
    $('#to-container').html('<pre id="debug-to">{0}</pre>'.format(
        prettyPrintNode(info.to, true)));

    var fromDic = {}, toDic = {};

    $('#debug-from span.node').each(function(i, span) {
        fromDic[$(span).data('id')] = span;
    });
    $('#debug-to span.node').each(function(i, span) {
        toDic[$(span).data('id')] = span;
    });

    var mapping = info.mapping.nodeMapping;
    Object.keys(mapping).forEach(function(fromID) {
        var toID = mapping[fromID];

        var fromSpan = fromDic[fromID];
        var toSpan = toDic[toID];

        $(fromSpan).addClass('paired');
        $(fromSpan).attr('data-pair-id', toID);
        $(toSpan).addClass('paired');
        $(toSpan).attr('data-pair-id', fromID);
    });

    var fromMap = {}, toMap = {};

    function addToMap(node, map) {
        map[node.id] = node;
        if (node.children) {
            node.children.forEach(function(child) {
                child.parent = node;
                addToMap(child, map);
            });
        }
    }

    addToMap(info.from, fromMap);
    addToMap(info.to, toMap);

    showHints(info.edits, fromMap, toMap);
    showCostCalculation(info, fromMap, toMap);
    showValueMapping(info);

    updateNodes();
};

showHints = function(edits, fromMap, toMap) {
    $table = $('#hints-container');
    $table.find('tr:gt(0)').remove();

    function capitalizeFirstLetter(string) {
        if (!string) return string;
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getDiff(from, to) {
        function getArray(children) {
            return '[' + children.join(', ') + ']';
        }
        return DebugDisplay.prototype.createDiff(
            getArray(from), getArray(to));
    }

    edits.forEach(function(edit) {
        $row = $('<tr>');

        var action = edit.action;
        if (action === 'insert' && edit.candidate) action = 'move';
        $row.append($('<td>').html(capitalizeFirstLetter(action)));

        var parent = fromMap[edit.parent] || toMap[edit.parent];
        if (parent) {
            $parent = $(makeNodeSpan(parent));
            $parent.addClass('paired');
            $row.append($('<td>').append($('<pre>').append($parent)));
        } else {
            $row.append($('<td>').html('Missing Parent'));
        }

        $row.append($('<td>').append(getDiff(edit.from, edit.to)));

        var nodeIDs = edit.parent;
        var using = edit.candidate || edit.node;
        if (using) {
            $using = $(makeNodeSpan(fromMap[using]));
            $using.addClass('paired');
            $row.append($('<td>').append($('<pre>').append($using)));
            nodeIDs += ' ' + using;
        } else {
            $row.append($('<td>'));
        }
        $row.data('node-ids', nodeIDs);

        $table.append($row);
    });

};

showCostCalculation = function(info, fromMap, toMap) {

    function getDiff(from, to) {
        getChildren = function(node) {
            var children = (node.children || []);
            return '[' + children.map(function(child) {
                return child.type;
            }).join(', ') + ']';
        };
        return DebugDisplay.prototype.createDiff(
            getChildren(from), getChildren(to));
    }

    $table = $('#cost-container');
    $table.find('tr:gt(0)').remove();
    info.mapping.itemizedCost.forEach(function(item) {
        var from = fromMap[item.fromID], to = toMap[item.toID];

        $row = $('<tr>');
        $row.data('node-ids', item.fromID + ' ' + item.toID);
        $row.append($('<td>').html(-item.cost));
        $row.append($('<td>').html(item.type));

        if (from != null && to != null) {
            $node = $(makeNodeSpan(from));

            $node.addClass('paired');
            $node.data('data-pair-id', item.toID);

            $row.append($('<td>').append($('<pre>')
                .append($node)));
        } else {
            $row.append($('<td>'));
        }

        var explanation;
        if (item.type === 'Match Children') {
            explanation = getDiff(from, to);
        } else {
            explanation = 'Nodes matched that were unpaired in their parents';
        }

        $row.append($('<td>').html(explanation));
        $table.append($row);
    });

    $table.append($('<tr>')
        .append($('<th>').html(-info.mapping.cost))
        .append($('<th>').html('Total Reward')));
};

showValueMapping = function(info) {
    $table = $('#values-container');
    $table.find('tr:gt(0)').remove();
    var mappings = info.mapping.valueMappings;
    Object.keys(mappings).forEach(function(type) {
        Object.keys(mappings[type]).forEach(function(key) {
            value = mappings[type][key];
            $table.append($('<tr>')
                .append($('<td>').html(type))
                .append($('<td>').html(key))
                .append($('<td>').html(value)));
        });
    });
};

makeNodeSpan = function(node) {
    function escape(string) {
        if (string == null) return '';
        return string.replace('"', '&quot;').replace(/</g, '&lt;');
    }
    return ('<span class="node {1}" data-id="{0}" data-type="{1}" ' +
                'data-value="{2}" title="{1}"></span>')
            .format(escape(node.id), escape(node.type), escape(node.value));
};

prettyPrintNode = function(node, html, indent) {
    indent = indent || 0;

    var hasBody = ['snapshot', 'stage', 'sprite', 'script', 'customBlock'];
    var inline = !hasBody.includes(node.type);
    var children = node.children;

    var out = node.type;
    if (html) {
        out = makeNodeSpan(node);
    }

    if (children && children.length > 0) {
        var i;
        if (inline) {
            out += '(';
            for (i = 0; i < children.length; i++) {
                if (i > 0) out += ', ';
                if (children[i] == null) {
                    out += 'null';
                    continue;
                }
                out += prettyPrintNode(children[i], html, indent);
            }
            out += ')';
        } else {
            out += ' {\n';
            var indentString = ''.padEnd(indent * 3, ' ');
            indent++;
            var indentMore = ''.padEnd(indent * 3, ' ');
            for (i = 0; i < children.length; i++) {
                if (children[i] == null) {
                    out += indentMore + 'null\n';
                    continue;
                }
                out += indentMore +
                    prettyPrintNode(children[i], html, indent) + '\n';
            }
            out += indentString + '}';
        }
    }
    return out;
};

updateNodes = function() {
    var useValues = $('#values-checkbox').is(':checked');
    $('.node').each(function(i, node) {
        var text = $(node).data('type');
        if (useValues) {
            var value = $(node).data('value');
            if (value) text = value;
        }
        $(node).html(text);
    });

    $('span.paired').unbind('mouseenter mouseleave').each(function(i, span) {
        var selector = 'span[data-id="{0}"], span[data-id="{1}"]'.format(
            $(span).data('id'), $(span).data('pair-id'));
        $(span).hover(function() {
            $(selector).addClass('hover');
        }, function() {
            $(selector).removeClass('hover');
        });
        // $(span).click(function() {
        //     if (window.filterID === id) window.filterID = null;
        //     else window.filterID = id;
        //     updateRows();
        // });
    });
};

updateRows = function() {
    $('tr').each(function(i, row) {
        $row = $(row);
        var ids = $row.data('node-ids');
        if (!ids) return;
        var showing = !window.filterID || ids.indexOf(window.filterID) >= 0;
        if (showing) {
            $row.removeClass('hidden');
        } else {
            $row.addClass('hidden');
        }
    });
};

(function() {
    if (localStorage) {
        var last = localStorage.getItem('last-info');
        if (last != null) showDebugInfo(JSON.parse(last));
    }

    $('#values-checkbox').change(function() {
        updateNodes();
    });
})();