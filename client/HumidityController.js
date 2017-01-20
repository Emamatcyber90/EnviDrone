var humidity = function() {
    var gpio = require('./relay').Relay;
    var PIN = 13;
    var settings = require('../config');

    var ON = function() {
        gpio(PIN, false);
    }

    var OFF = function() {
        gpio(PIN, true);
    }

    var analyze = function(data) {
        if (data >= settings.config.humidity) {
            settings.config.statuses['carbon'] = true;
            ON();
        } else {
            settings.config.statuses['carbon'] = false;
            OFF();
        }
    }

    return analyze;

};

module.exports = humidity;