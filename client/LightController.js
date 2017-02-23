var light = function() {
    var gpio = require('./relay').Relay;
    var PINONE = 16;
    var PINTWO = 18;
    var settings = require('../config');
    var moment = require('moment');
    var CheckDates = require('./TimeService').CheckDates;

    var oldValue = false;
    var newValue

    function lightController() {
        if ( CheckDates(settings.config.lightOn, settings.config.lightOff) && !settings.config.tmpStepStatus ) {
            ON();
        } else {
            OFF();
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