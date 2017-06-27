/*!
 * Tmp
 *
 * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
 *
 * MIT Licensed
 */

interface Options {
  tries?: number;
  template?: string;
  name?: string;
  dir?: string;
  prefix?: string;
  postfix?: string;
}

interface DirOptions extends Options {
  mode?: number;
  keep?: boolean;
  unsafeCleanup?: boolean;
}

interface FileOptions extends DirOptions {
  discardDescriptor?: boolean;
  detachDescriptor?: boolean;
}

type CleanupCallback = (next?: Function) => void;

type FileCallback = (err?: Error, name?: string, fd?: number, cb?: CleanupCallback) => void;

type DirCallback = (err?: Error, name?: string, cb?: CleanupCallback) => void;

type TmpNameCallback = (err?: Error, name?: string) => void;

type RemoveCallback = (args?: any) => void;

/*
 * Module dependencies.
 */
import fs = require('fs');
import path = require('path');
import cryptoLib = require('crypto');
import constants = require('constants');

const osTmpDir = require('os-tmpdir');

/*
 * The working inner variables.
 */
const
  /**
   * The temporary directory.
   * @type {string}
   */
  tmpDir = osTmpDir(),

  // the random characters to choose from
  RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

  TEMPLATE_PATTERN = /XXXXXX/,

  DEFAULT_TRIES = 3,

  CREATE_FLAGS = constants.O_CREAT | constants.O_EXCL | constants.O_RDWR,

  DIR_MODE = 448 /* 0o700 */,
  FILE_MODE = 384 /* 0o600 */,

  // this will hold the objects need to be removed on exit
  _removeObjects: CleanupCallback[] = [];

var
  _gracefulCleanup = false,
  _uncaughtException = false;

/**
 * Random name generator based on crypto.
 * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
 *
 * @param {number} howMany
 * @returns {string} the generated random name
 * @private
 */
function _randomChars(howMany: number) {
  var
    value = [],
    rnd = null;

  // make sure that we do not fail because we ran out of entropy
  try {
    rnd = cryptoLib.randomBytes(howMany);
  } catch (e) {
    rnd = cryptoLib.pseudoRandomBytes(howMany);
  }

  for (var i = 0; i < howMany; i++) {
    value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
  }

  return value.join('');
}

/**
 * Checks whether the `obj` parameter is defined or not.
 *
 * @param {Object} obj
 * @returns {boolean} true if the object is undefined
 * @private
 */
function _isUndefined(obj: any) {
  return typeof obj === 'undefined';
}

/**
 * Generates a new temporary name.
 *
 * @param {Object} opts
 * @returns {string} the new random name according to opts
 * @private
 */
function _generateTmpName(opts: Options) {
  if (opts.name) {
    return path.join(opts.dir || tmpDir, opts.name);
  }

  // mkstemps like template
  if (opts.template) {
    return opts.template.replace(TEMPLATE_PATTERN, _randomChars(6));
  }

  // prefix and postfix
  const name = [
    opts.prefix || 'tmp-',
    process.pid,
    _randomChars(12),
    opts.postfix || ''
  ].join('');

  return path.join(opts.dir || tmpDir, name);
}

/**
 * Gets a temporary file name.
 *
 * @param {(Options|tmpNameCallback)} options options or callback
 * @param {?tmpNameCallback} callback the callback function
 */
function tmpName(callbackOrOptions: Options | TmpNameCallback, callback?: TmpNameCallback) {
  const emptyOptions = {} as Options;
  const emptyCallback = function() {};

  let opts: Options;
  let cb: TmpNameCallback;

  if (typeof callbackOrOptions == 'function') {
    opts = emptyOptions;
    cb = callbackOrOptions;
  } else {
    opts = callbackOrOptions;
    cb = callback || emptyCallback;
  }

  let tries = opts.tries || DEFAULT_TRIES;

  if (isNaN(tries) || tries < 0)
    return cb(new Error('Invalid tries'));

  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
    return cb(new Error('Invalid template provided'));

  (function _getUniqueName() {
    const name = _generateTmpName(opts);

    // check whether the path exists then retry if needed
    fs.stat(name, function (err) {
      if (!err) {
        if (tries-- > 0) return _getUniqueName();

        return cb(new Error('Could not get a unique tmp filename, max tries reached ' + name));
      }

      cb(undefined, name);
    });
  }());
}

/**
 * Synchronous version of tmpName.
 *
 * @param {Object} options
 * @returns {string} the generated random name
 * @throws {Error} if the options are invalid or could not generate a filename
 */
function tmpNameSync(options?: Options) {
  const opts: Options = typeof options == 'undefined' ? {} : options;

  let tries = opts.tries || DEFAULT_TRIES;

  if (isNaN(tries) || tries < 0)
    throw new Error('Invalid tries');

  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
    throw new Error('Invalid template provided');

  do {
    const name = _generateTmpName(opts);
    try {
      fs.statSync(name);
    } catch (e) {
      return name;
    }
  } while (tries-- > 0);

  throw new Error('Could not get a unique tmp filename, max tries reached');
}

/**
 * Creates and opens a temporary file.
 *
 * @param {(Options|fileCallback)} options the config options or the callback function
 * @param {?fileCallback} callback
 */
function file(callbackOrOptions: FileOptions | FileCallback, callback?: FileCallback) {
  const emptyOptions = {} as FileOptions;
  const emptyCallback = function() {};

  let opts: FileOptions;
  let cb: FileCallback;

  if (typeof callbackOrOptions == 'function') {
    opts = emptyOptions;
    cb = callbackOrOptions;
  } else {
    opts = callbackOrOptions;
    cb = callback || emptyCallback;
  }

  opts.postfix = (_isUndefined(opts.postfix)) ? '.tmp' : opts.postfix;

  // gets a temporary filename
  tmpName(opts, function _tmpNameCreated(err, name) {
    if (err || typeof name == 'undefined') return cb(err || new Error('Undefined name'));

    // create and open the file
    fs.open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err, fd) {
      if (err) return cb(err);

      if (opts.discardDescriptor) {
        return fs.close(fd, function _discardCallback(err) {
          if (err) {
            // Low probability, and the file exists, so this could be
            // ignored.  If it isn't we certainly need to unlink the
            // file, and if that fails too its error is more
            // important.
            try {
              fs.unlinkSync(name);
            } catch (e) {
              if (!isENOENT(e)) {
                err = e;
              }
            }
            return cb(err);
          }
          cb(undefined, name, undefined, _prepareTmpFileRemoveCallback(name, -1, opts));
        });
      }

      if (opts.detachDescriptor) {
        return cb(undefined, name, fd, _prepareTmpFileRemoveCallback(name, -1, opts));
      }

      cb(undefined, name, fd, _prepareTmpFileRemoveCallback(name, fd, opts));
    });
  });
}

/**
 * Synchronous version of file.
 *
 * @param {Options} options
 * @returns {FileSyncObject} object consists of name, fd and removeCallback
 * @throws {Error} if cannot create a file
 */
function fileSync(options: FileOptions) {
  const opts: FileOptions = typeof options == 'undefined' ? {} : options;

  opts.postfix = opts.postfix || '.tmp';

  const name = tmpNameSync(opts);
  const fd = fs.openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);

  return {
    name: name,
    fd: fd,
    removeCallback: _prepareTmpFileRemoveCallback(name, fd, opts)
  };
}

/**
 * Removes files and folders in a directory recursively.
 *
 * @param {string} root
 * @private
 */
function _rmdirRecursiveSync(root: string) {
  const dirs = [root];

  do {
    let
      dir = dirs.pop(),
      deferred = false;

    if (typeof dir == 'undefined') break;

    let files = fs.readdirSync(dir);

    for (var i = 0, length = files.length; i < length; i++) {
      var
        file = path.join(dir, files[i]),
        stat = fs.lstatSync(file); // lstat so we don't recurse into symlinked directories

      if (stat.isDirectory()) {
        if (!deferred) {
          deferred = true;
          dirs.push(dir);
        }
        dirs.push(file);
      } else {
        fs.unlinkSync(file);
      }
    }

    if (!deferred) {
      fs.rmdirSync(dir);
    }
  } while (dirs.length !== 0);
}

/**
 * Creates a temporary directory.
 *
 * @param {(Options|dirCallback)} options the options or the callback function
 * @param {?dirCallback} callback
 */
function dir(callbackOrOptions: DirOptions | DirCallback, callback?: DirCallback) {
  const emptyOptions = {} as DirOptions;
  const emptyCallback = function() {};

  let opts: DirOptions;
  let cb: DirCallback;

  if (typeof callbackOrOptions == 'function') {
    opts = emptyOptions;
    cb = callbackOrOptions;
  } else {
    opts = callbackOrOptions;
    cb = callback || emptyCallback;
  }

  // gets a temporary filename
  tmpName(opts, function _tmpNameCreated(err, name) {
    if (err || typeof name == 'undefined') return cb(err || new Error('Undefined name'));

    // create the directory
    fs.mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err) {
      if (err) return cb(err);

      cb(undefined, name, _prepareTmpDirRemoveCallback(name, opts));
    });
  });
}

/**
 * Synchronous version of dir.
 *
 * @param {Options} options
 * @returns {DirSyncObject} object consists of name and removeCallback
 * @throws {Error} if it cannot create a directory
 */
function dirSync(options: DirOptions) {
  const opts: DirOptions = typeof options == 'undefined' ? {} : options;

  const name = tmpNameSync(opts);
  fs.mkdirSync(name, opts.mode || DIR_MODE);

  return {
    name: name,
    removeCallback: _prepareTmpDirRemoveCallback(name, opts)
  };
}

/**
 * Prepares the callback for removal of the temporary file.
 *
 * @param {string} name the path of the file
 * @param {number} fd file descriptor
 * @param {Object} opts
 * @returns {fileCallback}
 * @private
 */
function _prepareTmpFileRemoveCallback(name: string, fd: number, opts: FileOptions): CleanupCallback {
  const removeCallback = _prepareRemoveCallback(function _removeCallback(fdPath: [number, string]) {
    try {
      if (0 <= fdPath[0]) {
        fs.closeSync(fdPath[0]);
      }
    }
    catch (e) {
      // under some node/windows related circumstances, a temporary file
      // may have not be created as expected or the file was already closed
      // by the user, in which case we will simply ignore the error
      if (!isEBADF(e) && !isENOENT(e)) {
        // reraise any unanticipated error
        throw e;
      }
    }
    try {
      fs.unlinkSync(fdPath[1]);
    }
    catch (e) {
      if (!isENOENT(e)) {
        // reraise any unanticipated error
        throw e;
      }
    }
  }, [fd, name]);

  if (!opts.keep) {
    _removeObjects.unshift(removeCallback);
  }

  return removeCallback;
}

/**
 * Prepares the callback for removal of the temporary directory.
 *
 * @param {string} name
 * @param {Object} opts
 * @returns {Function} the callback
 * @private
 */
function _prepareTmpDirRemoveCallback(name: string, opts: DirOptions) {
  const removeFunction = opts.unsafeCleanup ? _rmdirRecursiveSync : fs.rmdirSync.bind(fs);
  const removeCallback = _prepareRemoveCallback(removeFunction, name);

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
 * @private
 */
function _prepareRemoveCallback<T>(removeFunction: (_: T) => void, arg: T): CleanupCallback {
  var called = false;

  return function _cleanupCallback(next) {
    if (!called) {
      const index = _removeObjects.indexOf(_cleanupCallback);
      if (index >= 0) {
        _removeObjects.splice(index, 1);
      }

      called = true;
      removeFunction(arg);
    }

    if (next) next(null);
  };
}

/**
 * The garbage collector.
 *
 * @private
 */
function _garbageCollector() {
  if (_uncaughtException && !_gracefulCleanup) {
    return;
  }

  // the function being called removes itself from _removeObjects,
  // loop until _removeObjects is empty
  while (_removeObjects.length) {
    try {
      _removeObjects[0].call(null);
    } catch (e) {
      // already removed?
    }
  }
}

/**
 * Helper for testing against EBADF to compensate changes made to Node 7.x under Windows.
 */
function isEBADF(error: any) {
  return isExpectedError(error, 'EBADF');
}

/**
 * Helper for testing against ENOENT to compensate changes made to Node 7.x under Windows.
 */
function isENOENT(error: any) {
  return isExpectedError(error, 'EBADF');
}

/**
 * Helper to determine whether the expected error code matches the actual code and errno,
 * which will differ between the supported node versions.
 *
 * - Node >= 7.0:
 *   error.code {String}
 *   error.errno {String|Number} any numerical value will be negated
 *
 * - Node >= 6.0 < 7.0:
 *   error.code {String}
 *   error.errno {Number} negated
 *
 * - Node >= 4.0 < 6.0: introduces SystemError
 *   error.code {String}
 *   error.errno {Number} negated
 *
 * - Node >= 0.10 < 4.0:
 *   error.code {Number} negated
 *   error.errno n/a
 */
function isExpectedError(error: any, code: string) {
  return error.code == code;
}

/**
 * Sets the graceful cleanup.
 *
 * Also removes the created files and directories when an uncaught exception occurs.
 */
function setGracefulCleanup() {
  _gracefulCleanup = true;
}

const version = process.versions.node.split('.').map(function (value) {
  return parseInt(value, 10);
});

if (version[0] === 0 && (version[1] < 9 || version[1] === 9 && version[2] < 5)) {
  process.addListener('uncaughtException', function _uncaughtExceptionThrown(err) {
    _uncaughtException = true;
    _garbageCollector();

    throw err;
  });
}

process.addListener('exit', function _exit(code) {
  if (code) _uncaughtException = true;
  _garbageCollector();
});

/**
 * Configuration options.
 *
 * @typedef {Object} Options
 * @property {?number} tries the number of tries before give up the name generation
 * @property {?string} template the "mkstemp" like filename template
 * @property {?string} name fix name
 * @property {?string} dir the tmp directory to use
 * @property {?string} prefix prefix for the generated name
 * @property {?string} postfix postfix for the generated name
 */

/**
 * @typedef {Object} FileSyncObject
 * @property {string} name the name of the file
 * @property {string} fd the file descriptor
 * @property {fileCallback} removeCallback the callback function to remove the file
 */

/**
 * @typedef {Object} DirSyncObject
 * @property {string} name the name of the directory
 * @property {fileCallback} removeCallback the callback function to remove the directory
 */

/**
 * @callback tmpNameCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 */

/**
 * @callback fileCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {number} fd the file descriptor
 * @param {cleanupCallback} fn the cleanup callback function
 */

/**
 * @callback dirCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {cleanupCallback} fn the cleanup callback function
 */

/**
 * Removes the temporary created file or directory.
 *
 * @callback cleanupCallback
 * @param {simpleCallback} [next] function to call after entry was removed
 */

/**
 * Callback function for function composition.
 * @see {@link https://github.com/raszi/node-tmp/issues/57|raszi/node-tmp#57}
 *
 * @callback simpleCallback
 */

// exporting all the needed methods
module.exports.tmpdir = tmpDir;

module.exports.dir = dir;
module.exports.dirSync = dirSync;

module.exports.file = file;
module.exports.fileSync = fileSync;

module.exports.tmpName = tmpName;
module.exports.tmpNameSync = tmpNameSync;

module.exports.setGracefulCleanup = setGracefulCleanup;
