const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Set the canvas size to fill the window
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

// Resize the canvas when the window is resized
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
});

class MovingObject {
  constructor(x, y, color, velocity, gravity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity;
    this.gravity = gravity;
  }

  update() {
    // Update the objects's velocity based on gravity
    this.velocity.y += this.gravity;
  
    // Update the objects's position based on velocity
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  draw(context) {
    // Save the current context state
    context.save();
  
    // Set the color of the firework
    context.fillStyle = this.color;
  
    // Draw a circle at the firework's position
    context.beginPath();
    context.arc(this.x, this.y, 2, 0, Math.PI * 2);
    context.closePath();
  
    // Fill the circle with the firework's color
    context.fill();
  
    // Restore the context state
    context.restore();
  }

}

class Firework extends MovingObject {

  explode() {
    const particles = [];
    const numParticles = 50; // Adjust this value to change the number of particles in the explosion
  
    for (let i = 0; i < numParticles; i++) {
      // Calculate random velocities for the particles to form a circular pattern
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1; // Adjust the range of speed to control the explosion size
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };
  
      // Create a new Particle instance with the firework's position, color, velocity, and gravity
      const particle = new Particle(this.x, this.y, this.color, velocity, 0.1);
  
      // Add the particle to the particles array
      particles.push(particle);
    }
  
    return particles;
  }

}

class Particle  extends MovingObject {
  constructor(x, y, color, velocity, gravity) {
    super(x, y, color, velocity, gravity); // Call the super constructor
    this.alpha = 1; // Set initial alpha to 1 (fully opaque)
  }
  draw(context) {
    context.save(); // Save the current context state
    context.globalAlpha = this.alpha; // Set the global alpha value to the particle's alpha
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, 3, 0, Math.PI * 2);
    context.fill();
    context.restore(); // Restore the context state to its previous value
  }
  update() {
    this.velocity.x *= 0.99; // Optional: Apply a slight drag to the horizontal velocity
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01; // Decrease the alpha value by 0.01 with each frame
  }

}

function playSound(src) {
  const sound = new Audio(src);
  sound.play();
}

function randomColor() {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const fireworks = [];
const particles = [];

function animate() {

  context.fillStyle = 'rgba(0, 0, 0, 1)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Create fireworks randomly
  if (Math.random() < 0.05) {
    // Create a new firework with random x position, color, and velocity
    const newFirework = new Firework(
      canvas.width * Math.random(),
      canvas.height,
      randomColor(),
      { x: 0, y: -Math.random() * 10 - 10 }, // Increase the initial velocity range
      0.1 // Decrease the gravity value
    );
    playSound('launch.wav');
    fireworks.push(newFirework);
  }

  // Update and draw fireworks, check for explosion
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw(context);

    // Check if the firework has reached its peak height
    if (fireworks[i].velocity.y >= 0) {
      // Explode the firework and add particles to the particles array
      particles.push(...fireworks[i].explode());
      playSound('explode.wav');
      // Remove the firework from the array
      fireworks.splice(i, 1);
    }
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(context);

    // Remove expired particles (based on a condition, e.g., lifespan or out of canvas)
    if (particles[i].x < 0 ||
        particles[i].x > canvas.width ||
        particles[i].y < 0 ||
        particles[i].y > canvas.height
       ) {
      particles.splice(i, 1);
    }
  }
  // Request the next animation frame
  requestAnimationFrame(animate);
}

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
  animate();
  // Remove the button from the DOM after it's clicked
  startButton.remove();
});


