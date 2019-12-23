import {
  COLORS,
  DEFAULT_SIZE
} from "./config.js";
import Snake from "./snake.js";

// set color variavles on css
Object.keys(COLORS).forEach(key => {
  document.body.style.setProperty(`--${key}`, COLORS[key]);
});

// get box size from params
const url = new URL(location.href);
const BOX_SIZE = url.searchParams.get("boxsize") || DEFAULT_SIZE;

// get context
const canvas = document.querySelector("canvas#game");
const context = canvas.getContext("2d");

// setup canvas
const width = window.innerWidth - (window.innerWidth % BOX_SIZE);
const height = window.innerHeight - (window.innerHeight % BOX_SIZE);
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
canvas.width = width / BOX_SIZE;
canvas.height = height / BOX_SIZE;

const game = Game({
  context
})

window.requestAnimationFrame(function render() {
  game.render();
  window.requestAnimationFrame(render)
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
  const DIRCODES = {
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right"
  }
  if (!snake.setDirection(DIRCODES[event.code])) return;
  snake.update();
  if (updateID) clearInterval(updateID);
  updateID = setInterval(snake.update, 1000 / 5);
});

snake.addEventListener("death", () => {
  const max = Math.max(+$hiScore.innerText, +$score.innerText)
  localStorage.setItem("hi_score", max);
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

snake.addEventListener("head_position", () => {
  if (snake.cells.length > grid.length * 0.92) {
    alert("YOU WIN!");
    location.reload();
  }
});
