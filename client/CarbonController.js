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
    var CreateStartEnd = require('./TimeService').CreateStartEnd;

    var coController = function(data) {
        var time = moment().format();
        var dates = CreateStartEnd(settings.config.onTime, settings.config.offTime);
        if (dates["start"] <= time && time < dates["off"]) {
            lightOn(data);
        } else {
            lightOff(data);
        }
    }

    function lightOn(data) {
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
        gpio(PIN, false);
    }

    function coOFF() {
        gpio(PIN, true);
    }

    return coController;
};

module.exports = carbon;