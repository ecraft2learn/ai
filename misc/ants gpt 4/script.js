function Ant() {
    this.x = Math.random() * window.innerWidth; // random x position
    this.y = Math.random() * window.innerHeight; // random y position

    // Random velocities for the x and y directions
    this.vx = (Math.random() - 0.5) * 20;
    this.vy = (Math.random() - 0.5) * 20;

    // More properties and methods can be added later
}

// Let's create an array to hold our ants
var ants = [];

// Now we'll create 10 ants
for (var i = 0; i < 10; i++) {
    var newAnt = new Ant();
    ants.push(newAnt);

    // Create an SVG element for the ant
    var antElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    antElement.setAttribute('viewBox', '0 0 40 50');
    antElement.setAttribute('width', '20');
    antElement.setAttribute('height', '25');
    antElement.style.position = 'absolute';
    antElement.style.left = newAnt.x + 'px';
    antElement.style.top = newAnt.y + 'px';
    antElement.style.transformOrigin = 'center';

    // Set the innerHTML of the SVG element to the ant shape
    antElement.innerHTML = `
        <ellipse cx="20" cy="10" rx="8" ry="10" style="fill:black" />
        <ellipse cx="20" cy="25" rx="10" ry="12" style="fill:black" />
        <ellipse cx="20" cy="40" rx="8" ry="10" style="fill:black" />
    `;

    // Add the SVG element to the page
    document.getElementById('ant-colony').appendChild(antElement);
}

function updateAnts() {
    for (var i = 0; i < ants.length; i++) {
        var ant = ants[i];

        // Update position
        ant.x += ant.vx;
        ant.y += ant.vy;

        // If the ant hits the edge of the window, reverse direction
        if (ant.x < 0 || ant.x > window.innerWidth) {
            ant.vx = -ant.vx;
        }
        if (ant.y < 0 || ant.y > window.innerHeight) {
            ant.vy = -ant.vy;
        }

        // Calculate the angle of the ant's velocity vector
        var angle = Math.atan2(ant.vy, ant.vx) + Math.PI / 2;

        // Update the position and rotation of the ant's element
        var antElement = document.getElementById('ant-colony').children[i];
        antElement.style.left = ant.x + 'px';
        antElement.style.top = ant.y + 'px';
        antElement.style.transform = 'rotate(' + angle + 'rad)';
    }
}

setInterval(updateAnts, 100);



