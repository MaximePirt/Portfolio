const canvas = document.getElementById("grain");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.scale(3, 3);

function generateGrain() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const value = Math.random() * 255;
    pixels[i] = value;
    pixels[i + 1] = value;
    pixels[i + 2] = value;
    pixels[i + 3] = 25;
  }
  ctx.putImageData(imageData, 0, 0);
}
let frameCount = 0;
function animateGrain() {
  frameCount++;
  if (frameCount % 20 === 0) {
    generateGrain();
  }
  requestAnimationFrame(animateGrain);
}

animateGrain();
