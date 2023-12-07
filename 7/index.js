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

const fourOfAKinds = calculatedHands
  .filter(({ strength }) => strength === 1)
  .sort((a, b) => {
    const aPrimary = a.tracker.findIndex(({ count }) => count === 4);
    const bPrimary = b.tracker.findIndex(({ count }) => count === 4);
    if (aPrimary === bPrimary) {
      return (
        a.tracker.findIndex(({ count }) => count === 1) -
        b.tracker.findIndex(({ count }) => count === 1)
      );
    }
    return aPrimary - bPrimary;
  });

const fullHouses = calculatedHands
  .filter(({ strength }) => strength === 2)
  .sort((a, b) => {
    const aPrimary = a.tracker.findIndex(({ count }) => count === 3);
    const bPrimary = b.tracker.findIndex(({ count }) => count === 3);
    if (aPrimary === bPrimary) {
      return (
        a.tracker.findIndex(({ count }) => count === 2) -
        b.tracker.findIndex(({ count }) => count === 2)
      );
    }
    return aPrimary - bPrimary;
  });

const threeOfAKinds = calculatedHands
  .filter(({ strength }) => strength === 3)
  .sort((a, b) => {
    const aPrimary = a.tracker.findIndex(({ count }) => count === 3);
    const bPrimary = b.tracker.findIndex(({ count }) => count === 3);
    if (aPrimary === bPrimary) {
      const aSecondary = a.tracker.findIndex(({ count }) => count === 1);
      const bSecondary = b.tracker.findIndex(({ count }) => count === 1);
      if (aSecondary === bSecondary) {
        return (
          a.tracker.findIndex(
            ({ count, key }) => count === 1 && key !== a.tracker[aSecondary].key
          ) -
          b.tracker.findIndex(
            ({ count, key }) => count === 1 && key !== b.tracker[bSecondary].key
          )
        );
      }
      return aSecondary - bSecondary;
    }
    return aPrimary - bPrimary;
  });

const twoPairs = calculatedHands
  .filter(({ strength }) => strength === 4)
  .sort((a, b) => {
    const aPrimary = a.tracker.findIndex(({ count }) => count === 2);
    const bPrimary = b.tracker.findIndex(({ count }) => count === 2);
    if (aPrimary === bPrimary) {
      const aSecondary = a.tracker.findIndex(
        ({ count, key }) => count === 2 && key !== a.tracker[aPrimary].key
      );
      const bSecondary = b.tracker.findIndex(
        ({ count, key }) => count === 2 && key !== b.tracker[bPrimary].key
      );
      if (aSecondary === bSecondary) {
        return (
          a.tracker.findIndex(({ count }) => count === 1) -
          b.tracker.findIndex(({ count }) => count === 1)
        );
      }
      return aSecondary - bSecondary;
    }
    return aPrimary - bPrimary;
  });

const onePairs = calculatedHands
  .filter(({ strength }) => strength === 5)
  .sort((a, b) => {
    const aPrimary = a.tracker.findIndex(({ count }) => count === 2);
    const bPrimary = b.tracker.findIndex(({ count }) => count === 2);
    if (aPrimary === bPrimary) {
      const aSecondary = a.tracker.findIndex(({ count }) => count === 1);
      const bSecondary = b.tracker.findIndex(({ count }) => count === 1);
      if (aSecondary === bSecondary) {
        const aTertiary = a.tracker.findIndex(
          ({ count, key }) => count === 1 && key !== a.tracker[aSecondary].key
        );
        const bTertiary = b.tracker.findIndex(
          ({ count, key }) => count === 1 && key !== b.tracker[bSecondary].key
        );
        if (aTertiary === bTertiary) {
          const aQuaternary = a.tracker.findIndex(
            ({ count, key }) =>
              count === 1 &&
              ![a.tracker[aSecondary], a.tracker[aTertiary]].includes(key)
          );
          const bQuaternary = b.tracker.findIndex(
            ({ count, key }) =>
              count === 1 &&
              ![b.tracker[bSecondary], b.tracker[bTertiary]].includes(key)
          );
          return aQuaternary - bQuaternary;
        }
        return aTertiary - bTertiary;
      }
      return aSecondary - bSecondary;
    }
    return aPrimary - bPrimary;
  });

const highCards = calculatedHands
  .filter(({ strength }) => strength === 6)
  .sort((a, b) => {
    const aIndexes = [];
    const bIndexes = [];
    for (let i = 0; i < a.tracker.length; i++) {
      if (a.tracker[i].count > 0) {
        aIndexes.push(i);
      }
      if (b.tracker[i].count > 0) {
        bIndexes.push(i);
      }
    }
    for (let i = 0; i < aIndexes.length; i++) {
      if (aIndexes[i] === bIndexes[i]) continue;
      return aIndexes[i] - bIndexes[i];
    }
    return 0;
  });

/// 257 511 924 - 255 938 683
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

console.log(sum);
