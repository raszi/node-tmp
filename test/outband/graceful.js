module.exports = function (result, tmp) {
  this.out(result.name, function () {
    throw new Error('(non-)graceful cleanup testing');
  });
};
