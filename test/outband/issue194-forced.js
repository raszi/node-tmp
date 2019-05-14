/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const
  tmp = require('../../lib/tmp');

tmp.setGracefulCleanup(true);

// https://github.com/raszi/node-tmp/issues/121
module.exports = function () {

  const result = tmp.dirSync({ unsafeCleanup: true });

  this.out(result.name, this.exit);
};
