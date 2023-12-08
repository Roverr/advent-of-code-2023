const { map } = require("./data");

const main = () => {
  let destination = 'AAA';
  let steps = 0;
  do {
    for (let letter of map.steps) {
      steps++;
      if (letter === "L") {
        destination = map.directions.get(destination).left;
        continue;
      }
      destination = map.directions.get(destination).right;
    }
  } while (destination !== "ZZZ");

  console.log(`Part 1: ${steps}`);
};

main();
