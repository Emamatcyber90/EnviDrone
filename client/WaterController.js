module.exports = (function(){
  var gpio = require('./relay').Relay;
  var settings = require('../config');
  var PIN = 11;

  var waterON = function(){
    gpio(PIN, false);
  }

  var waterOFF = function(){
    gpio(PIN, true);
  }

  var Start = function(){
    waterON();

    setTimeout(function(){
      waterOFF();
      TimerOn();
    }, settings.waterDuration * 1000);
  }

  var TimerOn = function(){
    setTimeout(function(){
      Start();
    }, settings.waterCycle * 60000);
  }

  TimerOn();
})();