const { Counter } = require("./counter");
const { schema } = require("./data");

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
  const targetTable = [];
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
        isNumberPartOfSchema = scanRowSelectionForSymbol(
          startRowIndex,
          endRowIndex,
          aboveRow
        );
      }
      if (belowRow > -1 && !isNumberPartOfSchema) {
        isNumberPartOfSchema = scanRowSelectionForSymbol(
          startRowIndex,
          endRowIndex,
          belowRow
        );
      }
      if (isNumberPartOfSchema) {
        targetTable.push({
          indexes: {
            startIndex,
            endIndex,
            rowIndex: i,
            aboveRow,
            belowRow,
          },
          source,
          usedInCalculation: false,
        });
        sum += Number(source);
      }
    }
    counter.reset();
  }
  console.log('Part 1: ', sum);

  const asterisks = [];
  for (let i = 0; i < targetTable.length; i++) {
    const target = targetTable[i];
    const startRowIndex =
      target.indexes.startIndex > 0 ? target.indexes.startIndex - 1 : 0;
    const endRowIndex =
      target.indexes.endIndex + 1 === schema[0].length
        ? target.indexes.endIndex
        : target.indexes.endIndex + 1;
    let isAdjescentToAsterisk = false;
    for (let y = startRowIndex; y <= endRowIndex; y++) {
      let whichRow = -1;
      if (schema[target.indexes.rowIndex][y] === "*") {
        isAdjescentToAsterisk = true;
        whichRow = target.indexes.rowIndex;
      }
      if (
        !isAdjescentToAsterisk &&
        target.indexes.aboveRow > -1 &&
        schema[target.indexes.aboveRow][y] === "*"
      ) {
        isAdjescentToAsterisk = true;
        whichRow = target.indexes.aboveRow;
      }
      if (
        !isAdjescentToAsterisk &&
        target.indexes.belowRow > -1 &&
        schema[target.indexes.belowRow][y] === "*"
      ) {
        isAdjescentToAsterisk = true;
        whichRow = target.indexes.belowRow;
      }
      if (isAdjescentToAsterisk) {
        const found = asterisks.find(({ id }) => id === `${whichRow}_${y}`);
        if (found) {
          found.numbers.push(Number(target.source));
        } else {
          asterisks.push({
            id: `${whichRow}_${y}`,
            numbers: [Number(target.source)],
          });
        }
        break;
      }
    }
  }
  const gearSum = asterisks
    .filter(({ numbers }) => numbers.length > 1)
    .reduce((sum, { numbers }) => {
      return sum + numbers.reduce((n, c) => n * c, 1);
    }, 0);

  console.log('Part 2: ', gearSum);
};

main();
