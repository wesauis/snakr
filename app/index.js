import {
  COLORS,
  DEFAULT_PIXEL_SIZE,
  INITIAL_LENGTH
} from "./config.js";
import Game from "./game.js"

// set color variables on css
Object.keys(COLORS).forEach(key => {
  document.body.style.setProperty(`--${key}`, COLORS[key]);
});

// get box size from querry params
const url = new URL(location.href);
const BOX_SIZE = url.searchParams.get("boxsize") || DEFAULT_PIXEL_SIZE;

// get context
const $canvas = document.querySelector("canvas#game");
const context = $canvas.getContext("2d");

// setup canvas
const width = window.innerWidth - (window.innerWidth % BOX_SIZE);
const height = window.innerHeight - (window.innerHeight % BOX_SIZE);
$canvas.style.width = `${width}px`;
$canvas.style.height = `${height}px`;
$canvas.width = width / BOX_SIZE;
$canvas.height = height / BOX_SIZE;

const game = Game({
  context
})

window.requestAnimationFrame(function render() {
  game.render();
  window.requestAnimationFrame(render)
});

// maximum score for the current canvas size
const MAX_SCORE = ($canvas.width * $canvas.height) - INITIAL_LENGTH;

function setScore($el, current, max) {
  $el.innerText = `${current} / ${max}`
}

const $score = document.querySelector("#score span");
const $hiScore = document.querySelector("#hi span");

// setup score counters
let hiScore = localStorage.getItem("high-score-value") || 0;
setScore($score, 0, MAX_SCORE);
setScore($hiScore, hiScore, localStorage.getItem("high-score-max") || MAX_SCORE)

game.addEventListener("score", event => {
  setScore($score, event.data, MAX_SCORE)

  if (event.data > hiScore) {
    hiScore = event.data;

    setScore($hiScore, hiScore, MAX_SCORE);
    localStorage.setItem("high-score-value", hiScore);
    localStorage.setItem("high-score-max", MAX_SCORE);
  }
});

function toggleEl($el) {
  $el.classList.toggle("hidden");
}

/**
 * @event end-game
 * @description sets the end of the game
 */
game.addEventListener("end-game", event => {
  switch (event.data) {
    case "victory":
      document.querySelector("#win_score").innerText = $score.innerText.split("/")[0];
      toggleEl(document.querySelector("#victory"));
      toggleEl($canvas);
      break;
    case "death":
      location.reload();
      break;
  }
})
