/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const
  assert = require('assert'),
  os = require('os'),
  inbandStandardTests = require('./name-inband-standard'),
  tmp = require('../lib/tmp');


describe('tmp', function () {
  describe('#tmpName()', function () {
    describe('when running inband standard tests', function () {
      inbandStandardTests(function before(done) {
        var that = this;
        tmp.tmpName(this.opts, function (err, name) {
          if (err) return done(err);
          that.topic = name;
          done();
        });
      });

      describe('with invalid tries', function () {
        it('should result in an error on negative tries', function (done) {
          tmp.tmpName({ tries: -1 }, function (err) {
            try {
              assert.ok(err instanceof Error, 'should have failed');
            } catch (err) {
              return done(err);
            }
            done();
          });
        });

        it('should result in an error on non numeric tries', function (done) {
          tmp.tmpName({ tries: 'nan' }, function (err) {
            try {
              assert.ok(err instanceof Error, 'should have failed');
            } catch (err) {
              return done(err);
            }
            done();
          });
        });
      });
    });

    describe('when running issue specific inband tests', function () {
      describe('on issue #176', function () {
        const origfn = os.tmpdir;

        function _generateSpecName(optsDir, osTmpDir) {
          return 'opts.dir = "$1", os.tmpdir() = "$2"'.replace('$1', optsDir).replace('$2', osTmpDir);  
        }

        const failing = ['', '  ', undefined, null];
        const nonFailing = ['tmp']; // the origfn cannot be trusted as the os may or may not have a valid tmp dir

        describe('must fail on invalid os.tmpdir() and invalid opts.dir', function () {
          // test all failing permutations
          for (let oidx = 0; oidx < failing.length; oidx++) {
            for (let iidx = 0; iidx < failing.length; iidx++) {
              it(_generateSpecName(failing[iidx], failing[oidx]), function (done) {
                os.tmpdir = function () { return failing[oidx]; };
                tmp.tmpName({ dir: failing[iidx] }, function (err) {
                  try {
                    assert.ok(err instanceof Error, 'should have failed');
                  } catch (err) {
                    return done(err);
                  } finally {
                    os.tmpdir = origfn;
                  }
                  done();
                });
              });
            }
          }
        });
          
        describe('must not fail on invalid os.tmpdir() and valid opts.dir', function () {
          // test all non failing permutations for non failing opts.dir and failing osTmpDir
          for (let oidx = 0; oidx < failing.length; oidx++) {
            for (let iidx = 0; iidx < nonFailing.length; iidx++) {
              it(_generateSpecName(nonFailing[iidx], failing[oidx]), function (done) {
                os.tmpdir = function () { return failing[oidx]; };
                tmp.tmpName({ dir: nonFailing[iidx] }, function (err) {
                  try {
                    assert.ok(err === null || err === undefined, 'should not have failed');
                  } catch (err) {
                    return done(err);
                  } finally {
                    os.tmpdir = origfn;
                  }
                  done();
                });
              });
            }
          }
        });

        describe('must not fail on valid os.tmpdir() and invalid opts.dir', function () {
          // test all non failing permutations for failing opts.dir and non failing osTmpDir
          for (let oidx = 0; oidx < nonFailing.length; oidx++) {
            for (let iidx = 0; iidx < failing.length; iidx++) {
              it(_generateSpecName(failing[iidx], nonFailing[oidx]), function (done) {
                os.tmpdir = function () { return nonFailing[oidx]; };
                tmp.tmpName({ dir: failing[iidx] }, function (err) {
                  try {
                    assert.ok(err === null || err === undefined, 'should not have failed');
                  } catch (err) {
                    return done(err);
                  } finally {
                    os.tmpdir = origfn;
                  }
                  done();
                });
              });
            }
          }
        });
      });
    });

    describe('when running standard outband tests', function () {
    });

    describe('when running issue specific outband tests', function () {
    });
  });
});

