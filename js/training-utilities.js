 /**
 * Implements utilities shared across multiple training pages
 * Authors: Ken Kahn
 * License: New BSD
 */

 function create_training_buttons(training_class_names, train_on, train_off) {
    var info_texts = [];
    for (let i=0; i < training_class_names.length; i++) {
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.style.marginBottom = '10px';
      // Create info text next to each button
      const info_text = document.createElement('span');
      info_text.innerText = " No examples added";
      // Create training button
      const button = document.createElement('button');
      button.innerHTML = "Click to train <b>" + training_class_names[i] + "</b>";
      button.className = "training-button";
      div.appendChild(button);
      div.appendChild(info_text);
      info_texts.push(info_text);
      // Listen for mouse and touch events when clicking the button
      button.addEventListener('mousedown',  function () {
          train_on(training_class_names[i], info_text);
      });
      button.addEventListener('touchstart', function () {
          train_on(training_class_names[i], info_text);
      });
      button.addEventListener('mouseup',    function () {
          train_off(training_class_names[i], info_text);
      });
      button.addEventListener('touchend',   function () {
          train_off(training_class_names[i], info_text);
      });
    }
    return info_texts;
}