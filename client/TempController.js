var temp = function() {
    var gpio = require('./relay').Relay;
    var settings = require('../config');
    var PINONE = 16;
    var PINTWO = 18;
    var FanController = require('./FanController')();

    var OFF = function() {
        settings.config.statuses['light'] = false;
        gpio(PINONE, true);
        gpio(PINTWO, true);
    }

    var analyze = function(data) {
        console.log(data)
        var tmp = (data.temp * 9 / 5) + 32;

        if (settings.config.manual.status && data >= settings.config.manual.tmpOnStep) {
            FanController.on();
        }
        console.log(tmp)
        if (tmp >= settings.config.tmpStep) {
            OFF();
        }

    }
    return analyze;

};

module.exports = temp;