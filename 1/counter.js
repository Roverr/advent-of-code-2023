module.exports = class Counter {
  constructor() {
    this.reset();
  }
  reset() {
    this.phrases = [
      { count: 0, phrase: "one" },
      { count: 0, phrase: "two" },
      { count: 0, phrase: "three" },
      { count: 0, phrase: "four" },
      { count: 0, phrase: "five" },
      { count: 0, phrase: "six" },
      { count: 0, phrase: "seven" },
      { count: 0, phrase: "eight" },
      { count: 0, phrase: "nine" },
    ];
  }
  insert(letter) {
    this.phrases = this.phrases.map(({ count, phrase }) => {
      if (phrase[count] === letter) {
        return { count: count + 1, phrase };
      }
      if (phrase[0] === letter) {
        return { count: 1, phrase };
      }
      return { count: 0, phrase };
    });
    for (let i = 0; i < this.phrases.length; i++) {
      const { count, phrase } = this.phrases[i];
      if (count === phrase.length) {
        return i + 1;
      }
    }
    return NaN;
  }
};
