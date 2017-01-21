var humidity = function() {
    var gpio = require('./relay').Relay;
    var PIN = 13;
    var settings = require('../config');

    var ON = function() {
        settings.config.statuses['carbon'] = true;
        gpio(PIN, false);
    }

    var OFF = function() {
        settings.config.statuses['carbon'] = false;
        gpio(PIN, true);
    }

    var analyze = function(data) {
        if (data >= settings.config.humidity) {
            ON();
        } else {
            OFF();
        }
    }

    return analyze;

};

module.exports = humidity;