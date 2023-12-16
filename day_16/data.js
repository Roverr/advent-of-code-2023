const fs = require('fs');

const data = fs.readFileSync('./day_16/input', 'utf-8');

module.exports.beams = data.split('\n').map(line => line.replaceAll('\\', 'l')).filter(v => v !== '');

