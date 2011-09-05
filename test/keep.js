var tmp = require('../lib/tmp.js');

var
  type = process.argv[2],
  keep = (process.argv[3] && parseInt(process.argv[3], 10) === 1) ? true : false;

switch (type) {
  case 'file':
    tmp.file({ keep: keep }, function(err, name, fd) {
      if (err) {
        console.error(err);
        process.exit(2);
      }

      console.log(name);
    });
    break;

  case 'dir':
    tmp.dir({ keep: keep }, function(err, name) {
      if (err) {
        console.error(err);
        process.exit(2);
      }

      console.log(name);
    });
    break;

  default:
    console.error("Invalid type");
    process.exit(1);
}
