/*
  carbon = 800
  timeFrom 20
  timeTo 7
  maxCarbon 1500 //Lights off time
*/
module.exports = (function() {
    var gpio = require('./relay').Relay;
    var moment = require('moment')
    var PIN = 7;
    var settings = require('../config');
    var FanController = require('./FanController');

    function timeFilter(time) {
        var res = time.split(":")
        var m = moment();
        var minute = res[1] ? res[1] : 0
        m.set({
            hour: res[0],
            minute: minute,
            second: 0,
            millisecond: 0
        })
        return m.format()
    }

    var coController = function(data) {
        var time = moment().format();

        if (timeFilter(settings.config.lightOn) <= time && time < timeFilter(settings.config.offTime)) {
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
}

function coON() {
    gpio(PIN, false);
}

function coOFF() {
    gpio(PIN, true);
}

return coController;
})();