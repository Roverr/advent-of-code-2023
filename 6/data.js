const data = `Time:        41     96     88     94
Distance:   214   1789   1127   1055`;

const [timeString, distanceString] = data.split("\n");

const time = timeString
  .replace("Time: ", "")
  .split(" ")
  .filter((v) => v !== "")
  .map((v) => Number(v));
const distance = distanceString
  .replace("Distance: ", "")
  .split(" ")
  .filter((v) => v !== "")
  .map((v) => Number(v));

module.exports.races = { time, distance };
