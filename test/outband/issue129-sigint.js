/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

// addendum to https://github.com/raszi/node-tmp/issues/129 so that with jest sandboxing we do not install our sigint
// listener multiple times
module.exports = function () {

  var self = this;

  // simulate an existing SIGINT listener
  process.addListener('SIGINT', function _tmp$sigint_listener() {
    self.out('EOK');
  });

  // now let tmp install its listener safely
  require('../../lib/tmp');

  var sigintListeners = [];

  var listeners = process.listeners('SIGINT');
  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i];
    if (listener.name === '_tmp$sigint_listener') {
      sigintListeners.push(listener);
    }
  }

  if (sigintListeners.length > 1) this.fail('EEXISTS:MULTIPLE: existing SIGINT listener was not removed', this.exit);
  if (sigintListeners.length != 1) this.fail('ENOAVAIL: no SIGINT listener was installed', this.exit);
  // tmp will now exit the process as there are no custom user listeners installed
  sigintListeners[0]();
};
