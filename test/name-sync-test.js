/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

var
  assert = require('assert'),
  inbandStandardTests = require('./name-inband-standard'),
  tmp = require('../lib/tmp');


describe('tmp', function () {
  describe('#tmpNameSync()', function () {
    // API call standard inband tests
    describe('when running inband standard tests', function () {

      inbandStandardTests(function before() {
        this.topic = tmp.tmpNameSync(this.opts);
      });

      describe('with invalid tries', function () {
        it('should result in an error on negative tries', function () {
          try {
            tmp.tmpNameSync({tries: -1});
            assert.fail('should have failed');
          } catch (err) {
            assert.ok(err instanceof Error);
          }
        });
        it('should result in an error on non numeric tries', function () {
          try {
            tmp.tmpNameSync({tries: 'nan'});
            assert.fail('should have failed');
          } catch (err) {
            assert.ok(err instanceof Error);
          }
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

