// vim: expandtab:ts=2:sw=2

var
  fs = require('fs'),
  path = require('path'),
  existsSync = fs.existsSync || path.existsSync,
  spawn = require('child_process').spawn;


module.exports = function spawnChildProcess(configFile, cb) {
  var
    node_path = process.argv[0],
    command_args = [ path.join(__dirname, 'spawn.js') ].concat(configFile),
    stdoutBufs = [],
    stderrBufs = [],
    child,
    done = false,
    stderrDone = false,
    stdoutDone = false;

  // make sure that the config file exists
  if (!existsSync(path.join(__dirname, configFile)))
    return cb(new Error('ENOENT: configFile ' + path.join(__dirname, configFile) + ' does not exist'));

  // spawn doesn’t have the quoting problems that exec does,
  // especially when going for Windows portability.
  child = spawn(node_path, command_args);
  child.stdin.end();
  // Cannot use 'close' event because not on node-0.6.
  function _close() {
    var
      stderr = _bufferConcat(stderrBufs).toString(),
      stdout = _bufferConcat(stdoutBufs).toString();
    if (stderrDone && stdoutDone && !done) {
      done = true;
      cb(null, stderr, stdout);
    }
  }
  child.on('error', function _spawnError(err) {
    if (!done) {
      done = true;
      cb(err);
    }
  });
  child.stdout.on('data', function _stdoutData(data) {
    stdoutBufs.push(data);
  }).on('close', function _stdoutEnd() {
    stdoutDone = true;
    _close();
  });
  child.stderr.on('data', function _stderrData(data) {
    stderrBufs.push(data);
  }).on('close', function _stderrEnd() {
    stderrDone = true;
    _close();
  });
}


function _bufferConcat(buffers) {
  if (Buffer.concat) {
    return Buffer.concat.apply(this, arguments);
  } else {
    return new Buffer(buffers.reduce(function (acc, buf) {
      for (var i = 0; i < buf.length; i++) {
        acc.push(buf[i]);
      }
      return acc;
    }, []));
  }
}

