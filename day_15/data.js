const fs = require("fs");

const data = fs.readFileSync("./day_15/input", "utf-8");

module.exports.procedure = data.split(",");
