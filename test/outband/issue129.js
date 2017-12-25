/* eslint-disable no-octal */
// vim: expandtab:ts=2:sw=2

// https://github.com/raszi/node-tmp/issues/129
module.exports = function () {
  // dup from lib/tmp.js
  function _is_legacy_listener(listener) {
    return (listener.name == '_exit' || listener.name == '_uncaughtExceptionThrown')
      && listener.toString().indexOf('_garbageCollector();') != -1;
  }

  function _garbageCollector() {}

  var callState = {
    newStyleListener : false,
    legacyExitListener : false,
    legacyUncaughtListener : false
  };

  // simulate the new exit listener
  var listener1 = (function (callState) {
    return function _tmp$safe_listener() {
      _garbageCollector();
      callState.newStyleListener = true;
    };
  })(callState);

  // simulate the legacy _exit listener
  var listener2 = (function (callState) {
    return function _exit() {
      _garbageCollector();
      callState.legacyExitListener = true;
    };
  })(callState);

  // simulate the legacy _uncaughtExceptionThrown listener
  var listener3 = (function (callState) {
    return function _uncaughtExceptionThrown() {
      _garbageCollector();
      callState.legacyUncaughtListener = true;
    };
  })(callState);

  process.addListener('exit', listener1);
  process.addListener('exit', listener2);
  process.addListener('exit', listener3);

  // now let tmp install its listener safely
  require('../../lib/tmp');

  var legacyExitListener = null;
  var legacyUncaughtListener = null;
  var newStyleListeners = [];

  var listeners = process.listeners('exit');
  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i];
    // the order here is important
    if (listener.name == '_tmp$safe_listener') {
      newStyleListeners.push(listener);
    }
    else if (_is_legacy_listener(listener)) {
      if (listener.name == '_uncaughtExceptionThrown') legacyUncaughtListener = listener;
      else legacyExitListener = listener;
    }
  }

  if (legacyExitListener) this.fail('EEXISTS:LEGACY:EXIT existing legacy exit listener was not removed', this.exit);
  if (legacyUncaughtListener) this.fail('EEXISTS:LEGACY:UNCAUGHT existing legacy uncaught exception thrown listener was not removed', this.exit);
  if (newStyleListeners.length > 1) this.fail('EEXISTS:NEWSTYLE: existing new style listener was not removed', this.exit);
  newStyleListeners[0]();
  if (!callState.legacyExitListener) this.fail('ENOAVAIL:LEGACY:EXIT existing legacy exit listener was not called', this.exit);
  if (callState.legacyUncaughtListener) this.fail('EAVAIL:LEGACY:UNCAUGHT existing legacy uncaught exception thrown listener should not have been called', this.exit);
  if (!callState.newStyleListener) this.fail('ENOAVAIL:NEWSTYLE: existing new style listener was not called', this.exit);
  this.out('EOK', this.exit);
};
