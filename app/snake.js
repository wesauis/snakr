import {
  INITIAL_LENGHT
} from "./config.js";
import {
  EventManager
} from "./event.js";

export default function Snake(bounds) {
  // setup events
  const events = new EventManager(["death", "head_position"]);

  // create snake
  const cells = [];
  for (let i = 0; i < INITIAL_LENGHT; i++) {
    cells.push({
      x: Math.floor(bounds.width / 2),
      y: Math.floor(bounds.height / 2)
    });
  }

  // snake direction
  let direction = {
    x: 0,
    y: 0
  };

  // update positon
  function update() {
    cells.shift();
    const lastI = cells.length;

    const head = {
      x: cells[lastI - 1].x + direction.x,
      y: cells[lastI - 1].y + direction.y
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

    events.dispatch("head_position", Object.assign({}, head));
  }

  return {
    cells,
    addEventListener: events.listen,
    grow() {
      cells.splice(0, 0, {
        x: cells[0].x,
        y: cells[0].y
      });
    },
    update,
    setDir(dircode) {
      const DIRECTIONS = {
        up: {
          x: 0,
          y: -1
        },
        down: {
          x: 0,
          y: 1
        },
        left: {
          x: -1,
          y: 0
        },
        right: {
          x: 1,
          y: 0
        }
      };

      if (dircode in DIRECTIONS)
        return direction = DIRECTIONS[dircode];
      else return false;
    }
  };
}
