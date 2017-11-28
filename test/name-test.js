/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

var
  assert = require('assert'),
  inbandStandardTests = require('./name-inband-standard'),
  tmp = require('../lib/tmp');


describe('tmp', function () {
  describe('#tmpName()', function () {
    // API call standard inband tests
    describe('when running inband standard tests', function () {

      inbandStandardTests(function before(done) {
        var that = this;
        tmp.dir(this.opts, function (err, name) {
          if (err) done(err);
          else {
            that.topic = name;
            done();
          }
        });
      });

      describe('with invalid tries', function () {
        it('should result in an error on negative tries', function (done) {
          tmp.tmpName({ tries: -1 }, function (err) {
            assert.ok(err instanceof Error, 'should have failed');
            done();
          });
        });
        it('should result in an error on non numeric tries', function (done) {
          tmp.tmpName({ tries: 'nan' }, function (err) {
            assert.ok(err instanceof Error, 'should have failed');
            done();
          });
        });
      });
    });

    // API call issue specific inband tests
    describe('when running issue specific inband tests', function () {
      // add your issue specific tests here
    });

    // API call standard outband tests
    describe('when running standard outband tests', function () {
    });

    // API call issue specific outband tests
    describe('when running issue specific outband tests', function () {
      // add your issue specific tests here
    });
  });
});

