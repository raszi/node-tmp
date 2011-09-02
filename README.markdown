# Tmp

A simple temporary file and directory creator for node.js.

## How to install

    npm install tmp

## Usage

    var tmp = require('tmp');

    tmp.file(function _tempFileCreated(err, path, fd) {
        if (err) throw err;

        console.log("File: ", path);
        console.log("Filedescriptor: ", fd);
    });

    tmp.dir(function _tempDirCreated(err, path) {
        if (err) throw err;

        console.log("Dir: ", path);
    });

## More advanced usage

    var tmp = require('tmp');

    tmp.file({ mode: 0644, prefix: 'prefix-', postfix: '.txt' }, function _tempFileCreated(err, path, fd) {
        if (err) throw err;

        console.log("File: ", path);
        console.log("Filedescriptor: ", fd);
    });

	tmp.dir({ mode: 0750, prefix: 'myTmpDir_' }, function _tempDirCreated(err, path) {
        if (err) throw err;

        console.log("Dir: ", path);
	});
