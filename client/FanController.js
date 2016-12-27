var fan = function() {
    var gpio = require('./relay').Relay;
    var PIN = 15;

    var fanON = function() {
        gpio(PIN, false);
    }

    var fanOFF = function() {
        gpio(PIN, true);
    }

    return {
        on: fanON,
        off: fanOFF
    };

};

module.exports = fan;