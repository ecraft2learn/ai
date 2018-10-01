// Responds to posted messages asking to classify a URL
// Written by Ken Kahn 
// No rights reserved.

// Notice there is no 'import' statement. 'mobilenet' and 'tf' is
// available on the index page because of the script tags.

window.addEventListener('DOMContentLoaded',
    async function () {
        // Load the model and tell the spawner this is ready
        window.parent.postMessage({show_message: "Loading..."}, "*");
        let model = await mobilenet.load();
        window.parent.postMessage("Ready", '*');
        window.parent.postMessage({show_message: "Ready",
                                   duration: 2},
                                  "*");
        window.addEventListener('message', function(event) {
            if (typeof event.data.classify !== 'undefined') {
                let image = new Image();
                image.src = event.data.classify.URL;
                // timestamp used to resp0ond appropriately to multiple outstanding requests
                let time_stamp = event.data.classify.time_stamp;
                let top_k = event.data.classify.top_k; 
                image.onload = function () {
                    model.classify(image, top_k).then(predictions => {
                        window.parent.postMessage({classify_response:
                                                       {classifications: predictions,
                                                        time_stamp: time_stamp}},
                                                  '*');
                })};
            }
        });
});


