#! /usr/bin/env node
var prompt = require('prompt');
prompt.start();

function onErr(err) {
  console.log(err);
  return 1;
}

var async = require('async')
var should = require('should');
var getPSJson = require('fleet-ps-json')
var getPSText = require('./getPSText')
var opts = require('optimist').usage('Usage:  --field [command] $0, where command is one of "pid", "commit", or "command"').alias('f','field')
var killPID = require('./killPID')
var inspect = require('eyespect').inspector();
var argv = opts.argv
var field = argv.field || 'pid'
var validFields = ['pid', 'commit', 'command']
stop(function (err) {
  if (err) {
    inspect(err.message)
    return
  }
})

function stop(cb) {
  var index = validFields.indexOf(field)
  if (index < 0) {
    return cb({
      message: 'error stopping fleet command, invalid field specified, alllowed values are "pid", "commit", or "command"',
      stack: new Error().stack
    })
  }
  var regexString = argv._[1]
  var flags = argv._[2]
  var regex = new RegExp(regexString, flags)
  if (!regex) {
    return cb({
      message: 'you must pass a regex string as the last parameter, this string will be matched agains the field you specified to kill any matching spawned fleet processes, example: "fleet-stopregex --field command node" will stop all processes which have the word "node in their command"',
      stack: new Error().stack
    })

  }
  getPSText(function (err, text) {
    if (err) {
      inspect(err)
      return process.exit(1)
    }
    var json = getPSJson(text)
    var pids = getPIDsToKill(field, json, regex, cb)
  })
}

function getPIDsToKill(field, json, regex, cb) {
  var elements = json.filter(function (e) {
    var text = e[field]
    return regex.test(text)
  })
  inspect(elements, 'processes to kill')
  if (elements.length === 0) {
    inspect('no matching processes found')
    return cb()
  }
  prompt.get("are you sure you want to kill these processes? [yes/no]", function(err, reply) {
    if (err) return cb(err);
    var value = reply[Object.keys(reply)[0]]
    if (value !== 'yes' && value !== 'y') {
      inspect('aborted!')
      return cb()
    }
    var pids = elements.map(function (e) {
      return e.pid
    })
    if (pids.length === 0) {
      return cb()
    }
    async.forEachSeries(pids, killPID, cb)
  })
}

function confirmStop(input, callback) {
  inspect(input, 'confirm stop input')
}
