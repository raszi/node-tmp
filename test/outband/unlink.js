const fs = require('fs');

module.exports = function (result) {
  const stat = fs.statSync(result.name);
  if (stat.isFile()) {
    fs.unlinkSync(result.name);
  } else {
    fs.rmdirSync(result.name);
  }
  this.out(result.name);
};
