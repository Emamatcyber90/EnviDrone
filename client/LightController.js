module.exports = (function() {
    var gpio = require('./relay').Relay;
    var PINONE = 16;
    var PINTWO = 18;
    var settings = require('../config');
    var moment = require('moment')

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

    function lightController() {
        var time = moment().format();

        if (timeFilter(settings.config.lightOn) <= time && time < timeFilter(settings.config.offTime)) {
            ON(); //between7
        } else {
            OFF(); //notBetween7
        }

        setTimeout(lightController, 1000);
    }

    function ON() {
        gpio(PINONE, false);
        gpio(PINTWO, false);
    }

    function OFF() {
        gpio(PINONE, true);
        gpio(PINTWO, true);
    }

    lightController();
})();