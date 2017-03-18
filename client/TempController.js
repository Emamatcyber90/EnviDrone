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
        if (socket) {

            if (settings.config.manual.status && data >= settings.config.manual.tmpOnStep) {
                FanController.on();
            }

            if (tmp >= settings.config.tmpStep && (time <= newDate)) {
                socket.post("/reports/tempMax", {
                    tmp: tmp,
                    time: new Date(time),
                    newDate: new Date(newDate)
                })
                settings.config.tmpStepStatus = true
                settings.config.switchStatus = true;
                OFF();
            } else {
                time = Number(new Date())
                settings.config.tmpStepStatus = false
                settings.config.switchStatus = false;
            }
        }
    }
    return analyze;

};

module.exports = temp;