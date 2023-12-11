const { galaxyMap } = require("./data");

const main = () => {
  const distances = new Map();
  for (let i = 0; i < galaxyMap.part1.uniques.length; i++) {
    for (let y = galaxyMap.part1.uniques.length - 1; y > 0; y--) {
      if (i === y) continue;
      const smaller = i > y ? y : i;
      const bigger = i > y ? i : y;

      const data = { pair: bigger, distance: -1 };
      const arr = distances.get(smaller);
      if (!arr) {
        distances.set(smaller, [data]);
        continue;
      }
      if (arr.find(({ pair }) => pair === bigger)) {
        continue;
      }
      distances.set(smaller, [...arr, data]);
    }
  }

  const part2Distances = new Map(distances);
  for (let [key, pairs] of distances) {
    const source = galaxyMap.part1.uniques.find(({ value }) => value === key);
    const distancesAdded = pairs.map(({ pair }) => {
      const target = galaxyMap.part1.uniques.find(
        ({ value }) => value === pair
      );
      return {
        pair,
        distance:
          Math.abs(source.row - target.row) +
          Math.abs(source.column - target.column),
      };
    });
    distances.set(key, distancesAdded);
  }

  let sum = 0;
  for (let pairs of distances.values()) {
    sum = sum + pairs.reduce((sum, { distance }) => sum + distance, 0);
  }
  console.log(`Part 1: ${sum}`);

  for (let [key, pairs] of part2Distances) {
    const source = galaxyMap.part2.uniques.find(({ value }) => value === key);
    const distancesAdded = pairs.map(({ pair }) => {
      const target = galaxyMap.part2.uniques.find(
        ({ value }) => value === pair
      );

      const [minRow, maxRow] = [
        source.row > target.row ? target.row : source.row,
        source.row > target.row ? source.row : target.row,
      ];
      const [minColumn, maxColumn] = [
        source.column > target.column ? target.column : source.column,
        source.column > target.column ? source.column : target.column,
      ];

      const rowsToCross = galaxyMap.part2.rowsWithoutGalaxies.filter(row => row >= minRow && row <= maxRow);
      const columnsToCross = galaxyMap.part2.columnsWithoutGalaxies.filter(column => column >= minColumn && column <= maxColumn);

      return {
        pair,
        distance:
          (Math.abs(source.row - target.row) + (999999 * rowsToCross.length)) +
          (Math.abs(source.column - target.column) + (999999 * columnsToCross.length)),
      };
    });
    part2Distances.set(key, distancesAdded);
  }
  sum = 0;
  for (let pairs of part2Distances.values()) {
    sum = sum + pairs.reduce((sum, { distance }) => sum + distance, 0);
  }
  console.log(`Part 2: ${sum}`);
};

main();
