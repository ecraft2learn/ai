function style_transfer(inputCanvas, styleName, callback) {

    let style1
    let inputImg

    inputImg = new Image();
    inputImg.src = inputCanvas.toDataURL();
    var y = function() {
        if (style1.ready) {

            var outputCanvas = document.createElement('canvas')
            outputCanvas.width = 250
            outputCanvas.height = 250
            var ctx = outputCanvas.getContext('2d');
            finalImage = new Image();
            style1.transfer(inputImg, function(err, result) {
                finalImage.src = result.src
            });
            finalImage.onload = function() {

                ctx.drawImage(finalImage, 0, 0);
                callback(outputCanvas);

            }
        }

    }

    
    style1 = ml5.styleTransfer('/ai/style-transfer/models/' + styleName, y);
    

}

window.onload = function() {

    var otherCanvas = document.createElement('canvas');
    otherCanvas.width = 250;
    otherCanvas.height = 250;
    var ctx = otherCanvas.getContext('2d');
    var img = new Image();
    img.src = 'Image.jpg';
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        style_transfer(otherCanvas, "wave", function(c) {
            document.body.appendChild(c)
        })
    }
    ;

    document.body.appendChild(otherCanvas);

}
;
