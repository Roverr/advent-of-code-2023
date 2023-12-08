const { map } = require("./data");

const commonMultiple = (counter) => {
    const gcd = (a, b) => b == 0 ? a : gcd(b, a % b);
    let results = counter;
    while (true) {
        let partResults = [];
        while (results.length > 0) {
            if (results.length === 1) {
                partResults.push(results[0]);
                break;
            }
            const [a, b] = results.splice(0, 2);
            partResults.push(a * b / gcd(a, b));
        }
        if (partResults.length === 1) {
            return partResults[0];
        }
        results = partResults;
    }
};

const main = () => {
  let destination = "AAA";
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

  const endsWith = {
    A: [],
    Z: [],
  };
  for (let key of map.directions.keys()) {
    if (key[2] === "A") {
      endsWith.A.push(key);
    }
    if (key[2] === "Z") {
      endsWith.Z.push(key);
    }
  }

  const cursors = JSON.parse(JSON.stringify(endsWith.A));
  let counter = cursors.map(() => 0);
  const areWeThereYet = () => counter.every((c) => c > 0);
  steps = 0;
  do {
    for (let letter of map.steps) {
      steps++;
      for (let i = 0; i < cursors.length; i++) {
        cursors[i] =
          letter === "L"
            ? map.directions.get(cursors[i]).left
            : map.directions.get(cursors[i]).right;
      }
    }
    counter = counter.map((v, i) =>
      v > 0 ? v : endsWith.Z.includes(cursors[i]) ? steps : 0
    );
  } while (!areWeThereYet());

  console.log(`Part 2: ${commonMultiple(counter.map(c => BigInt(c)))}`);
};

main();
