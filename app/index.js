import { COLORS, SIZE } from "./config.js";
import Snake from "./snake.js";

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

// create snake :)
const snake = new Snake({
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height
});

// drawloop
window.requestAnimationFrame(function draw() {
  // draw grid
  grid.forEach(point => {
    if (!((point.x % 2 === 0) === (point.y % 2 === 0)))
      context.fillStyle = COLORS["mono-darker"];
    else context.fillStyle = COLORS["mono-dark"];
    context.fillRect(point.x, point.y, 1, 1);
  });

  // draw snake
  context.fillStyle = COLORS["mono-light"];
  snake.cells.forEach((cell, index) => {
    // head
    if (index === snake.cells.length - 1)
      context.fillStyle = COLORS["primary-dark"];

    //tail
    context.fillRect(cell.x, cell.y, 1, 1);
  });

  window.requestAnimationFrame(draw);
});
