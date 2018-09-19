// after opening a language page at http://1000mostcommonwords.com
// copy and paste this into the console for the page and then run extract()

// following was very poor quality for Chinese
function extract (language_code) {
    // extracts a word list from pages such as http://1000mostcommonwords.com/1000-most-common-italian-words/
    let result = "";
    let tds = document.getElementsByTagName('td');
    const letters = /^[a-z]+$/; // only lower case letters to avoid proper nouns
    let output_count = 0;
    let english_words_already_used = [];
    for (let i = 4; i < 3003; i += 3) { 
        // 3003 for all 1000 (except those that fail the following tests)
        // but this stops after finding 500 entries
        let english_word = tds.item(i+1).innerText;
        let other_word = tds.item(i).innerText.toLowerCase();
        if (((language_code === 'zh' && english_word.substring(1).match(letters)) || english_word.match(letters)) &&
            // Chinese entries are all capitalised
            english_word.indexOf(" ") < 0 && // single word
            other_word.indexOf(" ") < 0) {
            english_word = english_word.toLowerCase();
            if (english_words_already_used.indexOf(english_word) < 0) {
                english_words_already_used.push(english_word);
                result += other_word + " " + english_word + "\n";
                output_count++;
                if (output_count === 500) {
                    break;
                }          
            } 
        }    
    }
    let new_window = window.open("");
    new_window.document.body.innerText = result;
}

// or used this:

function wiki_dictionary (language_code) {
    // extracts a word list from pages such as https://en.wiktionary.org/wiki/Appendix:Mandarin_Frequency_lists/1-1000
    let result = "";
    let elements = document.getElementsByTagName('li');
    const letters = /^[a-z]+$/; // only lower case letters to avoid proper nouns
    let output_count = 0;
    let english_words_already_used = [];
    for (let i = 0; i < 1000; i++) { 
        let text = elements.item(i).innerText;
        if (text.indexOf(',') < 0) {
            // seems sometimes there isn't quite 1000 entries
            // and list items can occur at the end -- e.g. "Talk".
            break;
        }
        // innerText starts with word and ends with comma 
        // and first translation is after ") - " and if there are multiple ones ends with a comma 
        let other_word = text.substring(0, text.indexOf(','));
        const string_before_english = ') - ';
        let translations = text.substring(text.indexOf(string_before_english)+string_before_english.length);
        let open = translations.indexOf('('); 
        while (open >= 0) {
            let close = translations.indexOf(')');
            let without_parentheses = translations.substring(0, open);
            if (close > 0) {
                without_parentheses += translations.substring(close+1);
            }
            translations = without_parentheses;
            open = translations.indexOf('(');
        }
        let find_next_translation = function (word) {
            let remaining_translations = word ? translations.substring(translations.lastIndexOf(word)+word.length) : translations;
            if (remaining_translations.length === 0) {
                return;
            }
            if (remaining_translations[0] === ',') {
                remaining_translations = remaining_translations.substring(1);
            }
            if (remaining_translations.indexOf(',') > 0) {
                return remaining_translations.substring(0, remaining_translations.indexOf(',')).trim();
            } else if (remaining_translations.indexOf(':') > 0) {
                // e.g. det: or conj: then ignore it
                return remaining_translations.substring(remaining_translations.indexOf(':')+2).trim();      
            }
            return remaining_translations;
        };
        // if there isn't a next translation then translations is the only translation.
        let english_word = find_next_translation() || translations;
        while (typeof words_to_locations['en'][english_word] === 'undefined') {
            let subsequent_english_word = find_next_translation(english_word);
            if (!subsequent_english_word) {
                english_word = undefined; // none of the translation are "known"
                break; // from this while loop
            }
            english_word = subsequent_english_word;
        }
        if (english_word &&
            words_to_locations['en'][english_word] &&
            english_word.match(letters) &&
            english_word.indexOf(" ") < 0 && // single word
            other_word.indexOf(" ") < 0) {
            english_word = english_word.toLowerCase();
            if (english_words_already_used.indexOf(english_word) < 0) {
                english_words_already_used.push(english_word);
                result += other_word + " " + english_word + "\n";
                output_count++;
                if (output_count === 500) {
                    break;
                }          
            } 
        }    
    }
    let new_window = window.open("");
    new_window.document.body.innerText = result;    
}
let script = document.createElement('script');
script.onload = function () {
    wiki_dictionary('zh');
};
// any script with the list of English words
script.src = "../en/word-locations.js";
document.body.appendChild(script);