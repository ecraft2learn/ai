 /**
 * Implements JavaScript functions to save images in the current web page
 * Authors: Ken Kahn
 * License: New BSD
 */

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
    const full_name = images[image_index].src;
//     const short_name = images[image_index].src.substring(full_name.lastIndexOf('/')+1, full_name.indexOf('_'));
    const sibling = images[image_index].parentElement.nextElementSibling;
    let short_name;
    if (sibling) {
        short_name = sibling.textContent.trim();
    } else {
        console.log(image_index, images[image_index].src);
        short_name = images[image_index].src.substring(full_name.lastIndexOf('/')+1, full_name.indexOf('_'));
    }
    button.download =  short_name;
//     button.download = "onychomycosis-" + image_index + ".png";
    if (image_index < images.length) {
        image_index++;
        setTimeout(() => button.click(), 2000);
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