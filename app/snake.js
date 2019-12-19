import { INITIAL_LENGHT } from "./config.js";
import { EventManager } from "./event.js";

export default function Snake(bounds) {
  // create snake
  const cells = [];
  for (let i = 0; i < INITIAL_LENGHT; i++) {
    cells.push({
      x: Math.floor(bounds.width / 2),
      y: Math.floor(bounds.height / 2)
    });
  }

  // snake direction
  let _direction = { x: 0, y: 0 };

  // update positon
  function update() {
    cells.shift();
    const lastI = cells.length;

    const head = {
      x: cells[lastI - 1].x + _direction.x,
      y: cells[lastI - 1].y + _direction.y
    };

    if (head.x < bounds.x) head.x = bounds.width - 1;
    if (head.y < bounds.y) head.y = bounds.height - 1;
    if (head.x >= bounds.width) head.x = bounds.x;
    if (head.y >= bounds.height) head.y = bounds.y;

    cells.push(head);


    cells.forEach((cell, index) => {
      if (index === lastI) return;

      if (cell.x === head.x && cell.y === head.y) events.dispatch("death");
    });
  };

  return {
    cells,
    grow() {
      cells.splice(0, 0, { x: cells[0].x, y: cells[0].y });
    },
    update,
    set direction(directioName) {
      const DIRECTIONS = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
      };
      const direction = DIRECTIONS[directioName];
      if (direction) _direction = direction;
    },
  }
}
