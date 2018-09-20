window.addEventListener('load', function() {
    window.parent.postMessage("Ready", "*");   
});

const WIDTH  = 250;
const HEIGHT = 250;

const transfer_style = function(input_URL, style_name, callback) {
    let style_transfer;
    let input_image_250by250;
    let input_image = new Image();
    let temp_canvas = document.createElement('canvas')
    temp_canvas.width  = WIDTH;
    temp_canvas.height = HEIGHT;
    input_image.src = input_URL;
    input_image.onload = function() {
        temp_canvas.getContext('2d').drawImage(input_image, 0, 0, WIDTH, HEIGHT);
        const do_transfer = function() {
            input_image_250by250 = new Image();
            input_image_250by250.src = temp_canvas.toDataURL();
            input_image_250by250.onload = function() {
                let output_canvas = document.createElement('canvas')
                output_canvas.width  = WIDTH;
                output_canvas.height = HEIGHT;
                let final_image = new Image();
                style_transfer.transfer(input_image_250by250, function(error, result) {
                    if (error) {
                        throw error;
                    }
                    final_image.src = result.src;
                });
                final_image.onload = function() {
                    output_canvas.getContext('2d').drawImage(final_image, 0, 0, WIDTH, HEIGHT);
                    callback(output_canvas);
                };
            }
        };
        style_transfer = ml5.styleTransfer('/ai/style-transfer/models/' + style_name.trim(), do_transfer);
    };
}

window.addEventListener('message', function(event) {
    if (typeof event.data.style_transfer_request !== 'undefined') {
        transfer_style(event.data.style_transfer_request.URL,
                       event.data.style_transfer_request.style,
                       function(canvas) {
                           event.source.postMessage({style_transfer_response: 
                                                        {URL: canvas.toDataURL(),
                                                         time_stamp: event.data.style_transfer_request.time_stamp}},
                                                    '*');
                       });
    }
});
