const assert = require('assert');
const tmp = require('../lib/tmp');
const fs = require('fs');
const os = require('os');
const { join } = require('path');
const { randomBytes } = require('crypto');

function getRandomChars() {
  return randomBytes(10).toString('hex');
}

function getRandomPath(dir) {
  return join(dir, getRandomChars());
}

describe('GHSA-52f5-9888-hmc6', function () {
  const realTmpdir = os.tmpdir();
  const restricted = getRandomPath(realTmpdir);
  const tmpdir = getRandomPath(realTmpdir);
  const evilSymlinkPath = getRandomPath(tmpdir);

  before(function () {
    fs.mkdirSync(restricted);
    fs.mkdirSync(tmpdir);
    fs.symlinkSync(restricted, evilSymlinkPath);
  });

  after(function () {
    fs.rmSync(restricted, { recursive: true });
    fs.rmSync(tmpdir, { recursive: true });
  });

  describe('#fileSync with `dir`', function () {
    it('should not allow dirs outside of dir', function (done) {
      assert.throws(function () {
        tmp.fileSync({ tmpdir: tmpdir, dir: evilSymlinkPath });
      }, new RegExp('^Error: dir option must be relative to'));

      done();
    });
  });

  describe('#fileSync with `template`', function () {
    it('should not allow dirs outside of dir', function (done) {
      assert.throws(function () {
        tmp.fileSync({ tmpdir: tmpdir, template: join(evilSymlinkPath, 'XXXXXX') });
      }, new RegExp('^Error: template option must be relative to'));

      done();
    });
  });

  describe('#file with `dir`', function () {
    it('should not allow dirs outside of dir', function (done) {
      tmp.file({ tmpdir: tmpdir, dir: evilSymlinkPath }, function (err, file) {
        assert.ok(err instanceof Error, 'should have failed');
        assert.ifError(file);

        done();
      });
    });
  });

  describe('#file with `template`', function () {
    it('should not allow dirs outside of dir', function (done) {
      tmp.file({ tmpdir: tmpdir, template: join(evilSymlinkPath, 'XXXXXX') }, function (err, file) {
        assert.ok(err instanceof Error, 'should have failed');
        assert.ifError(file, 'should be null');

        done();
      });
    });
  });

  describe('#dirSync with `dir`', function () {
    it('should not allow dirs outside of dir', function (done) {
      assert.throws(function () {
        tmp.dirSync({
          tmpdir: tmpdir,
          dir: evilSymlinkPath
        });
      }, new RegExp('^Error: dir option must be relative to'));

      done();
    });
  });

  describe('#dirSync with `template`', function () {
    it('should not allow dirs outside of dir', function (done) {
      assert.throws(function () {
        tmp.dirSync({
          tmpdir: tmpdir,
          template: join(evilSymlinkPath, 'XXXXXX')
        });
      }, new RegExp('^Error: template option must be relative to'));

      done();
    });
  });

  describe('#dir with `dir`', function () {
    it('should not allow dirs outside of dir', function (done) {
      tmp.dir({ tmpdir: tmpdir, dir: evilSymlinkPath }, function (err, dir) {
        assert.ok(err instanceof Error, 'should have failed');
        assert.ifError(dir);

        done();
      });
    });
  });

  describe('#dir with `template`', function () {
    it('should not allow dirs outside of dir', function (done) {
      tmp.dir({ tmpdir: tmpdir, template: join(evilSymlinkPath, 'XXXXXX') }, function (err, dir) {
        assert.ok(err instanceof Error, 'should have failed');
        assert.ifError(dir, 'should be null');

        done();
      });
    });
  });
});
