let flower1 = document.querySelector('.flower-1');
let flower2 = document.querySelector('.flower-2');  
let flower3 = document.querySelector('.flower-3');
let flowers = document.querySelectorAll('.flower');
let balloons = [];
function dropBalloon() {
  let balloon = document.createElement('div');
  balloon.classList.add('balloon');
  balloon.style.backgroundColor = randomColor();
  balloon.style.left = prompt('Enter balloon start position from 0 to 550: ') + 'px'; 
  /* Player enters position */
  balloon.style.top = 0;                      
  /* Balloon starts at top */
  document.querySelector('.game-area').append(balloon);
  balloons.push(balloon);
  moveBalloon(balloon);
}
function moveBalloon(balloon) {
  let position = 0; 
  let id = setInterval(frame, 10);
  function frame() {
    if (position == 400) {
      clearInterval(id);
      checkCollision(balloon);
    } else {
      position++;  
      balloon.style.top = position + 'px';
    }
  }
}
function randomColor() {
  let colors = ['blue', 'yellow', 'pink'];
  let color = colors[Math.floor(Math.random() * colors.length)];
  return color;
}  
function randomPosition() {
  return Math.floor(Math.random() * 500); 
} 
function checkCollision(balloon) { 
  flowers.forEach(flower => {
    if (balloon.style.left > flower.style.left - 50 &&  
        balloon.style.left < flower.style.left + 50 &&
        balloon.style.top > flower.style.top - 50 &&  
        balloon.style.top < flower.style.top + 50) {  
      flower.style.backgroundColor = balloon.style.backgroundColor; 
    }
  });
}
setInterval(function() { 
  flowers.forEach(flower => {
    if (!flower.style.backgroundColor) {
      flower.style.opacity -= 0.1; 
    }
  });
}, 1000); 