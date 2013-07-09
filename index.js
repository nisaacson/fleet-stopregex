var prompt = require('prompt');
var async = require('async')
var getPSJson = require('fleet-ps-json')
var getPSText = require('./getPSText')
var aliases = {
  "f": "field",
  "y": "yes"
}
var opts = require('optimist').usage('Usage:  --field [command] $0, where command is one of "pid", "commit", or "command"').alias(aliases)
var killPID = require('./killPID')
var inspect = require('eyespect').inspector();
var argv = opts.argv
var field = argv.field || 'pid'
var validFields = ['pid', 'commit', 'command']
var skipConfirm = false
if (argv.yes) {
  skipConfirm = true
}
module.exports = function stop(cb) {
  var index = validFields.indexOf(field)
  if (index < 0) {
    return cb({
      message: 'error stopping fleet command, invalid field specified, alllowed values are "pid", "commit", or "command"',
      stack: new Error().stack
    })
  }
  if (argv._.length === 0) {
    return cb({
      message: 'Usage: fleet-stopregex --field [command] <regex> <optional regex flags>, where command is one of "pid", "commit", or "command"'
    })
  }
  var regexString
  var flags
  regexString = argv._[0]
  flags = argv._[1]
  var regex = new RegExp(regexString, flags)
  if (!regex) {
    return cb({
      message: 'you must pass a regex string as the last parameter, this string will be matched agains the field you specified to kill any matching spawned fleet processes, example: "fleet-stopregex --field command node" will stop all processes which have the word "node in their command"',
      stack: new Error().stack
    })

  }
  getPSText(function(err, text) {
    if (err) {
      inspect(err)
      return process.exit(1)
    }
    var json = getPSJson(text)
    var pids = getPIDsToKill(field, json, regex, cb)
  })
}

function getPIDsToKill(field, json, regex, cb) {

  var elements = json.filter(function(e) {
    var text = e[field]
    return regex.test(text)
  })
  inspect(elements, 'processes to kill')
  if (elements.length === 0) {
    inspect('no matching processes found')
    return cb()
  }
  confirmStopIfNeeded(function(err, stop) {
    if (err) {
      return cb(err)
    }
    if (!stop) {
      return cb()
    }
    var pids = elements.map(function(e) {
      return e.pid
    })
    if (pids.length === 0) {
      return cb(null, false)
    }
    async.forEachSeries(pids, killPID, cb)
  })
}

function confirmStopIfNeeded(cb) {
  if (skipConfirm) {
    return cb(null, true)
  }
  prompt.start();
  prompt.get("are you sure you want to kill these processes? [yes/no]", function(err, reply) {
    if (err) return cb(err);
    var value = reply[Object.keys(reply)[0]]
    if (value !== 'yes' && value !== 'y') {
      inspect('aborted!')
      return cb(null, false)
    }
    return cb(null, true)
  })
}
