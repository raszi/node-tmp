/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

var
  assert = require('assert'),
  assertions = require('./assertions'),
  childProcess = require('./child-process').childProcess;

describe('tmp', function () {
  describe('issue129: safely install listeners', function () {
    it('when simulating sandboxed behavior', function (done) {
      childProcess('issue129.json', function (err, stderr) {
        if (err) return done(err);
        else if (stderr) {
          assertions.assertDoesNotStartWith(stderr, 'EEXISTS:LEGACY:EXIT');
          assertions.assertDoesNotStartWith(stderr, 'EEXISTS:LEGACY:UNCAUGHT');
          assertions.assertDoesNotStartWith(stderr, 'EEXISTS:NEWSTYLE');
          assertions.assertDoesNotStartWith(stderr, 'ENOAVAIL:LEGACY:EXIT');
          assertions.assertDoesNotStartWith(stderr, 'EAVAIL:LEGACY:UNCAUGHT');
          assertions.assertDoesNotStartWith(stderr, 'ENOAVAIL:NEWSTYLE');
          assert.equal(stderr, 'EOK', 'existing listeners should have been removed and called');
        }

        done();
      });
    });
  });
});
