/*!
 * Tmp
 *
 * Copyright (c) 2011-2015 KARASZI Istvan <github@spam.raszi.hu>
 *
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var
  fs     = require('fs'),
  path   = require('path'),
  os     = require('os'),
  crypto = require('crypto'),
  exists = fs.exists || path.exists,
  tmpDir = os.tmpDir || _getTMPDir,
  _c     = require('constants');


/**
 * The working inner variables.
 */
var
  // store the actual TMP directory
  _TMP = tmpDir(),

  // the random characters to choose from
  RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',

  TEMPLATE_PATTERN = /XXXXXX/,

  // this will hold the objects need to be removed on exit
  _removeObjects = [],

  _gracefulCleanup = false,
  _uncaughtException = false;

/**
 * Random name generator based on crypto.
 * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
 *
 * @param {Number} howMany
 * @return {String}
 * @api private
 */
function _randomChars(howMany) {
  var
    value = [],
    rnd = null;

  // make sure that we do not fail because we ran out of entropy
  try {
    rnd = crypto.randomBytes(howMany);
  } catch (e) {
    rnd = crypto.pseudoRandomBytes(howMany);
  }

  for (var i = 0; i < howMany; i++) {
    value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
  }

  return value.join('');
}

/**
 * Gets the temp directory.
 *
 * @return {String}
 * @api private
 */
function _getTMPDir() {
  var tmpNames = ['TMPDIR', 'TMP', 'TEMP'];

  for (var i = 0, length = tmpNames.length; i < length; i++) {
    if (_isUndefined(process.env[tmpNames[i]])) continue;

    return process.env[tmpNames[i]];
  }

  // fallback to the default
  return '/tmp';
}

/**
 * Checks whether the `obj` parameter is defined or not.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
function _isUndefined(obj) {
  return typeof obj === 'undefined';
}

/**
 * Parses the function arguments.
 *
 * This function helps to have optional arguments.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api private
 */
function _parseArguments(options, callback) {
  if (!callback || typeof callback != "function") {
    callback = options;
    options = {};
  }

  return [options, callback];
}

/**
 * Gets a temporary file name.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api private
 */
function _getTmpName(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1],
    template = opts.template,
    templateDefined = !_isUndefined(template),
    tries = opts.tries || 3;

  if (isNaN(tries) || tries < 0)
    return cb(new Error('Invalid tries'));

  if (templateDefined && !template.match(TEMPLATE_PATTERN))
    return cb(new Error('Invalid template provided'));

  function _getName() {

    if (opts.name) {
      return path.join(opts.dir || _TMP, opts.name);
    }

    // prefix and postfix
    if (!templateDefined) {
      var name = [
        (_isUndefined(opts.prefix)) ? 'tmp-' : opts.prefix,
        process.pid,
        _randomChars(12),
        opts.postfix
      ].join('');

      return path.join(opts.dir || _TMP, name);
    }

    // mkstemps like template
    return template.replace(TEMPLATE_PATTERN, _randomChars(6));
  }

  (function _getUniqueName() {
    var name = _getName();

    // check whether the path exists then retry if needed
    exists(name, function _pathExists(pathExists) {
      if (pathExists) {
        if (tries-- > 0) return _getUniqueName();

        return cb(new Error('Could not get a unique tmp filename, max tries reached ' + name));
      }

      cb(null, name);
    });
  }());
}

/**
 * Creates and opens a temporary file.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */
function _createTmpFile(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

    opts.postfix = (_isUndefined(opts.postfix)) ? '.tmp' : opts.postfix;

  // gets a temporary filename
  _getTmpName(opts, function _tmpNameCreated(err, name) {
    if (err) return cb(err);

    // create and open the file
    fs.open(name, _c.O_CREAT | _c.O_EXCL | _c.O_RDWR, opts.mode || 0600, function _fileCreated(err, fd) {
      if (err) return cb(err);

      var removeCallback = _prepareRemoveCallback(function(fdPath) {
        try {
          fs.closeSync(fdPath[0]);
        }
        catch (e) {
          // did user close the fd?
          if (Math.abs(e.errno) != _c.EBADF) {
            // no, rethrow
            throw e;
          }
        }
        finally {
          fs.unlinkSync(fdPath[1]);
        }
      }, [fd, name]);

      if (!opts.keep) {
        _removeObjects.unshift(removeCallback);
      }

      cb(null, name, fd, removeCallback);
    });
  });
}

/**
 * Removes files and folders in a directory recursively.
 *
 * @param {String} dir
 * @api private
 */
function _rmdirRecursiveSync(root) {
  var dir,
      dirs = [root];
  while (dir = dirs.pop()) {
    var canRemove = true;
    var files = fs.readdirSync(dir);
    for (var i = 0, length = files.length; i < length; i++) {
      var file = path.join(dir, files[i]);
      // lstat so we don't recurse into symlinked directories.
      var stat = fs.lstatSync(file);

      if (stat.isDirectory()) {
        canRemove = false;
        dirs.push(dir);
        dirs.push(file);
      } else {
        fs.unlinkSync(file);
      }
    }
    if (canRemove) {
      fs.rmdirSync(dir);
    }
  }
}

/**
 * Creates a guarded function wrapping the removeFunction call.
 *
 * @param {Function} removeFunction
 * @param {Object} arg
 * @returns {Function}
 * @api private
 */
function _prepareRemoveCallback(removeFunction, arg) {
  var called = false;

  return function _cleanupCallback() {
    if (called) return;

    removeFunction(arg);

    called = true;
  };
}

/**
 * Creates a temporary directory.
 *
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */
function _createTmpDir(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  // gets a temporary filename
  _getTmpName(opts, function _tmpNameCreated(err, name) {
    if (err) return cb(err);

    // create the directory
    fs.mkdir(name, opts.mode || 0700, function _dirCreated(err) {
      if (err) return cb(err);

      var removeCallback = _prepareRemoveCallback(
        opts.unsafeCleanup
          ? _rmdirRecursiveSync
          : fs.rmdirSync.bind(fs),
        name
      );

      if (!opts.keep) {
        _removeObjects.unshift(removeCallback);
      }

      cb(null, name, removeCallback);
    });
  });
}

/**
 * The garbage collector.
 *
 * @api private
 */
function _garbageCollector() {
  if (_uncaughtException && !_gracefulCleanup) {
    return;
  }

  for (var i = 0, length = _removeObjects.length; i < length; i++) {
    try {
      _removeObjects[i].call(null);
    } catch (e) {
      // already removed?
    }
  }
}

function _setGracefulCleanup() {
  _gracefulCleanup = true;
}

var version = process.versions.node.split('.').map(function (value) {
  return parseInt(value, 10);
});

if (version[0] === 0 && (version[1] < 9 || version[1] === 9 && version[2] < 5)) {
  process.addListener('uncaughtException', function _uncaughtExceptionThrown( err ) {
    _uncaughtException = true;
    _garbageCollector();

    throw err;
  });
}

process.addListener('exit', function _exit(code) {
  if (code) _uncaughtException = true;
  _garbageCollector();
});

// exporting all the needed methods
module.exports.tmpdir = _TMP;
module.exports.dir = _createTmpDir;
module.exports.file = _createTmpFile;
module.exports.tmpName = _getTmpName;
module.exports.setGracefulCleanup = _setGracefulCleanup;
