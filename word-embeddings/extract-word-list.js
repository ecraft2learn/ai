function extract () {
    // extracts a word list from pages such as http://1000mostcommonwords.com/1000-most-common-italian-words/
    let result = "";
    let tds = document.getElementsByTagName('td');
    const letters = /^[a-z]+$/; // only lower case letters to avoid proper nouns
    // but for Chinese commented out the match and used toLowerCase()
    for (let i = 4; i < 3003; i += 3) {
        if (tds.item(i+1).innerText.match(letters)) {
            result += tds.item(i).innerText + " " + tds.item(i+1).innerText + "\n";
        }
        
    }
    let new_window = window.open("");
    new_window.document.body.innerText = result;
}