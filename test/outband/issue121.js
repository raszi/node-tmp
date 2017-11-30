/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

var
  fs = require('fs'),
  tmp = require('../../lib/tmp'),
  // we reuse the fixtures from issue62 here
  fixture = require('./issue62');

tmp.setGracefulCleanup();

// https://github.com/raszi/node-tmp/issues/121
module.exports = function (signal) {
  fixture.apply(this, [tmp.dirSync({ unsafeCleanup: true }), tmp]);

  // make sure that the process keeps running
  setTimeout(function () {}, 1000000);

  this.kill(signal);
};
