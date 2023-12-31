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
  const explore = (
    startRow = 0,
    startColumn = 0,
    startDirection = DIRECTIONS.RIGHT,
    energizedMap
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
                return { moreToExplore: [] };
              }
              direction = DIRECTIONS.UP;
              row--;
              break;
            case DIRECTIONS.RIGHT:
              if (row + 1 >= beams.length) {
                done = true;
                return { moreToExplore: [] };
              }
              direction = DIRECTIONS.DOWN;
              row++;
              break;
            case DIRECTIONS.UP:
              if (column === 0) {
                done = true;
                return { moreToExplore: [] };
              }
              direction = DIRECTIONS.LEFT;
              column--;
              break;
            case DIRECTIONS.DOWN:
              if (column + 1 === beams[row].length) {
                done = true;
                return { moreToExplore: [] };
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
                return { moreToExplore: [] };
              }
              direction = DIRECTIONS.DOWN;
              row++;
              break;
            case DIRECTIONS.RIGHT:
              if (row === 0) {
                done = true;
                return { moreToExplore: [] };
              }
              direction = DIRECTIONS.UP;
              row--;
              break;
            case DIRECTIONS.UP:
              if (column + 1 === beams[row].length) {
                done = true;
                return { moreToExplore: [] };
              }
              direction = DIRECTIONS.RIGHT;
              column++;
              break;
            case DIRECTIONS.DOWN:
              if (column === 0) {
                done = true;
                return { moreToExplore: [] };
              }
              direction = DIRECTIONS.LEFT;
              column--;
              break;
          }
          break;
      }
    }
    return { moreToExplore: [] };
  };
  let needsExploration = [{ row: 0, column: 0, direction: DIRECTIONS.RIGHT }];
  const walkIt = (needsExploration, energizedMap) => {
    while (needsExploration.length > 0) {
      const { row, column, direction } = needsExploration.pop();
      const { moreToExplore } = explore(row, column, direction, energizedMap);
      if (moreToExplore.length > 0) {
        needsExploration = needsExploration.concat(moreToExplore);
      }
    }
    return energizedMap;
  };
  const getEnergizedMap = () =>
    beams.map((row) =>
      row.split("").map((_) => ({ value: ".", directions: [] }))
    );
  let energizedMap = getEnergizedMap();
  let sum = walkIt(needsExploration, energizedMap).reduce((sum, row) => {
    return sum + row.filter(({ value }) => value === "#").length;
  }, 0);
  console.log(`Part 1: ${sum}`);

  fs.writeFileSync(
    "./day_16/output",
    energizedMap.map((row) => row.map(({ value }) => value).join("")).join("\n")
  );

  let maxSum = sum;
  [DIRECTIONS.RIGHT, DIRECTIONS.LEFT].forEach((direction) => {
    for (let i = 0; i < beams.length; i++) {
      needsExploration = [
        {
          row: i,
          column: direction === DIRECTIONS.RIGHT ? 0 : beams[i].length - 1,
          direction: direction,
        },
      ];
      energizedMap = getEnergizedMap();
      sum = walkIt(needsExploration, energizedMap).reduce((sum, row) => {
        return sum + row.filter(({ value }) => value === "#").length;
      }, 0);
      if (sum > maxSum) {
        maxSum = sum;
      }
    }
  });
  [DIRECTIONS.UP, DIRECTIONS.DOWN].forEach((direction) => {
    for (let i = 0; i < beams[0].length; i++) {
      needsExploration = [
        {
          row: direction === DIRECTIONS.DOWN ? 0 : beams.length - 1,
          column: i,
          direction: direction,
        },
      ];
      energizedMap = getEnergizedMap();
      sum = walkIt(needsExploration, energizedMap).reduce((sum, row) => {
        return sum + row.filter(({ value }) => value === "#").length;
      }, 0);
      if (sum > maxSum) {
        console.log(sum, maxSum);
        maxSum = sum;
      }
    }
  });
  console.log(`Part 2: ${maxSum}`);
};

main();
