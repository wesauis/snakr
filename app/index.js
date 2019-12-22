import {
  COLORS,
  SIZE
} from "./config.js";
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
    grid.push({
      x,
      y
    });
  }
}

// create snake :)
const snake = Snake({
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height
});

function createFruit() {
  return {
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height)
  };
}
let fruit = undefined;

// score spans
const $hiScore = document.querySelector("#hi span");
$hiScore.innerText = localStorage.getItem("hi_score") || 0;
const $score = document.querySelector("#score span");

// drawloop
window.requestAnimationFrame(function draw() {
  if (!fruit) fruit = createFruit();

  // draw grid
  grid.forEach(point => {
    if (!((point.x % 2 === 0) === (point.y % 2 === 0)))
      context.fillStyle = COLORS["mono-darker"];
    else context.fillStyle = COLORS["mono-dark"];
    context.fillRect(point.x, point.y, 1, 1);
  });

  // draw fruit
  context.fillStyle = COLORS["primary-light"];
  context.fillRect(fruit.x, fruit.y, 1, 1);

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

let updateID;
window.addEventListener("keydown", event => {
  snake.direction = event.code;
  snake.update();
  if (updateID) clearInterval(updateID);
  updateID = setInterval(snake.update, 1000 / 5);
});

snake.addEventListener("death", () => {
  if (+$hiScore.innerText < +$score.innerText)
    localStorage.setItem("hi_score", +$score.innerText);
  location.reload();
});

snake.addEventListener("head_position", ({
  data
}) => {
  if (data.x === fruit.x && data.y === fruit.y) {
    fruit = undefined;
    snake.grow();

    $score.innerText = +$score.innerText + 1;
  }
});
