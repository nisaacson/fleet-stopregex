#! /usr/bin/env node
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
var stop = require('./index')
stop(function (err) {
  if (err) {
    inspect(err.message)
    return
  }
})
