var inspect = require('eyespect').inspector()
var exec = require('child_process').exec;
var async = require('async')
module.exports = function (pids, callback) {
  async.forEachSeries(pids, killPID, callback)
}
function killPID(pid, callback) {
  var killed = false
  var maxAttempts = 100
  var attempt = 0
  async.until(
    function () {
      return killed
    },
    function(cb) {
      var cmd = 'fleet-stop ' + pid
      console.log(cmd)
      var patternPID = pid.replace(/pid#/, '')
      var pattern = new RegExp('stopped ' + patternPID)
      var child = exec(cmd, function(err, stdout, stderr) {
        attempt += 1
        if (err) {
          return cb({
            message: 'error trying to stop spawned fleet process',
            error: err,
            stack: new Error().stack
          })
        }
        if (attempt >= maxAttempts) {
          return cb({
            message: 'error trying to stop spawned fleet process',
            error: 'max number of attempts reached when stopping process',
            stack: new Error().stack
          })
        }
        if (stderr) {
          return cb({
            message: 'error trying to stop spawned fleet process',
            error: stderr,
            stack: new Error().stack
          })
        }
        if (stderr) {
          console.log(stderr)
        }
        if (stdout) {
          console.log(stdout)
        }
        killed = pattern.test(stdout)
        inspect(killed, 'killed')
        cb()
      })
    }, callback
  )
}
