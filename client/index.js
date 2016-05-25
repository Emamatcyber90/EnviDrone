var settings = require('../config');

function Init(){
  console.log('All systems ready, intiiating controllers.');

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