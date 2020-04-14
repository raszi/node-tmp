# Tmp

A simple temporary file and directory creator for [node.js.][1]

[![Build Status](https://travis-ci.org/raszi/node-tmp.svg?branch=master)](https://travis-ci.org/raszi/node-tmp)
[![Dependencies](https://david-dm.org/raszi/node-tmp.svg)](https://david-dm.org/raszi/node-tmp)
[![npm version](https://badge.fury.io/js/tmp.svg)](https://badge.fury.io/js/tmp)
[![API documented](https://img.shields.io/badge/API-documented-brightgreen.svg)](https://raszi.github.io/node-tmp/)
[![Known Vulnerabilities](https://snyk.io/test/npm/tmp/badge.svg)](https://snyk.io/test/npm/tmp)

## About

This is a [widely used library][2] to create temporary files and directories
in a [node.js][1] environment.

Tmp offers both an asynchronous and a synchronous API. For all API calls, all
the parameters are optional. There also exists a promisified version of the
API, see [tmp-promise][5].

Tmp uses crypto for determining random file names, or, when using templates,
a six letter random identifier. And just in case that you do not have that much
entropy left on your system, Tmp will fall back to pseudo random numbers.

You can set whether you want to remove the temporary file on process exit or
not.

If you do not want to store your temporary directories and files in the
standard OS temporary directory, then you are free to override that as well.

## An Important Note on Compatibility

See the [CHANGELOG](./CHANGELOG.md) for more information.

### Version 0.1.0

Since version 0.1.0, all support for node versions < 0.10.0 has been dropped.

Most importantly, any support for earlier versions of node-tmp was also dropped.

If you still require node versions < 0.10.0, then you must limit your node-tmp
dependency to versions below 0.1.0.

### Version 0.0.33

Since version 0.0.33, all support for node versions < 0.8 has been dropped.

If you still require node version 0.8, then you must limit your node-tmp
dependency to version 0.0.33.

For node versions < 0.8 you must limit your node-tmp dependency to
versions < 0.0.33.

[1]: http://nodejs.org/
[2]: https://www.npmjs.com/browse/depended/tmp
[3]: http://www.kernel.org/doc/man-pages/online/pages/man3/mkstemp.3.html
