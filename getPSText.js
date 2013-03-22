var inspect = require('eyespect').inspector()
var exec = require('child_process').exec;
module.exports = function (cb) {
  var cmd = 'fleet-ps'
  var child = exec(cmd, function(err, stdout, stderr) {
    if (err) {
      return cb({
        message: 'failed to get fleet-ps output',
        error: err,
        stack: new Error().stack
      })
    }
    if (stderr) {
      return cb({
        message: 'failed to get fleet-ps output',
        error: stderr,
        stack: new Error().stack
      })
    }
    cb(null, stdout)
  });
}
