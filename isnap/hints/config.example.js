
function getHintURL() {
    // Note: tomcat run on :8080 by default. It can be tempting to just use this
    // port, but many firewalls will block it. Make sure to use mod_proxy to
    // proxy :8080 to :80.
    return location.protocol + '//' + location.hostname +
        'HintServer/hints';
}

function getHintProvider() {
    var url = getHintURL();
    // After X consecutive hint dialogs, the HintDisplay can show a warning
    var hintWarning = 6;
    // Options: HintDisplay, DebugDisplay, SnapDisplay
    var displays = [new HighlightDisplay(hintWarning)];
    var reloadCode = false; // automatically reloads last code
    return new HintProvider(url, displays, reloadCode);
}
