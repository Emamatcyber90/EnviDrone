var water = function() {
    var gpio = require('./relay').Relay;
    var settings = require('../config');
    var PIN = 11;
    var timerOff;
    var timerOn;
    var oldValue = false;
    var newValue = true;
    
    var waterON = function() {
        settings.config.statuses['water'] = true;
        gpio(PIN, false);
    }

    var waterOff = function() {
        settings.config.statuses['water'] = false;
        gpio(PIN, true);
    }

    var clearTimers = function() {
        if (timerOff) clearTimeout(timerOff);
        if (timerOn) clearTimeout(timerOn);

        TimerOn();
    }

    var Start = function() {
        waterON();

        timerOff = setTimeout(function() {
            waterOff();
            TimerOn();
        }, settings.config.waterDuration * 1000);
    }

    var TimerOn = function() {
        timerOn = setTimeout(function() {
            Start();
        }, settings.config.waterCycle * 60000);
    }

    TimerOn();

    settings.observe.on('change', function(changes) {
        if (changes.path == "waterCycle" || changes.path == "waterDuration") {
            clearTimers();
        }
    });
};

module.exports = water;