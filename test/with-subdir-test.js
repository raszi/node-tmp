const
  crypto = require('crypto'),
  path = require('path'),
  os = require('os'),
  assertions = require('./assertions'),
  tmp = require('../lib/tmp');

// make sure that everything gets cleaned up
tmp.setGracefulCleanup();

const filePromise = (opts) => new Promise((resolve, reject) =>
  tmp.file(opts, (err, name, fd, cleanup) => err ? reject(err) : resolve(name))
);

describe('tmp', function () {
  describe('#withSubdir()', function () {
    const randomPrefix = crypto.randomBytes(8).toString('hex');
    it("should place files in nested dirs", function (done) {
      tmp.withSubdir(`${randomPrefix}.1`, function () {
        return filePromise()
          .then((name1) => {
            assertions.assertDir(name1, path.join(os.tmpdir(), `${randomPrefix}.1`));
          })
          .then(() => tmp.withSubdir(`${randomPrefix}.2`, () => {
            return filePromise()
              .then((name2) => {
                assertions.assertDir(name2, path.join(os.tmpdir(), `${randomPrefix}.1`, `${randomPrefix}.2`))
              });
          }));
      }).then(done, done);
    });
  });
});