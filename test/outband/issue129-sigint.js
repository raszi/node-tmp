/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

// addendum to https://github.com/raszi/node-tmp/issues/129 so that with jest sandboxing we do not install our sigint
// listener multiple times
module.exports = function () {
  var callState = {
    existingListener : false,
  };

  // simulate an existing SIGINT listener
  var listener1 = (function (callState) {
    return function _tmp$sigint_listener(doExit) {
      callState.existingListener = !doExit;
    };
  })(callState);

  process.addListener('SIGINT', listener1);

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

  if (listeners.length > 1) this.fail('EEXISTS:MULTIPLE: existing SIGINT listener was not removed', this.exit);
  listeners[0](false); // prevent listener from exiting the process
  if (!callState.existingListener) this.fail('ENOAVAIL:EXISTING: existing listener was not called', this.exit);
  this.out('EOK', this.exit);
  process.exit(0);
};
