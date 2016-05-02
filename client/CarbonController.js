/*
  carbon = 800
  timeFrom 20
  timeTo 7  
*/
module.exports = function(carbon, timeFrom, timeTo){
  var gpioInit = require('./relay').Init;
  var gpio = require('./relay').Relay;
  var moment = require('moment');

  gpioInit(sensorHandler);

  var cozirDriver = require('./cozirDriver');
  var sensor = new cozirDriver({
    "port": "/dev/ttyAMA0",
    "feedId": "Drone",
    "cozirPollInterval": 1
  });

  function sensorHandler(){
    sensor.on('data', function(feedId, objType, data){
      console.log(feedId, objType, data);

      switch(objType){
        case "t":
          break;
        case "h":
          break;
        case "co2":
          coController(data);
          break;
      }
    });
    
    sensor.start();
  }

  function coController(data){
    var hour = moment(new Date()).format('HH');

    if(data["co2"] <= carbon){
      if(!hour >= timeFrom || !hour <= timeTo){
        coON();
      }  
    }else{
      coOFF();
    }
  }

  function coON(){
    gpio(7, false);
  }

  function coOFF(){
    gpio(7, true);
  }
};