var water = function() {
    var gpio = require('./relay').Relay;
    var settings = require('../config');
    var PIN = 11;
    var timerOff;
    var timerOn;
    var oldValue = false;
    var newValue = true;
    var moment = require('moment');

    var waterON = function() {
        settings.config.waterTime = moment(new Date()).format("M-D-YY HH:mm:ss");
        settings.config.statuses['water'] = true;
        gpio(PIN, false);
    }

    var waterOff = function() {
        settings.config.statuses['water'] = false;
        gpio(PIN, true);
    }

    var clearTimers = function() {
        if (timerOff) clearTimeout(timerOff);

        TimerOn();
    }

    var Start = function() {
        waterON();

        timerOff = setTimeout(function() {
            waterOff();
        }, settings.config.waterDuration * 1000);
    }

    var TimerOn = function() {
        timerOn = setInterval(function() {
            var newDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            if (newDate >= settings.config.nextWaterTime) {
                settings.config.nextWaterTime = moment(new Date(newDate)).add(settings.config.waterCycle, 'minute').format("YYYY-MM-DD HH:mm:ss")
                Start();
            }
        }, 1000);
    }

    TimerOn();

    settings.observe.on('change', function(changes) {
        if (changes.path == "waterCycle" || changes.path == "waterDuration") {
            settings.config.nextWaterTime = moment(new Date(settings.config.waterTime || "")).add(settings.config.waterCycle, 'minute').format("YYYY-MM-DD HH:mm:ss");
            clearTimers();
        }
    });
};

module.exports = water;