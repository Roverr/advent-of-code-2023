const { procedure } = require("./data");

const hasher = (word, currentValue) => {
  let current = currentValue;
  for (let letter of word) {
    const ascii = letter.charCodeAt(0);
    current = (ascii + current) * 17;
    current = current - Math.floor(current / 256) * 256;
  }
  return current;
};

const main = () => {
  const sum = procedure.map(letter => letter.replaceAll('\n', '')).reduce((sum, step) => {
    const result = hasher(step, 0);
    return sum + result;
  }, 0);

  console.log(`Part 1: ${sum}`);
};

main();
