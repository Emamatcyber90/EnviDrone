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
  var socket = require('./socketio');

  var cozirDriver = require('./cozirDriver');
  var sensor = new cozirDriver({
    "port": "/dev/ttyAMA0",
    "feedId": "Drone",
    "cozirPollInterval": 1
  });

  var FanController = require('./FanController');
  var HumidityController = require('./HumidityController');

  function sensorHandler(){
    sensor.on('data', function(feedId, objType, data){
      console.log(feedId, objType, data);

      switch(objType){
        case "t":
          socket.emit('temp', { temp: data["temperature"]});
          break;
        case "h":
          socket.emit('humidity', { humidity: data["humidity"]});
          HumidityController(data);
          break;
        case "co2":
          socket.emit('carbon', { carbon: data["co2"]});
          coController(data);
          break;
      }
    });
    
    sensor.start();
  }


  function coController(data){
    var hour = moment(new Date()).format('HH');

    if(!hour >= settings.config.lightOn || !hour <= settings.config.lightOff){
      if(data["co2"] <= settings.config.carbon && data["co2"] != 0){
        coON();
      }else{
        coOFF();
      }
      FanController.off();
    }else{
      if(data["co2"] >= 500){
        coOFF();
        FanController.on();
      }
    }

  }

  function coON(){
    gpio(PIN, false);
  }

  function coOFF(){
    gpio(PIN, true);
  }

  sensorHandler();
})();