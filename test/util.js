// vim: expandtab:ts=2:sw=2

const
  fs = require('fs');

module.exports.readJsonConfig = function readJsonConfig(path) {
  const contents = fs.readFileSync(path);
  return JSON.parse(contents);
};
