var
  assert = require('assert'),
  path   = require('path');

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

module.exports.testStat = _testStat;
module.exports.testPrefix = _testPrefix;
module.exports.testPostfix = _testPostfix;
