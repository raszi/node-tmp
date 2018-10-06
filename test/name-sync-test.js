/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const
  assert = require('assert'),
  os = require('os'),
  inbandStandardTests = require('./name-inband-standard'),
  tmp = require('../lib/tmp');


describe('tmp', function () {
  describe('#tmpNameSync()', function () {
    describe('when running inband standard tests', function () {
      inbandStandardTests(function before() {
        this.topic = tmp.tmpNameSync(this.opts);
      });

      describe('with invalid tries', function () {
        it('should result in an error on negative tries', function () {
          try {
            tmp.tmpNameSync({ tries: -1 });
            assert.fail('should have failed');
          } catch (err) {
            assert.ok(err instanceof Error);
          }
        });
        it('should result in an error on non numeric tries', function () {
          try {
            tmp.tmpNameSync({ tries: 'nan' });
            assert.fail('should have failed');
          } catch (err) {
            assert.ok(err instanceof Error);
          }
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
              it(_generateSpecName(failing[iidx], failing[oidx]), function () {
                os.tmpdir = function () { return failing[oidx]; };
                try {
                  tmp.tmpNameSync({ dir: failing[iidx] });
                  assert.fail('expected this to fail');
                } catch (err) {
                  assert.ok(err instanceof Error, 'error expected');
                } finally {
                  os.tmpdir = origfn;
                }
              });
            }
          }
        });
          
        describe('must not fail on invalid os.tmpdir() and valid opts.dir', function () {
          // test all non failing permutations for non failing opts.dir and failing osTmpDir
          for (let oidx = 0; oidx < failing.length; oidx++) {
            for (let iidx = 0; iidx < nonFailing.length; iidx++) {
              it(_generateSpecName(nonFailing[iidx], failing[oidx]), function () {
                os.tmpdir = function () { return failing[oidx]; };
                try {
                  tmp.tmpNameSync({ dir: nonFailing[iidx] });
                } catch (err) {
                  assert.fail(err);
                } finally {
                  os.tmpdir = origfn;
                }
              });
            }
          }
        });

        describe('must not fail on valid os.tmpdir() and invalid opts.dir', function () {
          // test all non failing permutations for failing opts.dir and non failing osTmpDir
          for (let oidx = 0; oidx < nonFailing.length; oidx++) {
            for (let iidx = 0; iidx < failing.length; iidx++) {
              it(_generateSpecName(failing[iidx], nonFailing[oidx]), function () {
                os.tmpdir = function () { return nonFailing[oidx]; };
                try {
                  tmp.tmpNameSync({ dir: failing[iidx] });
                } catch (err) {
                  assert.fail(err);
                } finally {
                  os.tmpdir = origfn;
                }
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

