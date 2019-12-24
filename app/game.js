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

  const snake = new Snake({
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT
  });

  function render() {
    // draw grid
    context.drawImage(background, 0, 0, WIDTH, HEIGHT);

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

  return {
    render,
  }
}
