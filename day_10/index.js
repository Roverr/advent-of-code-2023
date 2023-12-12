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
  let rowIndex = startLevel;
  let comingFrom = DIRECTIONS.WEST;
  if (
    columnIndex !== 0 &&
    [
      PIPE_TYPES.HORIZONTAL,
      PIPE_TYPES.NORTH_EAST,
      PIPE_TYPES.SOUTH_EAST,
    ].includes(pipes[rowIndex][columnIndex - 1])
  ) {
    columnIndex--;
  } else {
    if (
      rowIndex !== 0 &&
      [
        PIPE_TYPES.VERTICAL,
        PIPE_TYPES.SOUTH_EAST,
        PIPE_TYPES.SOUTH_WEST,
      ].includes(pipes[rowIndex - 1][columnIndex])
    ) {
      rowIndex--;
      comingFrom = DIRECTIONS.SOUTH;
    } else {
      rowIndex++;
      comingFrom = DIRECTIONS.NORTH;
    }
  }
  const originalComingFrom = comingFrom;
  let isItLoop = false;
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

  const { minRow, minColumn, maxRow, maxColumn } = route.reduce(
    (result, { rowIndex, columnIndex }) => {
      if (result.minRow === -1 || result.minRow > rowIndex) {
        result.minRow = rowIndex;
      }
      if (result.minColumn === -1 || result.minColumn > columnIndex) {
        result.minColumn = columnIndex;
      }
      if (result.maxRow === -1 || result.maxRow < rowIndex) {
        result.maxRow = rowIndex;
      }
      if (result.maxColumn === -1 || result.maxColumn < columnIndex) {
        result.maxColumn = columnIndex;
      }
      return result;
    },
    { minRow: -1, minColumn: -1, maxRow: -1, maxColumn: -1 }
  );

  const simplifiedMap = pipes.map((level, i) => {
    return level.map((_, y) => {
      const mapElement = route.find(
        ({ rowIndex, columnIndex }) => rowIndex === i && columnIndex === y
      );
      if (!mapElement) {
        return ".";
      }
      switch (mapElement.symbol) {
        case PIPE_TYPES.HORIZONTAL:
          return "H";
        case PIPE_TYPES.VERTICAL:
          return "V";
        case PIPE_TYPES.NORTH_EAST:
        case PIPE_TYPES.NORTH_WEST:
        case PIPE_TYPES.SOUTH_EAST:
        case PIPE_TYPES.SOUTH_WEST:
          return "C";
        case PIPE_TYPES.START_POINT:
          if (originalComingFrom === DIRECTIONS.WEST) {
            if ([DIRECTIONS.SOUTH, DIRECTIONS.NORTH].includes(comingFrom)) {
              return "C";
            }
            return "H";
          }
          if ([DIRECTIONS.SOUTH, DIRECTIONS.NORTH].includes(originalComingFrom)) {
            if ([DIRECTIONS.EAST, DIRECTIONS.WEST].includes(comingFrom)) {
              return "C";
            }
            return "V";
          }
          return "S";
      }
    });
  });

  const isCornered = (rowIndex, columnIndex) => {
    let passes = true;
    let count = 0;
    let cStepper = 0;
    let cSymbol = PIPE_TYPES.NORTH_EAST;
    if (rowIndex > 0 && columnIndex > 0 && rowIndex < maxRow && columnIndex < maxColumn) {
      for (let i = rowIndex - 1; i >= 0; i--) {
        if (["H"].includes(simplifiedMap[i][columnIndex])) {
          count++;
          continue;
        }
        if (["C"].includes(simplifiedMap[i][columnIndex])) {
          if (cStepper === 0) {
            cSymbol = pipes[i][columnIndex];
            cStepper = 1;
            continue;
          }
          cStepper = 0;
          if (columnIndex === 0 || rowIndex === 0) {
            continue;
          }
          if (cSymbol === PIPE_TYPES.NORTH_EAST) {
            if (pipes[i][columnIndex] === PIPE_TYPES.SOUTH_EAST) {
              continue;
            }
          } else {
            if (pipes[i][columnIndex] === PIPE_TYPES.SOUTH_WEST) {
              continue;
            }
          }
          count++;
          continue;
        }
      }
      if (count % 2 !== 1) passes = false;
    } else {
      return false;
    }
    return passes;
  };

  const corneredPointsSum = simplifiedMap.reduce((sum, level, i) => {
    let countOfCorneredOnLevel = 0;
    if (i < minRow) return sum;
    if (i > maxRow) return sum;
    for (let y = 0; y < level.length; y++) {
      if (y < minColumn) continue;
      if (y > maxColumn) continue;
      if (level[y] !== ".") continue;
      if (isCornered(i, y)) {
        countOfCorneredOnLevel++;
      }
    }
    return sum + countOfCorneredOnLevel;
  }, 0);

  console.log(`Part 2: ${corneredPointsSum}`);
};

main();
