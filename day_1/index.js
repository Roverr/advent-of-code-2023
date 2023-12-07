const { data } = require("./data");
const Counter = require("./counter");
const strings = data.split("\n");

const result = strings.reduce((result, word) => {
  const counter = new Counter();
  if (word.length === 0) return 0;
  const numbersInAWord = [];
  for (const letter of word) {
    let n = Number(letter);
    if (Number.isNaN(n)) {
      n = counter.insert(letter);
      if (Number.isNaN(n)) {
        continue;
      }
    } else {
      counter.reset();
    }
    numbersInAWord.push(n);
  }
  console.log(
    word + " ",
    Number(`${numbersInAWord[0]}${numbersInAWord[numbersInAWord.length - 1]}`)
  );
  return (
    result +
    Number(`${numbersInAWord[0]}${numbersInAWord[numbersInAWord.length - 1]}`)
  );
}, 0);

console.log(result);
