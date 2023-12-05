const { almanac } = require("./data");

const getLocation = (seed) => {
  const soil = almanac.seedToSoil.convert(seed);
  const fertilizer = almanac.soilToFertilizer.convert(soil);
  const water = almanac.fertilizerToWater.convert(fertilizer);
  const light = almanac.waterToLight.convert(water);
  const temperature = almanac.lightToTemperature.convert(light);
  const humidity = almanac.temperatureToHumidity.convert(temperature);
  const location = almanac.humidityToLocation.convert(humidity);
  return location;
};

const main = () => {
  const locations = almanac.seeds
    .map((v) => getLocation(v))
    .sort((a, b) => a - b);
  console.log("Part 1: ", locations[0]);
};

main();
