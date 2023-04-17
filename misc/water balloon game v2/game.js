document.addEventListener('DOMContentLoaded', () => {
  const gameArea = document.getElementById('gameArea');

  // Initialize flowers and balloons arrays
  const flowers = [];
  const balloons = [];
  const lastHit = [];
  const flowerColors = [];

  function createFlower() {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
    flower.style.top = `${Math.random() * (gameArea.clientHeight / 2) + (gameArea.clientHeight / 2 - 50)}px`; // Update this line
    flower.style.backgroundColor = getRandomColor();
    return flower;
  }

  // Create flowers
  function createFlower() {
    const flower = document.createElement("div");
    flower.classList.add("flower");
    flower.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
    flower.style.top = `${Math.random() * (gameArea.clientHeight - 50)}px`;
    flower.style.backgroundColor = getRandomColor(); // Add this line back
    return flower;
  }
  
  for (let i = 0; i < 5; i++) {
    const flower = createFlower();
    gameArea.appendChild(flower);
    flowers.push(flower);
    lastHit.push(null);
    flowerColors.push(flower.style.backgroundColor); // Update this line
  }

  // Create a balloon when clicking the game area
    gameArea.addEventListener('click', (event) => {
      const balloon = document.createElement('div');
      balloon.classList.add('balloon');
      balloon.style.left = `${event.clientX}px`;
      balloon.style.top = '0px';
      balloon.style.backgroundColor = getRandomColor();
      gameArea.appendChild(balloon);
      balloons.push(balloon);
    
      // Initialize a separate interval for flowers to shrink and turn gray
      let flowerShrinkInterval = setInterval(() => {
        const currentTime = new Date().getTime();
      
        flowers.forEach((flower, index) => {
          if (lastHit[index] === null || currentTime - lastHit[index] > 1000) {
            const newWidth = parseInt(flower.style.width) - 1;
            const newHeight = parseInt(flower.style.height) - 1;
            flower.style.width = `${Math.max(newWidth, 0)}px`;
            flower.style.height = `${Math.max(newHeight, 0)}px`;
            flowerColors[index] = makeGray(flowerColors[index]); // Update this line
            flower.style.backgroundColor = flowerColors[index]; // Add this line
          }
        });
      }, 1000);
      
      // Animate the balloon
      let intervalId = setInterval(() => {
        balloon.style.top = `${parseInt(balloon.style.top) + 2}px`;
    
        // Check for collisions and update flower colors
        let hit = false;
        flowers.forEach((flower, index) => {
          if (hasCollision(flower, balloon)) {
            hit = true;
            // Grow the flower and intensify its color
            const newWidth = Math.min(parseInt(flower.style.width) + 10, 100); 
            const newHeight = Math.min(parseInt(flower.style.height) + 10, 100); 
            flower.style.width = `${newWidth}px`;
            flower.style.height = `${newHeight}px`;
            flowerColors[index] = intensifyColor(flowerColors[index]); // Update this line
            flower.style.backgroundColor = flowerColors[index]; // Update this line
            lastHit[index] = new Date().getTime();
          }
        });

        // Remove the balloon if it reaches the bottom or hits a flower
        if (parseInt(balloon.style.top) > gameArea.clientHeight) {
          clearInterval(intervalId);
          gameArea.removeChild(balloon);
    
          if (!hit) {
            flowers.forEach((flower, index) => {
              // Shrink the flower and make it gray
              const newWidth = parseInt(flower.style.width) - 1;
              const newHeight = parseInt(flower.style.height) - 1;
              flower.style.width = `${Math.max(newWidth, 0)}px`;
              flower.style.height = `${Math.max(newHeight, 0)}px`;
              flower.style.backgroundColor = makeGray(flower.style.backgroundColor);
            });
          }
        }
      }, 20);
    });

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function hexToRgb(hex) {
    if (!hex || hex === "null" || hex === "") return getRandomColorArray(); // Change this line
  
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0]; // Return an array of zeros for invalid colors
  }
  
  function getRandomColorArray() {
    return [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ];
  }

  function intensifyColor(color) {
    if (!color || color === "null") return getRandomColor(); // Change this line
  
    const colorArray = hexToRgb(color);
    const intensifiedColorArray = colorArray.map((value) => Math.min(value + 25, 255));
    return rgbToHex(intensifiedColorArray);
  }

  function makeGray(color) {
    if (!color || color === "null" || color === "") return getRandomColor(); // Change this line
  
    const colorArray = hexToRgb(color);
    const average = Math.floor((colorArray[0] + colorArray[1] + colorArray[2]) / 3);
    const grayColorArray = colorArray.map(() => average);
    return rgbToHex(grayColorArray);
  }

  function rgbToHex(colorArray) {
    return (
      "#" +
      colorArray
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function hasCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(
      rect1.top > rect2.bottom ||
      rect1.bottom < rect2.top ||
      rect1.right < rect2.left ||
      rect1.left > rect2.right
    );
  }
});
