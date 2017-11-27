// vim: expandtab:ts=2:sw=2

var
  fs = require('fs'),
  path = require('path'),
  tmp = require('../lib/tmp');

function _writeSync(stream, str, cb) {
  var flushed = stream.write(str);
  if (flushed) {
    return cb(null);
  }

  stream.once('drain', function _flushed() {
console.log('draining');
    cb(null);
  });
}

var spawn = {
  out: function (str, cb) {
    cb = cb || spawn.exit;
    _writeSync(process.stdout, str, cb);
  },
  err: function (errOrStr, cb) {
    cb = cb || spawn.exit;
    if (!config.graceful) _writeSync(process.stderr, (errOrStr instanceof Error) ? errOrStr.toString() : errOrStr, cb);
    else cb();
  },
  exit: function (code) {
    process.exit(code || 0);
  },
  kill: function (signal) {
    process.kill(signal || 'SIGINT');
  }
};

var config = {};
try {
  var contents = fs.readFileSync(path.join(__dirname, process.argv[2]));
  config = JSON.parse(contents);
}
catch (err) {
  spawn.err(err);
}

var fnUnderTest = null;

if (config.async) fnUnderTest = (config.file) ? tmp.file : tmp.dir;
else fnUnderTest = (config.file) ? tmp.fileSync : tmp.dirSync;

// do we test against tmp doing a graceful cleanup?
if (config.graceful) tmp.setGracefulCleanup();

// import the test case function and execute it
var fn = require(path.join(__dirname, 'outband', config.tc));
if (config.async)
  fnUnderTest(config.options, function (err, name, fdOrCallback, cb) {
    if (err) spawn.err(err);
    else {
      var result = null; 
      if (config.file) result = {name: name, fd: fdOrCallback, removeCallback: cb};
      else result = {name: name, removeCallback: fdOrCallback};
      fn.apply(spawn, [result, tmp]);
    }
  });
else {
  var result = null;
  var err = null;
  result = fnUnderTest(config.options);
  fn.apply(spawn, [result, tmp]);
}

