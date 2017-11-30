// vim: expandtab:ts=2:sw=2

const
  fs = require('fs'),
  path = require('path'),
  existsSync = fs.existsSync || path.existsSync,
  spawn = require('child_process').spawn;


module.exports.genericChildProcess = function spawnGenericChildProcess(configFile, cb) {
  const 
    configFilePath = path.join(__dirname, 'outband', configFile),
    command_args = [path.join(__dirname, 'spawn-generic.js'), configFilePath];

  // make sure that the config file exists
  if (!existsSync(configFilePath))
    return cb(new Error('ENOENT: configFile ' + configFilePath + ' does not exist'));

  _do_spawn(command_args, cb);
};

module.exports.childProcess = function spawnChildProcess(configFile, cb, detach) {
  var
    configFilePath = path.join(__dirname, 'outband', configFile),
    command_args = [path.join(__dirname, 'spawn-custom.js'), configFilePath];

  // make sure that the config file exists
  if (!existsSync(configFilePath))
    return cb(new Error('ENOENT: configFile ' + configFilePath + ' does not exist'));

  if (arguments.length > 2) {
    for (var i=2; i < arguments.length; i++) {
      command_args.push(arguments[i]);
    }
  }

  _do_spawn(command_args, cb, detach);
}

function _do_spawn(command_args, cb, detach) {
  const
    node_path = process.argv[0],
    stdoutBufs = [],
    stderrBufs = [];

  var
    child,
    done = false,
    stderrDone = false,
    stdoutDone = false;

  // spawn doesn’t have the quoting problems that exec does,
  // especially when going for Windows portability.
  child = spawn(node_path, command_args, detach ? { detached: true } : undefined);
  child.stdin.end();
  // TODO:we no longer support node <0.10.0
  // Cannot use 'close' event because not on node-0.6.
  function _close() {
    const
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

