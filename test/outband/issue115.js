var fs = require('fs');

module.exports = function (result, tmp) {
  // creates a tmp file and then closes the file descriptor as per issue 115
  // https://github.com/raszi/node-tmp/issues/115
  fs.closeSync(result.fd);
  result.removeCallback();
  this.out(result.name, this.exit);
};

