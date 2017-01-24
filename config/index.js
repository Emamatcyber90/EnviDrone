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
for (var i in newSettings) {
    if (!settings[i]) {
        settings[i] = newSettings[i];
    }
}

if (settings.lightOn.toString().length == 2) {
    settings.lightOn = settings.lightOn + ":00"
} else if (settings.lightOn.toString().length == 1) {
    settings.lightOn = "0" + settings.lightOn + ":00"
}

module.exports.config = settings;
module.exports.observe = observer