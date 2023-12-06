const { races } = require("./data");

const main = () => {
  const validSolutions = new Map();
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
  console.log(result);
};

main();
