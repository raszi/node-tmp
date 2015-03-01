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
  existsSync = fs.existsSync || path.existsSync,
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

  DEFAULT_TRIES = 3,

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
  if (typeof options == 'function') {
    var tmp = options;
    options = callback || {};
    callback = tmp;
  }
  else if (typeof options == 'undefined') {
    options = {};
  }

  return [options, callback];
}

function _getName(opts) {

  var result = null;

  if (opts.name){
    return path.join(opts.dir || _TMP, opts.name);
  }

  // prefix and postfix
  if (!opts.template) {
    var name = [
      opts.prefix || 'tmp-',
      process.pid,
      _randomChars(12),
      opts.postfix || ''
    ].join('');

    result = path.join(opts.dir || _TMP, name);
  } else {
    // mkstemps like template

    result = opts.template.replace(TEMPLATE_PATTERN, _randomChars(6));
  }

  return result;
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
    tries = opts.tries || DEFAULT_TRIES;

  if (isNaN(tries) || tries < 0)
    return cb(new Error('Invalid tries'));

  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
    return cb(new Error('Invalid template provided'));

  (function _getUniqueName() {
    var name = _getName(opts);

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
 * Synchronous version of _getTmpName.
 *
 * @param {Object} options
 * @returns {String}
 * @api private
 */
function _getTmpNameSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0],
    tries = opts.tries || DEFAULT_TRIES;

  if (isNaN(tries) || tries < 0)
    throw new Error('Invalid tries');

  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
    throw new Error('Invalid template provided');

  var name = _getName(opts);
  while (existsSync(name) && tries-- > 0) {
    name = _getName(opts);
  }
  if (tries == 0) {
    throw new Error('Could not get a unique tmp filename, max tries reached');
  }

  return name;
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

      cb(null, name, fd, _prepareTmpFileRemoveCallback(name, fd, opts));
    });
  });
}

/**
 * Synchronous version of _createTmpFile.
 *
 * @param {Object} options
 * @returns {Object} object consists of name, fd and removeCallback
 * @api private
 */
function _createTmpFileSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0];

    opts.postfix = opts.postfix || '.tmp';

  var name = _getTmpNameSync(opts);
  var fd = fs.openSync(name, _c.O_CREAT | _c.O_EXCL | _c.O_RDWR, opts.mode || 0600);

  return {
    name : name,
    fd : fd,
        removeCallback : _prepareTmpFileRemoveCallback(name, fd, opts)
  };
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

      cb(null, name, _prepareTmpDirRemoveCallback(name, opts));
    });
  });
}

/**
 * Synchronous version of _createTmpDir.
 *
 * @param {Object} options
 * @returns {Object} object consists of name and removeCallback
 * @api private
 */
function _createTmpDirSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0];

  var name = _getTmpNameSync(opts);
  fs.mkdirSync(name, opts.mode || 0700);

  return {
    name : name,
    removeCallback : _prepareTmpDirRemoveCallback(name, opts)
  };
}

/**
 * Prepares the callback for removal of the temporary file.
 *
 * @param {String} name
 * @param {int} fd
 * @param {Object} opts
 * @api private
 * @returns {Function} the callback
 */
function _prepareTmpFileRemoveCallback(name, fd, opts) {

  var removeCallback = _prepareRemoveCallback(function(fdPath) {
    fs.closeSync(fdPath[0]);
    fs.unlinkSync(fdPath[1]);
  }, [ fd, name ]);

  if (!opts.keep) {
    _removeObjects.unshift(removeCallback);
  }

  return removeCallback;
}

/**
 * Prepares the callback for removal of the temporary directory.
 *
 * @param {String} name
 * @param {Object} opts
 * @api private
 * @returns {Function} the callback
 */
function _prepareTmpDirRemoveCallback(name, opts) {

  var removeCallback = _prepareRemoveCallback(
    opts.unsafeCleanup
        ? _rmdirRecursiveSync
        : fs.rmdirSync.bind(fs),
    name);

  if (!opts.keep) {
    _removeObjects.unshift(removeCallback);
  }

  return removeCallback;
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
module.exports.dirSync = _createTmpDirSync;
module.exports.file = _createTmpFile;
module.exports.fileSync = _createTmpFileSync;
module.exports.tmpName = _getTmpName;
module.exports.tmpNameSync = _getTmpNameSync;
module.exports.setGracefulCleanup = _setGracefulCleanup;
