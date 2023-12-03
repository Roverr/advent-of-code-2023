const { schema } = require("./data");

class Counter {
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
}

const isSymbol = (letter) => letter !== "." && Number.isNaN(Number(letter));
const scanRowSelectionForSymbol = (start, end, row) => {
  for (let y = start; y <= end; y++) {
    if (isSymbol(schema[row][y])) {
      return true;
    }
  }
  return false;
};

const main = () => {
  let sum = 0;
  const counter = new Counter();
  for (let i = 0; i < schema.length; i++) {
    const aboveRow = i === 0 ? -1 : i - 1;
    const belowRow = i === schema.length - 1 ? -1 : i + 1;
    for (let letterIndex = 0; letterIndex < schema[i].length; letterIndex++) {
      const letter = schema[i][letterIndex];
      if (!counter.insert(letter, letterIndex, schema[i].length)) {
        continue;
      }
      const [startIndex, endIndex, source] = counter.fetchIndexes();
      const startRowIndex = startIndex > 0 ? startIndex - 1 : 0;
      const endRowIndex =
        endIndex + 1 === schema[i].length ? endIndex : endIndex + 1;
      let isNumberPartOfSchema = false;
      if (
        isSymbol(schema[i][startRowIndex]) ||
        isSymbol(schema[i][endRowIndex])
      ) {
        isNumberPartOfSchema = true;
      }
      if (aboveRow > -1 && !isNumberPartOfSchema) {
        isNumberPartOfSchema = scanRowSelectionForSymbol(startRowIndex, endRowIndex, aboveRow);
      }
      if (belowRow > -1 && !isNumberPartOfSchema) {
        isNumberPartOfSchema = scanRowSelectionForSymbol(startRowIndex, endRowIndex, belowRow);
      }
      if (isNumberPartOfSchema) {
        sum += Number(source);
      }
    }
    counter.reset();
  }
  console.log(sum);
};

main();
