const data = `Time:        41     96     88     94
Distance:   214   1789   1127   1055`;

const [timeString, distanceString] = data.split("\n");

let time = timeString
  .replace("Time: ", "")
  .split(" ")
  .filter((v) => v !== "")
  .map((v) => Number(v));
let distance = distanceString
  .replace("Distance: ", "")
  .split(" ")
  .filter((v) => v !== "")
  .map((v) => Number(v));

module.exports.races = { time, distance };

time = Number(
  timeString
    .replace("Time: ", "")
    .split(" ")
    .filter((v) => v !== "")
    .join("")
);

distance = Number(
  distanceString
    .replace("Distance: ", "")
    .split(" ")
    .filter((v) => v !== "")
    .join("")
);
module.exports.part2Races = { time, distance };
