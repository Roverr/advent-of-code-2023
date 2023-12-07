const { cards } = require("./data");

let sum = cards.reduce((sum, card) => {
  const exp = card.numbers.winning.reduce(
    (exp, num) => (card.numbers.played.includes(num) ? exp + 1 : exp),
    -1
  );
  if (exp === -1) {
    return sum;
  }
  return sum + Math.pow(2, exp);
}, 0);

console.log('Part 1: ', sum);

const collection = new Map();

sum = cards.reduce((sum, card) => {
  const numberOfWinners = card.numbers.winning.reduce(
    (winners, num) =>
      card.numbers.played.includes(num) ? winners + 1 : winners,
    0
  );
  let n = 1;
  if (collection.has(card.id)) {
    collection.set(card.id, collection.get(card.id) + 1);
    n = collection.get(card.id);
  } else {
    collection.set(card.id, 1);
  }
  for (let y = 0; y < n; y++) {
    for (let i = 1; i <= numberOfWinners; i++) {
      if (collection.has(card.id + i)) {
        collection.set(card.id + i, collection.get(card.id + i) + 1);
        continue;
      }
      collection.set(card.id + i, 1);
    }
  }
  return sum + collection.get(card.id);
}, 0);

console.log('Part 2: ', sum);
