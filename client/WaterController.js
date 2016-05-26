module.exports = (function(){
  var gpio = require('./relay').Relay;
  var settings = require('../config');
  var PIN = 11;
  var timerOff;
  var timerOn;

  var waterON = function(){
    gpio(PIN, false);
  }

  var waterOff = function(){
    gpio(PIN, true);
  }

  var clearTimers = function(){
    if(timerOff) clearTimeout(timerOff);
    if(timerOn) clearTimeout(timerOn);

    TimerOn();
  }

  var Start = function(){
    waterON();

    timerOff = setTimeout(function(){
      waterOff();
      TimerOn();
    }, settings.waterDuration * 1000);
  }

  var TimerOn = function(){
    timerOn = setTimeout(function(){
      Start();
    }, settings.waterCycle * 60000);
  }

  TimerOn();

  return {
    reset: clearTimers
  }
})();