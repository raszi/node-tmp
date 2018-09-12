/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

var
  assert = require('assert'),
  assertions = require('./assertions'),
  childProcess = require('./child-process').childProcess;

describe('tmp', function () {
  describe('issue129: safely install sigint listeners', function () {
    it('when simulating sandboxed behavior', function (done) {
      childProcess(this, 'issue129-sigint.json', function (err, stderr, stdout) {
        if (err) return done(err);
        if (!stdout && !stderr) return done(new Error('stderr or stdout expected'));
        if (stderr) {
          try {
            assertions.assertDoesNotStartWith(stderr, 'EEXISTS:MULTIPLE');
            assertions.assertDoesNotStartWith(stderr, 'ENOAVAIL:EXISTING');
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
