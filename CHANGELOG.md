# CHANGELOG

## tmp v0.2.0

- [#216](https://github.com/raszi/node-tmp/issues/216)

  ***BREAKING CHANGE***

  SIGINT handler has been removed. 

  Users must install their own SIGINT handler and call process.exit() so that tmp's process 
  exit handler can do the cleanup.

- [#206](https://github.com/raszi/node-tmp/issues/206)

  document name option.

- [#197](https://github.com/raszi/node-tmp/issues/197)

  sync cleanup callback must be returned when using the sync API functions.
  
  fs.rmdirSync() must not be called with a second parameter that is a function.

- [#179](https://github.com/raszi/node-tmp/issues/179)

  template option no longer accepts arbitrary paths.

- [#176](https://github.com/raszi/node-tmp/issues/176)

  fail early if no tmp dir was specified.
  
  use rimraf for removing directory trees.

- [#175](https://github.com/raszi/node-tmp/issues/175)

  add unsafeCleanup option to jsdoc.

- drop support for node version < v8

  ***BREAKING CHANGE***
  
  node version < v8 are no longer supported. 

- stabilized tests

- general clean up

- update jsdoc


## Previous Releases

- no information available
