"use strict";
var observer;
var moment = require('moment')
var bjson = require('bjson');
var settings = bjson('settings', function(observe) {
    observer = observe;
    observe.on('change', function(changes) {
        console.log(changes)
        var pathArray = changes.path.split('.');
        if (pathArray[0] == "statuses") {
            socket.post("/drone/changeStatuses", {
                statuses: changes.object
            })
        }

        if (pathArray[0] == "waterTime") {
            socket.post("/drone/updateWaterTime", {
                waterTime: changes.object.waterTime
            })
        }
    })
});
var date = settings.waterTime ? new Date(settings.waterTime) : new Date()
var newSettings = {
    "carbon": 0,
    "humidity": 40,
    "lightOn": "20:00",
    "lightOff": 11,
    "fanOnStep": 800,
    "tmpStep": 100,
    "waterCycle": 120,
    "waterDuration": 3.5,
    "tmpStepStatus": false,
    "nextWaterTime": moment(date).add(settings.waterCycle, 'minute').format("YYYY-MM-DD HH:mm:ss"),
    "statuses": {
        "light": false,
        "carbon": false,
        "water": false,
        "fan": false
    },
    "version": 1,
    "manual": {
        "status": false,
        "carbonOnStep": 2000,
        "tmpOnStep": 2000,
        "humidityOnStep": 2000
    }
}

for (var i in newSettings) {
    if (!settings[i]) {
        settings[i] = newSettings[i];
    }
}

module.exports.config = settings;
module.exports.observe = observer