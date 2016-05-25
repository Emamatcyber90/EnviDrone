var settings = require('../config');

function announce(){
  setTimeout(function(){
    console.log('ID:',UUID);
    announce();
  }, 10000);
}

announce();

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