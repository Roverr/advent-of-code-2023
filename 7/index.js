const { hands } = require("./data");

const getTracker = () =>
  ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"].map(
    (v) => ({
      key: v,
      count: 0,
    })
  );

const strength = {
  fiveOfAKind: 0,
  fourOfAKind: 1,
  fullHouse: 2,
  threeOfAKind: 3,
  twoPairs: 4,
  onePair: 5,
  highcard: 6,
};

const calculatedHands = hands
  .map((hand) => {
    const tracker = getTracker();
    for (let i = 0; i < hand[0].length; i++) {
      tracker[tracker.findIndex(({ key }) => key === hand[0][i])].count++;
    }
    if (tracker.find(({ count }) => count === 5)) {
      return {
        hand: hand[0],
        bid: hand[1],
        strength: strength.fiveOfAKind,
        tracker,
      };
    }
    if (tracker.find(({ count }) => count === 4)) {
      return {
        hand: hand[0],
        bid: hand[1],
        strength: strength.fourOfAKind,
        tracker,
      };
    }
    if (tracker.find(({ count }) => count === 3)) {
      if (tracker.find(({ count }) => count === 2)) {
        return {
          hand: hand[0],
          bid: hand[1],
          strength: strength.fullHouse,
          tracker,
        };
      }
      return {
        hand: hand[0],
        bid: hand[1],
        strength: strength.threeOfAKind,
        tracker,
      };
    }
    const pair = tracker.find(({ count }) => count === 2);
    if (pair) {
      if (tracker.find(({ count, key }) => count === 2 && key !== pair.key)) {
        return {
          hand: hand[0],
          bid: hand[1],
          strength: strength.twoPairs,
          tracker,
        };
      }
      return {
        hand: hand[0],
        bid: hand[1],
        strength: strength.onePair,
        tracker,
      };
    }
    return {
      hand: hand[0],
      bid: hand[1],
      strength: strength.highcard,
      tracker,
    };
  })
  .sort((a, b) => a.strength - b.strength);

const fiveOfAKinds = calculatedHands
  .filter(({ strength }) => strength === 0)
  .sort(
    (a, b) =>
      a.tracker.findIndex(({ count }) => count === 5) -
      b.tracker.findIndex(({ count }) => count === 5)
  );

const sorter = (a, b) => {
  const aIndexes = [];
  const bIndexes = [];
  for (let i = 0; i < a.hand.length; i++) {
    aIndexes.push(a.tracker.findIndex(({ key }) => key === a.hand[i]));
    bIndexes.push(b.tracker.findIndex(({ key }) => key === b.hand[i]));
  }
  for (let i = 0; i < aIndexes.length; i++) {
    if (aIndexes[i] === bIndexes[i]) continue;
    return aIndexes[i] - bIndexes[i];
  }
  return 0;
};
const fourOfAKinds = calculatedHands
  .filter(({ strength }) => strength === 1)
  .sort(sorter);

const fullHouses = calculatedHands
  .filter(({ strength }) => strength === 2)
  .sort(sorter);

const threeOfAKinds = calculatedHands
  .filter(({ strength }) => strength === 3)
  .sort(sorter);

const twoPairs = calculatedHands
  .filter(({ strength }) => strength === 4)
  .sort(sorter);

const onePairs = calculatedHands
  .filter(({ strength }) => strength === 5)
  .sort(sorter);

const highCards = calculatedHands
  .filter(({ strength }) => strength === 6)
  .sort(sorter);

const sortedHands = [
  ...fiveOfAKinds,
  ...fourOfAKinds,
  ...fullHouses,
  ...threeOfAKinds,
  ...twoPairs,
  ...onePairs,
  ...highCards,
];

const sum = sortedHands.reduce(
  (sum, hand, i) => sum + Number(hand.bid) * (sortedHands.length - i),
  0
);

console.log(`Part 1: ${sum}`);
