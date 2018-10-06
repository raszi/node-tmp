/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

var
  assert = require('assert'),
  inbandStandardTests = require('./name-inband-standard'),
  tmp = require('../lib/tmp');


describe('tmp', function () {
  describe('#tmpName()', function () {
    describe('when running inband standard tests', function () {
      inbandStandardTests(function before(done) {
        var that = this;
        tmp.dir(this.opts, function (err, name) {
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
    });

    describe('when running standard outband tests', function () {
    });

    describe('when running issue specific outband tests', function () {
    });
  });
});

