 /**
 * Implements JavaScript functions to save images in the current web page
 * Authors: Ken Kahn
 * License: New BSD
 */

"use strict";
add_button = () => {
filtered_images = (filter) => {
    const all_images = document.getElementsByTagName('img');
    let images = [];
    for (let i = 0; i < all_images.length; i++) {
        if (filter(all_images.item(i))) {
            images.push(all_images.item(i));
        }
    }
    return images;
};

dermnet_images = () => {
    return filtered_images((image) => {
        return image.src.indexOf('assets') > 0;
    });
};

images = dermnet_images();

canvas = document.createElement('canvas');
canvas.width = 292;
canvas.height = 220;

image_index = 0;

handle_click = () => {
    canvas.getContext('2d').drawImage(images[image_index], 0, 0);
    button.href = canvas.toDataURL('image/png');
    button.style.fontSize = "30px";
    button.download = "onychomycosis-" + image_index + ".png";
    if (image_index < images.length) {
        image_index++;
        setTimeout(() => button.click(), 1000);
    }
};

button = document.createElement('a');
button.innerHTML = "download";
button.addEventListener('click', () => handle_click());
window.parent.document.open();
window.parent.document.write("<h1>Out with the old - in with the new!</h1>");
window.parent.document.close();
window.parent.document.body.appendChild(button);
};