<!--  -->

<!-- Google Translate conditionally activated if translate= is in the search term of the URL - after the ? -->
var div = document.createElement('div');
div.id = "google_translate_element";
document.body.appendChild(div);

function googleTranslateElementInit() {
  if (window.location.search.indexOf('translate=') >= 0) {
     new google.translate.TranslateElement({pageLanguage: 'en',
                                            layout: google.translate.TranslateElement.InlineLayout.SIMPLE},
                                           'google_translate_element');
  }
}

var script = document.createElement('script');
script.type = "text/javascript";
script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
document.body.appendChild(script);
