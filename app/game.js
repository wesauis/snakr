import {
  COLORS,
  CONTROLS,
  UPDATE_INTERVAL
} from "./config.js";

import Snake from "./snake.js";
import {
  EventManager
} from "./event.js";

/**
 * @function generateBackground
 * @param number WIDTH 
 * @param number HEIGHT 
 * @description generates the background of the game
 * @returns HTMLImageElement
 */
function generateBackground(WIDTH, HEIGHT) {
  // create the canvas
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");

  // draw the background
  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      if (!((x % 2 === 0) === (y % 2 === 0))) {
        context.fillStyle = COLORS["mono-darker"];
      } else {
        context.fillStyle = COLORS["mono-dark"];
      }
      context.fillRect(x, y, 1, 1);
    }
  }

  // convert the canvas into a image and return
  const gridImage = new Image();
  gridImage.src = canvas.toDataURL();
  return gridImage;
}

export default ({
  context,
}) => {
  const WIDTH = context.canvas.width;
  const HEIGHT = context.canvas.height;
  const background = generateBackground(WIDTH, HEIGHT);

  const events = new EventManager(["score", "end-game"]);

  let score = 0;

  let fruit;
  const snake = new Snake({
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT
  });

  /**
   * @event head_position
   */
  snake.addEventListener("head_position", ({
    data
  }) => {
    if (!fruit) return;
    if (data.x === fruit.x && data.y === fruit.y) {
      fruit = undefined;
      snake.grow();

      events.dispatch("score", ++score);
    }
  });

  /**
   * @function render
   * @description render the screen, the points and the character
   * @returns void
   */
  function render() {
    // if fruit was eaten, create a new one
    if (!fruit) fruit = {
      x: Math.floor(Math.random() * WIDTH),
      y: Math.floor(Math.random() * HEIGHT)
    };

    // draw grid
    context.drawImage(background, 0, 0, WIDTH, HEIGHT);

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
  }

  let updateID;
  window.addEventListener("keydown", event => {
    if (!(event.code in CONTROLS)) return

    // update direction
    snake.setDir(CONTROLS[event.code]);
    snake.update();

    // reset the interval
    if (updateID) clearInterval(updateID);
    updateID = setInterval(snake.update, UPDATE_INTERVAL);
  });

  snake.addEventListener("head_position", () => {
    if (snake.cells.length >= WIDTH * HEIGHT) {
      events.dispatch("end-game", "victory")
      clearInterval(updateID);
    }
  });

  /**
   * @event death
   * @description end the game if the player dead
   */
  snake.addEventListener("death", () => events.dispatch("end-game", "death"));

  return {
    addEventListener: events.listen,
    render,
  }
}
