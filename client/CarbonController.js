/*
  carbon = 800
  timeFrom 20
  timeTo 7
  maxCarbon 1500 //Lights off time
*/
var carbon = function() {
    var gpio = require('./relay').Relay;
    var moment = require('moment')
    var PIN = 7;
    var settings = require('../config');
    var FanController = require('./FanController')();
    var CheckDroneStatus = require('./TimeService').CheckDroneStatus;

    var coController = function(data) {
        settings.config['dataaaaaaaaaa'] = data;
        if (CheckDroneStatus(settings.config.lightOn, settings.config.lightOff)) {
            lightOn(data);
        } else {
            lightOff(data);
        }
    }

    function lightOn(data) {
        settings.config["CarbonnnnnnnSteppp"] = {"dataaa": data, "carbonnn": settings.config.carbon}
        if (data <= settings.config.carbon && data != 0) {
            coON();
        } else {
            coOFF();
        }
        FanController.off();
    }

    function lightOff(data) {
        if (data >= settings.config.fanOnStep) {
            FanController.on();
        }
        coOFF();
    }

    function coON() {
        settings.config.statuses['carbon'] = true;
        gpio(PIN, false);
    }

    function coOFF() {
        settings.config.statuses['carbon'] = false;
        gpio(PIN, true);
    }

    return coController;
};

module.exports = carbon;