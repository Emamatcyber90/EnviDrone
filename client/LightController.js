var light = function() {
    var gpio = require('./relay').Relay;
    var PINONE = 16;
    var PINTWO = 18;
    var settings = require('../config');
    var moment = require('moment')

    function lightController() {
        var time = moment().format();
        var dates = CreateStartEnd(settings.config.onTime, settings.config.offTime);
        if (dates["start"] <= time && time < dates["off"]) {
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