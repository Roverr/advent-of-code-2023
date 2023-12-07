module.exports.Counter = class Counter {
  constructor() {
    this.reset();
  }
  reset() {
    this.source = "";
    this.startIndex = -1;
    this.endIndex = -1;
  }
  insert(letter, index, length) {
    if (Number.isNaN(Number(letter))) {
      if (this.source !== "") {
        this.endIndex = index - 1;
        return true;
      }
      return false;
    }
    if (this.source === "") {
      this.startIndex = index;
    }
    this.source += letter;
    if (index + 1 === length) {
      this.endIndex = index;
      return true;
    }
    return false;
  }
  fetchIndexes() {
    const tuple = [this.startIndex, this.endIndex, this.source];
    this.reset();
    return tuple;
  }
};
