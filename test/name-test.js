/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const assert = require('assert');
const os = require('os');
const inbandStandardTests = require('./name-inband-standard');
const tmp = require('../lib/tmp');

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
          os.tmpdir = function () {
            return undefined;
          };
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
    });
  });
});
