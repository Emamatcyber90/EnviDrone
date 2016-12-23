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
    var lightOn = new Date().setHours(20)
    lightOn = new Date(lightOn).setMinutes(0)
    lightOn = new Date(lightOn).setSeconds(0)
    var offTime = new Date(lightOn).setHours(new Date(lightOn).getHours() + 11)

    //Create default settings
    settings.carbon = 0;
    settings.humidity = 40;
    settings.offTime = moment(offTime).format("HH:mm");
    settings.lightOn = moment(lightOn).format("HH:mm");
    settings.lightOff = 0;
    settings.fanOnStep = 800;
    settings.tmpStep = 110;
    settings.waterCycle = 120;
    settings.waterDuration = 3.5;
}

module.exports.config = settings;
module.exports.observe = observer
