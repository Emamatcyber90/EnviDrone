var temp = function() {
    var gpio = require('./relay').Relay;
    var settings = require('../config');
    var PINONE = 16;
    var PINTWO = 18;
    var FanController = require('./FanController')();

    var OFF = function() {
        gpio(PINONE, true);
        gpio(PINTWO, true);
    }

    var analyze = function(data) {
        var tmp = (data * 9 / 5) + 32;
        var newDate = Number(new Date()) - 5000;
        if (settings.config.manual.status && data >= settings.config.manual.tmpOnStep) {
            FanController.on();
        }

        console.log(tmp >= settings.config.tmpStep && (time <= newDate))
        console.log(tmp, "Temp")
        console.log(settings.config.tmpStep, "step")
        console.log(time, "time")
        console.log(newDate, "newDate")
        if (tmp >= settings.config.tmpStep && (time <= newDate)) {
            settings.config.tmpStepStatus = true
            OFF();
        } else {
            time = Number(new Date())
            settings.config.tmpStepStatus = false
        }
    }
    return analyze;
};

module.exports = temp;