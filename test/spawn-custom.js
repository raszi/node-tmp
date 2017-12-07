// vim: expandtab:ts=2:sw=2

const
  path = require('path'),
  readJsonConfig = require('./util').readJsonConfig,
  spawn = require('./spawn'),
  config = readJsonConfig(process.argv[2]);

spawn.graceful = !!config.graceful;

const args = Array.prototype.slice.call(process.argv, 3);

// import the test case function and execute it
const fn = require(path.join(__dirname, 'outband', config.tc));
fn.apply(spawn, args);

