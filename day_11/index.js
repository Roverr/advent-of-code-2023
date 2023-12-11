const { galaxyMap } = require("./data");

const main = () => {
  const distances = new Map();
  for (let i = 0; i < galaxyMap.uniques.length; i++) {
    for (let y = galaxyMap.uniques.length - 1; y > 0; y--) {
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

  for (let [key, pairs] of distances) {
    const source = galaxyMap.uniques.find(({ value }) => value === key);
    const distancesAdded = pairs.map(({ pair }) => {
      const target = galaxyMap.uniques.find(({ value }) => value === pair);
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
};

main();
