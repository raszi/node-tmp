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
        if (stderr) {
          assertions.assertDoesNotStartWith(stderr, 'EEXISTS:MULTIPLE');
          assertions.assertDoesNotStartWith(stderr, 'ENOAVAIL:');
          return done();
        }
        if (stdout) {
          assert.equal(stdout, 'EOK');
          return done();
        }
        done(new Error('existing listener has not been called'));
      });
    });
  });
});
