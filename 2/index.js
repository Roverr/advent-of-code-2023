const { games } = require("./data");

const sum = games.reduce((possibles, current) => {
  const isFailed = current.results.reduce((isFailed, drawResult) => {
    return (
      isFailed ||
      drawResult.red > 12 ||
      drawResult.green > 13 ||
      drawResult.blue > 14
    );
  }, false);
  if (isFailed) return possibles;
  return [...possibles, Number(current.id)];
}, []).reduce((sum, curr) => sum + curr, 0);

console.log(sum)
