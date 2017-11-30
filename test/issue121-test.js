/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const
  assert = require('assert'),
  assertions = require('./assertions'),
  childProcess = require('./child-process').childProcess,
  signals = ['SIGINT', 'SIGTERM'];

describe('tmp', function () {
  describe('issue121 - clean up on terminating signals', function () {
    for (var i=0; i < signals.length; i++) {
      it(signals[i], issue121Tests(signals[i]));
    }
  });
});

function issue121Tests(signal) {
  return function (done) {
    childProcess('issue121.json', function (err, stderr, stdout) {
      if (err) return done(err);
      else if (stderr) return done(new Error(stderr));
      else assertions.assertDoesNotExist(stdout);
      done();
    }, true);
  };
}
