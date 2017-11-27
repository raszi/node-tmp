var
  fs    = require('fs'),
  join  = require('path').join;

module.exports = function (result, tmp) {
  // creates structure from issue 62
  // https://github.com/raszi/node-tmp/issues/62

  fs.mkdirSync(join(result.name, 'issue62'));

  ['foo', 'bar'].forEach(function(subdir) {
    fs.mkdirSync(join(result.name, 'issue62', subdir));
    fs.writeFileSync(join(result.name, 'issue62', subdir, 'baz.txt'), '');
  });

  this.out(result.name, this.exit);
};

