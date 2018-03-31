"use strict";
var observer;
var moment = require('moment')
var bjson = require('bjson');

var settings = bjson('settings', function(observe) {
    observer = observe;
    observe.on('change', function(changes) {
        var pathArray = changes.path.split('.');
        if (pathArray[0] == "statuses") {

            if (changes.name == 'light') {
                socket.post("/reports/sendLightOnOf", {
                    date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    settings: JSON.stringify(settings),
                    status: changes.value
                })
            }

            socket.post("/drone/emit", {
                statuses: changes.object,
                socketName: 'changeStatuses'
            })
        }

        if (pathArray[0] == "waterTime") {
            socket.post("/drone/emit", {
                waterTime: changes.object.waterTime,
                socketName: 'updateWaterTime'
            })
        }

        if (pathArray[0] == "tmpStepStatus" && changes.value == true) {
            post('/drone/emit', {
                lighted: settings.tmpStepStatus,
                socketName: "switchStatus"
            });
        }

        if (pathArray[0] == "lightOn" || pathArray[0] == "lightOff") {
            var newDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            socket.post("/reports/sendLightReport", {
                start: newDate,
                old_start: settings.lightStart,
                drone_id: settings.id,
                company_id: settings.company_id,
                light_on: changes.object.lightOn,
                light_off: changes.object.lightOff
            })
            settings.lightStart = newDate;
        }

        if (pathArray[0] == "carbon") {

            var newDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            socket.post("/reports/sendCarbonReport", {
                start: newDate,
                old_start: settings.carbonStart,
                drone_id: settings.id,
                company_id: settings.company_id,
                level: changes.object.carbon
            })

            settings.carbonStart = newDate;
        }

        if (pathArray[0] == "notifications" && changes.name == "message" && changes.value) {
            console.log(changes.value)
            socket.sendNotification(changes.value)
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
    "fanOnStepHumiditly": 100,
    "tmpStep": 100,
    "waterCycle": 120,
    "waterDuration": 3.5,
    "tmpStepStatus": false,
    "nextWaterTime": moment(date).add(settings.waterCycle, 'minute').format("YYYY-MM-DD HH:mm:ss"),
    "startWaterCycle": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    "lightStart": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    "carbonStart": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    "statuses": {
        "light": false,
        "carbon": false,
        "water": false,
        "fan": false
    },
    "version": 1,
    "id": Math.random().toString(36).slice(2),
    "manual": {
        "status": false,
        "carbonOnStep": 2000,
        "tmpOnStep": 2000,
        "humidityOnStep": 2000
    },
    "notifications": {
        'status': true,
        'carbon': {
            'min': 100,
            'max': 800,
            'message': ""
        },
        'temp': {
            'min': 5,
            'max': 100,
            'message': ""
        },
        'humidity': {
            'max': 200,
            'min': 10,
            'message': ""
        },
        'drone': {
            'on': true,
            'off': true,
            'message': ""
        },
        'sensors': {
            'on': true
        }
    }
}

for (var i in newSettings) {
    if (!settings[i]) {
        settings[i] = newSettings[i];
    }
}

module.exports.config = settings;
module.exports.observe = observer
