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
    "lightOn": "20",
    "offTime": SetTime("20", 11),
    "onTime": SetTime("20", 0),
    "lightOff": 11,
    "fanOnStep": 800,
    "tmpStep": 110,
    "waterCycle": 120,
    "waterDuration": 3.5
}

for (var i in newSettings) {
    if (!settings[i]) {
        settings[i] = newSettings[i];
    }
}

module.exports.config = settings;
module.exports.observe = observer