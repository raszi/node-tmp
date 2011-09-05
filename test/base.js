var
  assert = require('assert'),
  path   = require('path'),
  spawn  = require('child_process').spawn;

function _testStat(stat, mode) {
  assert.equal(stat.uid, process.getuid(), 'Should have the same UID');
  assert.equal(stat.gid, process.getgid(), 'Should have the same GUID');
  assert.equal(stat.mode, mode);
}

function _testPrefix(prefix) {
  return function _testPrefixGenerated(err, name, fd) {
    assert.equal(path.basename(name).slice(0, prefix.length), prefix, 'Should have the provided prefix');
  };
}

function _testPostfix(postfix) {
  return function _testPostfixGenerated(err, name, fd) {
    assert.equal(name.slice(name.length - postfix.length, name.length), postfix, 'Should have the provided postfix');
  };
}

function _testKeep(type, keep, cb) {
  var
    filename,
    cbCalled,
    keepTest = spawn('node', [ path.join(__dirname, 'keep.js'), type, keep ]);

  keepTest.stdout.on('data', function (data) {
    filename = data.toString().replace(/\n/, "");
  });
  keepTest.stderr.on('data', function (data) {
    cbCalled = true;
    cb(new Error(data.toString()));
  });
  keepTest.on('exit', function _exited(code) {
    if (cbCalled) return;

    if (code !== 0) return cb(new Error('Exited with error code: ' + code));

    cb(null, filename);
  });
}

module.exports.testStat = _testStat;
module.exports.testPrefix = _testPrefix;
module.exports.testPostfix = _testPostfix;
module.exports.testKeep = _testKeep;
