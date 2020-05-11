 /**
 * Responds to posted messages asking to classify a URL
 * Authors: Ken Kahn
 * License: New BSD
 */

// Notice there is no 'import' statement. 'mobilenet' and 'tf' is
// available on the index page because of the script tags.

const listen_for_messages = (event) => {
    if (document.readyState !== 'complete') {
        // too early to respond but at least the message isn't lost
        window.addEventListener('load',
                                () => {
                                   listen_for_messages(event);
                                });
        return;
    }
    if (typeof event.data.classify !== 'undefined') {
        const image_data = event.data.classify.image_data;
        // timestamp used to resp0ond appropriately to multiple outstanding requests
        let time_stamp = event.data.classify.time_stamp;
        let top_k = event.data.classify.top_k; 
        model.classify(image_data, top_k).then(predictions => {
            window.parent.postMessage({classify_response:
                                       {classifications: predictions,
                                        time_stamp}},
                                     '*');
        });
    }
};

window.addEventListener('message', listen_for_messages);

let model;

window.addEventListener('DOMContentLoaded',
    async function () {
        // Load the model and tell the spawner this is ready
        window.parent.postMessage({show_message: "Loading..."}, "*");
        model = await mobilenet.load({version: 2, alpha: 1}); 
        window.parent.postMessage("Ready", '*');
        window.parent.postMessage({show_message: "Ready",
                                   duration: 2},
                                  "*");    
});


