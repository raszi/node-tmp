// vim: expandtab:ts=2:sw=2

var
  path = require('path'),
  readJsonConfig = require('./util').readJsonConfig,
  spawn = require('./spawn');

var config = readJsonConfig(process.argv[2]);
spawn.graceful = !!config.graceful;

var args = [];

for (var i=3; i<process.argv.length; i++) {
  args[i-3] = process.argv[i];
}

// import the test case function and execute it
var fn = require(path.join(__dirname, 'outband', config.tc));
fn.apply(spawn, args);

