var
  fs    = require('fs'),
  join  = require('path').join,
  spawn = require('./spawn');

var unsafe = spawn.arg;
spawn.tmpFunction({ unsafeCleanup: unsafe }, function (err, name) {
  if (err) {
    spawn.err(err, spawn.exit);
    return;
  }

  try {
    // creates structure from issue 62
    // https://github.com/raszi/node-tmp/issues/62

    fs.mkdirSync(join(result.name, 'issue62'));

    ['foo', 'bar'].forEach(function(subdir) {
      fs.mkdirSync(join(result.name, 'issue62', subdir));
      fs.writeFileSync(join(result.name, 'issue62', subdir, 'baz.txt'), '');
    });

    spawn.out(name, spawn.exit);
  } catch (e) {
    spawn.err(e.toString(), spawn.exit);
  }
});
