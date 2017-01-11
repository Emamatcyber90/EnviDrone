var light = function() {
    var gpio = require('./relay').Relay;
    var PINONE = 16;
    var PINTWO = 18;
    var settings = require('../config');
    var moment = require('moment')
    var CheckDroneStatus = require('./TimeService').CheckDroneStatus;

    function lightController() {
        console.log("--------------------",CheckDroneStatus(settings.config.onTime, settings.config.offTime, time))
        console.log("+++++++++++++++++++++++++", settings.config.onTime, settings.config.offTime)
        if (CheckDroneStatus(settings.config.onTime, settings.config.offTime)) {
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