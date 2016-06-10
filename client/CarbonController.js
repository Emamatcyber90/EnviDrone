/*
  carbon = 800
  timeFrom 20
  timeTo 7
  maxCarbon 1500 //Lights off time
*/
module.exports = (function(){
  var gpio = require('./relay').Relay;
  var PIN = 7;
  var moment = require('moment');
  var settings = require('../config');

  function coController(data){
    var hour = moment(new Date()).format('HH');

    if(!hour >= settings.config.lightOn || !hour <= settings.config.lightOff){
      if(data <= settings.config.carbon && data != 0){
        coON();
      }else{
        coOFF();
      }
      
      FanController.off();
    }else{
      if(data >= 500 ){
        FanController.on();
      }

      coOFF();
    }
  }

  function coON(){
    gpio(PIN, false);
  }

  function coOFF(){
    gpio(PIN, true);
  }

  return coController;
})();