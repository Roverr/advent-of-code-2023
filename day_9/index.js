const { reports } = require("./data");

let sum = reports.reduce((sum, reportNumbers) => {
  let sequences = [reportNumbers];
  let foundEnd = false;
  while (!foundEnd) {
    const previousSequence = sequences[sequences.length - 1];
    const sequence = previousSequence.reduce((diffs, number, i) => {
      if (i === previousSequence.length - 1) return diffs;
      diffs.push(previousSequence[i + 1] - number);
      return diffs;
    }, []);
    sequences.push(sequence);
    if (sequence.every((s) => s === sequence[0])) {
      foundEnd = true;
    }
  }
  sequences[sequences.length - 1].push(sequences[sequences.length - 1][0]);
  for (let y = sequences.length - 2; y >= 0; y--) {
    const sequence = sequences[y];
    const previousSequence = sequences[y + 1];
    sequence.push(
      sequence[sequence.length - 1] +
        previousSequence[previousSequence.length - 1]
    );
  }
  return sum + sequences[0][sequences[0].length - 1];
}, 0);

console.log(`Part 1: ${sum}`);

sum = reports.reduce((sum, reportNumbers, reportI) => {
  let sequences = [reportNumbers];
  let foundEnd = false;
  while (!foundEnd) {
    const previousSequence = sequences[sequences.length - 1];
    const sequence = previousSequence.reduce((diffs, number, i) => {
      if (i === previousSequence.length - 1) return diffs;
      diffs.push(previousSequence[i + 1] - number);
      return diffs;
    }, []);
    sequences.push(sequence);
    if (sequence.every((s) => s === sequence[0])) {
      foundEnd = true;
    }
  }
  sequences[sequences.length - 1].push(sequences[sequences.length - 1][0]);
  for (let y = sequences.length - 2; y >= 0; y--) {
    const sequence = sequences[y];
    const previousSequence = sequences[y + 1];
    sequences[y] = [sequence[0] - previousSequence[0]].concat(sequence);
  }
  return sum + sequences[0][0];
}, 0);

console.log(`Part 2: ${sum}`);
