let sentence_index = 0;
let previous_paragraph_elements = [];
let sentences;
let page_numbers;

const listen_for_messages = (event) => {
    if (event.data && typeof event.data.display_paragraphs !== 'undefined') {
        IDRViewer.loadSearch();
        sentences = event.data.display_paragraphs;
        page_numbers = event.data.page_numbers;
        sentence_index = 0;
        const next_paragraph = () => {
                    const page = page_numbers[sentence_index];
                    IDRViewer.goToPage(page);
                    if (+location.search.substring(location.search.indexOf('=')+1) === page) {
                        const sentence = sentences[sentence_index];
                        const search = IDRViewer.search(sentence, false, true, true);
                        let selected_elements;
                        const get_highlighted_elements = () => {
                                selected_elements = document.getElementById('page' + page).getElementsByClassName('highlight');
                                if (selected_elements.length === 0) {
                                    setTimeout(get_highlighted_elements, 100);
                                } else {
                                    selected_elements[0].scrollIntoView({block: "center"});
                                    sentence_index++;
                                }
                        };
                        get_highlighted_elements();   
                    } else {
                        setTimeout(next_paragraph, 100);
                    }
                };
        if (sentences.length > 0) {
            if (!document.body.getElementsByClassName('return-to-snap-button-in-guide')[0]) { // first time
                const return_to_snap = document.createElement('button');
                return_to_snap.innerHTML = "Return to Snap!";
                return_to_snap.classList.add('generic-button', 'return-to-snap-button-in-guide');
                return_to_snap.addEventListener('click',
                    () => {
                        window.parent.postMessage({returning_from_snap: true},
                                                  "*");
                });
                document.body.appendChild(return_to_snap);
                const next_paragraph_button = document.createElement('button');
                next_paragraph_button.innerHTML = "Next sentence"; 
                next_paragraph_button.classList.add('generic-button', 'next-paragraph-in-guide');
                next_paragraph_button.addEventListener('click', next_paragraph);
                document.body.appendChild(next_paragraph_button);
            }
            next_paragraph(); // do it to show the first paragraph
        } else {
            console.log("No sentences found!");
        }
    }
};

window.addEventListener('DOMContentLoaded', 
                        () => {
                            if (window.parent) {
                                window.parent.postMessage("Loaded", "*");
                            }
                            window.addEventListener("message", listen_for_messages);
                        });