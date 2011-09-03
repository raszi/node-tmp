var
  vows   = require('vows'),
  assert = require('assert'),

  path   = require('path'),
  fs     = require('fs'),

  tmp    = require('../lib/tmp.js'),
  Test   = require('./base.js');


function _testFile(mode) {
  return function _testFileGenerated(err, name, fd) {
    assert.ok(path.existsSync(name), 'Should exists');

    var stat = fs.statSync(name);
    assert.equal(stat.size, 0, 'Should have zero size');
    assert.ok(stat.isFile(), 'Should be a file');

    Test.testStat(stat, mode);

    // check with fstat as well (fd checking)
    var fstat = fs.fstatSync(fd);
    assert.deepEqual(fstat, stat, 'fstat results should be the same');
  };
}

vows.describe('File creation').addBatch({
  'when using without parameters': {
    topic: function () {
      tmp.file(this.callback);
    },

    'should be a file': _testFile(0100600),
    'should have the default prefix': Test.testPrefix('tmp-'),
    'should have the default postfix': Test.testPostfix('.tmp')
  },

  'when using with prefix': {
    topic: function () {
      tmp.file({ prefix: 'something' }, this.callback);
    },

    'should be a file': _testFile(0100600),
    'should have the provided prefix': Test.testPrefix('something')
  },

  'when using with postfix': {
    topic: function () {
      tmp.file({ postfix: '.txt' }, this.callback);
    },

    'should be a file': _testFile(0100600),
    'should have the provided postfix': Test.testPostfix('.txt')

  },

  'when using multiple options': {
    topic: function () {
      tmp.file({ prefix: 'foo', postfix: 'bar', mode: 0640 }, this.callback);
    },

    'should be a file': _testFile(0100640),
    'should have the provided prefix': Test.testPrefix('foo'),
    'should have the provided postfix': Test.testPostfix('bar')
  },

  'when using multiple options and mode': {
    topic: function () {
      tmp.file({ prefix: 'complicated', postfix: 'options', mode: 0644 }, this.callback);
    },

    'should be a file': _testFile(0100644),
    'should have the provided prefix': Test.testPrefix('complicated'),
    'should have the provided postfix': Test.testPostfix('options')
  },

  'no tries': {
    topic: function () {
      tmp.file({ tries: -1 }, this.callback);
    },

    'should not be created': function (err, name) {
      assert.isObject(err);
    }
  }
}).export(module);
