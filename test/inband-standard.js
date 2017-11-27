/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

var
  assert = require('assert'),
  fs = require('fs'),
  path = require('path'),
  existsSync = fs.existsSync || path.existsSync,
  assertions = require('./assertions'),
  tmp = require('../lib/tmp');


module.exports = function inbandStandard(isFile, beforeHook) {
  var testMode = isFile ? 0600 : 0700;
  describe('without any parameters', inbandStandardTests({mode: testMode, prefix: 'tmp-'}, null, isFile, beforeHook));
  describe('with prefix', inbandStandardTests({mode: testMode}, {prefix: 'something'}, isFile, beforeHook));
  describe('with postfix', inbandStandardTests({mode: testMode}, {postfix: '.txt'}, isFile, beforeHook));
  describe('with template and no leading path', inbandStandardTests({mode: testMode, prefix: 'clike-', postfix: '-postfix'}, {template: 'clike-XXXXXX-postfix'}, isFile, beforeHook));
  describe('with template and leading path', inbandStandardTests({mode: testMode, prefix: 'clike-', postfix: '-postfix'}, {template: path.join(tmp.tmpdir, 'clike-XXXXXX-postfix')}, isFile, beforeHook));
  describe('with name', inbandStandardTests({mode: testMode}, {name: 'using-name'}, isFile, beforeHook));
  describe('with mode', inbandStandardTests(null, {mode: 0755}, isFile, beforeHook));
  describe('with multiple options', inbandStandardTests(null, {prefix: 'foo', postfix: 'bar', mode: 0750}, isFile, beforeHook));
  if (isFile) {
    describe('with discardDescriptor', inbandStandardTests(null, {mode: testMode, discardDescriptor: true}, isFile, beforeHook));
    describe('with detachDescriptor', inbandStandardTests(null, {mode: testMode, detachDescriptor: true}, isFile, beforeHook));
  }
};


function inbandStandardTests(testOpts, opts, isFile, beforeHook) {
  return function () {
    opts = opts || {};
    testOpts = testOpts || {};

    // topic reference will be created by the beforeHook
    topic = {topic: null, opts: opts};

    // bind everything to topic so we avoid global
    before(beforeHook.bind(topic));

    it('should return a proper result', function () {
      assertions.assertProperResult(this.topic, isFile && !opts.discardDescriptor);
    }.bind(topic));

    it('temporary ' + (isFile ? 'file' : 'directory') + ' should exist', function () {
      assertions.assertExists(this.topic.name, isFile);
    }.bind(topic));

    it('temporary ' + (isFile ? 'file' : 'directory') + ' should have the expected mode', function () {
      assertions.assertMode(this.topic.name, testOpts.mode || opts.mode);
    }.bind(topic));

    if (opts.prefix || testOpts.prefix) {
      it('should have the expected prefix', function () {
        assertions.assertPrefix(this.topic.name, testOpts.prefix || opts.prefix);
      }.bind(topic));
    }

    if (opts.postfix || testOpts.postfix) {
      it('should have the expected postfix', function () {
        assertions.assertPostfix(this.topic.name, testOpts.postfix || opts.postfix);
      }.bind(topic));
    }

    it('should have been created in the expected directory', function () {
      assertions.assertDir(this.topic.name, testOpts.dir || opts.dir || tmp.tmpdir);
    }.bind(topic));

    if (opts.name) {
      it('should have the expected name', function () {
        assertions.assertName(this.topic.name, opts.name);
      }.bind(topic));
    }

    it('should have a working removeCallback', function () {
      this.topic.removeCallback();
      assert.ok(!existsSync(this.topic.name));
    }.bind(topic));
  };
};

