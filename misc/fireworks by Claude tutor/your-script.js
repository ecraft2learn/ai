const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;  canvas.height = 400; 

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  
  // Draw the circle
  ctx.strokeCircle(x, y, radius); 
  
  // Increment the radius to make the circle bigger
  radius += 1; 
  
  // Use requestAnimationFrame to animate on the next repaint
  requestAnimationFrame(animate); 
}

// Start the animation
animate();