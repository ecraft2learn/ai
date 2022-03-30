let sentence_index = 0;
let sentences;

const listen_for_messages = (event) => {
    if (event.data && typeof event.data.display_paragraphs !== 'undefined') {
        const next_paragraph = () => {
             const sentence = sentences[sentence_index];
             const search = IDRViewer.search(sentence, false, true, true);
             if (search.length === 0) {
                 window.parent.postMessage({no_results_for_search: sentence}, "*");
                 console.log("no results for search: ", sentence);
                 return;
             }
             const page = search[0].page;
             IDRViewer.goToPage(page);
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
        };
        IDRViewer.loadSearch(next_paragraph); // will show the first paragraph;
        sentences = event.data.display_paragraphs;
        sentence_index = 0;
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