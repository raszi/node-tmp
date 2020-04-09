# CHANGELOG

## tmp v0.2.0

- drop support for node version < v8.17.0

  ***BREAKING CHANGE***
  
  node versions < v8.17.0 are no longer supported. 

- [#216](https://github.com/raszi/node-tmp/issues/216)

  ***BREAKING CHANGE***

  SIGINT handler has been removed. 

  Users must install their own SIGINT handler and call process.exit() so that tmp's process 
  exit handler can do the cleanup.
  
  A simple handler would be
  
  ```
  process.on('SIGINT', process.exit);
  ```

- [#156](https://github.com/raszi/node-tmp/issues/156)

  ***BREAKING CHANGE***

  template option no longer accepts arbitrary paths. all paths must be relative to os.tmpdir().
  the template option can point to an absolute path that is located under os.tmpdir().
  this can now be used in conjunction with the dir option. 

- [#207](https://github.com/raszi/node-tmp/issues/TBD)

  ***BREAKING CHANGE***

  dir option no longer accepts arbitrary paths. all paths must be relative to os.tmpdir().
  the dir option can point to an absolute path that is located under os.tmpdir().

- [#218](https://github.com/raszi/node-tmp/issues/TBD)

  ***BREAKING CHANGE***

  name option no longer accepts arbitrary paths. name must no longer contain a path and will always be made relative
  to the current os.tmpdir() and the optional dir option.

- [#197](https://github.com/raszi/node-tmp/issues/197)

  ***BUG FIX***

  sync cleanup callback must be returned when using the sync API functions.
  
  fs.rmdirSync() must not be called with a second parameter that is a function.

- [#176](https://github.com/raszi/node-tmp/issues/176)

  ***BUG FIX***

  fail early if no os.tmpdir() was specified.
  previous versions of Electron did return undefined when calling os.tmpdir().
  _getTmpDir() now tries to resolve the path returned by os.tmpdir().
  
  now using rimraf for removing directory trees.

- [#246](https://github.com/raszi/node-tmp/issues/246)

  ***BUG FIX***

  os.tmpdir() might return a value that includes single or double quotes,
  similarly so the dir option, the template option and the name option

- [#240](https://github.com/raszi/node-tmp/issues/240)

  ***DOCUMENTATION***
  
  better documentation for `tmp.setGracefulCleanup()`.

- [#206](https://github.com/raszi/node-tmp/issues/206)

  ***DOCUMENTATION***
  
  document name option.

- [#236](https://github.com/raszi/node-tmp/issues/236)

  ***DOCUMENTATION***

  document discardDescriptor option.

- [#237](https://github.com/raszi/node-tmp/issues/237)

  ***DOCUMENTATION***

  document detachDescriptor option.

- [#238](https://github.com/raszi/node-tmp/issues/238)

  ***DOCUMENTATION***

  document mode option.

- [#175](https://github.com/raszi/node-tmp/issues/175)

  ***DOCUMENTATION***

  document unsafeCleanup option.


### Miscellaneous

- stabilized tests
- general clean up
- update jsdoc


## Previous Releases

- no information available
