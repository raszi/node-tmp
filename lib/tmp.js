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

var
  randomChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
  randomCharsLength = randomChars.length,

  _removeObjects = [];

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
function _getTmpName(opts, cb) {
  var
    template = opts.template,
    templateDefined = !_isUndefined(template),
    tries = opts.tries || 3;

  if (tries < 0)
    return cb(new Error('Invalid tries'));

  if (templateDefined && !template.match(/XXXXXX/))
    return cb(new Error('Invalid template provided'));

  function _getName() {
    
    // prefix and postfix
    if (!templateDefined) {
      var name = [
        (_isUndefined(opts.prefix)) ? 'tmp-' : opts.prefix,
        process.pid,
        (Math.random() * 0x1000000000).toString(36),
        opts.postfix
      ].join('');

      return path.join(opts.dir || _TMP, name);
    }

    // mkstemps like template
    var chars = [];

    for (var i = 0; i < 6; i++) {
      chars.push(
        randomChars.substr(Math.floor(Math.random() * randomCharsLength), 1));
    }

    return template.replace(/XXXXXX/, chars.join(''));
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
    cb = args[1];

    opts.postfix = (_isUndefined(opts.postfix)) ? '.tmp' : opts.postfix;

  // gets the temporary filename
  _getTmpName(opts, function _tmpNameCreated(err, name) {
    if (err) return cb(err);

    // create and open the file
    fs.open(name, 'w+', opts.mode || 0600, function _fileCreated(err, fd) {
      if (err) return cb(err);

      if (_isUndefined(opts.unlink) || opts.unlink)
        _removeObjects.push([ fs.unlinkSync, name ]);

      cb(null, name, fd);
    });
  });
}

/**
 * Creates a temporary directory.
 */
function _createTmpDir(options, callback) {
  var
    args = _parseOptions(options, callback),
    opts = args[0],
    cb = args[1];

  // gets the temporary filename
  _getTmpName(opts, function _tmpNameCreated(err, name) {
    if (err) return cb(err);

    // create the directory
    fs.mkdir(name, opts.mode || 0700, function _dirCreated(err) {
      if (err) return cb(err);

      if (_isUndefined(opts.unlink) || opts.unlink)
        _removeObjects.push([ fs.rmdirSync, name ]);

      cb(null, name);
    });
  });
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
