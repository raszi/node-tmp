/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const
  assertions = require('./assertions'),
  childProcess = require('./child-process').childProcess,
  os = require('os'),
  rimraf = require('rimraf'),
  testCases = [
    { signal: 'SIGINT', expectExists: false },
    { signal: 'SIGTERM', expectExists: true }
  ];

// skip tests on win32
const isWindows = os.platform() === 'win32';
const tfunc = isWindows ? xit : it;

describe('tmp', function () {
  describe('issue121 - clean up on terminating signals', function () {
    for (let tc of testCases) {
      tfunc('for signal ' + tc.signal, function (done) {
        // increase timeout so that the child process may fail
        this.timeout(20000);
        issue121Tests(tc.signal, tc.expectExists)(done);
      });
    }
  });
});

function issue121Tests(signal, expectExists) {
  return function (done) {
    childProcess(this, 'issue121.json', function (err, stderr, stdout) {
      if (err) return done(err);
      else if (stderr) return done(new Error(stderr));

      try {
        if (expectExists) {
          assertions.assertExists(stdout);
        }
        else {
          assertions.assertDoesNotExist(stdout);
        }
        done();
      } catch (err) {
        done(err);
      } finally {
        // cleanup
        if (expectExists) {
          rimraf.sync(stdout);
        }
      }
    }, signal);
  };
}
