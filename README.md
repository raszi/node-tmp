# Tmp

A simple temporary file and directory creator for [node.js.][1]

## About

The main difference between bruce's [node-temp][2] is that mine more
aggressively checks for the existence of the newly created temporary file.

The API is slightly different as well, Tmp does not yet provide synchronous
calls and all the parameters are optional.

You can also set whether you want to remove the temporary file on process exit
or not.

## How to install

    npm install tmp

## Usage

### File creation

    var tmp = require('tmp');

    tmp.file(function _tempFileCreated(err, path, fd) {
      if (err) throw err;

      console.log("File: ", path);
      console.log("Filedescriptor: ", fd);
    });

### Directory creation

    var tmp = require('tmp');

    tmp.dir(function _tempDirCreated(err, path) {
      if (err) throw err;

      console.log("Dir: ", path);
    });

## Advanced usage

### File creation

    var tmp = require('tmp');

    tmp.file({ mode: 0644, prefix: 'prefix-', postfix: '.txt' }, function _tempFileCreated(err, path, fd) {
      if (err) throw err;

      console.log("File: ", path);
      console.log("Filedescriptor: ", fd);
    });

### Directory creation

    tmp.dir({ mode: 0750, prefix: 'myTmpDir_' }, function _tempDirCreated(err, path) {
      if (err) throw err;

      console.log("Dir: ", path);
    });

### mkstemps like

    tmp.dir({ template: '/tmp/tmp-XXXXXX' }, function _tempDirCreated(err, path) {
      iff (err) throw err;

      console.log("Dir: ", path);
    });


## Options

All options are optional :)

  * `mode`: the file mode to create with it fallbacks to `0600` on file creation and `0700` on directory creation
  * `prefix`: the optional prefix, fallback to `tmp-` if not provided
  * `postfix`: the optional postfix, fallbacks to `.tmp` on file creation
  * `template`: [`mkstemps`][3] like filename template, no default
  * `dir`: the optional temporary directory, fallbacks to system default (guesses from environment)
  * `tries`: how many times should the function tries to get a unique filename before giving up, default `3`
  * `keep`: signals that the temporary file or directory should not be deleted on exit, default is to delete

[1]: http://nodejs.org/
[2]: https://github.com/bruce/node-temp
[3]: http://www.kernel.org/doc/man-pages/online/pages/man3/mkstemp.3.html
