var
  fs     = require('fs'),
  path   = require('path'),

  _      = require('underscore');

/**
 * Gets the temp directory.
 */
var MAX_REMOVE_LISTENERS = 100;

var TMP = (function _getTMPDir() {
  var tmpVar = _.detect([ 'TMPDIR', 'TMP', 'TEMP' ], function (varName) {
    return process.env[varName];
  });

  return process.env[tmpVar] || '/tmp/';
}());

function _parseOptions(options, maximalTries, callback) {
  if (!callback || typeof callback != "function") {
    callback = maximalTries;
    maximalTries = 3;
  }
  if (!callback || typeof callback != "function") {
    callback = options;
    options = {};
  }

  return [ options, maximalTries, callback ];
}

/**
 * Gets the temporary file name.
 */
function _getTmpName(tmp, prefix, postfix) {
  var name =
    [
      (_.isUndefined(prefix)) ? 'tmp-' : prefix,
      process.pid,
      (Math.random() * 0x1000000000).toString(36),
      postfix
    ].join('');

  return path.join(tmp || TMP, name);
}

/**
 * Creates and opens a temporary file.
 */
function _createTmpFile(options, maximalTries, callback) {
  var
    args = _parseOptions(options, maximalTries, callback),
    opts = args[0],
    maxTries = args[1],
    cb = args[2],

    filePostFix = (_.isUndefined(opts.postfix)) ? '.tmp' : opts.postfix,
    remainingTries = (_.isUndefined(maxTries)) ? 3 : maxTries;

  if (remainingTries <= 0) return cb(new Error("Could not create tmp file, max tries reached"));

  // gets the temporary filename
  var name = _getTmpName(opts.tmp, opts.prefix, filePostFix);

  // check for it and create it
  path.exists(name, function _pathExists(exists) {
    if (exists) return _createTmpFile(--remainingTries, opts, cb);

    fs.open(name, 'w', opts.mode || 0600, function _fileCreated(err, fd) {
      if (err) return cb(err);

      if (_.isUndefined(opts.unlink) || opts.unlink) _onExit(fs.unlinkSync, name);
      cb(null, name, fd);
    });
  });
}

/**
 * Creates a temporary directory.
 */
function _createTmpDir(options, maximalTries, callback) {
  var
    args = _parseOptions(options, maximalTries, callback),
    opts = args[0],
    maxTries = args[1],
    cb = args[2],

    dirPostfix = (_.isUndefined(opts.postfix)) ? '' : opts.postfix;
    remainingTries = (_.isUndefined(maxTries)) ? 3 : maxTries;

  if (remainingTries <= 0) return cb(new Error("Could not create tmp directory, max tries reached"));

  var name = _getTmpName(opts.tmp, opts.prefix, dirPostfix);

  // check for it and create it
  path.exists(name, function _pathExists(exists) {
    if (exists) return _createTmpDir(opts, --remainingTries, cb);

    fs.mkdir(name, opts.mode || 0700, function _dirCreated(err) {
      if (err) return cb(err);

      if (_.isUndefined(opts.unlink) || opts.unlink) _onExit(fs.rmdirSync, name);
      cb(null, name);
    });
  });
}

/**
 * Removes the created items.
 */
function _onExit(func, path) {
  process.setMaxListeners(MAX_REMOVE_LISTENERS);

  process.addListener('exit', function() {
    try {
      func(path);
    } catch (e) {
      /* already removed */
    }
  });
}

module.exports.dir = _createTmpDir;
module.exports.file = _createTmpFile;
