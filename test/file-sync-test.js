/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

var
  assert = require('assert'),
  fs = require('fs'),
  inbandStandardTests = require('./inband-standard'),
  assertions = require('./assertions'),
  childProcess = require('./child-process').genericChildProcess,
  tmp = require('../lib/tmp');


// make sure that everything gets cleaned up
tmp.setGracefulCleanup();


describe('tmp', function () {
  describe('#fileSync()', function () {
    describe('when running inband standard tests', function () {

      inbandStandardTests(true, function before() {
        this.topic = tmp.fileSync(this.opts);
      });

      describe('with invalid tries', function () {
        it('should result in an error on negative tries', function () {
          try {
            tmp.fileSync({ tries: -1 });
            assert.fail('should have failed');
          } catch (err) {
            assert.ok(err instanceof Error);
          }
        });
        it('should result in an error on non numeric tries', function () {
          try {
            tmp.fileSync({ tries: 'nan' });
            assert.fail('should have failed');
          } catch (err) {
            assert.ok(err instanceof Error);
          }
        });
      });
    });

    describe('when running issue specific inband tests', function () {
    });

    describe('when running standard outband tests', function () {
      it('on graceful', function (done) {
        childProcess('graceful-file-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (!stderr) assert.fail('stderr expected');
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
      it('on non graceful', function (done) {
        childProcess('non-graceful-file-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (!stderr) assert.fail('stderr expected');
          else {
            assertions.assertExists(stdout, true);
            fs.unlinkSync(stdout);
          }
          done();
        });
      });
      it('on keep', function (done) {
        childProcess('keep-file-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else {
            assertions.assertExists(stdout, true);
            fs.unlinkSync(stdout);
          }
          done();
        });
      });
      it('on unlink (keep == false)', function (done) {
        childProcess('unlink-file-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
    });

    describe('when running issue specific outband tests', function () {
      it('on issue #115', function (done) {
        childProcess('issue115-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
    });
  });
});

