module.exports = (function() {
  var gpio = require('./relay').Relay;
  var PINONE = 16;
  var PINTWO = 18;
  var moment = require('moment');
  var settings = require('../config');

  function lightController() {
    var hour = moment(new Date()).format('HH');

    if (!hour >= settings.config.lightOn || !hour <= settings.config.lightOff) {
      ON();
    } else {
      OFF();
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

  return lightController;
})();
