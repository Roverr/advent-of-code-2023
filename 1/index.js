const { data } = require('./data');

const strings = data.split('\n');
const result = strings.reduce((result, prev) => {
    if (prev.length === 0) return result;
    const numbersInAWord = [];
    for (const letter of prev) {
        const n = Number(letter)
        if (Number.isNaN(n)) continue;
        numbersInAWord.push(n);
    }
    return result + Number(`${numbersInAWord[0]}${numbersInAWord[numbersInAWord.length - 1]}`);
}, 0);

console.log(result);
