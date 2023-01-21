// Google Translate conditionally activated if translate= is in the search term of the URL - after the ?

const options = {pageLanguage: 'en'};

function setCookie(key, value, expiry) {
  var expires = new Date();
  expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
  document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function googleTranslateElementInit() {
    setCookie('googtrans', '/en/' + options.pageLanguage, 1);
    options.layout = google.translate.TranslateElement.InlineLayout.VERTICAL;
    new google.translate.TranslateElement(options, 'google_translate_element');
}

const id = "google_translate_element";

function add_translation_widget(default_language_code, add_widget_at_the_bottom) { 
    // made this globally accessible so a block can trigger it
    const existing_div = document.getElementById(id);
    if (existing_div) {
        existing_div.hidden = false;
        return;
    }
    if (default_language_code) {
        options.pageLanguage = default_language_code;
    }
    const div = document.createElement('div');
    const add_div_and_script = () => {
        if (add_widget_at_the_bottom) {
            document.body.appendChild(div);
        } else {
            document.body.insertBefore(div, document.body.firstChild);
        }
        const script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
    };
    div.id = id;
    if (document.body) {
        add_div_and_script();
    } else {
        // wait for the document to load
        document.addEventListener('DOMContentLoaded', add_div_and_script);
    }      
}

function remove_translation_widget() { 
    const existing_div = document.getElementById(id);
    if (existing_div) {
        existing_div.remove();
    }
}

if (window.location.search.indexOf('translate=1') >= 0) {
    add_translation_widget();
}
