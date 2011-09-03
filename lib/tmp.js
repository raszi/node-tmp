var
  fs     = require('fs'),
  path   = require('path');

/**
 * Gets the temp directory.
 */
var _TMP = (function _getTMPDir() {
  var tmpNames = [ 'TMPDIR', 'TMP', 'TEMP' ];

  for (var i = 0, length = tmpNames.length; i < length; i++) {
    if (_isUndefined(process.env[tmpNames[i]])) continue;

    return process.env[tmpNames[i]];
  }

  // fallback to the default
  return '/tmp';
}());

var _removeObjects = [];

function _isUndefined(obj) {
  return obj === void 0;
}

function _parseOptions(options, callback) {
  if (!callback || typeof callback != "function") {
    callback = options;
    options = {};
  }

  return [ options, callback ];
}

/**
 * Gets the temporary file name.
 */
function _getTmpName(dir, prefix, postfix, maxTries, cb) {
  var tries = maxTries || 3;

  if (tries < 0) return cb(new Error('Invalid tries'));

  function _getName() {
    var name =
      [
        (_isUndefined(prefix)) ? 'tmp-' : prefix,
        process.pid,
        (Math.random() * 0x1000000000).toString(36),
        postfix
      ].join('');

    return path.join(dir || _TMP, name);
  }

  (function _getUniqueName() {
    var name = _getName();
    path.exists(name, function _pathExists(exists) {
      if (exists) {
        if (tries-- > 0) return _getUniqueName();

        return cb(new Error('Could not get a unique tmp filename, max tries reached'));
      }

      cb(null, name);
    });
  }());
}

/**
 * Creates and opens a temporary file.
 */
function _createTmpFile(options, callback) {
  var
    args = _parseOptions(options, callback),
    opts = args[0],
    cb = args[1],

    filePostFix = (_isUndefined(opts.postfix)) ? '.tmp' : opts.postfix;

  // gets the temporary filename
  _getTmpName(opts.dir, opts.prefix, filePostFix, opts.tries,
    function _tmpNameCreated(err, name) {
      if (err) return cb(err);

      fs.open(name, 'w+', opts.mode || 0600, function _fileCreated(err, fd) {
        if (err) return cb(err);

        if (_isUndefined(opts.unlink) || opts.unlink)
          _removeObjects.push([ fs.unlinkSync, name ]);

        cb(null, name, fd);
      });
    }
  );
}

/**
 * Creates a temporary directory.
 */
function _createTmpDir(options, callback) {
  var
    args = _parseOptions(options, callback),
    opts = args[0],
    cb = args[1],

    dirPostfix = (_isUndefined(opts.postfix)) ? '' : opts.postfix;

  // gets the temporary filename
  _getTmpName(opts.dir, opts.prefix, dirPostfix, opts.tries,
    function _tmpNameCreated(err, name) {
      if (err) return cb(err);

      fs.mkdir(name, opts.mode || 0700, function _dirCreated(err) {
        if (err) return cb(err);

        if (_isUndefined(opts.unlink) || opts.unlink)
          _removeObjects.push([ fs.rmdirSync, name ]);

        cb(null, name);
      });
    }
  );
}

/**
 * Garbage collection.
 */
process.addListener('exit', function _garbageCollection() {
  for (var i = 0, length = _removeObjects.length; i < length; i++) {
    try {
      _removeObjects[i][0].call(null, _removeObjects[i][1]);
    } catch (e) {
      /* already removed */
    }
  };
});

module.exports.tmpdir = _TMP;
module.exports.dir = _createTmpDir;
module.exports.file = _createTmpFile;
