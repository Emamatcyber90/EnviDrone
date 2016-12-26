"use strict";
var observer;
var moment = require('moment')
var FormatTime = require('../client/TimeService').FormatTime;
var SetTime = require('../client/TimeService').SetTime;
var bjson = require('bjson');
var settings = bjson('settings', function(observe) {

    observer = observe;
    observe.on('change', function(changes) {
        console.log('Path:', changes.path);
        console.log('Old Value:', changes.oldValue);
        console.log('New Value:', changes.value);
        console.log('-----');
    })
});


if (Object.keys(settings).length === 0) {
    //Create default settings
    settings.carbon = 0;
    settings.humidity = 40;
    settings.lightOn = "20";
    settings.offTime = SetTime("20", 11);
    settings.onTime = SetTime("20", 0);
    settings.lightOff = 11;
    settings.fanOnStep = 800;
    settings.tmpStep = 110;
    settings.waterCycle = 120;
    settings.waterDuration = 3.5;
}

module.exports.config = settings;
module.exports.observe = observer