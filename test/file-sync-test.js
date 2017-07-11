/* eslint-disable no-octal */

var
  vows   = require('vows'),
  assert = require('assert'),

  path       = require('path'),
  fs         = require('fs'),
  existsSync = fs.existsSync || path.existsSync,

  tmp    = require('../lib/tmp.js'),
  Test   = require('./base.js');


function _testFile(mode, fdTest) {
  return function _testFileGenerated(result) {
    assert.ok(existsSync(result.name), 'should exist');

    var stat = fs.statSync(result.name);
    assert.equal(stat.size, 0, 'should have zero size');
    assert.ok(stat.isFile(), 'should be a file');

    Test.testStat(stat, mode);

    // check with fstat as well (fd checking)
    if (fdTest) {
      var fstat = fs.fstatSync(result.fd);
      assert.deepEqual(fstat, stat, 'fstat results should be the same');

      var data = new Buffer('something');
      assert.equal(fs.writeSync(result.fd, data, 0, data.length, 0), data.length, 'should be writable');
      assert.ok(!fs.closeSync(result.fd), 'should not return with error');
    }
  };
}

function _testFileNoDescriptor(mode) {
  return function _testFileNoDescriptor(result) {
    assert.ok(existsSync(result.name), 'should exist');

    var stat = fs.statSync(result.name);
    assert.equal(stat.size, 0, 'should have zero size');
    assert.ok(stat.isFile(), 'should be a file');

    Test.testStat(stat, mode);

    assert.strictEqual(result.fd, undefined);
  };
}

function _testFileAfterDetachRemove(mode) {
  return function _testFileAfterDetachRemove(result) {
    assert.ok(!existsSync(result.name), 'File should be removed');

    var fstat = fs.fstatSync(result.fd);
    assert.equal(fstat.size, 0, 'should have zero size');
    assert.ok(fstat.isFile(), 'should be a file');
    Test.testStat(fstat, mode);

    var data = new Buffer('something');
    assert.equal(fs.writeSync(result.fd, data, 0, data.length, 0), data.length, 'should be writable');
    assert.ok(!fs.closeSync(result.fd), 'should not return with error');
  };
}

vows.describe('Synchronous file creation').addBatch({
  'when using without parameters': {
    topic: function () {
      return tmp.fileSync();
    },

    'should return with a name': Test.assertNameSync,
    'should be a file': _testFile(0100600, true),
    'should have the default prefix': Test.testPrefixSync('tmp-'),
    'should have the default postfix': Test.testPostfixSync('.tmp')
  },

  'when using with prefix': {
    topic: function () {
      return tmp.fileSync({ prefix: 'something' });
    },

    'should return with a name': Test.assertNameSync,
    'should be a file': _testFile(0100600, true),
    'should have the provided prefix': Test.testPrefixSync('something')
  },

  'when using with postfix': {
    topic: function () {
      return tmp.fileSync({ postfix: '.txt' });
    },

    'should return with a name': Test.assertNameSync,
    'should be a file': _testFile(0100600, true),
    'should have the provided postfix': Test.testPostfixSync('.txt')
  },

  'when using template': {
    topic: function () {
      return tmp.fileSync({ template: 'clike-XXXXXX-postfix' });
    },

    'should return with a name': Test.assertNameSync,
    'should be a file': _testFile(0100600, true),
    'should have the provided prefix': Test.testPrefixSync('clike-'),
    'should have the provided postfix': Test.testPostfixSync('-postfix')
  },

  'when using name': {
    topic: function () {
      return tmp.fileSync({ name: 'using-name-sync.tmp' });
    },

    'should return with a name': Test.assertNameSync,
    'should have the provided name': Test.testNameSync(path.join(tmp.tmpdir, 'using-name-sync.tmp')),
    'should be a file': function (result) {
      _testFile(0100600, true);
      fs.unlinkSync(result.name);
    }
  },

  'when using multiple options': {
    topic: function () {
      return tmp.fileSync({ prefix: 'foo', postfix: 'bar', mode: 0640 });
    },

    'should return with a name': Test.assertNameSync,
    'should be a file': _testFile(0100640, true),
    'should have the provided prefix': Test.testPrefixSync('foo'),
    'should have the provided postfix': Test.testPostfixSync('bar')
  },

  'when using multiple options and mode': {
    topic: function () {
      return tmp.fileSync({ prefix: 'complicated', postfix: 'options', mode: 0644 });
    },

    'should return with a name': Test.assertNameSync,
    'should be a file': _testFile(0100644, true),
    'should have the provided prefix': Test.testPrefixSync('complicated'),
    'should have the provided postfix': Test.testPostfixSync('options')
  },

  'no tries': {
    topic: function () {
      try {
        return tmp.fileSync({ tries: -1 });
      }
      catch (e) {
        return e;
      }
    },

    'should return with an error': function (topic) {
      assert.instanceOf(topic, Error);
    }
  },

  'keep testing': {
    topic: function () {
      Test.testKeepSync('file', '1', this.callback);
    },

    'should not return with an error': assert.isNull,
    'should return with a name': Test.assertName,
    'should be a file': function (err, name) {
      _testFile(0100600, false)({name:name});
      fs.unlinkSync(name);
    }
  },

  'unlink testing': {
    topic: function () {
      Test.testKeepSync('file', '0', this.callback);
    },

    'should not return with an error': assert.isNull,
    'should return with a name': Test.assertName,
    'should not exist': function (err, name) {
      assert.ok(!existsSync(name), 'File should be removed');
    }
  },

  'non graceful testing': {
    topic: function () {
      Test.testGracefulSync('file', '0', this.callback);
    },

    'should not return with error': assert.isNull,
    'should return with a name': Test.assertName,
    'should be a file': function (err, name) {
      _testFile(0100600, false)({name:name});
      fs.unlinkSync(name);
    }
  },

  'graceful testing': {
    topic: function () {
      Test.testGracefulSync('file', '1', this.callback);
    },

    'should not return with an error': assert.isNull,
    'should return with a name': Test.assertName,
    'should not exist': function (err, name) {
      assert.ok(!existsSync(name), 'File should be removed');
    }
  },

  'remove callback': {
    topic: function () {
      return tmp.fileSync();
    },

    'should return with a name': Test.assertNameSync,
    'removeCallback should remove file': function (result) {
      result.removeCallback();
      assert.ok(!existsSync(result.name), 'File should be removed');
    }
  },

  'when using discardDescriptor': {
    topic: function () {
      return tmp.fileSync({ discardDescriptor: true });
    },

    'should return with a name': Test.assertNameSync,
    'should not return with a descriptor': Test.assertNoDescriptorSync,
    'should be a file': _testFileNoDescriptor(0100600),
  },

  'when using detachDescriptor': {
    topic: function () {
      var result = tmp.fileSync({ detachDescriptor: true });
      result.removeCallback();
      return result;
    },

    'should return with a name': Test.assertNameSync,
    'should have working descriptor after removeCallback': _testFileAfterDetachRemove(0100600),
  }

}).exportTo(module);
