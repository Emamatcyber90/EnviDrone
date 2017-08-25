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
        settings.config.statuses['water'] = true;
        gpio(PIN, false);
    }

    var waterOff = function() {
        settings.config.waterTime = moment(new Date()).format("M-D-YY HH:mm:ss");
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
            if (settings.config.statuses.light !== false) {
                var newDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                if (newDate >= settings.config.nextWaterTime) {
                    var addDate = moment(new Date(newDate)).add(settings.config.waterCycle, 'minute').format("YYYY-MM-DD HH:mm:ss")
                    settings.config.nextWaterTime = moment(new Date(addDate)).add(settings.config.waterDuration * 1000, 'milliseconds').format("YYYY-MM-DD HH:mm:ss")
                    Start();
                }
            }
        }, 1000);
    }

    TimerOn();

    settings.observe.on('change', function(changes) {
        if (changes.path == "waterCycle" || changes.path == "waterDuration") {
            var date = settings.config.waterTime ? new Date(settings.config.waterTime) : new Date()
            var circle = settings.config.waterCycle ? settings.config.waterCycle : 10000000;
            var newDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            socket.post("/reports/sendWaterReport", {
                start: newDate,
                old_start: settings.config.startWaterCycle,
                drone_id: settings.config.id,
                company_id: settings.config.company_id,
                minute: settings.config.waterCycle,
                second: settings.config.waterDuration
            })
            settings.config.startWaterCycle = newDate;

            settings.config.nextWaterTime = moment(date).add(circle, 'minute').format("YYYY-MM-DD HH:mm:ss");
            clearTimers();
        }
    });
};

module.exports = water;
