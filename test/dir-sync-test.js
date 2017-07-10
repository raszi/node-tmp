/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

var
  assert = require('assert'),
  fs = require('fs'),
  path = require('path'),
  inbandStandardTests = require('./inband-standard'),
  childProcess = require('./child-process'),
  assertions = require('./assertions'),
  tmp = require('../lib/tmp');


// make sure that everything gets cleaned up
tmp.setGracefulCleanup();


describe('tmp', function () {
  describe('#dirSync()', function () {
    // API call standard inband tests
    describe('when running inband standard tests', function () {

      inbandStandardTests(false, function before() {
        this.topic = tmp.dirSync(this.opts);
      });

      describe('with invalid tries', function () {
        it('should result in an error on negative tries', function () {
          try {
            tmp.dirSync({tries: -1});
            assert.fail('should have failed');
          } catch (err) {
            assert.ok(err instanceof Error);
          }
        });
        it('should result in an error on non numeric tries', function () {
          try {
            tmp.dirSync({tries: 'nan'});
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
      it('on graceful cleanup', function (done) {
        childProcess('outband/graceful-dir-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (!stderr) assert.fail('stderr expected');
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
      it('on non graceful cleanup', function (done) {
        childProcess('outband/non-graceful-dir-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (!stderr) assert.fail('stderr expected');
          else {
            assertions.assertExists(stdout);
            fs.rmdirSync(stdout);
          }
          done();
        });
      });
      it('on keep', function (done) {
        childProcess('outband/keep-dir-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else {
            assertions.assertExists(stdout);
            fs.rmdirSync(stdout);
          }
          done();
        });
      });
      it('on unlink (keep == false)', function (done) {
        childProcess('outband/unlink-dir-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
      it('on unsafe cleanup', function (done) {
        childProcess('outband/unsafe-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else {
            assertions.assertDoesNotExist(stdout);
            var basepath = path.join(__dirname, 'outband', 'fixtures', 'symlinkme');
            assertions.assertExists(basepath);
            assertions.assertExists(path.join(basepath, 'file.js'), true);
          }
          done();
        });
      });
      it('on non unsafe cleanup', function (done) {
        childProcess('outband/non-unsafe-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else {
            assertions.assertExists(stdout);
            assertions.assertExists(path.join(stdout, 'should-be-removed.file'), true);
            if (process.platform == 'win32')
              assertions.assertExists(path.join(stdout, 'symlinkme-target'), true);
            else
              assertions.assertExists(path.join(stdout, 'symlinkme-target'));
            fs.unlinkSync(path.join(stdout, 'should-be-removed.file'));
            fs.unlinkSync(path.join(stdout, 'symlinkme-target'));
            fs.rmdirSync(stdout);
          }
          done();
        });
      });
    });

    // API call issue specific outband tests
    describe('when running issue specific outband tests', function () {
      // add your issue specific tests here
      it('on issue #62', function (done) {
        childProcess('outband/issue62-sync.json', function (err, stderr, stdout) {
          if (err) return done(err);
          else if (stderr) assert.fail(stderr);
          else assertions.assertDoesNotExist(stdout);
          done();
        });
      });
    });
  });
});

