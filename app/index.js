import { COLORS, SIZE } from "./config.js";

// set color variavles on css
Object.keys(COLORS).forEach(key => {
  document.body.style.setProperty(`--${key}`, COLORS[key]);
});

// setup canvas
const canvas = document.querySelector("canvas#game");
const context = canvas.getContext("2d");

// resize canvas
const width = window.innerWidth - (window.innerWidth % SIZE);
const height = window.innerHeight - (window.innerHeight % SIZE);

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
canvas.width = width / SIZE;
canvas.height = height / SIZE;

// get the grid
const grid = [];
for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    grid.push({ x, y });
  }
}

// drawloop
window.requestAnimationFrame(function draw() {
  // draw grid
  grid.forEach(point => {
    if (!((point.x % 2 === 0) === (point.y % 2 === 0)))
      context.fillStyle = COLORS["mono-darker"];
    else context.fillStyle = COLORS["mono-dark"];
    context.fillRect(point.x, point.y, 1, 1);
  });

  window.requestAnimationFrame(draw);
});
