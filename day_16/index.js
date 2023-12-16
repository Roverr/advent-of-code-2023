const fs = require("fs");
const { beams } = require("./data");

const DIRECTIONS = Object.freeze({
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
});

const ELEMENT_TYPES = Object.freeze({
  VERTICAL_SPLITTER: "|",
  HORIZONTAL_SPLITTER: "-",
  RIGHT_LEANING_MIRROR: "/",
  LEFT_LEANING_MIRROR: "l", // \
  EMPTY_SPACE: ".",
});

const main = () => {
  const energizedMap = beams.map((row, i) =>
    row.split("").map((_, y) => ({ value: ".", directions: [] }))
  );
  const explore = (
    startRow = 0,
    startColumn = 0,
    startDirection = DIRECTIONS.RIGHT
  ) => {
    const route = [];
    let row = startRow;
    let column = startColumn;
    let direction = startDirection;
    let done = false;
    const continueToDirection = () => {
      switch (direction) {
        case DIRECTIONS.LEFT:
          if (column - 1 < 0) {
            done = true;
            break;
          }
          column--;
          break;
        case DIRECTIONS.RIGHT:
          if (column + 1 >= beams[row].length) {
            done = true;
            break;
          }
          column++;
          break;
        case DIRECTIONS.UP:
          if (row - 1 < 0) {
            done = true;
            break;
          }
          row--;
          break;
        case DIRECTIONS.DOWN:
          if (row + 1 >= beams.length) {
            done = true;
            break;
          }
          row++;
          break;
      }
    };
    while (!done) {
      if (energizedMap[row][column].value === "#") {
        if (energizedMap[row][column].directions.includes(direction)) {
          done = true;
          console.log("Circular detected");
          break;
        }
      } else {
        energizedMap[row][column] = { value: "#", directions: [] };
      }
      energizedMap[row][column].directions.push(direction);
      switch (beams[row][column]) {
        case ELEMENT_TYPES.VERTICAL_SPLITTER:
          if (direction !== DIRECTIONS.LEFT && direction !== DIRECTIONS.RIGHT) {
            continueToDirection();
            break;
          }
          done = true;
          if (row === 0) {
            return {
              path: route,
              moreToExplore: [
                { row: row + 1, column, direction: DIRECTIONS.DOWN },
              ],
            };
          }
          if (row === beams.length - 1) {
            return {
              path: route,
              moreToExplore: [
                { row: row - 1, column, direction: DIRECTIONS.UP },
              ],
            };
          }
          return {
            path: route,
            moreToExplore: [
              {
                row: row + 1,
                column,
                direction: DIRECTIONS.DOWN,
              },
              {
                row: row - 1,
                column,
                direction: DIRECTIONS.UP,
              },
            ],
          };
        case ELEMENT_TYPES.HORIZONTAL_SPLITTER:
          if (direction !== DIRECTIONS.UP && direction !== DIRECTIONS.DOWN) {
            continueToDirection();
            break;
          }
          done = true;
          if (column === 0) {
            return {
              path: route,
              moreToExplore: [
                { row, column: column + 1, direction: DIRECTIONS.RIGHT },
              ],
            };
          }
          if (column === beams[row].length - 1) {
            return {
              path: route,
              moreToExplore: [
                { row, column: column - 1, direction: DIRECTIONS.LEFT },
              ],
            };
          }
          return {
            path: route,
            moreToExplore: [
              {
                row,
                column: column + 1,
                direction: DIRECTIONS.RIGHT,
              },
              {
                row,
                column: column - 1,
                direction: DIRECTIONS.LEFT,
              },
            ],
          };

        case ELEMENT_TYPES.EMPTY_SPACE:
          continueToDirection();
          break;
        case ELEMENT_TYPES.LEFT_LEANING_MIRROR:
          switch (direction) {
            case DIRECTIONS.LEFT:
              if (row === 0) {
                done = true;
                return { path: route, moreToExplore: [] };
              }
              direction = DIRECTIONS.UP;
              row--;
              break;
            case DIRECTIONS.RIGHT:
              if (row + 1 >= beams.length) {
                done = true;
                return { path: route, moreToExplore: [] };
              }
              direction = DIRECTIONS.DOWN;
              row++;
              break;
            case DIRECTIONS.UP:
              if (column === 0) {
                done = true;
                return { path: route, moreToExplore: [] };
              }
              direction = DIRECTIONS.LEFT;
              column--;
              break;
            case DIRECTIONS.DOWN:
              if (column + 1 === beams[row].length) {
                done = true;
                return { path: route, moreToExplore: [] };
              }
              direction = DIRECTIONS.RIGHT;
              column++;
              break;
          }
          break;
        case ELEMENT_TYPES.RIGHT_LEANING_MIRROR:
          switch (direction) {
            case DIRECTIONS.LEFT:
              if (row + 1 >= beams.length) {
                done = true;
                return { path: route, moreToExplore: [] };
              }
              direction = DIRECTIONS.DOWN;
              row++;
              break;
            case DIRECTIONS.RIGHT:
              if (row === 0) {
                done = true;
                return { path: route, moreToExplore: [] };
              }
              direction = DIRECTIONS.UP;
              row--;
              break;
            case DIRECTIONS.UP:
              if (column + 1 === beams[row].length) {
                done = true;
                return { path: route, moreToExplore: [] };
              }
              direction = DIRECTIONS.RIGHT;
              column++;
              break;
            case DIRECTIONS.DOWN:
              if (column === 0) {
                done = true;
                return { path: route, moreToExplore: [] };
              }
              direction = DIRECTIONS.LEFT;
              column--;
              break;
          }
          break;
      }
    }
    return { path: route, moreToExplore: [] };
  };

  const paths = [];
  let needsExploration = [{ row: 0, column: 0, direction: DIRECTIONS.RIGHT }];
  while (needsExploration.length > 0) {
    const { row, column, direction } = needsExploration.pop();
    const { path, moreToExplore } = explore(row, column, direction);
    if (moreToExplore.length > 0) {
      needsExploration = needsExploration.concat(moreToExplore);
    }
    paths.push({
      row,
      column,
      direction,
      path,
    });
  }

  let sum = energizedMap.reduce((sum, row) => {
    return sum + row.filter(({ value }) => value === "#").length
  },0)
  console.log(`Part 1: ${sum}`);

  fs.writeFileSync(
    "./day_16/output",
    energizedMap.map(row => row.map(({ value }) => value).join('')).join("\n")
  );
};

main();
