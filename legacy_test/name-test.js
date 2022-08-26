/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const
  assert = require('assert'),
  os = require('os'),
  path = require('path'),
  inbandStandardTests = require('./name-inband-standard'),
  tmp = require('../dist/src/index');

const isWindows = os.platform() === 'win32';

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
        it('must fail on invalid os.tmpdir()', function (done) {
          os.tmpdir = function () { return undefined; };
          tmp.tmpName(function (err) {
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
      });
      describe('on issue #268', function () {
        const origfn = os.tmpdir;
        it(`should not alter ${isWindows ? 'invalid' : 'valid'} path on os.tmpdir() returning path that includes double quotes`, function (done) {
          const tmpdir = isWindows ? '"C:\\Temp With Spaces"' : '"/tmp with spaces"';
          os.tmpdir = function () { return tmpdir; };
          tmp.tmpName(function (err, name) {
            const index = name.indexOf(path.sep + tmpdir + path.sep);
            try {
              assert.ok(index > 0, `${tmpdir} should have been a subdirectory name in ${name}`);
            } catch (err) {
              return done(err);
            } finally {
              os.tmpdir = origfn;
            }
            done();
          });
        });
        it('should not alter valid path on os.tmpdir() returning path that includes single quotes', function (done) {
          const tmpdir = isWindows ? '\'C:\\Temp With Spaces\'' : '\'/tmp with spaces\'';
          os.tmpdir = function () { return tmpdir; };
          tmp.tmpName(function (err, name) {
            const index = name.indexOf(path.sep + tmpdir + path.sep);
            try {
              assert.ok(index > 0, `${tmpdir} should have been a subdirectory name in ${name}`);
            } catch (err) {
              return done(err);
            } finally {
              os.tmpdir = origfn;
            }
            done();
          });
        });
      });
    });

    describe('when running standard outband tests', function () {
    });

    describe('when running issue specific outband tests', function () {
    });
  });
});
