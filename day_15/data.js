const fs = require('fs');

const data = fs.readFileSync('./day_15/input', 'utf-8');

const data1 = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;
module.exports.procedure = data.split(',');
