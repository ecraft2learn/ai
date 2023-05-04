const ctx = document.getElementById("canvas").getContext('2d');
const x = (document.getElementById("baseLayer") as HTMLElement).offsetWidth / 2; // Assuming X coordinate should be same as center of image
const y = (document.getElementById("baseLayer") as HTMLElement).offsetHeight / 2; // Assuming Y coordinate should be same as center of image

function showFireworks(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear entire canvas before drawing new shape

    // Drawing firework shape to canvas
    drawFirework(x,y);
    await new Promise(resolve => setTimeout(()=> {
        resolve();
    }, Math.random()*2000));
    addBursts();
}

async function addBursts(){
    for(let i = 0; i <= 10; i++){
        await new Promise((resolve) => setTimeout(() => {
                drawLineToRandPoint(x, y, Math.floor(Math.random() * (10 + i - 1))); // Each line is slightly shorter than previous one
                setTimeout(() => resolve(), Math.random() * 100); // Wait some time between bursts
                }, 500)); // Wait random amount between adding burst lines but less than total delay
        }
    }

    function drawFirework(startX, startY){
        ctx.beginPath();
        // Move to starting point (center of firework where trail starts from)
        ctx.moveTo(startX, startY);
        // Draw trail first and then close off trails
        drawTrail(100,2); // This is how many trails you want and their thickness in pixels
        ctx.strokeStyle = 'blue';
        ctx.stroke();
    }

    function drawLineToRandPoint(startX, startY, lengthOfEach){
        ctx.beginPath();
        if (lengthOfEach == 1 && Math.floor(Math.random()) !== 0){
            return;
        }
        ctx.fillStyle="#fff";
        ctx.globalAlpha=0.5;
        ctx.moveTo(startX+Math.floor(Math.random()*lengthOfEach), startY+Math.floor(Math.random()*lengthOfEach));
        ctx.lineTo(startX+(Math.floor(Math.random()*lengthOfEach)-1)+1, startY+(Math.floor(Math.random()*lengthOfEach))-1);
        ctx.fillRect(startX+Math.floor(Math.random()*lengthOfEach)+5, startY+Math.floor(Math.random()*lengthOfEach)+5, 10 , 10 );
        ctx.stroke();
    }
    
    // This function adds a randomly chosen number of trails to the firework shape
    function drawTrail(numberOfLines, size){
      ctx.save();
      for (let j = 0; j < numberOfLines;j++){
          let x, y;
          for(i=0; i<=50;i+=size){
              x=(document.getElementById("baseLayer").getBoundingClientRect().left + parseInt(document.getElementById("baseLayer").style.width/2 - Math.cos(startAngle)*size/4));
              y=startY+startHeight;
              ctx.clearRect(i, 0, size/2, 10);
              ctx.beginPath();
              ctx.arc(x,y,2,"0 "+(i%2*(180/Math.PI)),false);
              ctx.fill();
          }
          startAngle += (6.29);
      }
      ctx.restore();
      return ctx;
  }                                                                                                                   
                                                                                                                        
                                                                                                                        async function addSoundEffect(){
setInterval(() => playSound(), Math.random() * 3000);
}

async function endAnimation(){
window.close();
}

window.addEventListener("keydown", handleKeyDownEvent);
window.addEventListener("wheel", handleWheelEvent);

playSound();
drawFirework();
waitForRandomTimeThenDrawFirework();
await wait();if (startAngle < 360 && !ctx.isPointInTriangle(startX, startY, currentX, currentY, endX, endY)) {
    await wait();
}