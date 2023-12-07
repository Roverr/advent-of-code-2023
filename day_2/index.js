const { games } = require("./data");

const sum = games.reduce((possibles, current) => {
  const localMaxes = current.results.reduce((tracker, result) => {
    if (tracker.red < result.red) tracker.red = result.red;
    if (tracker.green < result.green) tracker.green = result.green;
    if (tracker.blue < result.blue) tracker.blue = result.blue;
    return tracker;
  }, { red: 0, green: 0, blue: 0});
  const power = localMaxes.red * localMaxes.green * localMaxes.blue;
  return [...possibles, power];
}, []).reduce((sum, p) => sum + p, 0);

console.log(sum);
