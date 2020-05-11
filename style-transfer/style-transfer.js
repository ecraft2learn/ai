window.addEventListener('load', function() {
    window.parent.postMessage("Ready", "*");   
});

// seems ml5.styleTransfer expects images that are 252x252
const WIDTH  = 252;
const HEIGHT = 252;

const transfer_style = function(image_data, style_name, callback) {
    let style_transfer;
    let input_image_252by252;
    let input_canvas = document.createElement('canvas')
    input_canvas.width  = WIDTH;
    input_canvas.height = HEIGHT;
    input_canvas.getContext('2d').putImageData(image_data, 0, 0);
    const do_transfer = () => {
        input_image_252by252 = new Image();
        input_image_252by252.src = input_canvas.toDataURL();
        input_image_252by252.onload = () => {
            let output_canvas = document.createElement('canvas')
            output_canvas.width  = WIDTH;
            output_canvas.height = HEIGHT;
            style_transfer.transfer(input_image_252by252, function(error, result) {
                if (error) {
                    throw error;
                }
                output_canvas.getContext('2d').drawImage(result, 0, 0, WIDTH, HEIGHT);
                callback(output_canvas);
            });
        }
    };
    style_transfer = ml5.styleTransfer('/ai/style-transfer/models/' + style_name.trim(), do_transfer);
};

const get_image_data = (canvas) => canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

window.addEventListener('message', function(event) {
    if (typeof event.data.style_transfer_request !== 'undefined') {
        transfer_style(event.data.style_transfer_request.image_data,
                       event.data.style_transfer_request.style,
                       function(canvas) {
                           event.source.postMessage({style_transfer_response: 
                                                        {image_data: get_image_data(canvas),
                                                         time_stamp: event.data.style_transfer_request.time_stamp}},
                                                    '*');
                       });
    }
});
