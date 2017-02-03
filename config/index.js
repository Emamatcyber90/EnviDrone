"use strict";
var observer;
var moment = require('moment')
var FormatTime = require('../client/TimeService').FormatTime;
var SetTime = require('../client/TimeService').SetTime;
var bjson = require('bjson');
var settings = bjson('settings', function(observe) {
    observer = observe;
    observe.on('change', function(changes) {})
});

var newSettings = {
    "carbon": 0,
    "humidity": 40,
    "lightOn": "20:00",
    "lightOff": 11,
    "fanOnStep": 800,
    "tmpStep": 110,
    "waterCycle": 120,
    "waterDuration": 3.5,
    "statuses": {
        "light": false,
        "carbon": false,
        "water": false,
        "fan": false
    },
    "version": 1
}

if (Object.keys(settings).length === 0) {
    settings = newSettings
}

console.log(settings);

module.exports.config = settings;
module.exports.observe = observer
