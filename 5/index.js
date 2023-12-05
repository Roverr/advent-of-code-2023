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

const getSeed = (location) => {
  const humidity = almanac.humidityToLocation.reverseConvert(location);
  const temperature = almanac.temperatureToHumidity.reverseConvert(humidity);
  const light = almanac.lightToTemperature.reverseConvert(temperature);
  const water = almanac.waterToLight.reverseConvert(light);
  const fertilizer = almanac.fertilizerToWater.reverseConvert(water);
  const soil = almanac.soilToFertilizer.reverseConvert(fertilizer);
  const seed = almanac.seedToSoil.reverseConvert(soil);
  return seed;
};

const isPossibleSeed = (seed) =>
  almanac.part2Seeds.reduce(
    (isPossible, [start, range]) =>
      isPossible || (start <= seed && start + range >= seed),
    false
  );

const main = () => {
  const locations = almanac.seeds
    .map((v) => getLocation(v))
    .sort((a, b) => a - b);
  console.log("Part 1: ", locations[0]);

  let possibleSeed = false;
  let seed = undefined;
  let iterator = 0;
  const tolerance = 100;
  while (!possibleSeed) {
    seed = getSeed(iterator);
    possibleSeed = isPossibleSeed(seed);
    iterator = iterator + tolerance;
  }
  let area = tolerance * 2;
  const min = {
    value: undefined,
    area: undefined,
    seed: undefined,
  };
  while (area > -1) {
    const [a, b] = [getLocation(seed + area), getLocation(seed - area)];
    if (!min.value) {
      min.value = a;
      min.area = area;
    }
    if (a < min.value && isPossibleSeed(seed + area)) {
      min.value = a;
      min.area = area;
      min.seed = seed + area;
    }
    if (b < min.value && isPossibleSeed(seed - area)) {
      min.value = b;
      min.area = area;
      min.seed = seed - area;
    }
    area--;
  }
  console.log(`Part 2: Seed (${min.seed}) Location (${min.value})`);
};

main();
