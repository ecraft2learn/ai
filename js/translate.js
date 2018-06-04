<!--  -->

<!-- Google Translate conditionally activated if translate= is in the search term of the URL - after the ? -->

function googleTranslateElementInit() {
     new google.translate.TranslateElement({pageLanguage: 'en',
                                            layout: google.translate.TranslateElement.InlineLayout.SIMPLE},
                                           'google_translate_element');
}

if (window.location.search.indexOf('translate=') >= 0) {
    var div = document.createElement('div');
    var add_div_and_script = function () {
        document.body.insertBefore(div, document.body.firstChild);
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
    }
    div.id = "google_translate_element";
    if (document.body) {
        add_div_and_script();
    } else {
        // wait for the document to load
        document.addEventListener('DOMContentLoaded', add_div_and_script);
    }  
}
