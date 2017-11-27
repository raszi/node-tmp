/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

var
  assert = require('assert'),
  fs = require('fs'),
  inbandStandardTests = require('./inband-standard'),
  assertions = require('./assertions'),
  childProcess = require('./child-process'),
  tmp = require('../lib/tmp');


// make sure that everything gets cleaned up
tmp.setGracefulCleanup();


describe('tmp', function () {
  describe('#fileSync()', function () {
    // API call standard inband tests
    describe('when running inband standard tests', function () {

      inbandStandardTests(true, function before() {
	this.topic = tmp.fileSync(this.opts);
      });

      describe('with invalid tries', function () {
        it('should result in an error on negative tries', function () {
          try {
            tmp.fileSync({tries: -1});
            assert.fail('should have failed');
          } catch (err) {
            assert.ok(err instanceof Error);
          }
        });
        it('should result in an error on non numeric tries', function () {
          try {
            tmp.fileSync({tries: 'nan'});
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
      it('on graceful', function (done) {
        childProcess('outband/graceful-file-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (!stderr) assert.fail('stderr expected');
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
      it('on non graceful', function (done) {
        childProcess('outband/non-graceful-file-sync.json', function (err, stderr, stdout) {
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
        childProcess('outband/keep-file-sync.json', function (err, stderr, stdout) {
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
        childProcess('outband/unlink-file-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
    });

    // API call issue specific outband tests
    describe('when running issue specific outband tests', function () {
      // add your issue specific tests here
      it('on issue #115', function (done) {
        childProcess('outband/issue115-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
    });
  });
});

