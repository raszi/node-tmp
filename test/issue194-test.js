/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const
  assertions = require('./assertions'),
  childProcess = require('./child-process').childProcess,
  os = require('os'),
  rimraf = require('rimraf'),
  testCases = [
    [ 'forced', 'true' ],
    [ 'keep', 'false' ],
    [ 'undefined', 'undefined' ]
  ];

describe('tmp', function () {
  describe('issue194', function () {
    for (let tc of testCases) {
      it('setGracefulCleanup(' + tc[1] + ') must behave as expected', function (done) {
        issue194Tests(tc[0], tc[0] === 'keep')(done);
      });
    }
  });
});

function issue194Tests(tc, expectExists) {
  return function (done) {
    childProcess(this, 'issue194-' + tc + '.json', function (err, stderr, stdout) {
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
    });
  };
}
