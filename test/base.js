var
  assert = require('assert'),
  path   = require('path'),
  spawn   = require('child_process').spawn,
  tmp    = require('../lib/tmp');

// make sure that we do not test spam the global tmp
tmp.TMP_DIR = './tmp';

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

function _spawnTestWithError(testFile, params, cb) {
  _spawnTest(true, testFile, params, cb);
}

function _spawnTestWithoutError(testFile, params, cb) {
  _spawnTest(false, testFile, params, cb);
}

function _spawnTest(passError, testFile, params, cb) {
  var
    node_path = process.argv[0],
    command_args = [ path.join(__dirname, testFile) ].concat(params),
    stdoutBufs = [],
    stderrBufs = [],
    child,
    done = false,
    stderrDone = false,
    stdoutDone = false;

  // spawn doesn’t have the quoting problems that exec does,
  // especially when going for Windows portability.
  child = spawn(node_path, command_args);
  child.stdin.end();
  // Cannot use 'close' event because not on node-0.6.
  function _close() {
    var
      stderr = _bufferConcat(stderrBufs),
      stdout = _bufferConcat(stdoutBufs);
    if (stderrDone && stdoutDone && !done) {
      done = true;
      if (passError) {
        if (stderr.length > 0) {
          return cb(stderr.toString());
        }
      }
      return cb(null, _bufferConcat(stdoutBufs).toString());
    }
  }
  if (passError) {
    child.on('error', function _spawnError(err) {
      if (!done) {
        done = true;
        cb(err);
      }
    });
  }
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

function _testStat(stat, mode) {
  // getuid() and getgid() do not exist on Windows.
  if (process.getuid) {
    assert.equal(stat.uid, process.getuid(), 'should have the same UID');
  }
  if (process.getgid) {
    assert.equal(stat.gid, process.getgid(), 'should have the same GUID');
  }
  // mode values do not work properly on Windows. Ignore “group” and
  // “other” bits then. Ignore execute bit on that platform because it
  // doesn’t exist—even for directories.
  if (process.platform == 'win32') {
    assert.equal(stat.mode & 0666600, mode & 0666600);
  } else {
    assert.equal(stat.mode, mode);
  }
}

function _testPrefix(prefix) {
  return function _testPrefixGenerated(err, name) {
    assert.equal(path.basename(name).slice(0, prefix.length), prefix, 'should have the provided prefix');
  };
}

function _testPrefixSync(prefix) {
  return function _testPrefixGeneratedSync(result) {
    if (result instanceof Error) {
      throw result;
    }
    _testPrefix(prefix)(null, result.name, result.fd);
  };
}

function _testPostfix(postfix) {
  return function _testPostfixGenerated(err, name) {
    assert.equal(name.slice(name.length - postfix.length, name.length), postfix, 'should have the provided postfix');
  };
}

function _testPostfixSync(postfix) {
  return function _testPostfixGeneratedSync(result) {
    if (result instanceof Error) {
      throw result;
    }
    _testPostfix(postfix)(null, result.name, result.fd);
  };
}

function _testKeep(type, keep, cb) {
  _spawnTestWithError('keep.js', [ type, keep ], cb);
}

function _testKeepSync(type, keep, cb) {
  _spawnTestWithError('keep-sync.js', [ type, keep ], cb);
}

function _testGraceful(type, graceful, cb) {
  _spawnTestWithoutError('graceful.js', [ type, graceful ], cb);
}

function _testGracefulSync(type, graceful, cb) {
  _spawnTestWithoutError('graceful-sync.js', [ type, graceful ], cb);
}

function _assertNoDescriptor(err, name, fd) {
  assert.strictEqual(fd, undefined);
}

function _assertName(err, name) {
  assert.isString(name);
  assert.isNotZero(name.length, 'an empty string is not a valid name');
}

function _assertNameSync(result) {
  if (result instanceof Error) {
    throw result;
  }
  var name = typeof(result) == 'string' ? result : result.name;
  _assertName(null, name);
}

function _testName(expected){
  return function _testNameGenerated(err, name) {
    assert.equal(expected, name, 'should have the provided name');
  };
}

function _testNameSync(expected){
  return function _testNameGeneratedSync(result) {
    if (result instanceof Error) {
      throw result;
    }
    _testName(expected)(null, result.name, result.fd);
  };
}

function _testUnsafeCleanup(unsafe, cb) {
  _spawnTestWithoutError('unsafe.js', [ 'dir', unsafe ], cb);
}

function _testIssue62(cb) {
  _spawnTestWithoutError('issue62.js', [], cb);
}

function _testUnsafeCleanupSync(unsafe, cb) {
  _spawnTestWithoutError('unsafe-sync.js', [ 'dir', unsafe ], cb);
}

function _testIssue62Sync(cb) {
  _spawnTestWithoutError('issue62-sync.js', [], cb);
}

function _testIssue115File(cb) {
  _spawnTestWithError('issue115-file.js', [], cb);
}

function _testIssue115FileSync(cb) {
  _spawnTestWithError('issue115-file-sync.js', [], cb);
}

module.exports.testStat = _testStat;
module.exports.testPrefix = _testPrefix;
module.exports.testPrefixSync = _testPrefixSync;
module.exports.testPostfix = _testPostfix;
module.exports.testPostfixSync = _testPostfixSync;
module.exports.testKeep = _testKeep;
module.exports.testKeepSync = _testKeepSync;
module.exports.testGraceful = _testGraceful;
module.exports.testGracefulSync = _testGracefulSync;
module.exports.assertName = _assertName;
module.exports.assertNameSync = _assertNameSync;
module.exports.assertNoDescriptor = _assertNoDescriptor;
module.exports.testName = _testName;
module.exports.testNameSync = _testNameSync;
module.exports.testUnsafeCleanup = _testUnsafeCleanup;
module.exports.testIssue62 = _testIssue62;
module.exports.testIssue115File = _testIssue115File;
module.exports.testIssue115FileSync = _testIssue115FileSync;
module.exports.testUnsafeCleanupSync = _testUnsafeCleanupSync;
module.exports.testIssue62Sync = _testIssue62Sync;
