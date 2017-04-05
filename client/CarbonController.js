var carbon = function() {
    var gpio = require('./relay').Relay;
    var moment = require('moment')
    var PIN = 7;
    var settings = require('../config');
    var FanController = require('./FanController')();
    var CheckDates = require('./TimeService').CheckDates;
    var checkNotification = require('../client/NotificationService').checkNotification;

    var coController = function(data) {
        checkNotification("carbon", data.z)
        if (settings.config.manual.status && data.z >= settings.config.manual.carbonOnStep) {
            FanController.on();
        } else {
            if (CheckDates(settings.config.lightOn, settings.config.lightOff) && !settings.config.tmpStepStatus) {
                lightOn(data.z);
            } else {
                lightOff(data.z, data.humidity);
            }
        }
    }

    function lightOn(data) {
        FanController.off();
        if (data <= settings.config.carbon && data != 0) {
            coON();
        } else {
            coOFF();
        }
    }

    function lightOff(carbon, humidity) {
        if (carbon >= settings.config.fanOnStep || humidity >= settings.config.fanOnStepHumiditly) {
            FanController.on();
        } else {
            FanController.off()
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