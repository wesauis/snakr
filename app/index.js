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

