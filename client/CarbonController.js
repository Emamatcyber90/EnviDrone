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
        if (CheckDroneStatus(settings.config.lightOn, settings.config.lightOff)) {
            lightOn(data);
        } else {
            lightOff(data);
        }
    }

    function lightOn(data) {
        if (data <= settings.config.carbon && data != 0) {
            settings.config.statuses['carbon'] = true;
            coON();
        } else {
            settings.config.statuses['carbon'] = false;
            coOFF();
        }
        
        settings.config.statuses['fan'] = false;
        FanController.off();
    }

    function lightOff(data) {
        if (data >= settings.config.fanOnStep) {
            settings.config.statuses['fan'] = true;
            FanController.on();
        }
        coOFF();
    }

    function coON() {
        gpio(PIN, false);
    }

    function coOFF() {
        gpio(PIN, true);
    }

    return coController;
};

module.exports = carbon;