const { races, part2Races } = require("./data");

const main = () => {
  let validSolutions = new Map();
  for (let i = 0; i < races.time.length; i++) {
    validSolutions.set(i, []);
    const record = races.distance[i];
    const timeForTheRace = races.time[i];
    for (let y = 0; y < timeForTheRace; y++) {
      if (y * (timeForTheRace - y) <= record) {
        continue;
      }
      validSolutions.set(i, [
        ...validSolutions.get(i),
        {
          race: i,
          distance: y * (timeForTheRace - y),
          time: timeForTheRace - y,
          timeForTheRace,
          record,
        },
      ]);
    }
  }
  let result = 1;
  for (let key of validSolutions.keys()) {
    result = result * validSolutions.get(key).length;
  }
  console.log(`Part 1: ${result}`);

  validSolutions = 0;
  let iterator = 0;
  while (iterator < (part2Races.time / 2)) {
    iterator++;
    if (iterator*(part2Races.time - iterator) > part2Races.distance) {
        validSolutions++;
    }
  }
  console.log(`Part 2: ${validSolutions*2 + (part2Races.time % 2)}`)
};

main();
