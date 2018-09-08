// Responds to posted messages asking to classify a URL
// Written by Ken Kahn 
// No rights reserved.

// Notice there is no 'import' statement. 'mobilenet' and 'tf' is
// available on the index page because of the script tags.

window.addEventListener('DOMContentLoaded',
    async function () {
          // Load the model.
        let model = await mobilenet.load();
        event.source.postMessage("Ready", '*');
        window.addEventListener('message', function(event) {
            if (typeof event.data.classify !== 'undefined') {
                let image = new Image();
                image.src = event.data.classify.URL;
                image.onload = function () {
                    model.classify(image).then(predictions => {
                        event.source.postMessage(predictions, '*');
                })};
            }
        });
});


