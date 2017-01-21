var fan = function() {
    var settings = require('../config');
    var gpio = require('./relay').Relay;
    var PIN = 15;
    var fanON = function() {
        settings.config.statuses['fan'] = true;
        gpio(PIN, false);
    }

    var fanOFF = function() {
        settings.config.statuses['fan'] = false;
        gpio(PIN, true);
    }

    return {
        on: fanON,
        off: fanOFF
    };

};

module.exports = fan;