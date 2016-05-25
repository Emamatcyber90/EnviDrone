var settings = require('../config');

function Init(){
  /*
  Initiate Carbon & Humidity System
   */
  var CarbonController = require('./CarbonController');

  /*
  Initiate Watering System 
   */
  var WaterController = require('./WaterController');

}

/*
Initiate GPIO ports
 */
var gpioReady = require('./relay').Init;

gpioReady(Init);