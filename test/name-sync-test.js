/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

const assert = require('assert');
const os = require('os');
const inbandStandardTests = require('./name-inband-standard');
const tmp = require('../lib/tmp');

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
        it('must fail on invalid os.tmpdir()', function () {
          os.tmpdir = function () {
            return undefined;
          };
          try {
            tmp.tmpNameSync();
            assert.fail('should have failed');
          } catch (err) {
            assert.ok(err instanceof Error);
          } finally {
            os.tmpdir = origfn;
          }
        });
      });
    });
  });
});
