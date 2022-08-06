window.page = 3;
window.manual = "";

window.addEventListener('DOMContentLoaded', (event) => {
    const last_page = 158; // skip the index
    const iframe = document.createElement('iframe');
    const load_page = () => {
        iframe.src = 'http://localhost:8000/ai/SnapManual/index.html?page=' + window.page;
    }
    iframe.addEventListener('load', (event) => {
        const text_containers = iframe.contentDocument.body.getElementsByClassName('text-container');
        if (text_containers.length > 0) { // first one is empty - not sure why
            window.manual += text_containers[0].innerText.replace(/\s+/g, ' ');  // thanks Codex
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
