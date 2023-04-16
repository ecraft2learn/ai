window.addEventListener('load', () => {
    
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const settingsIcon = document.getElementById('settingsIcon');
const settingsPanel = document.getElementById('settingsPanel');

const grayIntensity = 0.01; // Define the grayIntensity variable
const colorRate = 0.1; // Set the rate at which the flower color changes when hit
const hitColor = 'rgb(255, 0, 0)'; // Set the target color when a flower is hit (in this case, red)
let intensityRate = 0.01;
let sizeRate = 0.002;
const minSize = 5; // Set the minimum size for the flowers
const maxSize = 100; // Set the maximum size for the flowers
    
function displayError(message) {
  const errorMessageElement = document.getElementById('errorMessage');
  errorMessageElement.textContent = message;
}

// Example: Add error handling to the settingsIcon click event listener
settingsIcon.addEventListener('click', () => {
  try {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
  } catch (error) {
    displayError(`Error toggling settings panel: ${error.message}`);
  }
});

const intensitySlider = document.getElementById('intensitySlider');
const sizeSlider = document.getElementById('sizeSlider');

intensitySlider.addEventListener('input', (e) => {
  intensityRate = parseFloat(e.target.value) / 500;
});

sizeSlider.addEventListener('input', (e) => {
  sizeRate = parseFloat(e.target.value) / 500;
});

class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.color = 'gray';
    this.intensity = 0;
    this.size = 1;
    this.hitCooldown = 0; // Add hitCooldown property
  }

  isHitBy(waterBalloon) {
    if (!waterBalloon) return false; // Add this line to check if waterBalloon is not null

    return (
      this.x < waterBalloon.x + waterBalloon.width &&
      this.x + this.width > waterBalloon.x &&
      this.y < waterBalloon.y + waterBalloon.height &&
      this.y + this.height > waterBalloon.y
    );
  }

  update(waterBalloon, intensity) {
    if (this.hitCooldown <= 0) {
      if (waterBalloon) {
        this.size = Math.min(maxSize, this.size + sizeRate);
        this.color = lerpColor(this.color, hitColor, colorRate);
        this.hitCooldown = 60;
      }
    } else {
      this.hitCooldown -= 1;
    }

    if (!waterBalloon) {
      this.size = Math.max(minSize, this.size - sizeRate);
      this.color = lerpColor(this.color, "gray", intensity);
    }
  }

  render() {
    const x = this.x + this.width / 2 * (1 - this.size);
    const y = this.y + this.height / 2 * (1 - this.size);
    const width = this.width * this.size;
    const height = this.height * this.size;

    // Draw petals
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 * Math.PI) / 180;
      const petalX = x + width / 2 + (width / 4) * Math.cos(angle);
      const petalY = y + height / 2 + (height / 4) * Math.sin(angle);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(petalX, petalY, width / 5, height / 5, 0, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw center circle
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, width / 6, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class WaterBalloon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.speedY = 4;
    this.color = getRandomColor();
  }

  update() {
    // Update the position of the water balloon
    this.y += this.speedY;
      // Remove the water balloon if it goes off the canvas
    if (this.y + this.height < 0) {
      waterBalloons.splice(waterBalloons.indexOf(this), 1);
    }
  }

  render() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function getRandomColor() {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function lerpColor(colorA, colorB, t) {
  const aColor = parseColor(colorA);
  const bColor = parseColor(colorB);

  const r = aColor.r + (bColor.r - aColor.r) * t;
  const g = aColor.g + (bColor.g - aColor.g) * t;
  const b = aColor.b + (bColor.b - aColor.b) * t;

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function parseColor(color) {
  if (!color) {
    return { r: 0, g: 0, b: 0 }; // Return a default color value if the input is undefined
  }

  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }
  throw new Error(`Unsupported color format: ${color}`);
}function parseColor(color) {
  if (!color) {
    return { r: 0, g: 0, b: 0 }; // Return a default color value if the input is undefined
  }

  const namedColors = {
    gray: { r: 128, g: 128, b: 128 },
    // Add more named colors here if needed
  };

  if (namedColors[color]) {
    return namedColors[color];
  }

  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }
  throw new Error(`Unsupported color format: ${color}`);
}

let flowers = [];
let waterBalloons = [];

// Create flower instances
for (let i = 0; i < 5; i++) {
  flowers.push(new Flower(100 + i * 120, canvas.height - 100));
}

canvas.addEventListener('click', (e) => {
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  waterBalloons.push(new WaterBalloon(x, y));
});

function checkCollision(balloon, flower) {
  return (
    balloon.x < flower.x + flower.width &&
    balloon.x + balloon.width > flower.x &&
    balloon.y < flower.y + flower.height &&
    balloon.y + balloon.height > flower.y
  );
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and render water balloons
  waterBalloons.forEach((waterBalloon) => {
    if (waterBalloon) {
      waterBalloon.update();
      waterBalloon.render();
    }
  });

  // Update and render flowers
  flowers.forEach((flower) => {
    const hitBalloon = waterBalloons.find((balloon, index) => {
      if (flower.isHitBy(balloon)) {
        waterBalloons[index] = null;
        return true;
      }
      return false;
    });

    flower.update(hitBalloon, grayIntensity);
    flower.render();
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();


});

