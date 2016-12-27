var light = function() {
    var gpio = require('./relay').Relay;
    var PINONE = 16;
    var PINTWO = 18;
    var settings = require('../config');
    var moment = require('moment')

    function lightController() {
        var time = moment().format("HH:mm");

        if (settings.config.onTime <= time && time < settings.config.offTime) {
            ON(); //between7
        } else {
            OFF(); //notBetween7
        }

        setTimeout(lightController, 1000);
    }

    function ON() {
        gpio(PINONE, false);
        gpio(PINTWO, false);
    }

    function OFF() {
        gpio(PINONE, true);
        gpio(PINTWO, true);
    }

    lightController();
};

module.exports = light;