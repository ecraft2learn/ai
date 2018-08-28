// after opening a language page at http://1000mostcommonwords.com
// copy and paste this into the console for the page and then run extract()

function extract () {
    // extracts a word list from pages such as http://1000mostcommonwords.com/1000-most-common-italian-words/
    let result = "";
    let tds = document.getElementsByTagName('td');
    const letters = /^[a-z]+$/; // only lower case letters to avoid proper nouns
    // but for Chinese commented out the match and used toLowerCase()
    let output_count = 0;
    for (let i = 4; i < 3003; i += 3) { 
        // 3003 for all 1000 (except those that fail the following tests)
        // but this stops after finding 500 entries
        let english_word = tds.item(i+1).innerText;
        let other_word = tds.item(i).innerText.toLowerCase(); 
        if (english_word.match(letters) &&
            english_word.indexOf(" ") < 0 && // single word
            other_word.indexOf(" ") < 0) {
            result += other_word + " " + english_word + "\n";
            output_count++;
            if (output_count === 500) {
                break;
            }
        }    
    }
    let new_window = window.open("");
    new_window.document.body.innerText = result;
}