const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const explosionSound = document.getElementById('explosionSound');
const launchSound = document.getElementById('launchSound');
let isFireworksStarted = false; // Track if fireworks have started

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y, vx, vy, color, size, lifespan) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.lifespan = lifespan;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // Apply gravity here
    this.lifespan--;
  }

  draw() {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
  }
}

const fireworks = [];

function createFireworks() {
  const numFireworks = 10; // Number of fireworks to generate

  for (let i = 0; i < numFireworks; i++) {
    const x = Math.random() * canvas.width; // Random x position
    const y = canvas.height; // Start at the bottom of the canvas
    const vx = (Math.random() - 0.5) * 2; // Random x velocity between -1 and 1
    const vy = Math.random() * -10 - 5; // Random y velocity between -5 and -15

    const firework = { x, y, vx, vy, exploded: false };
    fireworks.push(firework);
  }
  launchSound.play();
}

const particles = [];

function createExplosion(x, y) {
  for (let i = 0; i < 500; i++) {
    const angle = Math.random() * Math.PI * 2; // Random angle
    const speed = Math.random() * 3 + 1; // Random speed

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'pink', 'orange']; // Add more colors if desired
    const color = colors[Math.floor(Math.random() * colors.length)];

    const particle = new Particle(
      x,
      y,
      vx,
      vy,
      color,
      3,
      150 // Adjust the lifespan as needed
    );
    particles.push(particle);
  }
}

function animateFireworks() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (const firework of fireworks) {
    if (!firework.exploded) {
      drawFirework(firework.x, firework.y);
      firework.x += firework.vx;
      firework.y += firework.vy;
      firework.vy += 0.1; // Apply gravity here

      if (firework.vy >= 0) {
        createExplosion(firework.x, firework.y);
        firework.exploded = true;
      }
    }
  }

  for (const particle of particles) {
    particle.update();
    particle.draw();
  }

  particles.forEach((particle, index) => {
    if (particle.lifespan <= 0) {
      particles.splice(index, 1);
    }
  });

  requestAnimationFrame(animateFireworks);
}

function drawFirework(x, y) {
  const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'pink', 'orange']; // Add more colors if desired
  context.fillStyle = colors[Math.floor(Math.random() * colors.length)];
  context.beginPath();
  context.arc(x, y, 5, 0, Math.PI * 2);
  context.fill();
}

// Event listener for mouse click
document.addEventListener('click', () => {
  if (!isFireworksStarted) {
    isFireworksStarted = true;
    createFireworks();
    animateFireworks();
  }
});

// Display note and description
window.onload = () => {
  const note = document.createElement('div');
  note.innerHTML =
    'This fireworks display was made by ChatGPT 3.5. View the conversation log <a href="https://shareg.pt/pYAzaOq" target="_blank">here</a>.';
  note.style.position = 'absolute';
  note.style.top = '10px';
  note.style.left = '10px';
  note.style.color = 'white';
  note.style.fontFamily = 'Arial, sans-serif';
  note.style.fontSize = '14px';
  document.body.appendChild(note);

  const description = document.createElement('div');
  description.innerHTML =
    'This app showcases a dynamic fireworks display created using JavaScript. Interact by clicking anywhere on the page to start the fireworks. Each firework launches into the sky and explodes into a vibrant burst of colorful particles. Enjoy the show!';
  description.style.position = 'absolute';
  description.style.bottom = '10px';
  description.style.left = '10px';
  description.style.color = 'white';
  description.style.fontFamily = 'Arial, sans-serif';
  description.style.fontSize = '14px';
  description.style.width = '400px';
  document.body.appendChild(description);
};


