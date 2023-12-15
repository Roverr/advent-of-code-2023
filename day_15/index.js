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

const OPERATIONS = {
  SET: "=",
  REMOVE: "-",
};

const main = () => {
  let sum = procedure
    .map((word) => word.replaceAll("\n", ""))
    .reduce((sum, step) => {
      const result = hasher(step, 0);
      return sum + result;
    }, 0);

  console.log(`Part 1: ${sum}`);

  const hashmap = procedure.map((word) => {
    if (word.includes(OPERATIONS.SET)) {
      const [label, value] = word.split(OPERATIONS.SET);
      return { label, value: Number(value), operation: OPERATIONS.SET };
    }
    return {
      label: word.split(OPERATIONS.REMOVE)[0],
      operation: OPERATIONS.REMOVE,
    };
  });
  const boxes = new Map();
  hashmap.forEach(({ label, value, operation }) => {
    const boxIndex = hasher(label, 0);
    let content = [];
    if (boxes.has(boxIndex)) {
      content = boxes.get(boxIndex);
    }
    const present = content.findIndex((item) => item.label === label);
    if (operation === OPERATIONS.SET) {
      if (present !== -1) {
        content[present] = { label, value };
      } else {
        content.push({ label, value });
      }
      boxes.set(boxIndex, content);
      return;
    }
    if (operation === OPERATIONS.REMOVE) {
      if (present !== -1) {
        content = [
          ...content.slice(0, present),
          ...content.slice(present + 1, content.length),
        ];
        boxes.set(boxIndex, content);
        return;
      }
    }
  });

  sum = 0;
  for (let boxNumber of boxes.keys()) {
    const content = boxes.get(boxNumber);
    if (content.length === 0) continue;
    sum =
      sum +
      content.reduce((localSum, { value }, i) => {
        return localSum + (1 + boxNumber) * (i + 1) * value;
      }, 0);
  }
  console.log(`Part 2: ${sum}`);
};

main();
