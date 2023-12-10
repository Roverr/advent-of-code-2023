const { pipes } = require("./data");

const PIPE_TYPES = {
  VERTICAL: "|",
  HORIZONTAL: "-",
  NORTH_EAST: "L",
  NORTH_WEST: "J",
  SOUTH_EAST: "F",
  SOUTH_WEST: "7",
  GROUND: ".",
  START_POINT: "S",
};

const DIRECTIONS = {
  NORTH: "north",
  EAST: "east",
  SOUTH: "south",
  WEST: "west",
};

const main = () => {
  const route = [];
  const startLevel = pipes.findIndex((level) =>
    level.find((p) => p === PIPE_TYPES.START_POINT)
  );
  let columnIndex = pipes[startLevel].findIndex(
    (p) => p === PIPE_TYPES.START_POINT
  );
  if (columnIndex !== 0) columnIndex--;
  let rowIndex = startLevel;
  let isItLoop = false;
  let comingFrom = DIRECTIONS.WEST;
  while (!isItLoop) {
    const symbol = pipes[rowIndex][columnIndex];
    route.push({ rowIndex, columnIndex, symbol, comingFrom });
    switch (symbol) {
      case PIPE_TYPES.HORIZONTAL:
        if (comingFrom === DIRECTIONS.WEST) {
          columnIndex--;
        } else {
          columnIndex++;
        }
        continue;
      case PIPE_TYPES.VERTICAL:
        if (comingFrom === DIRECTIONS.NORTH) {
          rowIndex++;
        } else {
          rowIndex--;
        }
        continue;
      case PIPE_TYPES.NORTH_EAST:
        if (comingFrom === DIRECTIONS.WEST) {
          rowIndex--;
          comingFrom = DIRECTIONS.SOUTH;
        } else {
          columnIndex++;
          comingFrom = DIRECTIONS.EAST;
        }
        continue;
      case PIPE_TYPES.NORTH_WEST:
        if (comingFrom === DIRECTIONS.NORTH) {
          columnIndex--;
          comingFrom = DIRECTIONS.WEST;
        } else {
          rowIndex--;
          comingFrom = DIRECTIONS.SOUTH;
        }
        continue;
      case PIPE_TYPES.SOUTH_EAST:
        if (comingFrom === DIRECTIONS.WEST) {
          rowIndex++;
          comingFrom = DIRECTIONS.NORTH;
        } else {
          columnIndex++;
          comingFrom = DIRECTIONS.EAST;
        }
        continue;
      case PIPE_TYPES.SOUTH_WEST:
        if (comingFrom === DIRECTIONS.EAST) {
          rowIndex++;
          comingFrom = DIRECTIONS.NORTH;
        } else {
          columnIndex--;
          comingFrom = DIRECTIONS.WEST;
        }
        continue;
      case PIPE_TYPES.GROUND:
        throw new Error("SHOULD NOT BE GROUND");
      case PIPE_TYPES.START_POINT:
        isItLoop = true;
        continue;
    }
  }
  console.log(`Part 1: ${route.length / 2}`);
};

main();
