const { cards } = require("./data");

console.log(cards);

const sum = cards.reduce((sum, card) => {
  const exp = card.numbers.winning.reduce(
    (exp, num) => (card.numbers.played.includes(num) ? exp + 1 : exp),
    -1
  );
  if (exp === -1) { return sum }
  return sum + Math.pow(2, exp);
}, 0);

console.log(sum)
