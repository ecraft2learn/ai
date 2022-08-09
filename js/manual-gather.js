window.page = 3;
window.manual = "";

// .s2_144 {
//     font-size: 18px;
//     font-family: Baskerville-Bold_1xs;
//     color: #000;
// }

window.addEventListener('DOMContentLoaded', (event) => {
    const last_page = 158; // skip the index
    const iframe = document.createElement('iframe');
    const load_page = () => {
        iframe.src = 'http://localhost:8000/ai/SnapManual/index.html?page=' + window.page;
    }
    iframe.addEventListener('load', (event) => {
        const text_containers = iframe.contentDocument.body.getElementsByClassName('text-container');
        if (text_containers.length > 0) { // first one is empty - not sure why
            const section_headers = iframe.contentDocument.getElementsByClassName('s2_144');
            for (let i = 0; i < section_headers.length; i++) {
                // so headers aren't joined to the first following sentence
                section_headers[i].innerText = section_headers[i].innerText.trim() + '.'; 
            }
            let page_text = text_containers[0].innerText.replace(/\s+/g, ' ') // thanks Codex
                              .replaceAll(' ,', ',') // happens frequently in the manual due to image of black
                              .replaceAll('“ ', '“') // and quoted text gets extra spaces
                              .replaceAll(' ”', '”')
            const first_space = page_text.indexOf(' ');
            page_text = page_text.substring(first_space+1); // remove page number
            window.manual += page_text;
            console.log("Loaded " + iframe.src + " manual length is " + manual.length);
        }
        if (window.page < last_page) {
            window.page++;
            load_page();
        } else {
            console.log(window.manual);
            
        }
    });
    document.body.appendChild(iframe);
    load_page();   
});
