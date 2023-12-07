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

const fiveOfAKinds = calculatedHands
  .filter(({ strength }) => strength === 0)
  .sort(
    (a, b) =>
      a.tracker.findIndex(({ count }) => count === 5) -
      b.tracker.findIndex(({ count }) => count === 5)
  );
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

let sortedHands = [
  ...fiveOfAKinds,
  ...fourOfAKinds,
  ...fullHouses,
  ...threeOfAKinds,
  ...twoPairs,
  ...onePairs,
  ...highCards,
];

const getSum = () =>
  sortedHands.reduce(
    (sum, hand, i) => sum + Number(hand.bid) * (sortedHands.length - i),
    0
  );

console.log(`Part 1: ${getSum()}`);

const needsReposition = sortedHands
  .filter(({ hand, strength }) => strength !== 0 && hand.includes("J"))
  .map((v) => {
    let i = -1;
    const jPosition = 3;
    const pretendTracker = JSON.parse(JSON.stringify(v.tracker));
    switch (v.strength) {
      case 1:
        if (v.tracker[jPosition].count === 4) {
          i = v.tracker.findIndex(({ count }) => count === 1);
        } else {
          i = v.tracker.findIndex(({ count }) => count === 4);
        }
        pretendTracker[i].count = 5;
        pretendTracker[jPosition].count = 0;
        return {
          ...v,
          pretend: {
            tracker: pretendTracker,
            hand: `${pretendTracker[i].key.repeat(5)}`,
            strength: 0,
          },
        };
      case 2:
        i = -1;
        if (v.tracker[jPosition].count > 2) {
          i = v.tracker.findIndex(({ count }) => count === 2);
        } else {
          i = v.tracker.findIndex(({ count }) => count === 3);
        }
        pretendTracker[i].count = 5;
        pretendTracker[jPosition].count = 0;
        return {
          ...v,
          pretend: {
            tracker: pretendTracker,
            hand: `${pretendTracker[i].key.repeat(5)}`,
            strength: 0,
          },
        };
      case 3:
        i = -1;
        if (v.tracker[jPosition].count === 3) {
          i = v.tracker.findIndex(({ count }) => count === 2);
          if (i > -1) {
            pretendTracker[i].count = 5;
            pretendTracker[jPosition].count = 0;
            return {
              ...v,
              pretend: {
                tracker: pretendTracker,
                hand: `${pretendTracker[i].key.repeat(5)}`,
                strength: 0,
              },
            };
          }
          i = v.tracker.findIndex(({ count }) => count === 1);
          pretendTracker[i].count = 4;
          pretendTracker[jPosition].count = 0;
          return {
            ...v,
            pretend: {
              tracker: pretendTracker,
              hand: v.hand.replaceAll("J", pretendTracker[i].key),
              strength: 1,
            },
          };
        }
        i = v.tracker.findIndex(({ count }) => count === 3);
        if (v.tracker[jPosition].count === 2) {
          pretendTracker[i].count = 5;
          pretendTracker[jPosition].count = 0;
          return {
            ...v,
            pretend: {
              tracker: pretendTracker,
              hand: `${v.hand.replaceAll("J", pretendTracker[i].key)}`,
              strength: 0,
            },
          };
        }
        pretendTracker[i].count = 4;
        pretendTracker[jPosition].count = 0;
        return {
          ...v,
          pretend: {
            tracker: pretendTracker,
            hand: `${v.hand.replaceAll("J", pretendTracker[i].key)}`,
            strength: 1,
          },
        };
      case 4:
        i = -1;
        if (v.tracker[jPosition].count === 2) {
          i = v.tracker.findIndex(
            ({ count, key }) => count === 2 && key !== "J"
          );
          pretendTracker[i].count = 4;
          pretendTracker[jPosition].count = 0;
          return {
            ...v,
            pretend: {
              tracker: pretendTracker,
              hand: v.hand.replaceAll("J", v.tracker[i].key),
              strength: 1,
            },
          };
        }
        i = v.tracker.findIndex(({ count }) => count === 2);
        pretendTracker[i].count = 3;
        pretendTracker[jPosition].count = 0;
        return {
          ...v,
          pretend: {
            tracker: pretendTracker,
            hand: v.hand.replaceAll("J", v.tracker[i].key),
            strength: 2,
          },
        };
      case 5:
        i = v.tracker.findIndex(({ count, key }) => count === 1 && key !== "J");
        pretendTracker[i].count = 3;
        pretendTracker[jPosition].count = 0;
        return {
          ...v,
          pretend: {
            tracker: pretendTracker,
            hand: v.hand.replaceAll("J", v.tracker[i].key),
            strength: 3,
          },
        };
      case 6:
        i = v.tracker.findIndex(({ count, key }) => count === 1 && key !== "J");
        pretendTracker[i].count = 2;
        pretendTracker[jPosition].count = 0;
        return {
          ...v,
          pretend: {
            tracker: pretendTracker,
            hand: v.hand.replaceAll("J", v.tracker[i].key),
            strength: 5,
          },
        };
    }
  });

sortedHands = sortedHands
  .map((v) => {
    const jPosition = v.tracker.findIndex(({ key }) => key === "J");
    if (
      !v.hand.includes("J") ||
      v.tracker.find(({ key, count }) => key === "J" && count === 5)
    ) {
      const jObj = v.tracker[jPosition];
      v.tracker.splice(jPosition, 1);
      v.tracker.push(jObj);
      return v;
    }
    const reposition = needsReposition.find(
      (reposition) => reposition.hand === v.hand
    );
    const jObj = reposition.tracker[jPosition];
    reposition.tracker.splice(jPosition, 1);
    reposition.tracker.push(jObj);
    return reposition;
  })
  .sort((a, b) => {
    const aStrength = a.pretend ? a.pretend.strength : a.strength;
    const bStrength = b.pretend ? b.pretend.strength : b.strength;
    return aStrength - bStrength;
  })
  .reduce(
    (collection, v) => {
      if (v.pretend) {
        collection[v.pretend.strength].push(v);
      } else {
        collection[v.strength].push(v);
      }
      return collection;
    },
    [[], [], [], [], [], [], []]
  )
  .reduce((result, arr) => [...result, ...arr.sort(sorter)], []);

console.log(`Part 2: ${getSum()}`);
