/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const
  assert = require('assert'),
  assertions = require('./assertions'),
  childProcess = require('./child-process').childProcess;

describe('tmp', function () {
  describe('issue129: safely install listeners', function () {
    it('when simulating sandboxed behavior', function (done) {
      childProcess(this, 'issue129.json', function (err, stderr, stdout) {
        if (err) return done(err);
        if (!stdout && !stderr) return done(new Error('stderr or stdout expected'));
        if (stderr) {
          try {
            assertions.assertDoesNotStartWith(stderr, 'EEXISTS:LEGACY:EXIT');
            assertions.assertDoesNotStartWith(stderr, 'EEXISTS:LEGACY:UNCAUGHT');
            assertions.assertDoesNotStartWith(stderr, 'EEXISTS:NEWSTYLE');
            assertions.assertDoesNotStartWith(stderr, 'ENOAVAIL:LEGACY:EXIT');
            assertions.assertDoesNotStartWith(stderr, 'EAVAIL:LEGACY:UNCAUGHT');
            assertions.assertDoesNotStartWith(stderr, 'ENOAVAIL:NEWSTYLE');
          } catch (err) {
            return done(err);
          }
        }
        if (stdout) {
          try {
            assert.equal(stdout, 'EOK', 'existing listeners should have been removed and called');
          } catch (err) {
            return done(err);
          }
        }
        done();
      });
    });
  });
});
