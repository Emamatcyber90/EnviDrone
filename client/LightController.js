var light = function() {
    var gpio = require('./relay').Relay;
    var PINONE = 16;
    var PINTWO = 18;
    var settings = require('../config');
    var moment = require('moment')
    var CheckDroneStatus = require('./TimeService').CheckDroneStatus;

    var oldValue = false;
    var newValue

    function lightController() {
        if (CheckDroneStatus(settings.config.lightOn, settings.config.lightOff)) {
            settings.config['2222222222222222222222'] = true;
            ON(); //between7
        } else {
            settings.config['2222222222222222222222'] = false;
            OFF(); //notBetween7
        }

        setTimeout(lightController, 1000);
    }


    function ON() {
        settings.config.statuses['light'] = true;
        gpio(PINONE, false);
        gpio(PINTWO, false);
    }

    function OFF() {
        settings.config.statuses['light'] = false;
        gpio(PINONE, true);
        gpio(PINTWO, true);
    }



    lightController();
};

module.exports = light;