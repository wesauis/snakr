import {
  COLORS,
  DEFAULT_PIXEL_SIZE
} from "./config.js";
import Game from "./game.js"

// set color variavles on css
Object.keys(COLORS).forEach(key => {
  document.body.style.setProperty(`--${key}`, COLORS[key]);
});

// get box size from params
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

const $score = document.querySelector("#score span");
const $hiScore = document.querySelector("#hi span");

let hiScore = localStorage.getItem("high-score") || 0;

function updateScore(score) {
  $score.innerText = score;

  hiScore = Math.max(hiScore, score);
  $hiScore.innerText = hiScore;
  localStorage.setItem("high-score", hiScore);
}
updateScore(0);
game.addEventListener("score", event => updateScore(event.data));

/**
 * @event end-game
 * @description sets the end of the game
 */
game.addEventListener("end-game", event => {
  switch (event.data) {
    case "victory":
      document.querySelector("#win_score").innerText = $score.innerText;
      document.querySelector("#victory").classList.toggle("hidden");
      return $canvas.classList.toggle("hidden")
    case "death":
      return location.reload();
  }
})
