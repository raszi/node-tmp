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
  describe('#file()', function () {
    // API call standard inband tests
    describe('when running inband standard tests', function () {

      inbandStandardTests(true, function before(done) {
        var that = this;
        tmp.file(this.opts, function (err, name, fd, removeCallback) {
          if (err) done(err);
          else {
            that.topic = {name: name, fd: fd, removeCallback: removeCallback};
            done();
          }
        });
      });

      describe('with invalid tries', function () {
        it('should result in an error on negative tries', function (done) {
          tmp.file({tries: -1}, function (err) {
            assert.ok(err instanceof Error, 'should have failed');
            done();
          });
        });
        it('should result in an error on non numeric tries', function (done) {
          tmp.file({tries: 'nan'}, function (err) {
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
      it('on graceful', function (done) {
        childProcess('outband/graceful-file.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (!stderr) assert.fail('stderr expected');
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
      it('on non graceful', function (done) {
        childProcess('outband/non-graceful-file.json', function (err, stderr, stdout) {
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
        childProcess('outband/keep-file.json', function (err, stderr, stdout) {
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
        childProcess('outband/unlink-file.json', function (err, stderr, stdout) {
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
        childProcess('outband/issue115.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
    });
  });
});

