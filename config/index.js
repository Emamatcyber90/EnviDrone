"use strict";
var observer;
var moment = require('moment')
var bjson = require('bjson'),
    settings = bjson('settings', function(observe) {

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
    settings.offTime = "07:00";
    settings.lightOn = "20:00";
    settings.lightOff = 11;
    settings.fanOnStep = 800;
    settings.tmpStep = 110;
    settings.waterCycle = 120;
    settings.waterDuration = 3.5;
}

module.exports.config = settings;
module.exports.observe = observer
